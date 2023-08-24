import {getLayerSource} from "./layer/getLayerSource";
import Vue from "vue";
import {getItemsByAttributes, getCollection} from "../utils/radioBridge.js";
import * as webgl from "@masterportal/masterportalapi/src/renderer/webgl";
import {getCenter} from "ol/extent";

/**
 * filters all features by a given geometry
 * @param {module:ol/source/Vector} source - the source
 * @param {module:ol/geom/GeometryCollection} bboxGeometry - the bounding geometry
 * @returns {void}
 */
function filterLayerSourceByBbox (source, bboxGeometry) {
    source.forEachFeature(feature => {
        if (feature.getGeometry() !== undefined && !bboxGeometry.intersectsCoordinate(getCenter(feature.getGeometry().getExtent()))) {
            source.removeFeature(feature);
        }
    });
}

/**
 * reloads the source and filters it by BBOX
 * @param {module:ol/source/Vector} model - the layer model
 * @param {module:ol/geom/GeometryCollection} bboxGeometry - the bounding geometry
 * @param {String} url - the url of the WFS
 * @param {Object} item - the raw layer item
 * @param {Vue} [app] - the calling component
 * @returns {void}
 */
function updateSource (model, bboxGeometry, url, item, app) {
    const
        source = getLayerSource(model.layer),
        typ = item.typ;

    if (!source) {
        return;
    }

    source.clear();

    // remove old listener -> necessary since the listener is an anonymous function
    if (source.getListeners("featuresloadend")) {
        delete source.listeners_.featuresloadend;
    }

    // set new BBOX-filtered URL to WFS layers or WebGL Layers with WFS source
    if (typ === "WFS") {
        source.setUrl(url);
    }

    // refresh source if remote data
    if (typ !== "VectorBase") {
        source.refresh();
        if (bboxGeometry) {
            source.on("featuresloadend", function (evt) {
                if (item.renderer === "webgl") {
                    // run afterloading functions for webGL layer
                    webgl.afterLoading(
                        evt.target.getFeatures(),
                        model.attributes.styleId,
                        model.attributes.excludeTypesFromParsing,
                        model.attributes.isPointLayer
                    );
                }
                filterLayerSourceByBbox(evt.target, bboxGeometry);
                if (app) {
                    // updateFeaturesList event is the best way I found to let app know when data has finished loading.
                    // as updateFeaturesList may be triggered multiple times from different places as data loads, info where this event came from needs to be passed along
                    app.$root.$emit("updateFeaturesList", "setBBoxToGeom-updateSource");
                }
            });
        }
    }
    // add layers as loaded or added programatically
    else {
        source.addFeatures(item.features);
        if (bboxGeometry) {
            filterLayerSourceByBbox(source, bboxGeometry);
            if (app) {
                // updateFeaturesList event is the best way I found to let app know when data has finished loading.
                // as updateFeaturesList may be triggered multiple times from different places as data loads, info where this event came from needs to be passed along

                app.$root.$emit("updateFeaturesList", "setBBoxToGeom-updateSource");
            }
        }
    }
}

/**
 * quick fix for VectorLayer BBox
 * @todo refactor to vuex store action
 * @param {module:ol/geom/GeometryCollection} bboxGeometry - the geometry to set the bounding box to
 * @returns {void}
 */
function setBBoxToGeom (bboxGeometry) {
    const
        app = this instanceof Vue ? this : undefined,
        layerlist = [
            ...getItemsByAttributes({typ: "WFS", isBaseLayer: false}),
            ...getItemsByAttributes({typ: "GeoJSON", isBaseLayer: false}),
            ...getItemsByAttributes({typ: "VectorBase", isBaseLayer: false}),
            ...getItemsByAttributes({typ: "OAF", isBaseLayer: false})
        ];

    setBboxGeometryToLayer(layerlist, bboxGeometry, app);
}

/**
 * sets the bbox geometry for targeted raw layers or exisiting vector layers
 * @param {Array} itemList - list of target raw layers
 * @param {GeometryCollection} bboxGeometry - target geometry to be set as bbox
 * @param {Vue} [app] - the calling component
 * @returns {void}
 */
function setBboxGeometryToLayer (itemList, bboxGeometry, app) {
    const
        modelList = getCollection(),
        crs = app?.$store.getters["Maps/projectionCode"] || "EPSG:25832";

    itemList.forEach(function (item) {
        const model = modelList.get({id: item.id});

        // layer already exists in the model list
        if (model) {
            let url = `${model.attributes.url}?service=WFS&version=${model.attributes.version}&request=GetFeature&typeName=${model.attributes.featureType}&srsName=${crs}`;

            url += bboxGeometry ? `&bbox=${bboxGeometry.getExtent().toString()},${crs}` : "";

            model.set("bboxGeometry", bboxGeometry);
            updateSource(model, bboxGeometry, url, item, app);
        }
        // for layers that are not yet in the model list
        else {
            item.bboxGeometry = bboxGeometry;
        }
    });
}

module.exports = {
    setBBoxToGeom,
    setBboxGeometryToLayer
};
