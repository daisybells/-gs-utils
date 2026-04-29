function carousel(value, direction, min, max) {
    return ((value - 2 * min + max + 1 + direction) % (max + 1 - min)) + min;
}
export { carousel };
//# sourceMappingURL=carousel.js.map