import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const SS_DIR = '/tmp/quiz-ux-screenshots3';
mkdirSync(SS_DIR, { recursive: true });

let step = 0;
async function shot(page, name) {
  step++;
  const file = `${SS_DIR}/${String(step).padStart(2,'0')}-${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(BASE);
  await page.waitForTimeout(600);
  const startHref = await page.locator('a[href^="/play"]').first().getAttribute('href');
  console.log('[info] navigating to:', startHref);

  await page.goto(`${BASE}${startHref}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
  await shot(page, '01-play-initial');

  // カードエリアの詳細情報を取得
  const cardInfo = await page.evaluate(() => {
    // カードコンテナを特定
    const allDivs = document.querySelectorAll('div');
    const results = [];
    for (const div of allDivs) {
      const style = window.getComputedStyle(div);
      const rect = div.getBoundingClientRect();
      if (rect.height > 10 && rect.width > 50 &&
          (style.position === 'absolute' || style.borderRadius.includes('px'))) {
        results.push({
          class: div.className.slice(0, 80),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          position: style.position,
          bg: style.backgroundColor,
          shadow: style.boxShadow.slice(0, 60),
          zIndex: style.zIndex,
          opacity: style.opacity,
        });
      }
    }
    return results.slice(0, 20);
  });

  console.log('\n[card area elements]:');
  for (const el of cardInfo) {
    console.log(`  ${el.position} class="${el.class}"`);
    console.log(`    rect: ${el.rect.x},${el.rect.y} ${el.rect.w}x${el.rect.h}`);
    console.log(`    bg:${el.bg} shadow:${el.shadow.slice(0,40)} opacity:${el.opacity}`);
  }

  // 選択肢ボタンをクリックして次の問題へ進む
  console.log('\n[testing tap on choice buttons]');
  const choiceButtons = await page.locator('button').all();
  for (const btn of choiceButtons) {
    const txt = await btn.textContent();
    const box = await btn.boundingBox();
    if (box && txt?.includes('東京')) {
      console.log('[info] tapping left choice (A)');
      await btn.click();
      await page.waitForTimeout(1500); // フィードバック待ち
      await shot(page, '02-after-tap-a');
      console.log('[info] URL after tap:', page.url());
      console.log('[info] body text:', (await page.locator('body').innerText()).slice(0, 150));
      break;
    }
  }

  // 右側の選択肢ボタンをクリック
  const choiceButtons2 = await page.locator('button').all();
  for (const btn of choiceButtons2) {
    const txt = await btn.textContent();
    if (txt?.includes('大阪') || txt?.includes('B')) {
      console.log('[info] tapping right choice (B)');
      await btn.click();
      await page.waitForTimeout(1500);
      await shot(page, '03-after-tap-b');
      console.log('[info] body text:', (await page.locator('body').innerText()).slice(0, 150));
      break;
    }
  }

  // 全問答えてリザルトページへ
  for (let i = 0; i < 10; i++) {
    if (page.url().includes('/result/')) break;
    const btns = await page.locator('button').all();
    let clicked = false;
    for (const btn of btns) {
      const txt = await btn.textContent();
      if (txt && txt.length > 2 && !txt.includes('終了')) {
        await btn.click();
        await page.waitForTimeout(1500);
        clicked = true;
        break;
      }
    }
    if (!clicked) break;
  }
  await shot(page, '04-result-or-final');
  console.log('[info] final URL:', page.url());

  // リザルトページの確認
  if (page.url().includes('/result/')) {
    console.log('[info] result page content:', (await page.locator('body').innerText()).slice(0, 400));
    await shot(page, '05-result-page');
  }

  await browser.close();
  console.log(`\nスクリーンショット: ${SS_DIR}`);
})();
