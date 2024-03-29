---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Types | zkSync Docs
---

# Types and Interfaces

## `AccountAbstractionVersion`

Enumerated list of account abstraction versions.

- None = `0` (Used for contracts that are not accounts.)
- Version1 = `1`

## `BatchDetails`

Class representation of batch information containing various optional and mandatory fields.

    private String commitTxHash;
    private Date committedAt;
    private String executeTxHash;
    private Date executedAt;
    private Uint l1TxCount;
    private Uint l2TxCount;
    private Uint number;
    private String proveTxHash;
    private Date provenAt;
    private String rootHash;
    private String status;
    private Uint timestamp;

## `Block`

Class representation of a block.

    private String l1BatchNumber;
    private String l1BatchTimestamp;

## `BlockDetails`

Class representation of block information containing various optional and mandatory fields.

    private String commitTxHash;
    private Date committedAt;
    private String executeTxHash;
    private Date executedAt;
    private Uint l1TxCount;
    private Uint l2TxCount;
    private Uint number;
    private String proveTxHash;
    private Date provenAt;
    private String rootHash;
    private String status;
    private Uint timestamp;

## `ZkBlockParameterName`

Pipe-delimited list of block labels that includes block number in denary and hex plus block statuses.

- `committed`
- `finalized`
- `latest`

## `Eip712Meta`

Type defining an EIP-712 transaction with optional parameters.

    private BigInteger gasPerPubdata;
    private byte[] customSignature;
    private byte[][] factoryDeps;
    private PaymasterParams paymasterParams;

## `Fee`

Class representation of transaction fee.

    private Uint256 gasLimit;
    private Uint256 maxFeePerGas;
    private Uint256 maxPriorityFeePerGas;
    private Uint256 gasPerPubdataLimit;

## `FullDepositFee`

Class representation of full deposit fee containing various mandatory and optional fields.

    public BigInteger maxFeePerGas;
    public BigInteger maxPriorityFeePerGas;
    public BigInteger gasPrice;
    public BigInteger baseCost;
    public BigInteger l1GasLimit;
    public BigInteger l2GasLimit;

## `L2ToL1Log`

Class representation of a layer 2 to layer 1 transaction log containing various fields.

    public String BlockNumber;
    public String BlockHash;
    public String L1BatchNumber;
    public String TransactionIndex;
    public String ShardId;
    public boolean IsService;
    public Address Sender;
    public String Key;
    public String Value;
    public String TxHash;
    public int Index;

## `ZkLog`

Class representation of log that extends Ethers `Log` and supplies the layer 1 batch number.

    private String l1BatchNumber;

## `L2ToL1MessageProof`

Class representation of message proof containing various fields.

    private List<String> proof;
    private Integer id;
    private String root;

## `PaymasterParams`

Type defining a paymaster by address and the bytestream input.

    private String paymaster;
    private byte[] paymasterInput;

## `StorageProof`

Interace representation of Merkle proofs for storage values.

    private String address;
    private StorageProofData storageProof;

## `StorageProofData`

    String key;
    String value;
    BigInteger index;
    String[] proof;

## `Token`

Class representation of token containing various fields.

    public static final Token ETH = createETH();
    private String l1Address;
    private String l2Address;
    private String symbol;
    private Integer decimals;

## `TransactionDetails`

Class representation of transaction details containing various mandatory and optional fields.

    private boolean isL1Originated;
    private TransactionStatus status;
    private String fee;
    private String initiatorAddress;
    private Date receivedAt;
    private String ethCommitTxHash;
    private String ethProveTxHash;
    private String ethExecuteTxHash;

## `TransactionReceipt`

Class representation of transaction receipt that extends from Web3j `TransactionReceipt` with additional fields.

    private String l1BatchNumber;
    private String l1BatchTxIndex;
    private List<L2toL1Log> l2ToL1Logs;

## `TransactionStatus`

Non-enumerated enum list of transaction statuses.

    PROCESSING("processing"),
    COMMITTED("committed"),
    FINALIZED("finalized"),
    NOT_FOUND("not-found");

## `DepositTransaction`

Used to call wallet.deposit, wallet.estimateGasdeposit, wallet.getDepositTransaction

    public String tokenAddress;
    public BigInteger amount;
    public String to;
    public BigInteger l2GasLimit;
    public String bridgeAddress;
    public byte[] customBridgeData;
    public BigInteger gasPerPubdataByte;
    public BigInteger operatorTip;
    public String refoundRecepient;
    public Boolean approveERC20;
    public TransactionOptions options;

## `RequestExecuteTransaction`

    private BigInteger l2GasLimit;
    private String contractAddress;
    private byte[] calldata;
    private BigInteger l2Value;
    private byte[][] factoryDeps;
    private BigInteger operatorTip;
    private BigInteger gasPerPubDataByte;
    private String refoundRecepient;
    private TransactionOptions options;

## `TransferTransaction`

    public String to;
    public BigInteger amount;
    public String from;
    public String tokenAddress;
    public BigInteger gasPerPubData;
    public PaymasterParams paymasterParams;
    public TransactionOptions options;

## `WithdrawTransaction`

    public String tokenAddress;
    public BigInteger amount;
    public String to;
    public String from;
    public String bridgeAddress;
    public byte[] customBridgeData;
    public PaymasterParams paymasterParams;
    public TransactionOptions options;

## `TransactionOptions`

    private BigInteger nonce;
    private BigInteger value;
    private BigInteger gasPrice;
    private BigInteger maxFeePerGas;
    private BigInteger maxPriorityFeePerGas;
    private BigInteger gasLimit;
    private BigInteger chainId;
