---
sidebar_position: 3
title: BCOStaking
---

# BCOStaking

**UUPS upgradeable staking contract** based on the Synthetix StakingRewards model. Users deposit BCO to earn rewards from a pre-funded pool.

| Property | Value |
|----------|-------|
| Solidity | 0.8.28 |
| Proxy | UUPS (EIP-1822) |
| Model | Synthetix StakingRewards |
| Address | [`TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe`](https://tronscan.io/#/contract/TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe) |
| Storage Gap | `__gap[48]` reserved for upgrades |

## Roles

| Role | Assigned To | Purpose |
|------|-------------|---------|
| `DEFAULT_ADMIN_ROLE` | Multi-sig 3/5 | Manage roles, configure parameters |
| `REWARD_MANAGER_ROLE` | Multi-sig 3/5 | Fund reward periods |
| `PAUSER_ROLE` | Multi-sig 3/5 | Emergency pause |
| `UPGRADER_ROLE` | Multi-sig via timelock | Authorize upgrades |

## How Staking Works

### Reward Distribution

```
1. Reward manager calls notifyRewardAmount(amount)
2. Contract calculates: rewardRate = amount / rewardDuration
3. Rewards accrue per second, proportional to each staker's share
4. Stakers call getReward() to claim
5. After rewardDuration, rewards stop automatically
```

Rewards come from a **pre-funded pool** — no new tokens are minted. This preserves the BCO supply invariant.

### Example

```
Reward period: 100,000 BCO over 90 days (default duration)
Alice stakes: 1,000 BCO (25% of pool)
Bob stakes:   3,000 BCO (75% of pool)

Alice earns:  ~25,000 BCO over 90 days
Bob earns:    ~75,000 BCO over 90 days
```

## Key Functions

### Staking

```solidity
/// @notice Deposits BCO with a lock period.
function deposit(uint256 amount, uint48 lockDuration) external;

/// @notice Withdraws staked BCO. Requires lock to be expired. Claims rewards automatically.
function withdraw(uint256 amount) external;

/// @notice Claims accumulated rewards without withdrawing.
function claimRewards() external;

/// @notice Emergency withdraw — bypasses lock but forfeits all pending rewards.
function emergencyWithdraw() external;
```

### Reward Management

```solidity
/// @notice Starts or extends a reward period. Only REWARD_MANAGER_ROLE.
/// @dev Tokens must be transferred to the contract before calling.
function notifyRewardAmount(uint256 amount) external;

/// @notice Sets duration for future reward periods. Cannot change during active period.
function setRewardDuration(uint256 duration) external;

/// @notice Updates lock period parameters. Validates min > 0 and min <= max.
function setLockParameters(uint48 newMinLock, uint48 newMaxLock) external;
```

### View Functions

```solidity
function totalStaked() external view returns (uint256);
function earned(address account) external view returns (uint256);
function pendingReward(address account) external view returns (uint256);
function rewardRate() external view returns (uint256);
function rewardDuration() external view returns (uint256);
function periodFinish() external view returns (uint256);
function rewardPerToken() external view returns (uint256);
function lastTimeRewardApplicable() external view returns (uint256);
function totalUnclaimedRewards() external view returns (uint256);
function excessBCO() external view returns (uint256);
function minLockPeriod() external view returns (uint48);
function maxLockPeriod() external view returns (uint48);
```

### Configuration

```solidity
function setTimelock(address newTimelock) external;
function setDirectUpgradeSupplyLimit(uint256 newLimit) external;
```

### Lock Defaults

| Parameter | Default |
|-----------|---------|
| Min lock | 7 days |
| Max lock | 365 days |

### Recovery

```solidity
/// @notice Recovers force-deposited native currency.
function recoverNative() external;

/// @notice Recovers ERC-20 tokens. For BCO, limited to excessBCO().
function recoverERC20(address token, uint256 amount) external;
```

## Staker Fund Protection

The `recoverERC20()` function includes a guard when recovering BCO tokens:

```
recoverable BCO = contract balance - totalStaked - totalUnclaimedRewards
```

This ensures the admin can never drain staker funds or unclaimed rewards. Only genuinely excess tokens (e.g., accidentally sent) can be recovered.

## Events

```solidity
event Deposited(address indexed user, uint256 amount, uint48 lockUntil);
event Withdrawn(address indexed user, uint256 amount);
event RewardClaimed(address indexed user, uint256 reward);
event EmergencyWithdrawn(address indexed user, uint256 amount);
event RewardAdded(uint256 amount, uint256 rewardRate, uint256 periodFinish);
event RewardDurationUpdated(uint256 newDuration);
event LockParametersUpdated(uint48 minLock, uint48 maxLock);
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No infinite mint | Rewards from pool, not emissions — preserves invariant |
| Finite periods | Rewards stop automatically, no runaway distribution |
| Pull model | Stakers claim explicitly, no gas-heavy push distribution |
| Excess guard | Admin cannot drain staker funds via recovery |
| Progressive timelock | Upgrades require delay when supply > 1M BCO |
