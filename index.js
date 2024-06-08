const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const fs = require("fs");

const CFG_PATH = "./config.json";
let CFG_DEFAULT = {
    initialised:"0",
    text:"Welcome to Roccoller v2! Press C to open the configuration menu. Here, you can change the text, colours, font, speed and more!",
    textColour:"#ffff00",
    bgColour:"#000000",
    fontFamily:"Arial",
    fontSize:"32",
    margin:"0",
    speed:"100",
    FPS:"60",
    AOT:"1",
    width:"800",
    height:"40",
    autoHeight: "1"
};
if (!fs.existsSync(CFG_PATH))
{
    fs.writeFileSync(CFG_PATH, JSON.stringify(CFG_DEFAULT));
    console.log(CFG_PATH+" created");
}
let cfgContent = JSON.parse(fs.readFileSync(CFG_PATH));

// In main scope for access from IPC
let mainWindow;
const MAIN_WINDOW_CLOSE_EVENT_FUNC = function(){ app.quit(); };
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
        resizable: false,
        minimizable: false,
        alwaysOnTop: !!parseInt(cfgContent.AOT)
    });

    mainWindow.on("closed", MAIN_WINDOW_CLOSE_EVENT_FUNC);
}
function updateMainWindow()
{
    mainWindow.off("closed", MAIN_WINDOW_CLOSE_EVENT_FUNC);
    mainWindow.close();
    createMainWindow();
}

// On app load (initialisation)
app.whenReady().then(() => {
    if (parseInt(cfgContent.initialised) == "0")
    {
        CFG_DEFAULT.width = screen.getPrimaryDisplay().workAreaSize.width;
        cfgContent.initialised = "1";
        cfgContent.width = CFG_DEFAULT.width;
        fs.writeFileSync(CFG_PATH, JSON.stringify(cfgContent));

        welcomeWindow = createWindow("src/welcome.html", {
            width: 800,
            height: 250,
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
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle config requests
ipcMain.on("cfgRequest", (event, args) => {
    event.sender.on("did-finish-load", function(){
        event.sender.send("cfgReturn", cfgContent);
    });
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
    if (args == "default")
    {
        cfgContent = CFG_DEFAULT;
        cfgContent.initialised = "1";
        updateMainWindow();

        if (configWindowOpen)
            configWindow.close();
        configWindowOpen = false;
    }
    else
    {
        console.log("Saving new configuration object to "+CFG_PATH);

        // Update changes live (no need to reset application)
        if (args.width == "default") args.width = CFG_DEFAULT.width;
        cfgContent = args;
        updateMainWindow();

        // Store new data to config.json
        fs.writeFileSync(CFG_PATH, JSON.stringify(args));

        // Close and reset config window
        if (configWindowOpen)
            configWindow.close();
        configWindowOpen = false;
    }
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