import type { App } from '@vuepress/core';
import type { PalettePluginOptions } from './palettePlugin.js';
export declare const prepareStyleFile: (app: App, { userStyleFile, tempStyleFile, importCode, }: Pick<Required<PalettePluginOptions>, 'userStyleFile' | 'tempStyleFile' | 'importCode'>) => Promise<string>;
