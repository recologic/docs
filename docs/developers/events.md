---
sidebar_position: 5
title: Events Reference
---

# Events Reference

Complete reference for all events emitted by BCO Protocol contracts. Use these events to build indexers, dashboards, and analytics.

## BCOToken Events

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

Standard ERC-20 transfer. `from = address(0)` on mint, `to = address(0)` on burn.

**Emitted by:** `transfer()`, `transferFrom()`, `mint()`, `burnFrom()`.

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value);
```

**Emitted by:** `approve()`, `permit()`.

### TokenRecovered

```solidity
event TokenRecovered(address indexed token, address indexed to, uint256 amount);
```

**Emitted by:** `recoverERC20()`. Audit trail for admin recovery operations.

### NativeRecovered

```solidity
event NativeRecovered(address indexed to, uint256 amount);
```

**Emitted by:** `recoverNative()`. Tracks recovery of force-deposited TRX/ETH.

### ContractURIUpdated

```solidity
event ContractURIUpdated();
```

No parameters. Emitted when the ERC-7572 contract metadata URI is changed.

**Emitted by:** `setContractURI()`. Fetch the new URI via `contractURI()` after this event.

### IssuerInfoUpdated

```solidity
event IssuerInfoUpdated(string name, string registration, string country);
```

**Emitted by:** `setIssuerInfo()`. Tracks changes to on-chain issuer identity.

### Paused / Unpaused

```solidity
event Paused(address account);
event Unpaused(address account);
```

**Emitted by:** `pause()`, `unpause()`. Emergency monitoring — alert systems should trigger on `Paused`.

---

## DeedRegistry Events

### DeedRegistered

```solidity
event DeedRegistered(
    bytes32 indexed id,
    uint256 areaM2,
    string geolocation,
    string documentHash,
    address indexed registeredBy,
    uint256 tokensMinted
);
```

**Emitted by:** `registerDeed()`. Core event for tracking forest deed registrations. The `documentHash` can be used to fetch and verify documents on IPFS.

### DeedDeactivated

```solidity
event DeedDeactivated(
    bytes32 indexed id,
    uint256 areaM2,
    string reason,
    uint256 tokensBurned
);
```

**Emitted by:** `deactivateDeed()`. Tracks supply contractions and deactivation reasons.

### DocumentsUpdated

```solidity
event DocumentsUpdated(
    bytes32 indexed id,
    string oldDocumentHash,
    string newDocumentHash,
    string reason
);
```

**Emitted by:** `updateDocuments()`. Audit trail for document revisions.

### RateLimitsUpdated

```solidity
event RateLimitsUpdated(uint256 maxDailyRegistrations, uint256 maxAreaPerDeed);
```

**Emitted by:** `setRateLimits()`.

### TreasuryUpdated

```solidity
event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
```

**Emitted by:** `setTreasury()`. Monitors where new mints are directed.

### TimelockChanged

```solidity
event TimelockChanged(address indexed oldTimelock, address indexed newTimelock);
```

**Emitted by:** `setTimelock()`. Critical governance event.

### DirectUpgradeSupplyLimitChanged

```solidity
event DirectUpgradeSupplyLimitChanged(uint256 oldLimit, uint256 newLimit);
```

**Emitted by:** `setDirectUpgradeSupplyLimit()`. Progressive timelock threshold change.

---

## BCOStaking Events

### Deposited

```solidity
event Deposited(address indexed user, uint256 amount, uint48 lockUntil);
```

**Emitted by:** `deposit()`. Track staking deposits and lock expiration times.

### Withdrawn

```solidity
event Withdrawn(address indexed user, uint256 amount);
```

**Emitted by:** `withdraw()`. Also emits `RewardClaimed` if the user has pending rewards.

### RewardClaimed

```solidity
event RewardClaimed(address indexed user, uint256 reward);
```

**Emitted by:** `claimRewards()`, and during `withdraw()` if rewards are pending.

### EmergencyWithdrawn

```solidity
event EmergencyWithdrawn(address indexed user, uint256 amount);
```

**Emitted by:** `emergencyWithdraw()`. A spike in these events may indicate a protocol concern. Emergency withdrawals forfeit all pending rewards.

### RewardAdded

```solidity
event RewardAdded(uint256 amount, uint256 rewardRate, uint256 periodFinish);
```

**Emitted by:** `notifyRewardAmount()`. Use `rewardRate` and `totalStaked` to calculate APY.

### RewardDurationUpdated

```solidity
event RewardDurationUpdated(uint256 newDuration);
```

**Emitted by:** `setRewardDuration()`.

### LockParametersUpdated

```solidity
event LockParametersUpdated(uint48 minLock, uint48 maxLock);
```

**Emitted by:** `setLockParameters()`.

---

## Shared Events

The following events are emitted by all three contracts with identical signatures:

- `TokenRecovered(address indexed token, address indexed to, uint256 amount)`
- `NativeRecovered(address indexed to, uint256 amount)`
- `ContractURIUpdated()`
- `IssuerInfoUpdated(string name, string registration, string country)`
- `Paused(address account)`
- `Unpaused(address account)`

---

## Indexing Guide

### Common Queries

| Query | Events to Index |
|-------|----------------|
| Total supply over time | `Transfer` where `from = address(0)` (mints) and `to = address(0)` (burns) |
| Active deeds | `DeedRegistered` minus `DeedDeactivated` (match by `id`) |
| Total forest area | Sum `areaM2` from `DeedRegistered` minus sum from `DeedDeactivated` |
| TVL in staking | Running sum of `Deposited.amount` - `Withdrawn.amount` - `EmergencyWithdrawn.amount` |
| Staking APY | `RewardAdded.rewardRate * 31536000 / totalStaked * 100` |
| Governance changes | `TreasuryUpdated`, `TimelockChanged`, `DirectUpgradeSupplyLimitChanged`, `RateLimitsUpdated` |

### Contract Addresses for Event Filtering

| Event Category | Contract |
|----------------|----------|
| Token transfers and approvals | BCOToken (`TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p`) |
| Deed lifecycle | DeedRegistry (`TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1`) |
| Staking activity | BCOStaking (`TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe`) |

### TronGrid Event API

```javascript
const events = await tronWeb.getEventResult(
  'TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1',
  {
    eventName: 'DeedRegistered',
    sinceTimestamp: Date.now() - 86400000, // Last 24 hours
    sort: 'block_timestamp',
    size: 200
  }
);
```

For high-volume indexing, use TronGrid's event subscription API or run your own full node with event plugins.
