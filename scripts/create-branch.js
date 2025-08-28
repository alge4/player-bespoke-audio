#!/usr/bin/env node

/**
 * Create Branch Script for Player Bespoke Audio Module
 *
 * Creates feature branches with proper naming conventions for auto-versioning
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class BranchManager {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
  }

  // Get current branch
  getCurrentBranch() {
    try {
      return execSync("git branch --show-current", { encoding: "utf8" }).trim();
    } catch (error) {
      console.error("❌ Could not determine current branch");
      process.exit(1);
    }
  }

  // Get current version
  getCurrentVersion() {
    const packagePath = path.join(this.rootDir, "package.json");
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageData.version;
  }

  // Create a new feature branch
  createFeatureBranch(branchType, branchName) {
    try {
      const currentBranch = this.getCurrentBranch();

      if (currentBranch !== "main") {
        console.log(
          "⚠️  You're not on the main branch. Switching to main first..."
        );
        execSync("git checkout main", { stdio: "inherit" });
        execSync("git pull origin main", { stdio: "inherit" });
      }

      const fullBranchName = `${branchType}/${branchName}`;
      console.log(`🌿 Creating branch: ${fullBranchName}`);

      execSync(`git checkout -b ${fullBranchName}`, { stdio: "inherit" });
      execSync(`git push -u origin ${fullBranchName}`, { stdio: "inherit" });

      console.log(`✅ Branch ${fullBranchName} created and pushed`);
      console.log(
        `🔧 Auto-versioning will create: ${this.getCurrentVersion()}-${branchName.replace(
          /[^a-zA-Z0-9]/g,
          "-"
        )}`
      );
    } catch (error) {
      console.error(`❌ Failed to create branch: ${error.message}`);
      process.exit(1);
    }
  }

  // Show available branch types
  showBranchTypes() {
    console.log("📋 Available branch types:");
    console.log("  feature/  - New features and enhancements");
    console.log("  bugfix/   - Bug fixes and patches");
    console.log("  hotfix/   - Critical fixes for production");
    console.log("  develop/  - Development integration branch");
    console.log("");
    console.log("Examples:");
    console.log("  node scripts/create-branch.js feature audio-upload");
    console.log("  node scripts/create-branch.js bugfix player-crash");
    console.log("  node scripts/create-branch.js hotfix security-fix");
  }

  // Main execution
  async run() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.log("Usage: node scripts/create-branch.js <type> <name>");
      console.log("");
      this.showBranchTypes();
      process.exit(1);
    }

    const [branchType, branchName] = args;

    // Validate branch type
    const validTypes = ["feature", "bugfix", "hotfix", "develop"];
    if (!validTypes.includes(branchType)) {
      console.error(`❌ Invalid branch type: ${branchType}`);
      console.log("Valid types:", validTypes.join(", "));
      process.exit(1);
    }

    // Validate branch name
    if (!branchName || branchName.length < 2) {
      console.error("❌ Branch name must be at least 2 characters long");
      process.exit(1);
    }

    this.createFeatureBranch(branchType, branchName);
  }
}

// Main execution
async function main() {
  const branchManager = new BranchManager();
  await branchManager.run();
}

if (require.main === module) {
  main();
}

module.exports = BranchManager;
