import type { Plugin } from "@vuepress/core";
import type { MarkdownEnhanceOptions } from "vuepress-plugin-md-enhance";
export declare const getMdEnhancePlugin: (options?: Partial<MarkdownEnhanceOptions> | false, legacy?: boolean) => Plugin | null;
