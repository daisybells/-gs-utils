export type CleanEmptyFoldersOptions = {
    /**
     * Delete hidden files such as ".DS_Store" and "Desktop.ini" before search.
     * @default true
     */
    deleteHiddenFiles: boolean;
    /**
     * Filter to include or exclude given folders based on a condition.
     * Defaults to automatically return true.
     *
     * @example
     * await cleanEmptyFolders("./foo", { filter });
     * // The following only parses relative filepaths starting with "bar"
     * function filter(filepath) {
     * 	if (filepath.startsWith("bar")) {
     * 		return true
     * 	} else {
     * 		return false
     * 	}
     * }
     */
    filter: (childpath: string) => boolean | Promise<boolean>;
    /**
     * Deepest that recursive search will go until returning
     * @default 0
     */
    maxDepth: number;
    /**
     * Determines whether to actually delete the files or not.
     * @default false;
     */
    dry: boolean;
};
export type SearchFilesRecursiveOptions = {
    /**
     * Display full path or relative path.
     * @default false
     */
    fullPath: boolean;
    /**
     * Takes input base path and filters it in or out of the output.
     * Defaults to automatically return true.
     * @example
     * await searchFilesRecursive("./foo", { filter });
     * // The following only returns relative filepaths starting with "bar"
     * function filter(filepath) {
     * 	if (filepath.startsWith("bar")) {
     * 		return true
     * 	} else {
     * 		return false
     * 	}
     * }
     */
    filter: (childpath: string) => boolean | Promise<boolean>;
    /**
     * Determines whether to include directories in a search.
     * @default false
     */
    includeDirectories: boolean;
    /**
     * Determines whether to output file as root or relative path.
     * @default false
     */
    asRoot: boolean;
};
export type RecursiveFileFrame = {
    filepath: string;
    isDirectory: boolean;
};
export type SyncDirectoriesOptions = {
    /**
     * Filter which input files are ignored in sync copy process.
     * Copies all files by default.
     * @example
     * await syncDirectories("./foo", { sourceFilter: filter });
     * // The following only copies relative paths starting with "bar"
     * function filter(filepath) {
     * 	if (filepath.startsWith("bar")) {
     * 		return true
     * 	} else {
     * 		return false
     * 	}
     * }
     */
    sourceFilter: (childpath: string) => boolean | Promise<boolean>;
    /**
     * Filter which destination files will be removed.
     * Removes all files not matching input by default.
     * @example
     * await syncDirectories("./foo", { destFilter: filter });
     * // The following only includes searches dest filepaths starting with "bar"
     * function filter(filepath) {
     * 	if (filepath.startsWith("bar")) {
     * 		return true
     * 	} else {
     * 		return false
     * 	}
     * }
     */
    destFilter: (childpath: string) => boolean | Promise<boolean>;
    /**
     * Determine the metrics in which files are compared to each other.
     * Comperes fs.stats.size by default. Can be async.
     */
    compare: (source: string, destination: string) => boolean | Promise<boolean>;
    /**
     * Determines whether or not do delete loose files not found in input fileset.
     * @default true
     */
    cleanDirectory: boolean;
    /**
     * Determines whether or not to delete empty folders.
     * @default true
     */
    cleanEmpty: boolean;
    /**
     * Determines whether to show live progress log in terminal.
     * @default true
     */
    log: true;
    /**
     * If true, does not perform any filesystem writes.
     * @default false
     */
    dry: boolean;
};
