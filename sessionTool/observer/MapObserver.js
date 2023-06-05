import store from "../../../src/app-store";

/**
 * Registers the Observer.
 * @param {Object} vueStore The store from the component.
 * @returns {void}
 */
export function register (vueStore) {
    vueStore.dispatch("Tools/SessionTool/register", {key: "Maps", getter: getCurrentExtentOfMap, setter: setExtentForMap});
}

/**
 * Gets the current extent of the map.
 * @returns {Object} an object which holds the extent
 */
function getCurrentExtentOfMap () {
    return {
        center: store.getters["Maps/center"],
        zoomLevel: store.getters["Maps/getView"].getZoom()
    };
}

/**
 * Sets the current extent of the map.
 * @param {Object} payload the payload
 * @returns {void}
 */
function setExtentForMap (payload) {
    if (payload?.center && payload?.zoomLevel) {
        store.dispatch("Maps/setZoomLevel", payload.zoomLevel);
        store.dispatch("Maps/setCenter", payload.center);
    }
}
