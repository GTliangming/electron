import { app, BrowserWindow, Menu, MenuItem, dialog } from 'electron';
const url = require('url');
const path = require('path');
let mainWindow: BrowserWindow = null;
let createWindow = function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
        // fullscreenable:false,
        // maximizable:false
    })
    mainWindow.webContents.openDevTools()
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function () {
        mainWindow = null
    })
} 
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})