import path from "node:path";
import fs from "node:fs";

function findProjectRoot(directory, directoryToFind) {
    let parentDirectory = path.dirname(directory);
    while (fs.existsSync(parentDirectory)) {
        const fileToFindPath = path.join(parentDirectory, directoryToFind);
        if (fs.existsSync(fileToFindPath)) return fileToFindPath;

        const parentDirname = path.dirname(parentDirectory);
        if (parentDirectory === parentDirname) return null;

        parentDirectory = parentDirname;
    }

    return null;
}

export { findProjectRoot };
