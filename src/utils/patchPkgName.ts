/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { yellow } from 'kolorist';

/**
 * Updates the package.json name field to match the project name
 */
export async function updatePackageName(dir: string, name: string): Promise<void> {
  const packageJsonPath = join(dir, 'package.json');

  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);

    packageJson.name = name;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // Non-fatal error if package.json doesn't exist or can't be updated
    console.warn(yellow(`Warning: Could not update package.json name: ${message}`));
  }
}
