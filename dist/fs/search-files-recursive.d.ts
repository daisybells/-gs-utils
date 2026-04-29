import type { SearchFilesRecursiveOptions } from "../types/fs.js";
declare function searchFilesRecursive(directory: string, options?: Partial<SearchFilesRecursiveOptions>): Promise<string[]>;
export { searchFilesRecursive };
