import path from "node:path";
import { searchFilesRecursive } from "./search-files-recursive.js";
import { cleanEmptyFolders } from "./clean-empty-folders.js";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { logProgress } from "../console/log-progress.js";
import { createProgressBarGenerator } from "../console/progress-bar.js";

/**
 * Callback function that filters out certain files from an array of files.
 *
 * @callback pathFilter
 * @param {import("node:fs").PathLike} filePath - Input file path from the filter.
 * @returns {Boolean} - Determines whether file should be included or excluded in array.
 */

/**
 * Callback function that determines if two files are equal or not.
 *
 * @callback compare
 * @param {import("node:fs").PathLike} filePathA - First file path to be compared.
 * @param {import("node:fs").PathLike} filePathB - Second file path to be compared.
 * @returns {Boolean} - Returns (true) if file stats are the same, returns (false)
 * if file stats are different.
 */

/**
 * Asynchronously sync an output directory with a given input directory
 *
 * @param {import("node:fs").PathLike} inputDirectory - Directory to copy files from.
 * @param {import("node:fs").PathLike} outputDirectory - Directory to copy files into
 * @param {object} [inputOptions] - Configurable settings for the function.
 *
 * @param {pathFilter} [inputOptions.filterInput = null] - Callback function that filters
 * input folder's files. Default null returns original array.
 * @param {pathFilter} [inputOptions.filterOutput = null] - Callback function that filters
 * output folder's files. Default null returns original array.
 * @param {compare} [inputOptions.compare] - Callback function that determines
 * if files should be copied (true) or should be ignored (false).
 * Default compares {stat.size}.
 *
 * @param {Boolean} [inputOptions.cleanDirectory = true] - Determines whether to delete
 * loose files (true) or keep them (false).
 * @param {Boolean} [inputOptions.cleanEmpty = true] - Determines whether to delete empty
 * directories (true) or keep them (false).
 * @param {Boolean} [inputOptions.logProgress = true] - Determines whether to console log
 * copy progress (true) or not (false).
 * @returns {Promise<void>}
 *
 */

async function syncDirectories(inputDirectory, outputDirectory, inputOptions) {
    const defaultOptions = {
        filterInput: null,
        filterOutput: null,
        compare: filesAreSame,
        cleanDirectory: true,
        cleanEmpty: true,
        logProgress: true,
    };

    console.log("Starting directory sync...\n");
    console.log(`Source: ${inputDirectory}`);
    console.log(`Destination: ${outputDirectory}`);

    const options = { ...defaultOptions, ...inputOptions };
    const {
        filterInput,
        filterOutput,
        compare,
        cleanDirectory,
        cleanEmpty,
        logProgress: doLogProgress,
    } = options;

    const inputFiles = await searchFilesRecursive(inputDirectory, {
        filter: filterInput,
    });
    const outputFiles = await searchFilesRecursive(outputDirectory, {
        filter: filterOutput,
    });

    const inputFilesSet = new Set(inputFiles);
    const outputFilesSet = new Set(outputFiles);

    console.log("Processing files to copy...");
    const filesToCopyPromises = inputFiles.map(async (filePath) => {
        const inputPath = path.join(inputDirectory, filePath);
        const outputPath = path.join(outputDirectory, filePath);
        const existsInOutputPath = outputFilesSet.has(filePath);

        const outputData = {
            input: inputPath,
            output: outputPath,
        };

        if (!existsInOutputPath) {
            return outputData;
        }

        const filesAreSame = await Promise.resolve(
            compare(inputPath, outputPath)
        );

        if (!filesAreSame) return outputData;

        return null;
    });

    const filesToCopy = (await Promise.all(filesToCopyPromises)).filter(
        Boolean
    );
    const copyFilesSize = filesToCopy.length;

    if (filesToCopy.length > 0) {
        const inputFileSize = inputFiles.length;
        const existingPaths = inputFileSize - copyFilesSize;
        console.log(
            `${existingPaths} file(s) exist(s) in output directory. Copying the remaining ${copyFilesSize} file(s)...\n`
        );
        await copyAllFiles(doLogProgress)(filesToCopy);
        console.log("\nAll files copied!");
    } else {
        console.log("No files to copy.");
    }

    if (cleanDirectory) {
        console.log("Cleaning output directory...");
        await deleteRemainingFiles(inputFilesSet, outputDirectory)(outputFiles);
    }

    if (cleanEmpty) {
        const relativeOutputFilter =
            typeof filterOutput === "function"
                ? (filepath) =>
                      filterOutput(path.relative(outputDirectory, filepath))
                : null;

        console.log("Cleaning empty folders...");
        await cleanEmptyFolders(outputDirectory, {
            filter: relativeOutputFilter,
        });
    }

    console.log("\nDone.");
}

function deleteRemainingFiles(inputFilesSet, outputDirectory) {
    let removedFiles = 0;
    return async (outputFiles) => {
        const removeFilesPromises = outputFiles.map(async (filepath) => {
            if (inputFilesSet.has(filepath)) return;
            const fullPath = path.join(outputDirectory, filepath);
            await fs.rm(fullPath);
            removedFiles++;
        });
        const output = await Promise.all(removeFilesPromises);
        console.log(`Removed ${removedFiles} files.`);
        return output;
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
            await logProgress(
                copyFilePromises,
                createLogMessage(createProgressBar)
            );
        } else {
            await Promise.all(copyFilePromises);
        }
    };
}

async function filesAreSame(filePathA, filePathB) {
    try {
        if (!existsSync(filePathB)) return false;

        const [statsA, statsB] = [
            await fs.stat(filePathA),
            await fs.stat(filePathB),
        ];
        const sizeIsSame = statsA.size === statsB.size;
        return sizeIsSame;
    } catch {
        return false;
    }
}

function createLogMessage(createProgressBar) {
    return (currentFile, index, max) => {
        const decimalPercentage = index / max;
        const progressBar = createProgressBar(decimalPercentage);
        const outputPercentage = Math.floor(decimalPercentage * 100);
        return `Copying file ${index} of ${max}\nCurrent file: ${currentFile}\n${progressBar} ${outputPercentage}%`;
    };
}

export { syncDirectories };
