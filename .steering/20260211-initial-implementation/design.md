# 初回実装 設計書

## 実装アプローチ

### 全体方針

- Next.js App Router（`src/` ディレクトリ構成）で実装する
- データはlocalStorageのみ。バックエンドなし
- 状態管理は `useQuizStore` カスタムフック + `QuizStoreContext` でアプリ全体に配布
- プレイセッション中の回答記録（`AnswerRecord[]`）はsessionStorageに一時保存
- スワイプ・アニメーションはFramer Motionで実装
- スタイリングはTailwind CSS v4（`tailwind.config.js` 不要）

### 実装順序

1. **環境セットアップ**（Next.jsプロジェクト作成・パッケージインストール）
2. **基盤層**（型定義・storage util・seed data）
3. **状態管理層**（useQuizStore・QuizStoreContext）
4. **管理画面**（セット・クイズのCRUD）
5. **プレイ画面**（スワイプカード・キャラクター）
6. **リザルト画面**
7. **トップ画面**（最後に実装。セット一覧が存在する状態で確認できる）

---

## 環境セットアップ

### プロジェクト作成コマンド

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

### 追加パッケージ

```bash
npm install framer-motion
```

### Tailwind CSS v4 設定

`create-next-app` がTailwind CSS v3をインストールする場合、v4に更新する。

```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest
```

`postcss.config.mjs`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

`src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --font-sans: "Noto Sans JP", sans-serif;
}
```

---

## 基盤層の設計

### `src/types/index.ts`

```typescript
export type CorrectAnswer = 'A' | 'B';

export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'correct'
  | 'incorrect'
  | 'perfect'
  | 'low_score';

export type SwipeState = 'Idle' | 'Dragging' | 'Feedback';

export interface Quiz {
  id: string;
  setId: string;
  question: string;
  optionA: string;
  optionB: string;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerRecord {
  quiz: Quiz;
  selectedAnswer: CorrectAnswer;
  isCorrect: boolean;
}
```

### `src/lib/storage.ts`

SSR時の `window` 未定義を安全に処理するラッパー。

```typescript
export const localStore = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

export const sessionStore = {
  get: <T>(key: string): T | null => { /* 同様 */ },
  set: <T>(key: string, value: T): void => { /* 同様 */ },
  remove: (key: string): void => { /* 同様 */ },
};
```

### `src/lib/storageKeys.ts`

```typescript
export const STORAGE_KEYS = {
  QUIZZES: 'swipe-quiz:quizzes',
  SETS: 'swipe-quiz:sets',
  ANSWER_SESSION: 'swipe-quiz:answer-session',
} as const;
```

### `src/lib/id.ts`

```typescript
export function generateId(): string {
  return crypto.randomUUID();
}
```

### `src/data/seed.ts`

初回起動時（localStorageが空の場合）に投入するサンプルデータ。1セット・5問以上。

---

## 状態管理層の設計

### `src/hooks/useQuizStore.ts`

```typescript
// Context経由で呼び出されることを前提とした実装
// コンテキストが未初期化の場合はエラーを投げる

export function useQuizStore() {
  const ctx = useContext(QuizStoreContext);
  if (!ctx) throw new Error('useQuizStore must be used within QuizStoreProvider');
  return ctx;
}
```

### `src/context/QuizStoreContext.tsx`

- ルートレイアウト（`app/layout.tsx`）でラップする
- localStorageの初期読み込みは `useEffect` 内で行い、SSRと両立させる
- seedデータの投入もここで行う（初回のみ）

```typescript
export function QuizStoreProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [sets, setSets] = useState<QuizSet[]>([]);

  // 初期ロード（+ seed投入）
  useEffect(() => {
    const storedSets = localStore.get<QuizSet[]>(STORAGE_KEYS.SETS) ?? [];
    if (storedSets.length === 0) {
      // seedデータを投入
    } else {
      setSets(storedSets);
      setQuizzes(localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? []);
    }
  }, []);

  // CRUD操作 + localStorage同期
  // ...

  return (
    <QuizStoreContext.Provider value={{ quizzes, sets, addSet, updateSet, deleteSet, addQuiz, updateQuiz, deleteQuiz, getQuizzesBySetId }}>
      {children}
    </QuizStoreContext.Provider>
  );
}
```

### `src/hooks/useAnswerSession.ts`

- プレイセッション中の `AnswerRecord[]` を管理する
- `sessionStorage` に保存してリザルト画面で読み込む
- プレイ開始時にクリア、回答ごとに追記、全問完了時にリザルトへ渡す

---

## 各画面・コンポーネントの設計

### トップ画面（`app/page.tsx`）

- Server Component
- `QuizStoreContext` からセット一覧を取得する Client Component（`SetList`的な）を内包する
- セット一覧 → 各セットの「スタート」ボタンで `/play/[setId]` へ遷移

### クイズプレイ画面（`app/play/[setId]/page.tsx`）

- Client Component（`'use client'`）
- 初期化：`useQuizStore` でセットのクイズ取得、`useAnswerSession` でセッション初期化
- 状態管理：`useState` で `currentIndex`・`swipeState`・`characterState` を保持
- キャラクター状態は `swipeState` と `isCorrect` から導出してpropsで渡す

**回答フロー：**

```
onSwipeConfirm(direction: 'left' | 'right')
  ↓
selectedAnswer = direction === 'left' ? 'A' : 'B'
isCorrect = selectedAnswer === quiz.correctAnswer
  ↓
setCharacterState(isCorrect ? 'correct' : 'incorrect')
addAnswerRecord({ quiz, selectedAnswer, isCorrect })
  ↓
setTimeout 1300ms
  ↓
if (currentIndex + 1 >= quizzes.length) → リザルト画面へ
else setCurrentIndex(prev => prev + 1), setCharacterState('idle')
```

### `src/components/quiz/SwipeCard.tsx`

Framer Motionを使ったスワイプカードコンポーネント。

```typescript
type Props = {
  quiz: Quiz;
  onSwipeConfirm: (direction: 'left' | 'right') => void;
  onDragStart: () => void;
  onDragCancel: () => void;
};
```

- `useMotionValue(0)` で x座標を追跡
- `useTransform(x, [-300, 0, 300], [-15, 0, 15])` でカードの回転角を計算
- `onDragEnd` で閾値（`window.innerWidth * 0.3`）を超えていれば `onSwipeConfirm` を呼ぶ

### `src/components/quiz/ChoiceIndicator.tsx`

- カード左右に選択肢テキストを表示するコンポーネント
- `dragProgress`（-1〜1）をpropsで受け取り、強調度合いを変える
- タップボタンとしても機能する（`onClick` で `onSwipeConfirm` を呼ぶ）

### `src/components/character/Character.tsx`

- `characterState: CharacterState` をpropsで受け取る
- `AnimatePresence` + `variants` で状態切り替えアニメーション
- 内部で `CharacterFace.tsx` をレンダリングする

### `src/components/character/CharacterFace.tsx`

- 各 `CharacterState` に対応するSVGを返す
- シンプルな円形ベースのSVGキャラクター

### リザルト画面（`app/result/[setId]/page.tsx`）

- Client Component
- sessionStorageから `AnswerRecord[]` を読み込む
- 正答率を計算してキャラクター状態を決定する
- 「もう一度」: sessionStorageをクリアして `/play/[setId]` へ遷移
- 「トップへ」: sessionStorageをクリアして `/` へ遷移

### 管理画面（`app/admin/page.tsx`）

- Client Component
- `useQuizStore` でセット一覧を取得して表示
- 削除時は確認ダイアログ（`window.confirm` または インラインUI）を表示する

### セット編集画面（`app/admin/set/new/page.tsx`, `app/admin/set/[id]/edit/page.tsx`）

- Client Component
- セットのタイトル・説明フォーム + クイズ一覧インライン管理
- 「+ クイズを追加」で `QuizModal` を開く
- 「保存する」でlocalStorage保存 → `/admin` へリダイレクト

### `src/components/admin/QuizModal.tsx`

- `isOpen` / `onClose` / `onSave` / `initialQuiz?` をpropsで受け取る
- 内部に `QuizForm` を持つ
- 新規追加と編集の両方で使用する

---

## プレイセッションのデータフロー

```
/play/[setId] 開始
    ↓ sessionStorage をクリア
プレイ中
    ↓ 回答ごとに AnswerRecord を sessionStorage に追記
全問回答
    ↓ router.push('/result/[setId]')

/result/[setId] 表示
    ↓ sessionStorage から AnswerRecord[] を読み込む
リザルト表示完了・離脱
    ↓ sessionStorage をクリア
```

---

## 影響範囲の分析

### 新規作成ファイル（既存ファイルへの影響なし）

初回実装のため、すべてのファイルが新規作成。

### 注意が必要な実装ポイント

| ポイント | 対応 |
| --- | --- |
| SSR時にlocalStorage/sessionStorageにアクセスできない | `storage.ts` ラッパーで `typeof window === 'undefined'` チェック |
| ページ間でのAnswerRecord受け渡し | sessionStorageを使用（URLパラメータや router.state は使わない） |
| クイズ取得前のローディング状態 | localStorageの初期読み込みが完了するまで空配列を返す。ローディングUIは必要最小限に |
| セット削除時のクイズ連鎖削除 | `deleteSet` 内で対象 `setId` を持つクイズもまとめて削除する |
| スワイプ閾値の計算 | `window.innerWidth` はClient Component内の `onDragEnd` コールバック内で参照する |
