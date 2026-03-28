---
sidebar_position: 4
title: Audit
---

# Audit

## Current Status

| Audit | Status |
|-------|--------|
| Slither (static analysis) | 0 Critical / 0 High / 0 Medium |
| Mythril (symbolic execution) | 0 issues |
| Aderyn (static analysis) | 0 actionable findings |
| CertiK (independent audit) | Pending |

## Test Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Functions | 100% |
| Lines | 100% |
| Branches | 100% |

182 tests across unit, integration, and security suites.

## Scope

The audit scope covers three smart contracts (~1,750 lines of Solidity):

| Contract | Lines | Type |
|----------|-------|------|
| BCOToken | ~300 | Immutable TRC20 |
| DeedRegistry | ~690 | UUPS Proxy |
| BCOStaking | ~730 | UUPS Proxy |

## Verified Invariants

The test suite verifies the following invariants:

1. `totalSupply == totalActiveArea × 10¹⁸` after every register/deactivate
2. `totalStaked ≤ contract balance` (staking solvency)
3. Rewards stop after period ends
4. No unauthorized mint/burn/pause
5. Holders cannot burn their own tokens
6. State preserved after UUPS upgrade
7. MINTER_ROLE stays on proxy address across upgrades
8. Progressive timelock blocks unauthorized upgrades
9. Admin renounce blocked on all contracts
10. `recoverNative()` works for force-deposited TRX/ETH
11. Timelock accepted as valid caller without DEFAULT_ADMIN_ROLE

## Reporting Vulnerabilities

To report a security vulnerability, contact **security@recologic.io**.

Please do not disclose vulnerabilities publicly until they have been addressed by the team.
