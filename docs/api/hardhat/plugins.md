# zkSync toolbox

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `hardhat-zksync-toolbox`

The hardhat-zksync-toolbox plugin provides a convenient method for bundling and accessing a range of zkSync-related Hardhat plugins. This approach simplifies the process of utilizing these plugins and promotes ease of use.

List of supported plugins:

- [hardhat-zksync-solc](./hardhat-zksync-solc.md)
- [hardhat-zksync-vyper](./hardhat-zksync-vyper.md)
- [hardhat-zksync-deploy](./hardhat-zksync-deploy.md)
- [hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md)
- [hardhat-zksync-verify](./hardhat-zksync-verify.md)

### Installation

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-toolbox @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-vyper @matterlabs/hardhat-zksync-chai-matchers @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify hardhat ethers zksync-web3 @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-toolbox
```

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync-toolbox";
```

With the hardhat-zksync-toolbox plugin installed and imported, you will have access to all of the supported plugins and will be able to use them as needed in your project.

> **_NOTE:_** To learn more about using any of the plugins that are supported by the hardhat-zksync-toolbox plugin, you can refer to their documentation above.

