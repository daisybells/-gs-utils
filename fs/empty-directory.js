import fs from "node:fs/promises";
import path from "node:path";

const defaultOptions = { includeHidden: false };

async function emptyDirectory(directoryPath, inputOptions) {
    const options = { ...defaultOptions, ...inputOptions };
    const { includeHidden } = options;

    console.log(`🔄 Emptying directory: ${directoryPath}`);

    const children = await fs.readdir(directoryPath, { withFileTypes: true });
    const childrenToInclude = includeHidden
        ? children
        : children.filter((file) => !file.name.startsWith("."));

    if (childrenToInclude.length === 0) {
        console.log(`Directory already empty.`);
        return;
    }

    for (const child of childrenToInclude) {
        const childPath = path.join(directoryPath, child.name);
        await fs.rm(childPath, { recursive: true, force: true });
    }
    console.log(
        `✅ All files and subdirectories from ${directoryPath} have been removed`
    );
}

export { emptyDirectory };
