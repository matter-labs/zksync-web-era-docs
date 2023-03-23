# zkSync Era Documentation

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/matter-labs/zksync-web-v2-docs?color=%234E529A&label=changelog)](CHANGELOG.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)
[![Follow us!](https://img.shields.io/twitter/follow/zksync?color=%234E529A&label=Follow%20%40zkSync&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iNDMiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA0MyAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Mi42NTM5IDEyLjQ5MTVMMzAuODM3OCAwLjcxNjc0M1Y5LjM0TDE5LjEwNTUgMTcuOTczOUwzMC44Mzc4IDE3Ljk4MlYyNC4yNjYyTDQyLjY1MzkgMTIuNDkxNVoiIGZpbGw9IiM0RTUyOUEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wLjk5ODA0NyAxMi40ODcyTDEyLjgxNDEgMjQuMjYxOVYxNS43MDhMMjQuNTQ2NSA3LjAwNDdMMTIuODE0MSA2Ljk5NjY0VjAuNzEyNDYzTDAuOTk4MDQ3IDEyLjQ4NzJaIiBmaWxsPSIjOEM4REZDIi8%2BCjwvc3ZnPgo%3D&style=flat)](https://twitter.com/zksync)

## zkEVM

> zkEVM is a virtual machine that executes smart contracts in a way that is compatible with zero-knowledge-proof computation.
> Our zkEVM keeps EVM semantics, but is also ZK-friendly and adopts a traditional register-based CPU architecture.

Constantly updated, [zkSync Era Docs](https://era.zksync.io/docs) offers the most complete information about the upcoming **zkSync Era**.
The zkSync Era release has built-in EVM compatibility, which makes it a unified tool for releasing EVM-compatible ZK rollups.
We call it [zkEVM](https://zksync.io/zkevm): a long-awaited way to preserve your battle-tested code and knowledge
gained after years of working with Solidity, scaling it via Layer 2.

## Build and setup

### Initial setup

The Frontend team chose the `yarn@berry` package manager, so install `node` version **LTS@14** after configuring `yarn`

```bash
# configure yarn version: berry or specifically 3.1.1.
$ yarn set version berry
```

### Main scripts

```bash
# install dependencies
$ yarn add

# serve with hot reload at localhost:8080
$ yarn docs:dev
# static generation to dist
$ yarn docs:build
```

### Development

The continuous integration pipeline will check that the files are formatted according to `prettier`, that `markdownlint` found no issues in the document,
that spelling is correct, and that there are no dead links.

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

If `lint:spell` doesn't recognize a word but you’re sure that it’s correct, consider adding it to `cspell-zksync.txt`.

## Contributions

### Adding new tutorials

To add a new tutorial:

- Fork the repository and create a new branch locally to add your changes.
- Add the tutorial markdown file inside the `docs/dev/tutorials` folder.
- Give the file a SEO-friendly name, as it will be part of the URL.
- In the `docs/.vuepress/config.js` file, add the tutorial inside this block:

```js
{
title: "Tutorials",
path: "/dev/tutorials",
collapsable: false,
children: [
  "/dev/tutorials/cross-chain-tutorial.md",
  "/dev/tutorials/custom-aa-tutorial.md",
  "/dev/tutorials/custom-paymaster-tutorial.md"],
  // ADD YOUR FILE HERE
},
```

- If your tutorial contains images, make sure to compress them using https://squoosh.app/ before adding them to the `docs/assets/images` folder.
- Finally, create a pull request.

### Deployment

The `main` branch is automatically deployed to <https://console.firebase.google.com/u/0/project/aqwzx-zksync-v2-docs>

Deploying
will do the following:

- install node modules;
- prepare, test, and build documentation;
- afterwards everything contained in the `dist` folder will be deployed as a static website.

```bash
yarn zk-ci-prepare
yarn firebase deploy
```

## Extra documentation

## cSpell

Configuration in `.cSpell.json`:

- `version` — version of the setting file, always **0.1**
- `language` — language: current active spelling language
- `words[]` — words - list of words to be considered correct
- `dictionaries[]`

```json
"dictionaryDefinitions": [
  {
    "name": "zksync", "path": "./cspell-zksync.txt"
  }
]
```
