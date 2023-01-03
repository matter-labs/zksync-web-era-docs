import { Bundler } from '@vuepress/core';
import { Options } from '@vitejs/plugin-vue';
import { InlineConfig } from 'vite';

/**
 * Options for bundler-vite
 */
interface ViteBundlerOptions {
    viteOptions?: InlineConfig;
    vuePluginOptions?: Options;
}

declare const viteBundler: (options?: ViteBundlerOptions) => Bundler;

export { ViteBundlerOptions, viteBundler as default, viteBundler };
