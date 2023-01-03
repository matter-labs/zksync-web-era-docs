import type { ComputedRef, InjectionKey } from "vue";
import type { BlogCategoryData } from "vuepress-plugin-blog2/client";
import type { ArticleInfo } from "../../../../shared/index.js";
export type CategoryMapRef = ComputedRef<BlogCategoryData<ArticleInfo>>;
export declare const categoryMapSymbol: InjectionKey<CategoryMapRef>;
/**
 * Inject categoryMap
 */
export declare const useCategoryMap: () => CategoryMapRef;
/**
 * Provide categoryMap
 */
export declare const setupCategoryMap: () => void;
