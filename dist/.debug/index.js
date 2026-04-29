import { createSelectorInterface } from "../console/readline-selector.js";
main();
async function main() {
    const selector = createSelectorInterface(process.stdin, process.stdout);
    const entries = [
        ["one", "one"],
        ["two", "two"],
        ["three", "three"],
        ["four", "four"],
        ["five", "five"],
        ["six", "six"],
    ];
    const answer = await selector.question("TEST QUESTION", entries);
    if (answer === null) {
        return;
    }
    console.log(answer);
}
//# sourceMappingURL=index.js.map