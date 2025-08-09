#!/usr/bin/env node

/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 *
 * @platformrocks/create - Bootstrap CLI for platform.rocks projects
 */

import { Command } from 'commander';
import { createWeb, type CreateWebOptions } from './commands/createWeb.js';

const program = new Command();

/**
 * Exit codes for different error scenarios
 */
const EXIT_CODES = {
  SUCCESS: 0,
  NETWORK_ERROR: 1,
  PERMISSION_ERROR: 2,
  VALIDATION_ERROR: 3,
  DEPENDENCY_ERROR: 4,
  UNKNOWN_ERROR: 5
} as const;

/**
 * Main CLI function that handles project creation
 */
export async function run(): Promise<void> {
  program
    .name('create')
    .description('Bootstrap CLI for platform.rocks projects')
    .version('0.1.0')
    .argument('[app-name]', 'Name of the application to create')
    .option('-t, --template <template>', 'Template to use for scaffolding', 'web')
    .option('--pm <manager>', 'Package manager to use (auto-detected if not specified)')
    .option('--no-git', 'Skip git repository initialization')
    .option('--no-install', 'Skip dependency installation')
    .option('-f, --force', 'Overwrite existing directory')
    .option('--dry-run', 'Show what would be done without executing')
    .option('-v, --verbose', 'Enable verbose logging')
    .action(async (appName: string | undefined, options: CreateWebOptions) => {
      try {
        await createWeb(appName, options);
      } catch (error: unknown) {
        await handleError(error);
      }
    });

  // Add help examples
  program.addHelpText(
    'after',
    `
Examples:
  $ platformrocks my-app                          Create a project with default template
  $ platformrocks my-app --template web           Create a web application
  $ platformrocks my-app --pm pnpm                Use pnpm as package manager
  $ platformrocks my-app --no-git --no-install    Skip git init and dependency installation
  $ platformrocks my-app --dry-run                Preview what would be created
  $ platformrocks my-app --force                  Overwrite existing directory
  `
  );

  await program.parseAsync();
}

/**
 * Handles errors with appropriate exit codes and messages
 */
async function handleError(error: unknown): Promise<void> {
  let exitCode: number = EXIT_CODES.UNKNOWN_ERROR;
  const message = error instanceof Error ? error.message : 'An unknown error occurred';

  // Categorize errors and assign appropriate exit codes
  if (message.includes('internet') || message.includes('network') || message.includes('GitHub')) {
    exitCode = EXIT_CODES.NETWORK_ERROR;
  } else if (
    message.includes('permission') ||
    message.includes('EACCES') ||
    message.includes('EPERM')
  ) {
    exitCode = EXIT_CODES.PERMISSION_ERROR;
  } else if (
    message.includes('Invalid') ||
    message.includes('Unknown') ||
    message.includes('required')
  ) {
    exitCode = EXIT_CODES.VALIDATION_ERROR;
  } else if (message.includes('install') || message.includes('dependencies')) {
    exitCode = EXIT_CODES.DEPENDENCY_ERROR;
  }

  console.log();
  console.log(await formatError(message, exitCode));

  // Provide helpful suggestions based on error type
  switch (exitCode) {
    case EXIT_CODES.NETWORK_ERROR:
      console.log(await formatInfo('Try again when you have a stable internet connection'));
      break;
    case EXIT_CODES.PERMISSION_ERROR:
      console.log(
        await formatInfo('Try running with elevated permissions or choose a different directory')
      );
      break;
    case EXIT_CODES.VALIDATION_ERROR:
      console.log(await formatInfo('Use --help to see available options and examples'));
      break;
    case EXIT_CODES.DEPENDENCY_ERROR:
      console.log(
        await formatInfo(
          'You can skip dependency installation with --no-install and run it manually later'
        )
      );
      break;
  }

  process.exit(exitCode);
}

/**
 * Formats error messages with appropriate colors and context
 */
async function formatError(message: string, code?: number): Promise<string> {
  const { red, yellow } = await import('kolorist');
  let formatted = red(`Error: ${message}`);

  if (code !== undefined) {
    formatted += ` ${yellow(`(exit code: ${code})`)}`;
  }

  return formatted;
}

/**
 * Formats info messages with appropriate colors
 */
async function formatInfo(message: string): Promise<string> {
  const { cyan } = await import('kolorist');
  return cyan(`ℹ️  ${message}`);
}

// Main execution
run().catch(async error => {
  await handleError(error);
});
