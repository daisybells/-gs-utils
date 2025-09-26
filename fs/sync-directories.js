import path from "node:path";
import readline from "node:readline";
import { searchFilesRecursive } from "./search-files-recursive.js";
import { cleanEmptyFoldersRecursively } from "./clean-empty-folders-recursive.js";
import fs from "node:fs";

const defaultOptions = {
    filterInput: null,
    filterOutput: null,
    compareFiles: fileStatsAreDifferent,
    cleanDirectory: true,
    cleanEmpty: true,
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
 * @returns {Boolean} - Deretmins whether the files are the same or different.
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
 * @param {compare} [inputOptions.compareFiles] - Callback function that determines
 * if files should or shouldn't be copied. Default compares {stat.size} and {stat.mtime}.
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
        compareFiles,
        cleanDirectory,
        cleanEmpty,
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

    let existingPaths = 0;

    for (const filePath of filteredInputFiles) {
        const inputPath = path.resolve(inputDirectory, filePath);
        const outputPath = path.resolve(outputDirectory, filePath);

        // eslint-disable-next-line no-await-in-loop
        const filesAreSame = await Promise.resolve(
            compareFiles(inputPath, outputPath)
        );

        const needsCopy = !outputFilesSet.has(filePath) && filesAreSame;

        if (!needsCopy) {
            existingPaths++;
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(
                `[${existingPaths}] File path(s) already exist.`
            );
            continue;
        }

        console.log(`\n➕ Copying file ${filePath}`);

        const outputPathDirectory = path.dirname(outputPath);
        if (!fs.existsSync(outputPathDirectory))
            fs.mkdirSync(outputPathDirectory, { recursive: true });

        fs.copyFileSync(inputPath, outputPath);
    }

    if (cleanDirectory)
        cleanOutputDirectory(
            inputFilesSet,
            filteredOutputFiles,
            outputDirectory
        );

    if (cleanEmpty) await cleanEmptyFoldersRecursively(outputDirectory);

    console.log("\nDone.");
}

function cleanOutputDirectory(inputFilesSet, outputFiles, outputDirectory) {
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
            fs.unlinkSync(outputPath);
        } catch (error) {
            console.error(`Error unlinking file '${filePath}':`, error);
        }
    }
}

function fileStatsAreDifferent(filePathA, filePathB) {
    try {
        const [statsA, statsB] = [
            fs.statSync(filePathA),
            fs.statSync(filePathB),
        ];

        return statsA.size !== statsB.size || statsA.mtimeMs !== statsB.mtimeMs;
    } catch {
        return true;
    }
}

export { syncDirectories };
