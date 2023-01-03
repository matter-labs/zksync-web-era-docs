import type { NavLink } from '../../shared/index.js';
declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
    }
}
/**
 * Resolve NavLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export declare const useNavLink: (item: string) => NavLink;
