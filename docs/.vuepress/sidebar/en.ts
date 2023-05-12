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
      children: ["/dev/fundamentals/rollups.md", "/dev/fundamentals/zkSync.md", "/dev/fundamentals/interacting.md", "/dev/fundamentals/hyperscaling.md"],
    },
    {
      text: "Understanding zkSync Era",
      link: "/dev/developer-guides",
      children: [
        "/dev/developer-guides/transactions/transactions.md",
        "/dev/developer-guides/transactions/blocks.md",
        "/dev/developer-guides/system-contracts.md",
        "/dev/developer-guides/aa.md",
        "/dev/developer-guides/transactions/fee-model.md",
        "/dev/developer-guides/bridging/bridging-asset.md",
        "/dev/developer-guides/bridging/l1-l2-interop.md",
        "/dev/developer-guides/bridging/l1-l2.md",
        "/dev/developer-guides/bridging/l2-l1.md",
        "/dev/developer-guides/videos.md",
      ],
    },
    {
      text: "Building on zkSync Era",
      link: "/dev/building-on-zksync",
      children: [
        "/dev/building-on-zksync/hello-world.md",
        "/dev/building-on-zksync/contracts/contract-development.md",
        "/dev/building-on-zksync/contracts/differences-with-ethereum.md",
        "/dev/building-on-zksync/contracts/contract-deployment.md",
        "/dev/building-on-zksync/contracts/contract-verification.md",
        "/dev/building-on-zksync/events.md",
        "/dev/building-on-zksync/rpc.md",
        "/dev/building-on-zksync/useful-address.md",
      ],
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
      text: "Overview", // required
      link: "/api/", // optional, which should be a absolute path.
    },
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
      text: "Hardhat", // required
      link: "/api/hardhat", // optional, which should be a absolute path.
      children: [
        "/api/hardhat/getting-started",
        "/api/hardhat/migrating-to-zksync",
        {
          text: "Plugins", // required
          link: "/api/hardhat/plugins", // optional, which should be a absolute path.
          collapsible: true,
          children: [
            "/api/hardhat/hardhat-zksync-solc",
            "/api/hardhat/hardhat-zksync-vyper",
            "/api/hardhat/hardhat-zksync-upgradable",
            "/api/hardhat/hardhat-zksync-deploy",
            "/api/hardhat/hardhat-zksync-chai-matchers",
            "/api/hardhat/hardhat-zksync-verify",
            "/api/hardhat/other-plugins",
          ],
        },
        "/api/hardhat/testing",
        "/api/hardhat/compiling-libraries",
      ],
    },
    {
      text: "Block Explorer", // required
      link: "/api/tools/block-explorer", // optional, which should be a absolute path.
      children: ["/api/tools/block-explorer/intro", "/api/tools/block-explorer/block-view", "/api/tools/block-explorer/search", "/api/tools/block-explorer/contract-verification"],
    },
    {
      text: "Compiler Toolchain",
      link: "/api/compiler-toolchain",
      children: ["/api/compiler-toolchain/overview.md", "/api/compiler-toolchain/solidity.md", "/api/compiler-toolchain/vyper.md", "/api/compiler-toolchain/llvm.md"],
    },
    {
      text: "zkSync Era CLI", // required
      link: "/api/tools/zksync-cli/", // optional, which should be a absolute path.
      children: [],
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
      text: "Java SDK", // required
      link: "/api/java/getting-started", // optional, which should be a absolute path.
      children: ["/api/java/getting-started"],
    },
  ],
  //The legal related sidebar
  "/legal/": ["/legal/terms", "/legal/privacy"],
  //The contact related sidebar
  "/contact/": ["/contact/"],
});
