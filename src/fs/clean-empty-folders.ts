import fs from "node:fs/promises";
import path from "node:path";

import { getRecursiveFileCall } from "./helpers/get-recursive-call.js";

import type {
    CleanEmptyFoldersOptions,
    RecursiveFileFrame,
} from "@/types/fs.js";
import { existsSync } from "node:fs";

const HIDDEN_FILES_SET: Set<string> = new Set([".DS_Store", "Desktop.ini"]);

type CleanEmptyFolderFrame = RecursiveFileFrame & {
    visited: boolean;
    parent: CleanEmptyFolderFrame | null;
    size: number;
};

/**
 * Remove empty folders from a given directory.
 * @param directory
 * @param options
 */
async function cleanEmptyFolders(
    directory: string,
    options?: Partial<CleanEmptyFoldersOptions>,
): Promise<void> {
    const {
        deleteHiddenFiles,
        filter,
        maxDepth,
        dry,
    }: CleanEmptyFoldersOptions = {
        deleteHiddenFiles: true,
        filter: () => true,
        maxDepth: 0,
        dry: false,
        ...(options || {}),
    };
    const firstCall: CleanEmptyFolderFrame = {
        parent: null,
        size: -1,
        visited: false,
        ...(await getRecursiveFileCall(directory)),
    };

    const callStack: CleanEmptyFolderFrame[] = [firstCall];

    while (callStack.length > 0) {
        const frame = callStack.at(-1) as CleanEmptyFolderFrame;

        const isMaxDepthReached = maxDepth > 0 && callStack.length > maxDepth;
        if (isMaxDepthReached) {
            console.log(
                `rmdir: '${frame.filepath}' Skipped --> Max depth reached.`,
            );
            callStack.pop();
            continue;
        }

        const currentFile = frame.filepath;

        if (!frame.isDirectory) {
            const shouldBeDeleted =
                deleteHiddenFiles && isHiddenFile(path.basename(currentFile));

            if (shouldBeDeleted) {
                await deleteFile(frame);
            }

            callStack.pop();
            continue;
        }

        const entries = await fs.readdir(currentFile, { withFileTypes: true });

        if (!frame.visited) {
            frame.size = entries.length;
        } else {
            if (frame.size === 0) {
                await deleteFile(frame);
            }
            callStack.pop();
            continue;
        }
        frame.visited = true;

        for (const entry of entries.toReversed()) {
            callStack.push({
                filepath: path.join(currentFile, entry.name),
                isDirectory: entry.isDirectory(),
                visited: false,
                size: -1,
                parent: frame,
            });
        }
    }

    async function deleteFile(frame: CleanEmptyFolderFrame) {
        if (!frame.parent) {
            return;
        }

        const isIncluded = await filter(
            path.relative(directory, frame.filepath),
        );

        if (!isIncluded) {
            return;
        }

        if (!dry && existsSync(frame.filepath)) {
            if (frame.isDirectory) {
                await fs.rmdir(frame.filepath);
            } else {
                await fs.rm(frame.filepath);
            }
        }
        console.log(`${frame.isDirectory ? "rmdir" : "rm"}: ${frame.filepath}`);

        frame.parent.size -= 1;
    }
}

function isHiddenFile(filename: string): boolean {
    return HIDDEN_FILES_SET.has(filename);
}

export { cleanEmptyFolders, isHiddenFile };
