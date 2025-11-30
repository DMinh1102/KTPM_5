// src/controllers/DocumentController.js
const { ipcRenderer, dialog } = require('electron');
const fs = require('fs').promises;

class DocumentController {
  constructor(model, editorView, previewView) {
    this.model = model;
    this.editorView = editorView;
    this.previewView = previewView;
    this.currentPreference = 'preview';
    
    this.bindModelEvents();
    this.bindViewEvents();
    this.bindIPCEvents();
  }

  // Bind Model Events (Observer Pattern)
  bindModelEvents() {
    this.model.on('contentChanged', (content) => {
      this.onContentChanged(content);
    });

    this.model.on('filePathChanged', (filePath) => {
      this.updateWindowTitle();
    });

    this.model.on('dirtyStateChanged', (isDirty) => {
      this.updateWindowTitle();
    });

    this.model.on('metadataChanged', (metadata) => {
      this.updateStatusBar(metadata);
    });
  }

  // Bind View Events
  bindViewEvents() {
    this.editorView.on('change', (content) => {
      this.handleContentChange(content);
    });

    this.editorView.on('cursorActivity', (cursor) => {
      this.handleCursorActivity(cursor);
    });
  }

  // Bind IPC Events (from Main Process)
  bindIPCEvents() {
    ipcRenderer.on('menu:new', () => this.handleNew());
    ipcRenderer.on('menu:open', () => this.handleOpen());
    ipcRenderer.on('menu:save', () => this.handleSave());
    ipcRenderer.on('menu:saveAs', () => this.handleSaveAs());
    ipcRenderer.on('menu:export', (_, format) => this.handleExport(format));
  }

  // Handle user actions
  handleContentChange(content) {
    this.model.setContent(content);
  }

  onContentChanged(content) {
    clearTimeout(this.previewTimeout);
    this.previewTimeout = setTimeout(() => {
      if (this.currentPreference === 'html') {
        this.previewView.renderRawHtml(content);
      } else {
        this.previewView.render(content);
      }
    }, 300);
  }


  async handleNew() {
    if (this.model.isDirty) {
      const save = await this.confirmSave();
      if (save === 'cancel') return;
      if (save === 'save') await this.handleSave();
    }

    this.model.reset();
    this.editorView.render('');
    this.previewView.clear();
  }

  async handleOpen() {
    if (this.model.isDirty) {
      const save = await this.confirmSave();
      if (save === 'cancel') return;
      if (save === 'save') await this.handleSave();
    }

    const result = await ipcRenderer.invoke('dialog:openFile');
    if (result.canceled) return;

    const filePath = result.filePaths[0];
    await this.loadFile(filePath);
  }

  async loadFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      this.model.setContent(content);
      this.model.setFilePath(filePath);
      this.model.markClean();
      this.editorView.render(content);

      if (this.currentPreference === 'html') {
        this.previewView.renderRawHtml(content);
      } else {
        this.previewView.render(content);
      }
    } catch (error) {
      this.showError('Failed to open file', error.message);
    }
  }

  async handleSave() {
    if (!this.model.getFilePath()) {
      return this.handleSaveAs();
    }

    try {
      await fs.writeFile(this.model.getFilePath(), this.model.getContent());
      this.model.markClean();
      this.showSuccess('File saved');
    } catch (error) {
      this.showError('Failed to save file', error.message);
    }
  }

  async handleSaveAs() {
    const result = await ipcRenderer.invoke('dialog:saveFile');
    if (result.canceled) return;

    const filePath = result.filePath;
    
    try {
      await fs.writeFile(filePath, this.model.getContent());
      this.model.setFilePath(filePath);
      this.model.markClean();
      this.showSuccess('File saved');
    } catch (error) {
      this.showError('Failed to save file', error.message);
    }
  }

  async handleExport(format) {
    switch (format) {
      case 'pdf':
        await this.exportPDF();
        break;
      case 'html':
        await this.exportHTML();
        break;
      default:
        console.warn('Unknown export format:', format);
    }
  }

  async exportPDF() {
    // Implementation for PDF export
    ipcRenderer.send('export:pdf', {
      content: this.model.getContent(),
      filePath: this.model.getFilePath()
    });
  }

  async exportHTML() {
    // Implementation for HTML export
    const marked = require('marked');
    const html = marked.parse(this.model.getContent());
    
    const result = await ipcRenderer.invoke('dialog:saveFile', {
      filters: [{ name: 'HTML', extensions: ['html'] }]
    });
    
    if (!result.canceled) {
      await fs.writeFile(result.filePath, html);
      this.showSuccess('Exported to HTML');
    }
  }

  // Helper methods
  async confirmSave() {
    const result = await ipcRenderer.invoke('dialog:confirmSave');
    return result; // 'save', 'dontSave', or 'cancel'
  }

  updateWindowTitle() {
    const fileName = this.model.getFilePath() 
      ? require('path').basename(this.model.getFilePath())
      : 'Untitled';
    const dirty = this.model.isDirty ? ' *' : '';
    ipcRenderer.send('window:setTitle', `${fileName}${dirty} - Markdownify`);
  }

  updateStatusBar(metadata) {
    // Update status bar with word count, line count, etc.
    ipcRenderer.send('statusBar:update', metadata);
  }

  handleCursorActivity(cursor) {
    // Update status bar with cursor position
    ipcRenderer.send('statusBar:cursorPosition', cursor);
  }

  showError(title, message) {
    ipcRenderer.send('notification:error', { title, message });
  }

  showSuccess(message) {
    ipcRenderer.send('notification:success', { message });
  }
  
}

module.exports = DocumentController;