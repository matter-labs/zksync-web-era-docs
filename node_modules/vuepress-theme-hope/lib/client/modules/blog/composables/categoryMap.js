import { inject, provide } from "vue";
import { useBlogCategory } from "vuepress-plugin-blog2/client";
export const categoryMapSymbol = Symbol.for("categoryMap");
/**
 * Inject categoryMap
 */
export const useCategoryMap = () => {
    const categoryMap = inject(categoryMapSymbol);
    if (!categoryMap) {
        throw new Error("useCategoryMap() is called without provider.");
    }
    return categoryMap;
};
/**
 * Provide categoryMap
 */
export const setupCategoryMap = () => {
    const categoryMap = useBlogCategory("category");
    provide(categoryMapSymbol, categoryMap);
};
//# sourceMappingURL=categoryMap.js.map