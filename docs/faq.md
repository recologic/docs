---
sidebar_position: 100
title: FAQ
---

# Frequently Asked Questions

## General

### What is BCO?

Biocoin (BCO) is a TRC20 token on the TRON blockchain where each token represents 1 square meter of verified forest land. The supply is elastic — it grows when new forest deeds are registered and shrinks when deeds are deactivated.

### How is BCO different from other green tokens?

Most green tokens are utility tokens with no verifiable backing. BCO enforces its 1:1 forest backing ratio at the smart contract level. Anyone can call `verifyInvariant()` on-chain to confirm that every BCO is backed.

### Can the team mint unlimited tokens?

No. BCO can only be minted through `registerDeed()`, which requires a valid forest deed with geolocation and documentation. Rate limits cap registration at 10 deeds per day with a maximum of 10M m² per deed.

### Can the team freeze or seize my tokens?

No. BCOToken is immutable — there is no freeze function, no compliance role, no blacklist. Once you hold BCO, you have full self-custody. Not even the admin can move your tokens.

### Can I burn my own BCO?

No. There is no public `burn()` function. Only DeedRegistry can burn tokens through `deactivateDeed()`. This protects the invariant — burning without removing the corresponding area would break the 1:1 ratio.

## Security

### Who controls the protocol?

A 3/5 multi-sig wallet (Gnosis Safe) controls all admin functions. No single person can make changes unilaterally.

### What happens if an admin key is compromised?

Admin transfer requires a 2-step process with a 48-hour delay. This gives the team time to detect and respond to unauthorized transfer attempts. Additionally, admin renouncement is permanently blocked — governance cannot be killed.

### Can the contracts be upgraded?

BCOToken is **immutable** — it can never be upgraded. DeedRegistry and BCOStaking are UUPS upgradeable, but upgrades require multi-sig approval and, once supply exceeds 1M BCO, a mandatory timelock delay.

### Has the protocol been audited?

Static analysis has been completed with zero critical, high, or medium findings across Slither, Mythril, and Aderyn. An independent security audit by CertiK is pending. The full test suite covers 100% of statements, functions, and lines.

## Staking

### Where do staking rewards come from?

Rewards come from a pre-funded pool — the reward manager deposits BCO into the staking contract for each reward period. There is no infinite mint. When the period ends, rewards stop automatically.

### Can the admin drain the staking contract?

No. The `recoverERC20()` function can only withdraw **excess** BCO — tokens beyond what is needed for staked balances and unclaimed rewards. Staker funds are always protected.

### Is there a lock-up period?

Lock parameters are configurable by the admin within bounds. The minimum lock must be greater than zero, and the minimum cannot exceed the maximum.

## Technical

### Why TRON instead of Ethereum?

TRON offers lower transaction fees and faster block times, making it more practical for frequent deed registration operations. The contracts are EVM-compatible (Solidity 0.8.28) and could be deployed on other EVM chains.

### Why is BCOToken immutable while other contracts are upgradeable?

BCOToken is immutable for maximum holder trust — it guarantees that token rules (no freeze, no seize, no burn) can never be changed. DeedRegistry and BCOStaking are upgradeable to allow the protocol to adapt to regulatory requirements without migrating tokens.

### What is the progressive timelock?

When total BCO supply exceeds 1M tokens, upgrades to DeedRegistry and BCOStaking must go through a TimelockController with a mandatory delay. This protects token holders by ensuring they have time to review and react to proposed changes. The threshold is a one-way ratchet — once activated, it cannot be disabled.
