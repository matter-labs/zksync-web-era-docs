import type { GitContributor } from "@vuepress/plugin-git";
import type { ComputedRef } from "vue";
import type { AutoLinkOptions } from "../../../../shared/index.js";
export declare const useEditLink: () => ComputedRef<null | AutoLinkOptions>;
export declare const useUpdateTime: () => ComputedRef<null | string>;
export declare const useContributors: () => ComputedRef<null | GitContributor[]>;
