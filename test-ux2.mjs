import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const SS_DIR = '/tmp/quiz-ux-screenshots2';
mkdirSync(SS_DIR, { recursive: true });

let step = 0;
async function shot(page, name) {
  step++;
  const file = `${SS_DIR}/${String(step).padStart(2,'0')}-${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`[screenshot] URL=${page.url()} -> ${file}`);
  return file;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  // モバイルサイズ (iPhone 14)
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // ---- TOP ----
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500); // localStorage初期化待ち
  await shot(page, 'top');
  console.log('[info] sets found:', await page.locator('a[href^="/play"]').count());

  // スタートボタンのhrefを取得
  const startHref = await page.locator('a[href^="/play"]').first().getAttribute('href').catch(() => null);
  console.log('[info] start link href:', startHref);

  // ---- PLAY PAGE ----
  if (startHref) {
    await page.goto(`${BASE}${startHref}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800); // コンポーネントレンダリング待ち
    await shot(page, 'play-initial');
    console.log('[info] play page body text (first 200):', (await page.locator('body').innerText()).slice(0, 200));

    // カード要素の確認
    const questionText = await page.locator('p, h2, h3').first().textContent().catch(() => '');
    console.log('[info] first text element:', questionText);

    // 選択肢ボタンの確認
    const allBtns = await page.locator('button').all();
    console.log(`[info] buttons on play page: ${allBtns.length}`);
    for (const btn of allBtns) {
      const txt = await btn.textContent();
      const box = await btn.boundingBox();
      console.log(`  button: "${txt?.trim()}" size=${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'n/a'}`);
    }

    // カードエリアの確認
    const cards = await page.locator('[class*="card"], [class*="Card"]').all();
    console.log(`[info] card elements: ${cards.length}`);
    for (const c of cards) {
      const box = await c.boundingBox();
      const cls = await c.getAttribute('class');
      console.log(`  card class="${cls?.slice(0,60)}" size=${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'n/a'}`);
    }

    // 選択肢ラベル (A/B)
    const choiceLabels = await page.locator('text=/^[AB]$/').all();
    console.log(`[info] choice labels (A/B): ${choiceLabels.length}`);

    // 右スワイプシミュレーション
    const cardEl = page.locator('[class*="card"], [class*="Card"]').first();
    if (await cardEl.count() > 0) {
      const box = await cardEl.boundingBox();
      if (box) {
        console.log('[info] attempting right swipe on card...');
        await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
        await page.mouse.down();
        for (let i = 1; i <= 15; i++) {
          await page.mouse.move(box.x + box.width/2 + i*10, box.y + box.height/2);
          await page.waitForTimeout(30);
        }
        await page.mouse.up();
        await page.waitForTimeout(800);
        await shot(page, 'play-after-swipe-right');
        console.log('[info] URL after swipe:', page.url());
      }
    }

    // 左スワイプシミュレーション
    if (await cardEl.count() > 0) {
      const box = await cardEl.boundingBox();
      if (box) {
        console.log('[info] attempting left swipe on card...');
        await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
        await page.mouse.down();
        for (let i = 1; i <= 15; i++) {
          await page.mouse.move(box.x + box.width/2 - i*10, box.y + box.height/2);
          await page.waitForTimeout(30);
        }
        await page.mouse.up();
        await page.waitForTimeout(800);
        await shot(page, 'play-after-swipe-left');
      }
    }

    // タップ操作で全問答える
    console.log('[info] answering all questions by tapping choice A...');
    for (let i = 0; i < 10; i++) {
      const choiceA = page.locator('button').filter({ hasText: /^A$/ }).first();
      if (await choiceA.count() > 0) {
        await choiceA.click();
        await page.waitForTimeout(1400); // フィードバック待ち
        if (page.url().includes('/result/')) {
          console.log('[info] reached result page!');
          break;
        }
      } else {
        // Aラベルの周辺をクリック
        const leftArea = page.locator('[class*="choice"], [class*="Choice"], [class*="indicator"], [class*="Indicator"]').first();
        if (await leftArea.count() > 0) {
          await leftArea.click();
          await page.waitForTimeout(1400);
        } else break;
      }
    }
    await shot(page, 'play-end-or-result');
    console.log('[info] final URL:', page.url());
  }

  // ---- ADMIN: セット編集 ----
  await page.goto(`${BASE}/admin`);
  await page.waitForLoadState('networkidle');
  await shot(page, 'admin');

  const editBtn = page.locator('a[href*="/edit"], button').filter({ hasText: /編集/ }).first();
  if (await editBtn.count() > 0) {
    await editBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await shot(page, 'admin-edit');
    console.log('[info] edit page URL:', page.url());
    console.log('[info] edit page body:', (await page.locator('body').innerText()).slice(0, 300));
  }

  // ---- 新規セット作成フロー ----
  await page.goto(`${BASE}/admin/set/new`);
  await page.waitForLoadState('networkidle');
  await shot(page, 'new-set-blank');

  // タイトル入力
  await page.locator('input').first().fill('テストセット');
  // クイズ追加ボタン
  const addQuizBtn = page.locator('button').filter({ hasText: /クイズを追加|追加/ }).first();
  if (await addQuizBtn.count() > 0) {
    await addQuizBtn.click();
    await page.waitForTimeout(300);
    await shot(page, 'new-set-add-quiz');
    // 問題文入力
    const inputs = await page.locator('input, textarea').all();
    console.log(`[info] inputs after adding quiz: ${inputs.length}`);
    for (let i = 0; i < Math.min(inputs.length, 5); i++) {
      const ph = await inputs[i].getAttribute('placeholder') ?? '';
      console.log(`  input[${i}] placeholder="${ph}"`);
    }
  }

  await browser.close();
  console.log(`\nスクリーンショット: ${SS_DIR}`);
})();
