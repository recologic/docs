---
sidebar_position: 1
title: BCOToken
---

# BCOToken

**Immutable TRC20 token** — the core asset of the BCO Protocol. Cannot be upgraded, frozen, or seized.

| Property | Value |
|----------|-------|
| Standard | TRC20 (ERC-20 compatible) |
| Solidity | 0.8.28 |
| Proxy | None (immutable) |
| Address | [`TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p`](https://tronscan.io/#/contract/TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p) |

## Inherited Contracts

| Contract | Source |
|----------|--------|
| ERC20 | OpenZeppelin v5.6.1 |
| ERC20Permit (EIP-2612) | OpenZeppelin v5.6.1 |
| AccessControlDefaultAdminRules | OpenZeppelin v5.6.1 |
| Pausable | OpenZeppelin v5.6.1 |
| ReentrancyGuardTransient (EIP-1153) | OpenZeppelin v5.6.1 |

## Roles

| Role | Assigned To | Purpose |
|------|-------------|---------|
| `DEFAULT_ADMIN_ROLE` | Multi-sig 3/5 | Manage roles, 2-step transfer |
| `MINTER_ROLE` | DeedRegistry | Mint BCO on deed registration |
| `BURNER_ROLE` | DeedRegistry | Burn BCO on deed deactivation |
| `PAUSER_ROLE` | Multi-sig 3/5 | Emergency pause |

## Key Functions

### Token Operations

```solidity
/// @notice Mints tokens to an address. Only callable by MINTER_ROLE.
function mint(address to, uint256 amount) external;

/// @notice Burns tokens from an address. Only callable by BURNER_ROLE.
/// @dev Requires prior approval from the token holder.
function burnFrom(address from, uint256 amount) external;
```

### ERC-20 Standard

```solidity
function transfer(address to, uint256 amount) external returns (bool);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);
function balanceOf(address account) external view returns (uint256);
function totalSupply() external view returns (uint256);
function allowance(address owner, address spender) external view returns (uint256);
```

### Gasless Approvals (EIP-2612)

```solidity
function permit(
    address owner, address spender, uint256 value,
    uint256 deadline, uint8 v, bytes32 r, bytes32 s
) external;
```

### Metadata (ERC-7572)

```solidity
/// @notice Returns contract metadata URI.
function contractURI() external view returns (string memory);

/// @notice Update contract metadata URI. Admin only.
function setContractURI(string calldata newURI) external;

/// @notice Update issuer identity information on-chain. Admin only.
function setIssuerInfo(
    string calldata name,          // Legal name (e.g., "REcologic Ltda")
    string calldata registration,  // Registration number (e.g., CNPJ)
    string calldata country        // ISO 3166-1 alpha-2 (e.g., "BR")
) external;
```

### Recovery

```solidity
/// @notice Recovers force-deposited native currency (TRX/ETH).
function recoverNative() external;

/// @notice Recovers accidentally sent ERC-20 tokens.
function recoverERC20(address tokenAddress, uint256 amount) external;
```

### Admin

```solidity
function pause() external;    // PAUSER_ROLE
function unpause() external;  // PAUSER_ROLE
```

## What BCOToken Does NOT Have

These features are intentionally absent:

| Feature | Reason |
|---------|--------|
| `burn()` | No public burn — protects the invariant |
| `ERC20Burnable` | Not inherited — holders cannot burn |
| `freeze()` / `blacklist()` | No compliance role — full self-custody |
| `COMPLIANCE_ROLE` | No frozen addresses, no seized funds |
| Proxy / upgrade | Immutable — rules can never change |

## Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

## Errors

```solidity
error AdminRenounceBlocked();      // beginDefaultAdminTransfer(address(0)) reverts
error ZeroAddress();               // Zero address in parameters
error ZeroAmount();                // Zero amount in parameters
```
