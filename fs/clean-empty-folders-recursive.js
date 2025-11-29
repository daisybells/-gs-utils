import fs from "node:fs/promises";
import path from "node:path";

async function cleanEmptyFoldersRecursively(folder) {
    const isDirectory = (await fs.stat(folder)).isDirectory();
    if (!isDirectory) return;

    let files = await fs.readdir(folder);

    if (files.length > 0) {
        for (const file of files) {
            const fullPath = path.join(folder, file);
            // eslint-disable-next-line no-await-in-loop
            await cleanEmptyFoldersRecursively(fullPath);
        }

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = (await fs.readdir(folder)).filter(
            (file) => file !== ".DS_Store"
        );
    }

    if (files.length === 0) {
        const hasDsStore = (await fs.readdir(folder)).some(
            (file) => file === ".DS_Store"
        );
        console.log(`removing: '${folder}'`);
        if (hasDsStore) await fs.rm(path.join(folder, ".DS_Store"));
        try {
            await fs.rmdir(folder);
        } catch (error) {
            if (error.code !== "ENOENT") throw new Error(error);
            console.warn(`Warning: Folder path '${folder}' does not exist`);
        }
    }
}

export { cleanEmptyFoldersRecursively };
