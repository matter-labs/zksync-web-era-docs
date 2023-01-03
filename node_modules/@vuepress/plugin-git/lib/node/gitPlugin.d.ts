import type { Plugin } from '@vuepress/core';
/**
 * Options of @vuepress/plugin-git
 */
export interface GitPluginOptions {
    /**
     * Whether to get the created time of a page
     */
    createdTime?: boolean;
    /**
     * Whether to get the updated time of a page
     */
    updatedTime?: boolean;
    /**
     * Whether to get the contributors of a page
     */
    contributors?: boolean;
}
export declare const gitPlugin: ({ createdTime, updatedTime, contributors }?: GitPluginOptions) => Plugin;
