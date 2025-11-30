import path from "node:path";
import readline from "node:readline";
import { searchFilesRecursive } from "./search-files-recursive.js";
import { cleanEmptyFoldersRecursively } from "./clean-empty-folders-recursive.js";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const defaultOptions = {
    filterInput: null,
    filterOutput: null,
    compare: filesAreSame,
    cleanDirectory: true,
    cleanEmpty: true,
    logProgress: true,
};

/**
 * A string representing a filesystem Path.
 * @typedef {string} PathLike
 */

/**
 * Callback function that filters out certain files from an array of files.
 *
 * @callback pathFilter
 * @param {PathLike} filePath - Input file path from the filter.
 * @returns {Boolean} - Determines whether file should be included or excluded in array.
 */

/**
 * Callback function that determines if two files are equal or not.
 *
 * @callback compare
 * @param {PathLike} filePathA - First file path to be compared.
 * @param {PathLike} filePathB - Second file path to be compared.
 * @returns {Boolean} - Returns (true) if file stats are the same, returns (false)
 * if file stats are different.
 */

/**
 * Asynchronously sync an output directory with a given input directory
 *
 * @param {PathLike} inputDirectory - Directory to copy files from.
 * @param {PathLike} outputDirectory - Directory to copy files into
 * @param {object} [inputOptions] - Configurable settings for the function.
 *
 * @param {pathFilter} [inputOptions.filterInput = null] - Callback function that filters
 * input folder's files. Default null returns original array.
 * @param {pathFilter} [inputOptions.filterOutput = null] - Callback function that filters
 * output folder's files. Default null returns original array.
 * @param {compare} [inputOptions.compare] - Callback function that determines
 * if files should be copied (true) or should be ignored (false).
 * Default compares {stat.size} and {stat.mtime}.
 * @param {Boolean} [inputOptions.cleanDirectory = true] - Determines whether to delete
 * loose files or keep them. Set to true by default.
 */

async function syncDirectories(inputDirectory, outputDirectory, inputOptions) {
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

    const inputFiles = await searchFilesRecursive(inputDirectory);
    const outputFiles = await searchFilesRecursive(outputDirectory);

    const filteredInputFiles =
        typeof filterInput === "function"
            ? inputFiles.filter(filterInput)
            : inputFiles;
    const filteredOutputFiles =
        typeof filterOutput === "function"
            ? outputFiles.filter(filterOutput)
            : outputFiles;

    const inputFilesSet = new Set(filteredInputFiles);
    const outputFilesSet = new Set(filteredOutputFiles);

    const filesToCopyPromises = filteredInputFiles.map(async (filePath) => {
        const inputPath = path.join(inputDirectory, filePath);
        const outputPath = path.join(outputDirectory, filePath);
        const existsInOutputPath = outputFilesSet.has(filePath);
        const filesAreSame = await Promise.resolve(
            compare(inputPath, outputPath)
        );
        const needsCopy = !existsInOutputPath && !filesAreSame;
        if (!needsCopy) return null;
        return {
            input: inputPath,
            output: outputPath,
        };
    });
    const filesToCopy = (await Promise.all(filesToCopyPromises)).filter(
        Boolean
    );

    const numberOfFilesToCopy = filesToCopy.length;
    if (numberOfFilesToCopy > 0) {
        const existingPaths = filteredInputFiles.length - numberOfFilesToCopy;
        console.log(
            `${existingPaths} files already exist in output directory. Copying the remaining ${numberOfFilesToCopy} files...`
        );
        let copiedFiles = 0;
        const logProgress = logProgressCurry(numberOfFilesToCopy);

        const copyFilePromises = filesToCopy.map(async (file) => {
            const { input, output } = file;
            const outputDirname = path.dirname(output);

            if (!existsSync(outputDirname)) {
                await fs.mkdir(outputDirname, { recursive: true });
            }
            await fs.copyFile(input, output);

            if (doLogProgress) {
                copiedFiles += 1;
                logProgress(input, copiedFiles, numberOfFilesToCopy);
            }
        });

        await Promise.all(copyFilePromises);
        console.log("All files copied!");
    } else {
        console.log("No files to copy.");
    }

    if (cleanDirectory) {
        await cleanOutputDirectory(
            inputFilesSet,
            filteredOutputFiles,
            outputDirectory
        );
    }

    if (cleanEmpty) await cleanEmptyFoldersRecursively(outputDirectory);

    console.log("\nDone.");
}

async function cleanOutputDirectory(
    inputFilesSet,
    outputFiles,
    outputDirectory
) {
    console.log("\nCleaning output directory...");

    for (const filePath of outputFiles) {
        if (inputFilesSet.has(filePath)) continue;
        const outputPath = path.resolve(outputDirectory, filePath);

        try {
            console.log(
                `File '${path.basename(
                    filePath
                )}' no longer exists in input path. Deleting...`
            );
            await fs.rm(outputPath);
        } catch (error) {
            console.error(`Error unlinking file '${filePath}':`, error);
        }
    }
}

async function filesAreSame(filePathA, filePathB) {
    try {
        if (!existsSync(filePathB)) return false;

        const [statsA, statsB] = [
            await fs.stat(filePathA),
            await fs.stat(filePathB),
        ];
        const sizeIsSame = statsA.size === statsB.size;
        const mTimeIsSame = statsA.mtime === statsB.mtime;

        return sizeIsSame && mTimeIsSame;
    } catch {
        return false;
    }
}

// HELPERS

function logProgressCurry(fileMax) {
    const numberOfFilesString = String(fileMax);
    const significantFigures = numberOfFilesString.length;
    let initial = true;

    const createProgressBar = createProgressBarCurry(20);

    return (filename, fileCount) => {
        const basename = path.basename(filename);
        const fileCountString = String(fileCount).padStart(
            significantFigures,
            "0"
        );
        const percentage = fileCount / fileMax;
        const progressBar = createProgressBar(percentage);
        const percentageString = String(Math.floor(percentage * 100)).padStart(
            3,
            " "
        );

        const message = `Copying file ${fileCountString} of ${numberOfFilesString}\nCurrent file: ${basename}\nProgress: ${progressBar} ${percentageString}%\n`;
        const messageRowCount = message.split("\n").length;

        const { rows } = process.stdout;

        if (initial) {
            initial = false;
            process.stdout.write(message);
        }

        for (let row = 1; row <= messageRowCount; row++) {
            process.stdout.clearLine(0);
            readline.cursorTo(process.stdout, 0, rows - row);
        }

        process.stdout.write(message);
        if (fileCount === fileMax) {
            console.log("Process complete");
        }
    };
}

function createProgressBarCurry(progressBarWidth = 20, inputOptions = {}) {
    const defaultOptions = {
        active: "\u2589",
        inactive: "_",
    };
    const { active, inactive } = { ...inputOptions, ...defaultOptions };
    return (percentage) => {
        const numberOfProgressCharacters = Math.floor(
            progressBarWidth * percentage
        );
        const activeProgress = active.repeat(numberOfProgressCharacters);
        return `[${activeProgress.padEnd(progressBarWidth, inactive)}]`;
    };
}

export { syncDirectories };
