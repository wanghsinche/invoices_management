'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024 + 500, height: 800 + 100, 'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html?#Home');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipcMain.on('asynchronous-download', (event, url) => {

  dialog.showSaveDialog({ title: '导出数据', defaultPath: url.split('/').pop() }, function (path) {
    let writeStream = require('fs').createWriteStream(path);
    writeStream.on('close', function () {
      event.sender.send('asynchronous-reply', 'ok');
    });
    writeStream.on('open', function () {
      require('http').get(url, function (data) {
        data.pipe(writeStream);
      }).on('error', function () {
        event.sender.send('asynchronous-reply', 'fail');
      });
    });
  });



});
