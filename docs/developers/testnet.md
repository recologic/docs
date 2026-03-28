---
sidebar_position: 3
title: Testnet
---

# Testnet (TRON Nile)

BCO Protocol contracts are deployed on the TRON Nile testnet for development and integration testing.

## Contract Addresses

| Contract | Nile Testnet Address | Type |
|----------|---------------------|------|
| BCOToken | TBD | Immutable |
| DeedRegistry | TBD | UUPS Proxy |
| BCOStaking | TBD | UUPS Proxy |
| TimelockController | TBD | Immutable |

## Connecting to Nile

### TronLink Wallet

1. Open TronLink browser extension
2. Click the network selector (top right)
3. Select **Nile Testnet**
4. Your wallet address is the same across networks

### TronWeb Configuration

```javascript
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': 'your-api-key' },
  privateKey: 'your-private-key'
});
```

### Hardhat Configuration

```typescript
// hardhat.config.ts
networks: {
  nile: {
    url: 'https://nile.trongrid.io/jsonrpc',
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
  }
}
```

## Getting Test TRX

Test TRX for the Nile network can be obtained from the official TRON faucet:

1. Visit the [Nile Faucet](https://nileex.io/join/getJoinPage)
2. Enter your TRON wallet address
3. Complete the verification
4. Receive test TRX (usually 10,000 TRX)

## Differences from Mainnet

| Parameter | Nile Testnet | Mainnet |
|-----------|-------------|---------|
| Network ID | Nile | Mainnet |
| TRX | Test tokens (no value) | Real tokens |
| Block time | ~3 seconds | ~3 seconds |
| Explorer | nile.tronscan.org | tronscan.io |
| API endpoint | nile.trongrid.io | api.trongrid.io |
| Admin transfer delay | Shorter (for testing) | 48 hours |
| Timelock delay | Shorter (for testing) | 72 hours |

## Testing Workflow

```
1. Get test TRX from faucet
2. Connect to Nile in TronLink
3. Interact with testnet contracts
4. Verify behavior matches documentation
5. Deploy to mainnet when ready
```

All contract functions, events, and errors behave identically on testnet and mainnet. The only differences are configuration parameters (delays, limits) which may be set to shorter values on testnet for faster testing cycles.
