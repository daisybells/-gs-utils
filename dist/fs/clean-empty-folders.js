import fs from "node:fs/promises";
import path from "node:path";
import { getRecursiveFileCall } from "./helpers/get-recursive-call.js";
const HIDDEN_FILES_SET = new Set([".DS_Store", "Desktop.ini"]);
/**
 * Remove empty folders from a given directory.
 * @param directory
 * @param options
 */
async function cleanEmptyFolders(directory, options) {
    const { deleteHiddenFiles, filter, maxDepth, dry, } = {
        deleteHiddenFiles: true,
        filter: () => true,
        maxDepth: 0,
        dry: false,
        ...(options || {}),
    };
    const firstCall = {
        parent: null,
        size: -1,
        visited: false,
        ...(await getRecursiveFileCall(directory)),
    };
    const callStack = [firstCall];
    while (callStack.length > 0) {
        const frame = callStack.at(-1);
        const isMaxDepthReached = maxDepth > 0 && callStack.length > maxDepth;
        if (isMaxDepthReached) {
            console.log(`rmdir: '${frame.filepath}' Skipped --> Max depth reached.`);
            callStack.pop();
            continue;
        }
        const currentFile = frame.filepath;
        if (!frame.isDirectory) {
            const shouldBeDeleted = deleteHiddenFiles &&
                HIDDEN_FILES_SET.has(path.basename(currentFile));
            if (shouldBeDeleted) {
                await deleteFile(frame);
            }
            callStack.pop();
            continue;
        }
        const entries = await fs.readdir(currentFile, { withFileTypes: true });
        if (!frame.visited) {
            frame.size = entries.length;
        }
        else {
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
    async function deleteFile(frame) {
        const isIncluded = await filter(frame.filepath);
        if (!isIncluded) {
            return;
        }
        if (!dry) {
            if (frame.isDirectory) {
                await fs.rmdir(frame.filepath);
            }
            else {
                await fs.rm(frame.filepath);
            }
        }
        console.log(`${frame.isDirectory ? "rmdir" : "rm"}: ${frame.filepath}`);
        if (!frame.parent) {
            return;
        }
        frame.parent.size -= 1;
    }
}
export { cleanEmptyFolders };
