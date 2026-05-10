import path from "node:path";
import { searchFilesRecursive } from "./search-files-recursive.js";
import { cleanEmptyFolders } from "./clean-empty-folders.js";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { createProgressBarGenerator } from "../console/progress-bar.js";
import { createProgressLogger } from "@/console/log-progress.js";
import { sleep } from "@/misc/debounce.js";
import { truncate } from "@/string/wrap.js";

import type { SyncDirectoriesOptions } from "@/types/fs.js";

/**
 * Asynchronously sync an output directory to a given input directory.
 * @param source Directory to be copied.
 * @param destination Directory to copy to.
 * @param options
 */
async function syncDirectories(
	source: string,
	destination: string,
	options?: Partial<SyncDirectoriesOptions>,
) {
	const {
		sourceFilter: filterSource,
		destFilter: filterDestination,
		compare,
		cleanDirectory,
		cleanEmpty,
		log: doLogProgress,
		dry,
	}: SyncDirectoriesOptions = {
		sourceFilter: () => true,
		destFilter: () => true,
		compare: filesAreSameSize,
		cleanDirectory: true,
		cleanEmpty: true,
		log: true,
		dry: false,
		...(options || {}),
	};

	const log = (message: string) => {
		if (!dry) {
			console.log(`sync: ${message}`);
		} else {
			console.log(`DRY: ${message}`);
		}
	};

	log(
		`Starting directory sync...\nsource: ${source}\ndestination: ${destination}`,
	);

	if (!existsSync(source) || !existsSync(destination)) {
		throw new Error("Input filepaths do not exist.");
	}

	const sourceFiles: string[] = await searchFilesRecursive(source, {
		filter: filterSource,
	});
	const destinationFiles: string[] = await searchFilesRecursive(destination, {
		filter: filterDestination,
	});

	const sourceFilesSet = new Set(sourceFiles);
	const destinationFilesSet = new Set(destinationFiles);

	log("Processing files to copy...");

	let filesToCopyCount: number = 0;

	const filesToCopy = await Promise.all(
		sourceFiles.map(async (filePath) => {
			const sourcePath: string = path.join(source, filePath);
			const destinationPath: string = path.join(destination, filePath);
			const existsInDestination: boolean = destinationFilesSet.has(filePath);

			const outputData = {
				source: sourcePath,
				destination: destinationPath,
			};

			if (!existsInDestination) {
				filesToCopyCount++;
				return outputData;
			}

			const filesAreSame = await compare(sourcePath, destinationPath);

			if (filesAreSame) {
				return null;
			}

			filesToCopyCount++;
			return outputData;
		}),
	);

	if (filesToCopyCount > 0) {
		log(
			`${String(sourceFiles.length - filesToCopyCount)} file(s) exist(s) in output directory. Copying the remaining ${String(filesToCopyCount)} file(s)...\n`,
		);

		const logger = doLogProgress
			? createProgressLogger(createLogMessage())
			: null;

		let copiedFiles = 0;

		for (let i = 0; i < filesToCopy.length; i++) {
			const file = filesToCopy[i];
			if (!file) {
				continue;
			}
			copiedFiles++;

			const { source: sourcePath, destination: destinationPath } = file;
			const outputDirname = path.dirname(destinationPath);

			if (!dry) {
				if (!existsSync(outputDirname)) {
					await fs.mkdir(outputDirname, { recursive: true });
				}

				await fs.copyFile(sourcePath, destinationPath);
			} else {
				await sleep(10);
			}

			logger?.log(sourcePath, copiedFiles, filesToCopyCount);
			continue;
		}

		log("All files copied!");
	} else {
		log("No files to copy.");
	}

	if (cleanDirectory) {
		log("Cleaning output directory...");

		let removedFiles = 0;
		for (const destinationFile of destinationFiles) {
			if (sourceFilesSet.has(destinationFile)) {
				continue;
			}
			const fullPath = path.join(destination, destinationFile);

			if (!dry) {
				await fs.rm(fullPath);
			}
			removedFiles++;
		}
		log(`Removed ${String(removedFiles)} files.`);
	}

	if (cleanEmpty) {
		log("Cleaning empty folders...");
		await cleanEmptyFolders(destination, {
			filter: filterDestination,
			deleteHiddenFiles: false,
			dry,
		});
	}

	log("Done.");
}

async function filesAreSameSize(filePathA: string, filePathB: string) {
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
	} catch {
		return false;
	}
}

function createLogMessage() {
	const createProgressBar = createProgressBarGenerator();

	return (currentFile: string, index: number, max: number) => {
		const decimalPercentage = index / max;
		const progressBar = createProgressBar(decimalPercentage);
		const outputPercentage = Math.floor(decimalPercentage * 100);
		return `Copying file ${String(index)} of ${String(max)}\n${truncate(currentFile, 25, { direction: -1 })}\n${progressBar} ${String(outputPercentage)}%\n`;
	};
}

export { syncDirectories };
