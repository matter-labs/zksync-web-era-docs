import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/build": [
    {
      text: "Quickstart",
      collapsible: true,
      children: [
        {
          text: "Hello World",
          link: "/build/quick-start/hello-world.md"
        },
        {
          text: "Interact with zkSync Era",
          link: "/build/quick-start/interact.md"
        },
        {
          text: "Security and Best Practices",
          link: "/build/quick-start/best-practices.md"
        },
        {
          text: "Useful Addresses",
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
                  text: "Building a Custom Paymaster",
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
              text: "Cross-chain Governance",
              link: "/build/tutorials/smart-contract-development/cross-chain-tutorial.md"
            },
          ],
        },
        {
          text: "dApp Development",
          collapsible: true,
          children: [
            {
              text: "Quickstart Frontend with Paymaster",
              link: "/build/tutorials/dapp-development/frontend-quickstart-paymaster.md",
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
              text: "Wagmi",
              link: "/build/tutorials/tooling-guides/wagmi.md",
            },
            {
              text: "Viem",
              link: "/build/tutorials/tooling-guides/viem.md",
            },
            {
              text: "Web3.js",
              link: "/build/tutorials/tooling-guides/web3js.md",
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
          ],
        },
        {
          text: "How to",
          collapsible: true,
          children: [
            {
              text: "Deposit ETH",
              link: "/build/tutorials/how-to/deposit-eth-to-l2.md"
            },
            {
              text: "Withdraw ETH",
              link: "/build/tutorials/how-to/withdraw-eth-to-l1.md"
            },
            {
              text: "Deposit ERC20 tokens",
              link: "/build/tutorials/how-to/deposit-erc-20-to-l2.md"
            },
            {
              text: "Withdraw ERC20 tokens",
              link: "/build/tutorials/how-to/withdraw-erc-20-to-l1.md"
            },
            {
              text: "Estimate Gas",
              link: "/build/tutorials/how-to/estimate-gas.md"
            },
            {
              text: "Send an L1 to L2 Transaction",
              link: "/build/tutorials/how-to/send-transaction-l1-l2.md"
            },
            {
              text: "Send an L2 to L1 Message",
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
            {
              text: "Deploy Contracts Using Hardhat Plugins",
              link: "/build/tutorials/how-to/deploy-contract.md"
            },
            {
              text: "Test Contracts with Hardhat",
              link: "/build/tutorials/how-to/test-contracts.md"
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
              text: "Block Explorer Menu",
              link: "/build/tooling/block-explorer/block-explorer-menu",
            },
            {
              text: "Contract Verification",
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
          text: "zkSync CLI",
          collapsible: true,
          children: [
            {
              text: "Getting Started",
              link: "/build/tooling/zksync-cli/getting-started.md",
            },
            {
              text: "Commands",
              collapsible: false,
              children: [
                {
                  text: "Start Node Locally",
                  link: "/build/tooling/zksync-cli/commands/local-node.md",
                },
                {
                  text: "Create a Project",
                  link: "/build/tooling/zksync-cli/commands/create.md",
                },
                {
                  text: "Contract Interaction",
                  link: "/build/tooling/zksync-cli/commands/contract-interaction.md",
                },
                {
                  text: "Transaction Info",
                  link: "/build/tooling/zksync-cli/commands/transaction-info.md",
                },
                {
                  text: "Wallet Functionality",
                  link: "/build/tooling/zksync-cli/commands/wallet.md",
                },
                {
                  text: "Bridge Operations",
                  link: "/build/tooling/zksync-cli/commands/bridge.md",
                },
                {
                  text: "Custom Chains",
                  link: "/build/tooling/zksync-cli/commands/custom-chains.md",
                },
              ]
            },
            {
              text: "Troubleshooting",
              link: "/build/tooling/zksync-cli/troubleshooting.md",
            },
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
            "/build/tooling/hardhat/hardhat-zksync-ethers.md",
            "/build/tooling/hardhat/hardhat-zksync-toolbox.md",
            "/build/tooling/hardhat/hardhat-zksync-node.md",
            "/build/tooling/hardhat/other-plugins.md",
          ]
        },
        {
          text: "Foundry",
          collapsible: true,
          children: [
            {
              text: "Overview",
              link: "/build/tooling/foundry/overview.md",
            },
            {
              text: "Getting Started",
              link: "/build/tooling/foundry/getting-started.md",
            },
          ]
        },
        {
          text: "Ecosystem",
          collapsible: true,
          children: [
            {
              text: "Bridges",
              link: "/build/tooling/bridges.md",
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
            }
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
          collapsible: true,
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
                "/build/sdks/js/zksync-ethers/getting-started",
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
            "/build/sdks/python/types",
            "/build/sdks/python/features",
            "/build/sdks/python/utils"
          ],
        },
        {
          text: "Go",
          collapsible: true,
          children: [
            "/build/sdks/go/getting-started",
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
          text: "Java",
          collapsible: true,
          children: [
            "/build/sdks/java/getting-started",
            "/build/sdks/java/providers",
            "/build/sdks/java/accounts",
            "/build/sdks/java/accounts-l1-l2",
            "/build/sdks/java/contracts",
            "/build/sdks/java/features",
            "/build/sdks/java/paymaster-utils",
            "/build/sdks/java/types",
            "/build/sdks/java/utils"
          ],
        },
        {
          text: "Swift",
          collapsible: true,
          children: [
            "/build/sdks/swift/getting-started",
            "/build/sdks/swift/clients",
            "/build/sdks/swift/accounts",
            "/build/sdks/swift/accounts-l1-l2",
            "/build/sdks/swift/contracts",
            "/build/sdks/swift/features",
            "/build/sdks/swift/types",
            "/build/sdks/swift/paymaster-utils",
            "/build/sdks/swift/utils"
          ],
        },
        {
          text: "Rust",
          collapsible: true,
          children: [
            "/build/sdks/rust/getting-started",
            "/build/sdks/rust/contract-deployment-and-interaction"
          ],
        },
      ]
    },
    {
      text: "API Reference",
      link: "/build/api.md"
    },
    {
      text: "Developer Reference",
      collapsible: true,
      children: [
        "/build/developer-reference/rollups.md",
        "/build/developer-reference/zkSync.md",
        "/build/developer-reference/differences-with-ethereum.md",
        "/build/developer-reference/account-abstraction.md",
        "/build/developer-reference/system-contracts.md",
        "/build/developer-reference/bridging-asset.md",
        "/build/developer-reference/contract-development.md",
        "/build/developer-reference/contract-deployment.md",
        "/build/developer-reference/fee-model.md",
        "/build/developer-reference/events.md",
        "/build/developer-reference/l1-l2-interop.md",
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
          text: "Audits and Bug Bounty Program",
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
      link: "/infra/introduction.md",
    },
    {
      text: "Component Breakdown",
      link: "/infra/component-breakdown.md",
    },
    {
      text: "Configuration",
      link: "/infra/configuration.md",
    },
    {
      text: "Running Node",
      link: "/infra/running-node.md",
    },
    {
      text: "API Overview",
      link: "/infra/api-overview.md",
    },
    {
      text: "Observability",
      link: "/infra/observability.md",
    },
    {
      text: "Troubleshooting",
      link: "/infra/troubleshooting.md",
    }
  ],
  "/zk-stack": [
    {
      text: "Concepts",
      collapsible: true,
      children: [
        {
          text: "Overview",
          link: "/zk-stack/concepts/overview.md",
        },
        {
          text: "Transaction Lifecycle",
          link: "/zk-stack/concepts/transaction-lifecycle.md"
        },
        {
          text: "Blocks",
          link: "/zk-stack/concepts/blocks.md"
        },
        {
          text: "Fee Mechanism",
          link: "/zk-stack/concepts/fee-mechanism.md"
        },
        {
          text: "Finality",
          link: "/zk-stack/concepts/finality.md"
        },
        {
          text: "System Upgrades",
          link: "/zk-stack/concepts/system-upgrades.md"
        },
        {
          text: "Hyperchains / Hyperscaling",
          link: "/zk-stack/concepts/hyperchains-hyperscaling.md"
        },
        {
          text: "Data Availability",
          collapsible: true,
          children: [
            {
              text: "Overview",
              link: "/zk-stack/concepts/data-availability/overview.md"
            },
            {
              text: "Recreating State form L1",
              link: "/zk-stack/concepts/data-availability/recreate-l2-state-from-l1-state-diffs.md"
            },
            {
              text: "Validiums",
              link: "/zk-stack/concepts/validiums.md"
            }
          ]
        },
      ]
    },
    {
      text: "Components",
      collapsible: true,
      children: [
        {
          text: "Overview",
          link: "/zk-stack/components/overview.md",
        },
        {
          text: "Smart & System Contracts",
          collapsible: true,
          children: [
            {
              text: "Smart Contracts",
              link: "/zk-stack/components/smart-contracts/smart-contracts.md",
            },
            {
              text: "System Contracts",
              link: "/zk-stack/components/smart-contracts/system-contracts.md",
           }
          ]
        },
        {
          text: "Shared Bridge",
          link: "/zk-stack/components/shared-bridges.md"

        },
        {
          text: "Sequencer / Server",
          link: "/zk-stack/components/sequencer-server.md"

        },
        {
          text: "zkEVM",
          collapsible: true,
          children: [
            {
              text: "Overview",
              link: "/zk-stack/components/zkEVM/overview.md",
            },
            {
              text: "Bootloader",
              link: "/zk-stack/components/zkevm/bootloader.md"
            },
            {
              text: "Precompiles",
              link: "/zk-stack/components/zkevm/precompiles.md"
            },
            {
              text: "Virtual Machine Specification",
              collapsible: true,
              children: [
                {
                  text: "VM Primer",
                  link: "/zk-stack/components/zkEVM/vm-specification/vm-primer.md"
                },
                {
                  text: "VM Formal Specification",
                  link: "/zk-stack/components/zkEVM/vm-specification/formal-spec.md"
                },
              ]
            },
          ]
        },
        {
          text: "Prover",
          collapsible: true,
          children: [
            {
              text: "Overview",
              link: "/zk-stack/components/prover/overview.md",
            },
            {
              text: "ZK Terminology",
              link: "/zk-stack/components/prover/zk-terminology.md"
            },
            {
              text: "Running the Prover",
              link: "/zk-stack/components/prover/run-the-prover.md"
            },
            {
              text: "Circuits",
              collapsible: true,
              children: [
                {
                  text: "Overview",
                  link: "/zk-stack/components/prover/circuits/overview.md",
                },
                {
                  text: "CodeDecommitter",
                  link: "/zk-stack/components/prover/circuits/code-decommitter.md"
                },
                {
                  text: "DemuxLogQueue",
                  link: "/zk-stack/components/prover/circuits/demux-log-queue.md"
                },
                {
                  text: "ECRecover",
                  link: "/zk-stack/components/prover/circuits/ecrecover.md"
                },
                {
                  text: "KeccakRoundFunction",
                  link: "/zk-stack/components/prover/circuits/keccak-round-function.md"
                },
                {
                  text: "L1MessagesHasher",
                  link: "/zk-stack/components/prover/circuits/l1-messages-hasher.md"
                },
                {
                  text: "LogSorter",
                  link: "/zk-stack/components/prover/circuits/log-sorter.md"
                },
                {
                  text: "MainVM",
                  link: "/zk-stack/components/prover/circuits/main-vm.md"
                },
                {
                  text: "RAMPermutation",
                  link: "/zk-stack/components/prover/circuits/ram-permutation.md"
                },
                {
                  text: "Sha256RoundFunction",
                  link: "/zk-stack/components/prover/circuits/sha256-round-function.md"
                },
                {
                  text: "Sorting and Deduplicating",
                  collapsible: true,
                  children: [
                    {
                      text: "Overview",
                      link: "/zk-stack/components/prover/circuits/sorting/overview.md",
                    },
                    {
                      text: "SortDecommitments",
                      link: "/zk-stack/components/prover/circuits/sorting/sort-decommitments.md"
                    },
                    {
                      text: "StorageSorter",
                      link: "/zk-stack/components/prover/circuits/sorting/storage-sorter.md"
                    },
                    {
                      text: "LogSorter",
                      link: "/zk-stack/components/prover/circuits/sorting/log-sorter.md"
                    }
                  ]
                },
                {
                  text: "StorageApplication",
                  link: "/zk-stack/components/prover/circuits/storage-application.md"
                },
              ],
            },
            {
              text: "Boojum Gadgets",
              link: "/zk-stack/components/prover/boojum-gadgets.md"
            },
            {
              text: "Boojum Function: check_if_satisfied",
              link: "/zk-stack/components/prover/boojum-function-check-if-satisfied.md"
            }
          ]
        },
        {
          text: "Compiler",
          collapsible: true,
          children: [
            {
              text: "Toolchain",
              collapsible: true,
              children: [
                {
                  text: "Overview",
                  link: "/zk-stack/components/compiler/toolchain/overview.md",
                },
                {
                  text: "Solidity",
                  link: "/zk-stack/components/compiler/toolchain/solidity.md"
                },
                {
                  text: "Vyper",
                  link: "/zk-stack/components/compiler/toolchain/vyper.md"
                },
                {
                  text: "LLVM",
                  link: "/zk-stack/components/compiler/toolchain/LLVM.md"
                },
              ]
            },
            {
              text: "Specification",
              collapsible: true,
              children: [
                {
                  text: "Overview",
                  link: "/zk-stack/components/compiler/specification/overview.md",
                },
                {
                  text: "Code Separation",
                  link: "/zk-stack/components/compiler/specification/code-separation.md"
                },
                {
                  text: "System Contracts",
                  link: "/zk-stack/components/compiler/specification/system-contracts.md"
                },
                {
                  text: "Exception Handling",
                  link: "/zk-stack/components/compiler/specification/exception-handling.md"
                },
                {
                  text: "EVMLA Translator",
                  link: "/zk-stack/components/compiler/specification/evmla-translator.md"
                },
                {
                  text: "Instructions",
                  collapsible: true,
                  children: [
                    {
                      text: "Overview",
                      link: "/zk-stack/components/compiler/specification/instructions/overview.md",
                    },
                    {
                      text: "EVM",
                      collapsible: true,
                      children: [
                        {
                          text: "Overview",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/overview.md",
                        },
                        {
                          text: "Arithmetic",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/arithmetic.md",
                        },
                        {
                          text: "Logical",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/logical.md",
                        },
                        {
                          text: "Bitwise",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/bitwise.md",
                        },
                        {
                          text: "Hashes",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/hashes.md",
                        },
                        {
                          text: "Environment",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/environment.md",
                        },
                        {
                          text: "Block",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/block.md",
                        },
                        {
                          text: "Stack",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/stack.md",
                        },
                        {
                          text: "Memory",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/memory.md",
                        },
                        {
                          text: "Storage",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/storage.md",
                        },
                        {
                          text: "Events",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/events.md",
                        },
                        {
                          text: "Calls",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/calls.md",
                        },
                        {
                          text: "CREATE",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/create.md",
                        },
                        {
                          text: "Return",
                          link: "/zk-stack/components/compiler/specification/instructions/evm/return.md",
                        },
                      ]
                    },
                    {
                      text: "EVM Legacy Assembly",
                      link: "/zk-stack/components/compiler/specification/instructions/evmla.md"
                    },
                    {
                      text: "Yul",
                      link: "/zk-stack/components/compiler/specification/instructions/yul.md"
                    },
                  ]
                }
              ]
            }
          ],
        },
        {
          text: "Fee Withdrawer",
          link: "/zk-stack/components/fee-withdrawer.md"
        },
        {
          text: "Portal - Wallet + Bridge",
          link: "/zk-stack/components/portal-wallet-bridge.md"
        },
        {
          text: "Block Explorer",
          link: "/zk-stack/components/block-explorer.md"
        },
      ],
    },
    {
      text: "Running a Hyperchain",
      collapsible: true,
      children: [
        {
          text: "Locally",
          link: "/zk-stack/running-a-hyperchain/locally.html",
        },
        {
          text: "In Production",
          link: "/zk-stack/running-a-hyperchain/production.md"
        },
        {
          text: "Rollup as a Service",
          link: "/zk-stack/running-a-hyperchain/raas.html",
        },
      ]
    },
  ],
});
