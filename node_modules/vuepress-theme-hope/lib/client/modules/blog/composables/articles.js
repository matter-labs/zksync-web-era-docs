import { inject, provide } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
export const articlesSymbol = Symbol.for("articles");
/**
 * Inject articles
 */
export const useArticles = () => {
    const articles = inject(articlesSymbol);
    if (!articles) {
        throw new Error("useArticles() is called without provider.");
    }
    return articles;
};
export const setupArticles = () => {
    const articles = useBlogType("article");
    provide(articlesSymbol, articles);
};
//# sourceMappingURL=articles.js.map