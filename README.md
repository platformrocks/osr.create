# &#x23CF; @platformrocks/create

Bootstrap CLI for OpenSource.Rocks projects. A modern, fast, and ai-friendly project scaffolding tool.

## Installation

You can use the CLI without installation using npx:

```bash
npx @platformrocks/create my-app
```

Or install globally:

```bash
npm install -g @platformrocks/create
platformrocks create my-app
```

## Usage

### Basic Usage

```bash
# Create a new project with default settings
npx @platformrocks/create my-app

# Interactive mode (will prompt for project name)
npx @platformrocks/create
```

### With Options

```bash
# Specify template and package manager
npx @platformrocks/create my-app --template web --pm pnpm

# Skip git initialization and dependency installation
npx @platformrocks/create my-app --no-git --no-install

# Force overwrite existing directory
npx @platformrocks/create my-app --force

# Preview what would be created without executing
npx @platformrocks/create my-app --dry-run

# Enable verbose logging for debugging
npx @platformrocks/create my-app --verbose
```

## Options

| Option              | Alias | Description                                   | Default     |
| ------------------- | ----- | --------------------------------------------- | ----------- |
| `--template <name>` | `-t`  | Template to use for scaffolding               | `web`       |
| `--pm <manager>`    |       | Package manager to use (npm, yarn, pnpm, bun) | auto-detect |
| `--no-git`          |       | Skip git repository initialization            | `false`     |
| `--no-install`      |       | Skip dependency installation                  | `false`     |
| `--force`           | `-f`  | Overwrite existing directory                  | `false`     |
| `--dry-run`         |       | Show what would be done without executing     | `false`     |
| `--verbose`         | `-v`  | Enable verbose logging                        | `false`     |
| `--help`            | `-h`  | Show help information                         |             |
| `--version`         | `-V`  | Show version information                      |             |

## Templates

Currently available templates:

### Web Template (`web`)

- **Repository**: `github:platformrocks/osr.boilerplate-web`
- **Description**: Modern web application boilerplate
- **Includes**: React, TypeScript, Vite, Tailwind CSS, and more
- **Use case**: Full-stack web applications, SPAs, static sites

More templates coming soon!

## Examples

### Create a basic web application

```bash
npx @platformrocks/create my-web-app
cd my-web-app
npm run dev
```

### Create with specific package manager

```bash
npx @platformrocks/create my-app --pm pnpm
cd my-app
pnpm dev
```

### Create without git and dependencies for manual setup

```bash
npx @platformrocks/create my-app --no-git --no-install
cd my-app
git init
npm install
```

### Preview before creating

```bash
npx @platformrocks/create my-app --dry-run
# Review the planned steps, then run without --dry-run
npx @platformrocks/create my-app
```

## Troubleshooting

### Common Issues

**Node.js Version Error**

```
Error: Node.js 18+ is required. Current version: v16.x.x
```

- Solution: Update to Node.js 18 or later from [nodejs.org](https://nodejs.org)

**Network Connection Error**

```
Error: Cannot reach GitHub. Check your internet connection
```

- Solution: Check your internet connection and try again
- Alternative: Check if GitHub is accessible from your network

**Directory Not Empty Error**

```
Error: Directory "my-app" is not empty. Use --force to overwrite.
```

- Solution: Use `--force` flag or choose a different directory name
- Example: `npx @platformrocks/create my-app --force`

**Git Not Found Error**

```
Error: Git not found in PATH. Install Git or use --no-git flag.
```

- Solution: Install Git from [git-scm.com](https://git-scm.com) or use `--no-git`

**Permission Error**

```
Error: Permission denied. Try running with appropriate permissions.
```

- Solution: Run with appropriate permissions or choose a different directory
- On Windows: Run as Administrator or choose a directory in your user folder
- On macOS/Linux: Use `sudo` or choose a directory you have write access to

**Dependency Installation Failed**

```
Error: Failed to install dependencies with npm
```

- Solution: Try with a different package manager or use `--no-install`
- Example: `npx @platformrocks/create my-app --pm yarn`
- Alternative: `npx @platformrocks/create my-app --no-install` then install manually

### Debug Mode

Use the `--verbose` flag to see detailed logs for debugging:

```bash
npx @platformrocks/create my-app --verbose
```

### Getting Help

- Use `--help` for command-line help: `npx @platformrocks/create --help`
- Check the [GitHub Issues](https://github.com/platformrocks/osr.create/issues) for known issues
- Create a new issue if you encounter a bug or need help

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
git clone https://github.com/platformrocks/osr.create.git
cd osr.create/packages/create
npm install
```

### Development Scripts

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Test with dry-run
npm run test
```

### Testing Locally

```bash
# Build the project
npm run build

# Test the built CLI
node dist/index.js my-test-app --dry-run

# Test with actual execution
node dist/index.js my-test-app
```

### Testing as Packaged

```bash
# Create package
npm pack

# Install globally from package
npm install -g ./platformrocks-create-*.tgz

# Test installed CLI
create my-test-app --dry-run
```

## Publishing

### Prerequisites

- npm account with access to `@platformrocks` organization
- Proper authentication (`npm login`)

### Build and Publish

```bash
# Ensure clean build
npm run build

# Publish to npm
npm publish --access public

# Verify published package
npx @platformrocks/create --help
```

### Version Management

```bash
# Update patch version
npm version patch

# Update minor version
npm version minor

# Update major version
npm version major
```

## Architecture

The CLI is built with:

- **TypeScript** for type safety and better developer experience
- **Commander.js** for CLI argument parsing and command structure
- **ora** for beautiful loading spinners and progress indicators
- **kolorist** for colorful terminal output
- **prompts** for interactive user input
- **execa** for executing shell commands
- **giget** for downloading templates from GitHub repositories

### Project Structure

```
packages/create/
├── src/
│   ├── index.ts          # Main CLI application
│   └── utils.ts          # Utility functions
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## License

MIT © 2025 platform.rocks

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Create a Pull Request
