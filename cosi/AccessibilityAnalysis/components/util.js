import GeoJSON from "ol/format/GeoJSON";

/**
 * @param {*} data data
 * @return {*} features
 */
export function readFeatures (data) {
    return new GeoJSON().readFeatures(data);
}

/**
 * @param {*} features features
 * @return {*} data
 */
export function writeFeatures (features) {
    return new GeoJSON().writeFeatures(features);
}
