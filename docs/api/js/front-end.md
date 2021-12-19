# Front-end integration

In this section we will describe how to take most from the zkSync to provide the best UX.

## Going to production quick

If your front-end code does not deploy new smart contracts, then no changes for the codebase required! All the existing SDKs/infrastructure will work out-of-box.

## Enabling zkSync features

If you want to deploy smart contracts or enable advanced zkSync features, like paying fees in ERC20 tokens, then you need to use `zksync-web3` library for that. You can read about the basics [here](./features).

This section will provide you a guide on how to integrate your website with zkSync.

In this tutorial, we will use Vue.js as the web framework of our choice as well as 
