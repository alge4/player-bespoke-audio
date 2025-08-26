# Release Checklist

This checklist ensures that every release of the Player Bespoke Audio module meets quality standards and is ready for the community.

## 🚀 Pre-Release Preparation

### Code Quality

- [ ] All tests pass (`npm test`)
- [ ] JavaScript syntax validation (`npm run validate`)
- [ ] No console errors or warnings in browser
- [ ] Code follows project style guidelines
- [ ] All TODO items resolved or documented

### Documentation

- [ ] README.md is up to date
- [ ] CHANGELOG.md has new version entry
- [ ] All new features documented
- [ ] Installation instructions verified
- [ ] Usage examples tested and working

### Testing

- [ ] Module loads without errors in Foundry VTT
- [ ] Audio tab appears on character sheets
- [ ] File upload functionality works
- [ ] Audio playback works for target players
- [ ] GM controls function properly
- [ ] Error handling works as expected
- [ ] Cross-browser compatibility verified

## 📦 Release Process

### 1. Version Update

```bash
# Choose release type:
npm run release:patch    # 1.0.0 -> 1.0.1
npm run release:minor    # 1.0.0 -> 1.1.0
npm run release:major    # 1.0.0 -> 2.0.0
npm run release:beta     # 1.0.0 -> 1.0.0-beta.1
npm run release:rc       # 1.0.0 -> 1.0.0-rc.1
```

### 2. Manual Verification

- [ ] Version numbers updated in all files
- [ ] CHANGELOG.md updated with new entry
- [ ] Release notes generated
- [ ] All files committed to git

### 3. Git Operations

```bash
git add .
git commit -m "Release version X.Y.Z"
git tag -a vX.Y.Z -m "Release version X.Y.Z"
git push origin main
git push origin vX.Y.Z
```

### 4. GitHub Release

- [ ] GitHub Actions workflow triggered automatically
- [ ] Release package created and uploaded
- [ ] Release notes populated
- [ ] Download links verified
- [ ] Release marked as latest

## 🔍 Post-Release Verification

### Community Testing

- [ ] Share release with beta testers
- [ ] Monitor GitHub Issues for bugs
- [ ] Check Foundry VTT Discord for feedback
- [ ] Verify installation from manifest URL

### Documentation Updates

- [ ] Update any external documentation
- [ ] Update Foundry VTT community resources
- [ ] Update module browser listings if applicable

## 📋 Release Types

### Patch Release (X.Y.Z+1)

- Bug fixes
- Minor improvements
- Documentation updates
- No breaking changes

### Minor Release (X.Y+1.0)

- New features
- Enhancements
- Backwards compatible
- May include deprecation warnings

### Major Release (X+1.0.0)

- Breaking changes
- Major feature additions
- Architecture changes
- Requires migration guide

### Pre-release (X.Y.Z-beta.N / X.Y.Z-rc.N)

- Testing versions
- Feature previews
- Not for production use
- Community feedback collection

## 🚨 Emergency Procedures

### Hotfix Release

If critical bugs are discovered:

1. Create hotfix branch from previous stable release
2. Fix the critical issue
3. Test thoroughly
4. Release as patch version
5. Merge back to main branch

### Rollback Plan

If a release has critical issues:

1. Mark GitHub release as deprecated
2. Update module.json manifest URL to previous version
3. Communicate issue to community
4. Prepare hotfix release

## 📊 Quality Metrics

### Code Coverage

- [ ] All critical paths tested
- [ ] Error conditions handled
- [ ] Edge cases considered

### Performance

- [ ] Module loads in < 2 seconds
- [ ] Audio playback starts in < 1 second
- [ ] File uploads complete successfully
- [ ] Memory usage remains stable

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] High contrast mode supported
- [ ] Focus indicators visible

## 🎯 Success Criteria

A successful release should:

- ✅ Load without errors in Foundry VTT
- ✅ Function as documented
- ✅ Handle errors gracefully
- ✅ Provide good user experience
- ✅ Be accessible to all users
- ✅ Work across different browsers
- ✅ Integrate seamlessly with Foundry VTT

## 📞 Support

For release-related questions or issues:

- Create GitHub Issue with [Release] tag
- Contact maintainers via Discord
- Check Foundry VTT community resources

---

**Remember**: Every release represents the module to the community. Take the time to ensure quality and test thoroughly!
