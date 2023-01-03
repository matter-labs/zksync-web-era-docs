import { inject, provide } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
export const starsSymbol = Symbol.for("stars");
/**
 * Inject stars
 */
export const useStars = () => {
    const stars = inject(starsSymbol);
    if (!stars) {
        throw new Error("useStars() is called without provider.");
    }
    return stars;
};
export const setupStars = () => {
    const stars = useBlogType("star");
    provide(starsSymbol, stars);
};
//# sourceMappingURL=stars.js.map