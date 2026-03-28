---
sidebar_position: 4
title: Governance
---

# Governance

BCO Protocol uses a **centralized governance model** with transparency enforced by an on-chain TimelockController. All administrative actions require multi-sig approval from a 3/5 Gnosis Safe.

## Governance Structure

```
     +----------------------------+
     |  Company Multi-sig 3/5     |
     |  (Gnosis Safe)             |
     |  Admin permissions only    |
     |  Holds no tokens           |
     +-------------+--------------+
                   |
          +--------+--------+
          |                 |
          v                 v
    Direct            TimelockController
    Operations        (72h delay)
          |                 |
          v                 v
    - pause()         - upgradeTo()
    - setRateLimits()   (when supply > 1M)
    - grant roles
    - set treasury
```

## Wallets

| Wallet | Purpose | Holds Tokens |
|--------|---------|-------------|
| **Company Multi-sig** | Admin permissions, role management | No |
| **Treasury** | Receives minted BCO, funds staking rewards | Yes |

The separation ensures that a compromised admin wallet cannot directly access token reserves.

## Decision-Making Process

### Direct Operations (No Delay)

For routine operations where speed is more important than review time:

```
1. Signer proposes action in Gnosis Safe
2. 2 additional signers confirm (3/5 threshold)
3. Transaction executes immediately
```

**Applies to:** `pause()`, `unpause()`, `setRateLimits()`, `setTreasury()`, role grants/revocations.

### Timelocked Operations (72h Delay)

For sensitive operations that affect token holder interests:

```
1. Multi-sig proposes action via TimelockController.schedule()
2. Proposal is visible on-chain immediately
3. 72-hour delay begins
4. Anyone can inspect the pending operation
5. After delay, multi-sig calls TimelockController.execute()
6. Operation is applied
```

**Applies to:** UUPS upgrades on DeedRegistry and BCOStaking (when supply > 1M BCO).

### Admin Transfer (48h Delay)

Transferring admin rights uses the most conservative process:

```
1. Current admin calls beginDefaultAdminTransfer(newAdmin)
2. 48-hour countdown begins
3. After delay, new admin calls acceptDefaultAdminTransfer()
4. Old admin loses access automatically (irreversible)
```

## What Admin CAN Do

| Action | Delay | Contract |
|--------|-------|----------|
| Pause/unpause all operations | None (emergency) | All |
| Grant/revoke roles | None | All |
| Update rate limits | None | DeedRegistry |
| Update treasury address | None | DeedRegistry |
| Update lock parameters | None | BCOStaking |
| Set reward duration | None | BCOStaking |
| Fund reward periods | None | BCOStaking |
| Recover accidentally sent tokens | None | All |
| Recover force-deposited TRX | None | All |
| Upgrade contracts (supply < 1M) | None | DeedRegistry, BCOStaking |
| Upgrade contracts (supply > 1M) | 72h timelock | DeedRegistry, BCOStaking |
| Transfer admin | 48h delay | All |

## What Admin CANNOT Do

| Action | Why |
|--------|-----|
| Mint BCO arbitrarily | Only `registerDeed()` can mint (requires valid deed) |
| Burn holder tokens | No public burn function exists |
| Freeze or seize tokens | No freeze/blacklist mechanism |
| Upgrade BCOToken | Immutable — no proxy |
| Renounce admin | `beginDefaultAdminTransfer(address(0))` reverts |
| Drain staker funds | `recoverERC20(BCO)` limited to `excessBCO()` |
| Set rate limits to zero | Validation enforces min 1 |
| Bypass timelock (when active) | Contract enforces timelock for upgrades |

## UUPS Upgrade Lifecycle

When a contract upgrade is needed:

```
Phase 1: Development
├── Write new implementation
├── Run full test suite (182 tests, 100% coverage)
├── Run static analysis (Slither, Mythril, Aderyn)
└── Internal review

Phase 2: Proposal (on-chain)
├── Multi-sig schedules upgrade via TimelockController
├── Pending operation is publicly visible
└── 72-hour delay begins

Phase 3: Review (public)
├── Anyone can inspect the new implementation code
├── Community and stakeholders can review
└── If concerns arise, multi-sig can cancel

Phase 4: Execution
├── After delay, multi-sig executes the upgrade
├── Proxy delegates to new implementation
├── All state is preserved (deeds, stakes, rewards, roles)
└── verifyInvariant() confirms supply integrity
```

## Future Governance

The current governance model is centralized by design for the early-stage protocol. As the ecosystem matures, governance may evolve. Any governance changes would go through the existing timelock process, ensuring transparency and holder protection.
