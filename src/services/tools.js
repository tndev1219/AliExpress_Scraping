const Apify = require('apify');
const HttpsProxyAgent = require('https-proxy-agent');
const routes = require('./routes');

const {
    utils: {
        log
    },
} = Apify;

// Create router
exports.createRouter = (globalContext) => {
    return async (routeName, requestContext) => {
        const route = routes[routeName];

        if (!route) throw new Error(`No route for name: ${routeName}`);

        log.debug(`Invoking route: ${routeName}`);

        return route(requestContext, globalContext);
    };
};

// Creates proxy URL with user input
const createProxyUrl = async (userInput) => {
    const {
        apifyProxyGroups,
        useApifyProxy,
        proxyUrls
    } = userInput.proxy;
    if (proxyUrls && proxyUrls.length > 0) {
        return proxyUrls[0];
    }
    if (useApifyProxy) {
        return `http://${apifyProxyGroups ? apifyProxyGroups.join(',') : 'auto'}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    }

    return '';
};

// Returns an axios instance with proxy and timeout options set
exports.getProxyAgent = async (userInput) => {
    const url = await createProxyUrl(userInput);
    return url ? new HttpsProxyAgent(url) : null;
};


// Detects url and map them to routes
exports.mapStartUrls = (startUrls) => {
    return startUrls.map((startUrl) => {
        const link = startUrl.url;
        let routeType = '';
        let userData = {};

        if (link.includes('/item/')) {
            routeType = 'PRODUCT';
            userData = {
                baseUrl: link,
                productId: link.split('/item/')[1].split('.htm')[0],
            };
        } else {
            throw new Error('Wrong URL provided to Start URLS!');
        }

        if (startUrl.url.split('https://')[1].split('.aliexpress')[0] === 'www') {
            userData.language = 'EN';
        } else {
            userData.language = startUrl.language;
        }

        userData.label = routeType;

        return {
            uniqueKey: link,
            url: link,
            userData,
        };
    });
};
