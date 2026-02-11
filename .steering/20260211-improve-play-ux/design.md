# design.md — プレイ画面 UX 改善

## 変更ファイル一覧

| ファイル | 変更種別 |
| --- | --- |
| `src/components/quiz/ChoiceIndicator.tsx` | 更新（ドロップゾーンデザインに刷新） |
| `src/components/quiz/SwipeCard.tsx` | 更新（閾値変更） |
| `src/app/play/[setId]/page.tsx` | 更新（レイアウト変更・文字サイズ改善） |

---

## 1. ChoiceIndicator — ドロップゾーン化

### 現在のレイアウト
```
[← A ラベル (小)] ............... [B ラベル (小) →]
┌───────────────────────────────────────────────┐
│               カード                           │
└───────────────────────────────────────────────┘
```

### 新しいレイアウト
```
┌──────────────────┐    ┌──────────────────┐
│  ←               │    │              →   │
│  A               │    │              B   │
│  [選択肢テキスト]  │    │  [選択肢テキスト]  │
└──────────────────┘    └──────────────────┘
┌───────────────────────────────────────────────┐
│               カード（ドラッグ可）              │
└───────────────────────────────────────────────┘
```

カードエリアの上に A / B ゾーンを横並びで配置する。

### ChoiceIndicator の Props（変更なし）
既存の props インターフェースはそのまま維持する。ビジュアルのみ変更。

```typescript
type Props = {
  label: string;           // "A" | "B"
  text: string;            // 選択肢テキスト
  side: 'left' | 'right';  // 矢印の向き
  progress: number;        // 0〜1（ドラッグ量）
  onTap: () => void;       // タップ時のコールバック
};
```

### ビジュアル仕様

| 状態 | opacity | scale | ボーダー色 | 背景色 |
| --- | --- | --- | --- | --- |
| 未ドラッグ | 0.6 | 1.0 | gray-200 | white |
| ドラッグ中（この方向） | 1.0 | 1.05 | rose-400（A）/ sky-400（B） | rose-50（A）/ sky-50（B） |

- 矢印サイズ: `text-2xl`
- ラベル（A/B）: `text-xl font-bold`
- 選択肢テキスト: `text-sm` → `text-base` に拡大、行数制限 `line-clamp-3`
- ゾーンの高さ: `min-h-20`（80px 以上）
- 幅: `flex-1`（左右均等）

---

## 2. SwipeCard — スワイプ閾値変更

```typescript
// 変更前
const threshold = typeof window !== 'undefined' ? window.innerWidth * 0.3 : 120;

// 変更後
const threshold = typeof window !== 'undefined' ? window.innerWidth * 0.2 : 80;
```

`handleDrag` と `handleDragEnd` の両方の `threshold` を変更する。

---

## 3. PlayPage — レイアウト変更と文字サイズ改善

### レイアウト構造

```
<div min-h-screen>
  <div max-w-lg mx-auto flex-col flex-1>
    ヘッダー（問題番号 / 終了ボタン）
    キャラクター
    <div flex-1 flex-col px-4 pb-6>
      カードスタック or フィードバックオーバーレイ   ← flex-1
      ChoiceIndicator × 2（横並び、カード下）        ← 固定高さ
    </div>
  </div>
</div>
```

現在のレイアウト（ChoiceIndicator がカードの上）から、**カードが先・ChoiceIndicator が後**に並び替える。

### 文字サイズ改善箇所

| 箇所 | 変更前 | 変更後 |
| --- | --- | --- |
| ヘッダー問題番号 | `text-sm text-gray-500` | `text-base text-gray-700` |
| 終了ボタン | `text-sm text-gray-400` | `text-sm text-gray-600` |
| カード内問題文（SwipeCard） | `text-base text-gray-800` | `text-lg text-gray-900` |
| フィードバック「正解/不正解」 | `text-lg` | `text-2xl` |

---

## 変更の影響範囲

- `CardStack.tsx` は変更不要（props 変更なし）
- `QuizModal.tsx`, `QuizForm.tsx` など管理画面側は変更不要
- 結果画面・トップページは変更不要
