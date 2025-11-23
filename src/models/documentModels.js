// src/models/DocumentModels.js
const EventEmitter = require('events');

class DocumentModel extends EventEmitter {
  constructor() {
    super();
    this.content = '';
    this.filePath = null;
    this.isDirty = false;
    this.metadata = {
      wordCount: 0,
      lineCount: 0,
      lastModified: null
    };
  }

  // Getters
  getContent() {
    return this.content;
  }

  getFilePath() {
    return this.filePath;
  }

  isDirty() {
    return this.isDirty;
  }

  getMetadata() {
    return this.metadata;
  }

  // Setters with validation and events
  setContent(content) {
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }
    
    this.content = content;
    this.isDirty = true;
    this.updateMetadata();
    this.emit('contentChanged', this.content);
  }

  setFilePath(filePath) {
    this.filePath = filePath;
    this.emit('filePathChanged', filePath);
  }

  markClean() {
    this.isDirty = false;
    this.emit('dirtyStateChanged', false);
  }

  markDirty() {
    this.isDirty = true;
    this.emit('dirtyStateChanged', true);
  }

  // Business Logic
  updateMetadata() {
    this.metadata.wordCount = this.content.split(/\s+/).filter(Boolean).length;
    this.metadata.lineCount = this.content.split('\n').length;
    this.metadata.lastModified = new Date();
    this.emit('metadataChanged', this.metadata);
  }

  reset() {
    this.content = '';
    this.filePath = null;
    this.isDirty = false;
    this.updateMetadata();
    this.emit('reset');
  }

  // Validation
  validate() {
    return {
      isValid: true,
      errors: []
    };
  }
}

module.exports = DocumentModel;