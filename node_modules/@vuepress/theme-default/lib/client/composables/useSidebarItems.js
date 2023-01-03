import { usePageData, usePageFrontmatter } from '@vuepress/client';
import { isArray, isPlainObject, isString, resolveLocalePath, } from '@vuepress/shared';
import { computed, inject, provide } from 'vue';
import { useRoute } from 'vue-router';
import { useNavLink } from './useNavLink.js';
import { useThemeLocaleData } from './useThemeData.js';
export const sidebarItemsSymbol = Symbol('sidebarItems');
/**
 * Inject sidebar items global computed
 */
export const useSidebarItems = () => {
    const sidebarItems = inject(sidebarItemsSymbol);
    if (!sidebarItems) {
        throw new Error('useSidebarItems() is called without provider.');
    }
    return sidebarItems;
};
/**
 * Create sidebar items ref and provide as global computed in setup
 */
export const setupSidebarItems = () => {
    const themeLocale = useThemeLocaleData();
    const frontmatter = usePageFrontmatter();
    const sidebarItems = computed(() => resolveSidebarItems(frontmatter.value, themeLocale.value));
    provide(sidebarItemsSymbol, sidebarItems);
};
/**
 * Resolve sidebar items global computed
 *
 * It should only be resolved and provided once
 */
export const resolveSidebarItems = (frontmatter, themeLocale) => {
    // get sidebar config from frontmatter > theme data
    const sidebarConfig = frontmatter.sidebar ?? themeLocale.sidebar ?? 'auto';
    const sidebarDepth = frontmatter.sidebarDepth ?? themeLocale.sidebarDepth ?? 2;
    // resolve sidebar items according to the config
    if (frontmatter.home || sidebarConfig === false) {
        return [];
    }
    if (sidebarConfig === 'auto') {
        return resolveAutoSidebarItems(sidebarDepth);
    }
    if (isArray(sidebarConfig)) {
        return resolveArraySidebarItems(sidebarConfig, sidebarDepth);
    }
    if (isPlainObject(sidebarConfig)) {
        return resolveMultiSidebarItems(sidebarConfig, sidebarDepth);
    }
    return [];
};
/**
 * Util to transform page header to sidebar item
 */
export const headerToSidebarItem = (header, sidebarDepth) => ({
    text: header.title,
    link: header.link,
    children: headersToSidebarItemChildren(header.children, sidebarDepth),
});
export const headersToSidebarItemChildren = (headers, sidebarDepth) => sidebarDepth > 0
    ? headers.map((header) => headerToSidebarItem(header, sidebarDepth - 1))
    : [];
/**
 * Resolve sidebar items if the config is `auto`
 */
export const resolveAutoSidebarItems = (sidebarDepth) => {
    const page = usePageData();
    return [
        {
            text: page.value.title,
            children: headersToSidebarItemChildren(page.value.headers, sidebarDepth),
        },
    ];
};
/**
 * Resolve sidebar items if the config is an array
 */
export const resolveArraySidebarItems = (sidebarConfig, sidebarDepth) => {
    const route = useRoute();
    const page = usePageData();
    const handleChildItem = (item) => {
        let childItem;
        if (isString(item)) {
            childItem = useNavLink(item);
        }
        else {
            childItem = item;
        }
        if (childItem.children) {
            return {
                ...childItem,
                children: childItem.children.map((item) => handleChildItem(item)),
            };
        }
        // if the sidebar item is current page and children is not set
        // use headers of current page as children
        if (childItem.link === route.path) {
            // skip h1 header
            const headers = page.value.headers[0]?.level === 1
                ? page.value.headers[0].children
                : page.value.headers;
            return {
                ...childItem,
                children: headersToSidebarItemChildren(headers, sidebarDepth),
            };
        }
        return childItem;
    };
    return sidebarConfig.map((item) => handleChildItem(item));
};
/**
 * Resolve sidebar items if the config is a key -> value (path-prefix -> array) object
 */
export const resolveMultiSidebarItems = (sidebarConfig, sidebarDepth) => {
    const route = useRoute();
    const sidebarPath = resolveLocalePath(sidebarConfig, route.path);
    const matchedSidebarConfig = sidebarConfig[sidebarPath] ?? [];
    return resolveArraySidebarItems(matchedSidebarConfig, sidebarDepth);
};
