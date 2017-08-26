'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const Menu = electron.Menu;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  app.quit();
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = 'vortexOrder';//path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

var mainWindow = null, settingWindow = null;
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});
let menu;
const template = [
  {
    label: 'Setting',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      {
        label: 'edit server address',
        click() { openSetting(); }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About Author',
        click() { require('electron').shell.openExternal('https://github.com/wanghsinche/'); }
      }
    ]
  }
];

if (process.platform !== 'darwin') {
  menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024 + 500, height: 800 + 100, 'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    webPreferences: {
      nativeWindowOpen: true
    }
  });
  mainWindow.setMenu(null);
  // mainWindow.setMenu(menu);
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html?#Home');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

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


ipcMain.on('update-hostname', (event) => {
  mainWindow.webContents.send('update-hostname');
});

ipcMain.on('open-setting', (event) => {
  openSetting();
});

function openSetting() {
    settingWindow = new BrowserWindow({
      modal: true,
      parent: mainWindow,
      frame: false,
      resizable: false,
      show: false,
      width: 300,
      height: 300,
      x: 500,
      y: 250
    });
    settingWindow.setMenu(null);
    settingWindow.loadURL('file://' + __dirname + '/setting.html');
    settingWindow.once('ready-to-show', () => {
      settingWindow.show();
    });
    settingWindow.on('close', function () {
      settingWindow = null;
    });
}


