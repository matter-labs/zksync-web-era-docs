import MarkdownIt from 'markdown-it';

/**
 * Get markdown page title info
 *
 * Extract it into env
 */
declare const titlePlugin: MarkdownIt.PluginSimple;

declare module '@mdit-vue/types' {
    interface MarkdownItEnv {
        /**
         * The title that extracted by `@mdit-vue/plugin-title`
         */
        title?: string;
    }
}

export { titlePlugin };
