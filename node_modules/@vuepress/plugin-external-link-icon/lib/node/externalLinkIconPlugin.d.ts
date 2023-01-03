import type { Plugin } from '@vuepress/core';
import type { ExternalLinkIconLocales } from '../shared/index.js';
/**
 * Options for @vuepress/plugin-external-link-icon
 */
export type ExternalLinkIconPluginOptions = {
    /**
     * Locales config for external link icon
     */
    locales?: ExternalLinkIconLocales;
};
export declare const externalLinkIconPlugin: ({ locales, }?: ExternalLinkIconPluginOptions) => Plugin;
