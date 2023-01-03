import { loadLanguages } from './loadLanguages.js';
import { resolveHighlighter } from './resolveHighlighter.js';
export const prismjsPlugin = ({ preloadLanguages = ['markdown', 'jsdoc', 'yaml'], } = {}) => ({
    name: '@vuepress/plugin-prismjs',
    extendsMarkdown(md) {
        if (preloadLanguages?.length !== 0) {
            loadLanguages(preloadLanguages);
        }
        md.options.highlight = (code, lang) => {
            const highlighter = resolveHighlighter(lang);
            return highlighter?.(code) || '';
        };
    },
});
