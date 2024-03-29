# zkSync Documentation

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/matter-labs/zksync-web-v2-docs?color=%234E529A&label=changelog)](CHANGELOG.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-web-era-docs/blob/main/LICENSE) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-web-era-docs/blob/main/LICENSE-APACHE)
[![Follow us!](https://img.shields.io/twitter/follow/zksync?color=%234E529A&label=Follow%20%40zkSync&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iNDMiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA0MyAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Mi42NTM5IDEyLjQ5MTVMMzAuODM3OCAwLjcxNjc0M1Y5LjM0TDE5LjEwNTUgMTcuOTczOUwzMC44Mzc4IDE3Ljk4MlYyNC4yNjYyTDQyLjY1MzkgMTIuNDkxNVoiIGZpbGw9IiM0RTUyOUEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wLjk5ODA0NyAxMi40ODcyTDEyLjgxNDEgMjQuMjYxOVYxNS43MDhMMjQuNTQ2NSA3LjAwNDdMMTIuODE0MSA2Ljk5NjY0VjAuNzEyNDYzTDAuOTk4MDQ3IDEyLjQ4NzJaIiBmaWxsPSIjOEM4REZDIi8%2BCjwvc3ZnPgo%3D&style=flat)](https://twitter.com/zksync)

## zkEVM

> zkEVM is a virtual machine that executes smart contracts in a way that is compatible with zero-knowledge-proof computation.
> Our zkEVM keeps EVM semantics, but is also ZK-friendly and adopts a traditional register-based CPU architecture.

[zkSync Docs](https://docs.zksync.io) contain up-to-date information about **zkSync**.
zkSync Era has built-in EVM compatibility which makes it a unified tool for releasing EVM-compatible ZK rollups.
We call it [zkEVM](https://zksync.io/zkevm): web3, Layer 2, scaling functionality that preserves your battle-tested code and knowledge gained after years of working with Solidity.

## Build and setup

### Initial setup

The frontend team chose the `yarn@berry` package manager, so ensure you install `node` version **LTS@14** after configuring `yarn`.

```bash
# configure yarn version: berry or specifically 3.1.1.
$ yarn set version berry
```

### Main scripts

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:8080
$ yarn docs:dev
# static generation to dist
$ yarn docs:build
```

### Development

The continuous integration pipeline uses `prettier` and `markdownlint` to ensure there are no issues with your document, that spelling is correct, and there are no dead links.

You can check it locally as follows:

```bash
# check dead links
$ yarn lint:dead
# check spelling
$ yarn lint:spell
# check with markdownlint
$ yarn lint:mdl
# check with prettier
$ yarn lint:fmt
# fix with markdownlint
$ yarn fix:mdl
# fix with prettier
$ yarn fix:fmt
# run all checks
$ yarn ci
# run all fixes
$ yarn ci:fix
# build for production
$ yarn ci:build
```

If `lint:spell` doesn't recognize a word, and you’re sure that it’s correct, consider adding it to `cspell-zksync.txt`.

## Search

We use Algolia to index our documentation. Know more about it [here](https://algolia.com). Dashboard is [here](https://dashboard.algolia.com/), and [Crawler Admin](https://crawler.algolia.com/) is here.

## Contributions

### Adding new tutorials

To add a new tutorial:

- Fork the repository and create a new branch locally to add your changes.
- Add the tutorial markdown file inside the `build/tutorials` folder.
- Give the file an SEO-friendly name, as it is included in the live URL.
- In the `.vuepress/sidebar/en.ts` file, add the tutorial inside this block:

```js
{
  text: "Tutorials",
  link: "/dev/tutorials",
  children: [
        "/build/tutorials/cross-chain-tutorial.md",
        "/build/tutorials/custom-aa-tutorial.md",
        "/build/tutorials/aa-daily-spend-limit.md",
        "/build/tutorials/custom-paymaster-tutorial.md",
        // ADD YOUR FILE HERE
  ],
},
```

- If your tutorial contains images, make sure to compress them using https://squoosh.app/ before adding them to the `assets/images` folder.
- Finally, create a PR.

### Deployment

The `main` branch is automatically deployed to <https://console.firebase.google.com/u/0/project/aqwzx-zksync-v2-docs>

Deploying does the following:

- Installs node modules.
- Prepares, tests, and builds documentation.
- Deploys everything contained in the `dist` folder as a static website.

```bash
yarn zk-ci-prepare
yarn firebase deploy
```

## Extra documentation

## cSpell

Configuration in `.cSpell.json`:

- `version` — version of the setting file, always **0.1**.
- `language` — current active spelling language.
- `words[]` — list of correctly-spelled words.
- `dictionaries[]`

```json
"dictionaryDefinitions": [
  {
    "name": "zksync", "path": "./cspell-zksync.txt"
  }
]
```
