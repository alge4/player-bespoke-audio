# Release Methods

This document explains the different ways to create releases for the Player Bespoke Audio module.

## 🚀 Method 1: GitHub Actions with Auto-Versioning (Recommended)

**Automatic versioning and releases with intelligent version management**

### **Auto-Versioning Workflow:**

1. **Manual trigger** (Go to Actions → Auto-Version → Run workflow):

   - Choose version type: `patch`, `minor`, or `major`
   - Automatically increments version in `package.json` and `module.json`
   - Commits and pushes changes

2. **Automatic trigger** (on code changes):
   - **Main branch:** Clean version increment (e.g., 1.0.0 → 1.0.1)
   - **Feature branches:** Pre-release versions (e.g., 1.0.1-feature-branch)
   - **Bugfix branches:** Pre-release versions (e.g., 1.0.1-bugfix-crash)
   - **Hotfix branches:** Pre-release versions (e.g., 1.0.1-hotfix-security)

### **Release Workflow:**

1. **Manual trigger** (Go to Actions → Release → Run workflow):

   - Choose version type: `patch`, `minor`, or `major`
   - Automatically versions, packages, and creates release

2. **Tag-based release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

**Benefits:**

- ✅ Fully automated version management
- ✅ No manual version updates needed
- ✅ Intelligent version incrementing
- ✅ Automatic file updates
- ✅ Runs in GitHub's environment
- ✅ Automatic release notes generation

## 🖥️ Method 2: GitHub CLI (Local)

**Create releases directly from your local environment**

### Prerequisites:

1. Install GitHub CLI: https://cli.github.com/
2. Authenticate: `gh auth login`

### Usage:

```bash
npm run release
```

**What it does:**

1. Creates the release package
2. Creates and pushes a git tag
3. Creates a GitHub release with the package attached

**Benefits:**

- ✅ Fast and efficient
- ✅ Full control over the process
- ✅ Works offline (until upload)
- ✅ Can be scripted/automated

## 📦 Method 3: Manual Package + Upload

**Create package locally and manually upload to GitHub**

1. **Create package:**

   ```bash
   npm run package
   ```

2. **Upload to GitHub:**
   - Go to GitHub → Releases → Create a new release
   - Upload the zip file from `dist/` folder

**Benefits:**

- ✅ No additional tools required
- ✅ Full manual control
- ✅ Good for testing packages

## 📋 Release Checklist

Before creating any release:

- [ ] Update version in `package.json`
- [ ] Update version in `module.json`
- [ ] Test the module locally
- [ ] Commit all changes
- [ ] Push to main branch
- [ ] Create release (using any method above)

## 🔧 Configuration

### GitHub Actions

- **Release Workflow:** `.github/workflows/release.yml`
  - Triggers: Tag pushes, release creation, or manual dispatch
  - Automatically versions, packages, and creates releases
- **Auto-Version Workflow:** `.github/workflows/version-bump.yml`
  - Triggers: Manual dispatch or automatic on code changes
  - Automatically increments version numbers
  - Updates package.json and module.json

### Package Script

- File: `scripts/package.js`
- Includes only essential Foundry VTT files
- Creates optimized zip packages

### Release Script

- File: `scripts/release.js`
- Requires GitHub CLI
- Automates the entire release process

### Branch Management Script

- File: `scripts/create-branch.js`
- Command: `npm run branch <type> <name>`
- Creates properly named branches for auto-versioning
- Examples:
  - `npm run branch feature audio-upload` → `feature/audio-upload`
  - `npm run branch bugfix player-crash` → `bugfix/player-crash`
  - `npm run branch hotfix security-fix` → `hotfix/security-fix`

## 🔢 Versioning Strategy

### **Branch-Based Versioning:**

- **Main branch:** Clean semantic versions (1.0.0, 1.0.1, 1.1.0, 2.0.0)
- **Feature branches:** Pre-release versions (1.0.1-feature-audio-upload)
- **Bugfix branches:** Pre-release versions (1.0.1-bugfix-player-crash)
- **Hotfix branches:** Pre-release versions (1.0.1-hotfix-security-issue)

### **Version Increment Rules:**

- **Patch (1.0.0 → 1.0.1):** Bug fixes, minor improvements
- **Minor (1.0.0 → 1.1.0):** New features, backward compatible
- **Major (1.0.0 → 2.0.0):** Breaking changes, major rewrites

### **Pre-Release Versioning:**

- Based on the next official version
- Includes branch name for identification
- Automatically created when pushing to non-main branches
- Cannot be released (must merge to main first)

## 🎯 Recommended Workflow

### **Option A: Full Automation (Recommended)**

1. **Development:** Work on features in feature branches
2. **Testing:** Test locally and in development environment
3. **Auto-Version:** Go to Actions → Auto-Version → Run workflow
   - Choose version type: `patch`, `minor`, or `major`
4. **Release:** Go to Actions → Release → Run workflow
   - Choose same version type
5. **Verify:** Check GitHub releases page for the new release

### **Option B: Semi-Automated**

1. **Development:** Work on features in feature branches
2. **Testing:** Test locally and in development environment
3. **Push to main:** Automatically triggers version bump
4. **Release:** Use `npm run release` for quick releases
5. **Verify:** Check GitHub releases page for the new release

### **Option C: Manual Control**

1. **Development:** Work on features in feature branches
2. **Testing:** Test locally and in development environment
3. **Version Update:** Manually update version numbers
4. **Commit:** Commit and push changes to main
5. **Release:** Use `npm run release` for quick releases
6. **Verify:** Check GitHub releases page for the new release

## 🆘 Troubleshooting

### GitHub CLI Issues

- Ensure you're authenticated: `gh auth status`
- Check permissions on the repository
- Verify GitHub CLI is up to date

### Package Issues

- Run `npm run package` to test packaging locally
- Check that all required files exist
- Verify file paths in `scripts/package.js`

### GitHub Actions Issues

- Check Actions tab in GitHub for error logs
- Verify workflow file syntax
- Ensure repository has proper permissions
