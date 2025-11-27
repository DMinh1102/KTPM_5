'use strict';
const Store = require('electron-store');

const config = new Store({
  defaults: {
    darkMode: false,
    isSyncScroll: false,
    isHtml: false
  }
});

module.exports = config;
