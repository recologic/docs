---
sidebar_position: 98
title: Changelog
---

# Changelog

Version history for BCO Protocol smart contracts. DeedRegistry and BCOStaking are UUPS upgradeable — future implementation upgrades will be documented here. BCOToken and TimelockController are immutable and will not receive updates.

---

## v1.0.0 — Mainnet Launch

**Network:** TRON Mainnet

### Deployed Contracts

| Contract | Address | Type |
|----------|---------|------|
| BCOToken | [`TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p`](https://tronscan.io/#/contract/TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p) | Immutable |
| DeedRegistry | [`TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1`](https://tronscan.io/#/contract/TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1) | UUPS Proxy |
| BCOStaking | [`TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe`](https://tronscan.io/#/contract/TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe) | UUPS Proxy |
| TimelockController | [`TE3noaDjVaai57MZgZnRLK9dtDh1mxXPF1`](https://tronscan.io/#/contract/TE3noaDjVaai57MZgZnRLK9dtDh1mxXPF1) | Immutable |

### Features

**BCOToken (Immutable)**
- TRC20 (ERC-20 compatible) with 18 decimals
- Elastic supply — minted on deed registration, burned on deed deactivation
- EIP-2612 permit for gasless approvals
- ERC-7572 contract metadata (contractURI, issuer info)
- AccessControlDefaultAdminRules with 2-step admin transfer
- Admin renounce permanently blocked
- Pausable (emergency circuit breaker)
- ReentrancyGuardTransient (EIP-1153)
- Native and ERC-20 recovery functions
- No public burn, no freeze, no blacklist

**DeedRegistry (UUPS Proxy)**
- On-chain forest deed registry with 1:1 BCO backing
- `verifyInvariant()` for public supply verification
- `verifyDocument()` for document authenticity checking
- Paginated deed enumeration (`getDeedIds`)
- Rate limiting (configurable max daily registrations and max area per deed)
- Progressive timelock for upgrades (auto-activates at 1M BCO supply)
- Dual auth pattern for `setTimelock()` and `setDirectUpgradeSupplyLimit()`
- String length validation (512 bytes max)
- Storage gap reserved for future upgrades

**BCOStaking (UUPS Proxy)**
- Synthetix StakingRewards model with finite reward periods
- Configurable lock periods (min/max bounds)
- Emergency withdraw (bypasses lock, forfeits rewards)
- `totalUnclaimedRewards` tracking for accurate `excessBCO()` calculation
- Progressive timelock for upgrades
- Protected `recoverERC20(BCO)` — excess only, staker funds safe
- Storage gap reserved for future upgrades

**TimelockController (Immutable)**
- 72-hour delay for all scheduled operations
- Proposer and Canceller roles assigned to multi-sig

### Security

- Solidity 0.8.28, EVM target Cancun
- OpenZeppelin Contracts v5.6.1 + Contracts Upgradeable v5.6.1
- Static analysis: Slither (0 Critical/High/Medium), Mythril (0 issues), Aderyn (0 actionable)
- 182 tests, 100% statement/function/line coverage
- All contracts verified on TronScan with public source code

### Audit

CertiK audit covering all 3 contracts (~1,750 lines). Report will be linked here upon publication.

---

## Upgrade Policy

When DeedRegistry or BCOStaking are upgraded, each entry will include:

- **Version number** and date
- **Motivation** — why the upgrade is needed
- **Changes** — what was added, modified, or removed
- **Migration notes** — any state changes or configuration required
- **Timelock transaction** — link to the TimelockController operation on TronScan
- **Verification** — confirmation that `verifyInvariant()` returns `true` post-upgrade
