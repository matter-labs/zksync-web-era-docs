import { fs } from '@vuepress/utils';
export const prepareStyleFile = async (app, { userStyleFile, tempStyleFile, importCode, }) => {
    const userStyle = app.dir.source(userStyleFile);
    let content = '';
    if (await fs.pathExists(userStyle)) {
        content += importCode(userStyle);
    }
    return app.writeTemp(tempStyleFile, content);
};
