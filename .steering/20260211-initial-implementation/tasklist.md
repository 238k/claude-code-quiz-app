# 初回実装 タスクリスト

## 凡例

- `[ ]` 未着手
- `[x]` 完了

---

## Phase 1: 環境セットアップ

- [ ] 1-1. `create-next-app` でNext.jsプロジェクトを作成する（TypeScript・Tailwind・ESLint・App Router・src/ディレクトリ・`@/*`エイリアス）
- [ ] 1-2. `framer-motion` をインストールする
- [ ] 1-3. Tailwind CSS v4 に更新する（postcss.config.mjs の設定変更）
- [ ] 1-4. `src/app/globals.css` を Tailwind CSS v4 形式（`@import "tailwindcss"` + `@theme`）に書き換える
- [ ] 1-5. Google Fonts（Noto Sans JP）を `app/layout.tsx` で設定する
- [ ] 1-6. `npm run dev` でアプリが起動することを確認する

---

## Phase 2: 基盤層

- [ ] 2-1. `src/types/index.ts` を作成する（`Quiz` / `QuizSet` / `AnswerRecord` / `CorrectAnswer` / `CharacterState` / `SwipeState`）
- [ ] 2-2. `src/lib/storage.ts` を作成する（`localStore` / `sessionStore` ラッパー）
- [ ] 2-3. `src/lib/storageKeys.ts` を作成する（`STORAGE_KEYS` 定数：`QUIZZES` / `SETS` / `ANSWER_SESSION`）
- [ ] 2-4. `src/lib/id.ts` を作成する（`generateId` 関数）
- [ ] 2-5. `src/data/seed.ts` を作成する（1セット・5問以上のサンプルデータ）

---

## Phase 3: 状態管理層

- [ ] 3-1. `src/context/QuizStoreContext.tsx` を作成する
  - `QuizStoreContext` の定義
  - `QuizStoreProvider` の実装（初期ロード・seedデータ投入・CRUD操作・localStorage同期）
- [ ] 3-2. `src/hooks/useQuizStore.ts` を作成する（Context参照ラッパー）
- [ ] 3-3. `src/hooks/useAnswerSession.ts` を作成する（sessionStorage経由の`AnswerRecord[]`管理）
- [ ] 3-4. `src/app/layout.tsx` を更新して `QuizStoreProvider` でラップする

---

## Phase 4: 管理画面

- [ ] 4-1. `src/components/admin/SetList.tsx` を作成する（セット一覧・編集/削除ボタン）
- [ ] 4-2. `src/components/admin/SetForm.tsx` を作成する（タイトル・説明の入力フォーム）
- [ ] 4-3. `src/components/admin/QuizList.tsx` を作成する（セット内クイズ一覧・編集/削除ボタン）
- [ ] 4-4. `src/components/admin/QuizForm.tsx` を作成する（問題文・選択肢・正解・解説の入力フォーム）
- [ ] 4-5. `src/components/admin/QuizModal.tsx` を作成する（QuizFormをラップするモーダル）
- [ ] 4-6. `src/app/admin/page.tsx` を作成する（管理トップ・セット一覧画面）
- [ ] 4-7. `src/app/admin/set/new/page.tsx` を作成する（セット作成画面）
- [ ] 4-8. `src/app/admin/set/[id]/edit/page.tsx` を作成する（セット編集画面）
- [ ] 4-9. 管理画面の動作確認（セット・クイズのCRUDが正常に動作し、localStorageに保存されること）

---

## Phase 5: キャラクターコンポーネント

- [ ] 5-1. `src/components/character/CharacterFace.tsx` を作成する（各`CharacterState`に対応するSVG表情）
- [ ] 5-2. `src/components/character/Character.tsx` を作成する（Framer Motionによる状態切り替えアニメーション）

---

## Phase 6: プレイ画面

- [ ] 6-1. `src/components/quiz/ChoiceIndicator.tsx` を作成する（左右の選択肢ラベル・強調表示・タップボタン）
- [ ] 6-2. `src/components/quiz/SwipeCard.tsx` を作成する
  - Framer Motionの `motion.div` + `drag="x"` + `dragConstraints`
  - `useMotionValue` / `useTransform` でカード回転角を計算
  - `onDragEnd` でスワイプ閾値判定・回答確定
  - カードが吹き飛ぶアニメーション（`animate` + `AnimatePresence`）
- [ ] 6-3. `src/components/quiz/CardStack.tsx` を作成する（現在のカードと背後のスタック表示）
- [ ] 6-4. `src/app/play/[setId]/page.tsx` を作成する
  - セットのクイズ取得・プレイセッション初期化
  - `currentIndex` / `swipeState` / `characterState` の状態管理
  - 回答フロー（スワイプ確定 → フィードバック → 次の問題 / リザルト遷移）
  - 途中終了確認ダイアログ
- [ ] 6-5. プレイ画面の動作確認（スワイプ・タップ・キャラクターリアクション・全問終了後の遷移）

---

## Phase 7: リザルト画面

- [ ] 7-1. `src/components/result/ScoreSummary.tsx` を作成する（正解数・正答率・キャラクター表示）
- [ ] 7-2. `src/components/result/ReviewCard.tsx` を作成する（1問分の振り返り表示）
- [ ] 7-3. `src/app/result/[setId]/page.tsx` を作成する
  - sessionStorageから`AnswerRecord[]`を読み込む
  - 正答率計算・キャラクター状態決定
  - 「もう一度」「トップへ」ボタンの実装
- [ ] 7-4. リザルト画面の動作確認（スコア表示・振り返り一覧・ボタン動作）

---

## Phase 8: トップ画面

- [ ] 8-1. `src/app/page.tsx` を更新する（セット一覧・スタートボタン・管理画面リンク・空状態の表示）
- [ ] 8-2. トップ画面の動作確認（セット選択 → プレイ画面遷移）

---

## Phase 9: 品質チェック

- [ ] 9-1. `npm run lint` でエラーがないことを確認する
- [ ] 9-2. `npm run type-check` で型エラーがないことを確認する
- [ ] 9-3. `npm run build` でビルドが成功することを確認する
- [ ] 9-4. モバイル表示（スマートフォンサイズ）でレイアウトが崩れていないことを確認する
- [ ] 9-5. エンドツーエンドの動作確認
  - [ ] トップ画面でセットを選択してプレイを開始できる
  - [ ] スワイプで全問回答してリザルト画面に遷移できる
  - [ ] リザルト画面から「もう一度」でプレイ画面に戻れる
  - [ ] リザルト画面から「トップへ」でトップ画面に戻れる
  - [ ] 管理画面でセット・クイズを作成してトップ画面に反映される
  - [ ] ブラウザをリロードしてもデータが保持されている

---

## 完了条件

- `npm run lint` がエラーなし
- `npm run build` が成功
- Phase 9 のエンドツーエンド確認がすべてパス
