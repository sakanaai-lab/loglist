# loglist

LLMとのチャットログを保存・公開できるブログ風サイトです。

- 訪問者はログを読むだけ（読み取り専用）
- 管理者はパスワードで投稿・削除・名前マスキングができる
- Turso（クラウドSQLite）でデータを保存、Vercelで完全無料で公開できる

**[ログビューアー（エクスポートしたファイルをブラウザで見る）](https://sakanaai-lab.github.io/loglist/viewer/)**

---

## ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsakanaai-lab%2Floglist&env=TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,ADMIN_PASSWORD&envDescription=Turso%E3%81%AEDatabase+URL%E3%81%A8Auth+Token%E3%80%81%E6%8A%95%E7%A8%BF%E7%94%A8%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E3%82%92%E5%85%A5%E5%8A%9B%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84&envLink=https%3A%2F%2Fgithub.com%2Fsakanaai-lab%2Floglist%23%E3%82%B9%E3%83%86%E3%83%83%E3%83%974turso%E3%81%AEurl%E3%81%A8%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%92%E3%83%A1%E3%83%A2%E3%81%99%E3%82%8B&project-name=loglist&repository-name=loglist)

> ボタンを押すと Vercel がリポジトリをフォークしてデプロイ画面を開きます。  
> 先に **Turso でデータベースを作成**し、URL とトークンを手元に用意してから押してください（→ [ステップ2〜4](#ステップ2tursoでデータベースを作成する)）。

---

## 機能

- チャットログの投稿（モデル名・複数ラウンド対応）
- ユーザー／AI の吹き出し表示
- 名前マスキング（本名→ニックネームに自動置換）
- ログ一括エクスポート（Markdownファイル）
- 検索エンジンブロック（robots.txt）
- プライベートモード（サイト全体にパスワードをかける）

---

## Vercel + Turso にデプロイする手順

> **必要なもの**
> - [GitHub](https://github.com) アカウント
> - [Turso](https://turso.tech) アカウント（GitHubでログインできます）
> - [Vercel](https://vercel.com) アカウント（GitHubでログインできます）
>
> **費用：すべて無料枠で運用できます**

---

### ステップ1：このリポジトリをフォークする

1. このページ右上の **Fork** ボタンを押す
2. 「Create fork」を押すと、自分のGitHubアカウントに `あなたのユーザー名/loglist` としてコピーされる

---

### ステップ2：Tursoでデータベースを作成する

1. [turso.tech](https://turso.tech) を開き、GitHubアカウントでログインする
2. ダッシュボードの **Create Database** を押す
3. データベース名を `loglist` にする（好きな名前でもOK）
4. リージョン（サーバーの場所）は **東京（ap-northeast-1）** など近い場所を選ぶ
5. 作成されたら、データベースをクリックして開く

---

### ステップ3：Tursoにテーブルを作成する

1. データベースの画面で **Edit Data** タブを開く
2. 左側の **SQL console** をクリックする
3. このリポジトリの [`setup.sql`](./setup.sql) の内容を**まるごとコピー**して貼り付け、**Run（Ctrl+Enter）** で実行する

右側のパネルに `posts`、`messages`、`masks` の3つが表示されればOKです。

> **既にデプロイ済みの方へ：** `setup.sql` の末尾にあるコメントアウトされた `ALTER TABLE` を実行してください：
> ```sql
> ALTER TABLE posts ADD COLUMN description TEXT NOT NULL DEFAULT '';
> ```

---

### ステップ4：TursoのURLとトークンをメモする

1. データベースの **Overview** タブを開く
2. **Database URL**（`libsql://...` で始まる文字列）をコピーしてメモする
3. 画面のどこかに **Create Token** や **Generate Token** ボタンがあるので押す
4. 生成されたトークン（`eyJ...` で始まる長い文字列）をコピーしてメモする

> ⚠️ トークンは一度しか表示されない場合があります。必ずどこかにメモしてください。

---

### ステップ5：Vercelにデプロイする

1. [vercel.com](https://vercel.com) を開き、GitHubアカウントでログインする
2. ダッシュボードの **Add New... → Project** を押す
3. GitHubリポジトリの一覧から **`あなたのユーザー名/loglist`** を選び、**Import** を押す
4. 「Configure Project」画面で **Environment Variables** を開く
5. 以下の3つを1つずつ入力して追加する：

| Name（左の欄） | Value（右の欄） |
|---|---|
| `TURSO_DATABASE_URL` | ステップ4でメモした `libsql://...` のURL |
| `TURSO_AUTH_TOKEN` | ステップ4でメモしたトークン |
| `ADMIN_PASSWORD` | 好きなパスワード（投稿・削除に使う） |

6. 一番下の **Deploy** ボタンを押す
7. 1〜2分待って「Congratulations!」と表示されれば完了！

---

### ステップ6：動作確認

| 確認すること | 手順 |
|---|---|
| トップページが開く | Vercelが発行したURL（`あなたのプロジェクト名.vercel.app`）にアクセス |
| 投稿できる | 右上の「＋投稿する」から、ADMIN_PASSWORDを入力して投稿 |
| 管理ページが開く | URL + `/admin` にアクセス |

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
Vercelの環境変数に以下を追加し、Redeployしてください：

| 変数名 | 値 |
|--------|-----|
| `PRIVATE_MODE` | `true` |
| `SITE_PASSWORD` | サイト入口のパスワード |
| `ADMIN_PASSWORD` | （設定不要：PRIVATE_MODEではスキップされます） |

プライベートモードでは見た目がダークモードに切り替わります。

---

## 環境変数の変更を反映する

Vercelの環境変数を変更した場合は、必ず **Redeploy（再デプロイ）** が必要です：

1. Vercelダッシュボード → **Deployments** タブ
2. 一番上の行の右端 **…** → **Redeploy** を選択
3. 緑色の「Ready」になるまで待つ

---

## ローカルで動かす（開発者向け）

```bash
git clone https://github.com/あなたのユーザー名/loglist.git
cd loglist
npm install
```

`.env.local` ファイルをプロジェクトのルートに作成し、以下を記述：

```
TURSO_DATABASE_URL=libsql://あなたのデータベースURL
TURSO_AUTH_TOKEN=あなたのトークン
ADMIN_PASSWORD=password
```

```bash
npm run dev
```

`http://localhost:3000` を開くと動きます。

---

## うまくいかないとき（FAQ）

### サイトを開いたら Internal Server Error になる

**原因：環境変数が正しく設定されていない**

Vercel ダッシュボード → プロジェクト → **Settings** → **Environment Variables** を開いて確認してください。

| 確認ポイント | よくあるミス |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://` で始まっているか（`https://` ではない） |
| `TURSO_AUTH_TOKEN` | `eyJ` で始まる長い文字列が丸ごと入っているか |
| `ADMIN_PASSWORD` | 入力されているか |

設定を変更したら **Deployments → … → Redeploy** が必要です。

---

### 投稿しようとしたら「Internal Server Error」になる

**原因：Turso にテーブルが作られていない**

Turso の SQL console を開き、`setup.sql` の内容を実行してください。  
右側のパネルに `posts`、`messages`、`masks` が表示されていれば正常です。

---

### 「パスワードが違います」と出るのに合ってるはず

**原因：環境変数の反映漏れ**

Vercel は環境変数を変更しても**自動で再起動しません**。変更後は必ず Redeploy してください。

1. Vercel ダッシュボード → **Deployments** タブ
2. 一番上の行の右端 **…** → **Redeploy**

---

### 投稿できるのに一覧に表示されない・ページが壊れる

**原因：テーブルに `description` カラムがない（旧バージョンからのマイグレーション漏れ）**

Turso の SQL console で以下を実行してください：

```sql
ALTER TABLE posts ADD COLUMN description TEXT NOT NULL DEFAULT '';
```

---

### Turso のトークンが期限切れになった

Turso のトークンはデフォルトで**無期限**ですが、手動で削除・再生成した場合は更新が必要です。

1. Turso ダッシュボード → データベース → **Overview** タブ
2. **Generate Token** で新しいトークンを発行
3. Vercel の `TURSO_AUTH_TOKEN` を新しい値に更新
4. Redeploy する

---

### デプロイは成功しているのにサイトが古いまま

ブラウザのキャッシュをクリア（Ctrl+Shift+R）してから再度アクセスしてください。  
それでも変わらない場合は Vercel の Deployments タブで最新デプロイのステータスが **Ready（緑）** になっているか確認してください。

---

## 技術スタック

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Turso](https://turso.tech) (libSQL) − クラウドSQLiteデータベース
- [Vercel](https://vercel.com) − ホスティング（無料）
