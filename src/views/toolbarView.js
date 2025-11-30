// src/views/ToolbarView.js

const ThemeModel = require('../models/themesModels');

class ToolbarView {
  constructor(container) {
    this.container = container;
    this.buttons = {};
    this.init();
  }
  

  init() {
    this.container.innerHTML = `
      <div id="toolbarArea">
        <div style="padding-left:10px;">
          <a data-action="bold" title="Bold [Ctrl+B]" class="fa fa-bold editor-toolbar"></a>
          <a data-action="italic" title="Italic [Ctrl+I]" class="fa fa-italic editor-toolbar"></a>
          <a data-action="heading" title="Header [Ctrl+H]" class="fa fa-header editor-toolbar"></a>
          <a data-action="strikethrough" title="StrikeThrough [Ctrl+/]" class="fa fa-strikethrough editor-toolbar"></a>
          <i class="separator">|</i>
          <a data-action="quote" title="Quote" class="fa fa-quote-left editor-toolbar"></a>
          <a data-action="unorderedList" title="Unordered List" class="fa fa-list-ul editor-toolbar"></a>
          <a data-action="orderedList" title="Ordered List" class="fa fa-list-ol editor-toolbar"></a>
          <i class="separator">|</i>
          <a data-action="latex" title="Math" class="fa fa-superscript editor-toolbar"></a>
          <i class="separator">|</i>
          <a data-action="link" title="Create Link [Ctrl+L]" class="fa fa-link editor-toolbar"></a>
          <a data-action="image" title="Insert Image [Ctrl+Alt+I]" class="fa fa-picture-o editor-toolbar"></a>
          <a data-action="table" title="Insert Table [Ctrl+Shift+T]" class="fa fa-table editor-toolbar"></a>
          <a data-action="horizontalRule" title="Insert Horizontal Rule" class="fa fa-minus editor-toolbar"></a>
          <i class="separator">|</i>
          <a data-action="sidePanel" title="Side-By-Side Panel Toggle" class="fa fa-columns editor-toolbar"></a>
          <a data-action="help" title="Markdown Help" class="fa fa-question-circle editor-toolbar"></a>
        </div>
      </div>
    `;

    // Store button references
    this.buttons = {
      bold: this.container.querySelector('[data-action="bold"]'),
      italic: this.container.querySelector('[data-action="italic"]'),
      heading: this.container.querySelector('[data-action="heading"]'),
      strikethrough: this.container.querySelector('[data-action="strikethrough"]'),
      quote: this.container.querySelector('[data-action="quote"]'),
      unorderedList: this.container.querySelector('[data-action="unorderedList"]'),
      orderedList: this.container.querySelector('[data-action="orderedList"]'),
      latex: this.container.querySelector('[data-action="latex"]'),
      link: this.container.querySelector('[data-action="link"]'),
      image: this.container.querySelector('[data-action="image"]'),
      table: this.container.querySelector('[data-action="table"]'),
      horizontalRule: this.container.querySelector('[data-action="horizontalRule"]'),
      sidePanel: this.container.querySelector('[data-action="sidePanel"]'),
      help: this.container.querySelector('[data-action="help"]')
    };
  }
  

  on(action, handler) {
    const button = this.buttons[action];
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        handler(e);
      });
    }
  }

  setActive(action, isActive) {
    const button = this.buttons[action];
    if (button) {
      button.classList.toggle('active', isActive);
    }
  }

  disable(action) {
    const button = this.buttons[action];
    if (button) {
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.5';
    }
  }

  enable(action) {
    const button = this.buttons[action];
    if (button) {
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    }
  }
  
}



module.exports = ToolbarView;