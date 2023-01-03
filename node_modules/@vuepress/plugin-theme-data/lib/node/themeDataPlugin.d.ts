import type { Plugin } from '@vuepress/core';
import type { ThemeData } from '../shared/index.js';
/**
 * Options of @vuepress/plugin-theme-data
 */
export interface ThemeDataPluginOptions {
    /**
     * Theme data to be used in client side
     */
    themeData: ThemeData;
}
export declare const themeDataPlugin: ({ themeData, }: ThemeDataPluginOptions) => Plugin;
