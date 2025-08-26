# Changelog

All notable changes to the Player Bespoke Audio module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Upload Progress Indicator**: Shows spinning loader during file upload
- **Smart Tab Refresh**: Audio tab automatically refreshes after upload/delete without closing sheet
- **Icon-Only Audio Tab**: Audio tab now displays a speaker icon instead of text for cleaner UI

### Changed

- **Improved File Storage**: Audio files now store in `foundryuserdata/Data/player-audio/` instead of module directory
  - Files persist through module updates
  - Better organization and backup management
  - Uses Foundry VTT's optimized data directory structure
- **Better UX**: Upload process now shows progress and doesn't require sheet reopening

### Fixed

- **Linux Compatibility**: Added proper directory creation using FilePicker.createDirectory() for Linux systems
- **Directory Creation**: Ensures nested directories are created recursively when needed

## [1.0.0] - 2024-12-19

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

## Version History

### Semantic Versioning

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Release Types

- **Alpha**: Early development versions (0.x.x)
- **Beta**: Feature-complete testing versions (1.0.0-beta.x)
- **Release Candidate**: Final testing before stable release (1.0.0-rc.x)
- **Stable**: Production-ready releases (1.x.x)

## Planned Features (Future Versions)

### v1.1.0

- [ ] Bulk audio file operations
- [ ] Audio playlist management
- [ ] Scheduled audio playback
- [ ] Audio file categories/tags

### v1.2.0

- [ ] Advanced GM controls dashboard
- [ ] Audio file sharing between characters
- [ ] Export/import audio collections
- [ ] Integration with other Foundry modules

### v2.0.0

- [ ] WebRTC audio streaming
- [ ] Real-time voice chat integration
- [ ] Advanced audio effects and filters
- [ ] Mobile device support

## Contributing

When contributing to this module, please update the changelog with your changes following the established format.

## Links

- [GitHub Repository](https://github.com/yourusername/player-bespoke-audio)
- [Foundry VTT Community Discord](https://discord.gg/foundryvtt)
- [Module Documentation](https://github.com/yourusername/player-bespoke-audio/wiki)
