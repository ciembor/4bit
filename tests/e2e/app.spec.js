const { test, expect } = require('@playwright/test');

async function blockThirdPartyRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://platform.twitter.com/**', (route) => route.abort());
}

function nestedShareTarget(href, key) {
  const shareUrl = new URL(href);
  return new URL(shareUrl.searchParams.get(key));
}

function minttyDragScheme(target) {
  const hashParams = new URLSearchParams(target.hash.replace(/^#\?/, ''));

  return hashParams.get('scheme');
}

function compressedSettings(target) {
  return target.searchParams.get('s');
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
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about/');
  await expect(page.getByRole('link', { name: 'Download Scheme' })).toBeVisible();

  const targets = await shareTargets(page);

  expect(targets.x.origin).toBe('https://ciembor.github.io');
  expect(targets.x.pathname).toBe('/4bit/');
  expect(compressedSettings(targets.x)).toMatch(/^2[A-Za-z0-9_-]+$/);
  expect(minttyDragScheme(targets.x)).toBeNull();
  expect(targets.linkedIn.search).toBe(targets.x.search);
  expect(minttyDragScheme(targets.linkedIn)).toMatch(/^([0-9A-F]{6}:){18}[0-9A-F]{6}$/);
  expect(targets.facebook.href).toBe(targets.linkedIn.href);
});

test('opens the about page from the header', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'About' }).click();

  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { name: 'About 4bit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Editor' })).toHaveAttribute('href', '../');
  await expect(page.getByRole('link', { name: 'Download Scheme' })).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Export scheme to the configuration file' })).toBeHidden();
  await expect(page.getByText(/terminal color themes/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create a Terminal Color Scheme' })).toHaveAttribute('href', '../');
});

test('hydrates scheme state from the query string and keeps share links in sync', async ({ page }) => {
  await page.goto('/?hue=12&colorMode=duotone&hueDistance=18&dyeScope=all&background=white');

  await expect(page.locator('#dye-radio input[value="all"]')).toBeChecked();
  await expect(page.locator('#background-radio input[value="white"]')).toBeChecked();
  await expect(page.locator('#hue-set-radio input[value="duotone"]')).toBeChecked();

  const targets = await shareTargets(page);

  expect(compressedSettings(targets.x)).toMatch(/^2[A-Za-z0-9_-]+$/);
  expect(targets.x.searchParams.get('hue')).toBeNull();
  expect(targets.x.searchParams.get('colorMode')).toBeNull();
  expect(targets.x.searchParams.get('hueDistance')).toBeNull();
  expect(targets.x.searchParams.get('dyeScope')).toBeNull();
  expect(targets.x.searchParams.get('background')).toBeNull();
  expect(minttyDragScheme(targets.x)).toBeNull();
  expect(targets.linkedIn.search).toBe(targets.x.search);
  expect(minttyDragScheme(targets.linkedIn)).toMatch(/^([0-9A-F]{6}:){18}[0-9A-F]{6}$/);
  expect(targets.facebook.href).toBe(targets.linkedIn.href);
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

  await expect.poll(() => new URL(page.url()).searchParams.get('s')).toMatch(/^2[A-Za-z0-9_-]+$/);
  expect(new URL(page.url()).searchParams.get('background')).toBeNull();
  expect(new URL(page.url()).searchParams.get('dyeScope')).toBeNull();
  expect(new URL(page.url()).searchParams.get('colorMode')).toBeNull();
  await expect.poll(() => new URL(page.url()).hash).toMatch(/^#\?scheme=/);

  const targets = await shareTargets(page);

  expect(compressedSettings(targets.x)).toMatch(/^2[A-Za-z0-9_-]+$/);
  expect(targets.x.searchParams.get('background')).toBeNull();
  expect(targets.x.searchParams.get('dyeScope')).toBeNull();
  expect(targets.x.searchParams.get('colorMode')).toBeNull();
  expect(targets.x.searchParams.get('degrees')).toBeNull();
  expect(minttyDragScheme(targets.x)).toBeNull();
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
