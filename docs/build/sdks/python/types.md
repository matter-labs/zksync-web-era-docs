---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Types | zkSync Docs
---

# Types

All the types which are used in the SDK are referenced here:

```python
ADDRESS_DEFAULT = HexStr("0x" + "0" * 40)

TokenAddress = NewType('token_address', HexStr)
TransactionHash = Union[Hash32, HexBytes, HexStr]
L2WithdrawTxHash = Union[Hash32, HexBytes, HexStr]
From = NewType("from", int)
Limit = NewType('limit', int)


class ZkBlockParams(Enum):
    COMMITTED = "committed"
    FINALIZED = "finalized"


class EthBlockParams(Enum):
    PENDING = "pending"
    LATEST = "latest"


@dataclass
class Token:
    l1_address: HexStr
    l2_address: HexStr
    symbol: str
    decimals: int

    def format_token(self, amount) -> str:
        return str(Decimal(amount) / Decimal(10) ** self.decimals)

    def is_eth(self) -> bool:
        return self.l1_address == ADDRESS_DEFAULT and self.symbol == "ETH"

    def into_decimal(self, amount: int) -> Decimal:
        return Decimal(amount).scaleb(self.decimals) // Decimal(10) ** self.decimals

    def to_int(self, amount: Union[Decimal, int]) -> int:
        if isinstance(amount, int):
            amount = Decimal(amount)
        return int(amount * (Decimal(10) ** self.decimals))

    @staticmethod
    def create_eth() -> 'Token':
        return Token(ADDRESS_DEFAULT, ADDRESS_DEFAULT, "ETH", 18)


@dataclass
class PaymasterParams(dict):
    paymaster: HexStr
    paymaster_input: bytes
```

# BridgeAddresses

```python
@dataclass
class BridgeAddresses:
    l1_eth_default_bridge: HexStr
    l2_eth_default_bridge: HexStr
    l1_erc20_default_bridge: HexStr
    l2_erc20_default_bridge: HexStr
```

# Transaction

```python
Transaction = TypedDict(
    "Transaction",
    {
        "chain_id": int,
        "nonce": int,
        "from": HexStr,
        "to": HexStr,
        "gas": int,
        "gasPrice": int,
        "maxPriorityFeePerGas": int,
        "value": int,
        "data": HexStr,
        "transactionType": int,
        "accessList": Optional[AccessList],
        "eip712Meta": EIP712Meta,
    },
    total=False,
)
```

# Fee

```python
@dataclass
class Fee:
    gas_limit: int = 0
    max_fee_per_erg: int = 0
    max_priority_fee_per_erg : int = 0
    gas_per_pub_data_limit: int = 0
```

# TransferTransaction

```python
@dataclass
class TransferTransaction:
    to: HexStr
    amount: int = 0
    token_address: HexStr = None
    chain_id: int = None
    nonce: int = None
    gas_limit: int = 0
    gas_price: int = 0
    max_priority_fee_per_gas = 100_000_000
    gas_per_pub_data: int = 50000
```

# WithdrawTransaction

```python
@dataclass
class WithdrawTransaction:
    token: HexStr
    amount: int
    to: HexStr = None
    bridge_address: HexStr = None
    options: TransactionOptions = None
```

# L1BridgeContracts

```python
@dataclass
class L1BridgeContracts:
    erc20: Contract
    weth: Contract
```

# TransactionOptions

```python
@dataclass
class TransactionOptions:
    chain_id: int = None
    nonce: int = None
    value: int = None
    gas_price: int = None
    max_fee_per_gas: int = None
    max_priority_fee_per_gas: int = None
    gas_limit: int = None
```

# DepositTransaction

```python
@dataclass
class DepositTransaction:
    token: HexStr
    amount: int = None
    to: HexStr = None
    operator_tip: int = 0
    bridge_address: HexStr = None
    approve_erc20: bool = False
    l2_gas_limit: int = None
    gas_per_pubdata_byte: int = DEPOSIT_GAS_PER_PUBDATA_LIMIT
    custom_bridge_data: bytes = None
    refund_recipient: HexStr = None
    l2_value: int = 0
    options: TransactionOptions = None
```

# RequestExecuteCallMsg

```python
@dataclass
class RequestExecuteCallMsg:
    contract_address: HexStr
    call_data: Union[bytes, HexStr]
    from_: HexStr = None
    l2_gas_limit: int = 0
    l2_value: int = 0
    factory_deps: List[bytes] = None
    operator_tip: int = 0
    gas_per_pubdata_byte: int = DEPOSIT_GAS_PER_PUBDATA_LIMIT
    refund_recipient: HexStr = None
    options: TransactionOptions = None
```

# PaymasterParams

```python
@dataclass
class PaymasterParams:
    paymaster: HexStr
    paymaster_input: bytes
```

# BlockDetails

```python
@dataclass
class BlockDetails:
    commit_tx_hash: str
    committed_at: datetime
    execute_tx_hash: str
    executed_at: datetime
    l1_tx_count: int
    l2_tx_count: int
    number: int
    prove_tx_hash: str
    proven_at: datetime
    root_hash: str
    status: str
    timestamp: int
```

# ContractAccountInfo

```python
@dataclass
class ContractAccountInfo:
    account_abstraction_version: AccountAbstractionVersion
    account_nonce_ordering: AccountNonceOrdering
```

# AccountAbstractionVersion

```python
class AccountAbstractionVersion(Enum):
    NONE = 0
    VERSION_1 = 1
```

# AccountNonceOrdering

```python
class AccountNonceOrdering(Enum):
    Sequential = 0
    Arbitrary = 1
```

# FullDepositFee

```python
@dataclass
class FullDepositFee:
    base_cost: int
    l1_gas_limit: int
    l2_gas_limit: int
    max_fee_per_gas: int = None
    max_priority_fee_per_gas: int = None
    gas_price: int = None
```
