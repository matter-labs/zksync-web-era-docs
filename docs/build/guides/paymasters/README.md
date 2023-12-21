---
head:
  - - meta
    - name: "twitter:title"
      content: Paymasters | zkSync Docs
---

# Paymasters

### What are Paymasters?

Paymasters are unique accounts in the zkSync ecosystem capable of compensating for other accounts' transaction fees. This mechanism not only allows protocols to cover costs for their users but also introduces a method for paying fees using ERC20 tokens, rather than just ETH.

#### Key Advantages

- Pay for other users' transaction fees.
- Facilitate ERC20 to ETH exchanges for fee payment.

### Paymaster Flows

#### Built-in Paymaster Flows

While some paymasters work autonomously (like protocols covering all user fees), others might require user interactions. An instance of this is the exchange of users' ERC20 tokens to ETH, which necessitates users granting the needed allowance to the paymaster.

While the account abstraction protocol is versatile, to maintain compatibility between EOAs and custom accounts, there is a standardized `paymasterInput` field.

**General Paymaster Flow**

This flow is for paymasters that don't need prior actions from users. The interface for the `paymasterInput` field is:

```solidity
function general(bytes calldata data);
```

**Approval-based Paymaster Flow**

This is for paymasters requiring user-set allowances. The interface is:

```solidity
function approvalBased(
    address _token,
    uint256 _minAllowance,
    bytes calldata _innerInput
);
```

### Usage Guides

- [gasless.md](gasless.md)

- [allowlist.md](allowlist.md)

- [erc20fixed.md](erc20fixed.md)

- [timebased.md](timebased.md)

### Contribute

Interested in sharing your paymaster examples and creating a guide for the community to follow? Dive deep into development and contribute to our guides!
