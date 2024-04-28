const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('node:path');
const fs = require("fs");

const cfgPath = "./config.json";
let cfgContent = JSON.parse(fs.readFileSync(cfgPath));

// In main scope for access from IPC
let mainWindow;
let configWindow;

function createWindow(file, windowParams) {
    const TEMP_WINDOW = new BrowserWindow(windowParams);
    TEMP_WINDOW.loadFile(file);
    TEMP_WINDOW.setMenuBarVisibility(false);
    return TEMP_WINDOW;
};

// On app load (initialisation)
app.whenReady().then(() => {
    mainWindow = createWindow("src/index.html", {
        width: parseInt(cfgContent.width),
        height: parseInt(cfgContent.height),
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
        frame: false,
        alwaysOnTop: parseInt(cfgContent.alwaysOnTop)
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle renderer requests
ipcMain.on("cfgRequest", (event, args) => {
    mainWindow.webContents.send("cfgReturn", cfgContent);
});
ipcMain.on("cfgOpenWindow", (event, args) => {
    if (configWindow == undefined)
    {
        configWindow = createWindow("src/config.html", {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js")
            }
        });
    }
});
ipcMain.on("cfgUpdate", (event, args) => {
    console.log("Saving new configuration object to ./config.json");

    ipcRenderer.send("cfgReturn", args);

    configWindow.close();
    configWindow = undefined;
});