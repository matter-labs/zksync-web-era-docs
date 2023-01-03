import { getDirname, path } from '@vuepress/utils';
const __dirname = getDirname(import.meta.url);
export const mediumZoomPlugin = ({ selector = ':not(a) > img', zoomOptions = {}, delay = 500, } = {}) => ({
    name: '@vuepress/plugin-medium-zoom',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    define: {
        __MZ_SELECTOR__: selector,
        __MZ_ZOOM_OPTIONS__: zoomOptions,
        __MZ_DELAY__: delay,
    },
});
