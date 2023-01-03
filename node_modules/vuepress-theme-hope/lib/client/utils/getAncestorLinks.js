import { removeEndingSlash } from "@vuepress/shared";
export const getAncestorLinks = (route, routeLocale) => {
    const routePaths = route.path.replace(routeLocale, "/").split("/");
    const links = [];
    let link = removeEndingSlash(routeLocale);
    // generate links
    routePaths.forEach((element, index) => {
        if (index !== routePaths.length - 1) {
            link += `${element}/`;
            links.push(link);
        }
        else if (element !== "") {
            link += element;
            links.push(link);
        }
    });
    return links;
};
//# sourceMappingURL=getAncestorLinks.js.map