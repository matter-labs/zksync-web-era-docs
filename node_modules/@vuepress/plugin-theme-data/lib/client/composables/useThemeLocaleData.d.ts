import type { RouteLocale } from '@vuepress/client';
import type { ComputedRef, InjectionKey } from 'vue';
import type { ThemeData } from '../../shared/index.js';
export type ThemeLocaleDataRef<T extends ThemeData = ThemeData> = ComputedRef<T>;
export declare const themeLocaleDataSymbol: InjectionKey<ThemeLocaleDataRef>;
export declare const useThemeLocaleData: <T extends ThemeData<import("@vuepress/shared").LocaleData> = ThemeData<import("@vuepress/shared").LocaleData>>() => ThemeLocaleDataRef<T>;
/**
 * Merge the locales fields to the root fields
 * according to the route path
 */
export declare const resolveThemeLocaleData: (theme: ThemeData, routeLocale: RouteLocale) => ThemeData;
