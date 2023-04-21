// @ts-check
const {_electron: electron} = require('playwright')
const {test, expect} = require('@playwright/test');
//import { test, expect } from '@playwright/experimental-ct-react';
import App from '../src/App';

/*test('should work', async ({ mount }) => {
    const component = await mount(<App />);
    await expect(component).toContainText('Electron app');
});*/


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
