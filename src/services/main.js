const Apify = require('apify');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const tools = require('./tools');
require('dotenv').config();

const {
    utils: {
        log
    },
} = Apify;

// Create crawler
const callApifyMain = (urls) => {

    Apify.main(async () => {

        const sourceUrls = urls.map((url) => ({
            "url": url.startUrl,
            "language": url.language
        }));

        log.info('PHASE -- STARTING ACTOR.');

        var userInput = await Apify.getInput();
        userInput = Object.assign({}, userInput, {
            "startUrls": sourceUrls
        });

        log.info('ACTOR OPTIONS: -- ', userInput);

        // Create request queue
        const requestQueue = await Apify.openRequestQueue();

        // Fetch start urls
        const {
            startUrls
        } = userInput;

        var mappedStartUrls = [];

        if (startUrls.length === 0) {
            throw new Error('Start URLs must be defined');
        } else {
            mappedStartUrls = tools.mapStartUrls(startUrls);

            // Initialize first requests
            for (const mappedStartUrl of mappedStartUrls) {
                await requestQueue.addRequest({
                    ...mappedStartUrl
                });
            }
        }

        const agent = await tools.getProxyAgent(userInput);

        // Create route
        const router = tools.createRouter({
            requestQueue
        });

        log.info('PHASE -- SETTING UP CRAWLER.', requestQueue);

        const cheerioCrawler = new Apify.CheerioCrawler({
            requestQueue,
            handlePageTimeoutSecs: 9999,
            // Maximum number of requests
            maxRequestRetries: 5,
            requestTimeoutSecs: 20,
            maxConcurrency: userInput.maxConcurrency,
            maxRequestsPerCrawl: 500,
            ignoreSslErrors: true,
            // Proxy options
            ...(userInput.proxy.useApifyProxy ? {
                useApifyProxy: userInput.proxy.useApifyProxy
            } : {}),
            ...(userInput.proxy.apifyProxyGroups ? {
                apifyProxyGroups: userInput.proxy.apifyProxyGroups
            } : {}),
            ...(userInput.proxy.proxyUrls ? {
                proxyUrls: userInput.proxy.proxyUrls
            } : {}),
            prepareRequestFunction: ({ request }) => {
                request.headers = {
                    Connection: 'keep-alive',
                    'User-Agent': Apify.utils.getRandomUserAgent(),
                };
                return request;
            },
            handlePageFunction: async (context) => {
                console.log('----------------------------------------------------------------------------');
                const {
                    request,
                    response,
                    $
                } = context;

                log.debug(`CRAWLER -- Processing ${request.url}`);

                // Status code check
                if (!response || response.statusCode !== 200 ||
                    request.url.includes('login.') ||
                    $('body').data('spm') === 'buyerloginandregister') {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                if (request.userData.label !== 'DESCRIPTION' && !$('script').text().includes('runParams')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                if ($('html').text().includes('/_____tmd_____/punish')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                // prepare dataScript to get product info
                context.dataScript = $($('script').filter((i, script) => $(script).html().includes('runParams')).get()[0]).html().split('window.runParams = ')[1].split('var GaData')[0].replace(/;/g, '');

                // Random delay
                await Promise.delay(Math.random() * 10000);

                // Add user input to context
                context.userInput = userInput;
                context.agent = agent;

                // Redirect to route
                await router(request.userData.label, context);
            },
            handleFailedRequestFunction: async (context) => {
                const {
                    request,
                    error
                } = context;

                // Add user input to context
                context.userInput = userInput;
                context.agent = agent;

                context.dataScript = null;

                await router(request.userData.label, context);
            }
        });

        const puppeteerCrawler = async (mappedStartUrls) => {
            const browser = await puppeteer.launch({
                headless: false,
                slowMo: 100,
                args: [ `--proxy-server=${userInput.proxy.proxyUrls[0]}` ]
            });

            const page = await browser.newPage();

            for (let mappedStartUrl of mappedStartUrls) {
                let response = '';

                try {
                    response = await page.goto(mappedStartUrl.url, {
                        waitUntil: 'networkidle2',
                        timeout: 300 * 1000
                    });
                } catch (err) {
                    let context = {};
                    let request = {};

                    context.request = request;
                    context.request.userData = mappedStartUrl.userData;
                    context.request.url = mappedStartUrl.url;
                    context.dataScript = null;
                    await router(mappedStartUrl.userData.label, context);
                } finally {
                    let context = {};
                    let request = {};
                    let content = await page.content();
                    let requestUrl = await page.url();

                    context.request = request;
                    context.request.userData = mappedStartUrl.userData;
                    context.request.url = mappedStartUrl.url;
                    
                    // Add user input to context
                    context.userInput = userInput;
                    context.agent = agent;

                    log.debug(`CRAWLER -- Processing ${requestUrl}`);

                    if (!response || response.status() !== 200 || requestUrl.includes('login.') || !content.includes('data-spm="detail"')) {
                        console.log(`Error: We got blocked by target on ${requestUrl}`);
                        context.dataScript = null;
                        await router(mappedStartUrl.userData.label, context);
                        continue;
                    }

                    if (mappedStartUrl.userData.label !== 'DESCRIPTION' && !content.includes('runParams')) {
                        console.log(`Error: We got blocked by target on ${requestUrl}`);
                        context.dataScript = null;
                        await router(mappedStartUrl.userData.label, context);
                        continue;
                    }

                    if (content.includes('/_____tmd_____/punish')) {
                        console.log(`Error: We got blocked by target on ${requestUrl}`);
                        context.dataScript = null;
                        await router(mappedStartUrl.userData.label, context);
                        continue;
                    }
                    
                    // prepare dataScript to get product info
                    context.dataScript = content.split('window.runParams = ')[1].split('var GaData')[0].replace(/;/g, '');
                    
                    // Random delay
                    await Promise.delay(Math.random() * 10000);
                    
                    // Redirect to route
                    await router(mappedStartUrl.userData.label, context);
                }
            }

            await browser.close();
        };

        log.info('PHASE -- STARTING CRAWLER.');

        process.env.USE_CHEERIO === 'TRUE' ? await cheerioCrawler.run() : await puppeteerCrawler(mappedStartUrls);

        log.info('PHASE -- ACTOR FINISHED.');
        await requestQueue.drop();
    });
};

module.exports = callApifyMain;
