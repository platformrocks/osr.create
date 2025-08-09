/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { execa } from 'execa';

/**
 * Initializes a git repository in the specified directory
 */
export async function initializeGit(cwd: string): Promise<void> {
  try {
    // Check if git is available
    await execa('git', ['--version'], { stdio: 'ignore' });

    // Initialize repository
    await execa('git', ['init'], { cwd, stdio: 'pipe' });

    // Add initial commit
    await execa('git', ['add', '.'], { cwd, stdio: 'pipe' });
    await execa('git', ['commit', '-m', 'Initial commit'], { cwd, stdio: 'pipe' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize git repository: ${message}`);
  }
}
