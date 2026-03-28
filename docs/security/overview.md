---
sidebar_position: 1
title: Security Overview
---

# Security

BCO Protocol is designed with defense-in-depth — multiple independent security layers ensure that no single point of failure can compromise the protocol or its users.

## Design Principles

| Principle | Implementation |
|-----------|---------------|
| Least privilege | Each role has minimal necessary permissions |
| Defense in depth | Multiple overlapping protections |
| Fail-safe defaults | Operations revert on invalid input |
| Immutability where possible | BCOToken cannot be upgraded |
| Transparency | TimelockController delays visible on-chain |

## Security Layers

```
Layer 1: Smart Contract Logic
├── Checks-Effects-Interactions (CEI) pattern
├── ReentrancyGuard on all state-changing functions
├── Input validation on all parameters
├── Custom errors (no revert strings)
└── Rate limiting on deed registration

Layer 2: Access Control
├── Role-based access (7 distinct roles)
├── 2-step admin transfer with 48h delay
├── Admin renouncement permanently blocked
└── Multi-sig 3/5 (Gnosis Safe)

Layer 3: Upgrade Protection
├── BCOToken is immutable (no proxy)
├── Progressive timelock on DeedRegistry + BCOStaking
├── Timelock delay visible on-chain
└── Storage gaps for safe future upgrades

Layer 4: Economic Safety
├── No public burn function
├── No infinite mint (staking rewards from pool)
├── Market buyback required for deed deactivation
└── Staker funds protected (excessBCO guard)
```

## Static Analysis

All three contracts have been analyzed with zero critical, high, or medium findings:

| Tool | Result |
|------|--------|
| [Slither](https://github.com/crytic/slither) | 0 Critical / 0 High / 0 Medium |
| [Mythril](https://github.com/Consensys/mythril) | 0 issues |
| [Aderyn](https://github.com/Cyfrin/aderyn) | 0 actionable findings |

## Test Coverage

182 tests covering 100% of statements, functions, and lines across unit, integration, and security test suites.

## Audit

Independent security audit by [CertiK](https://www.certik.com/) — pending.

## Reporting Vulnerabilities

If you discover a vulnerability, please report it responsibly to **security@recologic.io**. Do not disclose vulnerabilities publicly until they have been addressed.
