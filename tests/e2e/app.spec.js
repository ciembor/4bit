const { test, expect } = require('@playwright/test');

async function blockThirdPartyRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://platform.twitter.com/**', (route) => route.abort());
}

function nestedShareTarget(href, key) {
  const shareUrl = new URL(href);
  return new URL(shareUrl.searchParams.get(key));
}

async function shareTargets(page) {
  const xHref = await page.getByLabel('share on x').getAttribute('href');
  const linkedInHref = await page.getByLabel('share on linkedin').getAttribute('href');
  const facebookHref = await page.getByLabel('share on facebook').getAttribute('href');

  return {
    x: nestedShareTarget(xHref, 'url'),
    linkedIn: nestedShareTarget(linkedInHref, 'url'),
    facebook: nestedShareTarget(facebookHref, 'u'),
  };
}

async function checkRadioValue(page, groupSelector, value) {
  const input = page.locator(`${groupSelector} input[value="${value}"]`);
  const inputId = await input.getAttribute('id');

  await page.locator(`${groupSelector} label[for="${inputId}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page);
});

test('loads the app and renders the main editor controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#terminal-display')).toBeVisible();
  await expect(page.getByText('Welcome to fish, the friendly interactive shell')).toBeVisible();
  await expect(page.locator('#controls')).toBeVisible();
  await expect(page.locator('#advanced')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download Scheme' })).toBeVisible();

  const targets = await shareTargets(page);

  expect(targets.x.origin).toBe('https://ciembor.github.io');
  expect(targets.x.pathname).toBe('/4bit/');
  expect(targets.linkedIn.href).toBe(targets.x.href);
  expect(targets.facebook.href).toBe(targets.x.href);
});

test('hydrates scheme state from the query string and keeps share links in sync', async ({ page }) => {
  await page.goto('/?hue=12&colorMode=duotone&hueDistance=18&dyeScope=all&background=white');

  await expect(page.locator('#dye-radio input[value="all"]')).toBeChecked();
  await expect(page.locator('#background-radio input[value="white"]')).toBeChecked();
  await expect(page.locator('#hue-set-radio input[value="duotone"]')).toBeChecked();

  const targets = await shareTargets(page);

  expect(targets.x.searchParams.get('hue')).toBe('12');
  expect(targets.x.searchParams.get('colorMode')).toBe('duotone');
  expect(targets.x.searchParams.get('hueDistance')).toBe('18');
  expect(targets.x.searchParams.get('dyeScope')).toBe('all');
  expect(targets.x.searchParams.get('background')).toBe('white');
  expect(targets.linkedIn.href).toBe(targets.x.href);
  expect(targets.facebook.href).toBe(targets.x.href);
});

test('updates URL and share links when advanced options change', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('tab', { name: 'Bg' }).click();
  await checkRadioValue(page, '#background-radio', 'white');
  await expect(page.locator('#background-radio input[value="white"]')).toBeChecked();

  await page.getByRole('tab', { name: 'Dye' }).click();
  await checkRadioValue(page, '#dye-radio', 'all');
  await expect(page.locator('#dye-radio input[value="all"]')).toBeChecked();

  await page.getByRole('tab', { name: 'Color Mode' }).click();
  await checkRadioValue(page, '#hue-set-radio', 'duotone');
  await expect(page.locator('#hue-set-radio input[value="duotone"]')).toBeChecked();

  await expect.poll(() => new URL(page.url()).search).toContain('background=white');
  await expect.poll(() => new URL(page.url()).search).toContain('dyeScope=all');
  await expect.poll(() => new URL(page.url()).search).toContain('colorMode=duotone');

  const targets = await shareTargets(page);

  expect(targets.x.searchParams.get('background')).toBe('white');
  expect(targets.x.searchParams.get('dyeScope')).toBe('all');
  expect(targets.x.searchParams.get('colorMode')).toBe('duotone');
  expect(targets.x.searchParams.get('degrees')).toBeNull();
});

test('opens the export dialog and downloads an iTerm2 file', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Download Scheme' }).click();
  await expect(page.getByRole('dialog', { name: 'Export scheme to the configuration file' })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#iterm2-button').click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('4bit.itermcolors');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Export scheme to the configuration file' })).toBeHidden();
});
