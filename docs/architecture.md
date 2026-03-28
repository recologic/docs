---
sidebar_position: 2
title: Architecture
---

# Architecture

## Contract Interaction

```
                    ┌─────────────────────────────────┐
                    │      Company Multi-sig 3/5      │
                    │         (Gnosis Safe)            │
                    └──┬──────────┬──────────┬────────┘
                       │          │          │
              REGISTRAR│   ADMIN  │  REWARD  │
              _ROLE    │          │  _MANAGER │
                       │          │  _ROLE    │
                       ▼          │          ▼
  ┌─────────────────────────┐    │   ┌─────────────────────────┐
  │     DeedRegistry        │    │   │      BCOStaking          │
  │     (UUPS Proxy)        │    │   │      (UUPS Proxy)        │
  │                         │    │   │                          │
  │  registerDeed()         │    │   │  deposit()               │
  │  deactivateDeed()       │    │   │  withdraw()              │
  │  verifyInvariant()      │    │   │  claimRewards()          │
  └────┬──────────┬─────────┘    │   └──────────────────────────┘
       │          │              │
  MINTER_ROLE  BURNER_ROLE       │
  mint()       burnFrom()       │
       │          │              │
       ▼          ▼              │
  ┌──────────────────────────────┴──┐
  │         BCOToken                │
  │         (IMMUTABLE)             │
  │                                 │
  │  transfer() / approve()         │
  │  permit() (EIP-2612)            │
  │  pause() / unpause()            │
  └─────────────────────────────────┘
                  │
                  │ UPGRADER_ROLE (when supply > 1M)
                  │
  ┌───────────────▼─────────────────┐
  │       TimelockController        │
  │       (IMMUTABLE, 72h delay)    │
  │                                 │
  │  schedule() → wait → execute()  │
  └─────────────────────────────────┘
```

## Token Flow

```
  ┌──────────────┐     registerDeed()     ┌──────────────┐
  │  Forest Deed │ ────────────────────►  │  DeedRegistry │
  │  (verified)  │                        │  mint BCO     │
  └──────────────┘                        └──────┬───────┘
                                                  │
                                          1 m² = 1 BCO
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Treasury   │
                                          └──────┬───────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
                      │    Market    │    │   Staking    │    │  Operations  │
                      │   (DEX)     │    │   Rewards    │    │              │
                      └──────┬───────┘    └──────────────┘    └──────────────┘
                              │
                      Company buys BCO
                              │
                              ▼
                      ┌──────────────┐     deactivateDeed()
                      │  DeedRegistry │ ◄──────────────────
                      │  burn BCO    │     Deed deactivated
                      └──────────────┘
```

## Upgrade Flow (Supply > 1M BCO)

```
  Step 1: Propose                Step 2: Wait              Step 3: Execute

  ┌──────────────┐               ┌──────────────┐          ┌──────────────┐
  │  Multi-sig   │  schedule()   │  Timelock     │  72h+    │  Timelock    │
  │  proposes    │ ────────────► │  holds        │ ───────► │  executes    │
  │  upgrade     │               │  operation    │          │  upgrade     │
  └──────────────┘               └──────────────┘          └──────┬───────┘
                                                                   │
                                  Anyone can inspect               │
                                  the pending upgrade              ▼
                                  on-chain during delay    ┌──────────────┐
                                                           │  Proxy       │
                                                           │  delegates   │
                                                           │  to new impl │
                                                           └──────────────┘
```

## Role Hierarchy

```
  DEFAULT_ADMIN_ROLE (Multi-sig 3/5)
  │
  ├── Manages all roles on all contracts
  ├── 2-step transfer with 48h delay
  ├── Renounce permanently blocked
  │
  ├── BCOToken
  │   ├── MINTER_ROLE ──► DeedRegistry contract (not a wallet)
  │   ├── BURNER_ROLE ──► DeedRegistry contract (not a wallet)
  │   └── PAUSER_ROLE ──► Multi-sig 3/5
  │
  ├── DeedRegistry
  │   ├── REGISTRAR_ROLE ──► Multi-sig 3/5
  │   ├── UPGRADER_ROLE  ──► Multi-sig via TimelockController
  │   └── PAUSER_ROLE    ──► Multi-sig 3/5
  │
  └── BCOStaking
      ├── REWARD_MANAGER_ROLE ──► Multi-sig 3/5
      ├── UPGRADER_ROLE       ──► Multi-sig via TimelockController
      └── PAUSER_ROLE         ──► Multi-sig 3/5
```

## Wallet Separation

```
  ┌─────────────────────────────┐     ┌─────────────────────────────┐
  │    Company Multi-sig        │     │    Treasury                 │
  │    (Gnosis Safe 3/5)        │     │    (Gnosis Safe)            │
  │                             │     │                             │
  │  ✓ Admin permissions        │     │  ✓ Receives minted BCO     │
  │  ✓ Role management          │     │  ✓ Funds staking rewards   │
  │  ✓ Configuration changes    │     │  ✓ Operational spending    │
  │  ✗ Holds no tokens          │     │  ✗ No admin permissions    │
  └─────────────────────────────┘     └─────────────────────────────┘
```

Separating admin from treasury ensures that a compromised admin wallet cannot directly access token reserves, and a compromised treasury cannot alter protocol configuration.

## Storage Layout

### Upgradeable Contracts

DeedRegistry and BCOStaking use:
- **OpenZeppelin namespaced storage (ERC-7201)** — Storage slots are namespaced to prevent collisions between inherited contracts.
- **Storage gaps (`__gap[48]`)** — 48 reserved storage slots allow future upgrades to add new state variables without shifting existing storage.

### BCOToken

BCOToken is immutable and uses standard (non-namespaced) storage since it will never be upgraded.
