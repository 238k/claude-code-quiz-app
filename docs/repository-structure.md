# リポジトリ構造定義書

## ルートディレクトリ

```text
/
├── src/                        # アプリケーションソースコード
├── public/                     # 静的ファイル（画像・アイコンなど）
├── docs/                       # 永続的ドキュメント
├── .steering/                  # 作業単位のドキュメント
├── .gitignore
├── .env.local                  # ローカル環境変数（gitignore対象）
├── next.config.ts              # Next.js設定
├── tsconfig.json               # TypeScript設定
├── eslint.config.mjs           # ESLint設定
├── package.json
├── package-lock.json           # 依存関係ロックファイル（gitに含める）
└── CLAUDE.md                   # プロジェクトメモリ（開発ルール）
```

---

## src/ ディレクトリ詳細

```text
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # ルートレイアウト（フォント・グローバルCSS設定）
│   ├── globals.css             # グローバルスタイル（Tailwind CSSのimport）
│   ├── page.tsx                # トップ画面（/）
│   ├── play/
│   │   └── [setId]/
│   │       └── page.tsx        # クイズプレイ画面（/play/[setId]）
│   ├── result/
│   │   └── [setId]/
│   │       └── page.tsx        # リザルト画面（/result/[setId]）
│   └── admin/
│       ├── page.tsx            # 管理トップ・セット一覧（/admin）
│       └── set/
│           ├── new/
│           │   └── page.tsx    # セット作成（/admin/set/new）
│           └── [id]/
│               └── edit/
│                   └── page.tsx # セット編集（/admin/set/[id]/edit）
│
├── components/                 # 再利用可能なUIコンポーネント
│   ├── quiz/                   # クイズプレイ関連
│   │   ├── SwipeCard.tsx       # スワイプ可能なカード（'use client'）
│   │   ├── CardStack.tsx       # カードのスタック表示（'use client'）
│   │   └── ChoiceIndicator.tsx # 左右の選択肢ラベル
│   ├── character/              # キャラクター関連
│   │   ├── Character.tsx       # キャラクターコンポーネント（'use client'）
│   │   └── CharacterFace.tsx   # 表情SVG（idle/thinking/correct/incorrect/perfect/low_score）
│   ├── result/                 # リザルト画面関連
│   │   ├── ScoreSummary.tsx    # スコアサマリー
│   │   └── ReviewCard.tsx      # 問題振り返りカード（1問分）
│   └── admin/                  # 管理画面関連（すべて 'use client'）
│       ├── SetList.tsx         # セット一覧（'use client'）
│       ├── SetForm.tsx         # セット編集フォーム（'use client'）
│       ├── QuizList.tsx        # セット内クイズ一覧（'use client'）
│       ├── QuizModal.tsx       # クイズ追加・編集モーダル（'use client'）
│       └── QuizForm.tsx        # クイズ入力フォーム（'use client'）
│
├── hooks/                      # カスタムフック（useQuizStore → context/QuizStoreContext で共有）
│   ├── useQuizStore.ts         # クイズ・セットのCRUD + localStorage同期（Context経由で呼び出す）
│   └── useAnswerSession.ts     # プレイセッション中の回答履歴管理（sessionStorage）
│
├── lib/                        # ユーティリティ・ヘルパー
│   ├── storage.ts              # localStorage / sessionStorage のラッパー関数
│   └── id.ts                   # ID生成ユーティリティ（crypto.randomUUID）
│
├── types/                      # TypeScript型定義
│   └── index.ts                # Quiz / QuizSet / AnswerRecord / CharacterState など
│
├── data/                       # 初期サンプルデータ
│   └── seed.ts                 # 初回起動時に投入するサンプルクイズ・セットデータ
│
└── context/                    # React Context
    └── QuizStoreContext.tsx     # QuizStoreProvider（useQuizStoreの状態をアプリ全体へ配布）
```

**`hooks/` と `context/` の使い分け：**

- `hooks/useQuizStore.ts` — データアクセスとCRUDロジックの実装本体。単体でも使えるが、複数コンポーネントから呼ぶと各自がlocalStorageを読み直して不整合が起きる
- `context/QuizStoreContext.tsx` — `useQuizStore` をルートで1度だけ呼び出し、戻り値をContextで全子孫へ配布する薄いラッパー
- **利用者は `useContext(QuizStoreContext)` を直接呼ばず、`useQuizStore()` をimportして使う**（内部でContextを参照）

---

## ファイル配置ルール

### コンポーネント

| ルール | 内容 |
|---|---|
| 配置場所 | `src/components/[カテゴリ]/ComponentName.tsx` |
| 命名 | PascalCase（例: `SwipeCard.tsx`） |
| `'use client'` | ブラウザAPIやイベントハンドラを使うコンポーネントのみ先頭に宣言 |
| 1ファイル1コンポーネント | デフォルトエクスポートを1つだけ持つ |

### ページ（App Router）

| ルール | 内容 |
|---|---|
| 配置場所 | `src/app/[ルート]/page.tsx` |
| 命名 | `page.tsx` 固定（Next.jsの規約） |
| Server Component優先 | データ取得が不要なページはServer Componentのまま使用 |
| `loading.tsx` / `error.tsx` | 本プロジェクトでは使用しない。ローディング・エラー表示はコンポーネント内で処理する |

### フック

| ルール | 内容 |
|---|---|
| 配置場所 | `src/hooks/useXxx.ts` |
| 命名 | camelCase・`use` プレフィックス（例: `useQuizStore.ts`） |
| 責務 | 1フック1責務。複数の関心事を混ぜない |

### 型定義

| ルール | 内容 |
|---|---|
| 配置場所 | `src/types/index.ts` に集約 |
| 命名 | PascalCase（例: `Quiz`, `CharacterState`） |
| 型 vs インターフェース | データモデルは `interface`、ユニオン型・Enumは `type` を使用 |

### ユーティリティ

| ルール | 内容 |
|---|---|
| 配置場所 | `src/lib/` |
| 命名 | camelCase（例: `storage.ts`, `id.ts`） |
| 副作用なし | Pure functionを基本とする。ただし `storage.ts` はI/Oラッパーのため例外 |

---

## public/ ディレクトリ

```text
public/
└── favicon.ico                 # ファビコン
```

画像素材は現時点では不使用。キャラクターはSVGコンポーネントとして `src/components/character/` に実装する。

---

## 主要ファイルの役割詳細

### `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* カスタムカラー・フォントをここで定義 */
}
```

### `src/types/index.ts`

アプリ全体で使用する型定義を一元管理する。

```typescript
export type CorrectAnswer = 'A' | 'B';

export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'correct'
  | 'incorrect'
  | 'perfect'
  | 'low_score';

export interface Quiz { ... }
export interface QuizSet { ... }
export interface AnswerRecord { ... }
```

### `src/lib/storage.ts`

localStorage / sessionStorageへのアクセスを集約。SSR時の `window` 未定義を安全に処理する。

```typescript
export const localStore = {
  get: <T>(key: string): T | null => { ... },
  set: <T>(key: string, value: T): void => { ... },
  remove: (key: string): void => { ... },
};

export const sessionStore = {
  get: <T>(key: string): T | null => { ... },
  set: <T>(key: string, value: T): void => { ... },
  remove: (key: string): void => { ... },
};
```

### `src/data/seed.ts`

初回起動時（localStorage未初期化時）に投入するサンプルデータ。
プレイ体験をすぐに確認できるよう、最低1セット・5問を用意する。
