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

      const tsFiles = glob.sync(`${folderName}/**/!(*.test|*.spec|*.story).@(ts)?(x)`);
      const allFiles = glob.sync(`${folderName}/**/!(*.test|*.spec|*.story).@(js|ts)?(x)`);
      const percentage = Math.round((tsFiles.length / allFiles.length) * 100);

      return {
        ...current,
        [name]: `${percentage}%`,
      };
    }, {});
};

export const getMarkdownTable = (status: Record<string, string>): string => {
  const rowStrs = Object.entries(status).map(([name, percentage]) => {
    return `| \`${name}\` | ${percentage} |`;
  });

  return `| Folder | TypeScript (%) |
  | --- | --- |
  ${rowStrs.join('\n')}`;
};
