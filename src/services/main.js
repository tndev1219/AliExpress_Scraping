const Apify = require('apify');
const Promise = require('bluebird');
const tools = require('./tools');
require('dotenv').config();

const {
    utils: { log },
} = Apify;

// Create crawler
const callApifyMain = (url) => {

    Apify.main(async () => {

        log.info('PHASE -- STARTING ACTOR.');

        var userInput = await Apify.getInput();
        userInput = Object.assign({}, userInput, {
            "startUrls": [
                { "url": url }
            ]
        })

        log.info('ACTOR OPTIONS: -- ', userInput);

        // Create request queue
        const requestQueue = await Apify.openRequestQueue();

        // Fetch start urls
        const { startUrls } = userInput;

        if (startUrls.length === 0) {
            throw new Error('Start URLs must be defined');
        } else {
            const mappedStartUrls = tools.mapStartUrls(startUrls);

            // Initialize first requests
            for (const mappedStartUrl of mappedStartUrls) {

                await requestQueue.addRequest({
                    ...mappedStartUrl,
                    headers: { 
                        Connection: 'keep-alive',
                        'User-Agent': Apify.utils.getRandomUserAgent()
                    }
                });
            }
        }

        const agent = await tools.getProxyAgent(userInput);

        // Create route
        const router = tools.createRouter({ requestQueue });

        log.info('PHASE -- SETTING UP CRAWLER.', requestQueue);

        const cheerioCrawler = new Apify.CheerioCrawler({
            requestQueue,
            handlePageTimeoutSecs: 99999,
            maxRequestRetries: 10,
            requestTimeoutSecs: 300,
            maxConcurrency: userInput.maxConcurrency,
            maxRequestsPerCrawl: 100,
            ignoreSslErrors: true,
            // Proxy options
            ...(userInput.proxy.useApifyProxy ? { useApifyProxy: userInput.proxy.useApifyProxy } : {}),
            ...(userInput.proxy.apifyProxyGroups ? { apifyProxyGroups: userInput.proxy.apifyProxyGroups } : {}),
            ...(userInput.proxy.proxyUrls ? { proxyUrls: userInput.proxy.proxyUrls } : {}),
            ...(process.env.PROXY_URL ? { proxyUrls: process.env.PROXY_URL } : {}),         
            handlePageFunction: async (context) => {
                const { request, response, $ } = context;

                log.debug(`CRAWLER -- Processing ${request.url}`);

                // Status code check
                if (!response || response.statusCode !== 200
                    || request.url.includes('login.')
                    || $('body').data('spm') === 'buyerloginandregister') {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }
                
                if (request.userData.label !== 'DESCRIPTION' && !$('script').text().includes('runParams')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                if ($('html').text().includes('/_____tmd_____/punish')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                // prepare dataScript to get product info
                var dataScript = $($('script').filter((i, script) => $(script).html().includes('runParams')).get()[0]).html();
                dataScript = dataScript.split('window.runParams = ')[1].split('var GaData')[0].replace(/;/g, '');
                context.dataScript = dataScript;

                // Random delay
                await Promise.delay(Math.random() * 10000);

                // Add user input to context
                context.userInput = userInput;
                context.agent = agent;

                // Redirect to route
                await router(request.userData.label, context);
            },
            handleFailedRequestFunction: async (context) => {
                const { request, error } = context;
                log.info('PHASE -- CRAWLER GOT ERROR:', error.message);
            }
        });

        const puppeteerCrawler = new Apify.PuppeteerCrawler({
            requestQueue,
            handlePageTimeoutSecs: 99999,
            maxRequestRetries: 10,
            gotoTimeoutSecs: 50,
            maxRequestsPerCrawl: 10,
            maxConcurrency: 10,
            launchPuppeteerOptions: {                
                useChrome: true,
                ...(userInput.proxy.useApifyProxy ? { useApifyProxy: userInput.proxy.useApifyProxy } : {}),
                ...(userInput.proxy.apifyProxyGroups ? { apifyProxyGroups: userInput.proxy.apifyProxyGroups } : {}),
                stealth: true
            },
            puppeteerPoolOptions: {
                ...(process.env.PROXY_URL ? { proxyUrls: process.env.PROXY_URL } : {}),                
                maxOpenPagesPerInstance: 10
            },
            handlePageFunction: async (context) => {
                const { request, response, page, puppeteerPool, autoscaledPool, session } = context;
                let content = await page.content();

                log.debug(`CRAWLER -- Processing ${request.url}`);

                // Status code check
                if (!response || response._status !== 200
                    || request.url.includes('login.')
                    || content.includes('data-spm="buyerloginandregister"')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }
                
                if (request.userData.label !== 'DESCRIPTION' && !content.includes('runParams')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                if (content.includes('/_____tmd_____/punish')) {
                    throw new Error(`We got blocked by target on ${request.url}`);
                }

                // prepare dataScript to get product info
                const dataScript = content.split('window.runParams = ')[1].split('var GaData')[0].replace(/;/g, '');
                context.dataScript = dataScript;

                // Random delay
                await Promise.delay(Math.random() * 10000);

                // Add user input to context
                context.userInput = userInput;
                context.agent = agent;

                // Redirect to route
                await router(request.userData.label, context);
            },
            handleFailedRequestFunction: async (context) => {
                const { request, error } = context;
                log.info('PHASE -- CRAWLER GOT ERROR:', error.message);
            }
        });

        log.info('PHASE -- STARTING CRAWLER.');

        process.env.USE_CHEERIO === 'TRUE' ? await cheerioCrawler.run() : await puppeteerCrawler.run();

        log.info('PHASE -- ACTOR FINISHED.');
        await requestQueue.drop();
    });
}

module.exports = callApifyMain