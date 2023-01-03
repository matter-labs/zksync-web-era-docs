import type { Plugin } from '@vuepress/core';
/**
 * Options of @vuepress/plugin-palette
 */
export interface PalettePluginOptions {
    /**
     * Preset of the palette
     *
     * @default 'css'
     */
    preset?: 'css' | 'sass' | 'less' | 'stylus';
    /**
     * File path of the user palette file, relative to source directory
     */
    userPaletteFile?: string;
    /**
     * File path of the generated palette temp file, relative to temp directory
     */
    tempPaletteFile?: string;
    /**
     * File path of the user style file, relative to source directory
     */
    userStyleFile?: string;
    /**
     * File path of the generated style temp file, relative to temp directory
     */
    tempStyleFile?: string;
    /**
     * Function to generate import code
     */
    importCode?: (filePath: string) => string;
}
export declare const palettePlugin: ({ preset, userPaletteFile, tempPaletteFile, userStyleFile, tempStyleFile, importCode, }?: PalettePluginOptions) => Plugin;
