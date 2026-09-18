const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const { createApp } = await import('../server/app.mjs');
  const seed = JSON.parse(fs.readFileSync(require.resolve('../server/seed.json'), 'utf8'));
  const { app, db } = createApp(seed);
  const server = app.listen(3013, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('http://127.0.0.1:3010/**', route => route.continue({ url: route.request().url().replace(':3010/', ':3013/') }));
    const url = name => 'http://127.0.0.1:3013/' + name + '.html';
    await page.goto(url('catalog'));
    await page.locator('[data-language="ru"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    assert.equal(await page.locator('[data-language="ru"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('h1').textContent(), 'Найдите новый навык');
    await page.waitForFunction(() => document.querySelector('#page-status').textContent.startsWith('Страница'));
    await page.locator('[data-theme-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.reload();
    assert.equal(await page.locator('h1').textContent(), 'Найдите новый навык');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.goto(url('index'));
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    assert.equal(await page.locator('img[data-theme-light]').first().getAttribute('src'), 'images/hero_rev1.png');
    for (const name of ['index', 'catalog', 'favorites', 'cart', 'account', 'reviews', 'admin']) {
      await page.goto(url(name));
      for (const width of [280, 320, 375, 768]) {
        await page.setViewportSize({ width, height: 800 });
        const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(node => node.scrollWidth > node.clientWidth + 1 && !['auto', 'hidden', 'clip', 'scroll'].includes(getComputedStyle(node).overflowX)).slice(0, 8).map(node => node.tagName + '.' + node.className + ':' + node.scrollWidth + '/' + node.clientWidth));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), name + ' Russian dark layout at ' + width + ': ' + overflow.join(', '));
      }
    }
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url('account'));
    const result = await page.request.post('http://127.0.0.1:3013/users', { data: {
      firstName: 'Test', lastName: 'Learner', middleName: '', birthDate: '2000-01-01',
      phone: '+375291234567', email: 'prefs@example.test', nickname: 'PrefsLearner',
      passwordMode: 'manual', password: 'Learnico9!Study', confirmPassword: 'Learnico9!Study', acceptedTerms: true
    } });
    assert.equal(result.status(), 201);
    const session = await result.json();
    await page.evaluate(data => {
      localStorage.setItem('learnico-lab10-token', data.token);
      localStorage.setItem('learnico-lab10-user', JSON.stringify(data.user));
    }, session);
    await page.reload();
    await page.locator('[data-profile-open]').waitFor({ state: 'visible' });
    await page.locator('[data-profile-open]').click();
    assert.equal(await page.locator('#profile-form [name="firstName"]').inputValue(), 'Test');
    await page.locator('#profile-form [name="firstName"]').fill('Updated');
    await page.locator('#profile-form [type="submit"]').click();
    await page.waitForFunction(() => /Profile saved|Профиль сохранён/.test(document.querySelector('#profile-message').textContent));
    assert.equal(db.get('users').find({ id: session.user.id }).value().firstName, 'Updated');
    assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('learnico-lab10-user')))).firstName, 'Updated');
    await page.locator('[data-reset-settings]').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('[data-profile-close]').click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('#logout').click();
    await page.waitForFunction(() => !localStorage.getItem('learnico-lab10-user'));
    assert.equal(await page.locator('[data-profile-open]').isHidden(), true);
    assert.deepEqual(errors, []);
    console.log('PASS: language, theme, theme images, profile, reset and persistent session.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
