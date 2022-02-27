import { readdirSync, lstatSync } from "fs";
import { resolve, extname } from "path";

/**
 * File system related functions.
 */
export default class FileSystemService {
  /**
   * Get the path of all folders inside a given path.
   * @param path A folder path
   */
  static getFolderPaths(path: string) {
    const folders = [];
    for (let content of readdirSync(path)) {
      const contentPath = resolve(path, content);
      const isDirectory = lstatSync(contentPath).isDirectory();
      if(isDirectory) folders.push(contentPath);
    }
    return folders;
  }

  /**
   * Get the path of all files inside a given path.
   * Only gets ts and js files.
   * @param path A folder path
   */
  static getFilePaths(path: string) {
    const files = [];
    for (let content of readdirSync(path)) {
      const contentPath = resolve(path, content);
      const isFile = lstatSync(contentPath).isFile();
      if ((extname(content) == ".js") && isFile) files.push(contentPath);
    }
    return files;
  }

  /**
   * Deletes the cache of all the files inside a given path.
   * @param path Folder path
   */
  static deleteCache(path: string) {
    for(let file of readdirSync(path)) {
      lstatSync(resolve(path, file)).isDirectory() ? this.deleteCache(resolve(path, file)) : delete require.cache[resolve(path, file)];
    }
  }
}