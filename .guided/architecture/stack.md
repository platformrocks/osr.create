<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Technology stack and framework choices for @platformrocks/create CLI
-->

# Technology Stack

## Runtime Environment

### Node.js

- **Version**: >= 18.18.0 (LTS)
- **Reason**: Modern JavaScript features, stable LTS support, wide compatibility
- **Features Used**: ESM modules, top-level await, dynamic imports
- **Alternatives Considered**: Bun, Deno (chose Node.js for ecosystem compatibility)

### Package Management

- **Primary**: npm (default Node.js package manager)
- **Supported**: yarn, pnpm, bun (auto-detection and usage)
- **Distribution**: NPM registry (@platformrocks/create)

## Core Dependencies

### CLI Framework

- **Commander.js**: v14.0.0
- **Purpose**: Argument parsing, subcommands, help generation
- **Reason**: Mature, lightweight, excellent TypeScript support
- **Alternatives**: yargs, oclif (chose Commander for simplicity)

### User Interface

- **ora**: v8.2.0 - Elegant terminal spinners and progress indicators
- **prompts**: v2.4.2 - Interactive command-line prompts
- **kolorist**: v1.8.0 - Terminal color formatting (ESM-compatible)
- **Reason**: Consistent CLI user experience across platforms

### System Integration

- **execa**: v9.6.0 - Process execution (git, package managers)
- **giget**: v2.0.0 - Template download from Git repositories
- **Reason**: Reliable cross-platform process management and Git operations

## Development Stack

### Language & Compilation

- **TypeScript**: v5.9.2
- **Target**: ES2022 (modern JavaScript features)
- **Module System**: ES2022 with bundler resolution
- **Build Tool**: tsc + tsc-alias (path alias resolution)

### Code Quality

- **ESLint**: v9.33.0 with flat configuration
- **Prettier**: v3.6.2 for code formatting
- **TypeScript ESLint**: v8.39.0 for TypeScript-specific rules
- **Configuration**: Zero-config approach with sensible defaults

### Development Workflow

- **tsx**: v4.20.3 - TypeScript execution for development
- **Husky**: v9.1.7 - Git hooks management
- **lint-staged**: v16.1.5 - Run linters on staged files
- **Commitizen**: Interactive commit message generation

### Commit Standards

- **@commitlint/cli**: v19.x - Commit message validation
- **@commitlint/config-conventional**: Conventional commits standard
- **cz-conventional-changelog**: Commitizen adapter

## Architecture Patterns

### Module Architecture

```typescript
// TypeScript Path Aliases
"paths": {
  "@/*": ["src/*"],
  "@utils/*": ["src/utils/*"],
  "@commands/*": ["src/commands/*"]
}
```

### Command Pattern

- Each CLI command is a separate module in `src/commands/`
- Utilities are organized by single responsibility in `src/utils/`
- Main entry point coordinates commands and error handling

### Error Handling Strategy

- Typed error handling with proper error codes
- Categorized exit codes for different failure types
- Graceful degradation with helpful error messages
- Automatic cleanup on operation failure

## Build & Distribution

### Build Process

1. **TypeScript Compilation**: `tsc` - Compile to ES2022 JavaScript
2. **Path Alias Resolution**: `tsc-alias` - Convert aliases to relative imports
3. **Output Structure**: Mirrors source structure in `dist/`
4. **Entry Points**: Node.js shim in `bin/` directory

### Package Configuration

```json
{
  "type": "module", // ESM-first approach
  "engines": {
    "node": ">=18.18.0" // LTS Node.js requirement
  },
  "bin": {
    "platformrocks": "bin/create.js"
  },
  "files": ["dist", "bin", "README.md", "LICENSE"]
}
```

### Distribution Strategy

- **NPM Registry**: Primary distribution channel
- **Scoped Package**: @platformrocks/create
- **Semantic Versioning**: Follows semver for releases
- **Binary Wrapper**: Node.js shim for cross-platform compatibility

## Infrastructure Dependencies

### External Services

- **GitHub**: Template repository hosting
- **NPM Registry**: Package distribution and dependency resolution
- **Git**: Version control and repository operations

### Template System

- **Storage**: GitHub repositories
- **Format**: Standard Git repositories with package.json
- **Validation**: Required files check, network connectivity test
- **Caching**: Future consideration for offline usage

## Security Considerations

### Dependency Management

- **Automated Updates**: Dependabot for security patches
- **Audit Process**: Regular npm audit checks
- **Minimal Dependencies**: Carefully curated dependency list
- **Supply Chain**: All dependencies from trusted sources

### Runtime Security

- **Input Validation**: All user inputs validated before processing
- **Path Traversal**: Protection against malicious directory paths
- **Process Isolation**: Careful subprocess execution with restricted permissions
- **Network Security**: HTTPS-only template downloads

## Performance Characteristics

### Startup Performance

- **Cold Start**: ~2 seconds for help/version commands
- **Warm Start**: ~1 second for subsequent operations
- **Binary Size**: ~50KB after compilation
- **Memory Usage**: ~30MB peak during template download

### Runtime Performance

- **Template Download**: Progress indication, parallel operations where possible
- **Dependency Installation**: Leverage package manager caching
- **File Operations**: Efficient file system operations with proper error handling
- **Network Operations**: Retry logic with exponential backoff

## Future Technical Considerations

### Planned Improvements

- **Bundle Optimization**: Reduce final bundle size
- **Caching Layer**: Local template and dependency caching
- **Plugin Architecture**: Extensible system for custom functionality
- **Performance Monitoring**: Telemetry for usage analytics

### Alternative Technologies Under Consideration

- **Rust/Go**: For performance-critical operations
- **WASM**: For cross-platform binary distribution
- **Native Binaries**: Using pkg or similar tools
- **Web Interface**: Complementary web-based project generator

## Testing Stack

### Planned Testing Infrastructure

- **Unit Testing**: Jest or Vitest for utility function testing
- **Integration Testing**: Full CLI workflow testing
- **E2E Testing**: Real template download and project creation
- **Performance Testing**: Benchmarking and regression testing
- **Cross-Platform Testing**: Windows, macOS, Linux validation

### Quality Gates

- **Type Safety**: TypeScript strict mode enforcement
- **Code Coverage**: >80% coverage target
- **Linting**: Zero warnings policy
- **Formatting**: Consistent code style enforcement
- **Commit Standards**: Conventional commits validation
