module.exports = {
  title: "zkSync 2.0: Developers Documentation", // adding title gives us a header with search box
  description: "zkSync 2.0 also known as zkEVM — ongoing protocol testnet-release, the very 1st ZK Rollup to natively support Solidity smart\n" +
    "contract development.",
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
      {
        text: "User Docs",
        link: "/faq/",
      },
      {
        text: "Developer Docs",
        link: "/dev/",
      },
      {
        text: "API Reference",
        link: "/api/",
      },
      {
        text: "Contact and Media",
        link: "/contact.html",
      },
    ],
    //displayAllHeaders: true,
    sidebar: {
      "/legal/": ["/legal/terms", "/legal/privacy"],
      "/faq/": [
        {
          title: "Welcome to zkSync", // required
          path: "/faq/", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
        },
        {
          title: "Overview", // required
          path: "/faq/intro.html", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Technology", // required
          path: "/faq/tech", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Security", // required
          path: "/faq/security", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Learn By Watching", // required
          path: "/faq/learnbywatching", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Tokens & Fees", // required
          path: "/faq/tokens", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Decentralization", // required
          path: "/faq/decentralization", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Tokenomics", // required
          path: "/faq/tokenomics", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        },
        {
          title: "Privacy", // required
          path: "/faq/privacy", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        }
      ],
      "/dev": [
        {
          title: "Introduction", // required
          path: "/dev/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
        },
        {
          title: "Comparison to v1.0", // required
          path: "/dev/v1-vs-v2.md", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
        },
        {
          title: "Smart contracts", // required
          path: "/dev/contracts/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
        },
        {
          title: "Troubleshooting", // required
          path: "/dev/troubleshooting", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
        }
      ],
      "/api": [
        {
          title: "Overview", // required
          path: "/api/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
        },
        {
          title: "JS Web3 SDK", // required
          path: "/api/sdk/js", // optional, which should be a absolute path.
          collapsable: true, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
        }
      ],
    },
  },
  head: [
    ["script", { src: "/__/firebase/7.13.2/firebase-app.js", defer: true }, ""],
    ["script", { src: "/__/firebase/7.13.2/firebase-analytics.js", defer: true }, ""],
    ["script", { src: "/__/firebase/init.js", defer: true }, ""]
  ],
};
