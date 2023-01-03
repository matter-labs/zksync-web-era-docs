import type { App } from '@vuepress/core';
import type { PalettePluginOptions } from './palettePlugin.js';
export declare const preparePaletteFile: (app: App, { userPaletteFile, tempPaletteFile, importCode, }: Pick<Required<PalettePluginOptions>, 'userPaletteFile' | 'tempPaletteFile' | 'importCode'>) => Promise<string>;
