---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync Hardhat Plugins | zkSync Docs
---

# `hardhat-zksync`

The hardhat-zksync plugin provides a convenient method for bundling and accessing a range of zkSync-related Hardhat plugins. This approach simplifies the process of utilizing these plugins and promotes ease of use.

List of contained plugins:

- [hardhat-zksync-solc](./hardhat-zksync-solc.md)
- [hardhat-zksync-deploy](./hardhat-zksync-deploy.md)
- [hardhat-zksync-upgradable](./hardhat-zksync-upgradable.md)
- [hardhat-zksync-verify](./hardhat-zksync-verify.md)
- [hardhat-zksync-node](./hardhat-zksync-node.md)
- [hardhat-zksync-ethers](./hardhat-zksync-ethers.md)

::: tip Popular Hardhat plugins

You can find a list of all official plugins [here](./getting-started.md). Also, zkSync supports some other [popular plugins](./other-plugins.md) that can be used.

:::

### Installation

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync
```

:::

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync";
```

With the `hardhat-zksync` plugin installed and imported, you will have access to all of the supported plugins and will be able to use them as needed in your project.
This plugin enables access to all commands available for each specific plugin, making them readily accessible with just the usage of this plugin.

::: note
To learn more about using any of the plugins that are supported by the hardhat-zksync plugin, you can refer to their documentation above.
:::

For certain tasks present in the plugins encompassed by this plugin, it overrides them with new features and parameters. These tasks streamline common functionalities into a simplified workflow.

Here is a list of overriden tasks where this plugin adds new optional parameter `--verify`:

- `deploy-zksync:contract`
- `deploy-zksync:proxy`
- `upgrade-zksync:proxy`
- `deploy-zksync:beacon`
- `upgrade-zksync:beacon`

The `--verify` parameter allow the task to immediately verify all deployed and upgraded contracts when task is called.

To check other parameters present in these tasks, please check the documentation pages for [hardhat-zksync-deploy](./hardhat-zksync-deploy.md) and [hardhat-zksync-upgradable](./hardhat-zksync-upgradable.md).
