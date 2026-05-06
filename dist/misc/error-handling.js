async function tryCatch(promise) {
    try {
        const data = await promise;
        return {
            success: true,
            data,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error,
        };
    }
}
function succeeded(data) {
    return {
        success: true,
        data,
    };
}
function failed(error) {
    return {
        success: false,
        error,
    };
}
export { tryCatch, succeeded, failed };
