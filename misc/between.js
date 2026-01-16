/**
 * Check if a given value (x) is within a specific range.
 * @param {Number} x - Test value
 * @param {Number} min - Lowest accepted value
 * @param {Number} max - Largest accepted values
 * @param {Boolean} [inclusive = true] - Choose whether to allow equal values [true] or disallow equal values [false]
 * @returns {Boolean}
 */
function between(x, min, max, inclusive = true) {
    if (inclusive) {
        return x >= min && x <= max;
    } else {
        return x > min && x < max;
    }
}

export { between };
