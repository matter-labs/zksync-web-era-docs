import { defineUserConfig } from "vuepress";
import docsearchPlugin from "@vuepress/plugin-docsearch";
import theme from "./theme.js";

export default defineUserConfig({
  dest: "dist",

  base: "/docs/",

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' }],
  ],

  locales: {
    "/": {
      lang: "en-US",
      title: "",
      description: "zkSync is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet.",
    }
  },

  theme,

  plugins: [
    docsearchPlugin({
      appId: "LCWOUB1OFO",
      apiKey: "9a4932a3e119b24ef5f19a85c08d9c81",
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
