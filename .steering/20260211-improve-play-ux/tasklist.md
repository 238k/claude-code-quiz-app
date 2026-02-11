# tasklist.md — プレイ画面 UX 改善

## タスク一覧

### Task 1: SwipeCard — スワイプ閾値を緩和
- [x] `src/components/quiz/SwipeCard.tsx`
  - `handleDrag` と `handleDragEnd` 内の `threshold` を `window.innerWidth * 0.3` → `window.innerWidth * 0.2` に変更

### Task 2: ChoiceIndicator — ドロップゾーンデザインに刷新
- [x] `src/components/quiz/ChoiceIndicator.tsx`
  - レイアウトを縦積み（矢印 → ラベル → テキスト）の大きなゾーン型に変更
  - 未ドラッグ時: `opacity-60`、ドラッグ中（この方向）: `opacity-100` + ハイライト色
  - `min-h-20`（80px 以上）を確保
  - 選択肢テキストを `text-base` に拡大

### Task 3: PlayPage — レイアウト変更と文字サイズ改善
- [x] `src/app/play/[setId]/page.tsx`
  - ChoiceIndicator の配置をカードの「上」に変更（現在は上のまま位置は変わらないが、サイズが大きくなるため flex の順序を確認）
  - ヘッダー問題番号: `text-sm text-gray-500` → `text-base text-gray-700`
  - 終了ボタン: `text-gray-400` → `text-gray-600`
  - フィードバック「正解！/不正解...」: `text-lg` → `text-2xl`

### Task 4: SwipeCard — 問題文の文字サイズ拡大
- [x] `src/components/quiz/SwipeCard.tsx`
  - 問題文: `text-base` → `text-lg`、`text-gray-800` → `text-gray-900`

### Task 5: 品質チェック
- [x] `npm run lint` — エラー 0 件を確認
