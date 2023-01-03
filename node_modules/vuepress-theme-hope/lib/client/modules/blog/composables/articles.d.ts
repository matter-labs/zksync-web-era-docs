import type { ComputedRef, InjectionKey } from "vue";
import type { BlogTypeData } from "vuepress-plugin-blog2/client";
import type { ArticleInfo } from "../../../../shared/index.js";
export type ArticlesRef = ComputedRef<BlogTypeData<ArticleInfo>>;
export declare const articlesSymbol: InjectionKey<ArticlesRef>;
/**
 * Inject articles
 */
export declare const useArticles: () => ArticlesRef;
export declare const setupArticles: () => void;
