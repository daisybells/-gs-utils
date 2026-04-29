export type FileFilter = (directory: string) => boolean | Promise<boolean>;
export type CleanEmptyFoldersOptions = {
    /**
     * Delete hidden files such as ".DS_Store" and "Desktop.ini" before search.
     * @default true
     */
    deleteHiddenFiles: boolean;
    /**
     * Filter to include or exclude given folders based on a condition.
     * @default null
     */
    filter: FileFilter | null;
    /**
     * Deepest that recursive search will go until returning
     * @default 0
     */
    maxDepth: number;
};
export type SearchFilesRecursiveOptions = {
    /**
     * Display full path or relative path.
     * @default false
     */
    fullPath: boolean;
    /**
     * Takes input base path and filters it in or out of the output.
     * @default null
     */
    filter: FileFilter | null;
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
export type CompareFiles = (pathA: string, pathB: string) => boolean | Promise<boolean>;
export type FilesToCopyData = {
    input: string;
    output: string;
};
export type SyncDirectoriesOptions = {
    /**
     * Filter which input files are ignored in sync copy process.
     * @default null returns all files.
     */
    filterInput: FileFilter | null;
    /**
     * Filter which output files are ignored in sync deletion process.
     * @default null makes carbon copy of files.
     */
    filterOutput: FileFilter | null;
    /**
     * Determine the metrics in which files are compared to each other.
     * Comperes fs.stats.size by default. Can be async.
     */
    compare: CompareFiles;
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
    logProgress: boolean;
};
