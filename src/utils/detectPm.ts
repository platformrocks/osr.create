/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { execa } from 'execa';

/**
 * Detects the package manager to use based on lockfiles and availability
 */
export async function detectPackageManager(): Promise<string> {
  const cwd = process.cwd();

  // Check for lockfiles first
  try {
    await fs.access(join(cwd, 'bun.lockb'));
    return 'bun';
  } catch {}

  try {
    await fs.access(join(cwd, 'pnpm-lock.yaml'));
    return 'pnpm';
  } catch {}

  try {
    await fs.access(join(cwd, 'yarn.lock'));
    return 'yarn';
  } catch {}

  // Check for availability in PATH
  const managers = ['bun', 'pnpm', 'yarn', 'npm'];

  for (const manager of managers) {
    try {
      await execa(manager, ['--version'], { stdio: 'ignore' });
      return manager;
    } catch {}
  }

  // Default fallback
  return 'npm';
}
