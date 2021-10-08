# Privacy

At the moment, all transactions in **zkSync** are transparent: just like in Ethereum, anybody can see the sender, the
recipient and all the details of the transaction.

However, we take the privacy cause very seriously. Most people won’t feel comfortable moving large parts of their
fortune into a publicly exposed glass box. Inhabitants of dangerous places are unlikely to pay a local merchant in
crypto if the recipient can immediately learn how much money they have. Privacy is an absolute prerequisite for mass
adoption and an important part of **zkSync** roadmap.

Implementing privacy comes with two big challenges:

- It must be on by default as an integral protocol feature. To quote Vitalik Buterin: “If your privacy model has a
  medium anonymity set, it really has a small anonymity set. If your privacy model has a small anonymity set, it has an
  anonymity set of 1. Only global anonymity sets are truly robustly secure.”
- To enable privacy by default, private transaction costs must be very low, despite significant added computational
  overhead.

This is why we decided to focus our efforts on the scalability of **zkSync** first. Once the prover technology is good
enough to add privacy without much cost and scalability overhead, it will be added to the platform.
