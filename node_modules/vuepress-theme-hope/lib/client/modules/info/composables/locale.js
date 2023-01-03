import { computed } from "vue";
import { useThemeLocaleData } from "@theme-hope/composables/index";
export const useMetaLocale = () => {
    const themeLocale = useThemeLocaleData();
    return computed(() => themeLocale.value.metaLocales);
};
//# sourceMappingURL=locale.js.map