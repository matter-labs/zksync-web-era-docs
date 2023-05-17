import { defineUserConfig } from "vuepress";
import docsearchPlugin from "@vuepress/plugin-docsearch";
import theme from "./theme.js";
import { pwaPlugin } from "vuepress-plugin-pwa2";
import { getDirname, path } from '@vuepress/utils'

const dirname = getDirname(import.meta.url);

export default defineUserConfig({
  alias: {
    '@theme-hope/components/PageFooter': path.resolve(
      dirname,
      './components/PageFooter.vue',
    ),
  },
  dest: "dist/docs",

  base: "/docs/",
  title: "Welcome to our Docs | zkSync Era",

  head: [
    ['link', { rel: 'canonical', href: 'https://era.zksync.io/docs/' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' }],
    ['meta', { name: "keywords", content: "Documentation, Developers, Era, zkSync, Matter Labs, rollup, ZK rollup, zero confirmation, ZKP, zero-knowledge proofs, Ethereum, crypto, blockchain, permissionless, L2, secure payments, scalable" }],
    ['meta', { name: "description", content: "zkSync Era is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet" }],
    ['meta', { name: "author", content: "https://matter-labs.io" }],


    ['meta', { name: "og:image", content: "/docs/share_image.png" }],
    ['meta', { name: "og:image:secure_url", content: "/docs/share_image.png" }],
    ['meta', { name: "og:url", content: "https://era.zksync.io/docs/" }],
    ['meta', { name: "og:image:alt", content: "zkSync — Accelerating the mass adoption of crypto for personal sovereignty" }],
    ['meta', { name: "og:title", content: "Welcome to our Docs | zkSync Era" }],
    ['meta', { name: "og:description", content: "zkSync Era is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet." }],

    ['meta', { name: "twitter:card", content: "summary_large_image" }],
    ['meta', { name: "twitter:title", content: "Welcome to our Docs | zkSync Era" }],
    ['meta', { name: "twitter:description", content: "zkSync Era is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet." }],
    ['meta', { name: "twitter:image", content: "/docs/share_image.png" }],
    ['meta', { name: "twitter:site", content: "@zksync" }],
    ['meta', { name: "twitter:creator", content: "@the_matter_labs" }],
    ['meta', { name: "twitter:image:alt", content: "zkSync — Accelerating the mass adoption of crypto for personal sovereignty" }],


    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/docs/apple-touch-icon.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/docs/favicon-32x32.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/docs/favicon-16x16.png" }],
    ['link', { rel: "manifest", href: "/docs/site.webmanifest" }],
    ['link', { rel: "mask-icon", href: "/docs/safari-pinned-tab.svg", color: "#1E69FF" }],
    ['link', { rel: "shortcut icon", href: "/docs/favicon.ico" }],
    ['meta', { name: "msapplication-TileColor", content: "#1E69FF" }],
    ['meta', { name: "msapplication-config", content: "/docs/browserconfig.xml" }],
    ['meta', { name: "theme-color", content: "#1E69FF" }],

    [
      "script",
      {},
      `
      window.addEventListener('load', function() {
        let contributors = document.querySelectorAll('.contributor');
        let contributorArr = Array.from(contributors);
        let topFive = contributorArr.slice(0, 5);
      
        topFive.forEach(function(contributor) {
          contributor.textContent = contributor.textContent.replace(',', '');
        });
      
        let lastComma = contributorArr[4];
        lastComma.textContent = lastComma.textContent.replace(',', '');
      
        let updatedList = topFive.map(function(contributor) {
          return contributor.textContent;
        }).join(', ');
          
        let contributorsDiv = document.querySelector('.contributors');
        contributorsDiv.innerHTML = '<span class="label">Contributors: </span>' + updatedList;
      
        console.log('Top 5 contributors:', updatedList);
      });

      `,
    ],
    [
      "script",
      {},
      `
      window.addEventListener('load', function() {
        var target = window.location.href;
        if(target == "http://localhost:8080/docs/") {
          document.querySelector(".homepage").scrollTo(0, document.body.scrollHeight)
        }
        console.log('target', target)
      });
      `,
    ],
  ],
  

  theme,

  plugins: [
    pwaPlugin({
      update: "force"
    }),
    docsearchPlugin({
      appId: "LCWOUB1OFO",
      apiKey: "4f82227774adcb38616b787ed4add1b8",
      indexName: "v2-zksync",
      locales: {
        "/": {
          placeholder: "Search the docs",
          translations: {
            button: {
              buttonText: "Search",
              buttonAriaLabel: "Search docs",
            },
          },
        },
      },
    }),
  ],

  shouldPrefetch: false,
});
