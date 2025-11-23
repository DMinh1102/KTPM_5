// src/controllers/EditorController.js
class EditorController {
  constructor(model, editorView, toolbarView) {
    this.model = model;
    this.editorView = editorView;
    this.toolbarView = toolbarView;
    
    this.bindToolbarEvents();
    this.bindKeyboardShortcuts();
  }

  bindToolbarEvents() {
    this.toolbarView.on('bold', () => this.formatBold());
    this.toolbarView.on('italic', () => this.formatItalic());
    this.toolbarView.on('heading', () => this.formatHeading());
    this.toolbarView.on('link', () => this.formatLink());
    this.toolbarView.on('image', () => this.formatImage());
    this.toolbarView.on('code', () => this.formatCode());
    this.toolbarView.on('list', () => this.formatList());
    this.toolbarView.on('quote', () => this.formatQuote());
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            this.formatBold();
            break;
          case 'i':
            e.preventDefault();
            this.formatItalic();
            break;
          case 'k':
            e.preventDefault();
            this.formatLink();
            break;
        }
      }
    });
  }

  formatBold() {
    const selection = this.editorView.getSelection();
    const formatted = `**${selection || 'bold text'}**`;
    this.editorView.insertText(formatted);
  }

  formatItalic() {
    const selection = this.editorView.getSelection();
    const formatted = `*${selection || 'italic text'}*`;
    this.editorView.insertText(formatted);
  }

  formatHeading() {
    const selection = this.editorView.getSelection();
    const formatted = `# ${selection || 'heading'}`;
    this.editorView.insertText(formatted);
  }

  formatLink() {
    const selection = this.editorView.getSelection();
    const formatted = `[${selection || 'link text'}](url)`;
    this.editorView.insertText(formatted);
  }

  formatImage() {
    const formatted = `![alt text](image-url)`;
    this.editorView.insertText(formatted);
  }

  formatCode() {
    const selection = this.editorView.getSelection();
    const formatted = `\`\`\`\n${selection || 'code'}\n\`\`\``;
    this.editorView.insertText(formatted);
  }

  formatList() {
    const selection = this.editorView.getSelection();
    const lines = (selection || 'item').split('\n');
    const formatted = lines.map(line => `- ${line}`).join('\n');
    this.editorView.insertText(formatted);
  }

  formatQuote() {
    const selection = this.editorView.getSelection();
    const lines = (selection || 'quote').split('\n');
    const formatted = lines.map(line => `> ${line}`).join('\n');
    this.editorView.insertText(formatted);
  }
}

module.exports = EditorController;