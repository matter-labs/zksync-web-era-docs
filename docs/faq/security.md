# Security

[[toc]]

## Security overview

[zkSync protocol design](https://github.com/matter-labs/zksync/blob/master/docs/protocol.md) explicitly lists the
protocol's cryptographic assumptions and security properties.

In a nutshell, the protocol's claim is that, given correct implementation and validity of cryptographic assumptions,
funds placed into zkSync will have the same security guarantees as if they are held in an Ethereum account without any
additional requirements on the user part. In particular:

- Users do not need to monitor the network.
- Private keys can be held in cold storage.
- Validators can not steal funds or corrupt the zkSync state in any way.
- Users can withdraw their assets onto the mainnet, regardless of cooperation from zkSync validators.

Several mechanisms are used to fulfill these guarantees, discussed below.

### Validity proofs

zkSync is built on [zkRollup architecture](/faq/tech.md#zk-rollup-architecture). This means, every single transaction is
verified by a smart contract on the Ethereum mainnet by means of verifying the proof of the validity of the block. Thus,
no validator can ever move the system into an incorrect state or take users' funds.

See [this article](https://medium.com/starkware/validity-proofs-vs-fraud-proofs-4ef8b4d3d87a) for a further overview of
the benefits of validity proofs.

### Priority queue

In the ultimate emergency case of all validators being shut down or becoming unresponsive, the emergency exit mechanism
ensures that users will keep control of their assets. It works as follows.

1. If transactions of a user are being ignored, for any reason, by the validators, an exit request can be submitted
   directly on mainnet into the **priority queue**.
2. Validators are obliged to process priority queue requests within a short time window (~1 week).
3. In case the validators fail to process the requests, the system enters **exodus mode** and every user can immediately
   exit all of their assets by making a direct transaction on the Ethereum mainnet.

### Upgrade mechanism

Version 1.0 of zkSync protocol comes with a contract upgrade mechanism in order to facilitate faster design iterations.
However, users have a fundamental right to opt-out of a future upgrade. A new upgrade must be announced via the zkSync
contract and all users get a 4-week notice period to exit in case they don't like the changes.

NOTICE: Currently, the beta is deployed with a 2-week notice period, and eventually will be bumped to 4 weeks. In the
future, this opt-out mechanism will be replaced by a strict opt-in.

## Cryptography used

Although zkSync is built on some of the most cutting-edge cryptography (such as PLONK and RedShift), we were very
conservative with respect to security choices made in the protocol. Every component relies exclusively on
well-established cryptographic assumptions widely considered valid in the academic and professional security
communities.

### Primitives

| Primitive                                      | Application       | Cryptographic assumption |
| ---------------------------------------------- | ----------------- | ------------------------ |
| [PLONK](https://eprint.iacr.org/2019/953)      | Proof system (v1) | 1, 3                     |
| [RedShift](https://eprint.iacr.org/2019/1400)  | Proof system (v2) | 1                        |
| [SHA256](https://en.wikipedia.org/wiki/SHA-2)  | Hash function     | 1                        |
| [Rescue](https://eprint.iacr.org/2019/426.pdf) | Hash function     | 1, 2                     |
| [muSig](https://eprint.iacr.org/2018/068)      | Signature scheme  | 1, 2, 3                  |

### Cryptographic assumptions

1. [Collision-resistance](https://en.wikipedia.org/wiki/Collision_resistance)
2. [Pseudo-randomness](https://en.wikipedia.org/wiki/Pseudorandomness)
3. [Discrete logarithm problem, on elliptic curves and finite fields](https://en.wikipedia.org/wiki/Discrete_logarithm#Cryptography)

## Universal CRS setup

Version 1.0 of zkSync protocol uses the PLONK proof system, which requires a "trusted setup" of a Common Reference
String (CRS). In PLONK, this setup can be done once and be reused by any number of applications (this is called
Universal CRS). If at least one participant deletes the entropy (randomness) used to provide their contribution, the
setup is secure. Having universal, and not application-specific, setup significantly reduces trust assumptions, because
larger number of prominent and respected members of the community have the incentive to participate in it, and more
scrutiny can be expected around the trusted setup ceremony.

Another big advantage of a universal CRS is that updates and bugfixes do not require their own trusted setup ceremonies
(which are very difficult from the logistical and security perspectives).

Matter Labs
[participated](https://www.aztecprotocol.com/ignition/participant/0x04a23ba68e4469061cd461e8b847e820d4ced948?timestamp=1587551054947)
in the global Ignition trusted setup ceremony for PLONK on BN256 elliptic curve, coordinated by AZTEC protocol:

<table>
<tr>
    <td>Participation address</td>
    <td>0x04a23ba68e4469061cd461e8b847e820d4ced948</td>
</tr>
<tr>
    <td>Transcript hash</td>
    <td>0x1f6647d91a9e667173640b67b654cabc81ceee98d6100f259788afb34a3fc529</td>
</tr>
<tr>
    <td>Signature</td>
    <td>0x3f4ff7b9a6668c23c9ba45d73d1d9d0902b881191d97b307969b63f52296f2326d437ea04dd67a2ebe57a691025d7d31bb0dae88e8023a0d9b15ad599c3eb9351b</td>
</tr>

</table>

The ceremony ran from October 2019 until December 2019, with 176 participants from over 30 countries collaborating to
compute a secure database of encrypted points, including
[Vitalik Buterin](https://twitter.com/VitalikButerin/status/1225856246307311616) and other prominent members of the
crypto community. Full ceremony transcript with the list of individuals and organizations who claimed their contribution
[is available here](https://www.aztecprotocol.com/ignition/). You can use
[this script](https://github.com/matter-labs/ignition-verification) to verify the contributions of the listed
participants.

Despite relying on a universal trusted setup, we argue that zkSync can be called a fully trustless protocol. The reason
for this is that there are no systems without some form of a trusted setup. Most users do not personally verify and
compile the source code of their wallets, full nodes, mining software, and certainly do not verify the circuits of the
hardware all these things run upon. In our opinion, the ease of concealed collusion of developers and experts in these
systems is much higher than in a trusted setup with hundreds of well-known participants. At the same time, the ongoing
operation of zkSync requires zero trust from any party whatsoever, which is unique among all L2 scaling solutions.

Nonetheless, we encourage you to check the list of the contributors of the Ignition ceremony and make your own opinion
on whether there is at least one trustworthy person or organization among them. In the future, we strive to eliminate
trust assumptions altogether by embracing a transparent zero-knowledge proof system such as
[RedShift](https://eprint.iacr.org/2019/1400) (developed by Matter Labs).

## Security audits

[Security audits](/updates/security-audits.md) are being conducted before each major update.
