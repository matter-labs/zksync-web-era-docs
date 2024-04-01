import { enNavbar } from "./navbar/index.js";
import { enSidebar } from "./sidebar/index.js";
import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://docs.zksync.io",
  author: {
    name: "Matter Labs",
    url: "https://github.com/matter-labs/zksync-web-era-docs",
  },

  iconAssets: "iconfont",

  logo: "/zksync_logo_black.svg",

  repo: "matter-labs/zksync-web-era-docs",

  docsDir: "/docs/",

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
  footer: `
  
      <div class="footer-social">
        <a href="https://x.com/zksync" target="_blank"><img src="/images/x_logo_black.svg" /></a>
        <a href="https://github.com/matter-labs" target="_blank"><img src="/images/github_logo_black.svg" /></a>
        <a href="https://join.zksync.dev" target="_blank"><img src="/images/discord_logo_black.svg" /></a>
      </div>
      <div class="footer-links">
        <a href="https://github.com/zksync/credo" target="_blank">ZK Credo</a>
        <a href="https://sepolia.explorer.zksync.io/" target="_blank">Block explorer</a>
        <a href="https://zksync.io/explore#bridges" target="_blank">Bridges & Wallets</a>
        <a href="https://github.com/zkSync-Community-Hub/zkync-developers/discussions" target="_blank">GitHub Discussions</a>
        <a href="https://ecosystem.zksync.io/" target="_blank">Ecosystem</a>
        <a href="https://docs.lite.zksync.io/" target="_blank">zkSync Lite Docs (Deprecated)</a>
      </div>

  <p>Made with ❤️ by <a href='https://matter-labs.io/'>Matter Labs</a></p>
  `,

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
