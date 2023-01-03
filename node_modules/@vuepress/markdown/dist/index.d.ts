import { SfcPluginOptions } from '@mdit-vue/plugin-sfc';
export { MarkdownSfcBlocks, SfcPluginOptions, sfcPlugin } from '@mdit-vue/plugin-sfc';
import { MarkdownItEnv } from '@mdit-vue/types';
import { PageHeader, PageFrontmatter } from '@vuepress/shared';
import MarkdownIt, { PluginWithOptions } from 'markdown-it';
import { FrontmatterPluginOptions } from '@mdit-vue/plugin-frontmatter';
export { FrontmatterPluginOptions, frontmatterPlugin } from '@mdit-vue/plugin-frontmatter';
import { HeadersPluginOptions } from '@mdit-vue/plugin-headers';
export { HeadersPluginOptions, headersPlugin } from '@mdit-vue/plugin-headers';
import { TocPluginOptions } from '@mdit-vue/plugin-toc';
export { TocPluginOptions, tocPlugin } from '@mdit-vue/plugin-toc';
import anchorPlugin from 'markdown-it-anchor';
export { default as anchorPlugin } from 'markdown-it-anchor';
import emojiPlugin from 'markdown-it-emoji';
export { default as emojiPlugin } from 'markdown-it-emoji';
export { ComponentPluginOptions, componentPlugin } from '@mdit-vue/plugin-component';
export { titlePlugin } from '@mdit-vue/plugin-title';

type AnchorPluginOptions = anchorPlugin.AnchorOptions;

interface AssetsPluginOptions {
    /**
     * Prefix to add to relative assets links
     */
    relativePathPrefix?: string;
}
/**
 * Plugin to handle assets links
 */
declare const assetsPlugin: PluginWithOptions<AssetsPluginOptions>;

interface CodePluginOptions {
    /**
     * Enable highlight lines or not
     */
    highlightLines?: boolean;
    /**
     * Enable line numbers or not
     *
     * - A `boolean` value is to enable line numbers or not.
     * - A `number` value is the minimum number of lines to enable line numbers
     */
    lineNumbers?: boolean | number;
    /**
     * Wrap the `<pre>` tag with an extra `<div>` or not. Do not disable it unless you
     * understand what's it for
     *
     * - Required for `highlightLines`
     * - Required for `lineNumbers`
     * - Required for language display of default theme
     */
    preWrapper?: boolean;
    /**
     * Add `v-pre` directive or not
     */
    vPre?: {
        /**
         * Add `v-pre` directive to `<pre>` tag of code block or not
         */
        block?: boolean;
        /**
         * Add `v-pre` directive to `<code>` tag of inline code or not
         */
        inline?: boolean;
    };
}
/**
 * Code plugin
 */
declare const codePlugin: PluginWithOptions<CodePluginOptions>;

type EmojiPluginOptions = emojiPlugin.Options;

interface ImportCodePluginOptions {
    /**
     * A function to handle the import path
     */
    handleImportPath?: (str: string) => string;
}
declare const importCodePlugin: PluginWithOptions<ImportCodePluginOptions>;

interface LinksPluginOptions {
    /**
     * Tag for internal links
     *
     * @default 'RouterLink'
     */
    internalTag?: 'a' | 'RouterLink';
    /**
     * Additional attributes for external links
     *
     * @default
     * ```js
     * ({
     *   target: '_blank',
     *   rel: 'noopener noreferrer',
     * })
     * ```
     */
    externalAttrs?: Record<string, string>;
}
/**
 * Process links in markdown file
 *
 * - internal links: convert them into `<RouterLink>`
 * - external links: add extra attrs and external icon
 */
declare const linksPlugin: PluginWithOptions<LinksPluginOptions>;

type Markdown = MarkdownIt;

interface MarkdownOptions extends MarkdownIt.Options {
    anchor?: false | AnchorPluginOptions;
    assets?: false | AssetsPluginOptions;
    code?: false | CodePluginOptions;
    component?: false;
    emoji?: false | EmojiPluginOptions;
    frontmatter?: false | FrontmatterPluginOptions;
    headers?: false | HeadersPluginOptions;
    title?: false;
    importCode?: false | ImportCodePluginOptions;
    links?: false | LinksPluginOptions;
    sfc?: false | SfcPluginOptions;
    slugify?: MarkdownSlugifyFunction;
    toc?: false | TocPluginOptions;
}
/**
 * Headers in markdown file
 */
type MarkdownHeader = PageHeader;
/**
 * Internal links in markdown file
 *
 * Used for file existence check
 */
interface MarkdownLink {
    raw: string;
    relative: string;
    absolute: string;
}
/**
 * The `env` object to be passed to markdown-it render function
 *
 * Input some meta data for markdown file parsing and rendering
 *
 * Output some resources from the markdown file
 */
interface MarkdownEnv extends MarkdownItEnv {
    /**
     * Base / publicPath of current site
     */
    base?: string;
    /**
     * Absolute file path of the markdown file
     */
    filePath?: string | null;
    /**
     * Relative file path of the markdown file
     */
    filePathRelative?: string | null;
    /**
     * Frontmatter of the markdown file
     */
    frontmatter?: PageFrontmatter;
    /**
     * Imported file that extracted by importCodePlugin
     */
    importedFiles?: string[];
    /**
     * Links that extracted by linksPlugin
     */
    links?: MarkdownLink[];
}
/**
 * Type of `slugify` function
 */
type MarkdownSlugifyFunction = (str: string) => string;

/**
 * Create vuepress customized markdown-it instance
 */
declare const createMarkdown: ({ anchor, assets, code, component, emoji, frontmatter, headers, title, importCode, links, sfc, slugify, toc, ...markdownItOptions }?: MarkdownOptions) => Markdown;

export { AnchorPluginOptions, AssetsPluginOptions, CodePluginOptions, EmojiPluginOptions, ImportCodePluginOptions, LinksPluginOptions, Markdown, MarkdownEnv, MarkdownHeader, MarkdownLink, MarkdownOptions, MarkdownSlugifyFunction, assetsPlugin, codePlugin, createMarkdown, importCodePlugin, linksPlugin };
