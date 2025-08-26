#!/usr/bin/env node

/**
 * Community Release Script for Player Bespoke Audio Module
 * 
 * This script helps prepare the module for community release by:
 * - Validating all required files are present
 * - Checking for placeholder text that needs updating
 * - Creating a release checklist
 * - Preparing community announcement text
 */

const fs = require('fs');
const path = require('path');

class CommunityReleaseManager {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.requiredFiles = [
            'module.json',
            'scripts/player-bespoke-audio.js',
            'styles/player-bespoke-audio.css',
            'templates/audio-tab.hbs',
            'templates/gm-controls.hbs',
            'lang/en.json',
            'README.md',
            'CHANGELOG.md',
            'CONTRIBUTING.md',
            'LICENSE'
        ];
        
        this.placeholderPatterns = [
            /yourusername/g,
            /Your Name/g,
            /yourdiscord#0000/g
        ];
    }

    // Check if all required files exist
    checkRequiredFiles() {
        console.log('🔍 Checking required files...');
        const missingFiles = [];
        
        for (const file of this.requiredFiles) {
            const filePath = path.join(this.rootDir, file);
            if (!fs.existsSync(filePath)) {
                missingFiles.push(file);
            }
        }
        
        if (missingFiles.length === 0) {
            console.log('✅ All required files are present');
            return true;
        } else {
            console.log('❌ Missing required files:');
            missingFiles.forEach(file => console.log(`   - ${file}`));
            return false;
        }
    }

    // Check for placeholder text that needs updating
    checkPlaceholders() {
        console.log('\n🔍 Checking for placeholder text...');
        const filesToCheck = ['module.json', 'README.md'];
        const issues = [];
        
        for (const file of filesToCheck) {
            const filePath = path.join(this.rootDir, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                for (const pattern of this.placeholderPatterns) {
                    if (pattern.test(content)) {
                        issues.push(`${file}: Contains placeholder text that needs updating`);
                        break;
                    }
                }
            }
        }
        
        if (issues.length === 0) {
            console.log('✅ No placeholder text found');
            return true;
        } else {
            console.log('⚠️  Found placeholder text:');
            issues.forEach(issue => console.log(`   - ${issue}`));
            return false;
        }
    }

    // Validate module.json structure
    validateModuleJson() {
        console.log('\n🔍 Validating module.json...');
        try {
            const moduleJsonPath = path.join(this.rootDir, 'module.json');
            const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
            
            const requiredFields = ['id', 'title', 'description', 'version', 'compatibility', 'authors'];
            const missingFields = [];
            
            for (const field of requiredFields) {
                if (!moduleJson[field]) {
                    missingFields.push(field);
                }
            }
            
            if (missingFields.length === 0) {
                console.log('✅ module.json has all required fields');
                return true;
            } else {
                console.log('❌ module.json missing fields:');
                missingFields.forEach(field => console.log(`   - ${field}`));
                return false;
            }
        } catch (error) {
            console.log('❌ module.json is not valid JSON:', error.message);
            return false;
        }
    }

    // Create community release checklist
    createReleaseChecklist() {
        console.log('\n📋 Creating community release checklist...');
        
        const checklist = `# Community Release Checklist

## Pre-Release Tasks
- [ ] All required files are present
- [ ] No placeholder text remains
- [ ] module.json is valid and complete
- [ ] README.md is community-friendly
- [ ] License is properly configured
- [ ] Code is tested and working

## Community Release Steps
1. **GitHub Repository Setup**
   - [ ] Create public GitHub repository
   - [ ] Update module.json URLs with actual repository
   - [ ] Push all code to repository

2. **Foundry VTT Community**
   - [ ] Join Foundry VTT Discord
   - [ ] Share module in #modules channel
   - [ ] Create module showcase post

3. **Documentation**
   - [ ] Update README with actual repository links
   - [ ] Create release notes
   - [ ] Add installation instructions

4. **Distribution**
   - [ ] Create GitHub release
   - [ ] Test installation from manifest URL
   - [ ] Share with beta testers

## Post-Release Tasks
- [ ] Monitor GitHub Issues
- [ ] Respond to community feedback
- [ ] Plan future updates
- [ ] Engage with users on Discord

## Community Guidelines
- Be responsive to user questions
- Thank users for feedback
- Consider feature requests fairly
- Maintain professional communication
`;

        const checklistPath = path.join(this.rootDir, 'COMMUNITY_RELEASE_CHECKLIST.md');
        fs.writeFileSync(checklistPath, checklist);
        console.log('✅ Created COMMUNITY_RELEASE_CHECKLIST.md');
    }

    // Create community announcement template
    createAnnouncementTemplate() {
        console.log('\n📢 Creating community announcement template...');
        
        const announcement = `# Community Release Announcement

## 🎉 Player Bespoke Audio Module - Now Available!

**A Foundry VTT module that allows Game Masters to upload and play audio files specifically for individual players through their character sheets.**

### 🎯 What This Module Does
- **Character-Specific Audio**: Upload audio files directly to individual character sheets
- **GM Controls**: Play audio files for specific players with one click
- **Player Privacy**: Audio files only play for the intended player
- **Real-Time Communication**: Uses Foundry's socket system for instant playback

### 🚀 Key Features
- Audio tab integration on character sheets
- Support for MP3, WAV, and OGG files
- Automatic directory creation
- Fallback upload system
- Responsive, accessible UI
- Localization support

### 📦 Installation
1. **From Foundry VTT**: Use the manifest URL in the module installer
2. **Manual Installation**: Download and extract to your modules folder
3. **Enable**: Activate the module in your world settings

### 🔗 Links
- **GitHub Repository**: [Link to your repo]
- **Manifest URL**: [Your manifest URL]
- **Documentation**: [Link to README]
- **Issues & Support**: [Link to GitHub Issues]

### 🤝 Community
- **Foundry VTT Discord**: Join the discussion in #modules
- **GitHub**: Star, fork, and contribute
- **Feedback**: We'd love to hear how you're using it!

### 📄 License
MIT License - Free to use, modify, and distribute

---

**Happy gaming, and may your audio be as bespoke as your stories!** 🎵✨
`;

        const announcementPath = path.join(this.rootDir, 'COMMUNITY_ANNOUNCEMENT.md');
        fs.writeFileSync(announcementPath, announcement);
        console.log('✅ Created COMMUNITY_ANNOUNCEMENT.md');
    }

    // Run all checks
    async runCommunityReleaseCheck() {
        console.log('🚀 Player Bespoke Audio - Community Release Check\n');
        
        const fileCheck = this.checkRequiredFiles();
        const placeholderCheck = this.checkPlaceholders();
        const moduleJsonCheck = this.validateModuleJson();
        
        if (fileCheck && placeholderCheck && moduleJsonCheck) {
            console.log('\n🎉 All checks passed! Module is ready for community release.');
            this.createReleaseChecklist();
            this.createAnnouncementTemplate();
            
            console.log('\n📋 Next Steps:');
            console.log('1. Update any placeholder text in module.json and README.md');
            console.log('2. Create your GitHub repository');
            console.log('3. Update URLs in module.json with actual repository links');
            console.log('4. Run this script again to verify everything is ready');
            console.log('5. Create your first community release!');
        } else {
            console.log('\n⚠️  Some issues found. Please fix them before community release.');
            console.log('Run this script again after making corrections.');
        }
    }
}

// Main execution
async function main() {
    const releaseManager = new CommunityReleaseManager();
    await releaseManager.runCommunityReleaseCheck();
}

if (require.main === module) {
    main();
}

module.exports = CommunityReleaseManager;
