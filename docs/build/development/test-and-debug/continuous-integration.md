---
head:
  - - meta
    - name: "twitter:title"
      content: Continuous Integration | zkSync Docs
---

# Continuous Integration

A GitHub Action is available for integrating `era-test-node` into your CI/CD environments. This action offers high configurability and streamlines the process of testing your applications in an automated way.

You can find the GitHub Action in the marketplace [here](https://github.com/marketplace/actions/era-test-node-action).

:::info
In CI tests, use `127.0.0.1` as the URL in hardhat.config.ts or for the provider to avoid '**Cannot connect to network**' errors.
:::

### Configuration Options

<table><thead><tr><th width="209">Option</th><th>Description</th><th width="101">Required</th><th width="107">Default</th><th>Options</th></tr></thead><tbody><tr><td><code>mode</code></td><td>Operation mode.</td><td>No</td><td><code>run</code></td><td><code>run</code>, <code>fork</code></td></tr><tr><td><code>network</code></td><td>Network selection.</td><td>No</td><td>-</td><td>-</td></tr><tr><td><code>forkAtHeight</code></td><td>Block height to fork at.</td><td>No</td><td>-</td><td>-</td></tr><tr><td><code>port</code></td><td>Listening port.</td><td>No</td><td><code>8011</code></td><td>-</td></tr><tr><td><code>showCalls</code></td><td>Call debug visibility.</td><td>No</td><td><code>none</code></td><td><code>none</code>, <code>user</code>, <code>system</code>, <code>all</code></td></tr><tr><td><code>showStorageLogs</code></td><td>Storage log visibility.</td><td>No</td><td><code>none</code></td><td><code>none</code>, <code>read</code>, <code>write</code>, <code>all</code></td></tr><tr><td><code>showVmDetails</code></td><td>VM details visibility.</td><td>No</td><td><code>none</code></td><td><code>none</code>, <code>all</code></td></tr><tr><td><code>showGasDetails</code></td><td>Gas details visibility.</td><td>No</td><td><code>none</code></td><td><code>none</code>, <code>all</code></td></tr><tr><td><code>resolveHashes</code></td><td>Enable hash resolution.</td><td>No</td><td><code>false</code></td><td>-</td></tr><tr><td><code>log</code></td><td>Log filter level.</td><td>No</td><td><code>info</code></td><td><code>debug</code>, <code>info</code>, <code>warn</code>, <code>error</code></td></tr><tr><td><code>logFilePath</code></td><td>Path for the log file.</td><td>No</td><td><code>era_test_node.log</code></td><td>-</td></tr><tr><td><code>target</code></td><td>Target architecture.</td><td>No</td><td><code>x86_64-unknown-linux-gnu</code></td><td><code>x86_64-unknown-linux-gnu</code>, <code>x86_64-apple-darwin</code>, <code>aarch64-apple-darwin</code></td></tr><tr><td><code>version</code></td><td>Version of <code>era_test_node</code>.</td><td>No</td><td><code>latest</code></td><td>-</td></tr></tbody></table>

### Usage Examples <a href="#user-content--example-usage" id="user-content--example-usage"></a>

Below provides usage examples for quick and more advanced setups.

#### Quickstart <a href="#user-content-quickstart" id="user-content-quickstart"></a>

```yaml
name: Run Era Test Node Action

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Era Test Node
        uses: dutterbutter/era-test-node-action@latest
```

#### Advanced <a href="#user-content-command-options" id="user-content-command-options"></a>

With configuration options:

```yaml
name: Run Era Test Node Action

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Era Test Node
        uses: dutterbutter/era-test-node-action@latest
        with:
          mode: "run"
          showCalls: "user"
          showStorageLogs: "read"
          showVmDetails: "all"
          showGasDetails: "all"
          resolveHashes: "true"
          log: "info"
          logFilePath: "era_test_node.log"
          target: "x86_64-unknown-linux-gnu"
```

With upload log file to artifacts:

```yaml
name: Run Era Test Node Action

on:
  pull_request:
    branches: [main]
  workflow_dispatch:
jobs:
  test:
    name: unit-tests
    strategy:
      matrix:
        platform: [ubuntu-latest]
    runs-on: ${{ matrix.platform }}

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Run Era Test Node
        uses: dutterbutter/era-test-node-action@latest
        with:
          mode: "fork"
          network: "mainnet"
          forkAtHeight: "1855248"
          showCalls: "user"
          showStorageLogs: "read"
          showVmDetails: "all"
          showGasDetails: "all"
          resolveHashes: "true"
          log: "info"
          logFilePath: "era_test_node.log"
          target: "x86_64-unknown-linux-gnu"
          releaseTag: "latest"

      - name: Install Dependencies
        run: yarn install

      - name: Run Tests
        run: |
          yarn test:contracts

      - name: Upload era_test_node log
        uses: actions/upload-artifact@v3
        with:
          name: era_test_node-log
          path: era_test_node.log
```

With Fork:

```yaml
name: Run Era Test Node Action

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Era Test Node
        uses: dutterbutter/era-test-node-action@latest
        with:
          mode: "fork"
          network: "mainnet"
          forkAtHeight: "1855248"
          showCalls: "user"
          showStorageLogs: "read"
          showVmDetails: "all"
          showGasDetails: "all"
          resolveHashes: "true"
          log: "info"
          logFilePath: "era_test_node.log"
          target: "x86_64-unknown-linux-gnu"
          releaseTag: "latest"
```
