// src/views/EditorView.js
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/edit/continuelist');

class EditorView {
  constructor(container) {
    this.container = container;
    this.editor = null;
    this.eventHandlers = {};
    this.init();
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
    this.editor.setOption('theme', theme);
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