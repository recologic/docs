---
sidebar_position: 3
title: Tokenomics
---

# Tokenomics

## Supply Model

BCO has an **elastic supply** with no pre-determined cap. Supply is driven entirely by verified forest land:

| Property | Value |
|----------|-------|
| Initial supply | 0 |
| Pre-mine | None |
| Max supply | No hard cap (bounded by verifiable forest area) |
| Decimals | 18 |
| Minting trigger | Forest deed registration |
| Burning trigger | Forest deed deactivation |

Supply grows when new forest land is verified and registered. Supply contracts when deeds are deactivated. There is no mechanism to mint BCO without a corresponding forest deed.

## Token Flow

```
Forest Deed Verified
       │
       ▼
  registerDeed()          ┌──────────────┐
  Mint BCO ──────────────►│   Treasury   │
  (1 m² = 1 BCO)         └──────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Market   │ │ Staking  │ │Operations│
              │  (DEX)    │ │ Rewards  │ │          │
              └──────────┘ └──────────┘ └──────────┘
                    │
                    ▼
              Deed Deactivation
              Company buys BCO from market
              deactivateDeed() burns BCO
```

### Step by Step

1. **Mint** — Forest deed is registered, BCO is minted to treasury (1 m² = 1 BCO)
2. **Distribution** — Treasury distributes BCO to market, staking rewards, or operations
3. **Circulation** — BCO trades freely on DEXs; holders can stake for rewards
4. **Buyback** — To deactivate a deed, the company must buy BCO from the open market
5. **Burn** — `deactivateDeed()` burns the purchased BCO, reducing supply

## Demand Drivers

| Driver | Mechanism |
|--------|-----------|
| **Forest backing** | Each BCO represents 1 m² of verified forest — tangible, verifiable backing |
| **Buyback pressure** | Deed deactivation requires market purchase, creating demand |
| **Staking rewards** | Holders earn yield by staking BCO |
| **On-chain verification** | `verifyInvariant()` provides trustless proof of backing |
| **Scarcity** | Supply is bounded by real-world forest area, not arbitrary caps |

## Staking Economics

BCO staking uses the Synthetix StakingRewards model with finite reward periods:

```
rewardRate = rewardAmount / rewardDuration
```

| Parameter | Description |
|-----------|-------------|
| Reward source | Pre-funded pool (no new token emission) |
| Reward period | Finite (default: 90 days) |
| Distribution | Proportional to staked share |
| Claim model | Pull — stakers claim explicitly |
| Period end | Rewards stop automatically |

**There is no infinite mint for staking.** Rewards come exclusively from tokens deposited into the staking contract by the reward manager. When the reward period ends, distribution stops. This preserves the supply invariant.

### Example

```
Reward pool:   100,000 BCO over 90 days
Total staked:  1,000,000 BCO

Daily rate:    ~1,111 BCO/day distributed across all stakers
APY:           ~4.1% (varies with total staked amount)
```

APY is not fixed — it changes as stakers enter and exit the pool.

## Supply Dynamics

| Event | Supply | Area | Price Pressure |
|-------|--------|------|----------------|
| Register deed (5,000 m²) | +5,000 BCO | +5,000 m² | Neutral (minted to treasury) |
| Deactivate deed (5,000 m²) | -5,000 BCO | -5,000 m² | Positive (buyback from market) |
| Stake BCO | No change | No change | Reduces circulating supply |
| Unstake BCO | No change | No change | Increases circulating supply |
| Staking reward claim | No change | No change | Neutral (from pre-funded pool) |

## No Inflationary Mechanisms

BCO has no:
- Block rewards or emissions schedule
- Inflationary staking rewards (rewards come from a finite pool)
- Team vesting unlocks that inflate supply
- Governance token farming

Every BCO in existence is backed by a registered, verified forest deed. The invariant is enforced at the smart contract level and cannot be circumvented.
