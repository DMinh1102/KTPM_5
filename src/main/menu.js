// src/main/menu.js
const { Menu, BrowserWindow } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu:new');
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu:open');
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu:save');
        }
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu:saveAs');
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);