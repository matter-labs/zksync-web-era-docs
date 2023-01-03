import { isLinkExternal, isString } from "@vuepress/shared";
import { computed } from "vue";
import { useAutoLink, useThemeLocaleData } from "@theme-hope/composables/index";
export const resolveNavbarItem = (item, prefix = "") => {
    if (isString(item))
        return useAutoLink(`${prefix}${item}`);
    if ("children" in item)
        return {
            ...item,
            ...(item.link && !isLinkExternal(item.link)
                ? useAutoLink(`${prefix}${item.link}`)
                : {}),
            children: item.children.map((child) => resolveNavbarItem(child, `${prefix}${item.prefix || ""}`)),
        };
    return {
        ...item,
        link: isLinkExternal(item.link)
            ? item.link
            : useAutoLink(`${prefix}${item.link}`).link,
    };
};
export const useNavbarConfig = () => computed(() => (useThemeLocaleData().value.navbar || []).map((item) => resolveNavbarItem(item)));
//# sourceMappingURL=navbarConfig.js.map