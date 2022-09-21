# Overview

An account is a crucial part of the zkSync protocol; it is an entity similar to a bank account but for tokens, where crypto assets can be transferred to other accounts, kept, and used to carry out smart contracts. Typically, an account comprises an address and a private key.


## Types of Ethereum accounts

On the Ethereum network, there are two distinct kinds of accounts. The first is referred to as an externally owned account (EOA). The second is referred to as a contract account. 
Anyone with private keys can manage accounts that are externally owned. Contract accounts are smart contracts that have been deployed on the network and are governed by code. An Ethereum address serves as a unique identifier for both types. The two account types can:

- Interact with smart contracts on the chain. 
- Receive, store, and send ETH and tokens.

### Externally owned accounts (EOA)

This indicates a public-private key pair is generated for an account after a person creates one on Ethereum. The user's name or any other personal details are not used to identify the account. 
Through the EOA's secured private key, a person can control and get to their assets and contracts. 
Using a one-way cryptographic process, the private key is used to make the public key, which is the identity of the account. 
An Ethereum account's public key is used to generate the account's address. 
Other externally owned accounts and contract accounts communicate with this kind of account. It interacts with the latter by calling and performing its functions and transacting with the former. 
There are no gas fees associated with creating an externally owned account.

**Note** 
An account is not a wallet. A wallet is an application that lets you connect to your Ethereum account. An account is a pair of keys for an Ethereum account that belongs to a user.

Wallet apps are frequently used to exercise this control. Simple accounts with no accompanying code or data storage are externally owned. This account is managed by and cryptographically signed using a private key in the "real world."

### Contract accounts (smart contracts)

A contract account can carry out all the operations of an externally owned account (EOA). Still, unlike EOAs, it is managed by code that the Ethereum Virtual Machine performs, and it lacks a private key. Private keys are not associated with contract accounts; code and data storage are. They "control themselves." 
These accounts operate in the manner specified by their smart contract code. 
There are various gas fees associated with opening a contract account.

### Various types of contract accounts

Simple accounts and Multisig(Multisignature) accounts are the two types of contract accounts.

Simple accounts and Multisig accounts are formed and owned by accounts.

- Simple account: The account is created and owned by just one account. 
- Multisig account: A Multisig wallet has multiple owner accounts, one of which will also be the creator account.


## Account state

The smart contract code is hashed in the case of contract accounts, and the resulting value is kept in this field. 
For externally owned accounts, the hash value in this field will be an empty string.

Regardless of the type of account, the following elements contribute to the state of the account:

-**codeHash**: This represents the hash value of the contract code of the account, for externally owned accounts, this field contains the hash value of an empty string, while for contract accounts, the smart contract code is hashed and the resulting value is stored in this field.
- **nonce**: For an externally owned account, the nonce of an account shows the number of transactions sent from the account address, whereas for a contract account, it shows the number of contracts the account has produced. 
- **balance**: It displays the balance (in Wei) stored in the address. Wei is an ether (ETH) unit, with 1 eth equaling 1 x 1018 Wei. 
- **storageRoot**: This account field is empty by default and holds the hash value of the root node of the Merkle Patricia tree that encodes the account's storage contents.