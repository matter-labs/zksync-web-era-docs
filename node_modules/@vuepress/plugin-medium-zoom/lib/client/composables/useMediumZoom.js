import { inject } from 'vue';
export const mediumZoomSymbol = Symbol('mediumZoom');
/**
 * Inject medium zoom instance
 */
export const useMediumZoom = () => {
    const zoom = inject(mediumZoomSymbol);
    if (!zoom) {
        throw new Error('useMediumZoom() is called without provider.');
    }
    return zoom;
};
