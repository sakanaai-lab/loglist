# loglist

LLMとのチャットログを保存・公開できるブログ風サイトです。

- 訪問者はログを読むだけ（読み取り専用）
- 管理者はパスワードで投稿・削除・名前マスキングができる
- SQLiteでデータを保存、Railwayで無料〜低コストで公開できる

**[ログビューアー（エクスポートしたファイルをブラウザで見る）](https://sakanaai-lab.github.io/loglist/viewer/)**

---

## 機能

- チャットログの投稿（モデル名・複数ラウンド対応）
- ユーザー／AI の吹き出し表示
- 名前マスキング（本名→ニックネームに自動置換）
- ログ一括エクスポート（Markdownファイル）
- 検索エンジンブロック（robots.txt）
- プライベートモード（サイト全体にパスワードをかける）

---

## Railwayにデプロイする手順

> **必要なもの**
> - [GitHub](https://github.com) アカウント
> - [Railway](https://railway.app) アカウント（GitHubでログインできます）

---

### ステップ1：このリポジトリをフォークする

このページ右上の **Fork** ボタンを押します。  
「Create fork」を押すと、自分のGitHubアカウントに `あなたのユーザー名/loglist` としてコピーされます。

---

### ステップ2：Railwayにデプロイする

1. [railway.app](https://railway.app) を開き、**GitHubアカウントでログイン**する
2. ダッシュボードの **New Project** を押す
3. 出てくるメニューから **Deploy from GitHub repo** を選ぶ
4. リポジトリの一覧が出るので `あなたのユーザー名/loglist` を選ぶ
   - 出てこない場合は「Configure GitHub App」を押してリポジトリへのアクセスを許可する
5. **Deploy Now** を押す

しばらく待つとデプロイが始まります（2〜3分かかります）。

---

### ステップ3：データ保存用のVolumeを追加する

> ⚠️ これをやらないとサーバーが再起動するたびにログが消えます。必ずやってください。

1. Railwayのプロジェクト画面を開く
2. 画面に表示されているサービス（`loglist` などの名前のカード）を**クリック**する
3. 右側にパネルが開くので、上部のタブから **Volumes** を選ぶ
4. **Add Volume** を押す
5. 設定画面が出るので以下のように入力する：
   - **Mount Path**: `/app/data`  ← これだけ入力すればOK
6. **Add** または **Save** を押す

> ⚠️ よくある間違い：「New Service」や「Add Service」から追加しないこと。Volumeは**サービスの中のVolumesタブ**から追加します。

---

### ステップ4：環境変数（パスワード）を設定する

1. サービスのパネルで **Variables** タブを選ぶ
2. **New Variable** を押す
3. 左側の欄に `ADMIN_PASSWORD`、右側の欄に**好きなパスワード**を入力する
   - `${{ secret() }}` などと書いてある場合は全部消してパスワードを直接入力する
4. **Add** を押して保存する
5. 画面上部に「Deploy」ボタンが出たら押す（設定を反映させるため）

> ℹ️ このパスワードは投稿・削除・マスキング設定のときに使います。サイトの閲覧には不要です。

---

### ステップ5：公開URLを発行する

1. サービスのパネルで **Settings** タブを選ぶ
2. 「Networking」セクションを探す
3. **Generate Domain** を押す
4. `ランダムな文字列.railway.app` というURLが発行される
5. そのURLをブラウザで開いてサイトが表示されればOK！

---

### ステップ6：動作確認

| 確認すること | 手順 |
|---|---|
| トップページが開く | 発行されたURLにアクセス |
| 管理ページが開く | URL + `/admin` にアクセス |
| 投稿できる | `/admin` の「＋投稿する」から、ADMIN_PASSWORDを入力して投稿 |

---

## 使い方

| ページ | URL | 説明 |
|--------|-----|------|
| トップ（ログ一覧） | `/` | 誰でも見られる |
| 個別ログ | `/posts/[id]` | 誰でも見られる |
| 管理ページ | `/admin` | パスワードで投稿・削除・エクスポート |
| マスキング設定 | `/settings` | パスワードで名前の置換ルールを設定 |
| ビューアー | `/viewer` | エクスポートしたMDファイルをブラウザで見る |

---

## プライベートモード（オプション）

サイト全体にパスワードをかけて、自分だけが見られる非公開サイトにできます。  
別のRailwayサービスとして同じリポジトリをデプロイし、以下の環境変数を追加します：

| 変数名 | 値 |
|--------|-----|
| `PRIVATE_MODE` | `true` |
| `SITE_PASSWORD` | サイト入口のパスワード |
| `ADMIN_PASSWORD` | （設定不要：PRIVATE_MODEではスキップされます） |

プライベートモードでは見た目がダークモードに切り替わります。

---

## ローカルで動かす（開発者向け）

```bash
git clone https://github.com/あなたのユーザー名/loglist.git
cd loglist
npm install
ADMIN_PASSWORD=password npm run dev
```

`http://localhost:3000` を開くと動きます。

---

## 技術スタック

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [SQLite](https://www.sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Railway](https://railway.app) でホスティング
