// src/main/ipc-handlers.js
const { ipcMain, dialog } = require('electron');
const Store = require('electron-store');
const store = new Store();
// File dialogs
ipcMain.handle('dialog:openFile', async () => {
  return await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
});

ipcMain.handle('dialog:saveFile', async () => {
  return await dialog.showSaveDialog({
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
});

ipcMain.handle('dialog:confirmSave', async () => {
  const result = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Save', 'Don\'t Save', 'Cancel'],
    defaultId: 0,
    message: 'Do you want to save changes?',
    detail: 'Your changes will be lost if you don\'t save them.'
  });
  
  const actions = ['save', 'dontSave', 'cancel'];
  return actions[result.response];
});

// Window title
ipcMain.on('window:setTitle', (event, title) => {
  const window = require('electron').BrowserWindow.fromWebContents(event.sender);
  window.setTitle(title);
});

// Notifications
ipcMain.on('notification:error', (event, { title, message }) => {
  dialog.showErrorBox(title, message);
});

ipcMain.on('notification:success', (event, { message }) => {
  // You could use electron-notifier or similar here
  console.log('Success:', message);
});

ipcMain.on('electron-store-get-data', (event, arg) => {
  // Handle the request and return data
  event.returnValue = {}; // sendSync expects a return value
});
