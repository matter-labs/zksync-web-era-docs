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
      link: "/dev/tutorials.md",
      children: [
        { text: "Community", link: "/dev/community-tutorials/README.md", children: [] },
        { text: "zkSync Team", link: "/dev/tutorials/README.md", children: [
          "/dev/tutorials/cross-chain-tutorial.md",
          "/dev/tutorials/custom-aa-tutorial.md",
          "/dev/tutorials/aa-daily-spend-limit.md",
          "/dev/tutorials/custom-paymaster-tutorial.md",
          "/dev/tutorials/api3-usd-paymaster-tutorial.md",
          "/dev/tutorials/gated-nft-paymaster-tutorial.md",
        ]},
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
        {
          text: "JavaScript Ethers V5 SDK",
          link: "/api/js",
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
          text: "JavaScript Ethers V6 SDK",
          link: "/api/js/zksync2-js",
          children: [
            {
              text: "Getting started",
              link: "/api/js/zksync2-js/getting-started",
              collapsible: true,
              children: [
                "/api/js/zksync2-js/examples/deposit",
                "/api/js/zksync2-js/examples/transfer",
                "/api/js/zksync2-js/examples/withdraw",
                "/api/js/zksync2-js/examples/get-confirmed-tokens",
                "/api/js/zksync2-js/examples/create",
                "/api/js/zksync2-js/examples/create2",
                "/api/js/zksync2-js/examples/custom-paymaster/deploy-token",
                "/api/js/zksync2-js/examples/custom-paymaster/deploy-account",
                "/api/js/zksync2-js/examples/custom-paymaster/use-paymaster",
              ],
            },
            "/api/js/zksync2-js/providers",
            "/api/js/zksync2-js/accounts",
            "/api/js/zksync2-js/accounts-l1-l2",
            "/api/js/zksync2-js/contracts",
            "/api/js/zksync2-js/features",
            "/api/js/zksync2-js/utils",
            "/api/js/zksync2-js/paymaster-utils",
            "/api/js/zksync2-js/types",
            "/api/js/zksync2-js/front-end",
            "/api/js/zksync2-js/migration"
          ],
        }
      ]
    },
    {
      text: "Python SDK",
      link: "/api/python",
      children: ["/api/python/getting-started", "/api/python/providers", "/api/python/accounts", "/api/python/accounts-l1-l2", "/api/python/contracts", "/api/python/types"],
    },
    {
      text: "Go SDK",
      link: "/api/go",
      children: [
        {
          text: "Getting started",
          link: "/api/go/getting-started",
          collapsible: true,
          children: [
            "/api/go/examples/deposit",
            "/api/go/examples/transfer",
            "/api/go/examples/withdraw",
            "/api/go/examples/get-confirmed-tokens",
            "/api/go/examples/create",
            "/api/go/examples/create2",
            "/api/go/examples/custom-paymaster/deploy-token",
            "/api/go/examples/custom-paymaster/deploy-account",
            "/api/go/examples/custom-paymaster/use-paymaster",
          ],
        },

        "/api/go/clients",
        "/api/go/accounts",
        "/api/go/accounts-l1-l2",
        "/api/go/contracts",
        "/api/go/features",
        "/api/go/paymaster-utils",
        "/api/go/utils",
        {
          text: "Types",
          link: "/api/go/types/intro",
          collapsible: true,
          children: ["/api/go/types/types", "/api/go/types/eip712", "/api/go/types/clients", "/api/go/types/accounts"],
        },
      ],
    },
    {
      text: "Java SDK", // required
      link: "/api/java/getting-started", // optional, which should be a absolute path.
      children: ["/api/java", "/api/java/providers", "/api/java/accounts", "/api/java/accounts-l1-l2"],
    },
    {
      text: "Rust SDK", // required
      link: "/api/rust/getting-started", // optional, which should be a absolute path.
      children: [
        "/api/rust",
        "/api/rust/getting-started",
        "/api/rust/contract-deployment-and-interaction"
      ],
    },
  ],
  //The sidebar for Tools and SDKs
  "/tools": [
    {
      text: "Developer tools", // required
      link: "/tools/", // optional, which should be a absolute path.
      children: [],
    },
    {
      text: "zkSync Era CLI", // required
      link: "/tools/zksync-cli/", // optional, which should be a absolute path.
      children: [],
    },
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
            "/tools/hardhat/hardhat-zksync-verify-vyper",
            "/tools/hardhat/hardhat-zksync-zksync2js",
            "/tools/hardhat/other-plugins",
          ],
        },
        "/tools/hardhat/compiling-libraries",
      ],
    },
    {
      text: "Testing", // required
      link: "/tools/testing/", // optional, which should be a absolute path.
      children: ["/tools/testing/dockerized-testing.md", "/tools/testing/era-test-node.md"],
    },
    {
      text: "Compiler Toolchain",
      link: "/tools/compiler-toolchain",
      children: ["/tools/compiler-toolchain/overview.md", "/tools/compiler-toolchain/solidity.md", "/tools/compiler-toolchain/vyper.md", "/tools/compiler-toolchain/llvm.md"],
    },
    {
      text: "Block Explorer", // required
      link: "/tools/block-explorer", // optional, which should be a absolute path.
      children: ["/tools/block-explorer/block-explorer-menu", "/tools/block-explorer/contract-verification", "/tools/block-explorer/block-explorer-api"],
    },
  ],
});
