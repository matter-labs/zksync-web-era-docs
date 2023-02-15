import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar } from "./navbar/index.js";
import { enSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://era.zksync.io",

  author: {
    name: "Matter Labs",
    url: "https://github.com/matter-labs/zksync-web-v2-docs",
  },

  iconAssets: "iconfont",

  logo: "/zk-sync-era-line-light.svg",

  repo: "matter-labs/zksync-web-v2-docs",

  docsDir: "docs",

  pageInfo: ["Original", "Category"],

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,
    },
  },

  editLink: true,
  lastUpdated: true,
  contributors: true,
  footer: "Made with ❤️ by <a href='https://matter-labs.io/'> Matter Labs</a>",
  copyright: false,
  displayFooter: true,


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
