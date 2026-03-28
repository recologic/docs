---
sidebar_position: 2
title: Integration Guide
---

# Integration Guide

## Reading Token Data

BCO is a standard TRC20 (ERC-20 compatible) token. Any wallet, DEX, or dApp that supports TRC20 tokens can integrate with BCO using standard interfaces.

### Basic Token Info

```solidity
// Standard ERC-20
function name() external view returns (string memory);        // "Biocoin"
function symbol() external view returns (string memory);      // "BCO"
function decimals() external view returns (uint8);            // 18
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
```

### Forest Backing Verification

```solidity
// On DeedRegistry
function totalActiveArea() external view returns (uint256);   // Total backed area in m²
function verifyInvariant() external view returns (bool);      // true if supply == area × 10¹⁸
function getDeed(bytes32 deedId) external view returns (Deed memory);
function totalDeedCount() external view returns (uint256);
function activeDeedCount() external view returns (uint256);
```

### Staking Info

```solidity
// On BCOStaking
function totalStaked() external view returns (uint256);
function earned(address account) external view returns (uint256);
function earned(address account) external view returns (uint256);
function rewardRate() external view returns (uint256);
function periodFinish() external view returns (uint256);
```

## Gasless Approvals (EIP-2612)

BCOToken supports `permit()` for gasless approvals via signature:

```solidity
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v, bytes32 r, bytes32 s
) external;
```

This allows users to approve token spending without a separate transaction, reducing friction for staking deposits and other integrations.

## Contract ABIs

ABIs are available in the [bco-protocol repository](https://github.com/recologic/bco-protocol) under `artifacts/contracts/`.

After cloning and compiling:

```bash
git clone https://github.com/recologic/bco-protocol.git
cd bco-protocol
npm install
npx hardhat compile
```

ABIs will be in:
- `artifacts/contracts/token/BCOToken.sol/BCOToken.json`
- `artifacts/contracts/registry/DeedRegistry.sol/DeedRegistry.json`
- `artifacts/contracts/staking/BCOStaking.sol/BCOStaking.json`
