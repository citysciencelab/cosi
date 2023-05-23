import {getFeatureIds, returnGeoJSONLayerObject} from "../js/addGeoJsonRemotely";
import importLayers from "../js/addWMSRemotely";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";

export default {
    /**
     * Adds a geojson through the remote interface
     * @param {String} name Name of the geojson to be shown in the layer tree
     * @param {String} id ID of the layer
     * @param {JSON} geoJSON Geojson containing all the features
     * @param {String} styleId StyleId of the layer which needs to be the same as the one in the style array inside the geojson
     * @param {String} folderName Name of the folder in the layer tree
     * @param {Object} gfiAttributes Attributes to be shown in the GFI
     * @param {Boolean} zoomTo Flag if the map should zoom to the extent of the layer
     * @param {Number} clusterDistance distance in which features will be clustured if set
     * @param {String} gfiTheme name of the gfiTheme
     * @param {String} mouseHoverField name of the field to be shown on mouse hover
     * @returns {void}
     */
    addGeoJson ({rootState}, {name, id, geoJSON, styleId, folderName, gfiAttributes, zoomTo = true, clusterDistance = undefined, gfiTheme = "default", mouseHoverField = undefined}) {
        const treeType = Radio.request("Parser", "getTreeType"),
            map = mapCollection.getMap("2D"),
            layer = map ? map.getLayers().getArray().find(l => {
                return l.get("id") === id;
            }) : undefined;
        let parentID = "",
            geojsonLayer = {};

        if (!layer) {
            if (geoJSON?.styles) {
                styleList.addToStyleList(geoJSON.styles);
            }
        }
        else {
            map?.removeLayer(layer);

            Radio.trigger("ModelList", "removeModelsById", id);
            Radio.trigger("ModelList", "removeLayerById", id);
            Radio.trigger("Parser", "removeItem", id);
        }

        if (treeType === "custom" || treeType === "default") {
            if (Radio.request("Parser", "getItemByAttributes", {id: "ExternalLayer"}) === undefined) {
                Radio.trigger("Parser", "addFolder", folderName, "ExternalLayer", "tree", 0);
                Radio.trigger("ModelList", "renderTree");
                $("#Overlayer").parent().after($("#ExternalLayer").parent());
            }

            parentID = "ExternalLayer";
        }
        else {
            parentID = "tree";
        }

        geojsonLayer = returnGeoJSONLayerObject(name, id, geoJSON, styleId, parentID, gfiAttributes, clusterDistance, gfiTheme, mouseHoverField);

        Radio.trigger("Parser", "addItem", geojsonLayer);
        Radio.trigger("ModelList", "addModelsByAttributes", {id: id});
        Radio.trigger("ModelList", "renderTree");

        if (mouseHoverField) {
            rootState.MouseHover.mouseHoverLayers.push(geojsonLayer);
            rootState.MouseHover.mouseHoverInfos.push({id: geojsonLayer.id, mouseHoverField: geojsonLayer.mouseHoverField});
        }

        if (treeType === "light") {
            Radio.trigger("ModelList", "refreshLightTree");
        }

        if (zoomTo) {
            Radio.trigger("Map", "zoomToFilteredFeatures", getFeatureIds(id), id);
        }

        window.addEventListener("touchmove", () => {
            if (map.getView().getZoom() < map.getView().getMinZoom()) {
                map.getView().setZoom(map.getView().getMinZoom());
                return false;
            }
            else if (map.getView().getZoom() > map.getView().getMaxZoom()) {
                map.getView().setZoom(map.getView().getMaxZoom());
                return false;
            }
            return true;
        });
    },

    /**
     * Adds a WMS through the remote interface
     * Note: Only works with treeType Custom
     * @param {Object} context The vuex context.
     * @param {String} url Url of the WMS
     * @param {Array} layersToLoad Array of Objects containing the name, title, style, layerOn information of the layers to be added from the WMS capabilities
     * @param {String} folderName Name of the folder in the layer tree
     * @param {Boolean} zoomTo Parameter to indicate whether the layer is turned on
     * @returns {void}
     */
    addWMS (context, {url, layersToLoad = undefined, folderName = "Externe Daten", zoomTo = false}) {
        importLayers(url, layersToLoad, folderName, zoomTo);
    },

    /**
     * Sets the geometry for the route features and zoom to the feature extent.
     * @param {Object} context The vuex context.
     * @param {String} layerId The layer id.
     * @param {Boolean} isSelected Is the layer selected.
     * @returns {void}
     */
    toggleLayerVisibility (context, {layerId}) {
        const layer = Radio.request("ModelList", "getModelByAttributes", {id: layerId});

        if (layer) {
            Radio.trigger("ModelList", "setModelAttributesById", layerId, {isSelected: !layer.get("isSelected")});
        }
    }
};
