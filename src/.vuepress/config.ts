import { defineUserConfig } from "vuepress";
import docsearchPlugin from "@vuepress/plugin-docsearch";
import theme from "./theme.js";

export default defineUserConfig({
  dest: "dist",

  locales: {
    "/": {
      lang: "en-US",
      title: "",
      description: "Accelerating the mass adoption of crypto for personal sovereignty",
    }
  },

  theme,

  plugins: [
    docsearchPlugin({
      appId: "LCWOUB1OFO",
      apiKey: "9a4932a3e119b24ef5f19a85c08d9c81",
      indexName: "v2-zksync",
    }),
  ],

  shouldPrefetch: false,
});
