// src/views/EditorView.js
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/edit/continuelist');
const ThemeModel = require('../models/themesModels');

class EditorView {
  constructor(container) {
    this.container = container;
    this.editor = null;
    this.eventHandlers = {};
    this.init();
    ThemeModel.subscribe(this.applyTheme.bind(this));
    this.applyTheme(ThemeModel.getTheme()); // apply initial theme
  }

  init() {
    this.editor = CodeMirror(this.container, {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList'
      }
    });

    // Bind internal events
    this.editor.on('change', () => {
      if (this.eventHandlers.change) {
        this.eventHandlers.change(this.editor.getValue());
      }
    });

    this.editor.on('cursorActivity', () => {
      if (this.eventHandlers.cursorActivity) {
        const cursor = this.editor.getCursor();
        this.eventHandlers.cursorActivity(cursor);
      }
      
    });

    this.editor.on('scroll', () => {
      if (this.eventHandlers.scroll) {
        const info = this.editor.getScrollInfo();
        const percentage = info.top / (info.height - info.clientHeight);
        this.eventHandlers.scroll(percentage);
      }
    });

  }
  applyTheme(theme) {
    const cmTheme = theme === 'dark' ? 'dracula' : 'default';
    this.editor.setOption('theme', cmTheme);
  }

  // Public API for Controller
  render(content) {
    const cursor = this.editor.getCursor();
    const scrollInfo = this.editor.getScrollInfo();
    
    this.editor.setValue(content);
    
    this.editor.setCursor(cursor);
    this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
  }

  getValue() {
    return this.editor.getValue();
  }

  insertText(text) {
    this.editor.replaceSelection(text);
    this.editor.focus();
  }

  setTheme(theme) {
    this.applyTheme(theme);
  }

  setFontSize(size) {
    this.container.style.fontSize = `${size}px`;
  }

  setOption(key, value) {
    this.editor.setOption(key, value);
  }

  focus() {
    this.editor.focus();
  }

  // Event registration
  on(event, handler) {
    this.eventHandlers[event] = handler;
  }

  off(event) {
    delete this.eventHandlers[event];
  }

  // Utility methods
  getCursor() {
    return this.editor.getCursor();
  }

  getSelection() {
    return this.editor.getSelection();
  }

  undo() {
    this.editor.undo();
  }

  redo() {
    this.editor.redo();
  }
}

module.exports = EditorView;