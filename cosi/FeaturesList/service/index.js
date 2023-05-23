import {transform} from "ol/proj";
import {fetchDistances} from "./fetchDistances";
import {findNearestFeatures} from "../../utils/features/findNearestFeatures";
import {getFeatureInfos} from "./getFeatureInfo";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {getConverter} from "../utils/converters";
import {getFlatCoordinates} from "../../utils/geometry/getFlatCoordinates";

/**
 * Transforms the coordinate of each feature from the source projection to the destination projection.
 * Returns a new array of coordinates and does not modify the original.
 * @param {ol/Feature[]} features - An array of features.
 * @param {String} source - The current projection as crs identifier string.
 * @param {String} destination - The desired projection as crs identifier string.
 * @returns {ol/coordinate[]} An array of coordinates([x, y]).
 */
function getTransformedCoordinates (features, source, destination = "EPSG:4326") {
    return features.map(feature => {
        const flatCoordinate = getFlatCoordinates(feature.getGeometry())[0];

        return transform(flatCoordinate, source, destination);
    });
}

/**
 *
 *
 * @param {module:ol/Feature} feature feature
 * @param {String} layerId layerId
 * @param {Number} initialBuffer initial buffer
 * @param {Number} bufferIncrement buffer increment
 * @param {String} portalCrs current CRS
 * @param {String} serviceId routing service
 * @param {String} fallbackId alternative routing service
 * @return {Number} score
 */
async function layerScore (feature, layerId, initialBuffer, bufferIncrement, portalCrs, serviceId, fallbackId) {
    const sourceCoordinates = getTransformedCoordinates([feature], portalCrs),
        features = await findNearestFeatures(layerId, feature, initialBuffer, bufferIncrement, 10, portalCrs),
        destinationCoordinates = getTransformedCoordinates(features, portalCrs),
        dists = (await fetchDistances(sourceCoordinates, destinationCoordinates, undefined, serviceId, fallbackId))[0];

    if (dists === null) {
        return null;
    }

    let mindist = Infinity,
        minFeature;


    for (let i = 0; i < dists.length; i++) {
        if (dists[i] !== null && dists[i] < mindist) {
            mindist = dists[i];
            minFeature = features[i];
        }
    }

    return {dist: mindist, feature: minFeature};
}

/**
 *
 * @param {*} feature feature
 * @param {*} layerIds layerIds
 * @param {*} weights weights
 * @return {*} score
 */
async function distanceScore ({getters, commit, rootGetters}, {feature, layers}) {
    let vsum = 0,
        wsum = 0;

    const ret = {
        facilities: {}
    };

    for (let j = 0; j < layers.length; j++) {
        const id = feature.getId().toString() + layers[j].layerId.toString();

        let mindist = getters.mindists[id];

        if (!mindist) {
            mindist = await layerScore(feature, layers[j].layerId, getters.initialBuffer, getters.bufferIncrement, rootGetters["Maps/projectionCode"], getters.serviceId, getters.fallbackServiceId);
            commit("setMindists", {...getters.mindists, [id]: mindist});
        }

        if (mindist === null) {
            return null;
        }

        if (mindist === Infinity) {
            continue;
        }

        // eslint-disable-next-line one-var
        const value = layers[j].weighting * mindist.dist;

        ret.facilities[layers[j].layerId] = {
            value,
            feature: mindist.feature,
            layerName: layers[j].id,
            featureName: mindist.feature.get(layers[j].keyOfAttrName),
            weighting: layers[j].weighting
        };

        vsum += value;
        wsum += layers[j].weighting;
    }

    ret.average = (vsum / wsum).toFixed(1);

    return ret;
}

/**
 *
 * @param {*} values values
 * @param {*} type type
 * @return {*} aggregate
 */
function aggregate (values, type) {
    if (!values || values.length === 0) {
        return null;
    }
    switch (type) {
        case "max":
        {
            let m = -Infinity;

            for (const v of values) {
                if (v > m) {
                    m = v;
                }
            }
            return m;
        }
        case "mean":
        {
            let m = 0;

            for (const v of values) {
                m += v;
            }
            return m / values.length;
        }
        default: {
            return null;
        }
    }
}

/**
 *
 * @param {*} feature feature
 * @param {*} layerIds layerIds
 * @param {*} weights weights
 * @return {*} score
 */
async function featureValues ({getters, rootGetters}, {feature, layerId}) {
    const layer = rawLayerList.getLayerWhere({id: layerId}),
        coord = feature.getGeometry().flatCoordinates.slice(0, 2),
        wmsAttrs = getters.wmsLayers.find(l => l.id === layerId),
        converter = getConverter(wmsAttrs.converter),
        infos = await getFeatureInfos(layer.url, layer.layers, coord, rootGetters["Maps/projectionCode"], wmsAttrs.resolution, wmsAttrs.featureCount);

    if (infos.length > 0) {
        return aggregate(infos.map(info => converter.convert(info.getProperties()[wmsAttrs.attribute])),
            wmsAttrs.aggregation);
    }
    return null;
}

const id = "DistanceScoreService",
    actions = {
        async getDistanceScore (store, params) {
            return distanceScore(store, params);
        },
        async getFeatureValues (store, params) {
            return featureValues(store, params);
        }
    },
    store = {
        namespaced: true,
        state: {
            active: false,
            id,
            mindists: {},
            useUserExtent: false,
            initialBuffer: 5000,
            bufferIncrement: 10000,
            wmsLayers: [
                {
                    id: "95",
                    name: "Straßenlärm 2017",
                    attribute: "klasse",
                    resolution: 26,
                    featureCount: 10,
                    converter: "DbRangeConverter",
                    aggregation: "max"
                }
            ],
            serviceId: "bkg_ors",
            fallbackServiceId: "csl_ors"
        },
        getters: {
            mindists: s => {
                return s.mindists;
            },
            useUserExtent: s => {
                return s.useUserExtent;
            },
            initialBuffer: s => {
                return s.initialBuffer;
            },
            bufferIncrement: s => {
                return s.bufferIncrement;
            },
            wmsLayers: s => {
                return s.wmsLayers;
            },
            wmsLayersInfo: s => {
                return s.wmsLayers; // .map(l => ({id: l.id, name: getLayerWhere({id: l.id}).name}));
            },
            serviceId: s => {
                return s.serviceId;
            },
            fallbackServiceId: s => {
                return s.fallbackServiceId;
            }
        },
        mutations: {
            setMindists: (moduleState, payload) => {
                moduleState.mindists = payload;
            }
        },
        actions,
        computed: {
            // ...mapState(["configJson"])
        }
    };

export default {
    component: {
        name: id,
        render () {
            return null;
        }
    },
    store
};
