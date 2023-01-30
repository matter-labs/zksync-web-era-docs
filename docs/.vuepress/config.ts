import { defineUserConfig } from "vuepress";
import docsearchPlugin from "@vuepress/plugin-docsearch";
import theme from "./theme.js";

export default defineUserConfig({
  dest: "dist",

  locales: {
    "/": {
      lang: "en-US",
      title: "zkSync",
      description: "Get an overview of zkSync toolbox, integrations, and how to use them.",
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
