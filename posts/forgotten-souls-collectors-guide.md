---
title: A Collectors Guide to Forgotten Souls
description: "Should I burn my Wizard? This document is a guide to Forgotten Souls for collectors."
ogImage: https://i.imgur.com/hnfqCgs.jpg
index: 15
---

![](https://i.imgur.com/hnfqCgs.jpg)

_Forgotten Souls_ is a collection of NFT-based characters that represent the transmutation of a _Forgotten Runes Wizard_.

The minting is "free" in that there is no fee beyond gas, but the cost is burning a [_Forgotten Runes Wizard's Cult_ NFT](https://opensea.io/collection/forgottenruneswizardscult) along with a [_Sacred Flame_](https://opensea.io/collection/infinityveil).

When a Wizard is passed through the Flame the original tokens are destroyed and a new _Forgotten Soul_ NFT is created.

However, Black Magic is unpredictable and there is a chance you will receive an Undesirable. Read on to understand the _Forgotten Souls_ Collection.

> **This document is an analytical view of _Forgotten Souls_** NFTs from a collectors point of view. If you are unfamiliar with The Great Burning and want an overview, please read: [_The Great Burning, The Sacred Flames, and the Infinity Veil_](https://www.forgottenrunes.com/posts/forgotten-souls)

## Overview

_Forgotten Souls_ are a transmutation of the original Wizard passed through the flame. There are 3 possible outcomes:

- You receive a Soul that is a transmutation of your specific Wizard
- You receive an Undesirable
- You receive an Ultra Rare

When you burn a Wizard, the Soul is significantly influenced by the Wizard's original traits.

The odds of receiving an Undesirable are about 1 in 10.

## The Sacred Flames

![Sacred Flame](https://nfts.forgottenrunes.com/ipfs/QmWG5jc3spgFGPfiX3Rd4YLNSxDjXRSxeBQsS9TytVL1YD)

The Sacred Flames were [airdropped for free on October 1st, 2021](https://etherscan.io/tx/0x7307bf0e38abc8ae7b8322dbb20f6a389cec8b01e43c18fb2dbe78b0ab295132) to the first 101 Wizards who wrote in [The Book of Lore](https://www.forgottenrunes.com/lore) and the earliest Wizard holders. You can read more about their distribution in [this post](https://www.forgottenrunes.com/posts/forgotten-souls).

## How it Works

A Soul is "minted" when a Wizard is burned.

**The Wizard NFT will be destroyed, the Flame NFT will be destroyed, and a new Soul NFT will be returned.**

The Soul returned to you is not completely random in that you are receiving a _transmutation_ of your Wizard, in most (9 out of 10) cases.

Q: If I burn, is there a chance I receive nothing?

A: You will always receive an ERC-721 token in return. (Whether or not you find that desirable is another matter.)

Q: Is my Soul affected by the Wizard that I burn?

A: Usually the Soul you receive will be a transmutation of your Wizard. However, In some cases you may receive an Undesirable. In some cases, an Ultra Rare.

## Collection Stats

There is a max supply of 1112 _Forgotten Souls_. This cap is both set by [the smart contract](https://etherscan.io/address/0x251b5F14A825C537ff788604eA1b58e49b70726f#readContract) and the fact that a _Sacred Flame_ is required to burn and only 1112 _Sacred Flames_ exist.

Similar to Forgotten Runes Wizards, there are 6 traits: background, body, head, familiar, prop, and rune.

Also similar to Wizards, Souls traits combine according to the Soul's _affinity_ which is a measure of cohesiveness of the traits.

For comparison, the _Forgotten Runes Wizards_ had:

- about 80 bodies and
- about 120 heads

_Forgotten Souls_ has:

- about 70 bodies and
- about 80 heads

While there are fewer heads in Souls, the collection is also about 1/10th of the size of Wizards.

## Rarity Mechanics

Determining the final rarity of your Soul is impossible to know until the final Sacred Flame has been used.

The rarity of your Soul depends on what your fellow Wizards choose to burn.

Q: If I have pass a rare Wizard through the flame, will I receive a rare Soul?

A: This question cannot be answered

Q: Will my Soul keep the Affinity of my Wizard? (E.g. if I have a "5/5 affinity" Wizard, will I have a "5/5 affinity" Soul?)

A: No. The affinities are near-completely transmuted and the affects of the Flame will not leave affinity untouched.

Q: If I pass a "rare" Wizard through the flame, will I receive a "rare" Soul in return?

A: You will receive a transmutation of your Wizard in most cases, but no Wizard is unaffected by the flame.

## NFT Metadata & On-chain Data

The Forgotten Runes Wizards are [completely encoded on-chain](https://www.forgottenrunes.com/posts/on-chain), _eventually_ Souls will be - **however not at first**.

> This section is a bit technical and mostly of concern to collectors who care about the on-chain encoding of the complete NFT. Feel free to skip this section if that isn't you.

The persistence of _Forgotten Souls_ NFT data will happen in 3 layers:

- Centralized Mint Server - Controlled by [@dotta](https://twitter.com/dotta)
- IPFS Checkpointing
- Full on-chain archiving

Let's discuss why.

### The problem

We want to provide an experience for Souls that is:

- fair to all participants
- does not allow cheating by bots or technical users
- immediate reveal
- as cheap as possible

With Wizards, we were able to put all data on chain after the mint because the entire collection was minted in 28 minutes.

With Souls, **the entire collection may take years** or longer before all Flames are used. Given that 1112 Wizards will be burned - and we can't predict which 1112 ahead of time -- we have to store on-chain in batches.

Obviously we don't want the entire collection to suffer in it's decentralization because some Flames have not been used. Our solution is as follows:

### Centralized mint server

For an initial burn, we use a centralized mint server. This gives us bot-protected because we check that a token was minted before we reveal. This also gives an immediate reveal experience. It's also cheaper than e.g. a Chainlink VRF.

The obvious con here is that there is a centralization aspect which is bad for persistence and requires trust for fairness.

### IPFS Checkpointing

After some Souls have been minted, we will "checkpoint" the collection into IPFS. We've built into the contract the ability to serve the tokens that have been minted from IPFS. [See line 166 here](https://rinkeby.etherscan.io/address/0x95082b505c0752eEf1806aEf2b6b2d55eEa77e4E#code)

IPFS has it's flaws, but it's better than a centralized server for long-term archival.

However for us, that isn't far enough and so:

### Full on-chain archiving

Just like wizards, we will, eventually, put them on chain. Again, the contract is built to support loading the Souls on-chain, in chunks, when enough have been minted and gas is favorable.

### On-chain Summary

So on day one, the on-chain encoding story of Souls is not as strong as Wizards, but we've built an upgrade path to store them on chain in time.

Q: If we are required to trust the a centralized metadata provider, who are we "trusting" exactly?

A: The only two people with access to the pre-reveal metadata are [@dotta](https://twitter.com/dotta) and [Niski](https://twitter.com/niski_iski). The other team members, including Elf etc. do not have access to this data.

## Book of Lore

When you burn a Wizard, a final entry of their burning will be automatically written into the Book of Lore.

Because you are burning the Wizard token **you will no longer be able to write in that Wizard's Lore** -- because you will no longer own that token.

You _will_ however be able to write Lore for your Soul.

\*Eventually. We won't have the Book of Lore working for Souls on October 31st.

## Goodies

Q: Will there be turnarounds & walkcycles & layer downloads of my Souls?

A: Yes, eventually. The layer downloads will come relatively soon, but the walkcycles for Souls will be several months behind Wizards.

Q: Will Souls be used in the upcoming game in the same way that Wizards are?

A: It depends. A pile of dust will not be of much use there.

# Summary

- The Flames were airdropped for free (we paid gas)
- The Burning is free (+gas)
- You may receive an Undesirable
- There is **no time limit** to when you can burn
- Your burning is completely voluntary
- Only you can burn your Wizard

If you're unsure if you should burn your Wizard, you are free to wait (or give your flame to someone else).

But if you cannot be dissuaded, burn, and may the Flame burn favorably on your Soul.
