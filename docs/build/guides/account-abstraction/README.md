---
head:
  - - meta
    - name: "twitter:title"
      content: Spending Rules | zkSync Era Docs
---

# Spending Rules

### Introduction

Spending rules form a crucial component of the Account Abstraction (AA) paradigm. Leveraging Smart Accounts, developers can enforce a myriad of **customized** spending rules to fit specific business requirements or to enhance security and user experience. This document delves into the potential use cases that can be achieved with spending rules in zkSync's AA model.

### Use Cases

#### Daily Spending Limits

Implement daily caps on the amount of tokens that can be transferred or spent. The limit could be adjustable based on user behavior or fixed as a security measure. Checkout the [usage guide](daily-spending-limit.md) to see how!

#### Trade Limits

Restrict the volume of tokens that can be traded within a specific time frame. This can be useful for limiting exposure to market volatility or for compliance with legal regulations.

#### Whitelisted Addresses

Allow token transfers only to a predefined set of addresses. This can be useful in business-to-business transactions, payroll systems, or restricted ecosystems.

#### Geo-Fencing

Enable or disable token transfers based on geographical location. This could help in adhering to local laws concerning cryptocurrency or facilitate geo-specific promotions.

#### Time-based Restrictions

Disallow transactions during certain times of the day, or enable higher limits during specific time frames. This can add an extra layer of security against unauthorized access.

#### Multi-Signature Approval

Require multiple signatures for high-value transactions. This feature can be adjusted so that different transaction sizes require a different number of approvers.

#### Token Type Restrictions

Limit the types of tokens that can be transacted. This is particularly useful in ecosystems that support multiple tokens but need to restrict certain types for compliance or business reasons.

#### Rate-Limited Withdrawals

Implement a rule that only allows withdrawals up to a certain speed, effectively rate-limiting how quickly assets can leave an account, adding a layer of security against unauthorized withdrawals.

#### Conditional Transfers

Allow transfers to be executed only when certain conditions are met, such as a specific contract state or external oracle input.

#### Automated Tax Compliance

Automatically withhold a percentage of token transfers to comply with local tax regulations. The withheld amount can then be automatically sent to a tax collection account.

### Conclusion

By implementing these and other customized spending rules, developers can create more secure and user-specific experiences. Whether for risk management, compliance, or feature enhancements, the flexibility of zkSync's Account Abstraction model provides a fertile ground for innovation in spending rule design.
