import electron from 'electron';
import robot from 'robotjs';
import { EUserInputType } from './types';
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: electron.BrowserWindow | null;

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
        mainWindow = null
    })
}

electron.ipcMain.on('remoteControl', (_e: electron.IpcMainEvent, userInputs: any[]) => {
    for (let x = 0; x < userInputs.length; x++) {
        const userInput = userInputs[x];
        console.log(userInput);

        switch (userInput.userInputType) {
            case EUserInputType.Keyboard:
                if (userInput?.event?.key && userInput.event.key.length === 1) {
                    robot.typeString(userInput.event.key)
                }
                break;
            case EUserInputType.MouseMove:
                if (userInput?.event?.x && userInput?.event?.y) {
                    // robot.moveMouseSmooth(userInput.event.x, userInput.event.y);
                    robot.moveMouse(userInput.event.x, userInput.event.y);
                }
                break;
            case EUserInputType.MouseClick:
                robot.mouseClick('left');
                break;
            default:
                break;
        }
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.