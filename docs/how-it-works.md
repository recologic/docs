---
sidebar_position: 2
title: How It Works
---

# How It Works

## The Invariant

The entire protocol exists to enforce one rule:

```
BCOToken.totalSupply() == DeedRegistry.totalActiveArea() × 10¹⁸
```

Every BCO in circulation is backed by exactly 1 m² of registered, verified forest land. This is not a promise — it is enforced by the smart contracts and verifiable on-chain by anyone.

## Token Lifecycle

### Minting (Supply Expansion)

When new forest land is verified and registered:

```
1. Forest deed is verified off-chain (documentation, geolocation, area)
2. Registrar calls registerDeed() on DeedRegistry
3. DeedRegistry records the deed (area, geolocation, document hash)
4. DeedRegistry calls mint() on BCOToken
5. New BCO tokens (area × 10¹⁸) are sent to the treasury
6. totalActiveArea increases, totalSupply increases → invariant preserved
```

**Example:** A 5,000 m² forest deed is registered → 5,000 BCO are minted to treasury.

### Burning (Supply Contraction)

When a forest deed is deactivated (e.g., land is no longer verified):

```
1. Company buys BCO from the open market
2. Company approves DeedRegistry to spend the tokens
3. Registrar calls deactivateDeed() on DeedRegistry
4. DeedRegistry burns the equivalent BCO from the company
5. Deed status changes to Deactivated
6. totalActiveArea decreases, totalSupply decreases → invariant preserved
```

**Important:** The company must buy BCO from the market to deactivate deeds. This creates natural demand pressure proportional to deactivation activity.

### Verification

Anyone can call `verifyInvariant()` on DeedRegistry at any time:

```solidity
function verifyInvariant() external view returns (bool) {
    return bcoToken.totalSupply() == totalActiveArea * 1e18;
}
```

If this ever returns `false`, the protocol is in an invalid state — which the contract architecture is designed to make impossible.

## Staking

BCO holders can stake their tokens to earn rewards through BCOStaking:

```
1. Reward manager funds a reward period (e.g., 100,000 BCO over 90 days)
2. Users deposit BCO into the staking contract
3. Rewards accrue proportionally to each staker's share
4. Users claim rewards and/or withdraw at any time
```

**Key design decisions:**
- **No infinite mint** — Rewards come from a pre-funded pool, not new token emissions.
- **Finite periods** — Reward distribution stops automatically when the period ends.
- **Pull model** — Stakers claim rewards explicitly; no auto-distribution.

Staking does not affect the invariant — tokens are transferred, not minted or burned.

## Rate Limiting

To prevent abuse, DeedRegistry enforces:

| Limit | Default | Configurable |
|-------|---------|-------------|
| Max deeds per day | 10 | Yes (min 1) |
| Max area per deed | 10,000,000 m² | Yes (min 1) |

These limits can be adjusted by the admin but cannot be set to zero.
