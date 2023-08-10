import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  enhance({ app, router }) {

    if (!__VUEPRESS_SSR__) {
      router.isReady().then(() => {

        const rudderScript = document.createElement('script')
        rudderScript.innerHTML = `
          rudderanalytics = window.rudderanalytics=[];
          for(var methods=["load","page","track","identify","reset"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}
          rudderanalytics.load(__RUDDER_WRITE_KEY__, __RUDDERSTACK_DATA_PLANE_URL__);
        `;
        document.head.appendChild(rudderScript)
        
        const rudderSDK = document.createElement('script')
          rudderSDK.src = `https://cdn.rudderlabs.com/rudder-analytics.min.js`
          rudderSDK.onload = function() { 
            rudderanalytics.page();

            router.afterEach(function (to) {
              rudderanalytics.page();
            })
          }
        document.head.appendChild(rudderSDK)
      })
    }; 
  }
})