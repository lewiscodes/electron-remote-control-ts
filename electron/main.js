"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
const robotjs_1 = __importDefault(require("robotjs"));
const types_1 = require("./types");
// Module to control application life.
const app = electron_1.default.app;
// Module to create native browser window.
const BrowserWindow = electron_1.default.BrowserWindow;
const path = require('path');
const url = require('url');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
    console.log('Electron Version:', process.version);
    // console.log('robot', robot);
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1500,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    });
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
electron_1.default.ipcMain.on('remoteControl', (_e, userInputs) => {
    var _a, _b, _c, _d, _f, _g;
    for (let x = 0; x < userInputs.length; x++) {
        const userInput = userInputs[x];
        console.log(userInput);
        switch (userInput.userInputType) {
            case types_1.EUserInputType.Keyboard:
                if (((_b = (_a = userInput) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0 ? void 0 : _b.key) && userInput.event.key.length === 1) {
                    robotjs_1.default.typeString(userInput.event.key);
                }
                break;
            case types_1.EUserInputType.MouseMove:
                if (((_d = (_c = userInput) === null || _c === void 0 ? void 0 : _c.event) === null || _d === void 0 ? void 0 : _d.x) && ((_g = (_f = userInput) === null || _f === void 0 ? void 0 : _f.event) === null || _g === void 0 ? void 0 : _g.y)) {
                    // robot.moveMouseSmooth(userInput.event.x, userInput.event.y);
                    robotjs_1.default.moveMouse(userInput.event.x, userInput.event.y);
                }
                break;
            case types_1.EUserInputType.MouseClick:
                robotjs_1.default.mouseClick('left');
                break;
            default:
                break;
        }
    }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
