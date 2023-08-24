import Geometry from "ol/geom/Geometry";
import {GeoJSON} from "ol/format";
import isObject from "../../../../src/utils/isObject";

/**
 * Converts a geometry to a raw GeoJSON geometry object or string.
 * @param {ol/Geometry} geometry - The geometry to convert.
 * @param {Boolean} [asString=false] - Defines whether the geometry should be returned as object or string.
 * @param {String} [sourceCrs="EPSG:25832"] - The CRS of the input.
 * @param {String} [targetCrs="EPSG:4326"] - The CRS of the output.
 * @returns {GeoJSON|String|Boolean} The converted geometry as GeoJSON geometry or as string. False if the converting fails.
 */
function geometryToGeoJson (geometry, asString = false, sourceCrs = "EPSG:25832", targetCrs = "EPSG:4326") {
    if (!isObject(geometry) || !(geometry instanceof Geometry)) {
        console.error("utils/geometry/convertToGeoJson: The first parameter must be an ol geometry object, but got " + typeof geometry);
        return false;
    }
    if (typeof asString !== "boolean") {
        console.error("utils/geometry/convertToGeoJson: The second parameter must be a boolean, but got " + typeof asString);
        return false;
    }
    if (typeof sourceCrs !== "string" || typeof targetCrs !== "string") {
        console.error("utils/geometry/convertToGeoJson: The third and the fourth parameter must both be a string, but got " + typeof sourceCrs + " and " + typeof targetCrs);
        return false;
    }
    const parser = new GeoJSON({
        dataProjection: targetCrs,
        featureProjection: sourceCrs
    });

    return asString ? parser.writeGeometry(geometry) : parser.writeGeometryObject(geometry);
}

module.exports = {
    geometryToGeoJson
};
