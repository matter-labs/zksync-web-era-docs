---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync Hardhat Plugins | zkSync Docs
---

# `hardhat-zksync-toolbox`

The hardhat-zksync-toolbox plugin provides a convenient method for bundling and accessing a range of zkSync-related Hardhat plugins. This approach simplifies the process of utilizing these plugins and promotes ease of use.

List of contained plugins:

- [hardhat-zksync-solc](./hardhat-zksync-solc.md)
- [hardhat-zksync-deploy](./hardhat-zksync-deploy.md)
- [hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md)
- [hardhat-zksync-verify](./hardhat-zksync-verify.md)

::: tip Popular Hardhat plugins

You can find a list of all official plugins [here](./getting-started.md). Also, zkSync supports some other [popular plugins](./other-plugins.md) that can be used.

:::

### Installation

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-toolbox @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-chai-matchers @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify @nomicfoundation/hardhat-verify @nomiclabs/hardhat-ethers ethers chai zksync-ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-toolbox
```

:::

::: note
For `npm`, version 7 or later is recommended.
:::

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync-toolbox";
```

With the hardhat-zksync-toolbox plugin installed and imported, you will have access to all of the supported plugins and will be able to use them as needed in your project.

::: note
To learn more about using any of the plugins that are supported by the hardhat-zksync-toolbox plugin, you can refer to their documentation above.
:::
