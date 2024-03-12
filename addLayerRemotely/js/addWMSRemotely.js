import {WMSCapabilities} from "ol/format.js";
import {intersects} from "ol/extent";
import crsModule from "@masterportal/masterportalapi/src/crs";
import axios from "axios";
import store from "../../../src/app-store";

/**
 * Adds a WMS through the remote interface
 * Note: Only works with treeType Custom
 *
 * @param {String} url Url of the WMS
 * @param {Array} layersToLoad Array of Objects containing the name, title, style, layerOn information of the layers to be added from the WMS capabilities
 * @param {String} folderName Name of the folder in the layer tree
 * @param {Boolean} zoomTo Parameter to indicate whether the layer is turned on
 * @returns {void}
 */
export default function importLayers (url, layersToLoad, folderName, zoomTo) {

    if (url.includes("http:")) {
        console.error("https required");
        return;
    }
    Radio.trigger("Util", "showLoader");
    axios({
        timeout: 40000,
        url: `${url}${url.includes("?") ? "&" : "?"}request=GetCapabilities&service=WMS`
    })
        .then(response => response.data)
        .then((data) => {
            Radio.trigger("Util", "hideLoader");
            try {
                const parser = new WMSCapabilities(),
                    capability = parser.read(data),
                    version = capability?.version,
                    checkVersion = isVersionEnabled(version),
                    currentExtent = Radio.request("Parser", "getPortalConfig")?.mapView?.extent,
                    projection = store.getters["Maps/projection"].code_;

                let checkExtent = getIfInExtent(capability, currentExtent, projection),
                    uniqueId = "external_",
                    finalCapability = capability;

                if (!checkVersion) {
                    const reversedData = getReversedData(data);

                    finalCapability = parser.read(reversedData);
                    checkExtent = getIfInExtent(finalCapability, currentExtent, projection);
                }

                if (!checkExtent) {
                    console.error("Layer is outside the map extent");
                    return;
                }

                if (Radio.request("Parser", "getItemByAttributes", {id: "ExternalLayer"}) === undefined) {
                    Radio.trigger("Parser", "addFolder", folderName, "ExternalLayer", "tree", 0);
                    Radio.trigger("ModelList", "renderTree");
                    $("#Overlayer").parent().after($("#ExternalLayer").parent());
                }

                uniqueId = uniqueId + getParsedTitle(finalCapability.Service.Title);

                Radio.trigger("Parser", "addFolder", finalCapability.Service.Title, uniqueId, "ExternalLayer", 0);

                if (layersToLoad) {
                    layersToLoad.forEach(layer => {
                        const layerObj = {
                            id: getParsedTitle(layer.title),
                            name: layer.title,
                            parentId: uniqueId,
                            level: 1,
                            layers: layer.name,
                            url: url,
                            version: version,
                            transparent: layer.layerTransparent ? layer.layerTransparent : true,
                            isSelected: !layer.layerOn ? layer.layerOn : true,
                            time: layer.layerTime ? layer.layerTime : false,
                            infoFormat: layer.infoFormat ? layer.infoFormat : "text/xml",
                            styles: layer.style ? layer.style : "",
                            cache: false,
                            datasets: [],
                            featureCount: 3,
                            format: "image/png",
                            gfiAttributes: "showAll",
                            gutter: "0",
                            isBaseLayer: false,
                            layerAttribution: "nicht vorhanden",
                            legendURL: "",
                            maxScale: "2500000",
                            minScale: "0",
                            singleTile: false,
                            supported: ["2D", "3D"],
                            tilesize: "512",
                            typ: "WMS",
                            type: "layer",
                            urlIsVisible: true
                        };

                        Radio.trigger("Parser", "addItem", layerObj);

                        Radio.trigger("ModelList", "addModelsByAttributes", {id: getParsedTitle(layer.title)});
                    });
                }
                else {
                    finalCapability.Capability.Layer.Layer.forEach(layer => {
                        parseLayer(layer, uniqueId, 1, version, url);
                        Radio.trigger("ModelList", "addModelsByAttributes", {id: getParsedTitle(layer.Title)});
                    });
                }
                if (zoomTo) {
                    Radio.trigger("Map", "zoomToExtent", {extent: checkExtent});
                }

                Radio.trigger("ModelList", "closeAllExpandedFolder");

            }
            catch (e) {
                console.error(e);
            }
        }, resp => {
            Radio.trigger("Util", "hideLoader");
            console.error(resp);
        });
}


/**
 * Appending folders and layers to the menu based on the given layer object
 * @info recursive function
 * @param {Object} object the ol layer to hang into the menu as new folder or new layer
 * @param {String} parentId the id of the parent object in the menu
 * @param {Number} level the depth of the recursion
 * @param {String} version WMS Version
 * @param {String} url WMS url
 * @fires Core.ConfigLoader#RadioTriggerParserAddFolder
 * @fires Core.ConfigLoader#RadioTriggerParserAddLayer
 * @return {void}
 */
function parseLayer (object, parentId, level, version, url) {
    if (Object.prototype.hasOwnProperty.call(object, "Layer")) {
        object.Layer.forEach(layer => {
            parseLayer(layer, getParsedTitle(object.Title), level + 1);
        });
        Radio.trigger("Parser", "addFolder", object.Title, getParsedTitle(object.Title), parentId, level, false, false, object.invertLayerOrder);
    }
    else {
        Radio.trigger("Parser", "addLayer", object.Title, getParsedTitle(object.Title), parentId, level, object.Name, url, version, {isSelected: true});
    }
}

/**
 * Getter if the version is enabled and above 1.3.0
 * @param {String} version the version of current external wms layer
 * @returns {Boolean} true or false
 */
function isVersionEnabled (version) {
    if (typeof version !== "string") {
        return false;
    }

    const parsedVersion = version.split(".");

    if (parseInt(parsedVersion[0], 10) < 1) {
        return false;
    }
    else if (parsedVersion.length >= 2 && parseInt(parsedVersion[0], 10) === 1 && parseInt(parsedVersion[1], 10) < 3) {
        return false;
    }

    return true;
}

/**
 * Getter if the imported wms layer in the extent of current map
 * @param {Object} capability the response of the imported wms layer in parsed format
 * @param {Number[]} currentExtent the extent of current map view
 * @param {String} projection the projection of the map
 * @returns {Boolean} true or false
 */
function getIfInExtent (capability, currentExtent, projection) {
    const definedExtents = capability?.Capability?.Layer?.BoundingBox?.filter(bbox => {
        return bbox?.crs && bbox?.crs.includes("EPSG") && crsModule.getProjection(bbox?.crs) !== undefined && Array.isArray(bbox?.extent) && bbox?.extent.length === 4;
    });

    let layerExtent;

    if (Array.isArray(definedExtents) && definedExtents.length) {
        let minCoords = [],
            maxCoords = [];

        definedExtents.forEach(singleExtent => {
            if (singleExtent.crs === projection) {
                minCoords = [singleExtent.extent[0], singleExtent.extent[1]];
                maxCoords = [singleExtent.extent[2], singleExtent.extent[3]];
            }
        });

        if (!minCoords.length && !maxCoords.length) {
            minCoords = crsModule.transformCoord(definedExtents[0].crs, projection, [definedExtents[0].extent[0], definedExtents[0].extent[1]]);
            maxCoords = crsModule.transformCoord(definedExtents[0].crs, projection, [definedExtents[0].extent[2], definedExtents[0].extent[3]]);
        }

        layerExtent = [minCoords[0], minCoords[1], maxCoords[0], maxCoords[1]];

        // If there is no extent defined or the extent is not right defined, it will import the external wms layer(s).
        if (!Array.isArray(currentExtent) || currentExtent.length !== 4) {
            return layerExtent;
        }

        return intersects(currentExtent, layerExtent) ? layerExtent : false;
    }

    return true;
}

/**
 * Getter for reversed data of old wms version
 * @param {Object} data the response of the imported wms layer
 * @returns {xml} reversedData - The reversed data of the response of the imported wms layer
 */
function getReversedData (data) {
    let reversedData = new XMLSerializer().serializeToString(data);

    reversedData = reversedData.replace(/<SRS>/g, "<CRS>").replace(/<\/SRS>/g, "</CRS>").replace(/SRS=/g, "CRS=");
    reversedData = new DOMParser().parseFromString(reversedData, "text/xml");

    return reversedData;
}

/**
 * Getter for parsed title without space and slash and colon
 * It will be used as id later in template
 * @param {String} title - the title of current layer
 * @returns {String} parsedTitle - The parsed title
 */
function getParsedTitle (title) {
    return String(title).replace(/\s+/g, "-").replace(/\//g, "-").replace(/:/g, "-").replace(/\(/g, "-").replace(/\)/g, "-");
}

export {
    parseLayer,
    isVersionEnabled,
    getIfInExtent,
    getReversedData,
    getParsedTitle
};

