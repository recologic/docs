---
sidebar_position: 2
title: DeedRegistry
---

# DeedRegistry

**UUPS upgradeable contract** that registers verified forest deeds on-chain and manages the BCO supply through minting and burning.

| Property | Value |
|----------|-------|
| Solidity | 0.8.28 |
| Proxy | UUPS (EIP-1822) |
| Address | [`TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1`](https://tronscan.io/#/contract/TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1) |
| Storage Gap | `__gap[48]` reserved for upgrades |

## Roles

| Role | Assigned To | Purpose |
|------|-------------|---------|
| `DEFAULT_ADMIN_ROLE` | Multi-sig 3/5 | Manage roles, configure limits |
| `REGISTRAR_ROLE` | Multi-sig 3/5 | Register and deactivate deeds |
| `PAUSER_ROLE` | Multi-sig 3/5 | Emergency pause |
| `UPGRADER_ROLE` | Multi-sig via timelock | Authorize upgrades |

## Data Structures

### Deed

```solidity
struct Deed {
    bytes32 id;              // Unique deed identifier
    uint256 areaInSquareMeters;
    string geolocation;      // GPS coordinates or boundary description
    string documentHash;     // Off-chain document reference
    uint48 registeredAt;     // Timestamp of registration
    uint48 deactivatedAt;    // Timestamp of deactivation (0 if active)
    DeedStatus status;       // Active or Deactivated
}
```

### DeedStatus

```solidity
enum DeedStatus {
    Active,       // Deed is valid, BCO is minted
    Deactivated   // Deed is invalid, BCO is burned
}
```

## Key Functions

### Deed Management

```solidity
/// @notice Registers a new forest deed and mints BCO to treasury.
/// @dev Only REGISTRAR_ROLE. Subject to rate limits.
function registerDeed(
    bytes32 id,
    uint256 areaM2,
    string calldata geolocation,
    string calldata documentHash
) external;

/// @notice Deactivates a deed and burns the equivalent BCO.
/// @dev Only REGISTRAR_ROLE. Company must pre-approve the burn amount.
function deactivateDeed(bytes32 deedId, string calldata reason) external;

/// @notice Updates IPFS documents of an existing active deed.
/// @dev Only REGISTRAR_ROLE.
function updateDocuments(
    bytes32 deedId,
    string calldata newDocumentHash,
    string calldata reason
) external;
```

### View Functions

```solidity
function getDeed(bytes32 id) external view returns (Deed memory);
function totalDeedCount() external view returns (uint256);
function activeDeedCount() external view returns (uint256);
function totalActiveArea() external view returns (uint256);
function verifyInvariant() external view returns (bool);
function todayRegistrations() external view returns (uint256);
function getDeedIdByIndex(uint256 index) external view returns (bytes32);
function getDeedIds(uint256 offset, uint256 limit) external view returns (bytes32[] memory);

/// @notice Public document verification — anyone can verify a deed's document.
function verifyDocument(
    bytes32 deedId,
    string calldata documentHash
) external view returns (bool isValid, Deed memory deed);
```

### Configuration

```solidity
/// @notice Updates rate limits. Admin only.
function setRateLimits(uint256 newMaxDaily, uint256 newMaxArea) external;

/// @notice Sets the timelock controller address.
/// @dev Protected by progressive timelock (dual auth: admin OR timelock).
function setTimelock(address newTimelock) external;

/// @notice Sets the supply threshold for direct upgrades.
/// @dev Protected by progressive timelock (dual auth: admin OR timelock).
function setDirectUpgradeSupplyLimit(uint256 newLimit) external;
```

### Recovery

```solidity
function recoverNative() external;
function recoverERC20(address token, uint256 amount) external;
```

## Rate Limits

| Parameter | Default | Constraints |
|-----------|---------|------------|
| Max deeds per day | 10 | Min 1 |
| Max area per deed | 10,000,000 m² | Min 1 |
| Max string length | 512 bytes | Geolocation and documentHash |

## Events

```solidity
event DeedRegistered(bytes32 indexed deedId, uint256 areaInSquareMeters, uint256 timestamp);
event DeedDeactivated(bytes32 indexed deedId, uint256 timestamp);
event RateLimitsUpdated(uint256 maxDaily, uint256 maxArea);
event TimelockUpdated(address indexed oldTimelock, address indexed newTimelock);
```

## Invariant

After every `registerDeed()` and `deactivateDeed()`:

```
BCOToken.totalSupply() == DeedRegistry.totalActiveArea() × 10¹⁸
```

This is enforced by the contract logic and verified by `verifyInvariant()`.
