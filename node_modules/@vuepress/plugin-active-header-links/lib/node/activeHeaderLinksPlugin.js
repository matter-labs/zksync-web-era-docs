import { getDirname, path } from '@vuepress/utils';
const __dirname = getDirname(import.meta.url);
export const activeHeaderLinksPlugin = ({ headerLinkSelector = 'a.sidebar-item', headerAnchorSelector = '.header-anchor', delay = 200, offset = 5, } = {}) => ({
    name: '@vuepress/plugin-active-header-links',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    define: {
        __AHL_HEADER_LINK_SELECTOR__: headerLinkSelector,
        __AHL_HEADER_ANCHOR_SELECTOR__: headerAnchorSelector,
        __AHL_DELAY__: delay,
        __AHL_OFFSET__: offset,
    },
});
