import { computed } from "vue";
import { useThemeData } from "@theme-hope/composables/index";
export const useEncryptData = () => {
    const themeData = useThemeData();
    return computed(() => themeData.value.encrypt || {});
};
//# sourceMappingURL=utils.js.map