---
sidebar_position: 4
title: Code Examples
---

# Code Examples

Runnable examples for common BCO Protocol operations using TronWeb.

## Verify the Invariant

Check that every BCO in circulation is backed by forest land:

```javascript
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': 'your-api-key' }
});

const DEED_REGISTRY = 'TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1';
const BCO_TOKEN = 'TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p';

async function verifyInvariant() {
  const registry = await tronWeb.contract().at(DEED_REGISTRY);
  const token = await tronWeb.contract().at(BCO_TOKEN);

  const isValid = await registry.verifyInvariant().call();
  const totalSupply = await token.totalSupply().call();
  const totalArea = await registry.totalActiveArea().call();

  console.log('Invariant valid:', isValid);
  console.log('Total supply:', tronWeb.fromSun(totalSupply), 'BCO');
  console.log('Total area:', totalArea.toString(), 'm²');
}

verifyInvariant();
```

## Look Up a Deed

Retrieve deed details by ID:

```javascript
async function getDeedInfo(deedId) {
  const registry = await tronWeb.contract().at(DEED_REGISTRY);
  const deed = await registry.getDeed(deedId).call();

  console.log('Deed ID:', deed.id);
  console.log('Area:', deed.areaM2.toString(), 'm²');
  console.log('Geolocation:', deed.geolocation);
  console.log('Document hash:', deed.documentHash);
  console.log('Status:', deed.status === 0 ? 'ACTIVE' : 'DEACTIVATED');
  console.log('Registered at:', new Date(deed.registeredAt * 1000));
}
```

## Verify a Document

Check if a document hash matches a registered deed:

```javascript
async function verifyDocument(deedId, documentHash) {
  const registry = await tronWeb.contract().at(DEED_REGISTRY);
  const result = await registry.verifyDocument(deedId, documentHash).call();

  console.log('Document valid:', result.isValid);
  console.log('Deed area:', result.deed.areaM2.toString(), 'm²');
}
```

## Stake BCO

Complete staking lifecycle — approve, deposit, check rewards, claim, withdraw:

```javascript
const BCO_STAKING = 'TLXMq6XnwCyS9z3B8tbuNA82JJfjUnDNFe';

async function stakeExample() {
  const token = await tronWeb.contract().at(BCO_TOKEN);
  const staking = await tronWeb.contract().at(BCO_STAKING);

  const amount = tronWeb.toSun('1000'); // 1,000 BCO
  const lockDuration = 30 * 24 * 60 * 60; // 30 days in seconds

  // Step 1: Approve staking contract to spend BCO
  await token.approve(BCO_STAKING, amount).send();
  console.log('Approved');

  // Step 2: Deposit with lock period
  await staking.deposit(amount, lockDuration).send();
  console.log('Deposited 1,000 BCO with 30-day lock');

  // Step 3: Check earned rewards (call anytime)
  const earned = await staking.earned(tronWeb.defaultAddress.base58).call();
  console.log('Earned:', tronWeb.fromSun(earned), 'BCO');

  // Step 4: Claim rewards without withdrawing
  await staking.claimRewards().send();
  console.log('Rewards claimed');

  // Step 5: Withdraw after lock expires
  // await staking.withdraw(amount).send();
  // console.log('Withdrawn');
}
```

## Check Staking Info

```javascript
async function stakingInfo() {
  const staking = await tronWeb.contract().at(BCO_STAKING);

  const totalStaked = await staking.totalStaked().call();
  const rewardRate = await staking.rewardRate().call();
  const periodFinish = await staking.periodFinish().call();
  const duration = await staking.rewardDuration().call();

  console.log('Total staked:', tronWeb.fromSun(totalStaked), 'BCO');
  console.log('Reward rate:', tronWeb.fromSun(rewardRate), 'BCO/second');
  console.log('Period ends:', new Date(periodFinish * 1000));
  console.log('Duration:', duration / 86400, 'days');

  // Calculate approximate APY
  if (totalStaked > 0) {
    const annualReward = rewardRate * 365 * 86400;
    const apy = (annualReward / totalStaked) * 100;
    console.log('Approximate APY:', apy.toFixed(2) + '%');
  }
}
```

## Listen to Deed Events

Subscribe to new deed registrations and deactivations:

```javascript
async function watchDeeds() {
  // Get recent registrations
  const registrations = await tronWeb.getEventResult(
    'TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1',
    {
      eventName: 'DeedRegistered',
      sinceTimestamp: Date.now() - 86400000, // Last 24 hours
      sort: 'block_timestamp',
      size: 50
    }
  );

  for (const event of registrations) {
    console.log('New deed:', event.result.id);
    console.log('  Area:', event.result.areaM2, 'm²');
    console.log('  Location:', event.result.geolocation);
    console.log('  Tokens minted:', tronWeb.fromSun(event.result.tokensMinted), 'BCO');
  }

  // Get recent deactivations
  const deactivations = await tronWeb.getEventResult(
    'TPw2dKZcVwqCKDNCQbEwRory1xKqj6zSj1',
    {
      eventName: 'DeedDeactivated',
      sinceTimestamp: Date.now() - 86400000,
      sort: 'block_timestamp',
      size: 50
    }
  );

  for (const event of deactivations) {
    console.log('Deactivated:', event.result.id);
    console.log('  Reason:', event.result.reason);
    console.log('  Tokens burned:', tronWeb.fromSun(event.result.tokensBurned), 'BCO');
  }
}
```

## Use Permit (Gasless Approval)

EIP-2612 permit allows approval via signature without a separate transaction:

```javascript
const { ethers } = require('ethers');

async function permitExample() {
  const wallet = new ethers.Wallet('your-private-key');
  const spender = BCO_STAKING;
  const value = ethers.parseEther('1000');
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  // Get nonce from contract
  const token = await tronWeb.contract().at(BCO_TOKEN);
  const nonces = await token.nonces(wallet.address).call();

  // Build EIP-712 domain
  const domain = {
    name: 'Biocoin',
    version: '1',
    chainId: 728126428, // TRON mainnet chain ID
    verifyingContract: BCO_TOKEN
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  };

  const message = {
    owner: wallet.address,
    spender: spender,
    value: value,
    nonce: nonces,
    deadline: deadline
  };

  // Sign the permit
  const signature = await wallet.signTypedData(domain, types, message);
  const { v, r, s } = ethers.Signature.from(signature);

  // Submit permit (can be called by anyone — gasless for the token holder)
  await token.permit(wallet.address, spender, value, deadline, v, r, s).send();
  console.log('Permit submitted — approval granted without token holder paying gas');
}
```

## Browse All Deeds (Paginated)

```javascript
async function browseDeeds() {
  const registry = await tronWeb.contract().at(DEED_REGISTRY);
  const totalDeeds = await registry.totalDeedCount().call();
  const pageSize = 10;

  console.log('Total deeds:', totalDeeds.toString());

  for (let offset = 0; offset < totalDeeds; offset += pageSize) {
    const ids = await registry.getDeedIds(offset, pageSize).call();

    for (const id of ids) {
      const deed = await registry.getDeed(id).call();
      console.log(`${id}: ${deed.areaM2} m² [${deed.status === 0 ? 'ACTIVE' : 'DEACTIVATED'}]`);
    }
  }
}
```
