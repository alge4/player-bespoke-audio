## [0.1.0] - 2025-01-27

### Added

- **Core Module Structure**: Complete Foundry VTT module with manifest and dependencies
- **Character Sheet Integration**: Audio tab added to character sheets for GMs and character owners
- **File Upload System**: Drag-and-drop audio file upload with MP3, WAV, and OGG support
- **Audio Management**: Upload, preview, and delete audio files with metadata tracking
- **GM Controls**: Play audio files specifically for individual players
- **Socket Communication**: Real-time audio playback using Foundry's socket system
- **Player Privacy**: Audio files only play for the intended player
- **Responsive UI**: Modern, accessible interface that integrates seamlessly with Foundry VTT
- **Localization Support**: English language support with extensible structure
- **Settings System**: Configurable GM controls and audio volume settings
- **Directory Auto-Creation**: Automatic directory structure creation for file uploads
- **Fallback Upload System**: Graceful degradation when directory creation fails
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Technical Features

- **Module Manifest**: Proper Foundry VTT module.json with all required fields
- **Hook System**: Integration with Foundry's renderActorSheet and ready hooks
- **Flag System**: Actor flags for storing audio file metadata
- **Template System**: Handlebars templates for UI components
- **CSS Styling**: Responsive design with accessibility features
- **Event Binding**: Proper event handling for file operations
- **File Validation**: Audio file type and format validation
- **User Permissions**: GM-only controls with proper permission checking

### Files Added

- `module.json` - Module manifest and metadata
- `scripts/player-bespoke-audio.js` - Main module logic
- `styles/player-bespoke-audio.css` - Module styling
- `templates/audio-tab.hbs` - Character sheet audio tab
- `templates/gm-controls.hbs` - GM control interface
- `lang/en.json` - English localization
- `README.md` - Comprehensive documentation
- `package.json` - Development metadata
- `test-upload.html` - Directory creation test page

---

**This is the initial release of the Player Bespoke Audio module for Foundry VTT.**

The module provides GMs with the ability to upload and play audio files specifically for individual players through their character sheets, enhancing the roleplaying experience with personalized audio content.
