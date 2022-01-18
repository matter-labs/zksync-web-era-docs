import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '../src/layouts/error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_sentryserver_1cc25e10 from 'nuxt_plugin_sentryserver_1cc25e10' // Source: ./sentry.server.js (mode: 'server')
import nuxt_plugin_sentryclient_91ee26f0 from 'nuxt_plugin_sentryclient_91ee26f0' // Source: ./sentry.client.js (mode: 'client')
import nuxt_plugin_inkline_46ad5eb0 from 'nuxt_plugin_inkline_46ad5eb0' // Source: ./inkline.js (mode: 'all')
import nuxt_plugin_plugin_48f74394 from 'nuxt_plugin_plugin_48f74394' // Source: ./components/plugin.js (mode: 'all')
import nuxt_plugin_vuescrollto_269f6e3d from 'nuxt_plugin_vuescrollto_269f6e3d' // Source: ./vue-scrollto.js (mode: 'client')
import nuxt_plugin_googlegtag_12e1200a from 'nuxt_plugin_googlegtag_12e1200a' // Source: ./google-gtag.js (mode: 'client')
import nuxt_plugin_workbox_6358bc68 from 'nuxt_plugin_workbox_6358bc68' // Source: ./workbox.js (mode: 'client')
import nuxt_plugin_metaplugin_6bf9c90a from 'nuxt_plugin_metaplugin_6bf9c90a' // Source: ./pwa/meta.plugin.js (mode: 'all')
import nuxt_plugin_iconplugin_62aa7e22 from 'nuxt_plugin_iconplugin_62aa7e22' // Source: ./pwa/icon.plugin.js (mode: 'all')
import nuxt_plugin_main_9266bca6 from 'nuxt_plugin_main_9266bca6' // Source: ../src/plugins/main (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root.$options.$nuxt
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":true,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext, config)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"name":"zkSync — Rely on math, not validators","titleTemplate":"zkSync — Rely on math, not validators","meta":[{"hid":"keywords","name":"keywords","content":"\"zkSync, Matter Labs, rollup, ZK rollup, zero confirmation, ZKP, zero-knowledge proofs, Ethereum, crypto, blockchain, permissionless, L2, secure payments, scalable"},{"hid":"author","name":"author","content":"https:\u002F\u002Fmatter-labs.io"},{"http-equiv":"pragma","content":"no-cache"},{"http-equiv":"cache-control","content":"no-cache , no-store, must-revalidate"},{"http-equiv":"expires","content":"0"},{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"zkSync is a ZK rollup solving Ethereum scalability with zero security compromises."},{"hid":"msapplication-TileImage","name":"msapplication-TileImage","content":"\u002Ficon.png"},{"hid":"theme-color","name":"theme-color","content":"#4e529a"},{"hid":"msapplication-TileColor","property":"msapplication-TileColor","content":"#4e529a"},{"hid":"author","name":"author","content":"https:\u002F\u002Fzksync.io"},{"hid":"publisher","name":"publisher","content":"https:\u002F\u002Fzksync.io"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"zkSync — Rely on math, not validators"},{"hid":"theme-color","name":"theme-color","content":"#4e529a"},{"hid":"og:title","name":"og:title","content":"zkSync — Rely on math, not validators"},{"hid":"og:description","name":"og:description","content":"zkSync is a ZK rollup solving Ethereum scalability with zero security compromises."},{"hid":"og:type","name":"og:type","content":"website"},{"hid":"og:url","name":"og:url","content":"https:\u002F\u002Fzksync.io"},{"hid":"og:image","name":"og:image","content":"https:\u002F\u002Fzksync.io\u002Fsocial.jpg"},{"hid":"og:locale","name":"og:locale","content":"en_US"},{"hid":"og:site_name","name":"og:site_name","content":"zkSync — Rely on math, not validators"},{"hid":"twitter:card","name":"twitter:card","content":"https:\u002F\u002Fzksync.io\u002Fsocial.jpg"},{"hid":"twitter:site","name":"twitter:site","content":"@zksync"},{"hid":"twitter:creator","name":"twitter:creator","content":"@zksync"},{"hid":"twitter:title","name":"twitter:title","content":"zkSync — Rely on math, not validators"},{"hid":"twitter:description","name":"twitter:description","content":"zkSync is a ZK rollup solving Ethereum scalability with zero security compromises."},{"hid":"twitter:image","name":"twitter:image","content":"https:\u002F\u002Fzksync.io\u002Fsocial.jpg"}],"link":[{"rel":"preconnect","href":"https:\u002F\u002Ffonts.gstatic.com"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss2?family=Open+Sans:wght@400;600;700&display=swap"}],"style":[],"script":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (process.server && typeof nuxt_plugin_sentryserver_1cc25e10 === 'function') {
    await nuxt_plugin_sentryserver_1cc25e10(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_sentryclient_91ee26f0 === 'function') {
    await nuxt_plugin_sentryclient_91ee26f0(app.context, inject)
  }

  if (typeof nuxt_plugin_inkline_46ad5eb0 === 'function') {
    await nuxt_plugin_inkline_46ad5eb0(app.context, inject)
  }

  if (typeof nuxt_plugin_plugin_48f74394 === 'function') {
    await nuxt_plugin_plugin_48f74394(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuescrollto_269f6e3d === 'function') {
    await nuxt_plugin_vuescrollto_269f6e3d(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_googlegtag_12e1200a === 'function') {
    await nuxt_plugin_googlegtag_12e1200a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_workbox_6358bc68 === 'function') {
    await nuxt_plugin_workbox_6358bc68(app.context, inject)
  }

  if (typeof nuxt_plugin_metaplugin_6bf9c90a === 'function') {
    await nuxt_plugin_metaplugin_6bf9c90a(app.context, inject)
  }

  if (typeof nuxt_plugin_iconplugin_62aa7e22 === 'function') {
    await nuxt_plugin_iconplugin_62aa7e22(app.context, inject)
  }

  if (typeof nuxt_plugin_main_9266bca6 === 'function') {
    await nuxt_plugin_main_9266bca6(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    router.replace(app.context.route.fullPath, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
