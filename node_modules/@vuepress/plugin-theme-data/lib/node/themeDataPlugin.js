import { getDirname, path } from '@vuepress/utils';
import { prepareThemeData } from './prepareThemeData.js';
const __dirname = getDirname(import.meta.url);
export const themeDataPlugin = ({ themeData, }) => ({
    name: '@vuepress/plugin-theme-data',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    onPrepared: (app) => prepareThemeData(app, themeData),
});
