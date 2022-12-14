const { redirects } = require('./redirects.js');

function getRedirectRoute(to) {
const exactRedirect = redirects
    .filter((item) => item.exact)
    .find((item) => to.path === item.from && item.to);

if (exactRedirect) {
    return { ...to, path: exactRedirect.to, replace: true };
}

return undefined;
}

/// store variables for global use.
export let globalStore = {};

let spaLoaded = false;
export default ({ Vue, router }) => {
    Vue.config.ignoredElements = [
        // Use a `RegExp` to ignore all elements that start with "toc-"
        // 2.5+ only
        /^toc-/
    ];
router.beforeEach((to, from, next) => {
    // Checking the startup route for the SPA to see if it
    // exists in the SPA router objects.
    const route = router.options.routes.find((obj) => obj.path == to.path);

    if (!spaLoaded && !route) {
    // An external inbound link will cause the SPA to reload.
    // Therefore after loading the SPA there is no need to run the
    // redirect process again on each internal link.
    spaLoaded = true;

    const redirect = getRedirectRoute(to);

    if (redirect) {
        redirect.path = redirect.path.replace('//', '/');

        // I use router.replace, instead of `router.push` here, because it doesn't mess with the history stack.
        router.replace(redirect);
    }
    }
    next();
});
};