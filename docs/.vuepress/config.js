module.exports = {
  title: "zkSync: secure, scalable crypto payments", // adding title gives us a header with search box
  description: "zkSync is a fully trustless user-centric zkRollup protocol for scaling payments and smart contracts on Ethereum.",
  dest: "dist",
  markdown: {
    toc: { includeLevel: [2, 3] },
  },
  extendMarkdown: (md) => {
    // Add support of footnotes (like [^1]) in markdown
    md.use(require("markdown-it-footnote"));
  },
  plugins: [
    [
      "fulltext-search",
      "vuepress-plugin-canonical",
      {
        baseURL: "https://zksync.io", // base url for your canonical link, optional, default: ''
        stripExtension: false, // strip '.html' , optional, default: false
      },
    ],
  ],
  themeConfig: {
    logo: "/LogotypeLight.svg",
    lastUpdated: "Last Updated",
    nav: [
      // {
      //   text: "User Docs",
      //   link: "/faq/",
      // },
      {
        text: "Developer Docs",
        link: "/dev/",
      },
      {
        text: "API Reference",
        link: "/api/",
      },
      {
        text: "Contact",
        link: "/contact.html",
      },
    ],
    //displayAllHeaders: true,
    sidebar: {
      "/legal/": ["/legal/terms", "/legal/privacy"],

      "/dev": [
        {
          title: "Overview",
          path: "/dev/",
          collapsable: false, // optional, defaults to true
        },
        {
          title: "Understanding zkSync",
          path: "/dev/fundamentals",
          collapsable: false,
          children: [
            "/dev/fundamentals/rollups.md",
            "/dev/fundamentals/zkSync.md",
            "/dev/fundamentals/testnet.md",
          ],
        },
        {
          title: "Developer guides",
          path: "/dev/developer-guides",
          collapsable: false,
          children: [
            "/dev/developer-guides/hello-world.md",
            "/dev/developer-guides/contracts/system-contracts.md",
            "/dev/developer-guides/contracts/contracts.md",
            "/dev/developer-guides/contracts/contract-verification.md",
            "/dev/developer-guides/transactions/transactions.md",
            "/dev/developer-guides/transactions/aa.md",
            "/dev/developer-guides/Bridging/bridging-funds.md",
            "/dev/developer-guides/Bridging/l1-l2-interop.md",
            "/dev/developer-guides/Bridging/l1-l2.md",
            "/dev/developer-guides/Bridging/l2-l1.md",
          ],
        },
        {
          title: "Troubleshooting",
          path: "/dev/troubleshooting",
          collapsable: false,
          children: [
            "/dev/troubleshooting/reporting-issues.md",
            "/dev/troubleshooting/important-links.md",
            "/dev/troubleshooting/faq/known-issues.md",
            "/dev/glossary/glossary.md",
            "/dev/glossary/edit-doc.md",
            

          ],
        },
        {
          title: "Tutorials",
          path: "/dev/tutorials",
          collapsable: false,
          children: [
            "/dev/tutorials/cross-chain-tutorial.md",
            "/dev/tutorials/custom-aa-tutorial.md",
            "/dev/tutorials/custom-paymaster-tutorial.md",
          ],
        },
      ],
      "/api": [
        {
          title: "Overview", // required
          path: "/api/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
        },
        {
          title: "Web3 API", // required
          path: "/api/api.md", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "L1 contract interface",
          path: "/api/contracts.md",
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          //children: ["/api/contracts/l1-l2.md"],
        },
        {
          title: "JavaScript SDK", // required
          path: "/api/js", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: ["/api/js/getting-started", "/api/js/providers", "/api/js/accounts", "/api/js/accounts-l1-l2", "/api/js/contracts", "/api/js/features", "/api/js/utils", "/api/js/types", "/api/js/front-end"],
        },
        {
          title: "Hardhat", // required
          path: "/api/hardhat", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1,
          children: [
            "/api/hardhat/getting-started",
            "/api/hardhat/reference",
            "/api/hardhat/testing",
            "/api/hardhat/compiling-libraries"
          ],
        },
      ],
    },
  },
  head: [
    ["script", { src: "/__/firebase/7.13.2/firebase-app.js", defer: true }, ""],
    ["script", { src: "/__/firebase/7.13.2/firebase-analytics.js", defer: true }, ""],
    ["script", { src: "/__/firebase/init.js", defer: true }, ""],
    //Hack: Make clicking on the logo go to home url
    [
      "script",
      {},
      `
   const logoUrlChanger = setInterval(function() {
    //Anchor above the logo image
    const homeEls = document.getElementsByClassName("home-link");
    if(homeEls.length > 0) {
      const homeEl = homeEls[0];
      homeEl.setAttribute("href", "https://zksync.io");
      homeEl.setAttribute("onclick", "document.location='https://zksync.io';return false;");
      clearInterval(logoUrlChanger);
    }

    //Actual logo image
    const logoEls = document.getElementsByClassName("logo")
    if(logoEls.length > 0) {
      const logoEl = logoEls[0]
      logoEl.setAttribute("onclick", "document.location='https://zksync.io';return false;");
      clearInterval(logoUrlChanger);
    }
   }, 1000)`,
    ],
  ],
};
