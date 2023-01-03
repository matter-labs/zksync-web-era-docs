import type { ComputedRef, InjectionKey } from "vue";
import type { BlogCategoryData } from "vuepress-plugin-blog2/client";
import type { ArticleInfo } from "../../../../shared/index.js";
export type TagMapRef = ComputedRef<BlogCategoryData<ArticleInfo>>;
export declare const tagMapSymbol: InjectionKey<TagMapRef>;
/**
 * Inject tagMap
 */
export declare const useTagMap: () => TagMapRef;
/**
 * Provide tagMap
 */
export declare const setupTagMap: () => void;
