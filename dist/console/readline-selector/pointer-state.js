import { carousel } from "../../misc/carousel.js";
function initializeStateMethods(config) {
    const { page_count, entries_per_page, entries, } = config;
    const state = {
        page: 0,
        index: 0,
    };
    const finalPageEntryCount = entries.length % entries_per_page;
    function pointerTo(page, index) {
        state.page = page;
        state.index = index;
    }
    function getCurrentState() {
        return state;
    }
    function movePointer(direction) {
        const START_INDEX = 0;
        const pageMax = page_count - 1;
        const isFinalPage = () => state.page === pageMax;
        const indexMax = (isFinalPage() ? finalPageEntryCount : entries_per_page) - 1;
        switch (direction) {
            case "left": {
                state.page = carousel(state.page, -1, START_INDEX, pageMax);
                break;
            }
            case "right": {
                state.page = carousel(state.page, 1, START_INDEX, pageMax);
                break;
            }
            case "up": {
                state.index = carousel(state.index, -1, START_INDEX, indexMax);
                break;
            }
            case "down": {
                state.index = carousel(state.index, 1, START_INDEX, indexMax);
                break;
            }
        }
        if (isFinalPage()) {
            state.index = Math.min(state.index, finalPageEntryCount - 1);
        }
    }
    function returnPointerIndex() {
        return state.page * entries_per_page + state.index;
    }
    return { movePointer, pointerTo, getCurrentState, returnPointerIndex };
}
export { initializeStateMethods };
//# sourceMappingURL=pointer-state.js.map