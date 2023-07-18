import {
    getLayerByAttributes,
    getLayersByAttributes,
    addLayerByLayerId
} from "../utils/RadioBridge.js";

/**
 * Registers the Observer.
 * @param {Object} vueStore The store from the component.
 * @returns {void}
 */
function register (vueStore) {
    vueStore.dispatch("Tools/SessionTool/register", {key: "Layers", getter: getCurrentLayerList, setter: setLayers});
}

/**
 * Gets the current extent of the map.
 * @returns {Object} an object which holds the extent.
 */
function getCurrentLayerList () {
    const models = getLayersByAttributes({isSelected: true, type: "layer"}),
        layerIds = [];

    if (Array.isArray(models) && models.length) {
        models.forEach(model => layerIds.push({
            id: model?.id,
            visibility: typeof model.get === "function" ? model.get("isVisibleInMap") : true
        }));
    }
    else if (models?.id) {
        layerIds.push({
            id: models?.id,
            visibility: typeof models.get === "function" ? models.get("isVisibleInMap") : true
        });
    }
    return {
        layerIds
    };
}

/**
 * Sets the current extent of the map.
 * @param {Object} payload The payload.
 * @param {Object} state The state which includes the payload.
 * @returns {void}
 */
function setLayers (payload, state = false) {
    if (!Array.isArray(payload?.layerIds)) {
        return false;
    }
    const models = getLayersByAttributes({isSelected: true, type: "layer"}),
        blacklist = getLayerIdBlacklistFromAccordions(state?.Filter?.selectedAccordions);

    if (Array.isArray(models)) {
        models.forEach(model => {
            model.setIsSelected(false);
        });
    }

    payload.layerIds.forEach(layer => {
        if (Object.prototype.hasOwnProperty.call(blacklist, layer.id)) {
            return;
        }
        const model = getModelByLayerId(layer.id);

        if (typeof model?.setIsSelected === "function") {
            model.setIsSelected(true);
            if (typeof layer.visibility !== "undefined") {
                model.setIsVisibleInMap(layer.visibility);
            }
        }
    });
    return true;
}

/**
 * Gets the model by given layerId.
 * @param {String} layerId The layerId.
 * @return {Boolean|ol/layer/Layer} returns false if layerId is not a string or a number otherwise returns the model.
 */
function getModelByLayerId (layerId) {
    if (typeof layerId !== "string" && typeof layerId !== "number") {
        return false;
    }

    const layers = getLayersByAttributes({id: layerId});
    let model;

    if (Array.isArray(layers) && layers.length > 0) {
        model = layers[0];
    }
    else {
        addLayerByLayerId(layerId);
        model = getLayerByAttributes({id: layerId});
    }

    return model;
}
/**
 * Get a blacklist of layer ids from given accordions.
 * @param {Object[]} accordions The array of accordions.
 * @returns {Object} An object with blacklisted layer ids as keys.
 */
function getLayerIdBlacklistFromAccordions (accordions) {
    const blacklist = {};

    if (!Array.isArray(accordions)) {
        return {};
    }
    accordions.forEach(accordion => {
        if (accordion?.category) {
            accordion.layers.forEach(accordionInCategory => {
                blacklist[accordionInCategory.layerId] = true;
            });
            return;
        }
        blacklist[accordion.layerId] = true;
    });
    return blacklist;
}


export {
    register,
    setLayers,
    getCurrentLayerList,
    getModelByLayerId,
    getLayerIdBlacklistFromAccordions
};
