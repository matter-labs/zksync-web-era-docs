import { copyCodePlugin } from "vuepress-plugin-copy-code2";
export const getCopyCodePlugin = (themeData, options) => {
    if (options === false)
        return null;
    return copyCodePlugin({
        selector: '.theme-hope-content div[class*="language-"] pre',
        pure: themeData.pure,
        ...options,
    });
};
//# sourceMappingURL=copyCode.js.map