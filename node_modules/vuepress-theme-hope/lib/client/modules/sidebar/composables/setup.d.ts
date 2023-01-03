import type { ComputedRef, InjectionKey } from "vue";
import type { ResolvedSidebarItem } from "../utils/index.js";
export type SidebarItemsRef = ComputedRef<ResolvedSidebarItem[]>;
export declare const sidebarItemsSymbol: InjectionKey<SidebarItemsRef>;
/**
 * Create sidebar items ref and provide as global computed in setup
 */
export declare const setupSidebarItems: () => void;
/**
 * Inject sidebar items global computed
 */
export declare const useSidebarItems: () => SidebarItemsRef;
