/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { execa } from 'execa';

/**
 * Installs dependencies using the specified package manager
 */
export async function installDependencies(pm: string, cwd: string, verbose = false): Promise<void> {
  const commands: Record<string, string[]> = {
    npm: ['install'],
    yarn: ['install'],
    pnpm: ['install'],
    bun: ['install']
  };

  const args = commands[pm];
  if (!args) {
    throw new Error(`Unknown package manager: ${pm}`);
  }

  try {
    await execa(pm, args, {
      cwd,
      stdio: verbose ? 'inherit' : 'pipe'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to install dependencies with ${pm}: ${message}`);
  }
}
