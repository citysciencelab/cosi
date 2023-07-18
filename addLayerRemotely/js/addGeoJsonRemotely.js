/**
 * Gets the layer for the given layerId and extracts the Ids of the features.
 *
 * @param {String} layerId Unique Id of the layer in which the features reside.
 * @returns {String[]} Array of FeatureIds.
 */
function getFeatureIds (layerId) {
    const featureArray = [],
        layer = Radio.request("Map", "getLayers").getArray().find(l => l.get("id") === layerId);

    if (typeof layer === "undefined") {
        console.warn(i18next.t("common:modules.featureViaURL.messages.layerNotFound"));
        return featureArray;
    }
    layer.getSource().getFeatures().forEach(feature => {
        featureArray.push(feature.getId());
    });

    if (featureArray.length < 1 && layer.getSource()?.getSource()?.getFeatures().length) {
        layer.getSource().getSource().getFeatures().forEach(f => {
            featureArray.push(f.getId());
        });
    }

    return featureArray;
}

/**
 * Returns a geojson layer object.
 *
 * @param {String} name The name of the layer (can be selected alphanumerically).
 * @param {String} id The Id of the layer (can be selected alphanumerically, but should be unique).
 * @param {(String | object)} geojson A valid GeoJSON. If no crs is defined in the JSON, EPSG:4326 is assumed.
 * @param {String} styleId Id for the styling of the features; should correspond to a style from the style.json.
 * @param {String} parentId Id for the correct position of the layer in the layertree.
 * @param {String} [gfiAttributes] Attributes to be shown when clicking on the feature using the GFI tool.
 * @param {Number} clusterDistance Distance in which point features are clustered. Undefined if no clusters are to be used.
 * @param {String} gfiTheme name of the gfiTheme
 * @param {String} mouseHoverField name of the field to be shown on mouse hover
 * @returns {Object} Object of geojson layer
*/
function returnGeoJSONLayerObject (name, id, geojson, styleId, parentId, gfiAttributes = "showAll", clusterDistance = undefined, gfiTheme = "default", mouseHoverField = undefined) {
    const layer = {
        type: "layer",
        name: name,
        id: id,
        typ: "GeoJSON",
        geojson: geojson,
        transparent: true,
        gfiAttributes: gfiAttributes,
        layerAttribution: "nicht vorhanden",
        legendURL: "",
        isBaseLayer: false,
        isSelected: true,
        isVisibleInTree: true,
        cache: false,
        datasets: [],
        urlIsVisible: true,
        gfiTheme: gfiTheme
    };

    if (styleId !== undefined) {
        layer.styleId = styleId;
    }
    if (parentId !== undefined) {
        layer.parentId = parentId;
    }
    if (clusterDistance !== undefined) {
        layer.clusterDistance = clusterDistance;
    }
    if (mouseHoverField !== undefined) {
        layer.mouseHoverField = mouseHoverField;
    }

    return layer;
}

export {
    getFeatureIds,
    returnGeoJSONLayerObject
};
