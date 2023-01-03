import type { InjectionKey, WritableComputedRef } from 'vue';
export type DarkModeRef = WritableComputedRef<boolean>;
export declare const darkModeSymbol: InjectionKey<DarkModeRef>;
/**
 * Inject dark mode global computed
 */
export declare const useDarkMode: () => DarkModeRef;
/**
 * Create dark mode ref and provide as global computed in setup
 */
export declare const setupDarkMode: () => void;
export declare const updateHtmlDarkClass: (isDarkMode: DarkModeRef) => void;
