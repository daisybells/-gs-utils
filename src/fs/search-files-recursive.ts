import fs from "node:fs/promises";
import path from "node:path";

import type { SearchFilesRecursiveOptions } from "@/types/fs.js";
import type { Dirent } from "node:fs";

async function searchFilesRecursive(
    directory: string,
    options?: Partial<SearchFilesRecursiveOptions>,
): Promise<string[]> {
    const searchOptions: SearchFilesRecursiveOptions = {
        fullPath: false,
        filter: null,
        includeDirectories: false,
        asRoot: false,
        ...(options || {}),
    };

    return searchFilesRecursiveHandler(directory, searchOptions);
}

async function searchFilesRecursiveHandler(
    directory: string,
    options: SearchFilesRecursiveOptions,
    base: string = directory,
): Promise<string[]> {
    const { filter, includeDirectories } = options;

    const entries: Dirent<string>[] = await fs.readdir(directory, {
        withFileTypes: true,
    });
    const filePromises: Promise<string | string[]>[] = entries.map(
        async (entry: Dirent<string>) => {
            const fullPath: string = path.join(directory, entry.name);
            const relativePath: string = path.relative(base, fullPath);

            if (!entry.isDirectory()) {
                return relativePath;
            }

            const nextEntry: string[] = await searchFilesRecursiveHandler(
                fullPath,
                options,
                base,
            );

            return includeDirectories
                ? [relativePath, ...nextEntry]
                : nextEntry;
        },
    );
    const allFiles: string[] = (await Promise.all(filePromises)).flat();

    const outputFiles = allFiles.map(
        async (file: string): Promise<null | string> => {
            const outputPath = makeFilePath(file, options, base);

            if (!filter || typeof filter !== "function") {
                return outputPath;
            }

            const isIncluded = await filter(outputPath);
            if (!isIncluded) {
                return null;
            }
            return outputPath;
        },
    );

    return (await Promise.all(outputFiles)).filter((file) => file !== null);
}

function makeFilePath(
    filePath: string,
    options: SearchFilesRecursiveOptions,
    base: string = "",
): string {
    const { asRoot, fullPath }: SearchFilesRecursiveOptions = options;

    switch (true) {
        case fullPath:
            return path.resolve(base, filePath);
        case asRoot:
            return path.join("/", filePath);
        default:
            return filePath;
    }
}

export { searchFilesRecursive };
