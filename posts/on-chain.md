---
title: "On-chain Encoding of Forgotten Runes Wizard's Cult"
description: The 10,000 Wizards pixels, names, and data are fully reproducible from on-chain data. This post explains why it's important, how it works, how to retrieve your NFTs forever.
ogWizardImage: 9999
---

# Provenance: Encoded Fully On-Chain

Our Wizards are fully encoded on-chain. This includes pixels of the image, names, and traits. The result is that the entire collection is completely reproducible rom on-chain data.

Most NFT projects merely store their images on IPFS, and the owners of such NFTs only hold a pointer to that image. The result is that, in these projects, if at any point the images are not hosted by anyone, they will disappear. Not so with us.

The provenance of the Wizard images and data are recorded wholly within the Ethereum blockchain, attached to our [custom contract](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42). Which means ownership of a Wizard, and the image itself, is fully on-chain.

This means that they do not depend on any external or centralized hosting service to exist.

In short, your Wizard is 100% decentralized and will live forever on the Ethereum blockchain.

This post is for the technically minded who wish to understand _how_ this encoding works and how to retrieve the NFTs from on-chain data.

## tl;dr How to Re-create Any Wizard

If you'd like to re-create your Wizard(s) entirely from on-chain data, you can run the following commands:

```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x0b8eb29d7a592023b5330fd9a93299bca2a9604aaa2494c87333fc56da50ec9e"],"id":67}' https://cloudflare-eth.com/ | jq -r '.result.input' | cut -c 139- | xxd --plain --reverse | head -n 297 > decoder.ts
npm init -y
npm install ethers@5.0.26 yargs@16.1.0 chalk@4.1.0 ora@5.3.0 ts-node@9.0.0 typescript@4.0.5 bson@4.4.0 sharp@0.28.3 parse-numeric-range@1.2.0 mkdirp@1.0.4 @types/yargs @types/node
./node_modules/.bin/ts-node ./decoder.ts --wizards "0-9,13,123"
```

It will look like this:

<video controls width="100%" height="auto">
  <source src="https://nftz.forgottenrunes.com/website/cdn/wizard-decoding.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## How the Storage Works - transaction calldata

Typically when you store data in a smart contract, that data is expensive. The typical way of storing data is by using `SSTORE`, which is one of the most expensive operations a smart contract can use because it stores data to be accessible by other smart contracts.

For Wizards, we use a "trick" of packing data into a transaction's calldata. Because all transactions [must have their arguments persisted](https://ethresear.ch/t/clarification-on-how-calldata-persists-on-the-blockchain-and-how-optimistic-rollups-use-it/8136/5) we can use this area for a storage that is much, much cheaper than `SSTORE`

## Investigating `tokenURI` and `uploadWizardsImage`

Wizards are an ERC721 Standard token. That means they have a `tokenURI` method, which you can find on our [contract](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42#readContract).

If you use this method you will see an IPFS URL. "Wait", you might be asking, "you said the Wizards are stored on chain?" That's true, but we use an IPFS URL as a mirror for convenience and interoperability with off-chain tools like OpenSea. Continue reading and we'll explain.

If you inspect the [code](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42#code) you will see that there are two methods:

- `uploadWizardsImage(bytes calldata s)`
- `uploadWizardsAttributes(bytes calldata s)`

But the function implementations are empty! That's because we aren't using the storage _in_ the contract, but rather the _persistence of the transaction calldata_.

## Encoding the Wizards

Even though we're using the calldata for storing the images and traits, we don't upload all 10,000 images individually. Because the Wizards are made up of _parts_, we encode the 341 parts in a single image grid and upload that image, along with a pairing of wizard attributes to decode it.

The code can be found in [the Decoder Crystal](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0).

We also used a **limited palette of about 180 colors** for the entire collection. Because of this limited number of colors are are able to to use _png8_ (8 bits per pixel) instead of _png32_ (32 bits per pixel) and then we hex-encode that image. This allows us to fit the images for the entire collection into a single transaction.

For the traits, we use the [BSON](https://bsonspec.org/) encoding scheme. The details can be found in the code, which also can be found on-chain, by using the commands above.

## Trade-offs

## Use of an IPFS Mirror

We host a mirror of our images and data on IPFS and centralized services. This is only a mirror and is for convenience of tools like OpenSea and not requirement for the provenance or persistence of the Wizards.

An improvement might be to render `<svg>` tags within the Solidity. That said, this approach gives us both the ease-of-use of IPFS and durability of the blockchain

## Trait Composability

Probably the biggest shortcoming of this approach is that the traits, while readable on-chain, are not in SSTORE, which means **they aren't readable by other smart contracts**. While this isn't a big problem for the permanent provenance of a collectable NFT, but if we want to compose the traits with other smart contracts (such as games), we **do** want the individual traits to be readable on-chain.

Thankfully a community member has already written the code for this in [The Lost Grimoire](https://github.com/aleb-user/LostGrimoire). [Rinkeby](https://rinkeby.etherscan.io/address/0xe5a0b43035f0cf0b577d176ffc9a3ff307205af3#readContract)

## Transactions

<img src="https://nftz.forgottenrunes.com/website/cdn/decoder-crystal.gif" width="400" height="400" style={{"margin": "0 auto"}}/>

You can find the transactions used to store this data at the following hashes:

```
img: "0xbb6413bd70bae87b724c30ba9e46224fa63629709e7ccfe60a39cc14aa41013e",
traits: [
  "0x227552b04af7606108d306654c620a655393451742e299e8bfd28236683da2cf",
  "0x529b29d36d07c917cc24bf162d737adc0c8ddc07003f9d5ca59876cf8167bfda",
  "0x8ec128ed9b3f4f92853d8df0ff6a2159963e81f2a611145f60a8d96990439049",
  "0xe6f0b0e76ddbc581ba3a8155ff545b7d5c31a394ac0a54b44aa9ea21525d0d06",
  "0x78a6304221ff044d3adcdb037be10aa843707f2c8241e81b4b2c6fbcb51f8b79",
  "0x74b9d75a174e76981f823d594c2c2fbcaff61e66a76be7977e0cbeb52c28f01f",
  "0x3500861637fce52bef4be39ae935e632881df4a69a47abcca8bbfc9490278dc6",
  "0x96677df7c85535328b16d93acf8cd925b87886ca2198c3654ff8d8cc56236f69",
  "0xa2977bf5ef9864796fe713db9e08f98fbbce129f4280651b6b9782c4ffdf4bd2",
  "0xe9ecc9dd5f0518617afb8593157dde0bc58d5d1e4fdb5f10a3ff8f96a81897dc"
],
affinities: "0x1be4aa782c9dc164ecbf2cd155537e7250b344f405dff03b5c33fdd63261c80e"
```

This data _itself_ is also stored within the [Decoder Crystal](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0).

## Other Resources

- [Decoder Crystal](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0)
- [Github Gist of the Decoder](https://gist.github.com/cryppadotta/375dee1903598f5163e2c1d7d3ce9db9)
- [0xmons v2 Cthulhu: On-chain Encoding](https://blog.0xmons.xyz/79081566310)
- [MagneticB's post on Decoding Wizards](https://magneticb.github.io/blog/wizards-decoding)
- [Clarification on how calldata persists](https://ethresear.ch/t/clarification-on-how-calldata-persists-on-the-blockchain-and-how-optimistic-rollups-use-it/8136/5)
