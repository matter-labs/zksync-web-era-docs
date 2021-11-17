# [zkSync.io](https://zksync.io/) &middot; [zkSync docs](https://zksync.io/) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)

# zkSync 2.0 docs

The documentation for zkSync 2.0.

## [CHANGELOG](./CHANGELOG.md)

## Build Setup

``` bash
# clear possible cache && install dependencies (clear install)
$ sh cli-dev.sh ci

# populate .env file as dev environment && serve with hot reload at localhost:3000
$ yarn dev

# build for dev
$ build:stage
# afterward you'll have prepared distributive in /public folder

# build for production (only if you have firebase:auth) 
$ bash cli-dev.sh ci && yarn zk-ci-prepare 
```

---

## Solutions used

* [TS Lang](https://www.typescriptlang.org)
* [Vue.js](https://vuejs.org)

## Local testing

```bash
yarn
yarn docs:dev
```

## Development

CI pipeline will check that the files are formatted according to `prettier`, `markdownlint` founds no issues in document
and spelling is correct. Also, there should be no dead links.

You can check it locally as follows:

```bash
yarn
yarn md:lint
yarn md:deadlinks
yarn fmt:check
yarn cspell
```

If `cspell` doesn't recognize a word but you're sure that it's correct, consider adding it to the `cspell-zksync.txt`.

## Deployment

`master` branch is automatically deployed to <https://console.firebase.google.com/u/0/project/zksync-web-v2-docs>

# Deploying altogether

> will do:

* install node modules;
* prepare, test and build documentation;
* afterwards all contained into the `dist` folder will be deployed in form of the static website

```bash
yarn zk-ci-prepare
yarn firebase deploy
```

# Extra documentation

## cSpell

Configuration in `.cSpell.json`:
 * `version` — version of the setting file, always **0.1**
 * `language` — language - current active spelling language
 * `words[]` — words - list of words to be always considered correct
 * `dictionaries[]`
```
"dictionaryDefinitions": [
    {
      "name": "zksync", "path": "./cspell-zksync.txt"
    }
]
```

```bash
{
  
  "version": "0.1",
  // language - current active spelling language
  "language": "en",
  // words - list of words to be always considered correct
  "words": [],
  "dictionaries": ["typescript", "zksync"],
  //
  "dictionaryDefinitions": [
  { 
    "name": "zksync", "path": "./cspell-zksync.txt"
  }
]
}
```
