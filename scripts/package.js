#!/usr/bin/env node

/**
 * Package Script for Player Bespoke Audio Module
 * 
 * Creates a clean release zip file excluding development files
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class PackageManager {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.packageName = 'player-bespoke-audio';
    this.version = this.getVersion();
    this.outputDir = path.join(this.rootDir, 'dist');
    this.outputFile = path.join(this.outputDir, `${this.packageName}-${this.version}.zip`);
  }

  // Get version from package.json
  getVersion() {
    const packagePath = path.join(this.rootDir, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageData.version;
  }

  // Files to include in the release
  getIncludeFiles() {
    return [
      'module.json',
      'scripts/player-bespoke-audio.js',
      'styles/player-bespoke-audio.css',
      'templates/audio-tab.hbs',
      'templates/gm-controls.hbs',
      'lang/en.json',
      'README.md',
      'LICENSE'
    ];
  }

  // Files to exclude from the release
  getExcludeFiles() {
    return [
      'package.json',
      'package-lock.json',
      'node_modules/',
      'scripts/',
      'dist/',
      '.git/',
      '.github/',
      'test-upload.html',
      'CHANGELOG.md',
      'RELEASE_NOTES_*.md',
      'RELEASE_CHECKLIST.md',
      'COMMUNITY_*.md',
      'CONTRIBUTING.md',
      '*.log',
      '.env',
      '.env.local',
      '.DS_Store',
      'Thumbs.db'
    ];
  }

  // Create output directory
  createOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`✓ Created output directory: ${this.outputDir}`);
    }
  }

  // Check if file should be excluded
  shouldExclude(filePath) {
    const relativePath = path.relative(this.rootDir, filePath);
    
    // Check explicit exclusions
    for (const exclude of this.getExcludeFiles()) {
      if (exclude.endsWith('/')) {
        // Directory exclusion
        if (relativePath.startsWith(exclude.slice(0, -1))) {
          return true;
        }
      } else if (exclude.includes('*')) {
        // Pattern exclusion
        const pattern = exclude.replace(/\*/g, '.*');
        if (new RegExp(pattern).test(relativePath)) {
          return true;
        }
      } else if (relativePath === exclude) {
        return true;
      }
    }
    
    return false;
  }

  // Create the zip file
  async createZip() {
    return new Promise((resolve, reject) => {
      console.log(`📦 Creating release package: ${this.outputFile}`);
      
      const output = fs.createWriteStream(this.outputFile);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✓ Package created successfully!`);
        console.log(`📁 Output: ${this.outputFile}`);
        console.log(`📊 Size: ${sizeMB} MB`);
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Add files to the archive
      this.addFilesToArchive(archive);

      archive.finalize();
    });
  }

  // Add files to the archive
  addFilesToArchive(archive) {
    const includeFiles = this.getIncludeFiles();
    
    for (const file of includeFiles) {
      const filePath = path.join(this.rootDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          archive.file(filePath, { name: file });
          console.log(`✓ Added: ${file}`);
        }
      } else {
        console.warn(`⚠️  Warning: ${file} not found`);
      }
    }

    // Also add any additional files that aren't explicitly excluded
    this.addNonExcludedFiles(archive);
  }

  // Add any additional files that aren't explicitly excluded
  addNonExcludedFiles(archive) {
    const addDirectory = (dirPath, basePath = '') => {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const fullPath = path.join(dirPath, item);
          const relativePath = path.join(basePath, item);
          const stats = fs.statSync(fullPath);
          
          if (this.shouldExclude(fullPath)) {
            continue;
          }
          
          if (stats.isDirectory()) {
            addDirectory(fullPath, relativePath);
          } else {
            // Only add files that aren't in the exclude list
            if (!this.shouldExclude(fullPath)) {
              archive.file(fullPath, { name: relativePath });
              console.log(`✓ Added: ${relativePath}`);
            }
          }
        }
      }
    };

    // Start from root directory
    addDirectory(this.rootDir);
  }

  // Main packaging process
  async package() {
    try {
      console.log(`🚀 Starting packaging process for ${this.packageName} v${this.version}`);
      
      // Create output directory
      this.createOutputDir();
      
      // Create zip file
      await this.createZip();
      
      console.log(`\n🎉 Packaging completed successfully!`);
      console.log(`📦 Release package: ${this.outputFile}`);
      
    } catch (error) {
      console.error(`❌ Packaging failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const packageManager = new PackageManager();
  await packageManager.package();
}

if (require.main === module) {
  main();
}

module.exports = PackageManager;
