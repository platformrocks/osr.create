<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: System boundaries and architectural contexts for @platformrocks/create CLI
-->

# Architecture Context

## System Overview

The @platformrocks/create CLI operates within a distributed ecosystem involving local development environments, remote template repositories, and package registries.

## Context Boundaries

### 1. Local Development Context

**Boundary**: Developer's local machine and development environment

**Components**:

- CLI executable and Node.js runtime
- Local file system operations
- Git repository management
- Package manager integration
- Development tools (editors, terminals)

**Responsibilities**:

- User interaction and command processing
- Project scaffolding and file generation
- Local dependency installation
- Git repository initialization

**Interfaces**:

- Command line interface (stdin/stdout/stderr)
- File system API for project creation
- Process execution for git and package managers
- Configuration file reading

### 2. Template Repository Context

**Boundary**: Remote GitHub repositories containing project templates

**Components**:

- Template repositories (github:platformrocks/osr.boilerplate-web)
- GitHub API and Git protocol
- Template validation logic
- Network connectivity checks

**Responsibilities**:

- Template storage and versioning
- Template metadata and validation
- Network-based template retrieval
- Template integrity verification

**Interfaces**:

- HTTPS API for repository access
- Git clone/download operations
- JSON metadata parsing
- Network error handling

### 3. Package Registry Context

**Boundary**: NPM registry and package manager ecosystem

**Components**:

- NPM registry (@platformrocks/create)
- Package managers (npm, yarn, pnpm, bun)
- Dependency resolution and installation
- Version management and updates

**Responsibilities**:

- CLI distribution and updates
- Dependency resolution and installation
- Package metadata and versioning
- Security scanning and validation

**Interfaces**:

- NPM registry API
- Package manager CLI integration
- Semantic versioning protocols
- Package.json specifications

### 4. Development Tools Context

**Boundary**: Code quality and development workflow tools

**Components**:

- Git hooks and commit validation
- ESLint, Prettier, TypeScript compiler
- Testing frameworks and CI/CD
- Documentation and build tools

**Responsibilities**:

- Code quality enforcement
- Commit message validation
- Automated testing and building
- Documentation generation

**Interfaces**:

- Git hook integration
- Linter and formatter APIs
- Build tool configuration
- Test runner integration

## Context Interactions

### CLI → Template Repository

```
CLI Request: Download template
├── Validate network connectivity
├── Fetch template repository
├── Validate template structure
└── Extract to local directory

Error Conditions:
- Network unavailable
- Repository not found
- Invalid template structure
- Insufficient disk space
```

### CLI → Package Manager

```
CLI Request: Install dependencies
├── Detect available package manager
├── Execute package manager command
├── Monitor installation progress
└── Validate installation success

Error Conditions:
- Package manager not found
- Network issues during install
- Dependency conflicts
- Permission errors
```

### CLI → Local File System

```
CLI Request: Create project structure
├── Validate target directory
├── Create directory structure
├── Copy and transform files
└── Set appropriate permissions

Error Conditions:
- Permission denied
- Disk space insufficient
- Path conflicts
- Invalid file names
```

### CLI → Git Repository

```
CLI Request: Initialize repository
├── Check Git availability
├── Initialize repository
├── Add initial files
└── Create initial commit

Error Conditions:
- Git not installed
- Invalid repository state
- Commit message validation failure
- Remote repository access issues
```

## Data Flow Architecture

### Input Processing Flow

```
User Input → Command Parser → Validation → Action Executor → Result
    ↓              ↓              ↓              ↓              ↓
Arguments    Commander.js    Environment    Command Logic    Output
Options      Help System     Checks         Error Handling   Feedback
```

### Template Processing Flow

```
Template Request → Network Validation → Download → Validation → Extraction
       ↓                    ↓               ↓           ↓           ↓
Template Name      GitHub API Check    giget Library  File Check  Local Files
Configuration      Connectivity        Progress       Metadata    Project Structure
```

### Project Creation Flow

```
Project Setup → Directory Creation → File Processing → Dependency Install → Git Init
      ↓                ↓                   ↓                ↓                 ↓
Configuration    File System API    Template Engine    Package Manager    Git Commands
Validation       Permission Check   Variable Substitution  Progress       Initial Commit
```

## Integration Points

### 1. External System Integrations

**GitHub Integration**

- **Protocol**: HTTPS Git operations
- **Authentication**: Public repository access (no auth required)
- **Rate Limits**: GitHub API rate limiting considerations
- **Fallback**: Error handling for connectivity issues

**Package Manager Integration**

- **Detection**: Lockfile-based detection (package-lock.json, yarn.lock, pnpm-lock.yaml)
- **Execution**: Child process spawning with proper error handling
- **Compatibility**: Support for multiple package manager versions
- **Isolation**: Process isolation for security

**Git Integration**

- **Commands**: init, add, commit operations through execa
- **Configuration**: Respect user's Git configuration
- **Validation**: Check Git availability and version
- **Error Handling**: Graceful degradation if Git unavailable

### 2. Internal System Boundaries

**Command Layer**

- **Purpose**: CLI command processing and coordination
- **Responsibilities**: Argument parsing, help generation, error handling
- **Interface**: Commander.js command definitions

**Business Logic Layer**

- **Purpose**: Core project creation logic
- **Responsibilities**: Template processing, project setup, validation
- **Interface**: Typed functions with clear contracts

**Infrastructure Layer**

- **Purpose**: External system interactions
- **Responsibilities**: File system, network, process operations
- **Interface**: Utility modules with error handling

## Configuration Management

### Configuration Sources (Priority Order)

1. **Command Line Arguments**: Highest priority, explicit user intent
2. **Configuration File**: `.createrc` (planned future feature)
3. **Environment Variables**: System-level configuration
4. **Default Values**: Fallback configuration

### Configuration Flow

```
CLI Args → Config File → Environment → Defaults → Merged Configuration
    ↓           ↓            ↓           ↓              ↓
User Intent  Saved Prefs  System Env  Built-in    Final Config
Override     Project      Variables   Defaults    Used by CLI
```

## Error Boundaries

### Network Error Boundary

- **Scope**: All remote operations (template download, connectivity checks)
- **Strategy**: Retry with exponential backoff, graceful degradation
- **Fallback**: Clear error messages with suggested actions

### File System Error Boundary

- **Scope**: Local file and directory operations
- **Strategy**: Permission validation, disk space checks, cleanup on failure
- **Fallback**: Rollback partially created structures

### Process Execution Error Boundary

- **Scope**: Git operations, package manager execution
- **Strategy**: Process isolation, timeout handling, error code interpretation
- **Fallback**: Alternative approaches or manual instruction guidance

### Validation Error Boundary

- **Scope**: User input, template structure, environment checks
- **Strategy**: Early validation, clear error messages, suggested fixes
- **Fallback**: Help system guidance and documentation references

## Security Context

### Trust Boundaries

1. **User Input**: Untrusted - requires validation
2. **Templates**: Semi-trusted - from known repositories but validated
3. **Dependencies**: Semi-trusted - from NPM registry with audit
4. **Local System**: Trusted - user's development environment

### Security Controls

- **Input Sanitization**: All user inputs validated before processing
- **Path Traversal Protection**: Directory creation within project boundaries
- **Process Isolation**: Limited subprocess permissions
- **Network Security**: HTTPS-only communications, certificate validation

## Performance Context

### Performance Boundaries

- **Startup Performance**: <2 seconds for help/info commands
- **Network Operations**: Progress indication for operations >3 seconds
- **File Operations**: Batch operations where possible
- **Memory Usage**: <100MB peak during typical operations

### Optimization Strategies

- **Lazy Loading**: Load dependencies only when needed
- **Parallel Operations**: Concurrent file operations where safe
- **Caching**: Template validation caching (future)
- **Streaming**: Stream large file operations
