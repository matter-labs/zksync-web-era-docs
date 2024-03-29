---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Getting Started | zkSync Docs
---

# Getting Started

This is a short introduction to `zksync2-java` SDK, but covers many of the most common operations that developers require and provides a
starting point for those newer to zkSync Era.

## Getting zksync-ethers

### Dependency

For connecting ZkSync2 library just add the following dependency to your build file.

Maven `pom.xml`

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>io.zksync</groupId>
      <artifactId>zksync2</artifactId>
      <version>v0.2.0</version>
    </dependency>
  </dependencies>
</project>
```

Gradle `build.gradle`

```groovy
dependencies {
    implementation "io.zksync:zksync2:v0.2.0"
}
```

## Overview

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional
fields to those that Ethereum transactions have by default.

To begin, it is useful to have a basic understanding of the types of objects available and what they are responsible for, at a high level:

- `ZkSync` provides connection to the zkSync Era blockchain, which allows querying the blockchain state, such as account, block or transaction details,
  querying event logs or evaluating read-only code using call. Additionally, the client facilitates writing to the blockchain by sending
  transactions.
- `Wallet` wraps all operations that interact with an account. An account generally has a private key, which can be used to sign a variety of
  types of payloads. It provides easy usage of the most common features.

## Examples

Connect to the zkSync Era network:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync = ZkSync.build(new HttpService("http://127.0.0.1:3050"));
    }
}
```

Get the latest block number:

```java
BigInteger blockNumber = zksync.ethBlockNumber().send().getBlockNumber();
;
```

```java
ZksBlock block = zksync.zksGetBlockByHash("0xb472c070c9e121ba42702f6c322b7b266e287a4d8b5fa426ed265b105430c397", true).send().getBlock();
```

```java
ZkTransaction transaction = zksync.zksGetTransactionByHash("0x9af27afed9a4dd018c0625ea1368afb8ba08e4cfb69b3e76dfb8521c8a87ecfc").send().getResult();
```
