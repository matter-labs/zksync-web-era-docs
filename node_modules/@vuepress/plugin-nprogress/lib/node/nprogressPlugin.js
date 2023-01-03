import { getDirname, path } from '@vuepress/utils';
const __dirname = getDirname(import.meta.url);
export const nprogressPlugin = () => ({
    name: '@vuepress/plugin-nprogress',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
});
