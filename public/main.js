const {app, BrowserWindow, Notification, ipcMain} = require('electron')
const path = require('path');

let win = null;

function createAppWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800, //minWidth:600,
        //maxWidth:1000,
        height: 600, //minHeight:400,
        //maxHeight:800,
        backgroundColor: 'white',
        title: 'Moj Termin',
        icon: "C:\\FERI-MAGISTERJI\\1-LETNIK\\ST\\projekt\\projekt_mojtermin\\electron-app\\mojtermin-frontend\\public\\images\\img.png",
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //win.removeMenu()
    //load the index.html from a url
    win.loadURL('http://localhost:3000');
    //win.loadFile('./public/renderer/home.html');

    //const win2 = new BrowserWindow()
    //win.loadFile('public/index.html');

    // Open the DevTools.
    //win.webContents.openDevTools()


    win.on('closed', () => {
        win = null;
    });
}

function destroyAppWindow() {
    if (!win) return;
    win.close();
    win = null;
}

module.exports = {
    createAppWindow,
    destroyAppWindow
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
/*app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})*/

/*app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
