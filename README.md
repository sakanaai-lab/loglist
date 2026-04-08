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

### 1. このリポジトリをフォークする

画面右上の **Fork** ボタンを押して、自分のGitHubアカウントにコピーします。

### 2. Railwayで新しいプロジェクトを作る

1. [railway.app](https://railway.app) を開いてログイン
2. **New Project** → **Deploy from GitHub repo** を選ぶ
3. フォークしたリポジトリ（`あなたのユーザー名/loglist`）を選ぶ
4. **Deploy Now** を押す

### 3. データ保存用のVolumeを追加する

サーバーが止まってもログが消えないようにするための設定です。

1. Railwayのプロジェクト画面を開く
2. サービス（デプロイしたもの）をクリック
3. 上のタブから **Volumes** を選ぶ
4. **Add Volume** を押す
5. 以下のように入力して保存：
   - Mount Path（マウントパス）: `/app/data`

### 4. 環境変数を設定する

管理者パスワードを設定します。

1. サービスの **Variables** タブを開く
2. **New Variable** を押す
3. 以下を追加：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `ADMIN_PASSWORD` | 好きなパスワード | 投稿・削除・マスキングに使う |

4. **Deploy** ボタンを押してデプロイを反映させる

### 5. URLを確認する

1. **Settings** タブ → **Networking** → **Generate Domain** を押す
2. 発行されたURL（`xxxx.railway.app`）にアクセスして動作確認

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
