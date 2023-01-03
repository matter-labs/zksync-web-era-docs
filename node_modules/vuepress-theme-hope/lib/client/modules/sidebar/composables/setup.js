import { computed, inject, provide } from "vue";
import { resolveSidebarItems } from "./resolveConfig.js";
export const sidebarItemsSymbol = Symbol.for("sidebarItems");
/**
 * Create sidebar items ref and provide as global computed in setup
 */
export const setupSidebarItems = () => {
    const sidebarItems = computed(() => resolveSidebarItems());
    provide(sidebarItemsSymbol, sidebarItems);
};
/**
 * Inject sidebar items global computed
 */
export const useSidebarItems = () => {
    const sidebarItems = inject(sidebarItemsSymbol);
    if (!sidebarItems) {
        throw new Error("useSidebarItems() is called without provider.");
    }
    return sidebarItems;
};
//# sourceMappingURL=setup.js.map