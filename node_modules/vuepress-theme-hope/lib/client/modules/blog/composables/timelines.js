import { computed, inject, provide } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
import { getDate } from "vuepress-shared/client";
export const timelinesSymbol = Symbol.for("timelines");
/**
 * Inject timelines
 */
export const useTimelines = () => {
    const timelines = inject(timelinesSymbol);
    if (!timelines) {
        throw new Error("useTimelines() is called without provider.");
    }
    return timelines;
};
/**
 * Provide timelines
 */
export const setupTimelines = () => {
    const timelines = useBlogType("timeline");
    const timelineItems = computed(() => {
        const timelineItems = [];
        // filter before sort
        timelines.value.items.forEach(({ info, path }) => {
            const { year, month, day } = getDate(info["d" /* ArticleInfoType.date */])?.info || {};
            if (year && month && day) {
                if (!timelineItems[0] || timelineItems[0].year !== year)
                    timelineItems.unshift({ year, items: [] });
                timelineItems[0].items.push({
                    date: `${month}/${day}`,
                    info,
                    path,
                });
            }
        });
        return {
            ...timelines.value,
            config: timelineItems.reverse(),
        };
    });
    provide(timelinesSymbol, timelineItems);
};
//# sourceMappingURL=timelines.js.map