import * as path from 'path';
import * as fs from 'fs';

function getDirFilesList(dir: string, fileList: string[] = [], directoryToSkip: string[] = [], ignoreSubDirs?: boolean): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`FileSystem: ${dir} does not exists`);
  }

  const files = fs.readdirSync(dir);

  files.forEach(function(file) {
    const isDirr = fs.statSync(path.join(dir, file)).isDirectory();

    const shouldBeExcluded =
      (Array.isArray(directoryToSkip) && directoryToSkip.includes(file)) ||
      (typeof directoryToSkip === 'string' && file.includes(directoryToSkip)) ||
      (directoryToSkip instanceof RegExp && file.match(directoryToSkip));

    if (shouldBeExcluded) {
      return;
    }

    if (isDirr && !ignoreSubDirs) {
      fileList = getDirFilesList(path.join(dir, file), fileList, directoryToSkip, ignoreSubDirs);
    } else if (!isDirr) {
      fileList.push(path.join(dir, file));
    }
  });

  return fileList;
}

export {getDirFilesList};
