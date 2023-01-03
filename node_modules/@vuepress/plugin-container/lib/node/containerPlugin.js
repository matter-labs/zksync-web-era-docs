import { ensureLeadingSlash, resolveLocalePath } from '@vuepress/shared';
import { colors, logger } from '@vuepress/utils';
import container from 'markdown-it-container';
export const containerPlugin = ({ 
// plugin options
type, after, before, locales, 
// raw options for markdown-it-container
validate, marker, render, }) => {
    const plugin = {
        name: '@vuepress/plugin-container',
        multiple: true,
    };
    // `type` option is required
    if (!type) {
        logger.warn(`[${plugin.name}] ${colors.magenta('type')} option is required`);
        return plugin;
    }
    // if `render` option is not specified
    // use `before` and `after` to generate render function
    if (!render) {
        let renderBefore;
        let renderAfter;
        if (before !== undefined && after !== undefined) {
            // user defined
            renderBefore = before;
            renderAfter = after;
        }
        else {
            // fallback
            renderBefore = (info) => `<div class="custom-container ${type}">${info ? `<p class="custom-container-title">${info}</p>` : ''}\n`;
            renderAfter = () => '</div>\n';
        }
        // token info stack
        const infoStack = [];
        render = (tokens, index, opts, env) => {
            const token = tokens[index];
            if (token.nesting === 1) {
                // `before` tag
                // resolve info (title)
                let info = token.info.trim().slice(type.length).trim();
                if (!info && locales) {
                    // locale
                    const { filePathRelative } = env;
                    const relativePath = ensureLeadingSlash(filePathRelative ?? '');
                    const localePath = resolveLocalePath(locales, relativePath);
                    const localeData = locales[localePath] ?? {};
                    if (localeData.defaultInfo) {
                        info = localeData.defaultInfo;
                    }
                    else {
                        info = type.toUpperCase();
                    }
                }
                // push the info to stack
                infoStack.push(info);
                // render
                return renderBefore(info);
            }
            else {
                // `after` tag
                // pop the info from stack
                const info = infoStack.pop() || '';
                // render
                return renderAfter(info);
            }
        };
    }
    // use markdown-it-container
    plugin.extendsMarkdown = (md) => {
        md.use(container, type, { render, validate, marker });
    };
    return plugin;
};
