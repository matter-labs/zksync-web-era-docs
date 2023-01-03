import type { Ref } from 'vue';
import type { ThemeData } from '../../shared/index.js';
export type ThemeDataRef<T extends ThemeData = ThemeData> = Ref<T>;
export declare const themeData: ThemeDataRef;
export declare const useThemeData: <T extends ThemeData<import("@vuepress/shared").LocaleData> = ThemeData<import("@vuepress/shared").LocaleData>>() => ThemeDataRef<T>;
