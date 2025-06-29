# Storybook モック対応ガイド

このドキュメントでは、Effect.ts + React Query + MSW を使用したStorybookのモック対応について説明します。

## アーキテクチャー概要

### 技術スタック
- **Effect.ts**: 関数型プログラミングによる型安全なエラーハンドリング
- **React Query**: サーバー状態管理とキャッシング
- **MSW (Mock Service Worker)**: HTTPリクエストのモック
- **Storybook**: コンポーネント開発環境

### フォルダー構成
```
src/
├── mocks/
│   ├── handlers.ts          # デフォルトのMSWハンドラー
│   ├── story-handlers.ts    # ストーリー固有のハンドラー
│   └── browser.ts           # MSWブラウザー設定
├── decorators/
│   ├── with-msw.tsx         # MSW統合デコレーター
│   └── with-query-client.tsx # React Query統合デコレーター
└── stories/
    └── *.stories.tsx        # ストーリーファイル
```

## 基本的な使用方法

### 1. 新しいコンポーネントのストーリー作成

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "../components/your-component";

const meta = {
  title: "Components/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {};
```

### 2. カスタムモックハンドラーの作成

`src/mocks/story-handlers.ts`に新しいハンドラーを追加:

```typescript
import { http, HttpResponse } from "msw";

export const yourApiHandlers = [
  http.get("*/your-api-endpoint", () => {
    return HttpResponse.json({
      // モックデータ
    });
  }),
];
```

### 3. ストーリーでのハンドラー使用

```typescript
export const YourStory: Story = {
  parameters: {
    msw: {
      handlers: yourApiHandlers,
    },
  },
};
```

## ベストプラクティス

### Effect.tsとの統合

1. **型安全性の維持**
   - Effect.tsの型システムを活用してエラーハンドリングを適切に行う
   - `api-client.ts`のパターンに従って実装

2. **エラー状態のテスト**
   ```typescript
   export const errorHandlers = [
     http.get("*/api/endpoint", () => {
       return new HttpResponse(null, { status: 500 });
     }),
   ];
   ```

### React Queryとの統合

1. **デコレーターの利用**
   - グローバルデコレーター(`withQueryClient`)が自動的に適用される
   - 個別のストーリーでQueryClientを設定する必要なし

2. **キャッシュ戦略**
   - Storybookでは無限キャッシュを設定済み
   - リトライは無効化済み

### モックハンドラーの設計

1. **状態別ハンドラー**
   ```typescript
   // 正常状態
   export const normalHandlers = [];
   
   // ローディング状態
   export const loadingHandlers = [
     http.get("*/api", async () => {
       await delay(5000);
       return HttpResponse.json(data);
     }),
   ];
   
   // エラー状態
   export const errorHandlers = [];
   
   // 空状態
   export const emptyHandlers = [];
   ```

2. **リアルなデータの使用**
   - 実際のAPIレスポンス形式に合わせる
   - Edge caseをカバーするデータを含める

### ストーリーの命名規則

- `Default`: 標準的な使用状態
- `Empty`: データが空の状態
- `Loading`: ローディング状態
- `Error`: エラー状態
- `ManyItems`: 大量データの状態
- `[特定の状態名]`: その他の特別な状態

## トラブルシューティング

### よくある問題

1. **MSWが動作しない**
   - ブラウザーのコンソールでService Workerが登録されているか確認
   - `public/mockServiceWorker.js`が存在するか確認

2. **型エラー**
   - Effect.tsの型定義が正しくインポートされているか確認
   - `@domain/TodosApi`などの型が正しく解決されているか確認

3. **ハンドラーが適用されない**
   - ストーリーのparametersが正しく設定されているか確認
   - デコレーターの順序を確認

### デバッグ

MSWのデバッグを有効にするには:

```typescript
// src/decorators/with-msw.tsx
worker.start({
  onUnhandledRequest: "warn",
  quiet: false, // デバッグ情報を表示
});
```

## 今後の改善点

1. **自動生成ツール**
   - ストーリーとハンドラーの自動生成
   - OpenAPI仕様からの自動生成

2. **テストとの連携**
   - 同じモックハンドラーをテストでも使用
   - E2Eテストとの統合

3. **パフォーマンス最適化**
   - ハンドラーの遅延読み込み
   - 不要なハンドラーの除去