import {rawLayerList} from "@masterportal/masterportalapi";
import {getFeatureGET} from "../../../src/api/wfs/getFeature";
import {WFS} from "ol/format.js";
import isObject from "../../../src/utils/isObject";
import {describeFeatureType, getFeatureDescription} from "../../../src/api/wfs/describeFeatureType";

/**
 * Gets the unique values for the given attributes.
 * @param {String} layerId The layer id.
 * @param {String[]} attributesToFilter The attributes to filter.
 * @returns {Object} an object with following structure {attrName: uniqueListObject, attrName1: uniqueListObject}.
 */
async function getUniqueValues (layerId, attributesToFilter) {
    const rawLayer = rawLayerList.getLayerWhere({id: layerId});
    let response = null,
        features = null,
        attributesWithType = null;

    if (rawLayer === null) {
        return [];
    }
    if (rawLayer?.typ === "WFS") {
        response = await this.fetchAllDataForWFS(rawLayer?.url, rawLayer?.featureType, attributesToFilter.join(","));
        features = new WFS().readFeatures(response);
        attributesWithType = await this.getAttributesWithType(rawLayer?.url, attributesToFilter, rawLayer?.featureType);
        // TODO: handle OAF.
    }
    return this.getUniqueValuesFromFeatures(features, attributesWithType);
}
/**
 * Gets the attributes with the matching type.
 * @param {String} url The base url.
 * @param {String[]} attrNames The attribute names.
 * @param {String} featureType The feature type.
 * @returns {Object[]} the attributes with type. Following structure [{name: attrName, type: attrType}].
 */
async function getAttributesWithType (url, attrNames, featureType) {
    if (typeof url !== "string" || !Array.isArray(attrNames)) {
        return [];
    }

    const json = await describeFeatureType(url),
        descriptions = getFeatureDescription(json, featureType),
        attributesWithType = !Array.isArray(descriptions) ? [] : descriptions.filter(description => attrNames.includes(description.name));

    return attributesWithType;
}

/**
 * Fetches the unique values for given attributes to filter.
 * @param {String} url The base url.
 * @param {String} featureType The feature type.
 * @param {String} propertyNames The property names. Comma seperated list as String.
 * @returns {Promise} the get feature response.
 */
async function fetchAllDataForWFS (url, featureType, propertyNames) {
    const payload = {
        version: "1.1.0",
        featureType,
        propertyNames
    };

    return getFeatureGET(url, payload, error => {
        console.error(error);
    });
}

/**
 * Gets the unique values of the features.
 * @param {Object} features The features.
 * @param {Object[]} attributes The attribute names. @see getAttributesWithType The result of this function.
 * @returns {Object} an object with unique values for each attrName.
 */
function getUniqueValuesFromFeatures (features, attributes) {
    if (!Array.isArray(features) || !Array.isArray(attributes)) {
        return {};
    }
    const result = {};

    features.forEach(feature => {
        const properties = feature.getProperties();

        attributes.forEach(attribute => {
            const property = properties[attribute.name];

            if (!isObject(result[attribute.name])) {
                result[attribute.name] = {};
            }
            result[attribute.name][property] = true;
        });
    });

    return result;
}

export default {
    getUniqueValues,
    getAttributesWithType,
    fetchAllDataForWFS,
    getUniqueValuesFromFeatures
};
