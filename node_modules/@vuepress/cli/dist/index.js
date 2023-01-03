// src/commands/build/createBuild.ts
import process6 from "process";
import { createBuildApp } from "@vuepress/core";
import { debug, formatMs, fs as fs5, logger as logger3, withSpinner } from "@vuepress/utils";

// src/config/defineUserConfig.ts
var defineUserConfig = (config) => config;

// src/config/loadUserConfig.ts
import { pathToFileURL } from "url";
import { fs, hash, importFileDefault, path } from "@vuepress/utils";
import { build } from "esbuild";
var loadUserConfig = async (userConfigPath) => {
  if (!userConfigPath) {
    return {
      userConfig: {},
      userConfigDependencies: []
    };
  }
  const dirnameVarName = "__vite_injected_original_dirname";
  const filenameVarName = "__vite_injected_original_filename";
  const importMetaUrlVarName = "__vite_injected_original_import_meta_url";
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [userConfigPath],
    outfile: "out.js",
    write: false,
    target: ["node14.18", "node16"],
    platform: "node",
    bundle: true,
    format: "esm",
    sourcemap: "inline",
    metafile: true,
    define: {
      "__dirname": dirnameVarName,
      "__filename": filenameVarName,
      "import.meta.url": importMetaUrlVarName
    },
    plugins: [
      {
        name: "externalize-deps",
        setup(build2) {
          build2.onResolve({ filter: /.*/ }, ({ path: id }) => {
            if (id[0] !== "." && !path.isAbsolute(id)) {
              return {
                external: true
              };
            }
            return null;
          });
        }
      },
      {
        name: "inject-file-scope-variables",
        setup(build2) {
          build2.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await fs.readFile(args.path, "utf8");
            const injectValues = `const ${dirnameVarName} = ${JSON.stringify(
              path.dirname(args.path)
            )};const ${filenameVarName} = ${JSON.stringify(args.path)};const ${importMetaUrlVarName} = ${JSON.stringify(
              pathToFileURL(args.path).href
            )};`;
            return {
              loader: args.path.endsWith("ts") ? "ts" : "js",
              contents: injectValues + contents
            };
          });
        }
      }
    ]
  });
  const { text } = result.outputFiles[0];
  const tempFilePath = `${userConfigPath}.${hash(text)}.mjs`;
  let userConfig;
  try {
    await fs.writeFile(tempFilePath, text);
    userConfig = await importFileDefault(tempFilePath);
  } finally {
    await fs.rm(tempFilePath);
  }
  return {
    userConfig,
    userConfigDependencies: Object.keys(result.metafile?.inputs ?? {})
  };
};

// src/config/resolveAppConfig.ts
import { ensureEndingSlash, ensureLeadingSlash } from "@vuepress/shared";
import { colors, isChildPath, logger } from "@vuepress/utils";
var resolveAppConfig = ({
  defaultAppConfig,
  cliAppConfig,
  userConfig
}) => {
  const appConfig = {
    ...defaultAppConfig,
    ...userConfig,
    ...cliAppConfig
  };
  if (appConfig.bundler === void 0 || appConfig.theme === void 0) {
    logger.error(
      `${colors.magenta("bundler")} and ${colors.magenta("theme")} are required`
    );
    return null;
  }
  if (appConfig.base && !(appConfig.base.startsWith("/") && appConfig.base.endsWith("/"))) {
    const rawBase = appConfig.base;
    appConfig.base = ensureLeadingSlash(ensureEndingSlash(rawBase));
    logger.warn(
      `${colors.magenta("base")} should start and end with a slash (/), so it has been normalized from ${colors.magenta(rawBase)} to ${colors.magenta(appConfig.base)}`
    );
  }
  if (appConfig.dest && isChildPath(appConfig.source, appConfig.dest)) {
    logger.warn(
      `${colors.magenta("dest")} directory would be emptied during build, so we fallback it to the default directory for the safety of your source files`
    );
    delete appConfig.dest;
  }
  return appConfig;
};

// src/config/resolveCliAppConfig.ts
import process2 from "process";
import { path as path2 } from "@vuepress/utils";
var OPTIONS_COMMON = ["debug", "open", "port", "host"];
var OPTIONS_DIRECTORY = ["cache", "dest", "temp"];
var resolveCliAppConfig = (sourceDir, commandOptions, cwd = process2.cwd()) => {
  const source = path2.resolve(cwd, sourceDir);
  const appConfig = {
    source
  };
  OPTIONS_COMMON.forEach((name) => {
    if (commandOptions[name] !== void 0) {
      appConfig[name] = commandOptions[name];
    }
  });
  OPTIONS_DIRECTORY.forEach((name) => {
    if (commandOptions[name] !== void 0) {
      appConfig[name] = path2.resolve(cwd, commandOptions[name]);
    }
  });
  return appConfig;
};

// src/config/resolveUserConfigConventionalPath.ts
import process3 from "process";
import { fs as fs2, path as path3 } from "@vuepress/utils";
var resolveUserConfigConventionalPath = (source, cwd = process3.cwd()) => [
  path3.resolve(cwd, "vuepress.config.ts"),
  path3.resolve(cwd, "vuepress.config.js"),
  path3.resolve(cwd, "vuepress.config.mjs"),
  path3.resolve(source, ".vuepress/config.ts"),
  path3.resolve(source, ".vuepress/config.js"),
  path3.resolve(source, ".vuepress/config.mjs")
].find((item) => fs2.pathExistsSync(item));

// src/config/resolveUserConfigPath.ts
import process4 from "process";
import { colors as colors2, fs as fs3, logger as logger2, path as path4 } from "@vuepress/utils";
var resolveUserConfigPath = (config, cwd = process4.cwd()) => {
  const configPath = path4.resolve(cwd, config);
  if (!fs3.pathExistsSync(configPath)) {
    throw logger2.createError(
      `config file does not exist: ${colors2.magenta(config)}`
    );
  }
  return configPath;
};

// src/config/transformUserConfigToPlugin.ts
import process5 from "process";
import { fs as fs4, path as path5 } from "@vuepress/utils";
var transformUserConfigToPlugin = (userConfig, source, cwd = process5.cwd()) => {
  const userConfigPlugin = {
    name: "user-config",
    ...userConfig
  };
  if (userConfigPlugin.clientConfigFile === void 0) {
    userConfigPlugin.clientConfigFile = [
      path5.resolve(cwd, "vuepress.client.ts"),
      path5.resolve(cwd, "vuepress.client.js"),
      path5.resolve(cwd, "vuepress.client.mjs"),
      path5.resolve(source, ".vuepress/client.ts"),
      path5.resolve(source, ".vuepress/client.js"),
      path5.resolve(source, ".vuepress/client.mjs")
    ].find((item) => fs4.pathExistsSync(item));
  }
  return userConfigPlugin;
};

// src/commands/build/createBuild.ts
var log = debug("vuepress:cli/build");
var createBuild = (defaultAppConfig) => async (sourceDir = ".", commandOptions = {}) => {
  const start = Date.now();
  log(`commandOptions:`, commandOptions);
  if (process6.env.NODE_ENV === void 0) {
    process6.env.NODE_ENV = "production";
  }
  const cliAppConfig = resolveCliAppConfig(sourceDir, commandOptions);
  const userConfigPath = commandOptions.config ? resolveUserConfigPath(commandOptions.config) : resolveUserConfigConventionalPath(cliAppConfig.source);
  log(`userConfigPath:`, userConfigPath);
  const { userConfig } = await loadUserConfig(userConfigPath);
  const appConfig = resolveAppConfig({
    defaultAppConfig,
    cliAppConfig,
    userConfig
  });
  if (appConfig === null) {
    return;
  }
  const app = createBuildApp(appConfig);
  app.use(transformUserConfigToPlugin(userConfig, cliAppConfig.source));
  if (commandOptions.cleanTemp === true) {
    await withSpinner("Cleaning temp")(() => {
      return fs5.remove(app.dir.temp());
    });
  }
  if (commandOptions.cleanCache === true) {
    await withSpinner("Cleaning cache")(() => {
      return fs5.remove(app.dir.cache());
    });
  }
  await fs5.emptyDir(app.dir.dest());
  await withSpinner("Initializing and preparing data")(async () => {
    await app.init();
    await app.prepare();
  });
  await app.build();
  await app.pluginApi.hooks.onGenerated.process(app);
  logger3.success(
    `VuePress build completed in ${formatMs(Date.now() - start)}!`
  );
};

// src/commands/dev/createDev.ts
import process8 from "process";
import { createDevApp } from "@vuepress/core";
import { debug as debug2, fs as fs6, logger as logger6, withSpinner as withSpinner2 } from "@vuepress/utils";

// src/commands/dev/watchPageFiles.ts
import { colors as colors3, logger as logger4 } from "@vuepress/utils";
import chokidar from "chokidar";

// src/commands/dev/handlePageAdd.ts
import {
  createPage,
  preparePageComponent,
  preparePageData,
  preparePagesComponents,
  preparePagesData,
  preparePagesRoutes
} from "@vuepress/core";
var handlePageAdd = async (app, filePath) => {
  const pageIndex = app.pages.findIndex((page2) => page2.filePath === filePath);
  if (pageIndex !== -1) {
    return null;
  }
  const page = await createPage(app, {
    filePath
  });
  app.pages.push(page);
  await preparePageComponent(app, page);
  await preparePageData(app, page);
  await preparePagesComponents(app);
  await preparePagesData(app);
  await preparePagesRoutes(app);
  return page;
};

// src/commands/dev/handlePageChange.ts
import {
  createPage as createPage2,
  preparePageComponent as preparePageComponent2,
  preparePageData as preparePageData2,
  preparePagesComponents as preparePagesComponents2,
  preparePagesData as preparePagesData2,
  preparePagesRoutes as preparePagesRoutes2
} from "@vuepress/core";
var handlePageChange = async (app, filePath) => {
  const pageIndex = app.pages.findIndex((page) => page.filePath === filePath);
  if (pageIndex === -1) {
    return null;
  }
  const pageOld = app.pages[pageIndex];
  const pageNew = await createPage2(app, {
    filePath
  });
  app.pages.splice(pageIndex, 1, pageNew);
  await preparePageComponent2(app, pageNew);
  await preparePageData2(app, pageNew);
  const isPathChanged = pageOld.path !== pageNew.path;
  const isRouteMetaChanged = JSON.stringify(pageOld.routeMeta) !== JSON.stringify(pageNew.routeMeta);
  if (isPathChanged) {
    await preparePagesComponents2(app);
    await preparePagesData2(app);
  }
  if (isPathChanged || isRouteMetaChanged) {
    await preparePagesRoutes2(app);
  }
  return [pageOld, pageNew];
};

// src/commands/dev/handlePageUnlink.ts
import {
  preparePagesComponents as preparePagesComponents3,
  preparePagesData as preparePagesData3,
  preparePagesRoutes as preparePagesRoutes3
} from "@vuepress/core";
var handlePageUnlink = async (app, filePath) => {
  const pageIndex = app.pages.findIndex((page2) => page2.filePath === filePath);
  if (pageIndex === -1) {
    return null;
  }
  const page = app.pages[pageIndex];
  app.pages.splice(pageIndex, 1);
  await preparePagesComponents3(app);
  await preparePagesData3(app);
  await preparePagesRoutes3(app);
  return page;
};

// src/commands/dev/pageDepsHelper.ts
var createPageDepsHelper = () => {
  const store = /* @__PURE__ */ new Map();
  return {
    add: ({ deps, filePathRelative }) => {
      const depsAdded = [];
      if (filePathRelative) {
        deps.forEach((item) => {
          if (!store.has(item)) {
            store.set(item, /* @__PURE__ */ new Set());
            depsAdded.push(item);
          }
          store.get(item)?.add(filePathRelative);
        });
      }
      return depsAdded;
    },
    remove: ({ deps, filePathRelative }) => {
      const depsRemoved = [];
      if (filePathRelative) {
        deps.forEach((item) => {
          const pagePathsSet = store.get(item);
          pagePathsSet?.delete(filePathRelative);
          if (pagePathsSet?.size === 0) {
            store.delete(item);
            depsRemoved.push(item);
          }
        });
      }
      return depsRemoved;
    },
    get: (dep) => {
      const pagePathsSet = store.get(dep);
      return pagePathsSet ? [...pagePathsSet] : [];
    }
  };
};

// src/commands/dev/watchPageFiles.ts
var watchPageFiles = (app) => {
  const depsWatcher = chokidar.watch([], {
    disableGlobbing: true,
    ignoreInitial: true
  });
  const depsHelper = createPageDepsHelper();
  const addDeps = (page) => {
    const depsToAdd = depsHelper.add(page);
    depsWatcher.add(depsToAdd);
  };
  const removeDeps = (page) => {
    const depsToRemove = depsHelper.remove(page);
    depsWatcher.unwatch(depsToRemove);
  };
  const depsListener = async (dep) => {
    const pagePaths = depsHelper.get(dep);
    if (!pagePaths)
      return;
    for (const filePathRelative of pagePaths) {
      logger4.info(
        `dependency of page ${colors3.magenta(filePathRelative)} is modified`
      );
      await handlePageChange(app, app.dir.source(filePathRelative));
    }
  };
  depsWatcher.on("add", depsListener);
  depsWatcher.on("change", depsListener);
  depsWatcher.on("unlink", depsListener);
  app.pages.forEach((page) => addDeps(page));
  const pagesWatcher = chokidar.watch(app.options.pagePatterns, {
    cwd: app.dir.source(),
    ignoreInitial: true
  });
  pagesWatcher.on("add", async (filePathRelative) => {
    logger4.info(`page ${colors3.magenta(filePathRelative)} is created`);
    const page = await handlePageAdd(app, app.dir.source(filePathRelative));
    if (page === null)
      return;
    addDeps(page);
  });
  pagesWatcher.on("change", async (filePathRelative) => {
    logger4.info(`page ${colors3.magenta(filePathRelative)} is modified`);
    const result = await handlePageChange(app, app.dir.source(filePathRelative));
    if (result === null)
      return;
    const [pageOld, pageNew] = result;
    removeDeps(pageOld);
    addDeps(pageNew);
  });
  pagesWatcher.on("unlink", async (filePathRelative) => {
    logger4.info(`page ${colors3.magenta(filePathRelative)} is removed`);
    const page = await handlePageUnlink(app, app.dir.source(filePathRelative));
    if (page === null)
      return;
    removeDeps(page);
  });
  return [pagesWatcher, depsWatcher];
};

// src/commands/dev/watchUserConfigFile.ts
import process7 from "process";
import { colors as colors4, logger as logger5 } from "@vuepress/utils";
import chokidar2 from "chokidar";
var watchUserConfigFile = ({
  userConfigPath,
  userConfigDependencies,
  restart
}) => {
  const cwd = process7.cwd();
  const configWatcher = chokidar2.watch(userConfigPath, {
    cwd,
    ignoreInitial: true
  });
  configWatcher.on("change", (configFile) => {
    logger5.info(`config ${colors4.magenta(configFile)} is modified`);
    restart();
  });
  const depsWatcher = chokidar2.watch(userConfigDependencies, {
    cwd,
    ignoreInitial: true
  });
  depsWatcher.on("change", (depFile) => {
    logger5.info(`config dependency ${colors4.magenta(depFile)} is modified`);
    restart();
  });
  return [configWatcher, depsWatcher];
};

// src/commands/dev/createDev.ts
var log2 = debug2("vuepress:cli/dev");
var createDev = (defaultAppConfig) => {
  const dev = async (sourceDir = ".", commandOptions = {}) => {
    log2(`commandOptions:`, commandOptions);
    if (process8.env.NODE_ENV === void 0) {
      process8.env.NODE_ENV = "development";
    }
    const cliAppConfig = resolveCliAppConfig(sourceDir, commandOptions);
    const userConfigPath = commandOptions.config ? resolveUserConfigPath(commandOptions.config) : resolveUserConfigConventionalPath(cliAppConfig.source);
    log2(`userConfigPath:`, userConfigPath);
    const { userConfig, userConfigDependencies } = await loadUserConfig(
      userConfigPath
    );
    const appConfig = resolveAppConfig({
      defaultAppConfig,
      cliAppConfig,
      userConfig
    });
    if (appConfig === null) {
      return;
    }
    const app = createDevApp(appConfig);
    app.use(transformUserConfigToPlugin(userConfig, cliAppConfig.source));
    if (commandOptions.cleanTemp === true) {
      await withSpinner2("Cleaning temp")(() => {
        return fs6.remove(app.dir.temp());
      });
    }
    if (commandOptions.cleanCache === true) {
      await withSpinner2("Cleaning cache")(() => {
        return fs6.remove(app.dir.cache());
      });
    }
    await withSpinner2("Initializing and preparing data")(async () => {
      await app.init();
      await app.prepare();
    });
    const close = await app.dev();
    if (commandOptions.watch === false) {
      return;
    }
    const watchers = [];
    const restart = async () => {
      await Promise.all([
        ...watchers.map((item) => item.close()),
        close()
      ]);
      await dev(sourceDir, {
        ...commandOptions,
        cleanCache: false,
        cleanTemp: false
      });
      logger6.tip(`dev server has restarted, please refresh your browser`);
    };
    watchers.push(...watchPageFiles(app));
    if (userConfigPath) {
      watchers.push(
        ...watchUserConfigFile({
          userConfigPath,
          userConfigDependencies,
          restart
        })
      );
    }
    await app.pluginApi.hooks.onWatched.process(app, watchers, restart);
  };
  return dev;
};

// src/commands/info.ts
import { ora } from "@vuepress/utils";
import envinfo from "envinfo";
var info = async () => {
  const spinner = ora();
  spinner.start("Collecting Environment Info");
  const result = await envinfo.run(
    {
      System: ["OS", "CPU", "Memory", "Shell"],
      Binaries: ["Node", "Yarn", "npm"],
      Utilities: ["Git"],
      Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
      npmPackages: [
        "@vuepress/bundler-vite",
        "@vuepress/bundler-webpack",
        "@vuepress/cli",
        "@vuepress/client",
        "@vuepress/core",
        "@vuepress/markdown",
        "@vuepress/plugin-active-header-links",
        "@vuepress/plugin-back-to-top",
        "@vuepress/plugin-container",
        "@vuepress/plugin-docsearch",
        "@vuepress/plugin-external-link-icon",
        "@vuepress/plugin-git",
        "@vuepress/plugin-google-analytics",
        "@vuepress/plugin-medium-zoom",
        "@vuepress/plugin-nprogress",
        "@vuepress/plugin-palette",
        "@vuepress/plugin-prismjs",
        "@vuepress/plugin-pwa",
        "@vuepress/plugin-pwa-popup",
        "@vuepress/plugin-register-components",
        "@vuepress/plugin-search",
        "@vuepress/plugin-shiki",
        "@vuepress/plugin-theme-data",
        "@vuepress/plugin-toc",
        "@vuepress/shared",
        "@vuepress/theme-default",
        "@vuepress/utils",
        "vuepress",
        "vuepress-vite",
        "vuepress-webpack",
        "vue",
        "vue-router",
        "vue-loader"
      ]
    },
    {
      showNotFound: true,
      duplicates: true,
      fullTree: true
    }
  );
  spinner.stop();
  console.info(result);
};

// src/cli.ts
import { createRequire } from "module";
import process9 from "process";
import { colors as colors5 } from "@vuepress/utils";
import { cac } from "cac";
var require2 = createRequire(import.meta.url);
var cli = (defaultAppConfig = {}) => {
  const program = cac("vuepress");
  const versionCli = require2("../package.json").version;
  const versionCore = require2("@vuepress/core/package.json").version;
  program.version(`core@${versionCore} vuepress/cli@${versionCli}`);
  program.help();
  program.command("dev [sourceDir]", "Start development server").option("-c, --config <config>", "Set path to config file").option("-p, --port <port>", "Use specified port (default: 8080)").option("-t, --temp <temp>", "Set the directory of the temporary files").option("--host <host>", "Use specified host (default: 0.0.0.0)").option("--cache <cache>", "Set the directory of the cache files").option("--clean-temp", "Clean the temporary files before dev").option("--clean-cache", "Clean the cache files before dev").option("--open", "Open browser when ready").option("--debug", "Enable debug mode").option("--no-watch", "Disable watching page and config files").action(createDev(defaultAppConfig));
  program.command("build [sourceDir]", "Build to static site").option("-c, --config <config>", "Set path to config file").option(
    "-d, --dest <dest>",
    "Set the directory build output (default: .vuepress/dist)"
  ).option("-t, --temp <temp>", "Set the directory of the temporary files").option("--cache <cache>", "Set the directory of the cache files").option("--clean-temp", "Clean the temporary files before build").option("--clean-cache", "Clean the cache files before build").option("--debug", "Enable debug mode").action(createBuild(defaultAppConfig));
  program.command("info", "Display environment information").action(info);
  program.parse(process9.argv, { run: false });
  if (program.matchedCommand) {
    program.runMatchedCommand().catch((err) => {
      console.error(colors5.red(err.stack));
      process9.exit(1);
    });
  } else {
    program.outputHelp();
  }
};
export {
  cli,
  createBuild,
  createDev,
  defineUserConfig,
  handlePageAdd,
  handlePageChange,
  handlePageUnlink,
  info,
  loadUserConfig,
  resolveAppConfig,
  resolveCliAppConfig,
  resolveUserConfigConventionalPath,
  resolveUserConfigPath,
  transformUserConfigToPlugin,
  watchPageFiles,
  watchUserConfigFile
};
