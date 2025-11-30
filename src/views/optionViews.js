// src/views/OptionsView.js
const ThemeModel = require('../models/themesModels');
class OptionsView {
  constructor(container) {
    this.container = container;
    this.elements = {};
    this.callbacks = {
      onToolbarToggle: null,
      onThemeChange: null,
      onPreferenceChange: null,
      onSyncScrollChange: null
    };
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="optContainer">
        <div class="mode">
          <span class="toolContainer">
            <a id="angleToolBar" title="Toolbar" class="fa fa-angle-double-right" style="cursor: pointer;text-decoration:none;"></a>
          </span>
          <span class="switch-field">
            <input type="radio" name="changeTheme" id="lightThemeRadio" value="light" title="Light Mode" checked="checked"/>
            <label for="lightThemeRadio">Light</label>
            <input type="radio" name="changeTheme" id="darkThemeRadio" value="dark" title="Dark Mode" />
            <label for="darkThemeRadio">Dark</label>
          </span>
        </div>
        <div class="pref" id="pref">
          <div class="module">
            <label><input type="checkbox" id="syncScroll"> Sync Scrolling</label>
          </div>
          <div class="switch-field preview-pane">
            <input type="radio" name="showPreference" id="htmlRadio" value="html"/>
            <label for="htmlRadio">HTML</label>
            <input type="radio" name="showPreference" id="previewRadio" value="preview" checked="checked" />
            <label for="previewRadio">Preview</label>
          </div>
        </div>
      </div>
    `;

    // Store element references
    this.elements = {
      angleToolBar: this.container.querySelector('#angleToolBar'),
      lightThemeRadio: this.container.querySelector('#lightThemeRadio'),
      darkThemeRadio: this.container.querySelector('#darkThemeRadio'),
      syncScrollCheckbox: this.container.querySelector('#syncScroll'),
      htmlRadio: this.container.querySelector('#htmlRadio'),
      previewRadio: this.container.querySelector('#previewRadio')
    };

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Toolbar toggle
    this.elements.angleToolBar.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleToolbarToggle();
      if(document.getElementById("toolbarArea").style.display == "block"){
        document.getElementById("angleToolBar").className = "";
        document.getElementById("angleToolBar").className = "fa fa-angle-double-right";
        document.getElementById("toolbarArea").style.display = "none";
        document.getElementById("main-content").style.paddingTop = "0px";
    }else{
        document.getElementById("angleToolBar").className = "";
        document.getElementById("angleToolBar").className = "fa fa-angle-double-down";
        document.getElementById("toolbarArea").style.display = "block";
        document.getElementById("main-content").style.paddingTop = "28px";
        }
    });

    // Theme change
    this.elements.lightThemeRadio.addEventListener('click', (e) => {
      this.handleThemeChange(e.target);
    });

    this.elements.darkThemeRadio.addEventListener('click', (e) => {
      this.handleThemeChange(e.target);
    });

    // Sync scroll
    this.elements.syncScrollCheckbox.addEventListener('change', (e) => {
      this.handleSyncScrollChange(e.target.checked);
    });

    // Preference change
    this.elements.htmlRadio.addEventListener('click', (e) => {
      this.handlePreferenceChange(e.target);
    });

    this.elements.previewRadio.addEventListener('click', (e) => {
      this.handlePreferenceChange(e.target);
    });
  }

  // Show/Hide Toolbar
  handleToolbarToggle() {
    const toolbarArea = document.getElementById("toolbarArea");
    const editArea = document.getElementById("editArea");
    
    if (toolbarArea && editArea) {
      if (toolbarArea.style.display === "block") {
        this.elements.angleToolBar.className = "fa fa-angle-double-right";
        toolbarArea.style.display = "none";
        editArea.style.paddingTop = "24px";
      } else {
        this.elements.angleToolBar.className = "fa fa-angle-double-down";
        toolbarArea.style.display = "block";
        editArea.style.paddingTop = "53px";
      }
    }

    // Call custom callback if provided
    if (this.callbacks.onToolbarToggle) {
      this.callbacks.onToolbarToggle(toolbarArea.style.display === "block");
    }
  }

  // Change Theme
  handleThemeChange(radio) {
    const theme = radio.value; // 'light' or 'dark'
    ThemeModel.setTheme(theme);

    
    // Apply theme changes to document
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }

    // Call custom callback if provided
    if (this.callbacks.onThemeChange) {
      this.callbacks.onThemeChange(theme);
    }
  }


  // Change Preference (HTML/Preview)
  handlePreferenceChange(radio) {
    const preference = radio.value; // 'html' or 'preview'
    
    // Toggle visibility of HTML and Preview panels
    const htmlPanel = document.getElementById('htmlPanel');
    const previewPanel = document.getElementById('previewPanel');
    
    if (htmlPanel && previewPanel) {
      if (preference === 'html') {
        htmlPanel.style.display = 'block';
        previewPanel.style.display = 'none';
      } else {
        htmlPanel.style.display = 'none';
        previewPanel.style.display = 'block';
      }
    }

    // Call custom callback if provided
    if (this.callbacks.onPreferenceChange) {
      this.callbacks.onPreferenceChange(preference);
    }
  }

  // Sync Scroll Toggle
  handleSyncScrollChange(isChecked) {
    // Call custom callback if provided
    if (this.callbacks.onSyncScrollChange) {
      this.callbacks.onSyncScrollChange(isChecked);
    }
  }

  // Public method to set callbacks
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.elements.darkThemeRadio.checked ? 'dark' : 'light';
  }

  // Set theme programmatically
  setTheme(theme) {
    if (theme === 'dark') {
      this.elements.darkThemeRadio.checked = true;
      this.handleThemeChange(this.elements.darkThemeRadio);
    } else {
      this.elements.lightThemeRadio.checked = true;
      this.handleThemeChange(this.elements.lightThemeRadio);
    }
  }


  // Get current preference
  getCurrentPreference() {
    return this.elements.htmlRadio.checked ? 'html' : 'preview';
  }

  // Set preference programmatically
  setPreference(preference) {
    if (preference === 'html') {
      this.elements.htmlRadio.checked = true;
      this.handlePreferenceChange(this.elements.htmlRadio);
      document.preference
    } else {
      this.elements.previewRadio.checked = true;
      this.handlePreferenceChange(this.elements.previewRadio);
    }
  }

  // Get sync scroll state
  isSyncScrollEnabled() {
    return this.elements.syncScrollCheckbox.checked;
  }

  // Set sync scroll programmatically
  setSyncScroll(enabled) {
    this.elements.syncScrollCheckbox.checked = enabled;
    this.handleSyncScrollChange(enabled);
    console.log("scrolling");
  }
  
}

module.exports = OptionsView;