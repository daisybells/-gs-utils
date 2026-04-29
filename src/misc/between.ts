/**
 * Check if value (x) is between two numbers
 * @param x
 * @param min
 * @param max
 * @param inclusive
 * @returns
 */
function between(
    x: number,
    min: number,
    max: number,
    inclusive: boolean = true,
) {
    if (inclusive) {
        return x >= min && x <= max;
    } else {
        return x > min && x < max;
    }
}

export { between };
