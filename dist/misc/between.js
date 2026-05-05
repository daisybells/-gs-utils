/**
 * Check if value (x) is between two numbers
 * @param x
 * @param min
 * @param max
 * @param inclusive
 * @returns
 */
function between(x, min, max, inclusive = true) {
    if (inclusive) {
        return x >= min && x <= max;
    }
    else {
        return x > min && x < max;
    }
}
export { between };
