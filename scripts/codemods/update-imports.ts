/**
 * Copyright (c) 2025 platform.rocks. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuration for path aliases
 */
const ALIASES = {
  '@/': 'src/',
  '@utils/': 'src/utils/',
  '@commands/': 'src/commands/'
};

/**
 * Check if running in dry-run mode
 */
const isDryRun = process.argv.includes('--check');

/**
 * Updates import statements to use path aliases
 */
async function updateImports(filePath: string): Promise<{ changed: boolean; changes: string[] }> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let newContent = content;
    const changes: string[] = [];

    // Find all import/export statements with relative paths
    const importRegex = /(import|export)(\s+[^'"]*\s+from\s+)?['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const [fullMatch, importType, fromPart, importPath] = match;
      
      // Skip if not a relative path or if it's already using aliases
      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        continue;
      }
      
      if (importPath.startsWith('@/') || importPath.startsWith('@utils/') || importPath.startsWith('@commands/')) {
        continue;
      }

      // Determine the target alias based on the relative path
      let newPath = '';
      const relativePath = importPath.replace(/\.\.\//g, '').replace(/\.\//g, '');
      
      if (relativePath.startsWith('src/utils/')) {
        newPath = importPath.replace(/\.\.\/src\/utils\//, '@utils/').replace(/\.\/utils\//, '@utils/');
      } else if (relativePath.startsWith('src/commands/')) {
        newPath = importPath.replace(/\.\.\/src\/commands\//, '@commands/').replace(/\.\/commands\//, '@commands/');
      } else if (relativePath.startsWith('src/')) {
        newPath = importPath.replace(/\.\.\/src\//, '@/').replace(/\.\/src\//, '@/');
      } else if (importPath.includes('utils/') && !importPath.includes('src/')) {
        newPath = importPath.replace(/\.\.\/utils\//, '@utils/').replace(/\.\/utils\//, '@utils/');
      } else if (importPath.includes('commands/') && !importPath.includes('src/')) {
        newPath = importPath.replace(/\.\.\/commands\//, '@commands/').replace(/\.\/commands\//, '@commands/');
      }

      if (newPath && newPath !== importPath) {
        const newImport = fullMatch.replace(importPath, newPath);
        newContent = newContent.replace(fullMatch, newImport);
        changes.push(`  ${importPath} → ${newPath}`);
      }
    }

    if (!isDryRun && newContent !== content) {
      await fs.writeFile(filePath, newContent, 'utf-8');
    }

    return {
      changed: newContent !== content,
      changes
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error processing ${filePath}: ${message}`);
    return { changed: false, changes: [] };
  }
}

/**
 * Recursively find all TypeScript files
 */
async function findTSFiles(dir: string, files: string[] = []): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry.name)) {
        await findTSFiles(fullPath, files);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
        files.push(fullPath);
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading directory ${dir}: ${message}`);
  }
  
  return files;
}

/**
 * Main function to update imports across the project
 */
async function main(): Promise<void> {
  const targetDir = join(__dirname, '../../src');
  
  console.log(isDryRun ? 'Dry run mode - no files will be changed' : 'Updating imports...');
  console.log(`Target directory: ${targetDir}`);
  console.log();

  const tsFiles = await findTSFiles(targetDir);
  let totalChanges = 0;
  let changedFiles = 0;

  for (const file of tsFiles) {
    const relativePath = relative(process.cwd(), file);
    const result = await updateImports(file);
    
    if (result.changed) {
      changedFiles++;
      totalChanges += result.changes.length;
      console.log(`📝 ${relativePath}:`);
      result.changes.forEach(change => console.log(change));
      console.log();
    }
  }

  console.log(`Summary: ${totalChanges} imports updated in ${changedFiles} files`);
  
  if (isDryRun && totalChanges > 0) {
    console.log('\nRun without --check to apply these changes.');
  }
}

// Run the script
main().catch(console.error);
