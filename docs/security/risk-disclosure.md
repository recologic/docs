---
sidebar_position: 5
title: Risk Disclosure
---

# Public Risk Disclosure

This page describes the known risks associated with the BCO Protocol. Users and integrators should read this before interacting with the protocol.

## Smart Contract Risk

All smart contracts carry inherent risk regardless of testing and auditing:

- **Undiscovered bugs** — Despite 182 tests with 100% coverage and three static analysis tools with zero findings, undiscovered vulnerabilities may exist.
- **Dependency risk** — BCO contracts depend on OpenZeppelin v5.6.1. A vulnerability in OpenZeppelin could affect BCO.
- **Compiler risk** — Solidity 0.8.28 compiler bugs could produce incorrect bytecode.
- **EIP-1153 risk** — ReentrancyGuardTransient relies on transient storage (TSTORE/TLOAD). If the TRON TVM implementation differs from the EVM specification, the reentrancy guard could behave unexpectedly.

## Centralization Risk

The protocol is governed by a centralized multi-sig:

- **Multi-sig compromise** — If 3 of 5 multi-sig signers are compromised, an attacker could pause the protocol, change configuration, or (with timelock) upgrade contracts.
- **Key loss** — If enough signers lose access to their keys, governance operations become impossible. Admin renouncement is blocked, but key loss achieves the same effect.
- **Registrar trust** — The `REGISTRAR_ROLE` controls which deeds are registered. Users must trust that the registrar only registers genuinely verified forest deeds.
- **Single entity** — All governance roles are held by REcologic. There is no decentralized governance or community voting.

### Mitigations

- 2-step admin transfer with 48h delay prevents instant unauthorized transfers
- Admin renouncement is permanently blocked
- Progressive timelock delays upgrades when supply exceeds 1M BCO
- Pause function allows immediate response to detected threats

## Off-Chain Dependency Risk

The BCO invariant guarantees that supply equals registered area on-chain. However:

- **Deed verification is off-chain** — The smart contract cannot verify that a forest deed corresponds to real forest land. It trusts the registrar.
- **Document authenticity** — The `documentHash` stored on-chain is a reference to off-chain documents. The contract cannot verify document authenticity.
- **Geolocation accuracy** — Geolocation strings are stored as-is. The contract does not validate GPS coordinates.
- **Forest permanence** — Registered forest land may be damaged by fire, deforestation, or natural disasters. The protocol depends on the registrar to deactivate affected deeds.

The on-chain invariant is a necessary but not sufficient condition for the backing claim. Full verification requires auditing the off-chain deed verification process.

## Blockchain Risk (TRON)

- **TRON network risk** — BCO is deployed on TRON. Network outages, consensus failures, or protocol changes could affect token operations.
- **TVM compatibility** — The TRON Virtual Machine is EVM-compatible but not identical. Edge cases in opcode behavior may exist.
- **Validator concentration** — TRON uses a Delegated Proof of Stake model with 27 Super Representatives. Validator collusion is theoretically possible.
- **Chain migration** — If BCO needs to migrate to another blockchain in the future, a migration process would need to be developed. BCOToken is immutable and cannot be upgraded to support cross-chain functionality.

## Economic Risk

- **Liquidity risk** — BCO's market price depends on available liquidity. Low liquidity may cause significant price volatility regardless of the forest backing.
- **Price divergence** — The market price of BCO may trade above or below the economic value of 1 m² of forest land. The smart contract enforces the supply-to-area ratio but does not enforce a price floor or ceiling.
- **Buyback dependency** — Deed deactivation requires the company to buy BCO from the market. If BCO price increases significantly, deactivation costs rise proportionally.
- **Staking reward risk** — Reward amounts and periods are determined by the reward manager. There is no guarantee of future reward periods or specific APY.

## Upgrade Risk

- **BCOToken is immutable** — It cannot be upgraded. Token rules are permanent.
- **DeedRegistry and BCOStaking are upgradeable** — UUPS proxy pattern allows implementation changes. While the progressive timelock provides transparency, an upgrade could theoretically change contract behavior.
- **Storage collision** — Despite `__gap[48]` storage gaps and OpenZeppelin namespaced storage (ERC-7201), incorrectly written upgrade implementations could cause storage collision.
- **State migration** — Complex upgrades may require state migration logic. Bugs in migration code could corrupt protocol state.

## Regulatory Risk

- **Token classification** — Regulatory classification of asset-backed tokens varies by jurisdiction. BCO may be classified as a security, commodity, or other regulated instrument in some jurisdictions.
- **RWA regulations** — Real-world asset tokenization is subject to evolving regulations. Future regulatory requirements may affect the protocol's operations.
- **Cross-border compliance** — BCO is accessible globally on TRON. Different jurisdictions may impose different requirements on token holders or the issuing entity.

## Disclaimer

This risk disclosure is not exhaustive. New risks may emerge as the protocol evolves, the regulatory landscape changes, or new attack vectors are discovered. Users should conduct their own due diligence before interacting with the protocol.

BCO tokens are not investment advice. Past performance does not guarantee future results. Only interact with the protocol with funds you can afford to lose.
