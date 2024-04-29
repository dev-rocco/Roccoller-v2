const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('node:path');
const fs = require("fs");

const CFG_Path = "./config.json";
let cfgContent = JSON.parse(fs.readFileSync(CFG_Path));

// In main scope for access from IPC
let mainWindow;
let configWindow;
let configWindowOpen = false;
let welcomeWindow;

function createWindow(file, windowParams) {
    const TEMP_WINDOW = new BrowserWindow(windowParams);
    TEMP_WINDOW.loadFile(file);
    TEMP_WINDOW.setMenuBarVisibility(false);
    return TEMP_WINDOW;
}
function createMainWindow() {
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
        alwaysOnTop: !!parseInt(cfgContent.AOT)
    });
    mainWindow.on("closed", function(){
        app.quit();
    });
}

// On app load (initialisation)
app.whenReady().then(() => {
    if (parseInt(cfgContent.initialised) == "0")
    {
        welcomeWindow = createWindow("src/welcome.html", {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js")
            },
            alwaysOnTop: true
        });
        welcomeWindow.on("closed", function(){
            let tempCfgContent = JSON.parse(fs.readFileSync(CFG_Path));
            tempCfgContent.initialised = "1";
            fs.writeFileSync(CFG_Path, JSON.stringify(tempCfgContent));
        });
    }
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle config requests
ipcMain.on("cfgRequest", (event, args) => {
    mainWindow.webContents.send("cfgReturn", cfgContent);
});
ipcMain.on("cfgOpenWindow", (event, args) => {
    if (configWindowOpen == false)
    {
        configWindow = createWindow("src/config.html", {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js")
            },
            resizable: false,
            minimizable: false,
            alwaysOnTop: true
        });
    }
    configWindow.on("closed", function(){
        configWindowOpen = false;
    });
    configWindowOpen = true;
});
ipcMain.on("cfgUpdate", (event, args) => {
    console.log("Saving new configuration object to "+CFG_Path);

    // Update changes live (no need to reset application)
    mainWindow.webContents.send("cfgReturn", args);
    mainWindow.setSize(parseInt(args.width), parseInt(args.height));
    mainWindow.alwaysOnTop = !!parseInt(args.AOT);
    console.log(!!parseInt(args.AOT));

    // Store new data to config.json
    fs.writeFileSync(CFG_Path, JSON.stringify(args));

    // Close and reset config window
    if (configWindowOpen) configWindow.close();
    configWindowOpen = false;
});
ipcMain.on("quit", (event, args) => {
    switch(args)
    {
        case "mainWindow":
            mainWindow.close();
            break;
        case "configWindow":
            configWindow.close();
            configWindowOpen = false;
            break;
        case "welcomeWindow":
            welcomeWindow.close();
            break;
    }
});