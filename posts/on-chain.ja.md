---
title: "Forgotten Runes Wizard's Cultのオンチェーンエンコーディングについて"
description: 10,000のWizardの画像、名前、その他の情報は、ブロックチェーン上のデータから完全に再現されます。この記事では、なぜそれが重要なのか、どのように機能するのか、どのようにしてNFTを未来永劫取得可能にするのかについて説明します。
ogWizardImage: 9999
---

# 来歴: フルオンチェーンエンコーディング

我々のWizardは、ブロックチェーン上に完全にエンコードされています。これにはWizardの画像のピクセル、名前、特性などが含まれています。その結果として、コレクション全体が完全に再生性可能なオンチェーンデータとなっています。

ほとんどのNFTプロジェクトでは、IPFS上に画像を保存しており、NFTのオーナーはその画像へのポインタを保持しているだけです。その結果、それらのプロジェクトでは、画像が誰にもホストされなくなった時点で、NFTからその画像は消えてしまいます。しかし、私たちのWizardはそうではありません。

Wizardの画像とデータは全て私たちの[カスタムコントラクト](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42)に添付される形でイーサリアムのブロックチェーンに記録されています。
これはWizardの所有権とその画像自体が完全にオンチェーンであるということを意味しています。

そしてそれは、Wizardが外部のホスティングサービスに依存せずに存在していると言い換えることもできます。つまり、あなたのWizardは完全に分散された形でイーサリアムのブロックチェーン上に永遠に存在し続けるのです。

この記事は、Wizardのエンコーディングがどのように行われているのか、また、ブロックチェーン上のデータからNFTをどのように取り出すのかを理解したい技術者のためのものです。

## tl;dr 任意のWizardを再作成する方法

ブロックチェーン上のデータからWizardを再作成したい場合は、以下のコマンドを実行してください。

```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x0b8eb29d7a592023b5330fd9a93299bca2a9604aaa2494c87333fc56da50ec9e"],"id":67}' https://cloudflare-eth.com/ | jq -r '.result.input' | cut -c 139- | xxd --plain --reverse | head -n 297 > decoder.ts
npm init -y
npm install ethers@5.0.26 yargs@16.1.0 chalk@4.1.0 ora@5.3.0 ts-node@9.0.0 typescript@4.0.5 bson@4.4.0 sharp@0.28.3 parse-numeric-range@1.2.0 mkdirp@1.0.4 @types/yargs @types/node
./node_modules/.bin/ts-node ./decoder.ts --wizards "0-9,13,123"
```

実行すると以下のようになるでしょう:

<video controls width="100%" height="auto">
  <source src="https://nftz.forgottenrunes.com/website/cdn/wizard-decoding.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## ストレージの仕組み - トランザクションコールデータ

一般的に、スマートコントラクトにデータを保存する場合、そのデータは高価なものになります。データを保存する典型的な方法は `SSTORE` を使用することです。これは他のスマートコントラクトがアクセス可能な形でデータを保存することができますが、反面、スマートコントラクトで使用できる最も高価な操作の一つでもあります。

Wizardsでは、データをトランザクションのコールデータに詰めるという「トリック」を使っています。すべてのトランザクションは[その引数を永続化しなければならない](https://ethresear.ch/t/clarification-on-how-calldata-persists-on-the-blockchain-and-how-optimistic-rollups-use-it/8136/5)という仕様があるため、トランザクションの引数を `SSTORE` よりもはるかに安価なストレージとして使うことができます。

## `tokenURI`と`uploadWizardsImage`の調査

WizardはERC721標準に準拠したトークンです。これはトークンが `tokenURI` というメソッドを持っていることを意味しており、私たちの [コントラクト](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42#readContract)でも見つけることができます。

あなたがこのメソッドを実行すると、IPFSのURLが表示されるため、"待って、Wizardはブロックチェーン上に保存されていると言ったよね？"と思うかもしれません。もちろんWizardデータはブロックチェーン上に保存されていますが、Wizardは利便性とOpenSeaのようなオフチェーンのツールとの相互運用性のために、IPFSのURLをミラーとして使用しています。もう少し詳しく説明しましょう。

あなたが[コード](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42#code)を調べると、以下の2つのメソッドがあることがわかるでしょう。

- `uploadWizardsImage(bytes calldata s)`
- `uploadWizardsAttributes(bytes calldata s)`

しかし、関数の実装は空です。これは、コントラクト内のストレージではなく、トランザクションのコールデータの永続性を利用しているからです。

## Wizardのエンコーディング

画像と特性の保存にコールデータを使用していますが、10,000枚の画像すべてを個別にアップロードするわけではありません。ウィザードは各パーツから構成されているので、341個のパーツを1つの画像にエンコードし、その画像を、それをデコードするためのWizardの属性情報と共にアップロードしています。

そのコードは[デコーダークリスタル](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0)の中で見つけることができます。

また、このコレクションでは、**約180色の限られたパレットのみを使用しています**。この限られた色数のおかげで、_png32_（1ピクセルあたり32ビット）ではなく、_png8_（1ピクセルあたり8ビット）を使用して、画像を16進数にエンコードすることができています。これにより、Wizardの全コレクションの画像を1つのトランザクションに収めることができるのです。

Traits(特徴)については、[BSON](https://bsonspec.org/)というエンコーディング方式を使用しています。詳細はブロックチェーン上に格納されたコード内で見つけることができ、前述のコマンドを使用することで、それを確認することができます。

## トレードオフ

## IPFSミラーの利用

私たちは画像とデータのミラーをIPFSとホスティングサービス上のサーバーでホストしています。これはあくまでもミラーであり、OpenSeaのようなツールの利便性のためのもので、Wizardsの再生成や永続性のための要件ではありません。

改善策として、`<svg>`タグをSolidity内でレンダリングすることが考えられるでしょう。ただ、現在のアプローチはIPFSの使いやすさとブロックチェーンの耐久性の両方を実現することができる、という利点もあります。

## Trait(特徴)の合成可能性

この方法の最大の欠点は、データはブロックチェーンから読み込み可能ではあるものの、SSTOREには入っていないため、**他のスマートコントラクトから読みだすことができない**ということでしょう。これは、コレクティブNFTの永続性のためには大きな問題ではありませんが、ゲームのような他のスマートコントラクトでWizardのTrait(特性)を利用したい場合には、個々のTraitをオンチェーンで自由に読めるようにする必要があるでしょう。

ありがたいことに、コミュニティのメンバーがすでに[The Lost Grimoire](https://github.com/aleb-user/LostGrimoire)でこのためのコードを書いてくれています。[Rinkeby](https://rinkeby.etherscan.io/address/0xe5a0b43035f0cf0b577d176ffc9a3ff307205af3#readContract)

## トランザクション

<img src="https://nftz.forgottenrunes.com/website/cdn/decoder-crystal.gif" width="400" height="400" style={{"margin": "0 auto"}}/>

データの保存に使われたトランザクションは、以下のハッシュで確認できます：

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

このデータ自体も[デコーダークリスタル](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0)に格納されています。

## その他のリソース

- [デコーダークリスタル](https://opensea.io/assets/0x2d00d68bf8bc14d139b4dcea5fb7ce0a42e09c86/0)
- [デコーダーのGithub Gist](https://gist.github.com/cryppadotta/375dee1903598f5163e2c1d7d3ce9db9)
- [0xmons v2 Cthulhu: オンチェーンエンコーディング](https://blog.0xmons.xyz/79081566310)
- [WizardのデコーディングについてのMagneticB'sの記事](https://magneticb.github.io/blog/wizards-decoding)
- [コールデータの永続性についての明確化](https://ethresear.ch/t/clarification-on-how-calldata-persists-on-the-blockchain-and-how-optimistic-rollups-use-it/8136/5)
