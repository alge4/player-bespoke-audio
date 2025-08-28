#!/usr/bin/env node

/**
 * Package Script for Player Bespoke Audio Module
 *
 * Creates a clean release zip file excluding development files
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

class PackageManager {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.packageName = "player-bespoke-audio";
    this.version = this.getVersion();
    this.outputDir = path.join(this.rootDir, "dist");
    this.outputFile = path.join(
      this.outputDir,
      `${this.packageName}-${this.version}.zip`
    );
  }

  // Get version from package.json
  getVersion() {
    const packagePath = path.join(this.rootDir, "package.json");
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageData.version;
  }

  // Files to include in the release (Foundry VTT module requirements + core files)
  getIncludeFiles() {
    return [
      // Foundry VTT required files
      "module.json", // Module manifest (required)
      "package.json", // Package info (required for Foundry)
      "package-lock.json", // Dependency lock (required for Foundry)
      "README.md", // Module documentation (required for Foundry)
      "LICENSE", // License file (required for Foundry)

      // Core module files
      "scripts/player-bespoke-audio.js", // Main module script
      "styles/player-bespoke-audio.css", // Module styles
      "templates/audio-tab.hbs", // Audio tab template
      "templates/gm-controls.hbs", // GM controls template
      "lang/en.json", // English language file
    ];
  }

  // Files to exclude from the release
  getExcludeFiles() {
    return [
      // Development and build files
      "node_modules/",
      "scripts/",
      "dist/",
      "audio/",

      // Version control and documentation
      ".git/",
      ".github/",
      "CHANGELOG.md",
      "RELEASE_NOTES_*.md",
      "RELEASE_CHECKLIST.md",
      "COMMUNITY_*.md",
      "CONTRIBUTING.md",
      "*.txt",

      // Development tools
      ".vscode/",
      ".idea/",
      "test-upload.html",

      // Logs and temporary files
      "*.log",
      "*.tmp",
      "*.bak",

      // Environment and system files
      ".env",
      ".env.local",
      ".DS_Store",
      "Thumbs.db",
    ];
  }

  // Validate that all required files exist
  validateRequiredFiles() {
    const includeFiles = this.getIncludeFiles();
    const missingFiles = [];

    for (const file of includeFiles) {
      const filePath = path.join(this.rootDir, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
    }

    console.log("✓ All required files validated");
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
      if (exclude.endsWith("/")) {
        // Directory exclusion
        if (relativePath.startsWith(exclude.slice(0, -1))) {
          return true;
        }
      } else if (exclude.includes("*")) {
        // Pattern exclusion
        const pattern = exclude.replace(/\*/g, ".*");
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
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      output.on("close", () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✓ Package created successfully!`);
        console.log(`📁 Output: ${this.outputFile}`);
        console.log(`📊 Size: ${sizeMB} MB`);
        resolve();
      });

      archive.on("error", (err) => {
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
  }

  // Show what files are included in the final package
  showPackageContents() {
    console.log("\n📋 Package contents:");
    const includeFiles = this.getIncludeFiles();
    includeFiles.forEach((file, index) => {
      const filePath = path.join(this.rootDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${index + 1}. ${file} (${sizeKB} KB)`);
    });
    console.log(`\nTotal files: ${includeFiles.length}`);
  }

  // Add any additional files that aren't explicitly excluded
  addNonExcludedFiles(archive) {
    const addDirectory = (dirPath, basePath = "") => {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
          const fullPath = path.join(dirPath, item);
          const relativePath = path.join(basePath, item);

          // Skip if this path should be excluded
          if (this.shouldExclude(fullPath)) {
            continue;
          }

          try {
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
              // Only process non-empty directories
              const subItems = fs.readdirSync(fullPath);
              if (subItems.length > 0) {
                addDirectory(fullPath, relativePath);
              }
            } else if (stats.isFile()) {
              // Only add files that aren't in the exclude list
              if (!this.shouldExclude(fullPath)) {
                archive.file(fullPath, { name: relativePath });
                console.log(`✓ Added: ${relativePath}`);
              }
            }
          } catch (error) {
            console.warn(
              `⚠️  Warning: Could not process ${relativePath}: ${error.message}`
            );
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
      console.log(
        `🚀 Starting packaging process for ${this.packageName} v${this.version}`
      );

      // Validate required files first
      this.validateRequiredFiles();

      // Create output directory
      this.createOutputDir();

      // Create zip file
      await this.createZip();

      // Show final package contents
      this.showPackageContents();

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
