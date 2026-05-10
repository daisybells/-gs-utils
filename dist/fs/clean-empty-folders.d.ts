import type { CleanEmptyFoldersOptions } from "../types/fs.js";
/**
 * Remove empty folders from a given directory.
 * @param directory
 * @param options
 */
declare function cleanEmptyFolders(directory: string, options?: Partial<CleanEmptyFoldersOptions>): Promise<void>;
declare function isHiddenFile(filename: string): boolean;
export { cleanEmptyFolders, isHiddenFile };
