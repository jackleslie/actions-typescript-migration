import fs from 'fs';
import path from 'path';

import glob from 'glob';

export const getTypeScriptMigrationStatus = (inputSourceFolder: string): Record<string, string> => {
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
        [name]: `${percentage}%`,
      };
    }, {});
};

export const getMarkdownTable = (status: Record<string, string>, title: string): string => {
  const rowStrs = Object.entries(status).map(([name, percentage]) => {
    return `| \`${name}\` | ${percentage} |`;
  });

  if (title) {
    return `
    # ${title}

    | Folder | TypeScript (%) |
    | --- | --- |
    ${rowStrs.join('\n')}`;
  }

  return `| Folder | TypeScript (%) |
  | --- | --- |
  ${rowStrs.join('\n')}`;
};
