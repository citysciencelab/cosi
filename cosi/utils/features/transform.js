/**
 * Transform each coordinate of the feature geometry from one crs to another.
 * @param {ol/Feature[]} features - An array of features.
 * @param {String} source - The current projection as crs identifier string.
 * @param {String} destination - The desired projection as crs identifier string.
 * @returns {ol/Feature[]|false} The array of the given features or false if an error has occurred.
 */
function transformFeatures (features, source, destination) {
    if (typeof source !== "string" || typeof destination !== "string") {
        console.error(`utils/features/transform: The second and the third parameter must both be a string, but got ${typeof source} and ${typeof destination}`);
        return false;
    }
    if (!Array.isArray(features) || features.length < 1) {
        console.error("utils/features/transform: The first parameter must be an non-empty array");
        return false;
    }

    features.forEach(feature => {
        const geometry = feature.getGeometry();

        if (geometry) {
            geometry.transform(source, destination);
        }
    });
    return features;
}

module.exports = {
    transformFeatures
};
