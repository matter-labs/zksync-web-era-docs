import type { Plugin } from '@vuepress/core';
import type { ZoomOptions } from 'medium-zoom';
/**
 * Options for @vuepress/plugin-medium-zoom
 */
export interface MediumZoomPluginOptions {
    /**
     * Selector of zoomable images
     *
     * @default ':not(a) > img'
     */
    selector?: string;
    /**
     * Delay in milliseconds
     *
     * @default 500
     */
    delay?: number;
    /**
     * Options for medium-zoom
     *
     * @see https://github.com/francoischalifour/medium-zoom#options
     */
    zoomOptions?: ZoomOptions;
}
export declare const mediumZoomPlugin: ({ selector, zoomOptions, delay, }?: MediumZoomPluginOptions) => Plugin;
