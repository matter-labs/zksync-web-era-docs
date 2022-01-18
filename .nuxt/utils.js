import Vue from 'vue'
import { isSamePath as _isSamePath, joinURL, normalizeURL, withQuery, withoutTrailingSlash } from 'ufo'

// window.{{globals.loadedCallback}} hook
// Useful for jsdom testing or plugins (https://github.com/tmpvar/jsdom#dealing-with-asynchronous-script-loading)
if (process.client) {
  window.onNuxtReadyCbs = []
  window.onNuxtReady = (cb) => {
    window.onNuxtReadyCbs.push(cb)
  }
}

export function createGetCounter (counterObject, defaultKey = '') {
  return function getCounter (id = defaultKey) {
    if (counterObject[id] === undefined) {
      counterObject[id] = 0
    }
    return counterObject[id]++
  }
}

export function empty () {}

export function globalHandleError (error) {
  if (Vue.config.errorHandler) {
    Vue.config.errorHandler(error)
  }
}

export function interopDefault (promise) {
  return promise.then(m => m.default || m)
}

export function hasFetch(vm) {
  return vm.$options && typeof vm.$options.fetch === 'function' && !vm.$options.fetch.length
}
export function purifyData(data) {
  if (process.env.NODE_ENV === 'production') {
    return data
  }

  return Object.entries(data).filter(
    ([key, value]) => {
      const valid = !(value instanceof Function) && !(value instanceof Promise)
      if (!valid) {
        console.warn(`${key} is not able to be stringified. This will break in a production environment.`)
      }
      return valid
    }
    ).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
}
export function getChildrenComponentInstancesUsingFetch(vm, instances = []) {
  const children = vm.$children || []
  for (const child of children) {
    if (child.$fetch) {
      instances.push(child)
      continue; // Don't get the children since it will reload the template
    }
    if (child.$children) {
      getChildrenComponentInstancesUsingFetch(child, instances)
    }
  }
  return instances
}

export function applyAsyncData (Component, asyncData) {
  if (
    // For SSR, we once all this function without second param to just apply asyncData
    // Prevent doing this for each SSR request
    !asyncData && Component.options.__hasNuxtData
  ) {
    return
  }

  const ComponentData = Component.options._originDataFn || Component.options.data || function () { return {} }
  Component.options._originDataFn = ComponentData

  Component.options.data = function () {
    const data = ComponentData.call(this, this)
    if (this.$ssrContext) {
      asyncData = this.$ssrContext.asyncData[Component.cid]
    }
    return { ...data, ...asyncData }
  }

  Component.options.__hasNuxtData = true

  if (Component._Ctor && Component._Ctor.options) {
    Component._Ctor.options.data = Component.options.data
  }
}

export function sanitizeComponent (Component) {
  // If Component already sanitized
  if (Component.options && Component._Ctor === Component) {
    return Component
  }
  if (!Component.options) {
    Component = Vue.extend(Component) // fix issue #6
    Component._Ctor = Component
  } else {
    Component._Ctor = Component
    Component.extendOptions = Component.options
  }
  // If no component name defined, set file path as name, (also fixes #5703)
  if (!Component.options.name && Component.options.__file) {
    Component.options.name = Component.options.__file
  }
  return Component
}

export function getMatchedComponents (route, matches = false, prop = 'components') {
  return Array.prototype.concat.apply([], route.matched.map((m, index) => {
    return Object.keys(m[prop]).map((key) => {
      matches && matches.push(index)
      return m[prop][key]
    })
  }))
}

export function getMatchedComponentsInstances (route, matches = false) {
  return getMatchedComponents(route, matches, 'instances')
}

export function flatMapComponents (route, fn) {
  return Array.prototype.concat.apply([], route.matched.map((m, index) => {
    return Object.keys(m.components).reduce((promises, key) => {
      if (m.components[key]) {
        promises.push(fn(m.components[key], m.instances[key], m, key, index))
      } else {
        delete m.components[key]
      }
      return promises
    }, [])
  }))
}

export function resolveRouteComponents (route, fn) {
  return Promise.all(
    flatMapComponents(route, async (Component, instance, match, key) => {
      // If component is a function, resolve it
      if (typeof Component === 'function' && !Component.options) {
        try {
          Component = await Component()
        } catch (error) {
          // Handle webpack chunk loading errors
          // This may be due to a new deployment or a network problem
          if (
            error &&
            error.name === 'ChunkLoadError' &&
            typeof window !== 'undefined' &&
            window.sessionStorage
          ) {
            const timeNow = Date.now()
            const previousReloadTime = parseInt(window.sessionStorage.getItem('nuxt-reload'))

            // check for previous reload time not to reload infinitely
            if (!previousReloadTime || previousReloadTime + 60000 < timeNow) {
              window.sessionStorage.setItem('nuxt-reload', timeNow)
              window.location.reload(true /* skip cache */)
            }
          }

          throw error
        }
      }
      match.components[key] = Component = sanitizeComponent(Component)
      return typeof fn === 'function' ? fn(Component, instance, match, key) : Component
    })
  )
}

export async function getRouteData (route) {
  if (!route) {
    return
  }
  // Make sure the components are resolved (code-splitting)
  await resolveRouteComponents(route)
  // Send back a copy of route with meta based on Component definition
  return {
    ...route,
    meta: getMatchedComponents(route).map((Component, index) => {
      return { ...Component.options.meta, ...(route.matched[index] || {}).meta }
    })
  }
}

export async function setContext (app, context) {
  // If context not defined, create it
  if (!app.context) {
    app.context = {
      isStatic: process.static,
      isDev: true,
      isHMR: false,
      app,
      store: app.store,
      payload: context.payload,
      error: context.error,
      base: app.router.options.base,
      env: {"LESSOPEN":"| /usr/bin/lesspipe %s","npm_package_optionalDependencies_fs_extra":"^9.1.0","npm_package_devDependencies__nuxt_typescript_build":"^2.0.5","npm_package_dependencies_vuepress_plugin_canonical":"^1.0.0","npm_package_dependencies__babel_plugin_syntax_jsx":"latest","USER":"stanislav","DATABASE_URL":"postgres://postgres@localhost/plasma","LC_TIME":"en_US.UTF-8","npm_package_stylelint_rules_selector_type_no_unknown_0":"true","npm_package_devDependencies__nuxtjs_dotenv":"1.4.1","npm_package_devDependencies__nuxt_types":"^2.15.2","npm_package_scripts_docs_build":"vuepress build docs","npm_config_version_commit_hooks":"true","npm_config_user_agent":"yarn/1.22.5 npm/? node/v14.14.0 linux x64","TEXTDOMAIN":"im-config","XDG_SEAT":"seat0","npm_package_dependencies_vue":"^2.6.12","npm_package_bugs_url":"https://github.com/matter-labs/zksync-docs/issues","npm_package_scripts_fmt_check":"prettier --check \"docs/**/*.md\"","npm_config_bin_links":"true","SSH_AGENT_PID":"3875","XDG_SESSION_TYPE":"x11","npm_node_execpath":"/home/stanislav/.nvm/versions/node/v14.14.0/bin/node","npm_package_stylelint_rules_plugin_rational_order_1_empty_line_between_groups":"false","npm_package_devDependencies_vue_property_decorator":"^9.1.2","npm_package_devDependencies_vue_class_component":"^7.2.6","npm_package_devDependencies__types_hammerjs":"^2.0.39","npm_package_dependencies__types_lodash":"^4.14.168","npm_package_dependencies__babel_core":"^7.13.1","npm_config_init_version":"1.0.0","SHLVL":"1","npm_package_dependencies_vue_scrollto":"^2.20.0","npm_package_dependencies__vuepress_core":"^1.8.2","OLDPWD":"/home/stanislav/matter-labs","QT4_IM_MODULE":"xim","HOME":"/home/stanislav","npm_package_stylelint_rules_no_descending_specificity":"true","npm_package_stylelint_extends_0":"stylelint-config-recommended","npm_package_devDependencies__typescript_eslint_parser":"^4.15.1","npm_package_scripts_md_deadlinks":"check-md","npm_package_browserslist_production_0":">0.2%","DESKTOP_SESSION":"ubuntu","NVM_BIN":"/home/stanislav/.nvm/versions/node/v14.14.0/bin","npm_package_stylelint_extends_1":"stylelint-config-rational-order","npm_package_lint_staged____css_scss_":"yarn run lint-css","npm_package_devDependencies_eslint_config_prettier":"^7.2.0","npm_package_dependencies__types_js_cookie":"^2.2.6","npm_package_browserslist_production_1":"not dead","NVM_INC":"/home/stanislav/.nvm/versions/node/v14.14.0/include/node","npm_package_optionalDependencies__sentry_webpack_plugin":"^1.14.1","npm_package_browserslist_production_2":"not op_mini all","npm_config_init_license":"MIT","GNOME_SHELL_SESSION_MODE":"ubuntu","GTK_MODULES":"gail:atk-bridge","YARN_WRAP_OUTPUT":"false","npm_package_stylelint_rules_scss_at_rule_no_unknown":"true","npm_package_devDependencies_vue_server_renderer":"^2.6.12","npm_package_dependencies__nuxtjs_sentry":"^5.0.1","npm_package_scripts_md_lint":"markdownlint docs","npm_config_version_tag_prefix":"v","LC_MONETARY":"en_US.UTF-8","npm_package_scripts_docs_deploy":"yarn docs:build && firebase deploy","DBUS_SESSION_BUS_ADDRESS":"unix:path=/run/user/1000/bus","npm_package_stylelint_rules_no_empty_source_1_severity":"warning","npm_package_dependencies__nuxtjs_pwa":"^3.3.5","npm_package_scripts_start_firebase":"firebase serve --only hosting","COLORTERM":"truecolor","npm_package_devDependencies_typescript":"<=4.1.5","npm_package_devDependencies_markdownlint":"^0.21.1","npm_package_devDependencies_cspell":"^4.1.5","npm_package_check_md_ignoreFootnotes":"true","npm_package_check_md_cwd":"./docs","npm_package_scripts_lint_css":"stylelint --fix \"**/*.scss\"","npm_package_description":"zkSync.io new landing","NVM_DIR":"/home/stanislav/.nvm","ZKSYNC_HOME":"/home/stanislav/matter-labs/zksync-dev","npm_package_readmeFilename":"README.md","npm_package_stylelint_plugins_0":"stylelint-order","npm_package_dependencies_nuxt_social_meta":"^0.0.5","npm_package_dependencies_nuxt":"^2.15.0","npm_package_homepage":"https://zksync.io/","MANDATORY_PATH":"/usr/share/gconf/ubuntu.mandatory.path","IM_CONFIG_PHASE":"2","npm_package_stylelint_plugins_1":"stylelint-scss","npm_package_devDependencies_ts_loader":"^8.0.17","npm_package_devDependencies_prettier":"^2.2.1","npm_package_devDependencies__nuxtjs_style_resources":"^1.0.0","npm_package_dependencies_vuepress":"^1.8.2","npm_package_dependencies_prismjs":"^1.23.0","npm_package_scripts_dev":"sh ./cli-check-env.sh && nuxt","LOGNAME":"stanislav","GTK_IM_MODULE":"ibus","npm_package_stylelint_plugins_2":"stylelint-config-rational-order/plugin","npm_package_devDependencies_vue_template_compiler":"^2.6.12","npm_package_dependencies_vuepress_plugin_fulltext_search":"^2.1.0","npm_package_dependencies_hammerjs":"^2.0.8","npm_package_dependencies__nuxtjs_google_gtag":"^1.0.4","DESKTOP_AUTOSTART_ID":"10e29f5b153b9ffe5162210541323714600000037970007","_":"/usr/bin/yarn","npm_package_stylelint_rules_plugin_rational_order_1_border_in_box_model":"false","npm_package_stylelint_rules_plugin_no_low_performance_animation_properties_0":"true","npm_package_stylelint_plugins_3":"stylelint-high-performance-animation","npm_package_devDependencies_node_sass":"4.14.1","npm_package_check_md_exitLevel":"warn","npm_package_scripts_zk_ci_prepare":"yarn nuxt-ci:build && yarn ci && yarn docs:build && yarn zk-copy","npm_package_scripts_ci":"yarn run fmt:check; yarn run cspell; yarn run md:lint; yarn run md:deadlinks","npm_package_private":"true","DEFAULTS_PATH":"/usr/share/gconf/ubuntu.default.path","npm_package_stylelint_plugins_4":"stylelint-declaration-use-variable","npm_config_registry":"https://registry.yarnpkg.com","USERNAME":"stanislav","XDG_SESSION_ID":"2","TERM":"xterm-256color","npm_package_devDependencies_stylelint":"^13.10.0","GNOME_DESKTOP_SESSION_ID":"this-is-deprecated","npm_config_ignore_scripts":"","WINDOWPATH":"2","npm_package_dependencies_css_loader":"^5.0.2","npm_package_scripts_audit_dependencies":"yarn npm audit --package-lock-only --audit-level critical --json | yarn-audit-html --output audit.html","npm_package_browserslist_development_0":"last 1 chrome version","PATH":"/tmp/yarn--1622117489887-0.6909904851199782:/home/stanislav/matter-labs/zksync-docs/node_modules/.bin:/home/stanislav/.config/yarn/link/node_modules/.bin:/home/stanislav/.nvm/versions/node/v14.14.0/libexec/lib/node_modules/npm/bin/node-gyp-bin:/home/stanislav/.nvm/versions/node/v14.14.0/lib/node_modules/npm/bin/node-gyp-bin:/home/stanislav/.nvm/versions/node/v14.14.0/bin/node_modules/npm/bin/node-gyp-bin:/home/stanislav/Documents/swift-5.3.2-RELEASE-ubuntu18.04/usr/bin:/home/stanislav/.yarn/bin:/home/stanislav/matter-labs/zksync-dev/bin:/home/stanislav/.nvm/versions/node/v14.14.0/bin:/home/stanislav/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin::/usr/local/ssl/bin:/usr/local/go/bin","NODE":"/home/stanislav/.nvm/versions/node/v14.14.0/bin/node","PAPERSIZE":"letter","SESSION_MANAGER":"local/stanislav-ThinkPad-X1-Carbon-Gen-8:@/tmp/.ICE-unix/3797,unix/stanislav-ThinkPad-X1-Carbon-Gen-8:/tmp/.ICE-unix/3797","npm_package_devDependencies__nuxtjs_eslint_config_typescript":"^5.0.0","npm_package_dependencies_postcss":"7.0.32","npm_package_browserslist_development_1":"last 1 firefox version","npm_package_name":"zksync-docs","XDG_MENU_PREFIX":"gnome-","GNOME_TERMINAL_SCREEN":"/org/gnome/Terminal/screen/10b9aeea_890d_4e62_9949_ddf4e293ca6b","LC_ADDRESS":"en_US.UTF-8","XDG_RUNTIME_DIR":"/run/user/1000","npm_package_scripts_fmt":"prettier --write \"docs/**/*.md\"","npm_package_browserslist_development_2":"last 1 safari version","DISPLAY":":0","LANG":"en_US.UTF-8","OPENSSL_DIR":"/usr/local/ssl","XDG_CURRENT_DESKTOP":"ubuntu:GNOME","LC_TELEPHONE":"en_US.UTF-8","npm_package_devDependencies_webpack":"^4.46.0","npm_package_devDependencies_eslint":"^7.20.0","LS_COLORS":"rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:","XDG_SESSION_DESKTOP":"ubuntu","XMODIFIERS":"@im=ibus","GNOME_TERMINAL_SERVICE":":1.79","XAUTHORITY":"/run/user/1000/gdm/Xauthority","npm_lifecycle_script":"sh ./cli-check-env.sh && nuxt","npm_package_devDependencies_dotenv":"8.2.0","SSH_AUTH_SOCK":"/run/user/1000/keyring/ssh","npm_package_dependencies_httpinvoke":"^1.4.0","npm_package_dependencies__nuxtjs_eslint_module":"^3.0.2","npm_package_scripts_cspell":"cspell docs/**/*.md","npm_config_version_git_message":"v%s","LC_NAME":"en_US.UTF-8","SHELL":"/bin/bash","npm_lifecycle_event":"dev","npm_package_stylelint_rules_selector_type_no_unknown_1_ignore_0":"custom-elements","npm_package_husky_hooks_commit_msg":"commitlint --format -E HUSKY_GIT_PARAMS","npm_package_husky_hooks_pre_commit":"lint-staged","npm_package_devDependencies_check_md":"^1.0.1","npm_package_devDependencies__types_babel__preset_env":"^7","npm_package_devDependencies__inkline_nuxt":"^2.3.5","npm_package_dependencies_vue_loader":"^15.9.6","npm_package_dependencies_prism":"^4.1.2","npm_package_dependencies__vue_cli_service":"^4.5.11","npm_package_scripts_docs_dev":"vuepress dev docs","npm_package_scripts_nuxt_ci_build":"yarn run nuxt-ci && yarn run generate --fail-on-error","npm_package_version":"2.1.2","QT_ACCESSIBILITY":"1","WEB3_API":"https://eth-mainnet.alchemyapi.io/v2/ZfzGmD-NkSYIU6wTdpUQkrJnAPKfUC_o","GDMSESSION":"ubuntu","npm_config_argv":"{\"remain\":[],\"cooked\":[\"run\",\"dev\"],\"original\":[\"dev\"]}","npm_package_stylelint_rules_plugin_no_low_performance_animation_properties_1_severity":"warning","npm_package_devDependencies_commitlint":"^11.0.0","npm_package_dependencies__types_prismjs":"^1.16.3","npm_package_scripts_nuxt_ci":"rm -fr node_modules && rm -rf 'public/*' && sh ./cli-check-env.sh && yarn install --immutable  --immutable-cache","LESSCLOSE":"/usr/bin/lesspipe %s %s","npm_package_devDependencies_markdownlint_cli":"^0.24.0","npm_package_dependencies_markdown_it_footnote":"3.0.2","npm_package_dependencies_aos":"^2.3.4","npm_package_check_md_defaultIndex_0":"README.md","LC_MEASUREMENT":"en_US.UTF-8","npm_package_stylelint_rules_plugin_rational_order_0":"true","npm_package_devDependencies_sass_loader":"^10.1.1","npm_package_dependencies_vue_prism_editor":"^1.2.2","npm_config_version_git_tag":"true","npm_config_version_git_sign":"","TEXTDOMAINDIR":"/usr/share/locale/","GPG_AGENT_INFO":"/run/user/1000/gnupg/S.gpg-agent:0:1","LC_IDENTIFICATION":"en_US.UTF-8","npm_package_devDependencies_fork_ts_checker_webpack_plugin":"^6.1.0","npm_package_scripts_lint_ts":"eslint --fix \"**/*.{ts, js, vue}\"","npm_package_scripts_generate":"sh ./cli-check-env.sh && nuxt generate","npm_package_license":"MIT","npm_config_strict_ssl":"true","npm_config_username":"stanislavbezkor","XDG_VTNR":"2","QT_IM_MODULE":"ibus","npm_package_devDependencies__types_babel__core":"^7","npm_package_scripts_format":"prettier --write","PWD":"/home/stanislav/matter-labs/zksync-docs","npm_execpath":"/usr/share/yarn/bin/yarn.js","npm_package_stylelint_rules_sh_waqar_declaration_use_variable_0_0":"/color/","npm_package_scripts_zk_copy":"sh ./cli-merge.sh","CLUTTER_IM_MODULE":"xim","NVM_CD_FLAGS":"","XDG_DATA_DIRS":"/usr/share/ubuntu:/usr/local/share/:/usr/share/:/var/lib/snapd/desktop","XDG_CONFIG_DIRS":"/etc/xdg/xdg-ubuntu:/etc/xdg","npm_package_stylelint_rules_sh_waqar_declaration_use_variable_0_1":"font-size","npm_package_devDependencies_eslint_plugin_prettier_vue":"^2.1.1","npm_package_author_name":"Matter Labs","LC_NUMERIC":"en_US.UTF-8","npm_package_stylelint_rules_sh_waqar_declaration_use_variable_0_2":"font-family","npm_package_devDependencies_eslint_plugin_vue":"^7.6.0","npm_config_save_prefix":"^","npm_config_ignore_optional":"","LC_PAPER":"en_US.UTF-8","npm_package_stylelint_rules_sh_waqar_declaration_use_variable_0_3":"font-weight","VTE_VERSION":"5202","npm_package_lint_staged____ts_tsx__0":"yarn run lint-ts","INIT_CWD":"/home/stanislav/matter-labs/zksync-docs","ZK_SYNC_LIBRARY_PATH":"/home/stanislav/matter-labs/zksync-python/zks-crypto-linux-x64.so","npm_package_stylelint_rules_no_empty_source_0":"true","npm_package_lint_staged____ts_tsx__1":"yarn run format","npm_package_eslintConfig_extends":"@nuxtjs/eslint-config","npm_package_dependencies__babel_preset_env":"7.12.17","npm_config_email":"stanislavbezkor@gmail.com","NODE_ENV":"development","_applied":"true","SENTRY_DSN":"https://1f18c5c8e8fb4f2491be8d9daac67145@o496053.ingest.sentry.io/5635442","SITE_TITLE":"zkSync — Rely on math, not validators","SITE_DESCRIPTION":"zkSync is a ZK rollup solving Ethereum scalability with zero security compromises.","SITE_KEYWORDS":"\"zkSync, Matter Labs, rollup, ZK rollup, zero confirmation, ZKP, zero-knowledge proofs, Ethereum, crypto, blockchain, permissionless, L2, secure payments, scalable","GTAG_ID":"GTM-T5WRP8N"}
    }
    // Only set once

    if (context.req) {
      app.context.req = context.req
    }
    if (context.res) {
      app.context.res = context.res
    }

    if (context.ssrContext) {
      app.context.ssrContext = context.ssrContext
    }
    app.context.redirect = (status, path, query) => {
      if (!status) {
        return
      }
      app.context._redirected = true
      // if only 1 or 2 arguments: redirect('/') or redirect('/', { foo: 'bar' })
      let pathType = typeof path
      if (typeof status !== 'number' && (pathType === 'undefined' || pathType === 'object')) {
        query = path || {}
        path = status
        pathType = typeof path
        status = 302
      }
      if (pathType === 'object') {
        path = app.router.resolve(path).route.fullPath
      }
      // "/absolute/route", "./relative/route" or "../relative/route"
      if (/(^[.]{1,2}\/)|(^\/(?!\/))/.test(path)) {
        app.context.next({
          path,
          query,
          status
        })
      } else {
        path = withQuery(path, query)
        if (process.server) {
          app.context.next({
            path,
            status
          })
        }
        if (process.client) {
          // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
          window.location.replace(path)

          // Throw a redirect error
          throw new Error('ERR_REDIRECT')
        }
      }
    }
    if (process.server) {
      app.context.beforeNuxtRender = fn => context.beforeRenderFns.push(fn)
    }
    if (process.client) {
      app.context.nuxtState = window.__NUXT__
    }
  }

  // Dynamic keys
  const [currentRouteData, fromRouteData] = await Promise.all([
    getRouteData(context.route),
    getRouteData(context.from)
  ])

  if (context.route) {
    app.context.route = currentRouteData
  }

  if (context.from) {
    app.context.from = fromRouteData
  }

  app.context.next = context.next
  app.context._redirected = false
  app.context._errored = false
  app.context.isHMR = Boolean(context.isHMR)
  app.context.params = app.context.route.params || {}
  app.context.query = app.context.route.query || {}
}

export function middlewareSeries (promises, appContext) {
  if (!promises.length || appContext._redirected || appContext._errored) {
    return Promise.resolve()
  }
  return promisify(promises[0], appContext)
    .then(() => {
      return middlewareSeries(promises.slice(1), appContext)
    })
}

export function promisify (fn, context) {
  let promise
  if (fn.length === 2) {
      console.warn('Callback-based asyncData, fetch or middleware calls are deprecated. ' +
        'Please switch to promises or async/await syntax')

    // fn(context, callback)
    promise = new Promise((resolve) => {
      fn(context, function (err, data) {
        if (err) {
          context.error(err)
        }
        data = data || {}
        resolve(data)
      })
    })
  } else {
    promise = fn(context)
  }

  if (promise && promise instanceof Promise && typeof promise.then === 'function') {
    return promise
  }
  return Promise.resolve(promise)
}

// Imported from vue-router
export function getLocation (base, mode) {
  if (mode === 'hash') {
    return window.location.hash.replace(/^#\//, '')
  }

  base = decodeURI(base).slice(0, -1) // consideration is base is normalized with trailing slash
  let path = decodeURI(window.location.pathname)

  if (base && path.startsWith(base)) {
    path = path.slice(base.length)
  }

  const fullPath = (path || '/') + window.location.search + window.location.hash

  return normalizeURL(fullPath)
}

// Imported from path-to-regexp

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
export function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

export function getQueryDiff (toQuery, fromQuery) {
  const diff = {}
  const queries = { ...toQuery, ...fromQuery }
  for (const k in queries) {
    if (String(toQuery[k]) !== String(fromQuery[k])) {
      diff[k] = true
    }
  }
  return diff
}

export function normalizeError (err) {
  let message
  if (!(err.message || typeof err === 'string')) {
    try {
      message = JSON.stringify(err, null, 2)
    } catch (e) {
      message = `[${err.constructor.name}]`
    }
  } else {
    message = err.message || err
  }
  return {
    ...err,
    message,
    statusCode: (err.statusCode || err.status || (err.response && err.response.status) || 500)
  }
}

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
const PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  const tokens = []
  let key = 0
  let index = 0
  let path = ''
  const defaultDelimiter = (options && options.delimiter) || '/'
  let res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    const m = res[0]
    const escaped = res[1]
    const offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    const next = str[index]
    const prefix = res[2]
    const name = res[3]
    const capture = res[4]
    const group = res[5]
    const modifier = res[6]
    const asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    const partial = prefix != null && next != null && next !== prefix
    const repeat = modifier === '+' || modifier === '*'
    const optional = modifier === '?' || modifier === '*'
    const delimiter = res[2] || defaultDelimiter
    const pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter,
      optional,
      repeat,
      partial,
      asterisk: Boolean(asterisk),
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str, slashAllowed) {
  const re = slashAllowed ? /[?#]/g : /[/?#]/g
  return encodeURI(str).replace(re, (c) => {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURIComponentPretty(str, true)
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  const matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))
    }
  }

  return function (obj, opts) {
    let path = ''
    const data = obj || {}
    const options = opts || {}
    const encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      const value = data[token.name || 'pathMatch']
      let segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (let j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

export function addLifecycleHook(vm, hook, fn) {
  if (!vm.$options[hook]) {
    vm.$options[hook] = []
  }
  if (!vm.$options[hook].includes(fn)) {
    vm.$options[hook].push(fn)
  }
}

export const urlJoin = joinURL

export const stripTrailingSlash = withoutTrailingSlash

export const isSamePath = _isSamePath

export function setScrollRestoration (newVal) {
  try {
    window.history.scrollRestoration = newVal;
  } catch(e) {}
}
