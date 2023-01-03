import MarkdownIt from 'markdown-it';
import ParserBlock from 'markdown-it/lib/parser_block.js';
import ParserInline from 'markdown-it/lib/parser_inline.js';

/**
 * Options of @mdit-vue/plugin-component
 */
interface ComponentPluginOptions {
    /**
     * Extra tags to be treated as block tags.
     *
     * @default []
     */
    blockTags?: string[];
    /**
     * Extra tags to be treated as inline tags.
     *
     * @default []
     */
    inlineTags?: string[];
}

/**
 * Allows better use of Vue components in Markdown
 */
declare const componentPlugin: MarkdownIt.PluginWithOptions<ComponentPluginOptions>;

declare const createHtmlBlockRule: (options: Required<ComponentPluginOptions>) => ParserBlock.RuleBlock;

declare const htmlInlineRule: ParserInline.RuleInline;

declare const HTML_TAG_RE: RegExp;
declare const HTML_OPEN_CLOSE_TAG_RE: RegExp;
declare const HTML_SELF_CLOSING_TAG_RE: RegExp;
declare const HTML_OPEN_AND_CLOSE_TAG_IN_THE_SAME_LINE_RE: RegExp;

/**
 * List of block tags
 *
 * @see https://spec.commonmark.org/0.30/#html-blocks
 */
declare const TAGS_BLOCK: string[];
/**
 * According to markdown spec, all non-block html tags are treated as "inline"
 * tags (wrapped with <p></p>), including those "unknown" tags
 *
 * Therefore, markdown-it processes "inline" tags and "unknown" tags in the same
 * way, and does not care if a tag is "inline" or "unknown"
 *
 * As we want to take those "unknown" tags as custom components, we should
 * treat them as "block" tags
 *
 * So we have to distinguish between "inline" and "unknown" tags ourselves
 *
 * The inline tags list comes from MDN
 *
 * @see https://spec.commonmark.org/0.30/#raw-html
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
 */
declare const TAGS_INLINE: string[];
/**
 * Tags of Vue built-in components
 *
 * @see https://vuejs.org/api/built-in-components.html
 * @see https://vuejs.org/api/built-in-special-elements.html
 */
declare const TAGS_VUE_RESERVED: string[];

export { ComponentPluginOptions, HTML_OPEN_AND_CLOSE_TAG_IN_THE_SAME_LINE_RE, HTML_OPEN_CLOSE_TAG_RE, HTML_SELF_CLOSING_TAG_RE, HTML_TAG_RE, TAGS_BLOCK, TAGS_INLINE, TAGS_VUE_RESERVED, componentPlugin, createHtmlBlockRule, htmlInlineRule };
