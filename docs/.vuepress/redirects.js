/**
 * This file contains the dynamic redirect (browser based) used by zkSync docs.
 * The SPA's router will sense the need to redirect the user, see enhanceApp.js.
 * The JSON object contains one type of object, exact. enhanceApp.js
 * will route to the first one it finds checking exact types.
 */

const unsortedRedirects = [
{
    from: `/dev/zksync-v2/aa.html`,
    to: `/dev/developer-guides/aa.html`,
    exact: true,
},

];

export const redirects = unsortedRedirects.sort((first, second) => {
if (first.from.length > second.from.length) {
    return -1;
}

if (first.from.length < second.from.length) {
    return 1;
}

return 0;
});