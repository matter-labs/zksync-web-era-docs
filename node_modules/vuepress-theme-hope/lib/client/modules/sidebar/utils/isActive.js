import { isActiveLink } from "vuepress-shared/client";
export const isActiveSidebarItem = (route, item, exact = false) => {
    if ("activeMatch" in item)
        return new RegExp(item.activeMatch).test(route.path);
    if (isActiveLink(route, item.link))
        return true;
    if (item.children && !exact)
        return item.children.some((child) => isActiveSidebarItem(route, child));
    return false;
};
export const isMatchedSidebarItem = (route, item) => {
    if (item.type === "group")
        return (item.children.some((child) => {
            if (child.type === "group")
                return isMatchedSidebarItem(route, child);
            return child.type === "page" && isActiveSidebarItem(route, child, true);
        }) ||
            ("prefix" in item && isActiveLink(route, item.prefix)));
    return false;
};
//# sourceMappingURL=isActive.js.map