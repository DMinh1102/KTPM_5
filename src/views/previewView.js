// src/views/PreviewView.js
const marked = require('marked');
const hljs = require('highlight.js');
const ThemeModel = require('../models/themesModels');

class PreviewView {
  constructor(container) {
    this.container = container;
    this.scrollSync = true;
    this.configureMarked();

    // Subscribe to global theme changes
    ThemeModel.subscribe(this.applyTheme.bind(this));
    this.applyTheme(ThemeModel.getTheme()); // apply initial theme
  }

  configureMarked() {
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
      sanitize: !this.allowHtml // disable raw HTML when false
    });  
  }

  render(markdown) {
    try {
      if (isHtmlInput(markdown)) {
        this.container.innerHTML = markdown; // render directly
      } else {
        const html = marked.parse(markdown);
        this.container.innerHTML = html;
        this.addLinkHandlers();
      }
    } catch (error) {
      this.renderError(error);
    }
  }



  renderError(error) {
    this.container.innerHTML = `
      <div class="error">
        <h3>Preview Error</h3>
        <p>${error.message}</p>
      </div>
    `;
  }

  addLinkHandlers() {
    const links = this.container.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        require('electron').shell.openExternal(link.href);
      });
    });
  }

  // Apply theme based on ThemeModel
  applyTheme(theme) {
    this.container.classList.remove('theme-light', 'theme-dark');
    this.container.classList.add(`theme-${theme}`);
  }
  

  // Manual setter if needed
  setTheme(theme) {
    ThemeModel.setTheme(theme); // update global model
  }

  scrollToPercentage(percentage) {
    if (this.scrollSync) {
      const scrollHeight = this.container.scrollHeight - this.container.clientHeight;
      this.container.scrollTop = scrollHeight * percentage;
    }
  }

  enableScrollSync() {
    this.scrollSync = true;
  }

  disableScrollSync() {
    this.scrollSync = false;
  }

  clear() {
    this.container.innerHTML = '';
  }

  setAllowHtml(allow) {
    this.allowHtml = allow;
    this.configureMarked();
  }

  renderRawHtml(markdown) {
    try {
      const pre = document.createElement('pre');
      pre.textContent = markdown; // show exactly what was typed
      this.container.innerHTML = '';
      this.container.appendChild(pre);
    } catch (error) {
      this.renderError(error);
    }
  }



}
function isHtmlInput(text) {
    return /^(\s*<!DOCTYPE html>|<html>|<head>|<body>|<form|<div|<p)/i.test(text.trim());
  }


module.exports = PreviewView;
