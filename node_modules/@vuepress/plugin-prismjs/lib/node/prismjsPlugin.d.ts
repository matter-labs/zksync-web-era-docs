import type { Plugin } from '@vuepress/core';
/**
 * Options of @vuepress/plugin-prismjs
 */
export interface PrismjsPluginOptions {
    /**
     * Languages to preload
     *
     * Workaround for prismjs language reloading issue
     *
     * @default ['markdown', 'jsdoc', 'yaml']
     * @see https://github.com/PrismJS/prism/issues/2716
     */
    preloadLanguages?: string[];
}
export declare const prismjsPlugin: ({ preloadLanguages, }?: PrismjsPluginOptions) => Plugin;
