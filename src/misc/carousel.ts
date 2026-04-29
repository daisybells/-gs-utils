function carousel(
    value: number,
    direction: 1 | -1,
    min: number,
    max: number,
): number {
    return ((value - 2 * min + max + 1 + direction) % (max + 1 - min)) + min;
}
export { carousel };
