import { inject } from 'vue';
export const themeLocaleDataSymbol = Symbol(__VUEPRESS_DEV__ ? 'themeLocaleData' : '');
export const useThemeLocaleData = () => {
    const themeLocaleData = inject(themeLocaleDataSymbol);
    if (!themeLocaleData) {
        throw new Error('useThemeLocaleData() is called without provider.');
    }
    return themeLocaleData;
};
/**
 * Merge the locales fields to the root fields
 * according to the route path
 */
export const resolveThemeLocaleData = (theme, routeLocale) => ({
    ...theme,
    ...theme.locales?.[routeLocale],
});
