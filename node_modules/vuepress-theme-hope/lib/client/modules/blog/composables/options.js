import { computed } from "vue";
import { useThemeData, useThemeLocaleData, } from "@theme-hope/composables/index";
export const useBlogOptions = () => {
    const themeData = useThemeData();
    const themeLocale = useThemeLocaleData();
    return computed(() => ({
        ...themeData.value.blog,
        ...themeLocale.value.blog,
    }));
};
//# sourceMappingURL=options.js.map