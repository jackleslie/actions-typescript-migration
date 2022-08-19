import fs from 'fs';
import path from 'path';

import glob from 'glob';

export const getTypeScriptMigrationStatus = (inputSourceFolder: string): Record<string, number> => {
  const sourceFolder = path.join(process.cwd(), inputSourceFolder);

  return fs
    .readdirSync(sourceFolder, { withFileTypes: true })
    .filter((value) => value.isDirectory())
    .reduce((current, { name }) => {
      // e.g src/according => accordion
      const folderName = path.join(sourceFolder, name);

      // e.g React components, utility files
      const tsSourceFiles = glob.sync(
        `${folderName}/**/!(*.test|*.spec|*.story|*.stories).@(ts)?(x)`,
      );
      const allSourceFiles = glob.sync(
        `${folderName}/**/!(*.test|*.spec|*.story|*.stories).@(js|ts)?(x)`,
      );

      // skip folders with no source files
      if (allSourceFiles.length === 0) {
        return current;
      }

      const percentage = Math.round((tsSourceFiles.length / allSourceFiles.length) * 100);

      return {
        ...current,
        [name]: percentage,
      };
    }, {});
};

export const getMarkdownTable = (status: Record<string, number>): string => {
  const rowStrs = Object.entries(status).map(([name, percentage]) => {
    const percentageEntry = `${percentage}%`;
    const percentageEmoji =
      percentage === 100
        ? ':tada:'
        : percentage === 0
        ? ':negative_squared_cross_mark:'
        : ':construction:';
    return `| \`${name}\` | ${percentageEntry} | ${percentageEmoji} |`;
  });

  return `| Folder | TypeScript (%) | Status |
  | --- | --- | --- |
  ${rowStrs.join('\n')}`;
};
