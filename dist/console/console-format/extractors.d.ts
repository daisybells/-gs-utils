import type { ActiveEscapeCodes, ColoredCLIString } from "../../types/console/console-format.js";
declare function reduceEscapeCodes(specifiersArray: string[]): ActiveEscapeCodes;
declare function trackEscapeCode(accumulator: ActiveEscapeCodes, currentEscapeCode: string): ActiveEscapeCodes;
declare function reduceDecorationCodes(specifiersArray: string[]): ColoredCLIString[];
export { reduceEscapeCodes, reduceDecorationCodes, trackEscapeCode };
