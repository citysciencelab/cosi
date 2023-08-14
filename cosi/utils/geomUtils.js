import {default as turfUnion} from "@turf/union";
import {default as turfIntersect} from "@turf/intersect";
import {GeoJSON} from "ol/format";
import {getCenter} from "ol/extent";

/**
 * Checks which district contains a given feature
 * @param {DistrictLevel} districtLevels - the districtLevels to check
 * @param {module:ol/Feature} feature - the feature to check against
 * @param {Boolean} [multiple=false] - defines whether multiple results are possible, returns the first result if false
 * @returns {String|module:ol/Feature} the districts name or the district feature
 */
export function getAllContainingDistricts (districtLevels, feature, multiple = false) {
    const containingDistricts = [];

    for (const districtLevel of districtLevels) {
        for (const district of districtLevel.districts) {
            const geom = district.adminFeature?.getGeometry(),
                featureExtent = feature.getGeometry().getExtent();

            if (!geom || geom.intersectsExtent(featureExtent)) {
                containingDistricts.push({
                    districtLevel: districtLevel.label,
                    district: district
                });

                if (!multiple) {
                    break;
                }
            }
        }

    }

    return multiple ? containingDistricts : containingDistricts[0];
}

/**
 * Checks which district contains a given feature
 * @param {DistrictLevel} districtLevel - the districtLevel to check
 * @param {module:ol/Feature} feature - the feature to check against
 * @param {Boolean} [returnsFeature=true] - defines whether to return a String or the Feature Object
 * @param {Boolean} [multiple=false] - defines whether multiple results are possible, returns the first result if false
 * @returns {String|module:ol/Feature} the districts name or the district feature
 */
export function getContainingDistrictForFeature (districtLevel, feature, returnsFeature = true, multiple = false) {
    const containingDistricts = [];

    for (const district of districtLevel.districts) {
        const geom = district.adminFeature.getGeometry(),
            featureExtent = feature.getGeometry().getExtent(),
            featureCenter = getCenter(featureExtent);

        if (multiple) {
            if (geom.intersectsExtent(featureExtent)) {
                containingDistricts.push(returnsFeature ? district : district.getName());
            }
        }
        else if (geom.intersectsCoordinate(featureCenter)) {
            containingDistricts.push(returnsFeature ? district : district.getName());
            break;
        }
    }

    return multiple ? containingDistricts : containingDistricts[0];
}

/**
 * Checks which district contains a given extent
 * @param {DistrictLevel} districtLevel - the districtLevel to check
 * @param {module:ol/extent} extent - the extent to check against
 * @param {Boolean} [returnsFeature=true] - defines whether to return a String or the Feature Object
 * @param {Boolean} [multiple=false] - defines whether multiple results are possible, returns the first result if false
 * @returns {String|module:ol/Feature} the districts name or the district feature
 */
export function getContainingDistrictForExtent (districtLevel, extent, returnsFeature = true, multiple = false) {
    const containingDistricts = [];

    for (const district of districtLevel.districts) {
        const geom = district.adminFeature.getGeometry();

        if (geom.intersectsExtent(extent)) {
            containingDistricts.push(returnsFeature ? district : district.getName());

            if (!multiple) {
                break;
            }
        }
    }

    return multiple ? containingDistricts : containingDistricts[0];
}

/**
 * Creates a new feature as a boolean union of a set of features
 * @param {module:ol/Feature[]} features - the OL features to join
 * @param {Boolean} [resetProperties=false] - defines whether to reset the new feature's properties to empty
 * @param {Boolean} [returnsFeature=false] - defines whether to return an OL feature or a simple GeoJSON
 * @param {String} [sourceCrs="EPSG:25832"] - the CRS of the input
 * @param {String} [targetCrs="EPSG:4326"] - the CRS of the output
 * @returns {module:ol/Feature | GeoJSONFeatureCollection} the feature or GeoJSON
 */
export function union (features, resetProperties = false, returnsFeature = false, sourceCrs = "EPSG:25832", targetCrs = "EPSG:4326") {
    const parser = new GeoJSON({
            dataProjection: targetCrs,
            featureProjection: sourceCrs
        }),
        geojson = parser.writeFeaturesObject(features);
    let unionFeature = geojson.features[0];

    // join features
    for (let i = 1; i < geojson.features.length; i++) {
        unionFeature = turfUnion(unionFeature, geojson.features[i]);
    }
    // reset the feature's properties
    if (resetProperties) {
        unionFeature.properties = {};
    }
    // parse to OL feature
    if (returnsFeature) {
        unionFeature = parser.readFeature(unionFeature);
    }

    return unionFeature;
}

/**
 * Creates a new feature as a boolean intersection of two features
 * @param {module:ol/Feature[]} features - the OL features to intersect
 * @param {Boolean} [resetProperties=false] - defines whether to reset the new feature's properties to empty
 * @param {Boolean} [returnsFeature=false] - defines whether to return an OL feature or a simple GeoJSON
 * @param {String} [sourceCrs="EPSG:25832"] - the CRS of the input
 * @param {String} [targetCrs="EPSG:4326"] - the CRS of the output
 * @returns {module:ol/Feature | GeoJSONFeatureCollection} the feature or GeoJSON
 */
export function intersect (features, resetProperties = false, returnsFeature = false, sourceCrs = "EPSG:25832", targetCrs = "EPSG:4326") {
    const parser = new GeoJSON({
            dataProjection: targetCrs,
            featureProjection: sourceCrs
        }),
        geojson = parser.writeFeaturesObject(features);
    let intersectionFeature = geojson.features[0];

    // intersect features
    for (let i = 1; i < geojson.features.length; i++) {
        intersectionFeature = turfIntersect(intersectionFeature, geojson.features[i]);
    }

    if (intersectionFeature) {
        // reset the feature's properties
        if (resetProperties) {
            intersectionFeature.properties = {};
        }
        // parse to OL feature
        if (returnsFeature) {
            intersectionFeature = parser.readFeature(intersectionFeature);
        }
    }

    return intersectionFeature;
}

export default {
    intersect,
    union,
    getContainingDistrictForFeature
};

