// src/views/PreviewView.js
const marked = require('marked');
const hljs = require('highlight.js');

class PreviewView {
  constructor(container) {
    this.container = container;
    this.scrollSync = true;
    this.configureMarked();
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
      gfm: true
    });
  }

  render(markdown) {
    try {
      const html = marked.parse(markdown);
      this.container.innerHTML = html;
      this.addLinkHandlers();
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

  setTheme(theme) {
    this.container.className = `preview-container theme-${theme}`;
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
}

module.exports = PreviewView;