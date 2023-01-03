import { inject, provide } from "vue";
import { useBlogCategory } from "vuepress-plugin-blog2/client";
export const tagMapSymbol = Symbol.for("tagMap");
/**
 * Inject tagMap
 */
export const useTagMap = () => {
    const tagMap = inject(tagMapSymbol);
    if (!tagMap) {
        throw new Error("useTagMap() is called without provider.");
    }
    return tagMap;
};
/**
 * Provide tagMap
 */
export const setupTagMap = () => {
    const tagMap = useBlogCategory("tag");
    provide(tagMapSymbol, tagMap);
};
//# sourceMappingURL=tagMap.js.map