import fs from "node:fs/promises";

/**
 * A string representing a filesystem Path.
 * @typedef {string} PathLike
 */

/**
 * Callback function that is meant to transform or generate a given JSON object.
 *
 * @callback updateArray
 * @param {object|null} foundObject - The object within the array to be transformed.
 * @returns {object} - The transformed object.
 */

/**
 *
 * @param {PathLike} filePath - Path to JSON file with an array to be edited.
 * @param {object} options - Configurable settings for the function.
 * @param {string} options.key - Determines which object key to parse for in a given item.
 * @param {string} options.value - Determines what the value of the object key should be equal to.
 *
 * @param {updateArray} updateFunction - Function that determines how to transform the new object
 * within an array.
 *
 *
 * @returns
 */

async function updateObjectInJsonArray(filePath, options, updateFunction) {
    const { key, value } = options;
    const jsonArray = JSON.parse(await fs.readFile(filePath, "utf-8"));
    if (!Array.isArray(jsonArray)) {
        console.error("json data not array");
        return;
    }
    const index = jsonArray.findIndex((item) => item[key] === value);
    if (index === -1) {
        console.log(
            `Object with key '${key}' and value '${value}' not found. Creating new object.`
        );
        const newObject = updateFunction(null);
        jsonArray.push(newObject);
    } else {
        console.log(
            `Overwriting object with key '${key}' and value '${value}'...`
        );
        const updatedObject = updateFunction(jsonArray[index]);
        jsonArray[index] = updatedObject;
    }
    await fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2));
}

export { updateObjectInJsonArray };
