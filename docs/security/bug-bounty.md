---
sidebar_position: 6
title: Bug Bounty
---

# Bug Bounty Program

BCO Protocol welcomes responsible disclosure of security vulnerabilities. This page outlines the scope, severity levels, and rules of engagement.

## Scope

### In Scope

| Contract | Address | Lines |
|----------|---------|-------|
| BCOToken | [`TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p`](https://tronscan.io/#/contract/TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p) | ~300 |
| DeedRegistry | [`TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1`](https://tronscan.io/#/contract/TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1) | ~690 |
| BCOStaking | [`TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe`](https://tronscan.io/#/contract/TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe) | ~730 |

Source code: [github.com/recologic/bco-protocol](https://github.com/recologic/bco-protocol)

### Out of Scope

- Third-party contracts (OpenZeppelin, TimelockController)
- Front-end applications and websites
- Off-chain infrastructure (servers, DNS, email)
- Social engineering attacks
- Denial of service attacks on the TRON network
- Issues already reported or known
- Issues in test or mock contracts

## Severity Levels

### Critical

Direct loss of funds, invariant violation, or unauthorized minting/burning.

**Examples:**
- Breaking the `totalSupply == totalActiveArea * 1e18` invariant
- Unauthorized minting without a registered deed
- Unauthorized burning of holder tokens
- Draining staked funds or unclaimed rewards
- Bypassing access control to execute admin functions

### High

Significant impact on protocol functionality or fund security with preconditions.

**Examples:**
- Bypassing the progressive timelock for upgrades
- Circumventing rate limits to register unlimited deeds
- Manipulating reward distribution in BCOStaking
- Bypassing the 2-step admin transfer delay
- Reentrancy attacks that alter state

### Medium

Limited impact on protocol functionality or minor fund risk.

**Examples:**
- Griefing attacks that increase gas costs for other users
- Incorrect event emission leading to off-chain indexing errors
- Edge cases in reward calculation that cause minor rounding issues
- Storage collision risks in upgrade scenarios

### Low

Informational findings, best practice violations, or gas optimizations.

**Examples:**
- Gas optimization opportunities
- Code quality improvements
- Deviations from Solidity style guide
- Missing input validation on non-critical paths

## Responsible Disclosure Rules

1. **Report privately** — Send findings to **security@recologic.io**
2. **Do not disclose publicly** — Allow reasonable time for the team to investigate and fix
3. **Do not exploit** — Do not use the vulnerability beyond what is necessary to demonstrate it
4. **Do not attack mainnet** — Use testnet or local forks for proof of concept
5. **One report per issue** — Submit separate reports for separate vulnerabilities
6. **Provide details** — Include steps to reproduce, impact assessment, and suggested fix if possible

## Report Format

Please include:

```
Subject: [BCO Bug Bounty] Brief description

Severity: Critical / High / Medium / Low
Contract: BCOToken / DeedRegistry / BCOStaking
Function: affected function name

Description:
[Detailed description of the vulnerability]

Steps to reproduce:
1. ...
2. ...

Impact:
[What an attacker could achieve]

Proof of concept:
[Code or transaction demonstrating the issue]

Suggested fix:
[Optional — your recommended remediation]
```

## Response Timeline

| Phase | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix development | Depends on severity |
| Disclosure | After fix is deployed |

## Eligibility

- First reporter of a given vulnerability
- Report must include a clear proof of concept
- Vulnerability must be in-scope and reproducible
- Reporter must follow responsible disclosure rules

## Formal Program

A formal bug bounty program on [Immunefi](https://immunefi.com) is planned. This page will be updated with the program link and reward tiers when launched.

## Contact

**Email:** security@recologic.io
