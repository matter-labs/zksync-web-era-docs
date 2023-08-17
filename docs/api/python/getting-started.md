# Getting started

In this guide we will demonstrate how to:

1. Deposit ETH from Ethereum into zkSync Era.
2. Transfer ETH on zkSync Era.
3. Withdraw ETH from zkSync Era to Ethereum.
4. Transfer token on zkSync Era.
5. Deploy a smart contract using create opcode.
6. Deploy a smart contract with constructor using create opcode.
7. Deploy a smart contract with dependency using create opcode.
8. Deploy a smart contract using create2 opcode.
9. Deploy a smart contract with dependency using create2 opcode.
10. Deploy custom token on zkSync Era.
11. Deploy smart account using create opcode.
12. Deploy smart account using create2 opcode.
13. Use paymaster to pay fee with token.

## Prerequisites

- Python: >=3.9 ([installation guide](https://www.python.org/downloads/))
- Pip: 23.1.2 ([installation guide](https://pip.pypa.io/en/stable/installation/))

## Adding dependencies

To install zkSync Era, run the command below in your terminal.

```console
pip install zksync2
```

## Connecting to zkSync Era

Once you have all the necessary dependencies, connect to zkSync Era using the endpoint of the operator node.

```python
from zksync2.module.module_builder import ZkSyncBuilder
...
sdk = ZkSyncBuilder.build("https://testnet.era.zksync.dev")
```

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-python/tree/master/examples). Examples are configured to interact with `zkSync` and `Goerli` test networks.

### Check balance

Here is an example of how to check a balance on zkSync Era.

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from examples.utils import EnvPrivateKey
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import EthBlockParams

ZKSYNC_PROVIDER = "https://zksync2-testnet.zksync.dev"


def check_balance():
    env = EnvPrivateKey("PRIVATE_KEY")
    account: LocalAccount = Account.from_key(env.key)
    zksync_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
    zk_balance = zksync_web3.zksync.get_balance(account.address, EthBlockParams.LATEST.value)
    print(f"Balance: {zk_balance}")


if __name__ == "__main__":
    check_balance()

```

### Deposit ETH

This is an example of how to deposit ETH from Ethereum network (L1) to zkSync Era network (L2):

```python
import os

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexStr
from web3 import Web3

from zksync2.core.types import Token
from zksync2.manage_contracts.zksync_contract import ZkSyncContract
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.provider.eth_provider import EthereumProvider


def deposit(
        zksync_provider: Web3,
        eth_web3: Web3,
        eth_provider: EthereumProvider,
        account: LocalAccount,
        amount: float
) -> tuple[HexStr, HexStr]:
    """
    Deposit ETH from L1 to L2 network
    :param zksync_provider:
        Instance of ZkSync provider
    :param eth_web3:
        Instance of Ethereum Web3 provider
    :param eth_provider:
        Instance of Ethereum provider
    :param account:
        From which ETH account the withdrawal will be made
    :param amount:
        How much would the withdrawal will contain
    :return:
        Deposit transaction hashes on L1 and L2 networks
    """
    # execute deposit on L1 network
    print("Executing deposit transaction on L1 network")
    l1_tx_receipt = eth_provider.deposit(token=Token.create_eth(),
                                         amount=Web3.to_wei(amount, 'ether'),
                                         gas_price=eth_web3.eth.gas_price)

    # Check if deposit transaction was successful
    if not l1_tx_receipt["status"]:
        raise RuntimeError("Deposit transaction on L1 network failed")

    # Get ZkSync contract on L1 network
    zksync_contract = ZkSyncContract(zksync_provider.zksync.main_contract_address, eth_web3, account)

    # Get hash of deposit transaction on L2 network
    l2_hash = zksync_provider.zksync.get_l2_hash_from_priority_op(l1_tx_receipt, zksync_contract)

    # Wait for deposit transaction on L2 network to be finalized (5-7 minutes)
    print("Waiting for deposit transaction on L2 network to be finalized (5-7 minutes)")
    l2_tx_receipt = zksync_provider.zksync.wait_for_transaction_receipt(transaction_hash=l2_hash,
                                                                        timeout=360,
                                                                        poll_latency=10)

    # return deposit transaction hashes from L1 and L2 networks
    return l1_tx_receipt['transactionHash'].hex(), l2_tx_receipt['transactionHash'].hex()


if __name__ == "__main__":
    # Get the private key from OS environment variables
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Set a provider
    ZKSYNC_PROVIDER = "https://zksync2-testnet.zksync.dev"
    ETH_PROVIDER = "https://rpc.ankr.com/eth_goerli"

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)

    # Connect to Ethereum network
    eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

    # Get account object by providing private key of the sender
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Create Ethereum provider
    eth_provider = EthereumProvider(zk_web3, eth_web3, account)

    # Perform the deposit
    amount = 0.01
    l1_tx_hash, l2_tx_hash = deposit(zk_web3, eth_web3, eth_provider, account, amount)

    print(f"L1 transaction: {l1_tx_hash}")
    print(f"L2 transaction: {l2_tx_hash}")
```

### Transfer ETH

Here is an example on how to transfer ETH on zkSync Era network.

```python
import os

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexStr, HexAddress
from eth_utils import to_checksum_address
from web3 import Web3

from zksync2.core.types import ZkBlockParams, EthBlockParams
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxFunctionCall


def get_eth_balance(zk_web3: Web3, address: HexAddress) -> float:
    """
    Get ETH balance of ETH address on zkSync network

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param address:
       ETH address that you want to get balance of.

    :return:
       Balance of ETH address.

    """

    # Get WEI balance of ETH address
    balance_wei = zk_web3.zksync.get_balance(
        address,
        EthBlockParams.LATEST.value
        )

    # Convert WEI balance to ETH
    balance_eth = Web3.from_wei(balance_wei, "ether")

    # Return the ETH balance of the ETH address
    return balance_eth


def transfer_eth(
    zk_web3: Web3,
    account: LocalAccount,
    address: HexAddress,
    amount: float
) -> bytes:
    """
    Transfer ETH to a desired address on zkSync network

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the transfer will be made

    :param address:
      Desired ETH address that you want to transfer to.

    :param amount:
      Desired ETH amount that you want to transfer.

    :return:
      The transaction hash of the deposit transaction.

    """

    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, ZkBlockParams.COMMITTED.value
    )

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create transaction
    tx_func_call = TxFunctionCall(
        chain_id=chain_id,
        nonce=nonce,
        from_=account.address,
        to=to_checksum_address(address),
        value=zk_web3.to_wei(amount, "ether"),
        data=HexStr("0x"),
        gas_limit=0,  # UNKNOWN AT THIS STATE
        gas_price=gas_price,
        max_priority_fee_per_gas=100_000_000,
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(tx_func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    # Convert transaction to EIP-712 format
    tx_712 = tx_func_call.tx712(estimate_gas)

    # Sign message & encode it
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Transfer ETH
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)
    print(f"Transaction hash is : {tx_hash.hex()}")

    # Wait for transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )
    print(f"Tx status: {tx_receipt['status']}")

    # Return the transaction hash of the transfer
    return tx_hash


if __name__ == "__main__":
    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Show balance before ETH transfer
    print(f"Balance before transfer : {get_eth_balance(zk_web3, account.address)} ETH")

    # Perform the ETH transfer
    transfer_eth(
        zk_web3,
        account,
        to_checksum_address("0x81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9"),
        0.001
        )

    # Show balance after ETH transfer
    print(f"Balance after transfer : {get_eth_balance(zk_web3, account.address)} ETH")
```

### Withdraw ETH

Withdrawal are executed in 2 steps:

- `Withdraw`: Initiates withdrawal on L2.
- `Finalize withdrawal`: Finalized withdrawal on L1.

#### Withdraw

```python
import os

from eth_account import Account
from eth_account.signers.local import LocalAccount
from hexbytes import HexBytes
from web3 import Web3
from web3.middleware import geth_poa_middleware
from web3.types import TxReceipt

from zksync2.core.types import Token
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.provider.eth_provider import EthereumProvider
from zksync2.transaction.transaction_builders import TxWithdraw


def withdraw(
        zksync_provider: Web3, account: LocalAccount, amount: float
) -> HexBytes:
    """Withdraw from Layer 2 to Layer 1 on zkSync network
    :param zksync_provider:
        Instance of ZkSync provider
    :param account:
        From which ETH account the withdrawal will be made
    :param amount:
        How much would the withdrawal will contain
    :return:
         Hash of withdraw transaction on L2 network
    """

    # Create withdrawal transaction
    withdrawal = TxWithdraw(
        web3=zksync_provider,
        token=Token.create_eth(),
        amount=Web3.to_wei(amount, "ether"),
        gas_limit=0,  # unknown
        account=account,
    )

    # ZkSync transaction gas estimation
    estimated_gas = zksync_provider.zksync.eth_estimate_gas(withdrawal.tx)

    # Estimate gas transaction
    tx = withdrawal.estimated_gas(estimated_gas)

    # Sign the transaction
    signed = account.sign_transaction(tx)

    # Broadcast the transaction to the network
    return zksync_provider.zksync.send_raw_transaction(signed.rawTransaction)


def finalize_withdraw(
        zksync_provider: Web3, ethereum_provider: EthereumProvider, withdraw_tx_hash: HexBytes
) -> TxReceipt:
    """
    Execute finalize withdraw transaction on L1 network
    :type zksync_provider:
         Instance of ZkSync provider
    :param ethereum_provider
        Instance of EthereumProvider
    :param withdraw_tx_hash
        Hash of withdraw transaction on L2 network
    :return:
        TxReceipt of finalize withdraw transaction on L1 network
    """
    zks_receipt = zksync_provider.zksync.wait_finalized(withdraw_tx_hash)

    # Check if withdraw transaction was successful
    if not zks_receipt["status"]:
        raise RuntimeError("Withdraw transaction on L2 network failed")

    # Execute finalize withdraw
    tx_receipt = ethereum_provider.finalize_withdrawal(zks_receipt["transactionHash"])

    # Check if finalize withdraw transaction was successful
    if not tx_receipt["status"]:
        raise RuntimeError("Finalize withdraw transaction L1 network failed")
    return tx_receipt


if __name__ == "__main__":
    # Get the private key from OS environment variables
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Set a provider
    ZKSYNC_PROVIDER = "https://zksync2-testnet.zksync.dev"
    ETH_PROVIDER = "https://rpc.ankr.com/eth_goerli"

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)

    # Connect to Ethereum network
    eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))
    eth_web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Create Ethereum provider
    eth_provider = EthereumProvider(zk_web3, eth_web3, account)

    amount = 0.01

    # Perform the withdrawal
    withdraw_tx_hash = withdraw(zk_web3, account, amount)

    print(f"Withdraw transaction hash: {withdraw_tx_hash.hex()}")
    print("Wait for withdraw transaction to be finalized on L2 network (11-24 hours)")
    print("Read more about withdrawal delay: https://era.zksync.io/docs/dev/troubleshooting/withdrawal-delay.html")
    print("When withdraw transaction is finalized, execute finalize withdrawal"
          "with WITHDRAW_TX_HASH environment variable set")

```

#### Finalize withdrawal

```python
import os

from eth_account import Account
from eth_account.signers.local import LocalAccount
from hexbytes import HexBytes
from web3 import Web3
from web3.middleware import geth_poa_middleware
from web3.types import TxReceipt

from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.provider.eth_provider import EthereumProvider


def finalize_withdraw(
        zksync_provider: Web3, ethereum_provider: EthereumProvider, withdraw_tx_hash: HexBytes
) -> TxReceipt:
    """
    Execute finalize withdraw transaction on L1 network
    :type zksync_provider:
         Instance of ZkSync provider
    :param ethereum_provider
        Instance of EthereumProvider
    :param withdraw_tx_hash
        Hash of withdraw transaction on L2 network
    :return:
        TxReceipt of finalize withdraw transaction on L1 network
    """
    zks_receipt = zksync_provider.zksync.wait_finalized(withdraw_tx_hash)

    # Check if withdraw transaction was successful
    if not zks_receipt["status"]:
        raise RuntimeError("Withdraw transaction on L2 network failed")

    # Execute finalize withdraw
    tx_receipt = ethereum_provider.finalize_withdrawal(zks_receipt["transactionHash"])

    # Check if finalize withdraw transaction was successful
    if not tx_receipt["status"]:
        raise RuntimeError("Finalize withdraw transaction L1 network failed")
    return tx_receipt


if __name__ == "__main__":
    # Get the private key from OS environment variables
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Get the withdrawal transaction hash from OS environment variables
    WITHDRAW_TX_HASH = HexBytes.fromhex(os.environ.get("WITHDRAW_TX_HASH"))

    # Set a provider
    ZKSYNC_PROVIDER = "https://zksync2-testnet.zksync.dev"
    ETH_PROVIDER = "https://rpc.ankr.com/eth_goerli"

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)

    # Connect to Ethereum network
    eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))
    eth_web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Create Ethereum provider
    eth_provider = EthereumProvider(zk_web3, eth_web3, account)

    # Finalize withdraw of previous successful withdraw transaction
    eth_tx_receipt = finalize_withdraw(zk_web3, eth_provider, WITHDRAW_TX_HASH)

    fee = eth_tx_receipt["gasUsed"] * eth_tx_receipt["effectiveGasPrice"]
    amount = 0.01
    print(f"Finalize withdraw transaction: {eth_tx_receipt['transactionHash'].hex()}")
    print(f"Effective ETH withdraw (paid fee): {Web3.from_wei(Web3.to_wei(amount, 'ether') - fee, 'ether')}")

```

### Transfer token

Here is an example on how to transfer tokens on zkSync Era network.

```python
import os

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress, HexStr

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.erc20_contract import get_erc20_abi
from zksync2.module.module_builder import ZkSyncBuilder


def transfer_erc20(
        token_contract,
        account: LocalAccount,
        address: HexAddress,
        amount: float) -> HexStr:
    """
       Transfer ETH to a desired address on zkSync network

       :param token_contract:
           Instance of ERC20 contract

       :param account:
           From which account the transfer will be made

       :param address:
         Desired ETH address that you want to transfer to.

       :param amount:
         Desired ETH amount that you want to transfer.

       :return:
         The transaction hash of the transfer transaction.

       """
    tx = token_contract.functions.transfer(address, amount).build_transaction({
        "nonce": zk_web3.zksync.get_transaction_count(account.address, EthBlockParams.LATEST.value),
        "from": account.address,
        "maxPriorityFeePerGas": 1_000_000,
        "maxFeePerGas": zk_web3.zksync.gas_price,
    })

    signed = account.sign_transaction(tx)

    # Send transaction to zkSync network
    tx_hash = zk_web3.zksync.send_raw_transaction(signed.rawTransaction)
    print(f"Tx: {tx_hash.hex()}")

    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )
    print(f"Tx status: {tx_receipt['status']}")

    return tx_hash


if __name__ == "__main__":
    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Set a provider
    PROVIDER = "https://testnet.era.zksync.dev"

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account1: LocalAccount = Account.from_key(PRIVATE_KEY)
    account2_address = zk_web3.to_checksum_address("0x81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9")

    token_address = zk_web3.to_checksum_address("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
    token_contract = zk_web3.zksync.contract(token_address, abi=get_erc20_abi())

    # Show balance before token transfer
    print(f"Account1 Crown balance before transfer: {token_contract.functions.balanceOf(account1.address).call()}")
    print(f"Account2 Crown balance before transfer: {token_contract.functions.balanceOf(account2_address).call()}")

    # Perform the ETH transfer
    transfer_erc20(
        token_contract,
        account1,
        account2_address,
        3
    )

    # Show balance after token transfer
    print(f"Account1 Crown balance after transfer: {token_contract.functions.balanceOf(account1.address).call()}")
    print(f"Account2 Crown balance after transfer: {token_contract.functions.balanceOf(account2_address).call()}")

```

### Smart contract and smart account deployment

With zkSync Era, you can deploy a contract using the create and create2 opcode, by simply building the contract into a binary
format and deploying it to the zkSync Era network.

- [Storage](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/storage/Storage.sol): Contract without constructor.
- [Incrementer](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/incrementer/Incrementer.sol): Contract with constructor.
- [Demo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Demo.sol): Contract that has a dependency on
  [Foo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Foo.sol) contract.
- [Token](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/token/Token.sol): custom ERC20 token.
- [Paymaster](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/paymaster/Paymaster.sol): custom paymaster which provides payment of transaction fees in ERC20 tokens.

There is a [user guide](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/README.md) on how to compile Solidity smart contracts using `zksolc`
compiler. `zksolc` compiler generates a `*.zbin` and a `combined.json` file that contains the bytecode and ABI of a smart contract.

#### Deploy a contract with create opcode

To deploy the contract, the contract ABI is needed for calling methods in the standard Web3 way.
`ConctractEncoder` is used to read the ABI and bytecode from the `combined.json` file.

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreateContract


def deploy_contract(
    zk_web3: Web3, account: LocalAccount, compiled_contract: Path
) -> HexAddress:
    """Deploy compiled contract on zkSync network using create() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :return:
        Address of deployed contract.
    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Get contract ABI and bytecode information
    storage_contract = ContractEncoder.from_json(zk_web3, compiled_contract)[0]

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create deployment contract transaction
    create_contract = TxCreateContract(
        web3=zk_web3,
        chain_id=chain_id,
        nonce=nonce,
        from_=account.address,
        gas_limit=0,  # UNKNOWN AT THIS STATE
        gas_price=gas_price,
        bytecode=storage_contract.bytecode,
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create_contract.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create_contract.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]

    print(f"Deployed contract address: {contract_address}")

    # Return the contract deployed address
    return contract_address


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing private key of the sender
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/storage/build/combined.json")

    # Perform contract deployment
    deploy_contract(zk_web3, account, contract_path)

```

#### Deploy a contract with a constructor using create opcode

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder
from zksync2.manage_contracts.nonce_holder import NonceHolder
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreateContract


def generate_random_salt() -> bytes:
    return os.urandom(32)


def deploy_contract(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path, constructor_args: [dict | tuple]
) -> HexAddress:
    """Deploy compiled contract with constructor on zkSync network using create() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :param constructor_args:
        Constructor arguments that can be provided via:
        dictionary: {"_incrementer": 2}
        tuple: tuple([2])

    :return:
        Address of deployed contract.
    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Get deployment nonce
    nonce_holder = NonceHolder(zk_web3, account)
    deployment_nonce = nonce_holder.get_deployment_nonce(account.address)

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)
    precomputed_address = deployer.compute_l2_create_address(account.address, deployment_nonce)

    # Get contract ABI and bytecode information
    incrementer_contract = ContractEncoder.from_json(zk_web3, compiled_contract)[0]

    # Encode the constructor arguments
    encoded_constructor = incrementer_contract.encode_constructor(**constructor_args)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create deployment contract transaction
    create_contract = TxCreateContract(
        web3=zk_web3,
        chain_id=chain_id,
        nonce=nonce,
        from_=account.address,
        gas_limit=0,  # UNKNOWN AT THIS STATE,
        gas_price=gas_price,
        bytecode=incrementer_contract.bytecode,
        call_data=encoded_constructor,
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create_contract.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create_contract.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")

    return contract_address


def execute(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path, contract_address: HexAddress
):
    """Interact with deployed smart contract on zkSync network

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :param contract_address:
        Contract address on zkSync network
    """
    # Get contract ABI and bytecode information
    incrementer_contract = ContractEncoder.from_json(zk_web3, compiled_contract)[0]

    # Execute Get method on smart contract
    value = incrementer_contract.contract.functions.get().call(
        {
            "from": account.address,
            "to": contract_address
        })
    print(f"Value: {value}")

    gas_price = zk_web3.zksync.gas_price

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(account.address, EthBlockParams.LATEST.value)

    # Execute increment method on smart contract
    tx = incrementer_contract.contract.functions.increment().build_transaction({
        "nonce": nonce,
        "from": account.address,
        "maxPriorityFeePerGas": 1_000_000,
        "maxFeePerGas": gas_price,
        "to": contract_address
    })

    # Sign transaction
    signed = account.sign_transaction(tx)

    # Send transaction to zkSync network
    tx_hash = zk_web3.zksync.send_raw_transaction(signed.rawTransaction)

    # Wait for transaction to be finalized
    zk_web3.zksync.wait_for_transaction_receipt(tx_hash)
    print(f"Increment transaction: {tx_hash.hex()}")

    # Execute Get method on smart contract
    value = incrementer_contract.contract.functions.get().call(
        {
            "from": account.address,
            "to": contract_address
        })
    print(f"Value after increment: {value}")


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/incrementer/build/combined.json")

    # Set constructor arguments
    constructor_arguments = {"_incrementer": 2}

    # Perform contract deployment
    contract_address = deploy_contract(zk_web3, account, contract_path, constructor_arguments)

    # alternative: specifying constructor arguments using args instead of kwargs
    # constructor_arguments = tuple([2])
    # change 72 line of code with following:
    # encoded_constructor = contract_encoder.encode_constructor(*constructor_args)

    execute(zk_web3, account, contract_path, contract_address)

```

#### Deploy a contract with dependency using create opcode

In following example

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder
from zksync2.manage_contracts.nonce_holder import NonceHolder
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreateContract


def generate_random_salt() -> bytes:
    return os.urandom(32)


def deploy_contract(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path
):
    """Deploy compiled contract with dependency on zkSync network using create() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :return:
        Address of deployed contract.
    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Deployment of same smart contract (same bytecode) without salt cannot be done twice
    # Remove salt if you want to deploy contract only once
    random_salt = generate_random_salt()

    # Get deployment nonce
    nonce_holder = NonceHolder(zk_web3, account)
    deployment_nonce = nonce_holder.get_deployment_nonce(account.address)

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)
    precomputed_address = deployer.compute_l2_create_address(account.address, deployment_nonce)

    # Get ABI and bytecode of demo and foo contracts
    demo_contract, foo_contract = ContractEncoder.from_json(zk_web3, compiled_contract)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create deployment contract transaction
    create_contract = TxCreateContract(web3=zk_web3,
                                       chain_id=chain_id,
                                       nonce=nonce,
                                       from_=account.address,
                                       gas_limit=0,
                                       gas_price=gas_price,
                                       bytecode=demo_contract.bytecode,
                                       deps=[foo_contract.bytecode],
                                       salt=random_salt)

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create_contract.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create_contract.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing private key of the sender
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/demo/build/combined.json")

    # Perform contract deployment
    deploy_contract(zk_web3, account, contract_path)

```

#### Deploy a contract using create2 opcode

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreate2Contract

ZKSYNC_TEST_URL = "https://zksync2-testnet.zksync.dev"


def generate_random_salt() -> bytes:
    return os.urandom(32)


def deploy_contract(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path
) -> HexAddress:
    """Deploy compiled contract on zkSync network using create2() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :return:
        Address of deployed contract.

    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Deployment of same smart contract (same bytecode) without salt cannot be done twice
    # Remove salt if you want to deploy contract only once
    random_salt = generate_random_salt()

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)

    # Get contract ABI and bytecode information
    storage_contract = ContractEncoder.from_json(zk_web3, compiled_contract)[0]

    # Get precomputed contract address
    precomputed_address = deployer.compute_l2_create2_address(sender=account.address,
                                                              bytecode=storage_contract.bytecode,
                                                              constructor=b'',
                                                              salt=random_salt)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create2 deployment contract transaction
    create2_contract = TxCreate2Contract(web3=zk_web3,
                                         chain_id=chain_id,
                                         nonce=nonce,
                                         from_=account.address,
                                         gas_limit=0,
                                         gas_price=gas_price,
                                         bytecode=storage_contract.bytecode,
                                         salt=random_salt)

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create2_contract.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create2_contract.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")

    return contract_address


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing private key of the sender
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/storage/build/combined.json")

    # Perform contract deployment
    deploy_contract(zk_web3, account, contract_path)

```

#### Deploy a contract with dependency using create2 opcode

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreate2Contract


def generate_random_salt() -> bytes:
    return os.urandom(32)


def deploy_contract(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path
) -> HexAddress:
    """Deploy compiled contract with dependency on zkSync network using create2() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled contract source.

    :return:
        Address of deployed contract.

    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Deployment of same smart contract (same bytecode) without salt cannot be done twice
    # Remove salt if you want to deploy contract only once
    random_salt = generate_random_salt()

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)

    # Get ABI and bytecode of demo and foo contracts
    demo_contract, foo_contract = ContractEncoder.from_json(zk_web3, compiled_contract)

    # Get precomputed contract address
    precomputed_address = deployer.compute_l2_create2_address(sender=account.address,
                                                              bytecode=demo_contract.bytecode,
                                                              constructor=b'',
                                                              salt=random_salt)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create2 deployment contract transaction
    create2_contract = TxCreate2Contract(web3=zk_web3,
                                         chain_id=chain_id,
                                         nonce=nonce,
                                         from_=account.address,
                                         gas_limit=0,
                                         gas_price=gas_price,
                                         bytecode=demo_contract.bytecode,
                                         deps=[foo_contract.bytecode],
                                         salt=random_salt)
    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create2_contract.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create2_contract.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")

    return contract_address


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://zksync2-testnet.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing private key of the sender
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/demo/build/combined.json")

    # Perform contract deployment
    deploy_contract(zk_web3, account, contract_path)

```

#### Deploy a smart account using create opcode

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder, JsonConfiguration
from zksync2.manage_contracts.nonce_holder import NonceHolder
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreateAccount


def deploy_account(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path, constructor_args: [dict | tuple]
) -> HexAddress:
    """Deploy custom account on zkSync network using create() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled custom account.

    :param constructor_args:
        Constructor arguments that can be provided via:
        dictionary: {"_erc20": token_address}
        tuple: tuple([token_address])

    :return:
        Address of deployed contract.

    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Get deployment nonce
    deployment_nonce = NonceHolder(zk_web3, account).get_deployment_nonce(account.address)

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)
    precomputed_address = deployer.compute_l2_create_address(account.address, deployment_nonce)

    # Get contract ABI and bytecode information
    token_contract = ContractEncoder.from_json(zk_web3, compiled_contract, JsonConfiguration.STANDARD)

    # Encode the constructor arguments
    encoded_constructor = token_contract.encode_constructor(**constructor_args)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create deployment contract transaction
    create_account = TxCreateAccount(
        web3=zk_web3,
        chain_id=chain_id,
        nonce=nonce,
        from_=account.address,
        gas_price=gas_price,
        bytecode=token_contract.bytecode,
        call_data=encoded_constructor,
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create_account.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create_account.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"Contract address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")

    return contract_address


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://testnet.era.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/custom-paymaster/build/Paymaster.json")

    # Crown token than can be minted for free
    token_address = zk_web3.to_checksum_address("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
    constructor_arguments = {"_erc20": token_address}

    # Perform contract deployment
    deploy_account(zk_web3, account, contract_path, constructor_arguments)

```

#### Deploy a smart account using create2 opcode

```python
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexAddress
from web3 import Web3

from zksync2.core.types import EthBlockParams
from zksync2.manage_contracts.contract_encoder_base import ContractEncoder, JsonConfiguration
from zksync2.manage_contracts.precompute_contract_deployer import PrecomputeContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxCreate2Account


def generate_random_salt() -> bytes:
    return os.urandom(32)


def deploy_account(
        zk_web3: Web3, account: LocalAccount, compiled_contract: Path, constructor_args: [dict | tuple]
) -> HexAddress:
    """Deploy custom account on zkSync network using create2() opcode

    :param zk_web3:
        Instance of ZkSyncBuilder that interacts with zkSync network

    :param account:
        From which account the deployment contract tx will be made

    :param compiled_contract:
        Compiled custom account.

    :param constructor_args:
        Constructor arguments that can be provided via:
        dictionary: {"_erc20": token_address}
        tuple: tuple([token_address])

    :return:
        Address of deployed contract.

    """
    # Get chain id of zkSync network
    chain_id = zk_web3.zksync.chain_id

    # Signer is used to generate signature of provided transaction
    signer = PrivateKeyEthSigner(account, chain_id)

    # Get nonce of ETH address on zkSync network
    nonce = zk_web3.zksync.get_transaction_count(
        account.address, EthBlockParams.PENDING.value
    )

    # Deployment of same smart contract (same bytecode) without salt cannot be done twice
    # Remove salt if you want to deploy contract only once
    random_salt = generate_random_salt()

    # Precompute the address of smart contract
    # Use this if there is a case where contract address should be known before deployment
    deployer = PrecomputeContractDeployer(zk_web3)

    # Get contract ABI and bytecode information
    token_contract = ContractEncoder.from_json(zk_web3, compiled_contract, JsonConfiguration.STANDARD)

    # Encode the constructor arguments
    encoded_constructor = token_contract.encode_constructor(**constructor_args)

    # Get precomputed contract address
    precomputed_address = deployer.compute_l2_create2_address(sender=account.address,
                                                              bytecode=token_contract.bytecode,
                                                              constructor=encoded_constructor,
                                                              salt=random_salt)

    # Get current gas price in Wei
    gas_price = zk_web3.zksync.gas_price

    # Create2 account deployment transaction
    create2_account = TxCreate2Account(web3=zk_web3,
                                        chain_id=chain_id,
                                        nonce=nonce,
                                        from_=account.address,
                                        gas_limit=0,
                                        gas_price=gas_price,
                                        bytecode=token_contract.bytecode,
                                        salt=random_salt,
                                        call_data=encoded_constructor)

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(create2_account.tx)
    print(f"Fee for transaction is: {Web3.from_wei(estimate_gas * gas_price, 'ether')} ETH")

    # Convert transaction to EIP-712 format
    tx_712 = create2_account.tx712(estimate_gas)

    # Sign message
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Deploy contract
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)

    # Wait for deployment contract transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )

    print(f"Tx status: {tx_receipt['status']}")
    contract_address = tx_receipt["contractAddress"]
    print(f"Account address: {contract_address}")

    # Check does precompute address match with deployed address
    if precomputed_address.lower() != contract_address.lower():
        raise RuntimeError("Precomputed contract address does now match with deployed contract address")

    return contract_address


if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://testnet.era.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Provide a compiled JSON source contract
    contract_path = Path("solidity/custom-paymaster/build/Paymaster.json")

    # Crown token than can be minted for free
    token_address = zk_web3.to_checksum_address("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
    constructor_arguments = {"_erc20": token_address}

    # Perform contract deployment
    deploy_account(zk_web3, account, contract_path, constructor_arguments)

```

### Use paymaster

This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.

```python
import json
import os
from pathlib import Path

from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexStr

from zksync2.core.types import EthBlockParams, PaymasterParams
from zksync2.manage_contracts.paymaster_utils import PaymasterFlowEncoder
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction_builders import TxFunctionCall


def get_abi_from_standard_json(standard_json: Path):
    with standard_json.open(mode="r") as json_f:
        return json.load(json_f)["abi"]


"""
This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.
"""
if __name__ == "__main__":
    # Set a provider
    PROVIDER = "https://testnet.era.zksync.dev"

    # Byte-format private key
    PRIVATE_KEY = bytes.fromhex(os.environ.get("PRIVATE_KEY"))

    # Connect to zkSync network
    zk_web3 = ZkSyncBuilder.build(PROVIDER)

    # Get account object by providing from private key
    account: LocalAccount = Account.from_key(PRIVATE_KEY)

    # Crown token than can be minted for free
    token_address = zk_web3.to_checksum_address("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
    # Paymaster for Crown token
    paymaster_address = zk_web3.to_checksum_address("0xd660c2F92d3d0634e5A20f26821C43F1b09298fe")

    # Provide a compiled JSON source contract
    token_path = Path("solidity/custom-paymaster/build/Token.json")

    token_contract = zk_web3.zksync.contract(token_address, abi=get_abi_from_standard_json(token_path))

    # MINT TOKEN TO USER ACCOUNT (so user can pay fee with token)
    balance = token_contract.functions.balanceOf(account.address).call()
    print(f"Crown token balance before mint: {balance}")

    mint_tx = token_contract.functions.mint(account.address, 15).build_transaction({
        "nonce": zk_web3.zksync.get_transaction_count(account.address, EthBlockParams.LATEST.value),
        "from": account.address,
        "maxPriorityFeePerGas": 1_000_000,
        "maxFeePerGas": zk_web3.zksync.gas_price,
    })

    signed = account.sign_transaction(mint_tx)

    # Send mint transaction to zkSync network
    tx_hash = zk_web3.zksync.send_raw_transaction(signed.rawTransaction)

    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )
    print(f"Tx status: {tx_receipt['status']}")

    balance = token_contract.functions.balanceOf(account.address).call()
    print(f"Crown token balance after mint: {balance}")

    # SEND SOME ETH TO PAYMASTER (so it can pay fee with ETH)

    chain_id = zk_web3.zksync.chain_id
    gas_price = zk_web3.zksync.gas_price
    signer = PrivateKeyEthSigner(account, chain_id)

    tx_func_call = TxFunctionCall(
        chain_id=zk_web3.zksync.chain_id,
        nonce=zk_web3.zksync.get_transaction_count(account.address, EthBlockParams.LATEST.value),
        from_=account.address,
        to=paymaster_address,
        value=zk_web3.to_wei(1, "ether"),
        data=HexStr("0x"),
        gas_limit=0,  # Unknown at this state, estimation is done in next step
        gas_price=gas_price,
        max_priority_fee_per_gas=100_000_000,
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(tx_func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    # Convert transaction to EIP-712 format
    tx_712 = tx_func_call.tx712(estimate_gas)

    # Sign message & encode it
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Transfer ETH
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)
    print(f"Transaction hash is : {tx_hash.hex()}")

    # Wait for transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )
    print(f"Tx status: {tx_receipt['status']}")

    # USE PAYMASTER TO PAY MINT TRANSACTION WITH CROWN TOKEN

    print(f"Paymaster balance before mint: "
          f"{zk_web3.zksync.get_balance(account.address, EthBlockParams.LATEST.value)}")
    print(f"User's Crown token balance before mint: {token_contract.functions.balanceOf(account.address).call()}")
    print(f"Paymaster balance before mint: "
          f"{zk_web3.zksync.get_balance(paymaster_address, EthBlockParams.LATEST.value)}")
    print(f"Paymaster Crown token balance before mint: {token_contract.functions.balanceOf(paymaster_address).call()}")

    # Use the paymaster to pay mint transaction with token
    calladata = token_contract.encodeABI(fn_name="mint", args=[account.address, 7])

    # Create paymaster parameters
    paymaster_params = PaymasterParams(**{
        "paymaster": paymaster_address,
        "paymaster_input": zk_web3.to_bytes(
            hexstr=PaymasterFlowEncoder(zk_web3).encode_approval_based(token_address, 1, b''))
    })

    tx_func_call = TxFunctionCall(
        chain_id=zk_web3.zksync.chain_id,
        nonce=zk_web3.zksync.get_transaction_count(account.address, EthBlockParams.LATEST.value),
        from_=account.address,
        to=token_address,
        data=calladata,
        gas_limit=0,  # Unknown at this state, estimation is done in next step
        gas_price=gas_price,
        max_priority_fee_per_gas=100_000_000,
        paymaster_params=paymaster_params
    )

    # ZkSync transaction gas estimation
    estimate_gas = zk_web3.zksync.eth_estimate_gas(tx_func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    # Convert transaction to EIP-712 format
    tx_712 = tx_func_call.tx712(estimate_gas)

    # Sign message & encode it
    signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())

    # Encode signed message
    msg = tx_712.encode(signed_message)

    # Transfer ETH
    tx_hash = zk_web3.zksync.send_raw_transaction(msg)
    print(f"Transaction hash is : {tx_hash.hex()}")

    # Wait for transaction to be included in a block
    tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
        tx_hash, timeout=240, poll_latency=0.5
    )
    print(f"Tx status: {tx_receipt['status']}")

    print(f"Paymaster balance after mint: "
          f"{zk_web3.zksync.get_balance(account.address, EthBlockParams.LATEST.value)}")
    print(f"User's Crown token balance after mint: {token_contract.functions.balanceOf(account.address).call()}")
    print(f"Paymaster balance after mint: "
          f"{zk_web3.zksync.get_balance(paymaster_address, EthBlockParams.LATEST.value)}")
    print(f"Paymaster Crown token balance after mint: {token_contract.functions.balanceOf(paymaster_address).call()}")

```
