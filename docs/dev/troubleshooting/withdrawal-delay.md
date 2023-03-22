# Withdrawal delay

In order to prevent a quick drain of the protocol in case a critical bug has been discovered and exploited, we are introducing a block execution delay. Each L2 block committed to L1 will have a time lock before it is executed and finalized. This means that there is enough time to verify the effects of the transactions included into a block before the block becomes final. The zkSync team will be monitoring each block and be able to investigate any anomaly (e.g. rapid outflow, unusually large withdrawals, etc).

To introduce this time lock no changes were made in the audited smart contracts. Instead we have used an existing Validator role that we control and additionally restricted ourselves by pointing it at an intermediate smart contract with a time lock. It will be initially configured for a **24 hours** delay, which will be gradually decreased as the system matures. Changing the delay requires multiple signatures collected from several cold wallets owned by zkSync leadership.

This design has the following advantages:

- Even if an attacker finds a critical bug in ZK circuits and also successfully compromises the servers running our sequencer, there is plenty of time to detect an exploit, investigate, and freeze the protocol via governance.
- No changes were introduced into the zkSync Era contracts, so even if the intermediate contract is compromised we revert back to the original state.
- Delayed execution affects not only the standard zkSync ETH and ERC20 bridges, but also any custom bridge built by a different team.
- Implementing the logic in an external governor-controlled contract makes it easy to remove this limitation later.
