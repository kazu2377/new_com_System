日本語で書いて
React ToDo アプリケーションの作成して

# アプリケーションルール

## 技術スタック
- React 19.1.0 + TypeScript
- Vite（ビルドツール）
- Vitest（テスト）
- ESLint + Prettier（コード品質）
- Husky（Gitフック）

## 開発ルール

### コードスタイル
- TypeScriptの型定義を必須とする
- 関数型コンポーネントを使用
- インターフェースを使用して型安全性を確保
- 日本語のコメントとUI文言を使用

### Todo機能仕様
- Todo項目の追加（空文字列の場合は追加しない）
- Todo項目の削除
- Todo項目の完了/未完了切り替え
- リアルタイムでの状態反映
- Enterキーでの追加対応

### データ構造
```typescript
interface Todo {
  id: number
  text: string
  completed: boolean
}
```

### 開発コマンド
- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run test`: テスト実行
- `npm run lint`: ESLintチェック
- `npm run type-check`: TypeScriptチェック
