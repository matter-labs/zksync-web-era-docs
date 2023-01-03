import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
export const getMdEnhancePlugin = (options, legacy = false) => {
    if (options === false)
        return null;
    return mdEnhancePlugin({
        container: true,
        ...(options || {}),
    }, legacy);
};
//# sourceMappingURL=mdEnhance.js.map