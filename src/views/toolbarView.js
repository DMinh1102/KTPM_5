// src/views/ToolbarView.js
class ToolbarView {
  constructor(container) {
    this.container = container;
    this.buttons = {};
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="toolbar">
        <button data-action="bold" title="Bold (Ctrl+B)"><b>B</b></button>
        <button data-action="italic" title="Italic (Ctrl+I)"><i>I</i></button>
        <button data-action="heading" title="Heading">H1</button>
        <button data-action="link" title="Link (Ctrl+K)">🔗</button>
        <button data-action="image" title="Image">🖼️</button>
        <button data-action="code" title="Code Block">{ }</button>
        <button data-action="list" title="List">• List</button>
        <button data-action="quote" title="Quote">" "</button>
      </div>
    `;

    // Store button references
    this.buttons = {
      bold: this.container.querySelector('[data-action="bold"]'),
      italic: this.container.querySelector('[data-action="italic"]'),
      heading: this.container.querySelector('[data-action="heading"]'),
      link: this.container.querySelector('[data-action="link"]'),
      image: this.container.querySelector('[data-action="image"]'),
      code: this.container.querySelector('[data-action="code"]'),
      list: this.container.querySelector('[data-action="list"]'),
      quote: this.container.querySelector('[data-action="quote"]')
    };
  }

  on(action, handler) {
    const button = this.buttons[action];
    if (button) {
      button.addEventListener('click', handler);
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
      button.disabled = true;
    }
  }

  enable(action) {
    const button = this.buttons[action];
    if (button) {
      button.disabled = false;
    }
  }
}

module.exports = ToolbarView;