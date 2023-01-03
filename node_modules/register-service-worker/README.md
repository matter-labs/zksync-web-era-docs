# register-service-worker

A script to simplify service worker registration with hooks for common events.

## Usage

**Note:** this script uses ES modules export and is expected to be used with a client side bundler that can handle ES modules syntax.

``` js
import { register } from 'register-service-worker'

register('/service-worker.js', {
  registrationOptions: { scope: './' },
  ready (registration) {
    console.log('Service worker is active.')
  },
  registered (registration) {
    console.log('Service worker has been registered.')
  },
  cached (registration) {
    console.log('Content has been cached for offline use.')
  },
  updatefound (registration) {
    console.log('New content is downloading.')
  },
  updated (registration) {
    console.log('New content is available; please refresh.')
  },
  offline () {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    console.error('Error during service worker registration:', error)
  }
})
```

The `ready`, `registered`, `cached`, `updatefound` and `updated` events passes a [ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration) instance in their arguments.

The `registrationOptions` object will be passed as the second argument to [`ServiceWorkerContainer.register()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameters)
