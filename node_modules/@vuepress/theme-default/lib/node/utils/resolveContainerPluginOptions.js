/**
 * Resolve options for @vuepress/plugin-container
 *
 * For custom containers default title
 */
export const resolveContainerPluginOptions = (localeOptions, type) => {
    const locales = Object.entries(localeOptions.locales || {}).reduce((result, [key, value]) => {
        result[key] = {
            defaultInfo: value?.[type] ?? localeOptions[type],
        };
        return result;
    }, {});
    return {
        type,
        locales,
    };
};
