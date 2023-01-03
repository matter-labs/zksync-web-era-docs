import { fs } from '@vuepress/utils';
export const preparePaletteFile = async (app, { userPaletteFile, tempPaletteFile, importCode, }) => {
    const userPalette = app.dir.source(userPaletteFile);
    let content = '';
    if (await fs.pathExists(userPalette)) {
        content += importCode(userPalette);
    }
    return app.writeTemp(tempPaletteFile, content);
};
