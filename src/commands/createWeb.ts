/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { resolve } from 'path';
import prompts from 'prompts';
import ora from 'ora';
import { cyan, green, yellow, bold, dim } from 'kolorist';
import { downloadTemplate } from 'giget';
import { detectPackageManager } from '@utils/detectPm.js';
import { validateDirectory } from '@utils/ensureDir.js';
import { installDependencies } from '@utils/installDeps.js';
import { initializeGit } from '@utils/initGit.js';
import { updatePackageName } from '@utils/patchPkgName.js';

export interface CreateWebOptions {
  template: string;
  pm?: string;
  git: boolean;
  install: boolean;
  force: boolean;
  dryRun: boolean;
  verbose: boolean;
}

export interface TemplateConfig {
  repo: string;
  description: string;
  requiredFiles: string[];
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  web: {
    repo: 'github:platformrocks/osr.boilerplate-web',
    description: 'Modern web application boilerplate',
    requiredFiles: ['package.json']
  }
};

/**
 * Main function to create a web project
 */
export async function createWeb(
  appName: string | undefined,
  options: CreateWebOptions
): Promise<void> {
  console.log(bold(cyan('@platformrocks/create')));
  console.log(dim('\u23CF Bootstrap CLI for OpenSource.Rocks projects\n'));

  // Pre-flight validation
  await validateEnvironment(options);

  // Get app name if not provided
  if (!appName) {
    const response = await prompts({
      type: 'text',
      name: 'appName',
      message: 'What is the name of your project?',
      validate: (value: string) => value.trim().length > 0 || 'Project name is required'
    });

    if (!response.appName) {
      console.log(yellow('Project creation cancelled.'));
      process.exit(0);
    }

    appName = response.appName.trim();
  }

  const projectPath = resolve(appName!);
  const template = validateTemplate(options.template);

  // Show configuration
  console.log(formatInfo('Configuration:'));
  console.log(`  ${dim('Project name:')} ${appName}`);
  console.log(`  ${dim('Template:')} ${options.template} (${template.description})`);
  console.log(`  ${dim('Directory:')} ${projectPath}`);

  if (options.pm) {
    console.log(`  ${dim('Package manager:')} ${options.pm}`);
  } else {
    console.log(`  ${dim('Package manager:')} auto-detect`);
  }

  console.log(`  ${dim('Git initialization:')} ${options.git ? 'yes' : 'no'}`);
  console.log(`  ${dim('Install dependencies:')} ${options.install ? 'yes' : 'no'}`);
  console.log();

  if (options.dryRun) {
    await showDryRunPlan(appName!, projectPath, template, options);
    return;
  }

  // Execute project creation steps
  await executeCreationSteps(appName!, projectPath, template, options);
}

/**
 * Validates the environment before project creation
 */
async function validateEnvironment(options: CreateWebOptions): Promise<void> {
  const spinner = ora('Validating environment...').start();

  try {
    // Validate Node.js version
    await validateNodeVersion();
    spinner.text = 'Node.js version ✓';

    // Validate git availability (only if git initialization is requested)
    if (options.git) {
      const gitAvailable = await validateGitAvailability();
      if (!gitAvailable) {
        throw new Error('Git not found in PATH. Install Git or use --no-git flag.');
      }
      spinner.text = 'Git availability ✓';
    }

    // Validate network connectivity
    await validateNetworkConnectivity();
    spinner.text = 'Network connectivity ✓';

    spinner.succeed('Environment validation complete');
  } catch (error) {
    spinner.fail('Environment validation failed');
    throw error;
  }
}

/**
 * Shows what would be done in dry-run mode
 */
async function showDryRunPlan(
  appName: string,
  projectPath: string,
  template: TemplateConfig,
  options: CreateWebOptions
): Promise<void> {
  console.log(bold(yellow('Dry Run Mode - No changes will be made')));
  console.log();

  console.log('Steps that would be executed:');
  console.log(`  1. ${cyan('Validate directory:')} ${projectPath}`);
  console.log(`  2. ${cyan('Download template:')} ${template.repo}`);
  console.log(`  3. ${cyan('Update package.json:')} Set name to "${appName}"`);

  if (options.install) {
    const pm = options.pm || (await detectPackageManager());
    console.log(`  4. ${cyan('Install dependencies:')} Using ${pm}`);
  } else {
    console.log(`  4. ${dim('Skip dependency installation (--no-install)')}`);
  }

  if (options.git) {
    console.log(`  5. ${cyan('Initialize git:')} git init && git add . && git commit`);
  } else {
    console.log(`  5. ${dim('Skip git initialization (--no-git)')}`);
  }

  console.log(`  6. ${cyan('Show next steps')}`);
  console.log();
  console.log(green('Dry run complete. Use without --dry-run to execute.'));
}

/**
 * Executes the actual project creation steps
 */
async function executeCreationSteps(
  appName: string,
  projectPath: string,
  template: TemplateConfig,
  options: CreateWebOptions
): Promise<void> {
  let spinner: ReturnType<typeof ora> | undefined;

  try {
    // Step 1: Validate directory
    spinner = ora('Validating directory...').start();
    await validateDirectory(projectPath, options.force);
    spinner.succeed('Directory validated');

    // Step 2: Download template
    spinner = ora(`Downloading template from ${template.repo}...`).start();
    await downloadTemplate(template.repo, {
      dir: projectPath,
      force: true,
      offline: false,
      preferOffline: false
    });
    spinner.succeed('Template downloaded');

    // Step 3: Update package.json
    spinner = ora('Updating package.json...').start();
    await updatePackageName(projectPath, appName);
    spinner.succeed('Package configuration updated');

    // Step 4: Install dependencies
    if (options.install) {
      const pm = options.pm || (await detectPackageManager());
      spinner = ora(`Installing dependencies with ${pm}...`).start();
      await installDependencies(pm, projectPath, options.verbose);
      spinner.succeed('Dependencies installed');
    } else {
      console.log(formatWarning('Skipped dependency installation'));
    }

    // Step 5: Initialize git
    if (options.git) {
      spinner = ora('Initializing git repository...').start();
      await initializeGit(projectPath);
      spinner.succeed('Git repository initialized');
    } else {
      console.log(formatWarning('Skipped git initialization'));
    }

    // Success!
    const pm = options.pm || (await detectPackageManager());
    printNextSteps(appName, pm);
  } catch (error) {
    if (spinner) {
      spinner.fail();
    }
    throw error;
  }
}

/**
 * Validates template configuration
 */
function validateTemplate(templateName: string): TemplateConfig {
  const template = TEMPLATES[templateName];
  if (!template) {
    const available = Object.keys(TEMPLATES).join(', ');
    throw new Error(`Unknown template: ${templateName}. Available: ${available}`);
  }
  return template;
}

/**
 * Validates Node.js version requirement
 */
async function validateNodeVersion(): Promise<void> {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);

  if (major < 18) {
    throw new Error(`Node.js 18+ is required. Current version: ${version}`);
  }
}

/**
 * Checks if git is available in PATH
 */
async function validateGitAvailability(): Promise<boolean> {
  try {
    const { execa } = await import('execa');
    await execa('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks network connectivity to GitHub
 */
async function validateNetworkConnectivity(): Promise<void> {
  try {
    // Simple connectivity check using a lightweight GitHub API endpoint
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.github.com/zen', {
      // @ts-expect-error - timeout is supported in node-fetch
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error('GitHub API returned non-OK status');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot reach GitHub. Check your internet connection: ${message}`);
  }
}

/**
 * Formats warning messages with appropriate colors
 */
function formatWarning(message: string): string {
  return yellow(`⚠️  ${message}`);
}

/**
 * Formats info messages with appropriate colors
 */
function formatInfo(message: string): string {
  return cyan(`${message}`);
}

/**
 * Prints helpful next steps after successful project creation
 */
function printNextSteps(appName: string, pm: string): void {
  console.log();
  console.log(green('Project created successfully!'));
  console.log();
  console.log('Next steps:');
  console.log(cyan(`  cd ${appName}`));

  const runCommand = pm === 'npm' ? 'npm run' : pm;
  console.log(cyan(`  ${runCommand} dev`));

  console.log();
  console.log("Happy coding! Let's Rock!");
}
