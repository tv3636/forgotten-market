import InfoPageLayout from "../components/InfoPageLayout";
import { ResponsiveImg } from "../components/ResponsivePixelImg";

<InfoPageLayout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs" headerImgUrl={"/static/img/header.png"}>

# カルトへようこそ

## Wizard について

Wizard のカルトは共同で紡がれた幾多の伝説であり、そこには 1 万の唯一無二の Wizard NTF が存在しています。

NFT の所有者は、Wizard の所有者とみなされ、その Wizard の _画像_ だけでなく、その _キャラクター_ も所有しています。

Wizards 達は自分のキャラクターの[物語やアニメーション、アートワーク、ポエム、歌](/posts/commissions)を作成し、一緒に世界を築き上げていきます。

各 Wizard の画像は 50x50 ピクセルで、それが 400x400 に拡大されています。そしてそれぞれの Wizard は、独自の名前と特徴（traits）の組み合わせを持っています。しかし、Wizard のキャラクターは、そのピクセル以上のものなのです。ぜひ[私たちのコミュニティ](https://discord.gg/forgottenrunes)に来て、それを確認してみてください。

## Wizard の取得

召喚の儀式は 2021 年 6 月 30 日、[Ethereum ブロック 12736300](https://etherscan.io/block/countdown/12736300)に始まりました. Wizard NFT はオンチェーンに全てエンコードされています。

現在、Wizard を入手するにはセカンダリーマーケット([OpenSea](https://opensea.io/collection/forgottenruneswizardscult))を利用するしかありません

## 来歴: フルオンチェーンエンコーディング

ほとんどの NFT プロジェクトでは、IPFS 上に画像を保存し、NFT の所有者はその画像への参照を持っているだけです。しかし、私たちはそうではありません。

我々の Wizard 達は全てがオンチェーンにエンコードされて保存されています。Wizard の画像のとデータの来歴は完全に Ethereum ブロックチェーン内に記録され、私たちの[カスタムコントラクト](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42)に紐付けられています。
これは Wizard の所有権だけでなくその画像自身もが全てオンチェーンにエンコーディングされていることを意味します。

このフルオンチェーンという特徴により、Wizard 達は[0xmons](https://0xmons.xyz/)や[Mooncats](https://mooncatrescue.com/)を含むオンチェーン NFT という小さなコホートに入ります。

要するに、あなたの Wizard は 100%分散化されており、Ethereum ブロックチェーン上で永遠に生き続けるのです。

## 世界と伝承

<ResponsiveImg className="full-bleed" src="/static/img/map/map.png" />

Forgotten Runes の Wizard を所有することは、*character*を受け入れることと同義です。Wizard 達は自分の物語を伝えるため伝承(Lore)を作成します。

その Wizard 達のための伝承は、近々作成される Book of Lore (2021 年 9 月予定)にオンチェーンで不変的に保存することが可能です。

> 誰かに自分のための伝承を作ってもらいたい、もしくは他の人のために伝承を作ってあげたいという方は、[こちらのコミッションページをご覧ください](/posts/commissions)。

ここでは、この精神に基づいてコミュニティが作成したアートワークの例をいくつかご紹介します。

## Magus Devon of The Quantum Downs ([#6001](https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/6001))

[Source Tweet](https://twitter.com/magusdevon/status/1413215538046701574?s=21)

<ResponsiveImg className="full-bleed" src="/static/img/wtf/magus-6001.png" />

## Enchanter Orbus of the Road ([#8664](https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/8664))

[Source Tweet](https://twitter.com/EnchanterOrbus/status/1422362480383193091)

<ResponsiveImg
  className="full-bleed"
  src="/static/img/wtf/enchanter-orbus-8664.png"
/>

## Story with Pyromancer Tengu of the Wold ([#3193](https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/3193)) and Spellsinger Rumpleskin of Avalon ([#6148](https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/6148))

[_Full story in Tweets_](https://twitter.com/forgottenrunes/status/1429813751922913280)

<ResponsiveImg
  className="full-bleed"
  src="/static/img/wtf/story-thread-3193-6148.png"
/>

## 我々のチーム

我々のチームは[ElfJTrul](https://twitter.com/ElfJTrul)、[Dotta](https://twitter.com/dotta)、そして[Bearsnake](https://twitter.com/bearsnake).

Elf はカリフォルニア州ロサンゼルスを拠点とするアーティストで、ディズニーやニコロデオンといったスタジオで 10 年以上にわたり、エンターテインメント業界で活躍しています。

Dotta は 2018 年 4 月に、最初期の ERC721 コントラクトの 1 つである[Dotlicence](https://etherscan.io/address/0xb5da84cdc928765c15a8192bf3c6649e7802772b)をデプロイしました。

アートそしてコード、どちらも私たちの手によるものです。

## ロードマップ

より詳細な情報については[このページのロードマップを参照してください](/roadmap)

# Q: オンチェーンエンコーディングについて詳しく教えてください

他の多くの NFT プロジェクトとは異なり、Forgotten Rune の Wizard 達は全てオンチェーンにエンコードされています。つまり、これは Wizard 達が外部のセントラライズされたホスティングサービスに依存せずに存在しているということです。

召喚の儀式の開始前に Wizard の属性を漏らしたくないため、オンチェーンデータからウィザードを生成するための Decoding Ring（スクリプト）は、召喚の儀式の開始から 96 時間後に Github で公開します。

技術系の方はお気づきかもしれませんが、私たちは画像やデータのミラーを IPFS やセントラライズされたサービスでホストしています。これはあくまでもミラーであり、OpenSea のようなツールの利便性のためにのみ使われ、Wizards の来歴や永続性のために必要なものではありません

# Q: 商用権について詳しく教えてください

Forgotten Runes は、Wizard NFT の所有者に対し、その NFT に含まれる画像の非独占的な商用権を付与します。ただし、商業的な権利は、複雑で微妙な問題であり、地域的な問題でもあります。この権利の詳細については、2021 年 9 月に発表する予定です。

# Q: Wizard 達についてもっと知りたいのですが

ぜひ私たちの[ブログ](/posts)で[コミッションの作ってもらい方](/posts/commissions)、 [ロードマップ](/posts/roadmap)、 [壁画の探し方](/posts/murals)、などなどを学んでみてください。

# Special Thanks

ベータテスターの皆様、プロジェクトの初期段階でフィードバックをいただいた皆様に感謝いたします。特に、このプロジェクトを進めるにあたって、ご指導ならびに技術的なフィードバックをいただいた[Owen (0xmons)](https://twitter.com/0xmons)に深く感謝しています。

# Resources

- [Forgotten Runes Minting Website](https://forgottenrunes.com)
- [OpenSea](https://opensea.io/collection/forgottenruneswizardscult)
- [Twitter](https://twitter.com/forgottenrunes)
- [Discord](https://discord.com/invite/F7WbxwJuZC)
- [Forgotten Runes Contract on Etherscan](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42)

</InfoPageLayout>
