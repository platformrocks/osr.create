/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';

/**
 * Validates if a directory can be used for project creation
 */
export async function validateDirectory(path: string, force = false): Promise<void> {
  const targetPath = resolve(path);

  try {
    const stats = await fs.stat(targetPath);

    if (stats.isDirectory()) {
      const files = await fs.readdir(targetPath);
      const relevantFiles = files.filter(
        file => !file.startsWith('.') || ['package.json', '.git'].includes(file)
      );

      if (relevantFiles.length > 0 && !force) {
        throw new Error(`Directory "${path}" is not empty. Use --force to overwrite.`);
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      // Directory doesn't exist, which is fine
      return;
    }
    throw error;
  }
}

/**
 * Creates a directory recursively if it doesn't exist
 */
export async function ensureDirectory(path: string): Promise<void> {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create directory ${path}: ${message}`);
  }
}
