# React ToDo アプリケーション

React 19.1.0 + TypeScript で作成されたモダンなToDoアプリケーションです。

## 技術スタック

- **React 19.1.0** + TypeScript
- **Vite** (ビルドツール)
- **Vitest** (テスト)
- **ESLint + Prettier** (コード品質)
- **Husky** (Gitフック)

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# テスト実行
npm run test

# ESLintチェック
npm run lint

# TypeScriptチェック
npm run type-check
```

## デプロイ設定

### Cloudflare Pages自動デプロイ

このプロジェクトは、mainブランチにマージされると自動的にCloudflare Pagesにデプロイされます。

#### 必要な設定

GitHubリポジトリのSecretsに以下を設定してください：

1. **CLOUDFLARE_ACCOUNT_ID**

   - Cloudflareダッシュボードの右側サイドバーで確認できます

2. **CLOUDFLARE_API_TOKEN**
   - Cloudflareダッシュボード → プロファイル → APIトークン → カスタムトークンを作成
   - 権限: `Cloudflare Pages:Edit`

#### デプロイ動作

- **トリガー**: mainブランチへのpush
- **条件**: すべてのテストとリントチェックが通過
- **ビルド出力**: `dist/`ディレクトリ
- **プロジェクト名**: `new-com-system`

#### 手動デプロイ

```bash
# Wrangler CLIを使用した手動デプロイ
npx wrangler pages deploy dist --project-name=new-com-system
```

## Todo機能仕様

- Todo項目の追加（空文字列の場合は追加しない）
- Todo項目の削除
- Todo項目の完了/未完了切り替え
- リアルタイムでの状態反映
- Enterキーでの追加対応

## データ構造

```typescript
interface Todo {
  id: number
  text: string
  completed: boolean
}
```

# GitHub ActionsでCloudflare Pagesにデプロイする方法まとめ

## **1. Cloudflare Account IDの取得**

### **Account IDの場所**

- **Cloudflareダッシュボード**: https://dash.cloudflare.com/
- **場所1**: Account Homeページでアカウント名横のメニューボタン → **「Copy account ID」**
- **場所2**: Overviewページ下部の**「API」セクション** → **「Account ID」** → **「Click to copy」**
- **場所3**: **Workers & Pages** → **「Account details」**セクション
- **形式**: 32文字の英数字（例: `1234567890abcdef1234567890abcdef`）

## **2. Cloudflare API Tokenの作成**

### **推奨するAPIトークン設定**

```
Token name: GitHub Actions Pages Deploy

Permissions:
- Account - Cloudflare Pages:Edit
- Account - Account:Read
- Zone - Zone:Read (オプション)

Account Resources:
- Include - All accounts

Zone Resources:
- Include - All zones (オプション)
```

### **既存のトークンから選択する場合**

- **「CLOUDFLARE_API_TOKEN」**: 多くの権限を持つ包括的なトークン ✅
- **「Cloudflare Workers を編集する」**: Pages権限不足 ❌
- **「Workers Builds - 2025-04-30 23:00」**: 有効期限あり ❌
- **「Global API Key」**: セキュリティ上非推奨 ❌

## **3. Cloudflare Pagesプロジェクトの作成**

1. **Cloudflareダッシュボード** → **Workers & Pages**
2. **「Create application」** → **「Pages」**
3. **プロジェクト名**: `new-com-system`（ワークフローファイルと一致させる）
4. **「Create project」**

## **4. GitHubのSecrets設定**

**GitHubリポジトリ** → **Settings** → **Secrets and variables** → **Actions**

```
Name: CLOUDFLARE_API_TOKEN
Value: (コピーしたAPIトークン値)

Name: CLOUDFLARE_ACCOUNT_ID
Value: (コピーしたAccount ID)
```

## **5. GitHub Actionsワークフローファイル**

### **完全なワークフロー例**

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    needs: build-and-test # 前のジョブの完了を待つ
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=new-com-system --commit-dirty=true
```

### **ワークフローの詳細説明**

- **`needs: build-and-test`**: 前のジョブが成功してから実行
- **`if: github.ref == 'refs/heads/main'`**: mainブランチのみ
- **`npm ci`**: package-lock.jsonに基づくクリーンインストール
- **`npm run build`**: プロジェクトをビルドして`dist`フォルダに出力
- **`--commit-dirty=true`**: git未コミット変更の警告を抑制
- **`--project-name=new-com-system`**: Cloudflare Pagesのプロジェクト名

## **6. 主なエラーと解決法**

### **「Project not found」エラー**

- **原因**: Cloudflare Pagesにプロジェクトが存在しない
- **解決**: 事前にCloudflareでプロジェクトを作成

### **「Authentication error [code: 10000]」**

- **原因**: APIトークンの権限不足
- **解決**: `Cloudflare Pages:Edit`権限を追加

### **「uncommitted changes」警告**

- **原因**: git作業ディレクトリに未コミット変更
- **解決**: `--commit-dirty=true`オプションを追加

## **7. 実行フロー**

1. **mainブランチにpush**
2. **GitHub Actionsが自動実行**
3. **依存関係インストール → ビルド → デプロイ**
4. **Cloudflare PagesでWebサイト公開**

## **8. セキュリティのポイント**

- **APIトークン**: 必要最小限の権限のみ設定
- **GitHub Secrets**: 機密情報は必ずSecretsに保存
- **Account ID**: 公開されても問題ないが、念のためSecretsに保存
- **Global API Key**: 使用しない（全権限を持つため危険）

この設定により、mainブランチへのpushで自動的にCloudflare Pagesにデプロイされる**継続的デプロイメント（CD）**が完成します！
