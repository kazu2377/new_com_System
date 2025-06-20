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