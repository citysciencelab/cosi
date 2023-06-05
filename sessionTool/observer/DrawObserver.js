import store from "../../../src/app-store";

/**
 * Registers the Observer.
 * @param {Object} vueStore The store from the component.
 * @returns {void}
 */
export function register (vueStore) {
    vueStore.dispatch("Tools/SessionTool/register", {key: "DrawTool", getter: getCurrentStateOfDraw, setter: setDrawState});
}

/**
 * Gets the current extent of the map.
 * @returns {Object} an object which holds the draw state
 */
async function getCurrentStateOfDraw () {
    let draw;

    store.commit("Tools/Draw/setDownloadSelectedFormat", "GEOJSON");
    store.dispatch("Tools/Draw/setDownloadFeatures");
    await store.dispatch("Tools/Draw/prepareData");

    try {
        draw = JSON.parse(store.getters["Tools/Draw/download"].dataString);
    }
    catch (error) {
        console.warn("jsonParse failed: could not parse\"" + draw + "\" to JSON: " + error);
    }

    return {
        draw
    };
}

/**
 * Sets the current extent of the map.
 * @param {Object} payload the payload
 * @returns {void}
 */
async function setDrawState (payload) {
    if (!Array.isArray(payload?.draw?.features) || !payload?.draw?.features?.length) {
        return;
    }
    const vectorLayer = await store.dispatch("Maps/addNewLayerIfNotExists", "importDrawLayer", {root: true});

    store.dispatch("Tools/FileImport/importGeoJSON", {raw: JSON.stringify(payload.draw), layer: vectorLayer, filename: "draw.geojson"});
}
