<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Testing framework and strategy documentation
-->

# Testing Framework

**Last Updated**: August 9, 2025  
**Testing Lead**: QualityEngineer  
**Project**: @platformrocks/create CLI

## Current Testing Status

⚠️ **CRITICAL GAP**: No automated testing framework is currently implemented. This represents a significant risk to code quality, refactoring safety, and production reliability.

## Recommended Testing Strategy

### 1. Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │ ← Few, High Value
                    │   (Playwright)  │   Integration scenarios
                    └─────────────────┘
                   ┌───────────────────┐
                   │ Integration Tests │ ← Some, Medium Coverage
                   │    (Vitest)      │   Command workflows
                   └───────────────────┘
                 ┌─────────────────────┐
                 │   Unit Tests        │ ← Many, High Coverage
                 │   (Vitest + Mocks)  │   Individual functions
                 └─────────────────────┘
```

### 2. Testing Framework Selection

**Primary Testing Framework: Vitest**

- **Rationale**: Native TypeScript support, ESM compatibility, fast execution
- **Benefits**: Familiar Jest API, built-in mocking, excellent IDE integration
- **Use Cases**: Unit tests, integration tests, snapshot testing

**E2E Testing Framework: Playwright**

- **Rationale**: Terminal automation capabilities, cross-platform support
- **Benefits**: Real CLI testing, screenshot capabilities, debugging tools
- **Use Cases**: Full workflow testing, template generation validation

**Mocking Framework: Vitest Built-in + MSW**

- **Rationale**: Integrated with Vitest, powerful HTTP mocking
- **Benefits**: Network request mocking, file system mocking
- **Use Cases**: GitHub API mocking, package manager simulation

## 3. Test Structure Organization

```
tests/
├── unit/                      # Unit tests (80% of tests)
│   ├── utils/
│   │   ├── detectPm.test.ts
│   │   ├── installDeps.test.ts
│   │   ├── initGit.test.ts
│   │   ├── ensureDir.test.ts
│   │   └── patchPkgName.test.ts
│   └── commands/
│       └── createWeb.test.ts
├── integration/               # Integration tests (15% of tests)
│   ├── cli.test.ts           # CLI argument parsing
│   ├── workflow.test.ts      # Complete workflows
│   └── error-handling.test.ts # Error scenarios
├── e2e/                      # End-to-end tests (5% of tests)
│   ├── create-web.spec.ts    # Full project creation
│   ├── dry-run.spec.ts       # Dry run functionality
│   └── error-scenarios.spec.ts # Error handling
├── fixtures/                 # Test data and templates
│   ├── templates/
│   │   └── minimal-web/
│   ├── package-json/
│   └── mock-responses/
└── helpers/                  # Test utilities
    ├── fs-utils.ts          # File system helpers
    ├── cli-runner.ts        # CLI execution helpers
    └── mock-factories.ts    # Mock data factories
```

## 4. Test Coverage Requirements

### Coverage Targets

- **Overall Coverage**: ≥80%
- **Unit Test Coverage**: ≥90%
- **Integration Coverage**: ≥70%
- **Critical Path Coverage**: 100%

### Coverage Exclusions

- Generated files (build output)
- Configuration files
- Type definitions only
- External library integrations (with mocked integration tests)

### Critical Paths Requiring 100% Coverage

1. CLI argument parsing and validation
2. Template download and processing
3. Project generation workflow
4. Error handling and categorization
5. File system operations

## 5. Test Implementation Plan

### Phase 1: Foundation Setup (Week 1)

```typescript
// Example: Basic test setup
import { describe, it, expect, vi } from 'vitest';
import { detectPm } from '@utils/detectPm';

describe('detectPm', () => {
  it('should detect npm when available', async () => {
    // Mock command execution
    vi.mocked(execa).mockResolvedValue({ stdout: 'npm' });

    const result = await detectPm();

    expect(result).toBe('npm');
    expect(execa).toHaveBeenCalledWith('npm', ['--version']);
  });
});
```

### Phase 2: Unit Tests (Week 2-3)

**Utility Function Tests**

```typescript
// detectPm.test.ts - Package manager detection
describe('detectPm', () => {
  afterEach(() => vi.clearAllMocks());

  it('should detect npm when available');
  it('should detect yarn when npm unavailable');
  it('should detect pnpm when others unavailable');
  it('should fallback to npm when none detected');
  it('should handle command execution failures');
});

// installDeps.test.ts - Dependency installation
describe('installDeps', () => {
  it('should install with detected package manager');
  it('should handle installation failures gracefully');
  it('should skip installation in dry run mode');
  it('should show progress during installation');
});

// initGit.test.ts - Git repository initialization
describe('initGit', () => {
  it('should initialize git repository successfully');
  it('should handle git unavailable gracefully');
  it('should skip git init in dry run mode');
  it('should create initial commit when requested');
});
```

### Phase 3: Integration Tests (Week 4)

**Command Integration Tests**

```typescript
// cli.test.ts - CLI integration
describe('CLI Integration', () => {
  it('should parse create web command correctly');
  it('should validate required arguments');
  it('should show help when no arguments provided');
  it('should handle version flag correctly');
});

// workflow.test.ts - Full workflow testing
describe('Project Creation Workflow', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  it('should create project with all default options');
  it('should create project with custom options');
  it('should handle template download failures');
  it('should clean up on operation failure');
});
```

### Phase 4: E2E Tests (Week 5)

**End-to-End Scenarios**

```typescript
// create-web.spec.ts - Full project creation
import { test, expect } from '@playwright/test';

test.describe('Create Web Project', () => {
  test('should create complete web project', async ({ page }) => {
    // Execute CLI command
    const process = await startCLI(['create', 'web', 'test-project']);

    // Verify project creation
    await expect(process.stdout).toContain('Project created successfully');

    // Verify file structure
    const projectExists = await fileExists('test-project/package.json');
    expect(projectExists).toBeTruthy();
  });
});
```

## 6. Mock Strategy

### File System Mocking

```typescript
import { vi } from 'vitest';
import { vol } from 'memfs';

// Mock Node.js fs module
vi.mock('fs', () => ({ ...memfs }));
vi.mock('fs/promises', () => ({ ...memfs.promises }));

beforeEach(() => {
  vol.reset();
  vol.fromJSON({
    '/tmp': null,
    '/project': null
  });
});
```

### Network Mocking

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('https://api.github.com/repos/:owner/:repo/tarball/:ref', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body(mockTarball));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Command Execution Mocking

```typescript
import { vi } from 'vitest';

vi.mock('execa', () => ({
  default: vi.fn(),
  execa: vi.fn()
}));

const mockExeca = vi.mocked(execa);

beforeEach(() => {
  mockExeca.mockResolvedValue({
    stdout: '',
    stderr: '',
    exitCode: 0
  });
});
```

## 7. Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@utils': resolve(__dirname, './src/utils'),
      '@commands': resolve(__dirname, './src/commands')
    }
  }
});
```

### Package.json Test Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

## 8. Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 9. Test Data Management

### Fixtures Strategy

```typescript
// tests/fixtures/index.ts
export const mockTemplateResponse = {
  name: 'web-template',
  tarball_url: 'https://api.github.com/repos/example/template/tarball/main'
};

export const mockPackageJson = {
  name: 'test-project',
  version: '1.0.0',
  scripts: {
    dev: 'vite',
    build: 'vite build'
  }
};

export const createMockProject = (overrides = {}) => ({
  ...mockPackageJson,
  ...overrides
});
```

### Test Environment Setup

```typescript
// tests/setup.ts
import { beforeEach, afterEach } from 'vitest';
import { vol } from 'memfs';

beforeEach(() => {
  // Reset file system
  vol.reset();

  // Setup mock directories
  vol.fromJSON({
    '/tmp': null,
    '/home/user': null,
    '/test-projects': null
  });

  // Reset environment variables
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  vol.reset();
});
```

## 10. Quality Gates

### Pre-commit Hooks

```json
{
  "lint-staged": {
    "src/**/*.{ts,js}": [
      "eslint --fix",
      "prettier --write",
      "vitest run --changed --passWithNoTests"
    ]
  }
}
```

### CI/CD Requirements

- All tests must pass before merge
- Coverage must meet minimum thresholds
- No new ESLint violations
- E2E tests must pass on target platforms

## 11. Performance Testing

### Load Testing Strategy

```typescript
// tests/performance/startup.test.ts
describe('Performance Tests', () => {
  it('should start CLI within 100ms', async () => {
    const start = performance.now();
    await import('../src/index.js');
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
  });
});
```

### Benchmark Testing

```typescript
import { bench, describe } from 'vitest';

describe('Template Processing Performance', () => {
  bench('process large template', async () => {
    await processTemplate(largeMockTemplate);
  });

  bench('extract tarball', async () => {
    await extractTarball(mockTarballBuffer);
  });
});
```

## 12. Implementation Timeline

### Week 1: Setup and Configuration

- Install testing dependencies (Vitest, Playwright)
- Configure test environment and CI/CD
- Create test structure and helpers

### Week 2-3: Unit Tests

- Test all utility functions
- Test command logic
- Achieve >90% unit test coverage

### Week 4: Integration Tests

- Test CLI integration
- Test workflow scenarios
- Test error handling

### Week 5: E2E Tests

- Full project creation scenarios
- Cross-platform testing
- Performance benchmarks

### Week 6: Optimization and Documentation

- Test performance optimization
- Documentation updates
- Training and knowledge transfer

## Success Metrics

- **Coverage**: >80% overall, >90% critical paths
- **Performance**: Tests complete in <30 seconds
- **Reliability**: <1% test flakiness rate
- **Maintainability**: Clear test structure and documentation

## Conclusion

Implementing a comprehensive testing framework is critical for the project's long-term success. The proposed strategy provides thorough coverage while maintaining development velocity. The phased approach ensures steady progress with immediate value delivery.

**Next Steps**:

1. Set up basic testing infrastructure
2. Begin with highest-value unit tests
3. Gradually expand to integration and E2E tests
4. Establish quality gates and CI/CD integration
