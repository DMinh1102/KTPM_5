// src/models/SettingsModel.js
const EventEmitter = require('events');
const Store = require('electron-store');

class SettingsModel extends EventEmitter {
  constructor() {
    super();
    this.store = new Store();
    this.settings = this.loadSettings();
  }

  loadSettings() {
    return {
      theme: this.store.get('theme', 'light'),
      fontSize: this.store.get('fontSize', 14),
      fontFamily: this.store.get('fontFamily', 'monospace'),
      autoSave: this.store.get('autoSave', false),
      autoSaveInterval: this.store.get('autoSaveInterval', 30000),
      spellCheck: this.store.get('spellCheck', true),
      lineNumbers: this.store.get('lineNumbers', true),
      wordWrap: this.store.get('wordWrap', true)
    };
  }

  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.store.set(key, value);
    this.emit('settingChanged', { key, value });
  }

  resetToDefaults() {
    this.store.clear();
    this.settings = this.loadSettings();
    this.emit('settingsReset');
  }
}

module.exports = SettingsModel;