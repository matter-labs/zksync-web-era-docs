import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  //The sidebar for developer guides
  "/dev": [
    {
      text: "Introduction",
      link: "/dev/",
    },
    {
      text: "Getting started",
      link: "/dev/fundamentals",
      children: [ "/dev/building-on-zksync/hello-world.md", 
                  "/dev/fundamentals/interacting.md", ],
    },
    {
      text: "How to",
      link: "/dev/how-to/estimate-gas.md",
      children: [ "/dev/how-to/estimate-gas.md", 
                  "/dev/how-to/send-transaction-l1-l2",
                  "/dev/how-to/send-message-l2-l1",
                  "/dev/how-to/transfer-token-l2" ],
    },
    {
      text: "Tutorials",
      link: "/dev/tutorials",
      children: [
                "/dev/tutorials/cross-chain-tutorial.md",
                "/dev/tutorials/custom-aa-tutorial.md",
                "/dev/tutorials/aa-daily-spend-limit.md",
                "/dev/tutorials/custom-paymaster-tutorial.md",
      ],
    },
    {
      text: "Understanding zkSync Era",
      link: "/dev/developer-guides",
      children: [
        "/dev/fundamentals/rollups.md", 
        "/dev/fundamentals/zkSync.md", 
        "/dev/fundamentals/hyperscaling.md",
        "/dev/developer-guides/transactions/transactions.md",
        "/dev/developer-guides/transactions/blocks.md",
        "/dev/developer-guides/finality.md",
        "/dev/developer-guides/system-contracts.md",
        "/dev/developer-guides/aa.md",
        "/dev/developer-guides/transactions/fee-model.md",
        "/dev/developer-guides/bridging/bridging-asset.md",
        "/dev/developer-guides/bridging/l1-l2-interop.md",
        "/dev/developer-guides/videos.md",
      ],
    },
    {
      text: "Building on zkSync Era",
      link: "/dev/building-on-zksync",
      children: [
        "/dev/building-on-zksync/contracts/contract-development.md",
        "/dev/building-on-zksync/contracts/differences-with-ethereum.md",
        "/dev/building-on-zksync/contracts/contract-deployment.md",
        "/dev/building-on-zksync/contracts/contract-verification.md",
        "/dev/building-on-zksync/events.md",
        "/dev/building-on-zksync/useful-address.md",
      ],
    },
    {
      text: "Troubleshooting",
      link: "/dev/troubleshooting",
      children: [
        "/dev/troubleshooting/important-links.md",
        "/dev/troubleshooting/changelog.md",
        "/dev/troubleshooting/withdrawal-delay.md",
        "/dev/troubleshooting/audit-bug-bounty.md",
        "/dev/troubleshooting/docs-contribution/docs.md",
        "/dev/troubleshooting/docs-contribution/community-resources.md",
        "/dev/troubleshooting/faq.md",
      ],
    },
  ],
    //The sidebar for Tools and SDKs
  "/api": [
    {
      text: "Web3 JSON-RPC API", // required
      link: "/api/api.md", // optional, which should be a absolute path.
    },
    {
      text: "JavaScript SDK", // required
      link: "/api/js", // optional, which should be a absolute path.
      children: [
        "/api/js/getting-started",
        "/api/js/providers",
        "/api/js/accounts",
        "/api/js/accounts-l1-l2",
        "/api/js/contracts",
        "/api/js/features",
        "/api/js/utils",
        "/api/js/paymaster-utils",
        "/api/js/types",
        "/api/js/front-end",
      ],
    },
    {
      text: "Python SDK",
      link: "/api/python",
      children: [
        "/api/python/getting-started",
        "/api/python/providers",
        "/api/python/accounts",
        "/api/python/accounts-l1-l2",
        "/api/python/contract-interface",
        "/api/python/types",
      ],
    },
    {
      text: "Go SDK",
      link: "/api/go",
      children: [
        "/api/go/getting-started",
        "/api/go/providers",
        "/api/go/accounts",
        "/api/go/accounts-l1-l2",
        "/api/go/contract-interface",
        "/api/go/types",
      ],
    },
    {
      text: "Java SDK", // required
      link: "/api/java/getting-started", // optional, which should be a absolute path.
      children: ["/api/java/getting-started"],
    },
  ],
  //The sidebar for Tools and SDKs
  "/tools": [
    {
      text: "Hardhat", // required
      link: "/tools/hardhat", // optional, which should be a absolute path.
      children: [
        "/tools/hardhat/getting-started",
        "/tools/hardhat/migrating-to-zksync",
        {
          text: "Plugins", // required
          link: "/tools/hardhat/plugins", // optional, which should be a absolute path.
          collapsible: true,
          children: [
            "/tools/hardhat/hardhat-zksync-solc",
            "/tools/hardhat/hardhat-zksync-vyper",
            "/tools/hardhat/hardhat-zksync-upgradable",
            "/tools/hardhat/hardhat-zksync-deploy",
            "/tools/hardhat/hardhat-zksync-chai-matchers",
            "/tools/hardhat/hardhat-zksync-verify",
            "/tools/hardhat/other-plugins",
          ],
        },
        "/tools/hardhat/testing",
        "/tools/hardhat/compiling-libraries",
      ],
    },
    {
      text: "Compiler Toolchain",
      link: "/tools/compiler-toolchain",
      children: ["/tools/compiler-toolchain/overview.md", "/tools/compiler-toolchain/solidity.md", "/tools/compiler-toolchain/vyper.md", "/tools/compiler-toolchain/llvm.md"],
    },
    {
      text: "zkSync Era CLI", // required
      link: "/tools/zksync-cli/", // optional, which should be a absolute path.
      children: [],
    },
    {
      text: "Block Explorer", // required
      link: "/tools/block-explorer", // optional, which should be a absolute path.
      children: ["/tools/block-explorer/intro", "/tools/block-explorer/block-view", "/tools/block-explorer/search", "/tools/block-explorer/contract-verification"],
    },
  ],
  //The legal related sidebar
  "/legal/": ["/legal/terms", "/legal/privacy"],
  //The contact related sidebar
  "/contact/": ["/contact/"],
});
