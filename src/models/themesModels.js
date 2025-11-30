class ThemeModel {
  constructor() {
    this.theme = 'light';
    this.listeners = [];
  }

  setTheme(theme) {
    this.theme = theme;
    this.listeners.forEach(cb => cb(theme));
    console.log(theme);
  }

  getTheme() {
    return this.theme;
  }

  subscribe(cb) {
    this.listeners.push(cb);
  }
}

module.exports = new ThemeModel();