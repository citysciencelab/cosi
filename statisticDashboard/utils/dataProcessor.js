import {WFS} from "ol/format.js";

/**
 * Gets the features from the given XML.
 * @param {String} xml The xml to parse.
 * @param {String} parseType The type.
 * @returns {Object[]} An array of features.
 */
function getFeaturesFromXML (xml, parseType) {
    if (parseType === "WFS") {
        return new WFS().readFeatures(xml);
    }
    // TODO: handle oaf in the future
    return [];
}

export default {
    getFeaturesFromXML
};
