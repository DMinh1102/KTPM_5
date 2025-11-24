// src/main/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const config = require('./config');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initConfig() {
  // Initialize default configuration if not set
  const isSyncScroll = config.get('isSyncScroll');
  if (isSyncScroll === true) {
    $syncScroll.attr('checked', true);
  } else {
    $syncScroll.attr('checked', false);
  }
  const isDarkMode = config.get('darkMode');
  changeTheme(isDarkMode);
  const isHtml = config.get('isHtml');
  clkPref(isHtml);
}

app.whenReady().then(() => {
  createWindow();
  initConfig();
  require('./menu');
  require('./ipc-handlers');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


