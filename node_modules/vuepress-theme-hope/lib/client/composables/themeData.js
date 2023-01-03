import { useThemeData as _useThemeData, useThemeLocaleData as _useThemeLocaleData, } from "@vuepress/plugin-theme-data/client";
import { computed } from "vue";
import { getAuthor } from "vuepress-shared/client";
export const useThemeData = () => _useThemeData();
export const useThemeLocaleData = () => _useThemeLocaleData();
export const useThemeAuthor = () => {
    const themeLocale = useThemeLocaleData();
    return computed(() => getAuthor(themeLocale.value.author, false));
};
export const usePure = () => computed(() => Boolean(useThemeData().value.pure));
//# sourceMappingURL=themeData.js.map