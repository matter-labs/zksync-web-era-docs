import type { ContainerPluginOptions } from '@vuepress/plugin-container';
import type { DefaultThemeData } from '../../shared/index.js';
/**
 * Resolve options for @vuepress/plugin-container
 *
 * For custom containers default title
 */
export declare const resolveContainerPluginOptions: (localeOptions: DefaultThemeData, type: 'tip' | 'warning' | 'danger') => ContainerPluginOptions;
