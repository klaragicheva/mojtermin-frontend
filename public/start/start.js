const { app, ipcMain, BrowserWindow } = require('electron');

const { createAuthWindow, createLogoutWindow } = require('../auth-process');
const createAppWindow = require('../main');
const destroyAppWindow = require('../main');
const authService = require('../../services/auth-service');
const apiService = require('../../services/api-service');

async function showWindow() {
    try {
        await authService.refreshTokens();
        createAppWindow();
    } catch (err) {
        createAuthWindow();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // Handle IPC messages from the renderer process.
    ipcMain.handle('auth:get-profile', authService.getProfile);
    ipcMain.handle('api:get-private-data', apiService.getPrivateData);
    ipcMain.on('auth:log-out', () => {
        //tuka treba da te odnese na login
        //BrowserWindow.getAllWindows().forEach(window => window.close());
        createLogoutWindow();
        createAppWindow.destroyAppWindow();
        createAuthWindow();

    });

    showWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});