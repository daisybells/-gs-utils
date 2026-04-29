import fs from "node:fs/promises";
import path from "node:path";
async function searchFilesRecursive(directory, options) {
    const searchOptions = {
        fullPath: false,
        filter: null,
        includeDirectories: false,
        asRoot: false,
        ...(options || {}),
    };
    return searchFilesRecursiveHandler(directory, searchOptions);
}
async function searchFilesRecursiveHandler(directory, options, base = directory) {
    const { filter, includeDirectories } = options;
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    });
    const filePromises = entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        const relativePath = path.relative(base, fullPath);
        if (!entry.isDirectory()) {
            return relativePath;
        }
        const nextEntry = await searchFilesRecursiveHandler(fullPath, options, base);
        return includeDirectories
            ? [relativePath, ...nextEntry]
            : nextEntry;
    });
    const allFiles = (await Promise.all(filePromises)).flat();
    const outputFiles = allFiles.map(async (file) => {
        const outputPath = makeFilePath(file, options, base);
        if (!filter || typeof filter !== "function") {
            return outputPath;
        }
        const isIncluded = await filter(outputPath);
        if (!isIncluded) {
            return null;
        }
        return outputPath;
    });
    return (await Promise.all(outputFiles)).filter((file) => file !== null);
}
function makeFilePath(filePath, options, base = "") {
    const { asRoot, fullPath } = options;
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
//# sourceMappingURL=search-files-recursive.js.map