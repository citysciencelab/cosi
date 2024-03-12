/**
 * Creates an array of unique values.
 * @param {*[]} array - The array to be made unique.
 * @returns {*[]|Boolean} The unique array or false, if it fails.
 */
function uniq (array) {
    if (!Array.isArray(array)) {
        console.error("utils/array/uniq: The passed parameter must be an array, but got " + typeof array);
        return false;
    }
    return [...new Set(array)];
}

module.exports = {
    uniq
};
