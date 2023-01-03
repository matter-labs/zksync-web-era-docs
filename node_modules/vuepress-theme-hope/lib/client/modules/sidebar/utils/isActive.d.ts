import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { ResolvedSidebarItem } from "../utils/index.js";
export declare const isActiveSidebarItem: (route: RouteLocationNormalizedLoaded, item: ResolvedSidebarItem, exact?: boolean) => boolean;
export declare const isMatchedSidebarItem: (route: RouteLocationNormalizedLoaded, item: ResolvedSidebarItem) => boolean;
