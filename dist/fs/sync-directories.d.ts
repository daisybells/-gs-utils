import type { SyncDirectoriesOptions } from "../types/fs.js";
/**
 * Asynchronously sync an output directory to a given input directory.
 * @param inputDirectory Directory to be copied.
 * @param outputDirectory Directory to copy to.
 * @param options
 */
declare function syncDirectories(inputDirectory: string, outputDirectory: string, options?: Partial<SyncDirectoriesOptions>): Promise<void>;
export { syncDirectories };
