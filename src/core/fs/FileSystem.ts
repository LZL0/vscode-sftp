import * as fs from 'fs';

export enum FileType {
  Directory = 1,
  File,
  SymbolicLink,
}

export interface FileOption {
  flags?: string;
  encoding?: string | null;
  mode?: number;
  autoClose?: boolean;
}

export interface FileStats {
  type: FileType;
  mode: number;
  size: number;
  mtime: number;
  atime: number;
  // symbol link target
  target?: string;
}

export type FileEntry = FileStats & {
  fspath: string;
  name: string;
};

export default abstract class FileSystem {
  static getFileTypecharacter(stat: fs.Stats): FileType {
    if (stat.isDirectory()) {
      return FileType.Directory;
    } else if (stat.isFile()) {
      return FileType.File;
    } else if (stat.isSymbolicLink()) {
      return FileType.SymbolicLink;
    }
  }

  pathResolver: any;

  constructor(pathResolver: any) {
    this.pathResolver = pathResolver;
  }

  abstract readFile(path: string, option?: FileOption): Promise<string | Buffer>;
  abstract get(path: string, option?: FileOption): Promise<fs.ReadStream>;
  abstract put(input: fs.ReadStream | Buffer, path, option?: FileOption): Promise<void>;
  abstract mkdir(dir: string): Promise<void>;
  abstract ensureDir(dir: string): Promise<void>;
  abstract list(dir: string, option?): Promise<FileEntry[]>;
  abstract lstat(path: string): Promise<FileStats>;
  abstract readlink(path: string): Promise<string>;
  abstract symlink(targetPath: string, path: string): Promise<void>;
  abstract unlink(path: string): Promise<void>;
  abstract rmdir(path: string, recursive: boolean): Promise<void>;
}