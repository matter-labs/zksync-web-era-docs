import { defineUserConfig } from "vuepress";
import docsearchPlugin from "@vuepress/plugin-docsearch";
import vue from "@vitejs/plugin-vue";
import theme from "./theme.js";
import { pwaPlugin } from "vuepress-plugin-pwa2";
import { getDirname, path } from "@vuepress/utils";
import * as dotenv from 'dotenv'
import { seoPlugin } from "vuepress-plugin-seo2";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";

dotenv.config()


const dirname = getDirname(import.meta.url);

export default defineUserConfig({
  alias: {
    "@theme-hope/modules/navbar/components/Navbar": path.resolve(__dirname, "./components/NavBar.vue"),
  },
  dest: "dist/",

  base: "/",

  title: "Welcome to our Docs - All information you need about zkSync and ZK Stack",

  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Documentation, Developers, Era, zkSync, ZK Stack, Matter Labs, rollup, ZK rollup, zero confirmation, ZKP, zero-knowledge proofs, Ethereum, crypto, blockchain, permissionless, L2, secure payments, scalable",
      },
    ],
    [
      "meta",
      { name: "description", content: "zkSync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and hyperchains. Start with our guides and tutorials, or go deep into our architecture and protocol specification." },
    ],
    ["meta", { name: "author", content: "https://matter-labs.io" }],

    ["meta", { name: "og:image", content: "https://docs.zksync.io/share_image.png" }],
    ["meta", { property: "og:image", content: "https://docs.zksync.io/share_image.png" }],
    ["meta", { name: "og:image:secure_url", content: "https://docs.zksync.io/share_image.png" }],
    ["meta", { name: "og:url", content: "https://docs.zksync.io/" }],
    ["meta", { name: "og:image:alt", content: "zkSync — Accelerating the mass adoption of crypto for personal sovereignty" }],
    ["meta", { property: "og:title", content: "Welcome to our Docs - All information you need about zkSync and ZK Stack" }],
    [
      "meta",
      {
        name: "og:description",
        content: "zkSync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and hyperchains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: "Welcome to our Docs - All information you need about zkSync and ZK Stack" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "zkSync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and hyperchains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.",
      },
    ],
    ["meta", { name: "twitter:image", content: "https://docs.zksync.io/share_image.png" }],
    ["meta", { name: "twitter:site", content: "@zksync" }],
    ["meta", { name: "twitter:creator", content: "@the_matter_labs" }],
    ["meta", { name: "twitter:image:alt", content: "zkSync — Accelerating the mass adoption of crypto for personal sovereignty" }],

    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["link", { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#1E69FF" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["meta", { name: "msapplication-TileColor", content: "#1E69FF" }],
    ["meta", { name: "msapplication-config", content: "/browserconfig.xml" }],
    ["meta", { name: "theme-color", content: "#1755F4" }],
    ["meta", { name: "ahrefs-site-verification", content: "e7c4ecad46da6b349bd70530fe8c272d23dae4ec3095852db8a68155ce87324e" }],

    [
      "script",
      {},
      `
      window.addEventListener('load', function() {
        let contributors = document.querySelectorAll('.contributor');
        let contributorArr = Array.from(contributors);

        if (!contributorArr.length) {
          return;
        }

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

      });

      `,
    ],
  ],

  theme,

  define: {
    __RUDDER_WRITE_KEY__: process.env.RUDDERSTACK_WRITE_KEY,
    __RUDDERSTACK_DATA_PLANE_URL__: process.env.RUDDERSTACK_DATA_PLANE_URL,
  },

  plugins: [
    seoPlugin({
      hostname: "https://docs.zksync.io",
      canonical: "https://docs.zksync.io",
    }),
    pwaPlugin({
      update: "force",
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
    vue({
      template: {
        compilerOptions: {
          // i am ignorning my custom '<container>' tag
          isCustomElement: (tag) => ["ParentLayout"].includes(tag),
        },
      },
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(dirname, "./components"),
    }),
  ],

  shouldPrefetch: false,
});
