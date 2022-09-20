# Overview

An account is an important component of the zkSync protocol, it is an entity, similar to a bank account but for tokens, where crypto assets can be transferred to other accounts, held and also used to execute smart contracts, typically it is composed of an address along with a private key.


## How many types of Ethereum accounts are there?

Two different types of accounts that exist on the L2 network. The first is called an externally owned account (EOA). The second is called a contract account. 
Externally owned accounts are controlled by anyone with the private keys. Contract accounts are smart contracts deployed to the network and controlled by code. Both types are identified by an Ethereum address. In terms of capabilities, the two account types can:

- Interact with smart contracts on the chain.
- Receive, hold, and send ETH and tokens.

### Externally owned accounts (EOA)

EOAs are owned by people on the Ethereum network.
Which means an individual creates an account on Ethereum and a public-private key pair is generated for the account. The account is not identified by the person’s name or any personal information.
The secured private key of the EOA gives control and access to one’s assets and contracts.
The public key which is generated from the private key via a one-way cryptographic function, acts as the identity of the account.
The address of an Ethereum account is generated through its public key.
This type of account interacts with other externally owned accounts and contract accounts. It carries out transactions with the former one and interacts with the latter one by calling and executing its functions.
Creating an externally owned account does not cost gas fees.

**Note**  
An account is not a wallet. An account is the keypair for a user-owned Ethereum account, while a wallet is an interface or application that lets you interact with your Ethereum account.

 This control occurs often through a wallet application. Externally owned accounts are simple accounts without any associated code or data storage. This type of account is controlled by and cryptographically signed using a private key in the "real world."

### Contract accounts (smart contracts)

A contract account can perform all of the functions of an externally owned account, but unlike EOAs there are controlled by code executed by the Ethereum Virtual Machine, and they do not own a private key. Contract accounts have associated code and data storage, but not private keys. They "control themselves.” 
These accounts do so in the way determined by their smart contract code.
Creating a contract account has a cost some gas fees.

## Types of contract account

There are two type of contract account — Simple account & Multisig( Multisignature) account

Simple account & Multisig account are created and owned by Accounts.

- Simplet account : Only one account bother creates and owns the account.
- Multisig account : A Multisig Wallet has several owner accounts one of which will also be the creator account.


## Account state

This field gives the hash value of the contract code of the account.
In the case of contract accounts, the smart contract code is hashed and the resulting value is stored in this field.
While for externally owned accounts, this field contains the hash value of an empty string.

There are components that make up the state of an account, regardless of the type of account:

- **codeHash**: This represents the hash value of the contract code of the account, for externally owned accounts, this field contains the hash value of an empty string, while for contract accounts, the smart contract code is hashed and the resulting value is stored in this field.
- **nonce**: For a externally owned account the nonce of an account depicts the number of transactions sent from the account address, while for a contract account it indicates the number of contracts created by the account.
- **balance**: It shows the balance(in wei) contained in the address. Wei is a a unit of ether (ETH) where 1 eth = 1x10e18 Wei.
- **storageRoot**: This contains the hash value of the root node of Merkle Patricia tree that encodes the storage contents of the account, and this field of account is empty by default.
