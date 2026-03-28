---
slug: /
sidebar_position: 1
title: Overview
---

# BCO Protocol

**Biocoin (BCO)** is a forest-backed TRC20 token with elastic supply, issued by [REcologic](https://recologic.io). Each BCO represents exactly **1 square meter** of verified forest land, with the supply-to-area ratio permanently enforced on-chain.

## Core Concept

Unlike stablecoins backed by fiat reserves held off-chain, BCO's backing is enforced at the smart contract level. The protocol makes it mathematically impossible to mint tokens without registering a corresponding forest deed, or to remove a deed without burning the equivalent tokens.

```
totalSupply() == totalActiveArea() × 10¹⁸
```

This invariant is publicly verifiable by anyone via `verifyInvariant()` — no trust required.

## Protocol Architecture

```
                  ┌──────────────────┐
                  │  Biocoin (BCO)   │
                  │  TRC20 Token     │
                  │  IMMUTABLE       │
                  └──┬───────────┬───┘
                     │           │
        mint/burn    │           │
          ┌──────────┘           └──────────┐
          ▼                                 ▼
  ┌───────────────────┐          ┌───────────────────┐
  │  DeedRegistry     │          │  BCOStaking       │
  │  UUPS Proxy       │          │  UUPS Proxy       │
  │                   │          │                   │
  │  Registers forest │          │  Deposit BCO to   │
  │  deeds on-chain   │          │  earn rewards     │
  └───────────────────┘          └───────────────────┘
```

## Contracts

| Contract | Type | Description |
|----------|------|-------------|
| [BCOToken](/contracts/bco-token) | Immutable | TRC20 token — no freeze, no seize, full self-custody |
| [DeedRegistry](/contracts/deed-registry) | UUPS Proxy | Registers verified forest deeds, mints and burns BCO |
| [BCOStaking](/contracts/bco-staking) | UUPS Proxy | Stake BCO to earn rewards (Synthetix model) |
| TimelockController | Immutable | 72h delay for governance transparency |

## Key Properties

- **Immutable token** — BCOToken cannot be upgraded, frozen, or seized. Holders have full custody.
- **Elastic supply** — Expands when forest deeds are registered, contracts when deeds are deactivated.
- **No public burn** — Holders cannot burn their own tokens. Only DeedRegistry can mint and burn.
- **On-chain proof** — `verifyInvariant()` lets anyone verify the 1:1 backing ratio at any time.
- **Multi-sig governance** — All admin operations require 3/5 Gnosis Safe signatures.
- **Progressive timelock** — Upgrades require a timelock delay once supply exceeds 1M BCO.

## Resources

- [Website](https://recologic.io)
- [Whitepaper](https://recologic.io/whitepaper)
- [Source Code](https://github.com/recologic/bco-protocol)
- [TronScan](https://tronscan.io/#/token20/TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p)
- [X / Twitter](https://x.com/recologic_io)
