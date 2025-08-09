<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Development environment setup instructions
-->

# Setup Instructions

## Prerequisites

### System Requirements

- **Node.js**: >= 18.18.0 (verified in package.json engines)
- **Package Manager**: npm, pnpm, yarn, or bun (auto-detected)
- **Git**: Required for repository operations and hooks
- **Terminal**: PowerShell, Bash, or compatible shell

### Development Tools

- **TypeScript**: Configured via tsconfig.json
- **ESLint**: Flat config with TypeScript support
- **Prettier**: Code formatting with lint-staged integration
- **Husky**: Git hooks for quality gates

## Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/platformrocks/osr.create.git
   cd osr.create
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or your preferred package manager
   ```

3. **Initialize Git Hooks**
   ```bash
   npm run prepare
   ```

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Run CLI in development mode
npm run test            # Run CLI with --dry-run flag

# Building
npm run build           # Compile TypeScript + resolve aliases
npm run typecheck       # Type check without emitting files

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes
npm run check           # Run all checks (typecheck + lint + format)
npm run fix             # Fix all auto-fixable issues

# Commits
npm run commit          # Interactive commit with Commitizen
```

### Git Workflow

1. **Quality Gates**: Pre-commit hooks run automatically
   - ESLint with zero warnings
   - Prettier formatting
   - TypeScript type checking

2. **Conventional Commits**: Commit messages are validated
   - Use `npm run commit` for interactive commit creation
   - Manual commits must follow conventional format
   - See COMMITS.md for detailed guide

3. **Supported Commit Types**:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `test:` - Test additions/changes
   - `build:` - Build system changes
   - `ci:` - CI/CD changes
   - `chore:` - Maintenance tasks

## Architecture Overview

### TypeScript Configuration

- **Target**: ES2022
- **Module**: ES2022 with bundler resolution
- **Path Aliases**:
  - `@/` → `src/`
  - `@commands/` → `src/commands/`
  - `@utils/` → `src/utils/`

### Build Process

1. TypeScript compilation (`tsc`)
2. Path alias resolution (`tsc-alias`)
3. Output to `dist/` directory

### CLI Structure

- **Entry Point**: `bin/create.js` (Node.js shim)
- **Main Logic**: `src/index.ts` (Commander.js setup)
- **Commands**: `src/commands/` (Individual command logic)
- **Utilities**: `src/utils/` (Shared functionality)

## Testing the CLI

### Local Testing

```bash
# Test help output
node bin/create.js --help

# Test dry run mode
node bin/create.js test-project --dry-run

# Test with different options
node bin/create.js my-app --template web --pm pnpm --dry-run
```

### Linking for Global Use

```bash
npm link
platformrocks --help
npm unlink  # when done testing
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure build was run after path alias changes
2. **Hook Failures**: Check ESLint/Prettier configuration
3. **Type Errors**: Verify TypeScript configuration and dependencies
4. **Commit Rejected**: Follow conventional commit format

### Debugging

- Use `npm run dev` for development execution
- Check `dist/` directory for compiled output
- Review `.husky/` hooks if git operations fail
- Use `--verbose` flag with CLI for detailed output

## IDE Configuration

### VS Code

Recommended extensions:

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- GitLens

### Settings

The project includes `.vscode/settings.json` with optimal configuration.
