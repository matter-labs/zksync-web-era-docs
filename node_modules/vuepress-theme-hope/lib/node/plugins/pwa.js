import { pwaPlugin } from "vuepress-plugin-pwa2";
export const getPWAPlugin = (options, legacy = false) => {
    if (!options)
        return null;
    return pwaPlugin(typeof options === "object" ? options : {}, legacy);
};
//# sourceMappingURL=pwa.js.map