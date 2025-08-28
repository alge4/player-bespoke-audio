#!/usr/bin/env node

/**
 * Release Script for Player Bespoke Audio Module
 *
 * Creates a release package and uploads it to GitHub using GitHub CLI
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class ReleaseManager {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.packageName = "player-bespoke-audio";
    this.version = this.getVersion();
    this.tagName = `v${this.version}`;
  }

  // Get version from package.json
  getVersion() {
    const packagePath = path.join(this.rootDir, "package.json");
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageData.version;
  }

  // Check if GitHub CLI is installed
  checkGitHubCLI() {
    try {
      execSync("gh --version", { stdio: "ignore" });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Check if we're authenticated with GitHub
  checkGitHubAuth() {
    try {
      execSync("gh auth status", { stdio: "ignore" });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Create and push a git tag
  createTag() {
    try {
      console.log(`🏷️  Creating git tag: ${this.tagName}`);
      
      // Check if tag already exists
      try {
        execSync(`git tag -l "${this.tagName}"`, { stdio: "ignore" });
        console.log(`⚠️  Tag ${this.tagName} already exists`);
        return false;
      } catch (error) {
        // Tag doesn't exist, create it
      }

      execSync(`git tag ${this.tagName}`, { stdio: "inherit" });
      execSync(`git push origin ${this.tagName}`, { stdio: "inherit" });
      
      console.log(`✅ Tag ${this.tagName} created and pushed`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create tag: ${error.message}`);
      return false;
    }
  }

  // Create release package
  createPackage() {
    try {
      console.log("📦 Creating release package...");
      execSync("node scripts/package.js", { stdio: "inherit" });
      console.log("✅ Package created successfully");
      return true;
    } catch (error) {
      console.error(`❌ Failed to create package: ${error.message}`);
      return false;
    }
  }

  // Create GitHub release
  createGitHubRelease() {
    try {
      console.log("🚀 Creating GitHub release...");
      
      const packagePath = path.join(this.rootDir, "dist", `${this.packageName}-${this.version}.zip`);
      if (!fs.existsSync(packagePath)) {
        throw new Error("Release package not found");
      }

      // Create release with GitHub CLI
      const releaseCommand = [
        "gh release create",
        this.tagName,
        packagePath,
        "--title", `Player Bespoke Audio ${this.tagName}`,
        "--notes", `Release ${this.tagName} of Player Bespoke Audio module for Foundry VTT.`,
        "--draft=false",
        "--prerelease=false"
      ].join(" ");

      execSync(releaseCommand, { stdio: "inherit" });
      
      console.log("✅ GitHub release created successfully");
      return true;
    } catch (error) {
      console.error(`❌ Failed to create GitHub release: ${error.message}`);
      return false;
    }
  }

  // Main release process
  async release() {
    try {
      console.log(`🚀 Starting release process for ${this.packageName} ${this.tagName}`);

      // Check prerequisites
      if (!this.checkGitHubCLI()) {
        console.error("❌ GitHub CLI is not installed. Please install it first:");
        console.error("   https://cli.github.com/");
        process.exit(1);
      }

      if (!this.checkGitHubAuth()) {
        console.error("❌ Not authenticated with GitHub. Please run 'gh auth login' first.");
        process.exit(1);
      }

      // Create package
      if (!this.createPackage()) {
        process.exit(1);
      }

      // Create tag
      if (!this.createTag()) {
        console.log("⚠️  Skipping tag creation");
      }

      // Create GitHub release
      if (!this.createGitHubRelease()) {
        process.exit(1);
      }

      console.log(`\n🎉 Release ${this.tagName} completed successfully!`);
      console.log(`📦 Package: dist/${this.packageName}-${this.version}.zip`);
      console.log(`🏷️  Tag: ${this.tagName}`);
      console.log(`🔗 GitHub: https://github.com/alge4/player-bespoke-audio/releases/tag/${this.tagName}`);

    } catch (error) {
      console.error(`❌ Release failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const releaseManager = new ReleaseManager();
  await releaseManager.release();
}

if (require.main === module) {
  main();
}

module.exports = ReleaseManager;
