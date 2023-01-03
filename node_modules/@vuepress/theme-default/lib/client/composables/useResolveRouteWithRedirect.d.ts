import type { Router } from 'vue-router';
/**
 * Resolve a route with redirection
 */
export declare const useResolveRouteWithRedirect: (to: import("vue-router").RouteLocationRaw, currentLocation?: import("vue-router").RouteLocationNormalizedLoaded | undefined) => ReturnType<Router['resolve']>;
