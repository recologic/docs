---
sidebar_position: 3
title: Progressive Timelock
---

# Progressive Timelock

The progressive timelock is a security mechanism that automatically activates stronger protections as the protocol grows. It applies to **DeedRegistry** and **BCOStaking** — BCOToken is immutable and does not need upgrade protection.

## How It Works

```
Supply ≤ 1M BCO:  Admin can upgrade directly (early-stage flexibility)
Supply > 1M BCO:  Upgrades must go through TimelockController (holder protection)
```

Once the supply exceeds the threshold, the timelock requirement is permanent — it cannot be disabled. This is a one-way ratchet.

## Timelock Flow

When the progressive timelock is active, upgrades follow this process:

```
1. Proposer (multi-sig) schedules upgrade via TimelockController
2. Timelock delay begins (72h)
3. Anyone can inspect the pending upgrade on-chain
4. After delay, executor calls execute() on TimelockController
5. TimelockController calls upgradeToAndCall() on the proxy
6. Upgrade is applied
```

Token holders have the full delay period to review the proposed upgrade and take action (e.g., withdraw from staking) if they disagree.

## Protected Functions

The following functions require timelock authorization when supply exceeds the threshold:

| Function | Contract | Purpose |
|----------|----------|---------|
| `upgradeTo()` | DeedRegistry, BCOStaking | UUPS proxy upgrade |
| `setTimelock()` | DeedRegistry, BCOStaking | Change timelock address |
| `setDirectUpgradeSupplyLimit()` | DeedRegistry, BCOStaking | Change supply threshold |

## Dual Auth Pattern

`setTimelock()` and `setDirectUpgradeSupplyLimit()` accept **either** the admin or the timelock as caller. This prevents a single-admin lockout scenario:

```
Below threshold:  admin calls directly         ✅
Above threshold:  timelock calls (no admin needed) ✅
Random address:   reverts with Unauthorized()   ❌
```

The TimelockController does **not** need `DEFAULT_ADMIN_ROLE` to call these functions.

## Configuration

| Parameter | Value |
|-----------|-------|
| Timelock delay | 72 hours (3 days) |
| Supply threshold | Configurable (default: 1,000,000 BCO) |
| Ratchet | One-way — cannot be disabled once activated |
