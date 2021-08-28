# Dev on the Book of Lore

Running The Book of Lore locally is involved. The pieces are:

- An Ethereum chain (Ganache, Rinkeby, etc.)
- The [`ForgottenRunesWizardCult.sol` minting contract](https://github.com/forgottenrunes/forgotten-runes-contracts/blob/master/contracts/ForgottenRunesWizardsCult.sol) deployed and configured
- Your account minting and/or holding `ForgottenRunesWizardCult` ERC721s
- The [`BookOfLore.sol` contract](https://github.com/forgottenrunes/forgotten-runes-contracts/blob/master/contracts/BookOfLore.sol) deployed and configured
- A [Graph Protocol](https://thegraph.com/docs/developer/quick-start) local development node

## Docs for Graph Protocol

- [graph-node/getting-started.md](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md)
- [graph-node/docker](https://github.com/graphprotocol/graph-node/tree/master/docker)
- [graphprotocol/graph-node: Graph Node indexes data from blockchains such as Ethereum and serves it over GraphQL](https://github.com/graphprotocol/graph-node)

## Docker vs. Running Locally

In theory, running with `docker-compose` should be easier, but I found it's easier to just manually install all of the parts. ymmv.

## Rinkeby

In the `docker-compose.yml`:

```
services:
  graph-node:
    environment:
      ethereum: 'rinkeby:https://rinkeby.infura.io'
```
