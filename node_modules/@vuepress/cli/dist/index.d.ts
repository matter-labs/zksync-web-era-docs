import { AppConfig, App, Page, PluginObject } from '@vuepress/core';
import { FSWatcher } from 'chokidar';

/**
 * Type of `dev` command function
 */
type BuildCommand = (sourceDir?: string, commandOptions?: BuildCommandOptions) => Promise<void>;
/**
 * CLI options of `build` command
 */
interface BuildCommandOptions {
    dest?: string;
    temp?: string;
    cache?: string;
    debug?: boolean;
    config?: string;
    cleanTemp?: boolean;
    cleanCache?: boolean;
}

declare const createBuild: (defaultAppConfig: Partial<AppConfig>) => BuildCommand;

/**
 * Type of `dev` command function
 */
type DevCommand = (sourceDir?: string, commandOptions?: DevCommandOptions) => Promise<void>;
/**
 * CLI options of `dev` command
 */
interface DevCommandOptions {
    port?: number;
    host?: string;
    temp?: string;
    cache?: string;
    debug?: boolean;
    open?: boolean;
    config?: string;
    cleanTemp?: boolean;
    cleanCache?: boolean;
    watch?: boolean;
}

declare const createDev: (defaultAppConfig: Partial<AppConfig>) => DevCommand;

/**
 * Event handler for page add event
 *
 * Returns the added page
 */
declare const handlePageAdd: (app: App, filePath: string) => Promise<Page | null>;

/**
 * Event handler for page change event
 *
 * Returns the old page and the new page tuple
 */
declare const handlePageChange: (app: App, filePath: string) => Promise<[Page, Page] | null>;

/**
 * Event handler for page unlink event
 *
 * Returns the removed page
 */
declare const handlePageUnlink: (app: App, filePath: string) => Promise<Page | null>;

/**
 * Watch page files and deps, return file watchers
 */
declare const watchPageFiles: (app: App) => FSWatcher[];

declare const watchUserConfigFile: ({ userConfigPath, userConfigDependencies, restart, }: {
    userConfigPath: string;
    userConfigDependencies: string[];
    restart: () => Promise<void>;
}) => FSWatcher[];

declare const info: () => Promise<void>;

/**
 * User config type of vuepress
 *
 * It will be transformed to `AppConfig` by cli
 */
type UserConfig = Partial<AppConfig> & Omit<PluginObject, 'name' | 'multiple'>;

declare const defineUserConfig: (config: UserConfig) => UserConfig;

/**
 * Load user config file
 */
declare const loadUserConfig: (userConfigPath?: string) => Promise<{
    userConfig: UserConfig;
    userConfigDependencies: string[];
}>;

/**
 * Resolve app config according to:
 *
 * - default options
 * - cli options
 * - user config file
 */
declare const resolveAppConfig: ({ defaultAppConfig, cliAppConfig, userConfig, }: {
    defaultAppConfig: Partial<AppConfig>;
    cliAppConfig: Partial<AppConfig>;
    userConfig: Partial<AppConfig>;
}) => AppConfig | null;

/**
 * Resolve app config according to command options of cli
 */
declare const resolveCliAppConfig: (sourceDir: string, commandOptions: Partial<AppConfig>, cwd?: string) => Partial<AppConfig> & Pick<AppConfig, 'source'>;

/**
 * Resolve conventional user config file path
 */
declare const resolveUserConfigConventionalPath: (source: string, cwd?: string) => string | undefined;

/**
 * Resolve file path of user config
 */
declare const resolveUserConfigPath: (config: string, cwd?: string) => string;

/**
 * Transform user config to a vuepress plugin
 */
declare const transformUserConfigToPlugin: (userConfig: UserConfig, source: string, cwd?: string) => PluginObject;

/**
 * Vuepress cli
 */
declare const cli: (defaultAppConfig?: Partial<AppConfig>) => void;

export { BuildCommand, BuildCommandOptions, DevCommand, DevCommandOptions, UserConfig, cli, createBuild, createDev, defineUserConfig, handlePageAdd, handlePageChange, handlePageUnlink, info, loadUserConfig, resolveAppConfig, resolveCliAppConfig, resolveUserConfigConventionalPath, resolveUserConfigPath, transformUserConfigToPlugin, watchPageFiles, watchUserConfigFile };
