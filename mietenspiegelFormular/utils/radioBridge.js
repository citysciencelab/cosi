/**
 * Fires if it hits on searchbar
 * @param {Function} func the function to be used on searchbar
 * @returns {void}
 */
export function onSearchbar (func) {
    Radio.on("Searchbar", "hit", func);
}
