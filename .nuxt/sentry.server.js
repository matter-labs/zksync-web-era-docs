/** @type {import('@nuxt/types').Module} */
export default function (ctx, inject) {
  const sentry = process.sentry || {}
  inject('sentry', sentry)
  ctx.$sentry = sentry
}
