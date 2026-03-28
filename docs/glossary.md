---
sidebar_position: 99
title: Glossary
---

# Glossary

## Protocol Terms

### Biocoin (BCO)
TRC20 token on the TRON blockchain. Each BCO represents 1 square meter of verified forest land. The token is immutable — it cannot be upgraded, frozen, or seized.

### Deed
An on-chain record representing a verified parcel of forest land. Each deed contains an area (in square meters), geolocation, document hash, registration timestamp, and status.

### DeedStatus
The state of a deed. `ACTIVE` means the deed is valid and the corresponding BCO is in circulation. `DEACTIVATED` means the deed has been invalidated and the BCO has been burned.

### Invariant
The core rule of the protocol: `totalSupply() == totalActiveArea() * 1e18`. Every BCO in circulation is backed by exactly 1 m² of registered forest. This is enforced at the smart contract level.

### Elastic Supply
A supply model where the total number of tokens changes based on real-world events (deed registration and deactivation), rather than following a fixed emission schedule.

### Registrar
The role (`REGISTRAR_ROLE`) authorized to register and deactivate forest deeds. Assigned to the company multi-sig (Gnosis Safe 3/5).

### Treasury
The wallet that receives newly minted BCO when deeds are registered. Separate from the Company Multi-sig to isolate admin permissions from token holdings.

### Company Multi-sig
A 3/5 Gnosis Safe wallet that holds all admin permissions. It does not hold tokens. Three of five signers must approve any administrative action.

### Reward Manager
The role (`REWARD_MANAGER_ROLE`) authorized to fund staking reward periods and configure lock parameters on BCOStaking.

## Security Terms

### Progressive Timelock
A security mechanism that automatically requires a TimelockController delay for contract upgrades once the BCO supply exceeds a configurable threshold (default: 1M BCO). The activation is a one-way ratchet — it cannot be disabled once triggered.

### Ratchet
A one-way mechanism that cannot be reversed. In BCO, once the progressive timelock activates, it stays active permanently regardless of future supply changes.

### Dual Auth Pattern
A design where certain functions accept either the admin or the timelock as a valid caller. This prevents single-admin lockout when the progressive timelock is active. Used by `setTimelock()` and `setDirectUpgradeSupplyLimit()`.

### Admin Renounce Block
A safety feature that prevents the admin from renouncing their role by calling `beginDefaultAdminTransfer(address(0))`. This transaction reverts with `AdminRenounceBlocked()`, ensuring the protocol always has governance.

### 2-Step Admin Transfer
Admin transfer requires two separate transactions with a mandatory delay between them. The current admin initiates the transfer, waits for the delay (48h), and then the new admin must explicitly accept. This prevents accidental or malicious instant transfers.

### Checks-Effects-Interactions (CEI)
A Solidity design pattern where functions first check conditions, then update state, and finally interact with external contracts. This ordering prevents reentrancy attacks.

### ReentrancyGuard
A modifier that prevents a function from being called again before the first invocation completes. BCO uses `ReentrancyGuardTransient` (EIP-1153), which uses transient storage for gas efficiency.

### Storage Gap
Reserved storage slots (`__gap[48]`) in upgradeable contracts that allow future versions to add new state variables without colliding with existing storage layout.

### Circuit Breaker
The `pause()` function on all three contracts. When triggered, it stops all state-changing operations immediately. Used for emergency response.

## Technical Terms

### TRC20
The TRON equivalent of Ethereum's ERC-20 token standard. Defines the interface for fungible tokens on the TRON blockchain.

### UUPS Proxy
Universal Upgradeable Proxy Standard (EIP-1822). A proxy pattern where the upgrade logic lives in the implementation contract rather than the proxy. Used by DeedRegistry and BCOStaking. BCOToken is immutable (no proxy).

### EIP-2612 (Permit)
A standard for gasless token approvals. Instead of calling `approve()` in a separate transaction, users sign a message off-chain and the recipient submits it. BCOToken supports this.

### ERC-7572
A standard for on-chain contract metadata. Contracts expose a `contractURI()` function that returns a URI pointing to a JSON file with metadata about the contract.

### ERC-7201 (Namespaced Storage)
A standard for organizing storage in upgradeable contracts to prevent collisions. Used by OpenZeppelin v5 in the upgradeable contract variants.

### TimelockController
An OpenZeppelin contract that delays the execution of operations. Proposals are scheduled, a minimum delay must pass, and then the operation can be executed. Provides transparency — pending operations are visible on-chain.

### Gnosis Safe
A multi-signature wallet smart contract. Requires a configurable threshold of signers (3 of 5 for BCO) to approve any transaction before it executes.

### Synthetix StakingRewards
A reward distribution model where `rewardRate = rewardAmount / duration`. Rewards accrue per second, proportional to each staker's share of the pool. BCOStaking uses this model with the addition that rewards come from a pre-funded pool (no new token emission).

### excessBCO
A view function on BCOStaking that calculates how many BCO tokens can be safely recovered by the admin without affecting staked balances or unclaimed rewards: `balance - totalStaked - totalUnclaimedRewards`.
