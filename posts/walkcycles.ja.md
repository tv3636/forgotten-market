---
title: メタバースに対応したForgotten Runes Wizardのウォークサイクル
description: 新しいウォークサイクルのスプライトシートを使って、10,000のForgotten RunesのWizardsと一緒に歩いてみましょう
ogImage: https://i.imgur.com/6pSQbuE.png
index: 18
---

[Forgotten Runes Wizard](https://www.forgottenrunes.com/gallery) NFTを所有することは、50x50ピクセルの画像だけでなく、そのWizardのキャラクター自体を所有することを意味します。そして今、そのキャラクターにピクセルアートのメタバースにおいて命を吹き込むことができるようになりました。

![](https://i.imgur.com/rVZDiLp.gif)

本日、私たちは10,000のWizardそれぞれに対して専用のウォークサイクルのスプライトシートをリリースします。
また、オープンなAPIも作成したため、**APIをサポートする全てのメタバースやゲーム**にWizardが存在できるようになります。

> 開発者の方は、ぜひこの記事を最後までお読みいただき、スプライトをゲームへ組み込む方法についてご確認ください。

## ウォークサイクルの使い方

### WORLDWIDE WEBBのメタバース

<ResponsiveImg src="https://i.imgur.com/hwIlXYT.jpg" pixelArt={true} />

Forgutten RunesのWizardは既に[WORLDWIDE WEBBのメタバース](https://worldwideweb3.com/)で利用可能です。

### Book of Loreからのダウンロード

Wizardを使った二次創作に興味がある場合、[Book of Lore](https://www.forgottenrunes.com/lore/wizards/0/0)のダウンロードリンクをクリックすることで、ウォークサイクルの個別フレームをダウンロードすることができます。
Wizardに付属するグッズについては[こちらの記事をご参照ください](https://www.forgottenrunes.com/ja/posts/goodies)。

### ウォークサイクルボット

コミュニティメンバーの[SorcererIlyas "spz"](https://twitter.com/SorcererIlyas)によって、あなたのWizardが歩いている様子をアニメーションGIFで表示するDiscordボットが開発されました。使い方は簡単で

`!walk :wizardId`コマンドをForgotten RunesのDiscordで発行するだけです。

![](https://i.imgur.com/RTAoGjH.gif)

## "スプライトシート"とは？

スプライトシートとは、キャラクターのアニメーションを描いた一連の画像のことです。キャラクターが前後左右に歩く場合、それぞれの方向のアニメーションフレームが必要です。例えばこれは[Wild Mage Lumos of the Hollow](https://www.forgottenrunes.com/lore/wizards/44/0)のスプライトシートになります。

<ResponsiveImg src="https://i.imgur.com/53yc2OR.png" pixelArt={true} />

いくつか重複するフレームはありますが、単純な歩行を表現するために多くの画像が必要なことがわかるでしょう。

私たちはこのウォークサイクルの画像を**10,000のWinzard全て**に対して作成しました。

## API

もしあなたが開発者で、これらのスプライトをあなたのアプリやゲームに統合したい場合、以下のURLを通して画像を取得ことができます。

`https://www.forgottenrunes.com/api/art/wizards/:wizardId/spritesheet.png`

URL内の`:wizardId`を欲しいウィザードのIDに置き換えてください。例えば、[Wild Mage Lumos of the Hollow (#44)のスプライトシート](https://www.forgottenrunes.com/api/art/wizards/44/spritesheet.png)は以下のURLから取得することができます。

`https://www.forgottenrunes.com/api/art/wizards/44/spritesheet.png`


ウォークサイクルの各フレームの位置を指定したJSONファイルが必要な場合は、以下のURLファイルから取得することができます。

`https://www.forgottenrunes.com/api/art/wizards/:wizardId/spritesheet.json`

繰り返しになりますが、[Wild Mage Lumos of the Hollow (#44)のスプライトシートのメタデータ](https://www.forgottenrunes.com/api/art/wizards/44/spritesheet.json)は以下のURLから取得することができます。

`https://www.forgottenrunes.com/api/art/wizards/44/spritesheet.json`

このJSONファイルのフォーマットは、[Asesprite](https://www.aseprite.org/docs/sprite-sheet/)形式のスプライトシートです。これは、[Phaser](https://phaser.io/examples)のようなJavaScriptのゲームフレームワークでサポートされている一般的なフォーマットです。

## Phaserを使ったデモゲーム

開発者の方向けに、Phaserゲーム内でのスプライトシートの使い方の例をご紹介します（このゲーム内で使われているアセットはForgotten Runesのものではなく、[Tuxemon](https://github.com/Tuxemon/Tuxemon)のストックアセットであることにご注意ください）。


<Codepen hash="YzxJwjP" user="cryppadotta" height="735" defaultTab="result" preview="false" className="full-bleed" />

[ソースコード](https://codepen.io/cryppadotta/pen/YzxJwjP?editors=0011)はこちらでご確認いただけます。

また、[こちらをクリック](https://codepen.io/cryppadotta/full/YzxJwjP?wizard=44)してお持ちのWizardを使って試してみることもできます。URLパラメータ`wizard`のIDを変更してみてください。

## Q & A

Q: [Forgotten Souls](https://www.forgottenrunes.com/posts/forgotten-souls-collectors-guide)のウォークサイクルはありますか？

A: まだありませんが、今後作成される予定です。

## 謝辞

これはElfと協力してくれたアーティストのWizard達の多大なる努力の賜物です。

特に**全てのWizard**の頭と初版のターンアラウンドを作成したElfには大きな賞賛を送りたいと思います。

また、以下の皆さんからも画像を提供してもらいました:

- [Ozz](https://twitter.com/ozzzmabro)
- [Tadmajor](https://twitter.com/Tadmajor)
- [Good Boy Good Time](https://twitter.com/goodboygoodtime)
- [Young Wizzie](https://twitter.com/youngwhizzie)

ご協力に心から感謝します。

## まとめ

ウォークサイクルのスプライトシートによって、Forgotten RunesのWizard達はどんな2Dメタバースにも存在できるようになりました。しかし、これはWizard達をメタバースに対応させるための最初のステップに過ぎません。

さぁ、スプライトシートを手に入れ、ゲームやアニメーションを作り、メタバースで会いましょう。
