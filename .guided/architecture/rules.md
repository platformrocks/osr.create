<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Architectural rules and principles for the @platformrocks/create CLI
-->

# Architectural Rules

**Last Updated**: August 9, 2025  
**Rule Owner**: Architecture Team

## Core Architectural Principles

### 1. Separation of Concerns

**Principle**: Each module has a single, well-defined responsibility  
**Implementation**:

- Commands handle UI and orchestration only
- Utilities handle specific technical operations
- No business logic in the main entry point

**Enforcement**: Mandatory

```typescript
// GOOD: Single responsibility utility
export async function detectPackageManager(): Promise<string> {
  // Only package manager detection logic
}

// BAD: Mixed responsibilities
export async function detectAndInstallWithPackageManager() {
  // Both detection AND installation - violates SRP
}
```

### 2. Dependency Direction

**Principle**: Dependencies flow from higher to lower abstraction levels  
**Implementation**: Commands → Utils → Node.js APIs  
**Enforcement**: Mandatory

```typescript
// GOOD: Command depends on utility
import { detectPackageManager } from '@utils/detectPm.js';

// BAD: Utility depends on command
import { createWeb } from '@commands/createWeb.js'; // in utility
```

### 3. Error Handling Strategy

**Principle**: All errors must be handled gracefully with user-friendly messages  
**Implementation**: Categorized exit codes with helpful recovery suggestions  
**Enforcement**: Mandatory

### 4. Async-First Design

**Principle**: All I/O operations must be asynchronous  
**Implementation**: Use async/await throughout, no blocking operations  
**Enforcement**: Mandatory

## Module Design Rules

### 1. TypeScript Path Aliases (Mandatory)

**Rule**: Use path aliases for internal imports  
**Rationale**: Cleaner imports, easier refactoring

```typescript
// GOOD
import { createWeb } from '@commands/createWeb.js';
import { detectPackageManager } from '@utils/detectPm.js';

// BAD
import { createWeb } from '../commands/createWeb.js';
import { detectPackageManager } from '../utils/detectPm.js';
```

### 2. ESM Import Extensions (Mandatory)

**Rule**: Always include .js extension in import paths  
**Rationale**: ESM module resolution requirement

### 3. Interface-First Design (Recommended)

**Rule**: Define TypeScript interfaces for all options and configurations  
**Rationale**: Type safety and clear contracts

```typescript
export interface CreateWebOptions {
  template: string;
  pm?: string;
  git: boolean;
  install: boolean;
  force: boolean;
  dryRun: boolean;
  verbose: boolean;
}
```

## Data Flow Rules

### 1. Command Pattern (Mandatory)

**Rule**: Each CLI command is a separate module with consistent signature  
**Implementation**: All commands accept (appName, options) parameters

### 2. Validation Pipeline (Mandatory)

**Rule**: Validate environment before executing operations  
**Implementation**: Check Node.js version, Git availability, network connectivity

### 3. Progress Feedback (Recommended)

**Rule**: Provide progress indicators for operations >1 second  
**Implementation**: Use ora spinners with descriptive messages

## Security Rules

### 1. Input Validation (Mandatory)

**Rule**: All user inputs must be validated before processing  
**Implementation**: Project name validation, path sanitization

### 2. Path Traversal Prevention (Mandatory)

**Rule**: Prevent directory traversal attacks  
**Implementation**: Validate and sanitize all path inputs

### 3. Process Security (Mandatory)

**Rule**: Execute external processes with restricted permissions  
**Implementation**: Use execa with proper argument escaping

## Performance Rules

### 1. Lazy Loading (Recommended)

**Rule**: Load dependencies only when needed  
**Implementation**: Dynamic imports for optional features

```typescript
// GOOD: Lazy load when needed
const { execa } = await import('execa');

// ACCEPTABLE: Static import if always used
import { execa } from 'execa';
```

### 2. Resource Management (Mandatory)

**Rule**: Clean up temporary resources  
**Implementation**: Automatic cleanup on error or completion

### 3. Startup Performance (Recommended)

**Rule**: CLI should start in <100ms  
**Implementation**: Minimal synchronous operations during startup

## Testing Rules

### 1. Test Coverage (Mandatory)

**Rule**: All public functions must have tests  
**Target**: >80% coverage overall, >90% critical paths

### 2. Mock External Dependencies (Mandatory)

**Rule**: Mock all external system dependencies in tests  
**Implementation**: Mock file system, network, process execution

### 3. Error Path Testing (Recommended)

**Rule**: Test error scenarios and edge cases  
**Implementation**: Network failures, permission errors, invalid inputs

## Code Organization Rules

### 1. File Naming (Mandatory)

**Rule**: Use kebab-case for files, camelCase for functions

```
// GOOD
src/utils/detect-pm.ts       // File name
export function detectPm()  // Function name

// BAD
src/utils/DetectPM.ts
export function detect_pm()
```

### 2. Export Strategy (Recommended)

**Rule**: Use named exports, avoid default exports for utilities  
**Rationale**: Better tree-shaking and explicit imports

### 3. Documentation (Recommended)

**Rule**: Add JSDoc for exported functions  
**Implementation**: Document parameters, return types, and usage

## Configuration Rules

### 1. Environment Variables (Optional)

**Rule**: Support configuration via environment variables where appropriate  
**Implementation**: Package manager preference, template sources

### 2. Configuration Files (Optional)

**Rule**: Support project-level configuration files  
**Implementation**: Future consideration for .platformrocksrc

## Dependency Rules

### 1. Minimal Dependencies (Mandatory)

**Rule**: Keep production dependencies minimal and well-maintained  
**Current**: 6 production dependencies  
**Review**: Monthly dependency audit

### 2. Dependency Quality (Mandatory)

**Rule**: Only use dependencies with >10k weekly downloads and active maintenance  
**Enforcement**: Manual review for new dependencies

### 3. Security Updates (Mandatory)

**Rule**: Apply security updates within 24 hours of discovery  
**Implementation**: Dependabot automated updates

## Release Rules

### 1. Semantic Versioning (Mandatory)

**Rule**: Follow semantic versioning strictly  
**Implementation**: Automated with conventional commits

### 2. Release Notes (Recommended)

**Rule**: Provide clear release notes for all changes  
**Implementation**: Generated from conventional commit messages

### 3. Backward Compatibility (Recommended)

**Rule**: Maintain backward compatibility within major versions  
**Implementation**: Deprecation warnings before breaking changes

## Exception Handling

### When Rules May Be Broken

**Performance Critical Path**: Rules may be relaxed for performance-critical operations  
**External Library Constraints**: When integrating with libraries that don't follow our conventions  
**Temporary Technical Debt**: With explicit TODO and timeline for resolution

### Rule Change Process

1. Propose change in architectural review
2. Update this document
3. Update related tooling (ESLint, etc.)
4. Communicate to team
5. Refactor existing code if needed

## Rule Enforcement

### Automated Enforcement

- ESLint rules for import patterns
- TypeScript compiler for type safety
- Prettier for code formatting
- Commitlint for commit message format

### Manual Review

- Code review for architectural compliance
- Dependency audit for security
- Performance review for bottlenecks

## Conclusion

These architectural rules provide the foundation for maintainable, secure, and performant CLI development. They should be followed consistently but can be adapted based on evolving requirements and lessons learned.
