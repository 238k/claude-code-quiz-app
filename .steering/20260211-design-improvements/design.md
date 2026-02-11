# デザイン改善 - 設計

## 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/app/play/[setId]/page.tsx` | プログレスバー追加、カード高さ上限撤廃 |
| `src/components/quiz/ChoiceIndicator.tsx` | 選択肢テキスト色の変更 |
| `src/app/page.tsx` | セットタイトルのフォントサイズ変更 |

---

## 1. プレイ画面：カード高さ上限撤廃

**現状**
```tsx
<div className="relative flex-1 min-h-48 max-h-72">
```

**変更後**
```tsx
<div className="relative flex-1 min-h-48">
```

`max-h-72` を削除し、`flex-1` で残り空間を全て使う。

---

## 2. プレイ画面：プログレスバー追加

ヘッダーの `1 / 7` テキストの直下に幅100%のバーを追加する。

```tsx
{/* ヘッダー */}
<div className="px-5 pt-5 pb-2">
  <div className="flex items-center justify-between mb-2">
    <span className="text-base font-medium text-gray-700">
      {currentIndex + 1} / {quizzes.length}
    </span>
    <button ...>× 終了</button>
  </div>
  {/* プログレスバー */}
  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
      style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
    />
  </div>
</div>
```

---

## 3. ChoiceIndicator：テキスト色変更

**現状** (`src/components/quiz/ChoiceIndicator.tsx`)
```tsx
<p className="text-sm text-gray-700 line-clamp-3">
```

**変更後**
```tsx
<p className="text-sm text-gray-900 line-clamp-3">
```

---

## 4. トップページ：セットタイトルのサイズ変更

**現状** (`src/app/page.tsx`)
```tsx
<p className="font-semibold text-gray-800 text-sm truncate">
```

**変更後**
```tsx
<p className="font-semibold text-gray-800 text-base truncate">
```

---

## 影響範囲

- 既存のロジック・状態管理には一切影響しない
- スタイルのみの変更
