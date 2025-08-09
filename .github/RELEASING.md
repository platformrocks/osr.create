# Releasing Guide

This document describes how to cut a new release for @platformrocks/create.

## Prerequisites

### Environment Variables

The following environment variables must be set for the release process:

- **GITHUB_TOKEN**: GitHub personal access token with `repo` permissions. For GitHub Actions, this is automatically provided.
- **NPM_TOKEN**: npm authentication token for publishing packages. Create one at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens).

### Setup

Ensure you have the required dependencies installed:

```bash
pnpm install
# or
npm install
```

## Release Process

### 1. Prepare Changes

Make sure all changes are committed using [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` for new features (minor version bump)
- `fix:` for bug fixes (patch version bump)
- `feat!:` or `fix!:` for breaking changes (major version bump)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:` for other changes

Examples:

```bash
git commit -m "feat: add new template support"
git commit -m "fix: resolve package detection issue"
git commit -m "feat!: remove deprecated API methods"
```

### 2. Dry Run (Recommended)

Always perform a dry run first to preview what will happen:

```bash
pnpm release:dry
# or
npm run release:dry
```

This will show you:

- The next version that will be assigned
- Generated changelog entries
- GitHub release draft content
- npm publish simulation (no actual publishing)

### 3. Execute Release

When you're satisfied with the dry run results:

```bash
pnpm release
# or
npm run release
```

This will:

1. Generate a new version based on conventional commits
2. Update CHANGELOG.md with new entries
3. Create a git tag (format: `vX.Y.Z`)
4. Push changes and tags to GitHub
5. Create a GitHub Release with auto-generated notes
6. Publish the package to npm with public access and provenance

## Configuration Details

### Tag Format

Tags follow the format `vX.Y.Z` (e.g., `v1.2.3`).

### Changelog Generation

The changelog is automatically generated using conventional commits. It categorizes changes by type:

- **Features**: `feat:` commits
- **Bug Fixes**: `fix:` commits
- **Breaking Changes**: commits with `!` or `BREAKING CHANGE:` footer

### Monorepo Support

This repository is currently configured as a single package (packageDir = "."). If converted to a monorepo in the future, update the `variables.packageDir` in `.release-it.json` to point to the appropriate package directory (e.g., "packages/create").

## Troubleshooting

### Authentication Issues

**GitHub Token**: Ensure GITHUB_TOKEN has proper repo permissions. For GitHub Actions, use:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**npm Token**: Verify NPM_TOKEN is valid and has publish permissions:

```bash
npm whoami --registry=https://registry.npmjs.org
```

### Build Failures

If the build fails during release, check:

1. TypeScript compilation: `pnpm typecheck`
2. Linting: `pnpm lint`
3. Build process: `pnpm build`

### Version Conflicts

If there are version conflicts, ensure:

1. Working directory is clean (`git status`)
2. Latest changes are pulled (`git pull`)
3. No uncommitted changes exist

### Manual Recovery

If a release partially fails:

1. **Tag created but npm publish failed**:

   ```bash
   npm publish --access public
   ```

2. **npm published but GitHub release failed**:
   Create the release manually at github.com or re-run with `--no-npm.publish`

3. **Rollback a tag**:
   ```bash
   git tag -d vX.Y.Z
   git push origin --delete vX.Y.Z
   ```

## Configuration Files

- `.release-it.json`: Main configuration
- `CHANGELOG.md`: Auto-generated changelog
- `.npmrc`: npm authentication template
- `package.json`: Scripts and dependencies
