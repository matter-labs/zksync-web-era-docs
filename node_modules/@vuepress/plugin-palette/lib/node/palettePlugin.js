import chokidar from 'chokidar';
import { preparePaletteFile } from './preparePaletteFile.js';
import { prepareStyleFile } from './prepareStyleFile.js';
import { presetOptions } from './presetOptions.js';
export const palettePlugin = ({ preset = 'css', userPaletteFile = presetOptions[preset].userPaletteFile, tempPaletteFile = presetOptions[preset].tempPaletteFile, userStyleFile = presetOptions[preset].userStyleFile, tempStyleFile = presetOptions[preset].tempStyleFile, importCode = presetOptions[preset].importCode, } = {}) => ({
    name: '@vuepress/plugin-palette',
    alias: (app) => ({
        '@vuepress/plugin-palette/palette': app.dir.temp(tempPaletteFile),
        '@vuepress/plugin-palette/style': app.dir.temp(tempStyleFile),
    }),
    onPrepared: async (app) => {
        await Promise.all([
            preparePaletteFile(app, {
                userPaletteFile,
                tempPaletteFile,
                importCode,
            }),
            prepareStyleFile(app, {
                userStyleFile,
                tempStyleFile,
                importCode,
            }),
        ]);
    },
    onWatched: (app, watchers) => {
        const paletteWatcher = chokidar.watch(userPaletteFile, {
            cwd: app.dir.source(),
            ignoreInitial: true,
        });
        paletteWatcher.on('add', () => {
            preparePaletteFile(app, {
                userPaletteFile,
                tempPaletteFile,
                importCode,
            });
        });
        paletteWatcher.on('unlink', () => {
            preparePaletteFile(app, {
                userPaletteFile,
                tempPaletteFile,
                importCode,
            });
        });
        watchers.push(paletteWatcher);
        const styleWatcher = chokidar.watch(userStyleFile, {
            cwd: app.dir.source(),
            ignoreInitial: true,
        });
        styleWatcher.on('add', () => {
            prepareStyleFile(app, {
                userStyleFile,
                tempStyleFile,
                importCode,
            });
        });
        styleWatcher.on('unlink', () => {
            prepareStyleFile(app, {
                userStyleFile,
                tempStyleFile,
                importCode,
            });
        });
        watchers.push(styleWatcher);
    },
});
