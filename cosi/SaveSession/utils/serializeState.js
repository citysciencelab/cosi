import {GeoJSON} from "ol/format";
import Feature from "ol/Feature";
import {Point, Polygon, MultiPoint, MultiPolygon, Geometry} from "ol/geom";
import isObject from "../../../../src/utils/isObject";

/**
 * Serialize the state
 * @param {Object} storePaths the store paths
 * @param {Object} store the store parameter
 * @param {Object} deepFeatures the feature with deep parameters
 * @returns {Object} the serialized state
 */
function serializeState (storePaths, store, deepFeatures) {
    const state = deepCopyState(storePaths, store.state, deepFeatures);

    serializeView(state, store);
    serializeScenarios(state);
    serializeDrawFeatures(state);

    return state;
}

/**
 * Deep copying the state
 * @param {Object} map the map objects
 * @param {Object} store the store parameter
 * @param {Object} deepFeatures the feature with deep parameters
 * @returns {Object} the deep copied state
 */
function deepCopyState (map, store, deepFeatures) {
    const state = {};

    for (const key in map) {
        if (
            Array.isArray(map[key]) &&
                map[key].every(e => typeof e === "string")
        ) {
            state[key] = {};
            for (const attr of map[key]) {
                const val = hasDeepFeatures(key, attr, deepFeatures) ?
                    serializeToolDatasets(store[key][attr]) :
                    serializeFeatures(store[key][attr]);

                state[key][attr] = val;
            }
        }
        else if (isObject(map[key])) {
            state[key] = deepCopyState(map[key], store[key], deepFeatures);
        }
    }

    return state;
}

/**
 * Deep serializes state
 * @param {Object} state the state parameter
 * @returns {Object} the serialized state
 */
function deepSerialize (state) {
    let _state;

    if (isObject(state)) {
        _state = {...state};

        for (const key in _state) {
            _state[key] = deepSerialize(_state[key]);
        }

        return _state;
    }
    else if (Array.isArray(state)) {
        _state = [...state];

        for (const i in state) {
            _state[i] = deepSerialize(_state[i]);
        }

        return _state;
    }

    return serializeFeatures(state);
}

/**
 * Serialized features
 * @param {module:ol/Feature[]|module:ol/Feature} val the parameter as feature or features
 * @returns {Object} the serialized features
 */
function serializeFeatures (val) {
    const parser = new GeoJSON();
    let res;

    if (!Array.isArray(val)) {
        if (val instanceof Feature) {
            res = parser.writeFeatureObject(val);

            res.properties.isOlFeature = true;
        }
        else if ([Point, MultiPoint, Polygon, MultiPolygon].includes(val?.constructor)) {
            res = parser.writeGeometryObject(val);
            res.isOlGeometry = val.getType();
        }
        else {
            res = val;
        }
    }
    else {
        res = [];

        for (let i = 0; i < val.length; i++) {
            if (val[i] instanceof Feature) {
                const geojson = parser.writeFeatureObject(val[i]);

                geojson.properties.isOlFeature = true;
                res.push(geojson);
            }
            else {
                res.push(val[i]);
            }
        }
    }

    return res;
}

/**
 * Serialized features
 * @param {Object} state the state parameter
 * @returns {void}
 */
function serializeScenarios (state) {
    const parser = new GeoJSON();

    state.Tools.ScenarioBuilder.scenarios =
            state.Tools.ScenarioBuilder.scenarios.map(
                scenario => serializeScenario(scenario, parser)
            );
}

/**
 * Serialized features
 * @param {Object} scenario the scenario of state
 * @param {Object} parser the Geojson format
 * @returns {Object} the serialized scenario
 */
function serializeScenario (scenario, parser) {
    const simulatedFeatures = scenario.getSimulatedFeatures().map(
            scenarioFeature => serializeScenarioFeature(scenarioFeature, parser)
        ),
        modifiedFeatures = scenario.getModifiedFeatures().map(
            scenarioFeature => serializeScenarioFeature(scenarioFeature, parser, true)
        ),
        neighborhoods = scenario.getNeighborhoods().map(
            scenarioNeighborhood => serializeNeighborhood(scenarioNeighborhood, parser)
        );

    return {
        ...scenario,
        guideLayer: null,
        isActive: false,
        simulatedFeatures,
        modifiedFeatures,
        neighborhoods
    };
}

/**
 * Serializes scenario feature
 * @param {Object} scenarioFeature the scenario feature
 * @param {Object} parser the Geojson format
 * @param {Boolean} revertToOriginalData to decide if it is reverted to original data
 * @returns {Object} the serialized scenario feature
 */
function serializeScenarioFeature (scenarioFeature, parser, revertToOriginalData = false) {
    const feature = parser.writeFeatureObject(scenarioFeature.feature);

    // serialize original data (copy object)
    if (feature.properties.originalData) {
        feature.properties.originalData = {...feature.properties.originalData};
    }

    // serialize geometry (original data)
    if (feature.properties.originalData?.geometry) {
        feature.properties.originalData.geometry = serializeGeometry(feature.properties.originalData.geometry);
    }

    // serialize geometry (scenario data)
    if (scenarioFeature.scenarioData.geometry) {
        scenarioFeature.scenarioData.geometry = serializeGeometry(scenarioFeature.scenarioData.geometry);
    }

    if (revertToOriginalData) {
        feature.geometry = feature.properties.originalData?.geometry || feature.geometry;
        feature.properties = {
            ...feature.properties,
            ...feature.properties.originalData || {}
        };
    }

    // delete original Data if necessary
    if (Object.hasOwnProperty.call(feature.properties, "originalData")) {
        delete feature.properties.originalData;
    }

    // remove redundant geometries
    for (const key in feature.properties) {
        if (feature.properties[key] instanceof Geometry) {
            delete feature.properties[key];
        }
    }

    return {
        ...scenarioFeature,
        guideLayer: null,
        scenario: null,
        eventKeys: null,
        feature: feature,
        layer: scenarioFeature.layer.get("id")
    };
}

/**
 * Serializes scenario feature
 * @param {Object} scenarioNeighborhood the scenario neighborhood
 * @param {Object} parser the Geojson format
 * @returns {Object} the serialized neighborhood
 */
function serializeNeighborhood (scenarioNeighborhood, parser) {
    if (!scenarioNeighborhood?.feature || typeof parser?.writeFeatureObject !== "function") {
        return {};
    }

    return {
        feature: parser.writeFeatureObject(scenarioNeighborhood.feature)
    };
}

/**
 * Serializes the geometry
 * @param {ol.geom.Geometry} geom the scenario neighborhood
 * @returns {Object} the serialized geometry
 */
function serializeGeometry (geom) {
    if (typeof geom.getType !== "function" || typeof geom.getCoordinates !== "function") {
        return {};
    }
    const
        type = geom.getType(),
        coordinates = geom.getCoordinates();

    return {
        type, coordinates
    };
}

/**
 * Serializes drawn features
 * @param {Object} state the state parameter
 * @returns {void}
 */
function serializeDrawFeatures (state) {
    state.Tools.Draw.layer = serializeFeatures(state.Tools.Draw.layer?.getSource().getFeatures() || []);
}

/**
 * Serializes tool datasets
 * @param {Object} state the state parameter
 * @returns {Object} deep serialized state
 */
function serializeToolDatasets (state) {
    return deepSerialize(state);
}

/**
 * Serializes view
 * @param {Object} state the state parameter
 * @param {Object} store the store parameter
 * @returns {void}
 */
function serializeView (state, store) {
    state.Maps.view = store.getters["Maps/getView"];
}

/**
 * Check if has deep features
 * @param {String} key the key to check
 * @param {String} attr the attribute
 * @param {Object} deepFeatures the deep features
 * @returns {Boolean|undefined} true if it has deep features
 */
function hasDeepFeatures (key, attr, deepFeatures) {
    const tool = Object.keys(deepFeatures).find(id => key.includes(id));

    return deepFeatures[tool]?.includes(attr);
}

export {
    serializeState,
    deepCopyState,
    deepSerialize,
    serializeFeatures,
    serializeScenario,
    serializeToolDatasets,
    serializeScenarioFeature,
    serializeNeighborhood,
    serializeGeometry,
    hasDeepFeatures
};
