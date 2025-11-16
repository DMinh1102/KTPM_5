// src/renderer/renderer.js
const DocumentModel = require('../models/documentModels');
const SettingsModel = require('../models/settingModels');
const EditorView = require('../views/editView.js');
const PreviewView = require('../views/previewView.js');
const ToolbarView = require('../views/toolbarView.js');
const DocumentController = require('../controllers/documentController.js');
const EditorController = require('../controllers/editorController.js');
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create models
  const documentModel = new DocumentModel();
  const settingsModel = new SettingsModel();

  // Create views
  const editorView = new EditorView(
    document.getElementById('editor-container')
  );
  
  const previewView = new PreviewView(
    document.getElementById('preview-container')
  );
  
  const toolbarView = new ToolbarView(
    document.getElementById('toolbar-container')
  );

  // Create controllers
  const documentController = new DocumentController(
    documentModel,
    editorView,
    previewView
  );

  const editorController = new EditorController(
    documentModel,
    editorView,
    toolbarView
  );

  // Apply settings
  editorView.setTheme(settingsModel.getSetting('theme'));
  editorView.setFontSize(settingsModel.getSetting('fontSize'));
  previewView.setTheme(settingsModel.getSetting('theme'));

  // Initialize with welcome message
  documentModel.setContent('# Welcome to Markdownify\n\nStart writing your markdown here...');
  
  console.log('Application initialized with MVC pattern');
});