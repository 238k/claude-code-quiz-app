# 開発ガイドライン

## コーディング規約

### 全般

- TypeScriptの型を省略しない。`any` は原則禁止。やむを得ない場合は `unknown` を使い、型ガードで絞り込む
- `dangerouslySetInnerHTML` は使用しない
- `console.log` をコミットに含めない（デバッグ用途は `console.error` / `console.warn` のみ許容）
- 未使用の変数・インポートを残さない
- ファイル末尾に改行を入れる

### React / Next.js

- Server Component と Client Component を明確に分ける
  - `'use client'` はファイル先頭に配置する
  - インタラクション・アニメーション・フォーム・localStorageアクセスは Client Component に実装する
  - 静的なUIはServer Componentで実装してバンドルサイズを削減する
- コンポーネントは関数コンポーネントのみ使用する（クラスコンポーネント禁止）
- `React.FC` / `React.VFC` は使用しない。Props型を引数に直接アノテーションする

```typescript
// Good
type Props = { title: string };
export default function Header({ title }: Props) { ... }

// Bad
const Header: React.FC<{ title: string }> = ({ title }) => { ... }
```

- カスタムフックは `hooks/` ディレクトリに配置し、名前は `use` プレフィックスで統一する
- localStorageへの直接アクセスはコンポーネントから行わず、必ず `useQuizStore` フック経由で行う
- ストレージ操作（localStorage / sessionStorage）は必ず `src/lib/storage.ts` のラッパー関数経由で行う（SSR時の `window` 未定義を安全に処理するため）
- コンポーネントファイルは `export default` を1つだけ持つ（named exportは型・定数のみ許容）

### Context

- `context/QuizStoreContext.tsx` の `QuizStoreContext` を `useContext()` で直接参照しない
- 利用側は `useQuizStore()` をimportして呼び出す（Context参照はフック内部に隠蔽する）

```typescript
// Good
import { useQuizStore } from '@/hooks/useQuizStore';
const { quizzes, addQuiz } = useQuizStore();

// Bad
import { useContext } from 'react';
import { QuizStoreContext } from '@/context/QuizStoreContext';
const { quizzes } = useContext(QuizStoreContext);
```

### Framer Motion

- `motion.div` など `motion` コンポーネントは Client Component 内でのみ使用する
- アニメーションプロパティは `transform`・`opacity` のみを変更してGPUアクセラレーションを維持する
- `AnimatePresence` は exit アニメーションが必要な箇所にのみ使用する

---

## 命名規則

### ファイル・ディレクトリ

| 種別 | 規則 | 例 |
|---|---|---|
| コンポーネントファイル | PascalCase | `SwipeCard.tsx`, `QuizForm.tsx` |
| ページファイル（App Router） | 小文字 + `page.tsx` | `app/play/[setId]/page.tsx` |
| レイアウトファイル | `layout.tsx` | `app/layout.tsx` |
| カスタムフック | camelCase | `useQuizStore.ts` |
| Contextファイル | PascalCase | `QuizStoreContext.tsx` |
| ユーティリティ | camelCase | `storage.ts`, `id.ts` |
| 型定義ファイル | camelCase | `index.ts`（`src/types/` に集約） |
| 定数ファイル | camelCase | `storageKeys.ts` |

### TypeScript

| 種別 | 規則 | 例 |
|---|---|---|
| インターフェース（データモデル） | PascalCase | `Quiz`, `QuizSet`, `AnswerRecord` |
| 型エイリアス（ユニオン型など） | PascalCase | `CorrectAnswer`, `CharacterState` |
| 変数・関数 | camelCase | `quizList`, `addQuiz` |
| 定数 | UPPER_SNAKE_CASE | `STORAGE_KEY_QUIZZES` |
| コンポーネント | PascalCase | `SwipeCard`, `CharacterReaction` |
| Enum（列挙型） | PascalCase（値もPascalCase） | `SwipeState.Idle`, `SwipeState.Dragging` |

**`interface` vs `type` の使い分け：**

| 用途 | 使用する構文 |
| --- | --- |
| データモデル（`Quiz`, `QuizSet`, `AnswerRecord`など） | `interface` |
| ユニオン型・リテラル型（`CorrectAnswer`, `CharacterState`など） | `type` |
| Enum相当の定数ユニオン | `type` |

### CSS（Tailwind CSS）

- Tailwindクラスはコンポーネント内に直書きする（CSS Modulesは使用しない）
- 独自のカスタムクラスが必要な場合は `app/globals.css` の `@theme` ブロックでCSS変数として定義する
- `@apply` は原則使用しない

---

## スタイリング規約

### Tailwind CSS v4

- グローバルスタイルは `app/globals.css` に記述する
- カスタムカラー・フォント・ブレークポイントは `@theme` ブロックで定義する

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --font-sans: "Noto Sans JP", sans-serif;
}
```

- `tailwind.config.js` は作成しない（v4では不要）

### レスポンシブデザイン

- モバイルファーストで実装する（デフォルトをモバイルサイズとし、`md:` / `lg:` で拡張）
- ブレークポイント基準：
  - モバイル: デフォルト（〜767px）
  - タブレット: `md:` （768px〜）
  - デスクトップ: `lg:` （1024px〜）

---

## テスト規約

> MVP段階ではユニットテストの整備は必須としない。
> ただし、ロジックが複雑なユーティリティ関数・カスタムフックには将来的なテスト追加を想定した実装を心がける。

- テストファイルはテスト対象ファイルと同じディレクトリに `*.test.ts(x)` として配置する
- テストフレームワーク：Vitest（導入時）
- UIコンポーネントのテスト：Testing Library（導入時）

---

## Git規約

### ブランチ戦略

```
main          ← 本番・安定ブランチ（直接pushしない）
feature/xxx   ← 機能追加
fix/xxx       ← バグ修正
docs/xxx      ← ドキュメント更新のみ
```

### コミットメッセージ

Conventional Commits に従う。

```
<type>: <summary>

[body（任意）]
```

**type 一覧：**

| type | 用途 |
|---|---|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの動作に影響しない変更（フォーマット等） |
| `refactor` | バグ修正・機能追加を伴わないリファクタリング |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセス・ツールの変更（依存パッケージ更新等） |

**例：**
```
feat: スワイプカードコンポーネントを追加
fix: localStorageが未初期化の場合にクラッシュする問題を修正
docs: architecture.mdにFramer Motion利用方針を追記
```

### コミット前チェックリスト

- [ ] `npm run lint` がエラーなし
- [ ] `npm run type-check` がエラーなし
- [ ] 未使用のインポート・変数がない
- [ ] `console.log` がコミットに含まれていない

---

## セキュリティガイドライン

- ユーザー入力の表示はReactのデフォルトエスケープに委ねる（`dangerouslySetInnerHTML` 禁止）
- localStorageからのデータ読み込みは必ずtry-catchで囲み、JSONパースエラーを処理する

```typescript
// Good
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
```

- 外部からのデータを型アサーション（`as`）で無条件に信頼しない。ランタイムバリデーションを行う
