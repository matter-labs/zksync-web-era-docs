# Tokens & Fees

[[toc]]

## Supported tokens

<!-- TODO: add the tokens link to testnet zkscan -->

**zkSync** fees can be paid in ether (ETH) and ERC20 tokens. The full list of currently supported tokens is available under this [link](https://zkscan.io/explorer/tokens).

DISCLAIMER: We will list any token fulfilling the criteria below on a first-come, first-serve basis. This will become
permissionless on our next system upgrade. Listing of a token on zkSync does not represent an endorsement for this token
by the Matter Labs team, Stichting ZK Sync, or any other entity. We do not have competence and authority to analyze the
token business model and smart contract security guarantees of a particular token. Please use any token on your own risk
and judgement.

## Listing a token

To list a new token on zkSync, go the [tokens page](https://zkscan.io/explorer/tokens/) of the explorer and click the "Submit new token" button and follow the instructions in the form.

## Fee costs

In **zkSync** the cost of every transaction has two components:

- **Off-chain part (storage + prover costs)**: the cost of the state storage and the SNARK (zero-knowledge proof)
  generation. This part depends on the use of hardware resources and is therefore invariable. Our benchmarks give
  estimates of ~0.001 USD per transfer.
- **On-chain part (gas costs)**: for every **zkSync** block, the validator must pay Ethereum gas to verify the SNARK,
  plus additionally ~0.4k gas per transaction to publish the state ∆. The on-chain part is a variable that depends on
  the current gas price in the Ethereum network. However, this part is orders of magnitude cheaper than the cost of
  normal ETH/ERC20 transfers.

## How fees are payed

Transfers in **zkSync** support "gasless meta-transactions": users pay transaction fees in the tokens being transferred.
Thus, for example, if you want to transfer DAI stable-coin, there is no need for you to own ETH or any other tokens.
Just pay your fees in a fraction of DAI.

For tokens without a liquid market price, fees are paid in a different token.
