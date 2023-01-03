import type { Zoom } from 'medium-zoom';
import type { InjectionKey } from 'vue';
declare module 'medium-zoom' {
    interface Zoom {
        refresh: (selector?: string) => void;
    }
}
export declare const mediumZoomSymbol: InjectionKey<Zoom>;
/**
 * Inject medium zoom instance
 */
export declare const useMediumZoom: () => Zoom;
