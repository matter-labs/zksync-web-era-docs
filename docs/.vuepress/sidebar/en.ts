import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  //The sidebar for developer guides
  "/build": [
    {
      text: "Introduction",
      link: "/build/building-on-zksync/hello-world.md",
    },
    {
      text: "How to",
      link: "/build/how-to",
      children: ["/build/how-to/estimate-gas.md", ],
    },
    {
      text: "Building on zkSync Era",
      link: "/build/building-on-zksync",
      children: [
        "/build/building-on-zksync/hello-world.md",
        "/build/building-on-zksync/contracts/contract-development.md",
        "/build/building-on-zksync/contracts/differences-with-ethereum.md",
        "/build/building-on-zksync/contracts/contract-deployment.md",
        "/build/building-on-zksync/contracts/contract-verification.md",
        "/build/building-on-zksync/events.md",
        "/build/building-on-zksync/rpc.md",
        "/build/building-on-zksync/useful-address.md",
      ],
    },
    {
      text: "Tutorials",
      link: "/build/tutorials",
      children: [
        "/build/tutorials/cross-chain-tutorial.md",
        "/build/tutorials/custom-aa-tutorial.md",
        "/build/tutorials/aa-daily-spend-limit.md",
        "/build/tutorials/custom-paymaster-tutorial.md",
      ],
    },
    {
      text: "Troubleshooting",
      link: "/build/troubleshooting",
      children: [
        "/build/troubleshooting/changelog.md",
        "/build/troubleshooting/withdrawal-delay.md",
        "/build/troubleshooting/audit-bug-bounty.md",
        "/build/troubleshooting/docs-contribution/docs.md",
        "/build/troubleshooting/docs-contribution/community-resources.md",
        "/build/troubleshooting/faq.md",
        // "/build/troubleshooting/status.md",
        // "/build/troubleshooting/important-links.md",
      ],
    },
  ],
  //The sidebar for Tools and SDKs
  "/concepts": [
    {
      text: "The basics", // required
      link: "/concepts/", // optional, which should be a absolute path.
      children: [ "/concepts/the-basics/rollups.md", "/concepts/the-basics/zkSync.md", "/concepts/the-basics/interacting.md", "/concepts/the-basics/hyperscaling.md", "/concepts/the-basics/videos.md",],
    },
    {
      text: "Understanding zkSync Era",
      link: "/build/buildeloper-guides",
      children: [
        "/concepts/fundamentals/transactions.md",
        "/concepts/fundamentals/blocks.md",
        "/concepts/fundamentals/system-contracts.md",
        "/concepts/fundamentals/aa.md",
        "/concepts/fundamentals/fee-model.md",
        "/concepts/fundamentals/bridging-asset.md",
        "/concepts/fundamentals/l1-l2-interop.md",
        "/concepts/fundamentals/l1-l2.md",
        "/concepts/fundamentals/l2-l1.md",
        "/concepts/fundamentals/security.md",
      ],},
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
        "/api/hardhat/plugins",
        "/api/hardhat/hardhat-zksync-solc",
        "/api/hardhat/hardhat-zksync-vyper",
        "/api/hardhat/hardhat-zksync-deploy",
        "/api/hardhat/hardhat-zksync-chai-matchers",
        "/api/hardhat/hardhat-zksync-verify",
        "/api/hardhat/other-plugins",
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
    {
      text: "GO SDK", // required
      link: "/api/go/getting-started", // optional, which should be a absolute path.
      children: ["/api/go/getting-started"],
    },

    {
      text: "Swift SDK", // required
      link: "/api/swift/getting-started", // optional, which should be a absolute path.
      children: ["/api/swift/getting-started", "/api/swift/providers"],
    },
  ],
  //The legal related sidebar
  "/legal/": ["/legal/terms", "/legal/privacy"],
  //The contact related sidebar
  "/contact/": ["/contact/"],
});
