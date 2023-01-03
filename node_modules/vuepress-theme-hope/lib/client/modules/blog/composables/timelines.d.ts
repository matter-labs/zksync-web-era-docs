import type { ComputedRef, InjectionKey } from "vue";
import type { Article } from "vuepress-plugin-blog2/client";
import type { ArticleInfo } from "../../../../shared/index.js";
export interface TimelineItem {
    year: number;
    items: {
        date: string;
        path: string;
        info: ArticleInfo;
    }[];
}
export type TimelinesRef = ComputedRef<{
    path: string;
    config: TimelineItem[];
    items: Article<ArticleInfo>[];
}>;
export declare const timelinesSymbol: InjectionKey<TimelinesRef>;
/**
 * Inject timelines
 */
export declare const useTimelines: () => TimelinesRef;
/**
 * Provide timelines
 */
export declare const setupTimelines: () => void;
