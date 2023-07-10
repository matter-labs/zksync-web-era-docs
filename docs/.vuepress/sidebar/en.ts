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
      link: "/dev/building-on-zksync/hello-world.md",
      children: [
        "/dev/building-on-zksync/hello-world.md",
        "/dev/building-on-zksync/interacting.md",
        "/dev/building-on-zksync/best-practices.md",
        "/dev/building-on-zksync/useful-address.md",
      ],
    },
    {
      text: "How to",
      link: "/dev/how-to/README.md",
      children: [
        "/dev/how-to/estimate-gas.md",
        "/dev/how-to/send-transaction-l1-l2",
        "/dev/how-to/send-message-l2-l1",
        "/dev/how-to/transfer-token-l2",
        "/dev/how-to/verify-contracts",
      ],
    },
    {
      text: "Tutorials",
      link: "/dev/tutorials/README.md",
      children: [
        "/dev/tutorials/cross-chain-tutorial.md",
        "/dev/tutorials/custom-aa-tutorial.md",
        "/dev/tutorials/aa-daily-spend-limit.md",
        "/dev/tutorials/custom-paymaster-tutorial.md",
        "/dev/tutorials/api3-usd-paymaster-tutorial.md",
      ],
    },
  ],
  "/reference": [
    {
      text: "Technical reference",
      link: "/reference/",
    },
    {
      text: "Concepts",
      link: "/reference/concepts/rollups.md",
      children: [
        "/reference/concepts/rollups.md",
        "/reference/concepts/zkSync.md",
        "/reference/concepts/hyperscaling.md",
        "/reference/concepts/account-abstraction.md",
        "/reference/concepts/transactions.md",
        "/reference/concepts/blocks.md",
        "/reference/concepts/fee-model.md",
        "/reference/concepts/finality.md",
        "/reference/concepts/bridging-asset.md",
        "/reference/concepts/l1-l2-interop.md",
      ],
    },
    {
      text: "Architecture",
      link: "/reference/architecture/differences-with-ethereum.md",
      children: [
        "/reference/architecture/differences-with-ethereum.md",
        "/reference/architecture/system-contracts.md",
        "/reference/architecture/contract-development.md",
        "/reference/architecture/contract-deployment.md",
        "/reference/architecture/events.md",
      ],
    },
    {
      text: "Troubleshooting",
      link: "/reference/troubleshooting/README.md",
      children: [
        "/reference/troubleshooting/changelog.md",
        "/reference/troubleshooting/withdrawal-delay.md",
        "/reference/troubleshooting/audit-bug-bounty.md",
        "/reference/troubleshooting/docs-contribution/docs.md",
        "/reference/troubleshooting/faq.md",
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
      children: ["/api/python/getting-started", "/api/python/providers", "/api/python/accounts", "/api/python/accounts-l1-l2", "/api/python/contracts", "/api/python/types"],
    },
    {
      text: "Go SDK",
      link: "/api/go",
      children: ["/api/go/getting-started", "/api/go/providers", "/api/go/accounts", "/api/go/accounts-l1-l2", "/api/go/contracts", "/api/go/types"],
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
      text: "Block Explorer and Tools", // required
      link: "/tools/block-explorer", // optional, which should be a absolute path.
      children: ["/tools/block-explorer/block-explorer-menu", "/tools/block-explorer/contract-verification"],
    },
  ],
});
