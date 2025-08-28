# Release Methods

This document explains the different ways to create releases for the Player Bespoke Audio module.

## 🚀 Method 1: GitHub Actions (Recommended)

**Automatic releases when you push tags or create releases in GitHub**

1. **Push a tag** (triggers automatic release):

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create a release in GitHub** (triggers automatic release):
   - Go to GitHub → Releases → Create a new release
   - Tag: `v1.0.0`
   - Title: `Player Bespoke Audio v1.0.0`
   - Publish release

**Benefits:**

- ✅ Fully automated
- ✅ No local setup required
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

- Workflow file: `.github/workflows/release.yml`
- Triggers: Tag pushes and release creation
- Automatically packages and creates releases

### Package Script

- File: `scripts/package.js`
- Includes only essential Foundry VTT files
- Creates optimized zip packages

### Release Script

- File: `scripts/release.js`
- Requires GitHub CLI
- Automates the entire release process

## 🎯 Recommended Workflow

1. **Development:** Work on features in feature branches
2. **Testing:** Test locally and in development environment
3. **Version Update:** Update version numbers in package files
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
