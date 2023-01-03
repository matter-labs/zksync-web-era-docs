import { ensureEndingSlash } from "@vuepress/shared";
export const resolvePrefix = (prefix = "", path = "") => path.startsWith("/") ? path : `${ensureEndingSlash(prefix)}${path}`;
//# sourceMappingURL=utils.js.map