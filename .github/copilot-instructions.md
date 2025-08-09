# GitHub Copilot Instructions

This file provides AI coding assistants with project-specific guidelines for the **@platformrocks/create** CLI tool. These instructions are derived from the actual codebase, `.guided/` documentation, and established patterns within the repository.

## Project Overview

**@platformrocks/create** is a modern CLI scaffolding tool built with TypeScript and Node.js ESM. It generates project boilerplates from remote Git templates with intelligent package manager detection, progress feedback, and comprehensive error handling.

**Core Architecture**: Command-driven CLI with modular utilities, TypeScript path aliases, and production-ready tooling pipeline.

## Technology Stack

### Runtime & Language

- **Node.js**: >=18.18.0 (ES2022 features, ESM modules)
- **TypeScript**: 5.9.2 (strict mode, bundler resolution)
- **Module System**: ES2022 with ESM imports/exports
- **Build**: `tsc` + `tsc-alias` for path alias resolution

### Key Dependencies

- **CLI Framework**: Commander.js 14.x for argument parsing
- **UI**: ora (spinners), prompts (interactive), kolorist (colors)
- **System**: execa (process execution), giget (template downloads)

### Development Tools

- **Linting**: ESLint 9.33.0 (flat config) + TypeScript ESLint 8.39.0
- **Formatting**: Prettier 3.6.2
- **Git Workflow**: Husky 9.1.7, lint-staged, commitlint (conventional commits)

## Code Style & Conventions

### File Organization

```
src/
├── index.ts              # CLI entry point with Commander.js setup
├── commands/             # Individual CLI command implementations
│   └── createWeb.ts      # Web project scaffolding command
└── utils/                # Single-responsibility utility modules
    ├── detectPm.ts       # Package manager detection
    ├── installDeps.ts    # Dependency installation
    ├── initGit.ts        # Git repository initialization
    └── *.ts              # Other utilities (ensureDir, patchPkgName)
```

### Import Patterns

```typescript
// Use TypeScript path aliases for internal imports
import { createWeb, type CreateWebOptions } from '@commands/createWeb.js';
import { detectPackageManager } from '@utils/detectPm.js';
import { validateDirectory } from '@utils/ensureDir.js';

// Always use .js extension in import paths (ESM requirement)
// Dynamic imports for lazy loading
const { readFileSync } = await import('fs');
const { default: fetch } = await import('node-fetch');
```

### File Headers

```typescript
/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

// Optional JSDoc for main functions
/**
 * Main function to create a web project
 */
export async function createWeb(
  appName: string | undefined,
  options: CreateWebOptions
): Promise<void> {
```

### TypeScript Patterns

```typescript
// Use explicit interfaces for options
export interface CreateWebOptions {
  template: string;
  pm?: string;
  git: boolean;
  install: boolean;
  force: boolean;
  dryRun: boolean;
  verbose: boolean;
}

// Use const assertions for constants
const EXIT_CODES = {
  SUCCESS: 0,
  NETWORK_ERROR: 1,
  PERMISSION_ERROR: 2,
  VALIDATION_ERROR: 3,
  DEPENDENCY_ERROR: 4,
  UNKNOWN_ERROR: 5
} as const;

// Prefer async/await over Promises
export async function detectPackageManager(): Promise<string> {
```

### Error Handling

```typescript
// Categorize errors with specific exit codes
async function handleError(error: unknown): Promise<void> {
  let exitCode: number = EXIT_CODES.UNKNOWN_ERROR;
  const message = error instanceof Error ? error.message : 'An unknown error occurred';

  // Provide helpful suggestions based on error type
  if (message.includes('network')) {
    exitCode = EXIT_CODES.NETWORK_ERROR;
    console.log(await formatInfo('Try again when you have a stable internet connection'));
  }

  process.exit(exitCode);
}

// Use try/catch with graceful fallbacks
try {
  await fs.access(join(cwd, 'pnpm-lock.yaml'));
  return 'pnpm';
} catch {}
```

### CLI UX Patterns

```typescript
// Use ora spinners for long operations
const spinner = ora('Downloading template...').start();
try {
  await downloadTemplate(template.repo, options);
  spinner.succeed('Template downloaded');
} catch (error) {
  spinner.fail('Download failed');
  throw error;
}

// Consistent color usage with kolorist
import { cyan, green, yellow, bold, dim } from 'kolorist';

console.log(bold(cyan('@platformrocks/create')));
console.log(dim('Bootstrap CLI for OpenSource.Rocks projects'));
console.log(green('Project created successfully!'));
console.log(formatWarning('Skipped dependency installation'));
```

## DO's and DON'Ts

### DO ✅

- Use TypeScript path aliases (`@commands/`, `@utils/`) for internal imports
- Add `.js` extension to all import paths (ESM requirement)
- Use async/await consistently throughout the codebase
- Implement comprehensive error handling with exit codes
- Use ora spinners for operations that take >1 second
- Validate environment and inputs before execution
- Provide dry-run mode for destructive operations
- Use kolorist for consistent terminal colors
- Follow conventional commit message format
- Use single-responsibility modules in utils/
- Implement graceful fallbacks for optional features

### DON'T ❌

- Don't use CommonJS require() - use ESM imports only
- Don't use relative imports for cross-directory modules
- Don't forget .js extensions in import paths
- Don't use console.log without appropriate color formatting
- Don't create large monolithic modules - prefer focused utilities
- Don't ignore errors - handle them with appropriate exit codes
- Don't skip input validation or environment checks
- Don't use process.exit() without helpful error messages
- Don't mix synchronous and asynchronous file operations
- Don't hardcode paths - use Node.js path utilities

### Function Naming Conventions

- **Commands**: Use verb-noun pattern (`createWeb`, `buildProject`)
- **Utilities**: Use descriptive verbs (`detectPackageManager`, `validateDirectory`)
- **Validation**: Prefix with `validate` (`validateEnvironment`, `validateNodeVersion`)
- **Formatting**: Prefix with `format` (`formatError`, `formatWarning`)
- **Checks**: Use question form (`validateGitAvailability`, returns boolean)

### Configuration Files

- Use flat ESLint configuration (`eslint.config.js`)
- Extend from `@commitlint/config-conventional`
- Configure TypeScript with strict mode and bundler resolution
- Use Prettier for consistent formatting across all file types

## Common Patterns

### Package Manager Detection

```typescript
// Check lockfiles first, then PATH availability
const managers = ['bun', 'pnpm', 'yarn', 'npm'];
for (const manager of managers) {
  try {
    await execa(manager, ['--version'], { stdio: 'ignore' });
    return manager;
  } catch {}
}
return 'npm'; // Always fallback to npm
```

### Environment Validation

```typescript
// Validate before execution, fail fast with helpful messages
await validateNodeVersion(); // Check Node.js >=18.18.0
await validateGitAvailability(); // If git features requested
await validateNetworkConnectivity(); // Check GitHub API access
```

### Template Processing

```typescript
// Use giget for Git template downloads
await downloadTemplate(template.repo, {
  dir: projectPath,
  force: true,
  offline: false,
  preferOffline: false
});
```

### Progress Feedback

```typescript
// Show configuration before execution
console.log(formatInfo('Configuration:'));
console.log(`  ${dim('Project name:')} ${appName}`);
console.log(`  ${dim('Template:')} ${options.template}`);

// Use spinners for async operations
const spinner = ora('Installing dependencies...').start();
await installDependencies(pm, projectPath, options.verbose);
spinner.succeed('Dependencies installed');
```

## Testing Guidelines

**Current Status**: No tests implemented (critical gap)
**Target**: Vitest + Playwright for unit, integration, and E2E testing
**Coverage**: >80% overall, >95% critical paths (CLI entry, command logic)

### Required Test Patterns

```typescript
// Mock external dependencies
vi.mock('execa', () => ({ execa: vi.fn() }));
vi.mock('fs', () => ({ ...memfs }));

// Test CLI commands with mocked file system
describe('createWeb command', () => {
  beforeEach(() => vol.reset());

  it('should create project with default settings', async () => {
    await createWeb('test-app', defaultOptions);
    expect(vol.existsSync('/test-app/package.json')).toBeTruthy();
  });
});
```

## Pull Request Checklist

Before submitting code, ensure:

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] ESLint passes with zero warnings (`pnpm lint`)
- [ ] Prettier formatting applied (`pnpm format`)
- [ ] Conventional commit message format
- [ ] New code follows established patterns and conventions
- [ ] Error handling implemented with appropriate exit codes
- [ ] CLI UX includes progress feedback and helpful messages
- [ ] `.js` extensions used in all import statements
- [ ] TypeScript path aliases used for internal imports
- [ ] JSDoc comments added to exported functions
- [ ] Environment validation for new features
- [ ] Graceful fallbacks for optional operations

## Guided Engineering Compliance

This project follows Guided Engineering practices with comprehensive documentation in `.guided/`:

- **Architecture**: Stack decisions, context boundaries, system analysis
- **Product**: Requirements, personas, roadmap planning
- **Testing**: Framework, strategy, coverage requirements
- **Assessment**: Risk analysis, system evaluation, technical recommendations

When making changes, consult relevant `.guided/` files and update documentation to maintain consistency with established architectural decisions and product direction.
