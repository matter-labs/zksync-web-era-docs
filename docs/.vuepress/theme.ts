import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar } from "./navbar/index.js";
import { enSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://v2-docs.zksync.io/",

  author: {
    name: "Matter Labs",
    url: "https://github.com/matter-labs/zksync-web-v2-docs",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "matter-labs/zksync-web-v2-docs",

  docsDir: "docs",

  pageInfo: ["Original", "Category"],

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "Made with ❤️ by <a href='https://matter-labs.io/'> Matterlabs</a>",
      copyright: false,

      displayFooter: true,
      lastUpdated:true,
      contributors: true,

      metaLocales: {
        editLink: "Edit this page",
      },
    },
  },

  plugins: {
    copyCode: {
      showInMobile: true,
      duration: 0,
      pure: true,
      delay: 800,
    },
    mdEnhance: {
      align: true,
      codetabs: true,
      demo: true,
      flowchart: true,
      footnote: true,
      imgMark: true,
      katex: true,
      mermaid: true,
      presentation: true,
      sub: true,
      sup: true,
      vPre: true,
    },
  },
});
