# Other plugins

The following plugins created by the community and tested with zkSync Era.

## Supported plugins

::: tip Example project

Here is [a template project configured with all plugins mentioned below](https://github.com/matter-labs/era-hardhat-with-plugins). You can use it as a starting template for your projects.

:::

### hardhat-deploy

Multiple tasks for advance deployments. 

This plugin was [updated to support zkSync Era](https://github.com/wighawag/hardhat-deploy/pull/437) on version `0.11.26`.

[More information](https://www.npmjs.com/package/hardhat-deploy)

### @typechain/hardhat

Automatically generate TypeScript bindings for smart contracts.

[More infomation](https://www.npmjs.com/package/@typechain/hardhat)


### hardhat-contract-sizer

Generates a report of the bytecode size of the contracts in your project.

[More information](https://www.npmjs.com/package/hardhat-contract-sizer)

### hardhat-abi-exporter

Different options to export smart contract ABIs.

[More information](https://www.npmjs.com/package/hardhat-abi-exporter)


## Unsupported plugins

### @openzeppelin/hardhat-upgrades

This plugin is currently not supported as it overrides tasks of the compiler and it's not compatile with zksolc.

 
