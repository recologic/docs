---
sidebar_position: 2
title: Roles & Permissions
---

# Roles & Permissions

BCO Protocol uses OpenZeppelin's `AccessControlDefaultAdminRules` for role management. Admin transfer requires a 2-step process with a configurable delay, and admin renouncement is permanently blocked.

## Role Matrix

| Role | Contract | Assigned To | Purpose |
|------|----------|-------------|---------|
| `DEFAULT_ADMIN_ROLE` | All | Multi-sig 3/5 | Manage roles, 2-step transfer with delay |
| `MINTER_ROLE` | BCOToken | DeedRegistry contract | Mint BCO on deed registration |
| `BURNER_ROLE` | BCOToken | DeedRegistry contract | Burn BCO on deed deactivation |
| `PAUSER_ROLE` | All | Multi-sig 3/5 | Emergency pause (no delay) |
| `UPGRADER_ROLE` | DeedRegistry, BCOStaking | Multi-sig via timelock | Authorize UUPS upgrades |
| `REGISTRAR_ROLE` | DeedRegistry | Multi-sig 3/5 | Register and deactivate deeds |
| `REWARD_MANAGER_ROLE` | BCOStaking | Multi-sig 3/5 | Fund and configure reward periods |

## Wallets

| Wallet | Purpose |
|--------|---------|
| **Treasury** | Receives minted BCO, funds staking rewards |
| **Company Multi-sig** | Admin permissions only — holds no tokens |

The separation ensures that the admin wallet (Company Multi-sig) never holds tokens, reducing the impact of a potential compromise.

## Admin Safety

### 2-Step Admin Transfer

Changing the admin requires two transactions separated by a mandatory delay:

```
1. Current admin calls beginDefaultAdminTransfer(newAdmin)
2. Wait for delay period (48h)
3. New admin calls acceptDefaultAdminTransfer()
4. Old admin loses access automatically
```

This prevents accidental or malicious instant admin transfers.

### Renouncement Blocked

```solidity
beginDefaultAdminTransfer(address(0)) → reverts AdminRenounceBlocked()
```

The admin can transfer to any valid address but can **never** renounce. This prevents permanent governance death — there will always be an admin capable of responding to emergencies.

## Emergency Pause

All three contracts support `pause()` and `unpause()`. The pause function has **no delay** — it can be executed immediately by the `PAUSER_ROLE` for emergencies. When paused:

- BCOToken: All transfers are blocked
- DeedRegistry: No new registrations or deactivations
- BCOStaking: No deposits, withdrawals, or claims
