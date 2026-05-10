import path from "node:path";
import { searchFilesRecursive } from "./search-files-recursive.js";
import { cleanEmptyFolders } from "./clean-empty-folders.js";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { logProgress } from "../console/log-progress.js";
import { createProgressBarGenerator } from "../console/progress-bar.js";
/**
 * Asynchronously sync an output directory to a given input directory.
 * @param source Directory to be copied.
 * @param destination Directory to copy to.
 * @param options
 */
async function syncDirectories(source, destination, options) {
    console.log(`Starting directory sync...\nSource: ${source}\nDestination: ${destination}`);
    const { filterInput, filterOutput, compare, cleanDirectory, cleanEmpty, logProgress: doLogProgress, } = {
        filterInput: () => true,
        filterOutput: () => true,
        compare: filesAreSameSize,
        cleanDirectory: true,
        cleanEmpty: true,
        logProgress: true,
        ...(options || {}),
    };
    const inputFiles = await searchFilesRecursive(source, {
        filter: filterInput,
    });
    const outputFiles = await searchFilesRecursive(destination, {
        filter: filterOutput,
    });
    const inputFilesSet = new Set(inputFiles);
    const outputFilesSet = new Set(outputFiles);
    console.log("Processing files to copy...");
    const filesToCopyPromises = inputFiles.map(async (filePath) => {
        const inputPath = path.join(source, filePath);
        const outputPath = path.join(destination, filePath);
        const existsInOutputPath = outputFilesSet.has(filePath);
        const outputData = {
            input: inputPath,
            output: outputPath,
        };
        if (!existsInOutputPath) {
            return outputData;
        }
        const filesAreSame = await compare(inputPath, outputPath);
        if (filesAreSame) {
            return null;
        }
        return outputData;
    });
    const filesToCopy = (await Promise.all(filesToCopyPromises)).filter((file) => Boolean(file));
    const copyFilesSize = filesToCopy.length;
    if (filesToCopy.length > 0) {
        const inputFileSize = inputFiles.length;
        const existingPaths = inputFileSize - copyFilesSize;
        console.log(`${String(existingPaths)} file(s) exist(s) in output directory. Copying the remaining ${String(copyFilesSize)} file(s)...\n`);
        await copyAllFiles(doLogProgress)(filesToCopy);
        console.log("\nAll files copied!");
    }
    else {
        console.log("No files to copy.");
    }
    if (cleanDirectory) {
        console.log("Cleaning output directory...");
        await deleteRemainingFiles(inputFilesSet, destination)(outputFiles);
    }
    if (cleanEmpty) {
        console.log("Cleaning empty folders...");
        await cleanEmptyFolders(destination, {
            filter: (file) => filterOutput(path.relative(destination, file)),
        });
    }
    console.log("\nDone.");
}
function deleteRemainingFiles(inputFilesSet, outputDirectory) {
    let removedFiles = 0;
    return async (outputFiles) => {
        const removeFilesPromises = outputFiles.map(async (filepath) => {
            if (inputFilesSet.has(filepath)) {
                return;
            }
            const fullPath = path.join(outputDirectory, filepath);
            await fs.rm(fullPath);
            removedFiles++;
        });
        await Promise.all(removeFilesPromises);
        console.log(`Removed ${String(removedFiles)} files.`);
    };
}
function copyAllFiles(doLogProgress) {
    return async (filesToCopy) => {
        const copyFilePromises = filesToCopy.map(async (file) => {
            const { input, output } = file;
            const outputDirname = path.dirname(output);
            if (!existsSync(outputDirname)) {
                await fs.mkdir(outputDirname, { recursive: true });
            }
            await fs.copyFile(input, output);
            return path.basename(input);
        });
        if (doLogProgress) {
            const createProgressBar = createProgressBarGenerator();
            await logProgress(copyFilePromises, createLogMessage(createProgressBar));
        }
        else {
            await Promise.all(copyFilePromises);
        }
    };
}
async function filesAreSameSize(filePathA, filePathB) {
    try {
        if (!existsSync(filePathB)) {
            return false;
        }
        const [statsA, statsB] = [
            await fs.stat(filePathA),
            await fs.stat(filePathB),
        ];
        const sizeIsSame = statsA.size === statsB.size;
        return sizeIsSame;
    }
    catch {
        return false;
    }
}
function createLogMessage(createProgressBar) {
    return (currentFile, index, max) => {
        const decimalPercentage = index / max;
        const progressBar = createProgressBar(decimalPercentage);
        const outputPercentage = Math.floor(decimalPercentage * 100);
        return `Copying file ${String(index)} of ${String(max)}\nCurrent file: ${currentFile}\n${progressBar} ${String(outputPercentage)}%`;
    };
}
export { syncDirectories };
