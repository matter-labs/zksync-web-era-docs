import type { AutoLinkOptions, NavGroup, NavbarItem } from "../../../../shared/index.js";
export type ResolvedThemeNavbarItem = NavbarItem | NavGroup<AutoLinkOptions | NavGroup<AutoLinkOptions>>;
