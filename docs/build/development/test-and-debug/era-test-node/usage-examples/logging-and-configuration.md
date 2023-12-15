---
description: Debug further with exceptional logging capabilities.
---

# Logging and Configuration

### Logging Levels

The `era-test-node` can be started with different logging levels:

- `debug`
- `info`
- `warn`
- `error`
- `trace`

You can specify the logging level using the `--log` option, for example:

```bash
era_test_node --log=error run
```

#### Logging to a File

You can also specify a file path for logging using the `--log-file-path` option (defaults to `./era_test_node.log`):

```bash
era_test_node --log=error --log-file-path=run.log run
```

### Caching Options

The node caches certain network requests by default to disk in the `.cache` directory. You can configure caching using the `--cache` parameter:

- `--cache=none`: Disables caching.
- `--cache=memory`: Caches in-memory only.
- `--cache=disk`: Caches to disk (default option).

Example:

```bash
era_test_node --cache=none run
```

```bash
era_test_node --cache=memory run
```

When using `--cache=disk`, you can specify the cache directory with the `--cache-dir` parameter and reset the cache on startup using `--reset-cache`:

```bash
era_test_node --cache=disk --cache-dir=/tmp/foo --reset-cache run
```

### Transaction Details

For more detailed transaction information, such as call traces and ABI names, you can use the following options:

<table><thead><tr><th width="255">Option</th><th>Description</th><th width="123">Default</th><th>Possible Values</th></tr></thead><tbody><tr><td><code>--show-calls &#x3C;SHOW_CALLS></code></td><td>Show call traces.</td><td><code>none</code></td><td><code>none</code>, <code>user</code>, <code>all</code></td></tr><tr><td><code>--resolve-hashes &#x3C;RESOLVE_HASHES></code></td><td>Resolve ABI names.</td><td><code>false</code></td><td><code>true</code>, <code>false</code></td></tr><tr><td><code>--show-storage-logs &#x3C;SHOW_STORAGE_LOGS></code></td><td>Show storage log information.</td><td><code>none</code></td><td><code>none</code>, <code>read</code>, <code>write</code>, <code>all</code></td></tr><tr><td><code>--show-vm-details &#x3C;SHOW_VM_DETAILS></code></td><td>Show VM details information.</td><td><code>none</code></td><td><code>none</code>, <code>all</code></td></tr><tr><td><code>--show-gas-details &#x3C;SHOW_GAS_DETAILS></code></td><td>Show Gas details information.</td><td><code>none</code></td><td><code>none</code>, <code>all</code></td></tr></tbody></table>

These options provide fine-grained control over the level of detail you receive during transaction processing, including call traces, ABI name resolution, storage logs, VM details, and gas details.

Example:

{% code overflow="wrap" %}

```bash
era_test_node --show-calls=user --resolve-hashes --show-storage-logs=all --show-vm-details=all --show-gas-details=all replay_tx testnet 0x90e06ad8c960be39e870a97c24c5c001a19fd62451655540f3a3bf883fca3ce7
```

{% endcode %}

Example output:

<details>

<summary>Example output</summary>

```
18:15:43 [INFO] Creating fork from "https://testnet.era.zksync.dev:443" L1 block: L1BatchNumber(129412) L2 block: 12342146 with timestamp 1696443302, L1 gas price 2500000009 and protocol version: Some(Version15)
18:15:44 [INFO] Starting network with chain id: L2ChainId(280)
18:15:44 [INFO] Running 1 transactions (one per batch)
18:15:44 [INFO]
18:15:44 [INFO] Executing 0x90e06ad8c960be39e870a97c24c5c001a19fd62451655540f3a3bf883fca3ce7
18:15:51 [INFO] ┌─────────────────────────┐
18:15:51 [INFO] │   TRANSACTION SUMMARY   │
18:15:51 [INFO] └─────────────────────────┘
18:15:51 [INFO] Transaction: SUCCESS
18:15:51 [INFO] Initiator: 0x6da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Payer: 0x6da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Gas - Limit: 357_676 | Used: 164_849 | Refunded: 192_827
18:15:51 [INFO] ┌─────────────────────────┐
18:15:51 [INFO] │       GAS DETAILS       │
18:15:51 [INFO] └─────────────────────────┘
18:15:51 [INFO] Gas - Limit: 357_676 | Used: 186_865 | Refunded: 192_827
18:15:51 [INFO]   WARNING: Refund by VM: 170_811, but operator refunded more: 192_827
18:15:51 [INFO] During execution published 256 bytes to L1, @171 each - in total 43_776 gas
18:15:51 [INFO] Out of 186_865 gas used, we spent:
18:15:51 [INFO]            25_065 gas (13%) for transaction setup
18:15:51 [INFO]             2_440 gas ( 1%) for bytecode preparation (decompression etc)
18:15:51 [INFO]           117_666 gas (62%) for account validation
18:15:51 [INFO]            41_694 gas (22%) for computations (opcodes)
18:15:51 [INFO]
18:15:51 [INFO]
18:15:51 [INFO] === Transaction setup cost breakdown ===
18:15:51 [INFO] Total cost: 25_065
18:15:51 [INFO]            14_070 gas (56%) fixed cost
18:15:51 [INFO]            10_995 gas (43%) operator cost
18:15:51 [INFO]
18:15:51 [INFO]   FYI: operator could have charged up to: 48_790, so you got 77% discount
18:15:51 [INFO] Publishing full block costs the operator up to: 11_258_733, where 10_058_733 is due to 58_823 bytes published to L1
18:15:51 [INFO] Your transaction has contributed to filling up the block in the following way (we take the max contribution as the cost):
18:15:51 [INFO]   Circuits overhead:         48_790 (0% of the full block: 11_258_733)
18:15:51 [INFO]   Length overhead:           23_018
18:15:51 [INFO]   Slot overhead:             10_995
18:15:51 [INFO]
18:15:51 [INFO] ┌──────────────────┐
18:15:51 [INFO] │   STORAGE LOGS   │
18:15:51 [INFO] └──────────────────┘
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008002
18:15:51 [INFO] Read Value:     0x01000091b02786f81917769e23b7fbd32833108ad2141428261f5d59d2db0e27
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000007
18:15:51 [INFO] Read Value:     0x0000000000000000000000000001f984000000000000000000000000651da959
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000009
18:15:51 [INFO] Read Value:     0x00000000000000000000000000bc5382000000000000000000000000651daba6
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0xd4dd04fdea036f775e95aaa7acdf510c86c8cebe8fecf4369ea07854d8953926
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000007
18:15:51 [INFO] Read Value:     0x0000000000000000000000000001f984000000000000000000000000651da959
18:15:51 [INFO] Written Value:  0x0000000000000000000000000001f985000000000000000000000000651daba7
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000006
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000000000000ee6b280
18:15:51 [INFO] Written Value:  0x000000000000000000000000000000000000000000000000000000000ee6b280
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000007
18:15:51 [INFO] Read Value:     0x0000000000000000000000000001f985000000000000000000000000651daba7
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000009
18:15:51 [INFO] Read Value:     0x00000000000000000000000000bc5382000000000000000000000000651daba6
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x00000000000000000000000000000000000000000000000000000000000000f5
18:15:51 [INFO] Read Value:     0x7563bb34a202267ae794eb6827b5481b18efa0499ce4a44f918415ad03f298a1
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000000a
18:15:51 [INFO] Read Value:     0x3ce4b17ae3dfbb50e32691cda238c2fdf0e833aa45f1a558812515b051d11af9
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000009
18:15:51 [INFO] Read Value:     0x00000000000000000000000000bc5382000000000000000000000000651daba6
18:15:51 [INFO] Written Value:  0x00000000000000000000000000bc5383000000000000000000000000651daba7
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x00000000000000000000000000000000000000000000000000000000000000f6
18:15:51 [INFO] Read Value:     0x399892fcd294c8a722226cc4dc42ce117c6369645b1d81b93957edadedd9115f
18:15:51 [INFO] Written Value:  0xcca6c7599622f9f56c5b5cab743b91b89b4d5662b8989aabccd4c27ca32b0fcd
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000000a
18:15:51 [INFO] Read Value:     0x3ce4b17ae3dfbb50e32691cda238c2fdf0e833aa45f1a558812515b051d11af9
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000010d
18:15:51 [INFO] Read Value:     0x00000000000000000000000000b460350000000000000000000000000001ec35
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000009
18:15:51 [INFO] Read Value:     0x00000000000000000000000000bc5383000000000000000000000000651daba7
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000010c
18:15:51 [INFO] Read Value:     0x00000000000000000000000000bc5382000000000000000000000000651daba6
18:15:51 [INFO] Written Value:  0x00000000000000000000000000bc5383000000000000000000000000651daba7
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000006
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000000000000ee6b280
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800c
18:15:51 [INFO] Read Value:     0x0100097762cf030313a547380f5cca2fc857d94dadda49145b4b45a0a1772b1c
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000118
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000118
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000000a
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000000a
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] Written Value:  0x9800c94fda38b9254cdb9c8b13b881bb15d305256c9bffa3567bf5a58eb86f05
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000002
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000000000000ee6b280
18:15:51 [INFO] Written Value:  0x000000000000000000000000000000000000000000000000000000000ee6b280
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008006
18:15:51 [INFO] Read Value:     0x010005c13556a66abf7c07eb75162f20cd43f586cdaf5d8df1fe762707a270ff
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        L2 deployer
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008002
18:15:51 [INFO] Read Value:     0x01000091b02786f81917769e23b7fbd32833108ad2141428261f5d59d2db0e27
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008003
18:15:51 [INFO] Read Value:     0x0100012f63726a4fc412e5bcc6d4ebb37e2dcfd5d12f1089194ae2b46ff98d8d
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Nonce Holder
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000950000000000000000000000000000a8be
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Nonce Holder
18:15:51 [INFO] Key:            0x1bd8e50467eb463553b9863e1699afbfe2c38c268f449eed8457c2b5107faf8b
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008003
18:15:51 [INFO] Read Value:     0x0100012f63726a4fc412e5bcc6d4ebb37e2dcfd5d12f1089194ae2b46ff98d8d
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Nonce Holder
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000950000000000000000000000000000a8be
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        Nonce Holder
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000950000000000000000000000000000a8be
18:15:51 [INFO] Written Value:  0x000000000000000000000000000000950000000000000000000000000000a8bf
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800a
18:15:51 [INFO] Read Value:     0x01000139a34f10524747649a1e45ec4ef909596f2872bd9408d1744a5563ea62
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000b7aec8072f467ea
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0100000fb81082800343100553f59cb21adc4053633f8931836a3402743f7cfb
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008003
18:15:51 [INFO] Read Value:     0x0100012f63726a4fc412e5bcc6d4ebb37e2dcfd5d12f1089194ae2b46ff98d8d
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Nonce Holder
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000950000000000000000000000000000a8bf
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800a
18:15:51 [INFO] Read Value:     0x01000139a34f10524747649a1e45ec4ef909596f2872bd9408d1744a5563ea62
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005bbd46efd8e880
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008009
18:15:51 [INFO] Read Value:     0x010000714fd6ecc0150513aa73b6ad6734d5a4d577f0a80e27cfc7aa41bb450c
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800a
18:15:51 [INFO] Read Value:     0x01000139a34f10524747649a1e45ec4ef909596f2872bd9408d1744a5563ea62
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000b7aec8072f467ea
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000b7aec8072f467ea
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000b7a9b2cf73939ea
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005bbd46efd8e880
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005bbd46efd8e880
18:15:51 [INFO] Written Value:  0x000000000000000000000000000000000000000000000000005c0e9a6b941680
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800d
18:15:51 [INFO] Read Value:     0x01000017f992ac66451aa0465a9a0c4584b9c99b6ad1f5dd44816f537e232ed3
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] Read Value:     0x01000007eea362dbe0f5370470be0ecf9b8e7ffdd7671f645a9b7285d040f01f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800a
18:15:51 [INFO] Read Value:     0x01000139a34f10524747649a1e45ec4ef909596f2872bd9408d1744a5563ea62
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005c0e9a6b941680
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008004
18:15:51 [INFO] Read Value:     0x0100008fd270ac7b5acc42a01fd753950772b38823786734c659ad31e629e076
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008002
18:15:51 [INFO] Read Value:     0x01000091b02786f81917769e23b7fbd32833108ad2141428261f5d59d2db0e27
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] Written Value:  0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000000
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x00000000000000000000000020b28b1e4665fff290650586ad76e977eab90c5d
18:15:51 [INFO] Read Value:     0x010002051fe48004037b3ce0a6ae05ef8451f5e81a16f520d863b355c6c8c3b6
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        0x20b2…0c5d
18:15:51 [INFO] Key:            0x1538b1f2bb5dda30e8bf2b57f8ac5f929661da75d1c959df1706c17a7eed8cf4
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000003
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        0x20b2…0c5d
18:15:51 [INFO] Key:            0x1538b1f2bb5dda30e8bf2b57f8ac5f929661da75d1c959df1706c17a7eed8cf4
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000003
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000000003
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        0x20b2…0c5d
18:15:51 [INFO] Key:            0x287d9e9de99402e41b966ea4fbb00bf175dc95ee509f8f7dc6454f75336059ff
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000040
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        0x20b2…0c5d
18:15:51 [INFO] Key:            0x287d9e9de99402e41b966ea4fbb00bf175dc95ee509f8f7dc6454f75336059ff
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000000000000000040
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000000040
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800d
18:15:51 [INFO] Read Value:     0x01000017f992ac66451aa0465a9a0c4584b9c99b6ad1f5dd44816f537e232ed3
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800b
18:15:51 [INFO] Read Value:     0x0100021fb1c2ba4445d7fc03126466f2845cac3df554dad61f81ad29d0b28550
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        System context
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000000001
18:15:51 [INFO] Read Value:     0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000000000000008001
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800a
18:15:51 [INFO] Read Value:     0x01000139a34f10524747649a1e45ec4ef909596f2872bd9408d1744a5563ea62
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005c0e9a6b941680
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da
18:15:51 [INFO] Read Value:     0x000000000000000000000000000000000000000000000000005c0e9a6b941680
18:15:51 [INFO] Written Value:  0x000000000000000000000000000000000000000000000000005be2c2695e7300
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x0000000000000000000000000000000000000000000000000000000000008010
18:15:51 [INFO] Read Value:     0x0100001da235ff2584761a8745ca3ae2ba095a9e0600979c8494e25831339d3f
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000b7a9b2cf73939ea
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           InitialWrite
18:15:51 [INFO] Address:        EthToken System Contract
18:15:51 [INFO] Key:            0x98b0fc2803582fd16ea15bc3c9239fca256bc2798449b1ef91221f97d3369eea
18:15:51 [INFO] Read Value:     0x0000000000000000000000000000000000000000000000000b7a9b2cf73939ea
18:15:51 [INFO] Written Value:  0x0000000000000000000000000000000000000000000000000b7ac704f96edd6a
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO] Type:           Read
18:15:51 [INFO] Address:        Account Code Storage
18:15:51 [INFO] Key:            0x000000000000000000000000000000000000000000000000000000000000800d
18:15:51 [INFO] Read Value:     0x01000017f992ac66451aa0465a9a0c4584b9c99b6ad1f5dd44816f537e232ed3
18:15:51 [INFO] ──────────────────────────────────────────────────────────────────────────────────
18:15:51 [INFO]
18:15:51 [INFO] ┌──────────────────────────┐
18:15:51 [INFO] │   VM EXECUTION RESULTS   │
18:15:51 [INFO] └──────────────────────────┘
18:15:51 [INFO] Cycles Used:          9128
18:15:51 [INFO] Computation Gas Used: 174945
18:15:51 [INFO] Contracts Used:       14
18:15:51 [INFO] ════════════════════════════
18:15:51 [INFO]
18:15:51 [INFO] ==== Console logs:
18:15:51 [INFO]
18:15:51 [INFO] ==== 20 call traces.  Use --show-calls flag or call config_setShowCalls to display more info.
18:15:51 [INFO]   Call(Normal) 0x6da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48           validateTransaction(bytes32, bytes32, tuple)   298494
18:15:51 [INFO]     Call(Normal) 0x0000000000000000000000000000000000000001                 0x1f8cf868   272475
18:15:51 [INFO]   Call(Normal) 0x6da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48           payForTransaction(bytes32, bytes32, tuple)   271404
18:15:51 [INFO]   Call(Normal) 0x6da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48           executeTransaction(bytes32, bytes32, tuple)   202986
18:15:51 [INFO]     Call(Normal) 0x20b28b1e4665fff290650586ad76e977eab90c5d           transfer(address,uint256)   196686
18:15:51 [INFO]
18:15:51 [INFO] ==== 3 events
18:15:52 [INFO] EthToken System Contract                   Transfer(address,address,uint256), 0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48, 0x0000000000000000000000000000000000000000000000000000000000008001
18:15:52 [INFO] 0x20b28b1e4665fff290650586ad76e977eab90c5d Transfer(address,address,uint256), 0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48, 0x00000000000000000000000004bba6773bd40b2be8c2fd92832b6e316d50adb8
18:15:52 [INFO] EthToken System Contract                   Transfer(address,address,uint256), 0x0000000000000000000000000000000000000000000000000000000000008001, 0x0000000000000000000000006da9bb6dcf5ef38b15e8261b62ae5a807cb6cc48
```

</details>

### Console Logging

When running your contracts and tests against era-test-node, you can print logging messages and contract variables using `console.log()` from your Solidity code. To use it, you have to import `hardhat/console.sol` in your contract code.

Here's an example of how to set it up:

```solidity
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
  // ...
}
```

Once you've imported `console.sol`, you can add `console.log` calls to your functions, similar to using it in JavaScript. For instance, in your `transfer()` function:

```solidity
function transfer(address to, uint256 amount) external {
    require(balances[msg.sender] >= amount, "Not enough tokens");

    console.log(
        "Transferring from %s to %s %s tokens",
        msg.sender,
        to,
        amount
    );

    balances[msg.sender] -= amount;
    balances[to] += amount;

    emit Transfer(msg.sender, to, amount);
}
```

The logging output will be displayed under **console logs in era_test_node**, making it easy to debug and monitor your contract's behaviour during testing.

This allows you to use `console.log()` effectively in your Solidity code when working with `era-test-node`, enhancing your debugging and testing capabilities.
