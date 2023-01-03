import { useEventListener } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useThemeData } from "./themeData.js";
export const useMobile = () => {
    const themeData = useThemeData();
    const isMobile = ref(false);
    const mobileHandler = () => {
        isMobile.value =
            window.innerWidth < (themeData.value.mobileBreakPoint || 719);
    };
    onMounted(() => {
        mobileHandler();
        useEventListener("resize", mobileHandler, false);
        useEventListener("orientationchange", mobileHandler, false);
    });
    return isMobile;
};
//# sourceMappingURL=mobile.js.map