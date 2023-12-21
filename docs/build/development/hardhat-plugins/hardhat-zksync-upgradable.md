---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Upgradable | zkSync Docs
---

# hardhat-zksync-upgradable

### Overview

The `hardhat-zksync-upgradable` plugin provides an interface for deploying and managing upgradable smart contracts on the zkSync Era network. Built on OpenZeppelin's Hardhat plugins, it integrates with a Hardhat environment for seamless interaction.

#### Installation

::: code-tabs
@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-upgradable @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-upgradable @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

:::

**Note on Version Incompatibility**

The current version doesn't support the latest OpenZeppelin plugin versions. Future updates will address this.

### Configuration

In `hardhat.config.ts`:

```typescript
import "@matterlabs/hardhat-zksync-upgradable";
// Other imports...

const config: HardhatUserConfig = {
  // configurations...
};

export default config;
```

### Deploying Proxies

Supported proxy types:

- Transparent upgradable proxies
- UUPS proxies
- Beacon proxies

**Deploy Script Example: Transparent Upgradable Proxy**

```typescript
const deployer = new Deployer(hre, zkWallet);
const contract = await deployer.loadArtifact("Box");
await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: "initialize" });
```

Run:

```bash
yarn hardhat run SCRIPT_FILE
```

### UUPS Proxies

For UUPS, use zksolc version >=1.3.9.

**Deploy Script Example: UUPS Proxy**

```typescript
// Initialization and contract loading...
await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: "initialize" });
```

### Beacon Proxies

**Deploy Script Example: Beacon Proxy**

```typescript
// Initialization and contract loading...
await hre.zkUpgrades.deployBeacon(deployer.zkWallet, contract);
```

### Upgrading Proxies

**Upgrade Transparent Proxy**

```typescript
const BoxV2 = await deployer.loadArtifact('BoxV2');
await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, <PROXY_ADDRESS>, BoxV2);
```

**Upgrade UUPS Proxy**

```typescript
const BoxUupsV2 = await deployer.loadArtifact('BoxUupsV2');
await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, <PROXY_ADDRESS>, BoxUupsV2);
```

**Upgrade Beacon Proxy**

```typescript
const boxV2Implementation = await deployer.loadArtifact('BoxV2');
await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, <BEACON_PROXY_ADDRESS>, boxV2Implementation);
```

### Verification

Add `hardhat-zksync-verify` plugin before the upgradable plugin in `hardhat.config.ts`.

To verify all deployed contracts:

```bash
yarn hardhat verify <proxy_address>
```

#### Gas Estimation

Available gas estimation functions:

- `estimateGasProxy`
- `estimateGasBeacon`
- `estimateGasBeaconProxy`

#### Validations

The plugin does not perform all validation checks, so it's the user's responsibility to follow the predefined contract upgrade standards. Future releases will include built-in checks.
