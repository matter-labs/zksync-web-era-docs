import type { PageHeader } from '@vuepress/client';
import type { ComputedRef, InjectionKey } from 'vue';
import type { DefaultThemeData, DefaultThemeNormalPageFrontmatter, ResolvedSidebarItem, SidebarConfigArray, SidebarConfigObject } from '../../shared/index.js';
export type SidebarItemsRef = ComputedRef<ResolvedSidebarItem[]>;
export declare const sidebarItemsSymbol: InjectionKey<SidebarItemsRef>;
/**
 * Inject sidebar items global computed
 */
export declare const useSidebarItems: () => SidebarItemsRef;
/**
 * Create sidebar items ref and provide as global computed in setup
 */
export declare const setupSidebarItems: () => void;
/**
 * Resolve sidebar items global computed
 *
 * It should only be resolved and provided once
 */
export declare const resolveSidebarItems: (frontmatter: DefaultThemeNormalPageFrontmatter, themeLocale: DefaultThemeData) => ResolvedSidebarItem[];
/**
 * Util to transform page header to sidebar item
 */
export declare const headerToSidebarItem: (header: PageHeader, sidebarDepth: number) => ResolvedSidebarItem;
export declare const headersToSidebarItemChildren: (headers: PageHeader[], sidebarDepth: number) => ResolvedSidebarItem[];
/**
 * Resolve sidebar items if the config is `auto`
 */
export declare const resolveAutoSidebarItems: (sidebarDepth: number) => ResolvedSidebarItem[];
/**
 * Resolve sidebar items if the config is an array
 */
export declare const resolveArraySidebarItems: (sidebarConfig: SidebarConfigArray, sidebarDepth: number) => ResolvedSidebarItem[];
/**
 * Resolve sidebar items if the config is a key -> value (path-prefix -> array) object
 */
export declare const resolveMultiSidebarItems: (sidebarConfig: SidebarConfigObject, sidebarDepth: number) => ResolvedSidebarItem[];
