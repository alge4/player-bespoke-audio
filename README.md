# Player Bespoke Audio

A Foundry VTT module that allows Game Masters to upload and play audio files specifically for individual players through their character sheets.

## Features

- **Character-Specific Audio**: Upload audio files directly to individual character sheets
- **GM Controls**: Game Masters can play audio files for specific players with the click of a button
- **Player Privacy**: Audio files are only played for the intended player
- **File Management**: Easy upload, preview, and deletion of audio files
- **Socket Integration**: Real-time audio playback using Foundry's socket system
- **Responsive UI**: Clean, modern interface that integrates seamlessly with Foundry VTT

## Installation

### Method 1: Module Browser (Recommended)

1. Open Foundry VTT and go to the **Add-on Modules** tab
2. Click **Install Module**
3. Search for "Player Bespoke Audio"
4. Click **Install**

### Method 2: Manual Installation

1. Download the latest release from the [GitHub repository](https://github.com/alge4/player-bespoke-audio)
2. Extract the contents to your Foundry VTT `modules` folder
3. Restart Foundry VTT
4. Enable the module in your world's module settings

### Method 3: Manifest URL

Use this manifest URL in Foundry's module installer:

```
https://github.com/alge4/player-bespoke-audio/releases/latest/download/module.json
```

## Usage

### For Game Masters

#### Uploading Audio Files

1. Open any player character's character sheet
2. Navigate to the **Audio** tab
3. Click **Select Audio File** to choose an audio file from your computer
4. Supported formats: MP3, WAV, OGG
5. The file will be uploaded and added to the character's playlist

#### Playing Audio for Players

1. In the character sheet's **Audio** tab, click the play button (▶️) next to any audio file
2. The audio will play only for the player who owns that character
3. Use the **Stop All** button to stop any currently playing audio

#### Managing Audio Files

- **Delete**: Click the trash icon (🗑️) to remove an audio file from the playlist
- **Preview**: Players can preview audio files using the built-in audio controls

### For Players

#### Viewing Your Audio Files

1. Open your character sheet
2. Go to the **Audio** tab
3. You can see all audio files uploaded by your GM
4. Use the audio controls to preview files (this won't notify other players)

#### Receiving Audio

- When your GM plays an audio file for your character, you'll receive a notification
- The audio will play automatically at the volume level set in your client settings
- Only you will hear the audio - other players won't be affected

## Settings

### Module Settings

- **Enable GM Controls**: Show/hide GM control interface
- **Default Audio Volume**: Set the default volume for played audio files (0-1)

### Client Settings

- **Audio Volume**: Personal volume setting for received audio files

## File Storage

Audio files are stored in the module's data directory:

```
Data/modules/player-bespoke-audio/audio/[character-id]/
```

### Directory Structure

The module uses the following directory structure:

- `modules/player-bespoke-audio/audio/` - Main audio directory
- `modules/player-bespoke-audio/audio/[character-id]/` - Character-specific audio folders

**Note**: Foundry VTT automatically creates necessary directories when files are uploaded. The module includes fallback mechanisms to ensure uploads succeed even if the preferred path structure isn't available.

## Compatibility

- **Foundry VTT**: Version 11.0+
- **Systems**: Compatible with all game systems
- **Modules**: No known conflicts

## Troubleshooting

### Audio Not Playing

1. Check that the target player is online and connected
2. Verify the audio file format is supported (MP3, WAV, OGG)
3. Ensure the player's browser supports HTML5 audio
4. Check the module's volume settings

### File Upload Issues

1. Ensure you have GM permissions
2. Check that the file size is reasonable (< 50MB recommended)
3. Verify the file format is supported
4. Make sure you have write permissions to the Foundry data directory
5. **Directory Creation**: The module automatically creates necessary directories for audio files. If you encounter "Target directory does not exist" errors, the module will attempt to create the directory structure automatically.
6. **Fallback Upload**: If directory creation fails, the module will attempt to upload to a fallback location within the module's audio folder.

### Socket Connection Problems

1. Restart Foundry VTT
2. Check that all players are properly connected
3. Verify the module is enabled for all connected clients

## Development

### File Structure

```
player-bespoke-audio/
├── module.json              # Module manifest
├── scripts/
│   ├── player-bespoke-audio.js  # Main module code
│   └── release.js               # Release management script
├── styles/
│   └── player-bespoke-audio.css # Module styling
├── templates/
│   ├── audio-tab.hbs        # Character sheet audio tab
│   └── gm-controls.hbs      # GM control interface
├── lang/
│   └── en.json              # English localization
├── .github/workflows/        # GitHub Actions workflows
├── CHANGELOG.md              # Version history and changes
├── CONTRIBUTING.md           # Contribution guidelines
├── RELEASE_CHECKLIST.md      # Release preparation checklist
├── LICENSE                   # MIT License
└── README.md                 # This file
```

### Versioning System

This module follows [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

#### Release Types

- **Stable**: Production-ready releases (1.x.x)
- **Beta**: Feature-complete testing versions (1.0.0-beta.x)
- **Release Candidate**: Final testing before stable release (1.0.0-rc.x)

#### Release Management

```bash
# Automated version updates
npm run release:patch    # 1.0.0 -> 1.0.1
npm run release:minor    # 1.0.0 -> 1.1.0
npm run release:major    # 1.0.0 -> 2.0.0
npm run release:beta     # 1.0.0 -> 1.0.0-beta.1
npm run release:rc       # 1.0.0 -> 1.0.0-rc.1

# Code validation
npm run validate         # Validate JavaScript syntax
```

### Automated Releases

The module uses GitHub Actions for automated releases:

1. **Tag Creation**: Create a git tag (e.g., `v1.0.0`)
2. **Workflow Trigger**: GitHub Actions automatically runs
3. **Package Creation**: Module is packaged and validated
4. **Release Creation**: GitHub release is created with assets
5. **Manifest Update**: module.json URLs are updated automatically

### Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to:

- Report bugs and request features
- Submit code contributions
- Help with testing and documentation
- Follow our development standards

#### Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Create** a feature branch
5. **Make** your changes
6. **Test** thoroughly
7. **Submit** a pull request

#### Development Tools

```bash
npm install              # Install dependencies
npm run validate        # Validate code syntax
npm test               # Run tests (when configured)
npm run release:patch  # Create patch release
```

For detailed development information, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🤝 Community

### **Join the Discussion**

- **Foundry VTT Discord**: [Join our community](https://discord.gg/foundryvtt) and share your experiences
- **GitHub Issues**: Report bugs, request features, or ask questions
- **GitHub Discussions**: Share ideas and get help from other users

### **Support the Project**

- **Star the Repository**: Show your appreciation
- **Share with Friends**: Help other GMs discover this module
- **Contribute**: Submit bug reports, feature requests, or code improvements
- **Feedback**: Let us know how you're using the module in your games

### **Community Guidelines**

- Be respectful and helpful to other users
- Share your creative uses and setups
- Help new users get started
- Report issues with clear, detailed information

## 📄 License

This module is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**MIT License Benefits:**

- ✅ **Free to use** in personal and commercial projects
- ✅ **Modify and distribute** as needed
- ✅ **No warranty** - use at your own risk
- ✅ **Attribution** - credit the original authors

## Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/alge4/player-bespoke-audio/issues)
- **Discord**: Join the Foundry VTT Discord for community support
- **Documentation**: Check the [Wiki](https://github.com/alge4/player-bespoke-audio/wiki) for detailed guides

## Changelog

### Version 1.0.0

- Initial release
- Character sheet audio tab integration
- File upload and management system
- Socket-based audio playback
- GM controls interface
- Localization support

## Acknowledgments

- Thanks to the Foundry VTT community for feedback and testing
- Built using the Foundry VTT API and development guidelines
- Icons provided by Font Awesome

---

**Note**: This module requires active internet connection for initial setup and file uploads. Audio playback works offline once files are cached.
