import store from "../../../src/app-store";
import isObject from "../../../src/utils/isObject";

/**
 * Registers the Observer.
 * @param {Object} vueStore The store from the component.
 * @returns {void}
 */
function register (vueStore) {
    vueStore.dispatch("Tools/SessionTool/register", {key: "Filter", getter: getFilterState, setter: setFilter});
}
/**
 * Gets the current filter state.
 * @returns {Object} The current state of the filter.
 */
function getFilterState () {
    store.dispatch("Tools/Filter/serializeState");
    const string = store.getters["Tools/Filter/serializedString"];

    return JSON.parse(string);
}
/**
 * Sets the filter state.
 * @param {Object} payload The payload.
 * @param {Object[]} payload.rulesOfFilters The array of rules for each filter.
 * @param {Object[]} payload.selectedAccordions The accordions to select.
 * @returns {void}
 */
function setFilter (payload) {
    if (!Array.isArray(payload?.rulesOfFilters) || payload?.rulesOfFilters.length === 0
        && (!isObject(payload?.geometryFeature) || Object.keys(payload.geometryFeature).length === 0)) {
        return;
    }

    store.dispatch("Tools/Filter/deserializeState", payload);
}

export {
    register,
    getFilterState,
    setFilter
};
