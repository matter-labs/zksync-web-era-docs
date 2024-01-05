import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/build": [
    {
      text: "Quick Start",
      collapsible: true,
      children: [
        {
          text: "Hello World",
          link: "/build/quick-start/hello-world.md"
        },
        {
          text: "Interacting w/ zkSync Era",
          link: "/build/quick-start/interacting.md"
        },
        {
          text: "Security and best practices",
          link: "/build/quick-start/best-practices.md"
        },
        {
          text: "Useful addresses",
          link: "/build/quick-start/useful-address.md"
        },
        {
          text: "Add zkSync to MetaMask",
          link: "/build/quick-start/add-zksync-to-metamask.md"
        },
      ]
    },
    {
      text: "Tutorials",
      collapsible: true,
      children: [
        {
          text: "Smart Contract Development",
          collapsible: true,
          children: [
            {
              text: "Account Abstraction Examples",
              collapsible: false,
              children: [
                {
                  text: "Account Abstraction",
                  link: "/build/tutorials/smart-contract-development/account-abstraction/account-abstraction.md"
                },
                {
                  text: "Daily Spending Limit Account",
                  link: "/build/tutorials/smart-contract-development/account-abstraction/daily-spend-limit.md"
                },
                {
                  text: "Account Abstraction Multisig",
                  link: "/build/tutorials/smart-contract-development/account-abstraction/custom-aa-tutorial.md"
                },
              ]
            },
            {
              text: "Paymaster Examples",
              collapsible: false,
              children: [
                {
                  text: "Building a custom paymaster",
                  link: "/build/tutorials/smart-contract-development/paymasters/custom-paymaster-tutorial.md"
                },
                {
                  text: "Gasless",
                  link: "/build/tutorials/smart-contract-development/paymasters/gasless.md",
                },
                {
                  text: "AllowList",
                  link: "/build/tutorials/smart-contract-development/paymasters/allowlist.md",
                },
                {
                  text: "TimeBased",
                  link: "/build/tutorials/smart-contract-development/paymasters/timebased.md",
                },
                {
                  text: "ERC20Fixed",
                  link: "/build/tutorials/smart-contract-development/paymasters/erc20fixed.md",
                },
              ]
            },
            {
              text: "Cross-chain governance",
              link: "/build/tutorials/smart-contract-development/cross-chain-tutorial.md"
            },
          ],
        },
        {
          text: "dApp Development",
          collapsible: true,
          children: [
            {
              text: "Hello World w/ Front-End UI",
              link: "/build/quick-start/hello-world.md"
            },
            {
              text: "NFT Gated Paymaster",
              link: "/build/tutorials/dapp-development/gated-nft-paymaster-tutorial.md",
            },
          ],
        },
        {
          text: "Tooling Guides",
          collapsible: true,
          children: [
            {
              text: "WalletConnect",
              link: "/build/tutorials/tooling-guides/wallet-connect.md"
            },
            {
              text: "wagmi",
              link: "/build/tutorials/tooling-guides/wagmi.md",
            },
            {
              text: "API3",
              link: "/build/tutorials/tooling-guides/api3.md",
            },
            {
              text: "DIA",
              link: "/build/tutorials/tooling-guides/dia.md",
            },
            {
              text: "Redstone",
              link: "/build/tutorials/tooling-guides/redstone.md",
            },
            {
              text: "The Graph",
              link: "/build/tutorials/tooling-guides/the-graph.md",
            },
            {
              text: "SubQuery",
              link: "/build/tutorials/tooling-guides/subquery.md",
            },
            {
              text: "LayerZero",
              link: "/build/tutorials/tooling-guides/layerzero.md",
            },
          ],
        },
        {
          text: "How to",
          collapsible: true,
          children: [
            {
              text: "Estimate Gas",
              link: "/build/tutorials/how-to/estimate-gas.md"
            },
            {
              text: "Send an L1 to L2 Transaction",
              link: "/build/tutorials/how-to/send-transaction-l1-l2.md"
            },
            {
              text: "Send an L2 to L1 message",
              link: "/build/tutorials/how-to/send-message-l2-l1.md"
            },
            {
              text: "Transfer Token",
              link: "/build/tutorials/how-to/transfer-token-l2.md"
            },
            {
              text: "Verify Contracts with Hardhat",
              link: "/build/tutorials/how-to/verify-contracts.md"
            },
          ],
        },
      ]
    },
    {
      text: "Tooling",
      collapsible: true,
      children: [
        {
          text: "Block Explorer",
          collapsible: true,
          children: [
            {
              text: "Getting Started",
              link: "/build/tooling/block-explorer/getting-started.md",
            },
            {
              text: "Block Explorer menu",
              link: "/build/tooling/block-explorer/block-explorer-menu",
            },
            {
              text: "Contract verification",
              link: "/build/tooling/block-explorer/contract-verification",
            },
            {
              text: "Block Explorer API",
              link: "/build/tooling/block-explorer/block-explorer-api",
            },
            {
              text: "Other Block Explorers",
              link: "/build/tooling/block-explorer/block-explorers.md",
            },
          ],
        },
        {
          text: "zkSync Era CLI",
          collapsible: true,
          children: [
            "/build/tooling/zksync-cli/getting-started.md",
            "/build/tooling/zksync-cli/examples/contract-interaction.md"
          ]
        },
        {
          text: "Hardhat Plugins",
          collapsible: true,
          children: [
            "/build/tooling/hardhat/getting-started.md",
            "/build/tooling/hardhat/migrating-to-zksync.md",
            "/build/tooling/hardhat/compiling-libraries",
            "/build/tooling/hardhat/hardhat-zksync-solc.md",
            "/build/tooling/hardhat/hardhat-zksync-vyper.md",
            "/build/tooling/hardhat/hardhat-zksync-deploy.md",
            "/build/tooling/hardhat/hardhat-zksync-upgradable.md",
            "/build/tooling/hardhat/hardhat-zksync-chai-matchers.md",
            "/build/tooling/hardhat/hardhat-zksync-verify.md",
            "/build/tooling/hardhat/hardhat-zksync-verify-vyper.md",
            "/build/tooling/hardhat/hardhat-zksync-toolbox.md",
            "/build/tooling/hardhat/other-plugins.md",
          ]
        },
        {
          text: "Bridges",
          collapsible: true,
          children: [
            {
              text: "Deposit ETH to L2",
              link: "/build/tooling/bridges/deposit-eth-to-l2.md",
            },
            {
              text: "Deposit ERC-20 to L2",
              link: "/build/tooling/bridges/deposit-erc-20-to-l2.md",
            },
            {
              text: "Withdraw ETH to L1",
              link: "/build/tooling/bridges/withdraw-eth-to-l1.md",
            },
            {
              text: "Withdraw ERC-20 to L1",
              link: "/build/tooling/bridges/withdraw-erc-20-to-l1.md",
            },
          ]
        },
        // {
        //   text: "Compiler Overview",
        //   link: "/build/tooling/compiler-overview.md"
        // },
        {
          text: "Community",
          collapsible: true,
          children: [
            {
              text: "Bridges",
              link: "/build/tooling/bridges/all-bridges.md",
            },
            {
              text: "Cross Chain",
              link: "/build/tooling/cross-chain.md"
            },
            {
              text: "Data Indexers",
              link: "/build/tooling/data-indexers.md"
            },
            {
              text: "Monitoring",
              link: "/build/tooling/monitoring.md"
            },
            {
              text: "Network Faucets",
              link: "/build/tooling/network-faucets.md"
            },
            {
              text: "RPC Providers",
              link: "/build/tooling/node-providers.md"
            },
            {
              text: "Oracles",
              link: "/build/tooling/oracles.md"
            },
            {
              text: "Wallets",
              link: "/build/tooling/wallets.md"
            },
            {
              text: "NFT Marketplaces",
              link: "/build/tooling/nft-marketplaces.md"
            },
            {
              text: "IDE",
              link: "/build/tooling/ide.md"
            },
          ]
        },
    
      ],
    },
    {
      text: "Test & Debug",
      collapsible: true,
      children: [
        {
          text: "Getting Started",
          link: "/build/test-and-debug/getting-started.md"
        },
        {
          text: "Docker L1 - L2 Nodes",
          link: "/build/test-and-debug/dockerized-l1-l2-nodes.md"
        },
        {
          text: "In-Memory Node",
          link: "/build/test-and-debug/era-test-node.md"
        },
        {
          text: "Continuous Integration (CI)",
          link: "/build/test-and-debug/continuous-integration.md"
        },
        {
          text: "Hardhat",
          link: "/build/test-and-debug/hardhat.md"
        },
        {
          text: "Foundry",
          link: "/build/test-and-debug/foundry.md"
        },
      ]
    },
    {
      text: "SDKs",
      collapsible: true,
      children: [
        {
          text: "JavaScript",
          link: "/build/sdks/js",
          children: [
            {
              text: "JavaScript Ethers V5",
              collapsible: true,
              children: [
                "/build/sdks/js/getting-started",
                "/build/sdks/js/providers",
                "/build/sdks/js/accounts",
                "/build/sdks/js/accounts-l1-l2",
                "/build/sdks/js/contracts",
                "/build/sdks/js/features",
                "/build/sdks/js/utils",
                "/build/sdks/js/paymaster-utils",
                "/build/sdks/js/types",
                "/build/sdks/js/front-end",
              ],
            },
            {
              text: "JavaScript Ethers V6",
              collapsible: true,
              children: [
                {
                  text: "Getting started",
                  collapsible: true,
                  children: [
                    "/build/sdks/js/zksync-ethers/getting-started",
                    "/build/sdks/js/zksync-ethers/examples/deposit",
                    "/build/sdks/js/zksync-ethers/examples/transfer",
                    "/build/sdks/js/zksync-ethers/examples/withdraw",
                    "/build/sdks/js/zksync-ethers/examples/get-confirmed-tokens",
                    "/build/sdks/js/zksync-ethers/examples/create",
                    "/build/sdks/js/zksync-ethers/examples/create2",
                    "/build/sdks/js/zksync-ethers/examples/custom-paymaster/deploy-token",
                    "/build/sdks/js/zksync-ethers/examples/custom-paymaster/deploy-account",
                    "/build/sdks/js/zksync-ethers/examples/custom-paymaster/use-paymaster",
                  ],
                },
                "/build/sdks/js/zksync-ethers/providers",
                "/build/sdks/js/zksync-ethers/accounts",
                "/build/sdks/js/zksync-ethers/accounts-l1-l2",
                "/build/sdks/js/zksync-ethers/contracts",
                "/build/sdks/js/zksync-ethers/features",
                "/build/sdks/js/zksync-ethers/utils",
                "/build/sdks/js/zksync-ethers/paymaster-utils",
                "/build/sdks/js/zksync-ethers/types",
                "/build/sdks/js/zksync-ethers/front-end",
                "/build/sdks/js/zksync-ethers/migration"
              ],
            }
          ]
        },
        {
          text: "Python",
          collapsible: true,
          children: [
            "/build/sdks/python/getting-started",
            "/build/sdks/python/providers",
            "/build/sdks/python/accounts",
            "/build/sdks/python/accounts-l1-l2",
            "/build/sdks/python/contracts",
            "/build/sdks/python/types"
          ],
        },
        {
          text: "Go",
          collapsible: true,
          children: [
            {
              text: "Getting started",
              collapsible: true,
              children: [
                "/build/sdks/go/getting-started",
                "/build/sdks/go/examples/deposit",
                "/build/sdks/go/examples/transfer",
                "/build/sdks/go/examples/withdraw",
                "/build/sdks/go/examples/get-confirmed-tokens",
                "/build/sdks/go/examples/create",
                "/build/sdks/go/examples/create2",
                "/build/sdks/go/examples/custom-paymaster/deploy-token",
                "/build/sdks/go/examples/custom-paymaster/deploy-account",
                "/build/sdks/go/examples/custom-paymaster/use-paymaster",
              ],
            },
            "/build/sdks/go/clients",
            "/build/sdks/go/accounts",
            "/build/sdks/go/accounts-l1-l2",
            "/build/sdks/go/contracts",
            "/build/sdks/go/features",
            "/build/sdks/go/paymaster-utils",
            "/build/sdks/go/utils",
            {
              text: "Types",
              collapsible: true,
              children: [
                "/build/sdks/go/types/intro",
                "/build/sdks/go/types/types",
                "/build/sdks/go/types/eip712",
                "/build/sdks/go/types/clients",
                "/build/sdks/go/types/accounts"
              ],
            },
          ],
        },
        {
          text: "Java", // required
          collapsible: true,
          children: [
            "/build/sdks/java",
            "/build/sdks/java/providers",
            "/build/sdks/java/accounts",
            "/build/sdks/java/accounts-l1-l2"
          ],
        },
        {
          text: "Rust",
          collapsible: true,
          children: [
            "/build/sdks/rust",
            "/build/sdks/rust/getting-started",
            "/build/sdks/rust/contract-deployment-and-interaction"
          ],
        },
      ]
    },
    {
      text: "🌐 API Reference",
      link: "/build/api.md"
    },
    {
      text: "Developer Reference",
      collapsible: true,
      children: [
        "/build/technical-reference/rollups.md",
        "/build/technical-reference/zkSync.md",
        "/build/technical-reference/differences-with-ethereum.md",
        "/build/technical-reference/system-contracts.md",
        "/build/technical-reference/bridging-asset.md",
        "/build/technical-reference/contract-development.md",
        "/build/technical-reference/contract-deployment.md",
        "/build/technical-reference/events.md",
        "/build/technical-reference/fee-model.md",
        "/build/technical-reference/l1-l2-interop.md",
      ]
    },
    {
      text: "Support",
      collapsible: true,
      children: [
        {
          text: "Community Channels",
          link: "/build/support/community-channels.md"
        },
        {
          text: "Contribution Track",
          link: "/build/support/contribution-track.md"
        },
        {
          text: "Audits and bug bounty program",
          link: "/build/support/audit-bug-bounty.md"
        },
        {
          text: "Withdrawal Delay",
          link: "/build/support/withdrawal-delay.md"
        },
        {
          text: "FAQs",
          link: "/build/support/faq.md"
        }
      ]
    },
  ],
  "/infra": [
    {
      text: "Introduction",
      link: "/infra/README.md",
    },
    {
      text: "External Node (EN)",
      // link: "/infra/external-node/README.md",
      collapsible: true,
      children: [
        {
          text: "Component Breakdown",
          link: "/infra/external-node/component-breakdown.md",
        },
        {
          text: "Configuration",
          link: "/infra/external-node/configuration.md",
        },
        {
          text: "Running Node",
          link: "/infra/external-node/running-node.md",
        },
        {
          text: "API Overview",
          link: "/infra/external-node/api-overview.md",
        },
        {
          text: "Observability",
          link: "/infra/external-node/observability.md",
        },
        {
          text: "Troubleshooting",
          link: "/infra/external-node/troubleshooting.md",
        }
      ],
    },
    {
      text: "zkSync",
      // link: "/infra/zksync-era/README.md",
      collapsible: true,
      children: [
        {
          text: "Installation",
          link: "/infra/zksync-era/installation.md"
        },
        {
          text: "Running Node",
          link: "/infra/zksync-era/running-node.md"
        },
        {
          text: "Development",
          link: "/infra/zksync-era/development.md"
        },
      ]
    },
  ],
  "/zk-stack": [
    {
      text: "Overview",
      collapsible: true,
      children: [
        {
          text: "Transaction Lifecycle",
          link: "/zk-stack/overview/transaction-lifecycle.md"
        },
        {
          text: "Blocks",
          link: "/zk-stack/overview/blocks.md"
        },
        {
          text: "Fee Mechanism",
          link: "/zk-stack/overview/fee-mechanism.md"
        },
        {
          text: "Finality",
          link: "/zk-stack/overview/finality.md"
        },
        {
          text: "System Upgrades",
          link: "/zk-stack/overview/system-upgrades.md"
        },
        {
          text: "Hyperchains / Hyperscaling",
          link: "/zk-stack/overview/hyperchains-hyperscaling.md"
        },
        {
          text: "Validiums",
          link: "/zk-stack/overview/validiums.md"
        }
      ]
    },
    {
      text: "Running a Hyperchain",
      // link: "/zk-stack/running-a-hyperchain/README.md",
      collapsible: true,
      children: [
        {
          text: "Locally",
          link: "/zk-stack/running-a-hyperchain/locally.md"
        },
        {
          text: "In-Production",
          link: "/zk-stack/running-a-hyperchain/in-production.md"
        }
      ]
    },
    {
      text: "Components",
      // link: "/zk-stack/components/README.md",
      collapsible: true,
      children: [
        {
          text: "Sequencer",
          // link: "/zk-stack/components/sequencer/README.md",
          collapsible: true,
          children: [
            {
              text: "Server",
              link: "/zk-stack/components/sequencer/server.md"
            },
            {
              text: "Out-of-Circuit VM",
              link: "/zk-stack/components/sequencer/out-of-circuit-vm.md"
            },
            {
              text: "Bootloader",
              link: "/zk-stack/components/sequencer/bootloader.md"
            }
          ]
        },
        {
          text: "Proof System",
          // link: "/zk-stack/components/proof-system/README.md",
          collapsible: true,
          children: [
            {
              text: "In-Circuit VM",
              link: "/zk-stack/components/proof-system/in-circuit-vm.md"
            },
            {
              text: "Proof System",
              link: "/zk-stack/components/proof-system/proof-system.md"
            }
          ]
        },
        {
          text: "Compiler",
          // link: "/zk-stack/components/compiler/README.md",
          collapsible: true,
          children: [
            {
              text: "Overview",
              link: "/zk-stack/components/compiler/overview.md"
            },
            {
              text: "FE & Equivalence",
              link: "/zk-stack/components/compiler/fe-equivalence.md"
            }
          ],
        },
        { 
          text: "Block Explorer",
          link: "/zk-stack/components/blockexplorer.md"
        },
      ],
    },
    {
      text: "Future / Advanced Topics",
      // link: "/zk-stack/advanced-topics/README.md",
      collapsible: true,
      children: [
        {
          text: "Decentralized Sequencer",
          link: "/zk-stack/advanced-topics/decentralized-sequencer.md"
        },
        {
          text: "Shared Bridges",
          link: "/zk-stack/advanced-topics/shared-bridges.md"
        },
        {
          text: "Hyperchain Permissions",
          link: "/zk-stack/advanced-topics/hyperchain-permissions.md"
        },
        {
          text: "Validium for Boojum",
          link: "/zk-stack/advanced-topics/validium-for-boojum.md"
        },
      ]
    }
  ],
});
