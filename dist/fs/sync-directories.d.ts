import type { SyncDirectoriesOptions } from "../types/fs.js";
/**
 * Asynchronously sync an output directory to a given input directory.
 * @param source Directory to be copied.
 * @param destination Directory to copy to.
 * @param options
 */
declare function syncDirectories(source: string, destination: string, options?: Partial<SyncDirectoriesOptions>): Promise<void>;
export { syncDirectories };
