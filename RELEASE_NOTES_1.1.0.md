## [1.1.0] - 2025-08-27

### Added
- Release 1.1.0



### Added

- **Upload Progress Indicator**: Shows notification during file upload
- **Icon-Only Audio Tab**: Audio tab now displays a speaker icon instead of text for cleaner UI
- **Simple Refresh Solution**: Character sheet refreshes after upload/delete for reliable functionality

### Changed

- **Improved File Storage**: Audio files now store in `foundryuserdata/Data/player-audio/` instead of module directory
  - Files persist through module updates
  - Better organization and backup management
  - Uses Foundry VTT's optimized data directory structure
- **Better UX**: Upload process now shows progress and doesn't require sheet reopening

### Fixed

- **Linux Compatibility**: Added proper directory creation using FilePicker.createDirectory() for Linux systems
- **Directory Creation**: Ensures nested directories are created recursively when needed