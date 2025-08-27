#!/usr/bin/env node

/**
 * Release Script for Player Bespoke Audio Module
 *
 * Usage:
 *   node scripts/release.js patch    # 1.0.0 -> 1.0.1
 *   node scripts/release.js minor    # 1.0.0 -> 1.1.0
 *   node scripts/release.js major    # 1.0.0 -> 2.0.0
 *   node scripts/release.js beta     # 1.0.0 -> 1.0.0-beta.1
 *   node scripts/release.js rc       # 1.0.0 -> 1.0.0-rc.1
 */

const fs = require("fs");
const path = require("path");

class ReleaseManager {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.filesToUpdate = ["package.json", "module.json"];
  }

  // Get current version from package.json
  getCurrentVersion() {
    const packagePath = path.join(this.rootDir, "package.json");
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageData.version;
  }

  // Parse version string
  parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!match) {
      throw new Error(`Invalid version format: ${version}`);
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4] || null,
    };
  }

  // Generate new version
  generateNewVersion(currentVersion, releaseType) {
    const parsed = this.parseVersion(currentVersion);

    switch (releaseType) {
      case "major":
        return `${parsed.major + 1}.0.0`;
      case "minor":
        return `${parsed.major}.${parsed.minor + 1}.0`;
      case "patch":
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
      case "beta":
        if (parsed.prerelease && parsed.prerelease.startsWith("beta.")) {
          const betaNum = parseInt(parsed.prerelease.split(".")[1]) + 1;
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-beta.${betaNum}`;
        } else {
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-beta.1`;
        }
      case "rc":
        if (parsed.prerelease && parsed.prerelease.startsWith("rc.")) {
          const rcNum = parseInt(parsed.prerelease.split(".")[1]) + 1;
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-rc.${rcNum}`;
        } else {
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-rc.1`;
        }
      default:
        throw new Error(`Unknown release type: ${releaseType}`);
    }
  }

  // Update version in a file
  updateVersionInFile(filePath, oldVersion, newVersion) {
    const content = fs.readFileSync(filePath, "utf8");
    const updatedContent = content.replace(
      new RegExp(oldVersion, "g"),
      newVersion
    );
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✓ Updated ${filePath}: ${oldVersion} -> ${newVersion}`);
  }

  // Update changelog
  updateChangelog(newVersion) {
    const changelogPath = path.join(this.rootDir, "CHANGELOG.md");
    const changelog = fs.readFileSync(changelogPath, "utf8");

    const today = new Date().toISOString().split("T")[0];
    const newEntry = `## [${newVersion}] - ${today}\n\n### Added\n- Release ${newVersion}\n\n`;

    const updatedChangelog = changelog.replace("## [Unreleased]", newEntry);
    fs.writeFileSync(changelogPath, updatedChangelog);
    console.log(`✓ Updated CHANGELOG.md with version ${newVersion}`);
  }

  // Create release notes
  createReleaseNotes(newVersion) {
    const changelogPath = path.join(this.rootDir, "CHANGELOG.md");
    const changelog = fs.readFileSync(changelogPath, "utf8");

    const versionMatch = changelog.match(
      new RegExp(`## \\[${newVersion}\\][\\s\\S]*?(?=## \\[|$)`)
    );
    if (versionMatch) {
      const releaseNotes = versionMatch[0].trim();
      const releaseNotesPath = path.join(
        this.rootDir,
        `RELEASE_NOTES_${newVersion}.md`
      );
      fs.writeFileSync(releaseNotesPath, releaseNotes);
      console.log(`✓ Created release notes: RELEASE_NOTES_${newVersion}.md`);
    }
  }

  // Create git tag command
  createGitCommands(newVersion) {
    console.log("\n📋 Git Commands to run:");
    console.log(`git add .`);
    console.log(`git commit -m "Release version ${newVersion}"`);
    console.log(`git tag -a v${newVersion} -m "Release version ${newVersion}"`);
    console.log(`git push origin main`);
    console.log(`git push origin v${newVersion}`);
  }

  // Main release process
  async release(releaseType) {
    try {
      console.log(`🚀 Starting release process for type: ${releaseType}`);

      const currentVersion = this.getCurrentVersion();
      console.log(`📦 Current version: ${currentVersion}`);

      const newVersion = this.generateNewVersion(currentVersion, releaseType);
      console.log(`🎯 New version: ${newVersion}`);

      // Update all files
      for (const file of this.filesToUpdate) {
        const filePath = path.join(this.rootDir, file);
        if (fs.existsSync(filePath)) {
          this.updateVersionInFile(filePath, currentVersion, newVersion);
        }
      }

      // Update changelog
      this.updateChangelog(newVersion);

      // Create release notes
      this.createReleaseNotes(newVersion);

      // Run package command to create clean release zip
      console.log(`\n📦 Creating release package...`);
      try {
        const { execSync } = require("child_process");
        execSync("npm run package", { stdio: "inherit" });
        console.log(`✅ Release package created successfully!`);
      } catch (error) {
        console.warn(
          `⚠️  Warning: Could not create release package: ${error.message}`
        );
        console.log(
          `💡 You can manually run 'npm run package' to create the release zip`
        );
      }

      console.log(`\n🎉 Release ${newVersion} prepared successfully!`);

      // Show git commands
      this.createGitCommands(newVersion);
    } catch (error) {
      console.error(`❌ Release failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const releaseType = process.argv[2];

  if (!releaseType) {
    console.log("Usage: node scripts/release.js <release-type>");
    console.log("Release types: patch, minor, major, beta, rc");
    console.log("\nExamples:");
    console.log("  node scripts/release.js patch    # 1.0.0 -> 1.0.1");
    console.log("  node scripts/release.js minor    # 1.0.0 -> 1.1.0");
    console.log("  node scripts/release.js major    # 1.0.0 -> 2.0.0");
    console.log("  node scripts/release.js beta     # 1.0.0 -> 1.0.0-beta.1");
    console.log("  node scripts/release.js rc       # 1.0.0 -> 1.0.0-rc.1");
    process.exit(1);
  }

  const releaseManager = new ReleaseManager();
  await releaseManager.release(releaseType);
}

if (require.main === module) {
  main();
}

module.exports = ReleaseManager;
