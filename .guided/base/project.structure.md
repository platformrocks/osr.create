<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Document project folder structure and organization
-->

# Project Structure

## Overview

This document describes the folder structure and organization of the @platformrocks/create CLI project.

## Root Structure

```
osr.create/
├── .guided/                    # Guided Engineering documentation
├── .husky/                     # Git hooks configuration
├── bin/                        # Executable entry points
├── dist/                       # Compiled TypeScript output
├── src/                        # Source code
│   ├── commands/              # CLI command implementations
│   ├── utils/                 # Utility functions and modules
│   └── index.ts              # Main CLI entry point
├── scripts/                   # Build and development scripts
│   └── codemods/             # Code transformation utilities
├── tests/                     # Test files (future)
├── package.json               # Node.js package configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
├── commitlint.config.js      # Commit message linting
├── COMMITS.md                # Conventional commits guide
├── README.md                 # Project documentation
└── LICENSE                   # MIT license
```

## Source Code Organization

### `/src/commands/`

Contains individual CLI command implementations:

- `createWeb.ts` - Web project scaffolding command

### `/src/utils/`

Contains utility modules organized by responsibility:

- `detectPm.ts` - Package manager detection
- `ensureDir.ts` - Directory validation and creation
- `initGit.ts` - Git repository initialization
- `installDeps.ts` - Dependency installation
- `patchPkgName.ts` - Package name updating

### `/bin/`

Contains Node.js executable shims:

- `create.js` - Main CLI entry point with shebang

### `/dist/`

Contains compiled JavaScript output from TypeScript:

- Mirrors source structure
- Uses relative imports (resolved from path aliases)

## Configuration Files

- **`tsconfig.json`**: TypeScript compiler configuration with path aliases
- **`eslint.config.js`**: ESLint flat configuration for TypeScript
- **`commitlint.config.js`**: Conventional commit validation rules
- **`package.json`**: NPM package configuration with scripts and dependencies

## Documentation Structure

- **`README.md`**: Main project documentation
- **`COMMITS.md`**: Conventional commits usage guide
- **`LICENSE`**: MIT license text
- **`.guided/`**: Guided Engineering documentation (this structure)

## Build Artifacts

- **`dist/`**: Compiled JavaScript (gitignored in development)
- **`node_modules/`**: NPM dependencies (gitignored)
- **`.husky/`**: Git hook scripts

## Key Architectural Decisions

1. **ESM First**: Uses ES modules throughout with `"type": "module"`
2. **TypeScript Path Aliases**: Clean imports using `@commands/` and `@utils/`
3. **Monolithic CLI**: Single package design (not a monorepo)
4. **Commander.js**: CLI framework for argument parsing and help
5. **Modular Utilities**: Each utility has single responsibility
