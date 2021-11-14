---
title: Forgotten Soulsコレクターズガイド
description: "Wizardを燃やすべきか否か? このドキュメントはForgotten Soulsのコレクター向けガイドです。"
ogImage: https://i.imgur.com/hnfqCgs.jpg
---

![](https://i.imgur.com/hnfqCgs.jpg)

_Forgotten Souls_ は _Forgotten Runes Wizards_ が変化したキャラクターについてのNFTコレクションです。

Forgotten Soulのミントはガス代以外がかからないという点では"無料"と言えますが、コストとして[_Forgotten Runes Wizard's Cult_ NFT](https://opensea.io/collection/forgottenruneswizardscult) を [_Sacred Flame_](https://opensea.io/collection/infinityveil) と共に燃やす（Burnする）必要があります。

WizardがFlameの洗礼を受けると、オリジナルのトークンは破棄され、新たな _Forgotten Soul_ NFTが生成されます。

しかし、黒魔術は予測不可能なため、"望まれないもの (Undesirable)" を受け取ってしまう可能性もあります。_Forgotten Souls_ Collectionを理解するためにも、必ず本ドキュメントに目を通してください。
> このドキュメントは _Forgotten Souls_ NFTをコレクターの視点から分析したものです。もし"Great Burning”についてご存知でない場合は、こちらを始めにお読みください: [_Great Burning、Sacred Flames、そして Infinity Veil_](https://www.forgottenrunes.com/ja/posts/forgotten-souls)

## 概要

_Forgotten Soul_ はオリジナルのWizardが聖なる炎をくぐり抜けることで変化したもので、その結果は大まかに三種類に分類されます:

- あなたのWizardが変化したSoulを受け取ります
- "望まれないもの (Undesirable)"を受け取ります
- "ウルトラレア"を受け取ります

Great Burningによって生み出されるSoulは燃やされたWizardの特質(Traits)に大きく影響を受けます。

"望まれないもの (Undesirable)"を受け取る確率は約1/10です。

## The Sacred Flames（聖なる炎）

![Sacred Flame](https://nfts.forgottenrunes.com/ipfs/QmWG5jc3spgFGPfiX3Rd4YLNSxDjXRSxeBQsS9TytVL1YD)

Sacred Flamesは[The Book of Lore](https://www.forgottenrunes.com/lore)を先行して記述した101人のWizardとWizard NFTの保有期間が長いホルダーたちに対して[2021年10月1日に無料でエアドロップされました](https://etherscan.io/tx/0x7307bf0e38abc8ae7b8322dbb20f6a389cec8b01e43c18fb2dbe78b0ab295132)。配布についての詳細は[こちらでご確認ください](https://www.forgottenrunes.com/ja/posts/forgotten-souls)。

## 仕組みについて

SoulはWizardが燃やされることによって生み出されます（ミントされます）。

**つまり、Wizard NFTとFlame NFTが破棄され、新たにSoul NFTが戻されるのです。**

あなたに戻されるSoulはほとんどの場合（約9割）で、あなたのWizardが "変化" した姿になるという点で完全なランダムではありません。

Q: 燃やしたにも関わらず、何も受け取ることができないという可能性はありますか？

A: どのような場合でも必ずERC-721のトークンは返されます（ただしそれが"望ましいもの"かどうかは別の問題ですが）。

Q: 受け取るSoulは私が燃やしたWizardの影響を受けますか？

A: 通常、あなたが受け取るSoulはあなたの燃やしたWizardが変化したものになるでしょう。しかし、場合によっては"望まれないもの (Undesirable)"を受け取るかもしれません。また、時にはウルトラレアが返されることもあるでしょう。

## コレクションの統計情報

Fogotten Soulは最大で1112体生み出されます。この上限は[スマートコントラクト](https://etherscan.io/address/0x251b5F14A825C537ff788604eA1b58e49b70726f#readContract)によって制限されているだけでなく、燃やすのに必要な _Sacred Flame_ が1112個しか存在しないことにも影響を受けています。

Forgotten Runes Wizardと同様に、Soulにもバックグラウンド、ボディ、ヘッド、使い魔、小道具、そしてルーンの6種類のTraitsが存在します。

そしてWizardと同じように、SoulのTraitsもそのまとまり具合を示す _affinity_ (親和性)に応じて組み合わされます。

二つのコレクションを比較すると、_Forgotten Runes Wizards_は:

- 約80のボディと
- 約120のヘッド

_Forgotten Souls_ は:

- 約70のボディと
- 約80のヘッド

を持ちます。

Soulsのヘッドの数はWizardsよりも少なくなっていますが、Soulsのコレクションサイズ自体もWizardsのコレクションサイズの約1/10となっています。

## レアリティの仕組み

最後のSacred Flameが使用されるまでSoulのレアリティを決定することはできません。

あなたのSoulのレアリティは仲間のWizardが何を燃やしたかに依存します。

Q: もしレアWizardを燃やした場合、レアなSoulを受け取ることができますか？

A: その質問には答えることができません。

Q: 得られるSoulは燃やしたWizardのAffinityを維持しますか？（例：5/5 affinityのWizardを燃やすと5/5 affinityのSoulが戻される）

A: いいえ。Affinityはほぼ完全に変化し、Flameの影響を受けないAffinityが残ることはないでしょう。

Q: 私がレアなWizardを炎に晒した場合、レアなSoulを受け取ることができますか？

A: ほとんどの場合、あなたのWizardが変化したものを受け取るでしょう。しかし、炎の影響を受けないWizardは存在しません。

## NFTのメタデータとオンチェーンデータ

Forgotten RunesのWizardは[完全にブロックチェーン上にエンコードされており](https://www.forgottenrunes.com/posts/on-chain)、Soulもいずれそうなります - **しかし最初は違います**.

> このセクションは少し専門的で、主にNFTのオンチェーンエンコーディングに関心のあるコレクターのためのものです。ご興味のない方は、このセクションを読み飛ばしてください。

_Forgotten Souls_ NFTのデータは3層に分かれて保存されます:
- [@dotta](https://twitter.com/dotta)によって管理されるミントサーバーでの保存
- IPFSでの保存
- 完全なブロックチェーン上での保存

その理由を説明しましょう。

### 問題点

私たちはSoulについて以下のような体験を提供したいと思っています:
- 全ての参加者に対して公平である
- botや技術に詳しいユーザによる不正がない
- すぐに結果を見ることができる
- できるだけ安く済む

Wizardの時は、全コレクションが28分でミントされたため、全てのデータをミントの後にブロックチェーン上に記録することができました。

Soulの場合、全てのFlameが使い切られ、**全てのコレクションがミントされるまで数年かかる**可能性があります。最終的に1,112のWizardが燃やされますが、どのWizardが燃やされるかは事前にわかりません。そのため、ブロックチェーンへの保存はバッチで行う必要があります。

もちろん、使用されていないFlameが残っていることを理由に、コレクション全体の分散化（decentralizatino）が妨げられてしまうのは望ましくありません。これに対してのソリューションが以下になります:

### ミントサーバー

Wizardを燃やした直後のSoulの保存には集中管理されたミントサーバーが使われます。
こうすることでSoulのトークン情報が公開されるよりも前にSoulのトークン自体がミントされたかどうかを確認することができ、ボット対策にもなります。また、ミント直後からNFTの画像や情報を閲覧可能になります。また、Chainlink VRFなどを利用するよりも安価に実現可能です。

明らかな欠点としてはNFTの永続性に悪影響を及ぼす集中管理であること、また、公平性に対して信頼が必要となることです。

### IPFSへのチェックポイント

いくつかのSoulがミントされた後、我々はIPFSへコレクションを保存します。私たちのコントラクトにはミントされたトークンをIPFSから提供する機能が組み込まれています。
[166行目を確認してください](https://rinkeby.etherscan.io/address/0x95082b505c0752eEf1806aEf2b6b2d55eEa77e4E#code)。

IPFSには欠点もありますが、長期間の保存には集中管理されたサーバーよりも優れています。

しかし、私たちにとってはこれでも十分ではありません。

### フルオンチェーンでの保存

Wizardと同様にSoulも最終的にはブロックチェーン上に保存されます。
繰り返すようですが、コントラクトには十分な数のSoulがミントされ、ガスが良好な状態の時に、まとまった量のSoulをブロックチェーンに乗せることができるように作られています。

### オンチェーンについてのまとめ

上述のように、リリース初日のSoulのオンチェーンエンコーディングについてのストーリーはWizardほど強力ではありません。しかし、今後ブロックチェーン上に保存できるようなアップグレードパスを用意しています。

Q: 集中管理されたメタデータ・プロバイダーを信頼する必要があるといいますが、それは実際のところ誰を信頼していることになるのでしょうか？

A: 公開前のメタデータにアクセスできるのは[@dotta](https://twitter.com/dotta)と[Niski](https://twitter.com/niski_iski)の2人だけです。Elfを含む他のチームメンバーはこのデータにアクセスすることはできません。

## Book of Lore

Wizardを燃やすと、それが最後の記録として自動的に「The Book of Lore」に書き込まれます。

Wizardのトークンは破棄されてしまうのため、**今後そのWizardについてのLoreを書き込むことはできなくなります。**これはあなたがWizardのトークンの所有権を失うためです。

しかし、今後SoulについてのLoreを書くことはできるでしょう。

\*10月31日の時点でThe Book of LoreはSoulには対応していません。

## グッズ

Q: Soulの回転パーツやウォークサイクル、レイヤーのダウンロードはできるようになりますか？

A: はい、今後提供されます。レイヤーのダウンロードは比較的早く可能になる予定ですが、SoulのウォークサイクルはWizardよりも数ヶ月遅れるでしょう。

Q: 今後開発されるゲームで、SoulはWizardと同じような扱いになるのでしょうか？

A: 場合によります。"埃の山"のようなSoulにはほとんど使い道がないでしょう。

# まとめ
- Flameは無料でエアドロップされました（私たちがガス代を支払いました）
- 燃やすのは無料です（+ガス代）
- あなたは"望まれないもの (Undesirable)"を受け取るかもしれません
- 燃やすのに**期限はありません**
- 燃やすかどうかの判断は完全にあなた次第です
- あなたのWizardを燃やせるのはあなただけです

あなたがWizardを燃やすかどうか迷っているなら、好きなだけ時間を使ってください（もしくはFlameを誰かに譲ってしまうこともできます）。

もし、どうしても思いとどまることができないのであれば、燃やすとよいでしょう。FlameがあなたのSoulにとって望ましく燃えますように。
