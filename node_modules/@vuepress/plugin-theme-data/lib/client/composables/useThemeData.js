import { themeData as themeDataRaw } from '@internal/themeData';
import { ref } from 'vue';
export const themeData = ref(themeDataRaw);
export const useThemeData = () => themeData;
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
    __VUE_HMR_RUNTIME__.updateThemeData = (data) => {
        themeData.value = data;
    };
}
