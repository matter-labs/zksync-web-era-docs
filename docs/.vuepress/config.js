module.exports = {
  title: "zkSync — Accelerating the mass adoption of crypto for personal sovereignty", // adding title gives us a header with search box
  description: "zkSync is a ZK rollup that represents the end-game for scaling Ethereum - one that scales its technology and values without degrading security or decentralization",
  dest: "dist",
  markdown: {
    toc: { includeLevel: [2, 3] },
  },
  extendMarkdown: (md) => {
    // Add support of footnotes (like [^1]) in markdown
    md.use(require("markdown-it-footnote"));
  },
  plugins: [
    "vuepress-plugin-table-of-contents",
    "@vuepress/back-to-top",
    [
      "vuepress-plugin-dehydrate",
      {
        noSSR: "404.html",
        noScript: [],
      },
    ],
    [
      "flexsearch",
      {
        /*
          Plugin custom options
        */
        maxSuggestions: 10, // how many search suggestions to show on the menu, the default is 10.
        searchPaths: null, // an array of paths to search in, keep it null to search all docs.
        searchHotkeys: ["s"], // Hot keys to activate the search input, the default is "s" but you can add more.
        searchResultLength: 60, // the length of the suggestion result text by characters, the default is 60 characters.
        splitHighlightedWords: " ", // regex or string to split highlighted words by, keep it null to use flexsearch.split
        noExtraSpaceAfterHtmlTag: false, // don't add extra spaces in highlighted results
      },
    ],
  ],
  themeConfig: {
    // algolia: {
    //   apiKey: 'LCWOUB1OFO',
    //   indexName: '6c6d0d793fc59f3295143fd50027a372',
    //   appId: 'v2-zksync',
    // },
    repo: "matter-labs/zksync-web-v2-docs",
    editLinks: true,
    docsDir: "docs",
    docsBranch: "main",
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
        text: "Tools/SDKs",
        link: "/api/",
      },
      {
        text: "Contact",
        link: "/contact.html",
      },
      {
        text: "v2.0",
        items: [
          {
            text: "v2.0",
            link: "/dev/",
          },
          {
            text: "v1.x",
            link: "https://docs.zksync.io",
          },
        ],
      },
    ],
    //displayAllHeaders: true,
    sidebar: {
      "/legal/": ["/legal/terms", "/legal/privacy"],

      "/dev": [
        {
          title: "Introduction",
          path: "/dev/",
          collapsable: false, // optional, defaults to true
        },
        {
          title: "Getting started",
          path: "/dev/fundamentals",
          collapsable: false,
          children: ["/dev/fundamentals/rollups.md", "/dev/fundamentals/zkSync.md", "/dev/fundamentals/testnet.md", "/dev/fundamentals/faq.md"],
        },
        {
          title: "Understanding zkSync",
          path: "/dev/developer-guides",
          collapsable: false,
          children: [
            "/dev/developer-guides/transactions/transactions.md",
            "/dev/developer-guides/transactions/blocks.md",
            "/dev/developer-guides/contracts/system-contracts.md",
            "/dev/developer-guides/aa.md",
            "/dev/developer-guides/security.md",
            "/dev/developer-guides/transactions/fee-model.md",
            "/dev/developer-guides/bridging/bridging-asset.md",
            "/dev/developer-guides/bridging/l1-l2-interop.md",
            "/dev/developer-guides/bridging/l1-l2.md",
            "/dev/developer-guides/bridging/l2-l1.md",
          ],
        },
        {
          title: "Building on zkSync",
          path: "/dev/developer-guides/building-on-zksync",
          collapsable: false,
          children: [
            "/dev/developer-guides/hello-world.md",
            "/dev/developer-guides/contracts/contracts.md",
            "/dev/developer-guides/contracts/contract-deployment.md",
            "/dev/developer-guides/contracts/contract-verification.md",
            "/dev/developer-guides/building-on-zksync/events.md",
            "/dev/developer-guides/building-on-zksync/rpc.md",
            "/dev/developer-guides/building-on-zksync/videos.md",
          ],
        },
        {
          title: "Tutorials",
          path: "/dev/tutorials",
          collapsable: false,
          children: ["/dev/tutorials/cross-chain-tutorial.md", "/dev/tutorials/custom-aa-tutorial.md", "/dev/tutorials/custom-paymaster-tutorial.md"],
        },
        {
          title: "Troubleshooting",
          path: "/dev/troubleshooting",
          collapsable: false,
          children: [
            "/dev/troubleshooting/important-links.md",
            "/dev/troubleshooting/status.md",
            "/dev/troubleshooting/docs-contribution/docs.md",
            "/dev/troubleshooting/docs-contribution/community-resources.md",
            "/dev/troubleshooting/known-issues.md",
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
        // {
        //   title: "L1 contract interface",
        //   path: "/api/contracts.md",
        //   collapsable: false, // optional, defaults to true
        //   sidebarDepth: 1, // optional, defaults to 1
        //   //children: ["/api/contracts/l1-l2.md"],
        // },
        {
          title: "JavaScript SDK", // required
          path: "/api/js", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: [
            "/api/js/getting-started",
            "/api/js/providers",
            "/api/js/accounts",
            "/api/js/accounts-l1-l2",
            "/api/js/contracts",
            "/api/js/features",
            "/api/js/utils",
            "/api/js/types",
            "/api/js/front-end",
          ],
        },
        {
          title: "Python SDK", // required
          path: "/api/python/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: ["/api/python/getting-started"],
        },
        {
          title: "Java SDK", // required
          path: "/api/java/getting-started", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: ["/api/java/getting-started"],
        },
        {
          title: "GO SDK", // required
          path: "/api/go/getting-started", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: ["/api/go/getting-started"],
        },
        {
          title: "Hardhat", // required
          path: "/api/hardhat", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1,
          children: ["/api/hardhat/getting-started", "/api/hardhat/plugins", "/api/hardhat/testing", "/api/hardhat/compiling-libraries"],
        },
        {
          title: "Block Explorer", // required
          path: "/api/tools/block-explorer", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1, // optional, defaults to 1
          children: ["/api/tools/block-explorer/intro", "/api/tools/block-explorer/block-view", "/api/tools/block-explorer/contract-verification"],
        },
        {
          title: "zkSync CLI", // required
          path: "/api/tools/zksync-cli/", // optional, which should be a absolute path.
          collapsable: false, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
        },
      ],
    },
    //<! -- OLD STRUTURE -->
    // {
    //   title: "Getting started",
    //   path: "/dev/",
    //   collapsable: false, // optional, defaults to true
    // },
    // {
    //   title: "About the testnet",
    //   path: "/dev/testnet",
    //   collapsable: false,
    //   children: [
    //     "/dev/testnet/user.md",
    //     "/dev/testnet/metamask.md",
    //     "/dev/testnet/important-links.md",
    //     "/dev/testnet/status.md",
    //     "/dev/testnet/known-issues.md",
    //     "/dev/testnet/reporting-issues.md",
    //   ],
    // },
    // {
    //   title: "ZK rollup basics",
    //   path: "/dev/rollups.md",
    //   collapsable: false
    // },
    // {
    //   title: "Understanding zkSync 2.0",
    //   path: "/dev/zksync-v2",
    //   collapsable: false,
    //   children: [
    //     "/dev/zksync-v2/overview.md",
    //     "/dev/zksync-v2/system-contracts.md",
    //     "/dev/zksync-v2/handling-of-eth.md",
    //     "/dev/zksync-v2/fee-model.md",
    //     "/dev/zksync-v2/tx-types.md",
    //     "/dev/zksync-v2/contracts.md",
    //     "/dev/zksync-v2/aa.md",
    //     "/dev/zksync-v2/blocks-and-time.md",
    //     "/dev/zksync-v2/web3.md",
    //     "/dev/zksync-v2/confirmation-and-finality.md",
    //     "/dev/zksync-v2/temp-limits.md",
    //     "/dev/zksync-v2/decentralization-roadmap.md",
    //     "/dev/zksync-v2/l1-l2-interop.md",
    //     "/dev/zksync-v2/bridging-funds.md",
    //   ],
    // },
    // {
    //   title: "Developer guide",
    //   path: "/dev/guide",
    //   collapsable: false,
    //   children: [
    //     "/dev/guide/quickstart.md",
    //     "/dev/guide/hello-world.md",
    //     "/dev/guide/contract-verification.md",
    //     "/dev/guide/solidity-vyper.md",
    //     "/dev/guide/deploying.md",
    //     "/dev/guide/front-end-integration.md",
    //     "/dev/guide/l1-l2.md",
    //     "/dev/guide/l2-l1.md",
    //     "/dev/guide/build-custom-bridge.md",
    //     "/dev/guide/cross-chain-tutorial.md",
    //     "/dev/guide/custom-aa-tutorial.md",
    //     "/dev/guide/custom-paymaster-tutorial.md",
    //     "/dev/guide/migration-to-testnet-paymaster.md"
    //   ],
  },
  // {
  //   title: "Introduction", // required
  //   path: "/dev/", // optional, which should be a absolute path.
  //   collapsable: false, // optional, defaults to true
  // },
  // {
  //   title: "Comparison to v1.0", // required
  //   path: "/dev/v1-vs-v2.md", // optional, which should be a absolute path.
  //   collapsable: false, // optional, defaults to true
  // },
  // {
  //   title: "Comparison to Ethereum", // required
  //   path: "/dev/ethereum-vs-v2.md", // optional, which should be a absolute path.
  //   collapsable: false, // optional, defaults to true
  // },
  // {
  //   title: "Tutorials",
  //   path: "/dev/tutorials",
  //   collapsable: false,
  //   children: ["/dev/tutorials/connecting-to-metamask.md", "/dev/tutorials/bridging-funds.md", "/dev/tutorials/basic.md"],
  // },
  // {
  //   title: "Communicating with L1", // required
  //   path: "/dev/communication-with-l1.md", // optional, which should be a absolute path.
  //   collapsable: false, // optional, defaults to true
  // },
  // {
  //   title: "Troubleshooting",
  //   path: "/dev/troubleshooting.md", // optional, which should be a absolute path.
  // }

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
