# Getting started 

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Check Balance 
4. Transfer funds (ERC20 tokens) into ZkSync network
5. Withdraw funds (Native coins)
6. Deploy contract with create method
7. Deploy contract with create2 method

## Prerequisite
This guide assumes that you are familiar with the basics of python and you have python configured on your local machine.

##  Installation
Python zkSync SDK currently is not published on PyPI, thus can be installed (preferably in a virtualenv) using pip as follows:

```py

pip install git+https://github.com/zksync-sdk/zksync2-python.git

```

## Connecting to zkSync
To interact with zkSync network users need to know the endpoint of the operator node.

```py

from zksync2.module.module_builder import ZkSyncBuilder

ZKSYNC_NETWORK_URL = "https://zksync2-testnet.zksync.dev"
zksync_web3 = ZkSyncBuilder.build(ZKSYNC_NETWORK_URL)

```

## Ethereum signer
Ethereum signer is necessary for sending both L1 and L2 transactions since L2 transactions require an Ethereum signature as a part of 2-factor authentication scheme. 
Ethereum signer is represented by the `PrivateKeyEthSigner` abstract class from `zksync2.signer.eth_signer`.

::: warning

It is possible to create a wallet without an Ethereum private key, but such a wallet will only be able to perform read requests to the zkSync server.

:::

```py

from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner

account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
signer = PrivateKeyEthSigner(account, chain_id)

```

## Creating a wallet

To control your account in zkSync, use the Wallet object. It can sign transactions with keys stored in ZkSyncSigner and send a transaction to zkSync network using ZkSyncProviderInterface.

To create a Wallet object, you have to initialize ZkSyncSigner

## Checking zkSync account balance

## Performing a transfer

## Withdrawing funds

## Deploying a contract with create method

## Deploying a contract with create2 method


## Depositing funds

```py

from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.manage_contracts.gas_provider import StaticGasProvider
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import Token
from zksync2.provider.eth_provider import EthereumProvider


def deposit():
    URL_TO_ETH_NETWORK = "<https://goerli.infura.io/v3/25be7ab42c414680a5f89297f8a11a4d>"
    ZKSYNC_NETWORK_URL = "<https://zksync2-testnet.zksync.dev>"

    eth_web3 = Web3(Web3.HTTPProvider(URL_TO_ETH_NETWORK))
    eth_web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    zksync_web3 = ZkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    gas_provider = StaticGasProvider(Web3.toWei(1, "gwei"), 555000)
    eth_provider = EthereumProvider.build_ethereum_provider(zksync=zksync_web3,
                                                            eth=eth_web3,
                                                            account=account,
                                                            gas_provider=gas_provider)
    tx_receipt = eth_provider.deposit(Token.create_eth(),
                                      eth_web3.toWei("YOUR_AMOUNT_OF_ETH", "ether"),
                                      account.address)
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    deposit()



```

