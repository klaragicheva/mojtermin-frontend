// @ts-check
const {_electron: electron} = require('playwright')
const {test, expect} = require('@playwright/test');

test('has title', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', {name: 'Get started'}).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*intro/);
});

test('example test', async () => {
    const electronApp = await electron.launch({ args: ['.'] })
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        // This runs in Electron's main process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.isPackaged;
    });

    expect(isPackaged).toBe(false);

    // Wait for the first BrowserWindow to open
    // and return its Page object
    const window = await electronApp.firstWindow()
    await window.screenshot({ path: 'intro.png' })

    // close app
    await electronApp.close()
}, 6000);
