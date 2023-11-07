import {getComponent} from "../../../../src/utils/getComponent";
import {GeoJSON} from "ol/format";
import ScenarioNeighborhood from "../../ScenarioBuilder/classes/ScenarioNeighborhood";
import ScenarioFeature from "../../ScenarioBuilder/classes/ScenarioFeature";
import Scenario from "../../ScenarioBuilder/classes/Scenario";
import createStyle from "../../../../src/modules/tools/draw/utils/style/createStyle";

export default {
    /**
     * Parsing the state
     * @param {Object} map the map objects
     * @param {Object} state the state parameter
     * @param {Object} path the store paths
     * @param {Boolean} districtsSet if districts are set
     * @returns {void}
     */
    parseState (map, state, path = [], districtsSet = false) {
        for (const key in map) {
            if (
                Array.isArray(map[key]) &&
                Object.hasOwnProperty.call(state, key) &&
                map[key].every(e => typeof e === "string")
            ) {
                for (const attr of map[key]) {
                    // continue if prop doesn't exist on the save state
                    if (!Object.hasOwnProperty.call(state[key], attr)) {
                        continue;
                    }
                    let mutation = `${key}/set${attr[0].toUpperCase() + attr.substring(1)}`;

                    // add parent nodes for nested states
                    if (path.length > 0) {
                        mutation = path.join("/") + "/" + mutation;
                    }

                    switch (`${key}/${attr}`) {
                        case "ScenarioBuilder/scenarios":
                            this.$store.commit(mutation, this.parseScenarios(state[key][attr]));
                            break;
                        case "DistrictSelector/selectedDistrictNames":
                            this.$nextTick(async () => {
                                // hacky, wait for the districtStyle to be drawn
                                await this.$nextTick();
                                this.setDistrictsByName({
                                    districtNames: state[key][attr],
                                    zoomToExtent: false
                                });
                            });
                            break;
                        case "Maps/layerIds":
                            this.$nextTick(() => {
                                state[key][attr].forEach(layerId => this.getTopicsLayer(layerId));
                            });
                            break;
                        case "Maps/loadedLayers":
                            setTimeout(() => {
                                this.$nextTick(() => {
                                    state[key][attr].forEach(layerId => this.getTopicsLayer(layerId));
                                });
                            }, 500);
                            break;
                        case "Maps/view":
                            mapCollection.getMap("2D").setView(state[key][attr]);
                            break;
                        case "Maps/center":
                            mapCollection.getMapView("2D").setCenter(state[key][attr]);
                            break;
                        case "Maps/zoom":
                            mapCollection.getMapView("2D").setZoom(state[key][attr]);
                            break;
                        case "AreaSelector/geometry":
                            // hacky, wait for the districts to be selected
                            this.$nextTick(async () => {
                                await this.$nextTick();
                                this.commitState(mutation, attr, state[key][attr]);
                            });
                            break;
                        case "Draw/layer":
                            this.parseDrawFeatures(state, mutation, key, attr);
                            break;
                        case "Dashboard/statsFeatureFilter": {
                            /* eslint-disable max-depth */
                            if (!this.useTemplatesForMapping) {
                                this.commitState(mutation, attr, state[key][attr]);
                            }
                            break;
                        }
                        default:
                            this.commitState(mutation, attr, state[key][attr]);
                    }
                }
            }
            else if (map[key].constructor === Object) {
                state[key] = this.parseState(map[key], state[key], [...path, key], districtsSet);
            }
        }
    },

    /**
     * Parsing the state
     * @param {Object} mutation the mutation objects
     * @param {String} attr the attribute
     * @param {Object} state the state parameter
     * @param {Boolean} districtsSet if districts are set
     * @returns {void}
     */
    commitState (mutation, attr, state) {
        if (attr === "active") {
            if (state) {
                this.$store.commit(mutation, state);

                const key = mutation.replace("/setActive", "/id"),
                    model = getComponent(this.$store.getters[key]);

                if (model) {
                    model.set("isActive", state);
                }
            }
        }
        else {
            const _state = this.hasDeepFeatures(mutation, attr) ?
                this.deepParse(state) :
                this.parseFeatures(state);

            this.$store.commit(mutation, _state);
        }
    },

    /**
     * Parsing the state
     * @param {ol/Feature|ol/Feature[]} val the features
     * @returns {ol/Feature|ol/Feature[]} the parsed features
     */
    parseFeatures (val) {
        const parser = new GeoJSON();

        if (!Array.isArray(val)) {
            if (val?.constructor === Object && val?.properties?.isOlFeature) {
                return parser.readFeature(val);
            }
            if (val?.constructor === Object && val?.isOlGeometry) {
                return parser.readGeometry(val);
            }
            return val;
        }

        return val.map(el => {
            if (el?.constructor === Object && el?.properties?.isOlFeature) {
                return parser.readFeature(el);
            }
            return el;
        });
    },

    /**
     * Parsing the scenarios features
     * @param {Object} scenarios the scenarios of state
     * @returns {Object} the parsed scenarios
     */
    parseScenarios (scenarios) {
        const parser = new GeoJSON();

        return scenarios.map(scenario => this.parseScenario(scenario, parser));
    },

    /**
     * Parsing the scenario
     * @param {Object} scenario the scenarios of state
     * @param {Object} parser one GeoJSON layer
     * @returns {Object} the parsed scenario
     */
    parseScenario (scenario, parser) {
        const
            simulatedFeatures = scenario.simulatedFeatures.map(scenarioFeature => this.parseScenarioFeature(scenarioFeature, parser)),
            modifiedFeatures = scenario.modifiedFeatures.map(scenarioFeature => this.parseScenarioFeature(scenarioFeature, parser)),
            neighborhoods = scenario.neighborhoods.map(scenarioFeature => this.parseScenarioNeighborhood(scenarioFeature, parser)),
            _scenario = new Scenario(
                scenario.name,
                this.simGuideLayer,
                {
                    simulatedFeatures,
                    modifiedFeatures,
                    neighborhoods
                }
            );

        return _scenario;
    },

    /**
     * Parsing the scenario feature
     * @param {Object} scenarioFeature the scenario feature
     * @param {Object} parser the GeoJSON layer as parser
     * @returns {Object} the parsed scenario feature
     */
    parseScenarioFeature (scenarioFeature, parser) {
        const
            layer = this.getTopicsLayer(scenarioFeature.layer),
            feature = parser.readFeature(scenarioFeature.feature),
            scenarioData = scenarioFeature.scenarioData,
            originalData = scenarioFeature.feature.properties.originalData;

        // parse geom (original data)
        if (originalData) {
            if (originalData.geometry) {
                this.parseGeometry(originalData.geometry);
            }
            feature.set("originalData", originalData);
        }

        // parse geom (original data)
        if (scenarioData.geometry) {
            scenarioData.geometry = this.parseGeometry(scenarioData.geometry);
        }

        return new ScenarioFeature(feature, layer, undefined, scenarioData);
    },

    /**
     * Parsing scenario neighborhood
     * @param {Object} scenarioNeighborhood the scenario neighborhood
     * @param {Object} parser the GeoJSON layer as parser
     * @returns {Object} the serialized neighborhood
     */
    parseScenarioNeighborhood (scenarioNeighborhood, parser) {
        const feature = parser.readFeature(scenarioNeighborhood.feature);

        return new ScenarioNeighborhood(feature, this.simNeighborhoodLayer, this.districtLevels);
    },

    /**
     * Parsing the geometry
     * @param {String} type the geometry type
     * @param {Array} coordinates the coordinates
     * @returns {Object} the parsed geometry
     */
    parseGeometry ({type, coordinates}) {
        if (!type || !coordinates) {
            return undefined;
        }

        return new this.geomConstructors[type](coordinates);
    },

    /**
     * Parsing the drawn features
     * @param {Object} state the state parameter
     * @param {Object} mutation the mutation objects
     * @param {String} key the key in state
     * @param {String} attr the attribute
     * @returns {Object} the parsed drawn features
     */
    async parseDrawFeatures (state, mutation, key, attr) {
        /** @todo not tested!!! */
        this.$store.commit(mutation, await this.addNewLayerIfNotExists({layerName: this.$store.state.Tools.Draw.layerId}));
        this.$store.dispatch("Tools/Draw/clearLayer");
        const source = this.$store.state.Tools.Draw.layer.getSource();

        for (const feature of this.parseFeatures(state[key][attr])) {
            const drawState = feature.get("drawState"),
                styleSettings = {
                    color: drawState.color,
                    colorContour: drawState.colorContour,
                    font: drawState.font,
                    fontSize: drawState.fontSize,
                    strokeWidth: drawState.strokeWidth,
                    text: drawState.text
                };

            feature.setStyle(function (_feature) {
                if (_feature.get("isVisible")) {
                    return createStyle.createStyle(_feature.get("drawState"), styleSettings);
                }
                return undefined;
            });
            source.addFeature(feature);
        }
    },

    /**
     * Deep parse state
     * @param {Object} state the state parameter
     * @returns {Object} the parsed state
     */
    deepParse (state) {
        if (
            (state?.constructor === Object || Array.isArray(state)) &&
            !(state.properties?.isOlFeature || state.isOlGeometry)
        ) {
            for (const key in state) {
                state[key] = this.deepParse(state[key]);
            }

            return state;
        }
        return this.parseFeatures(state);
    }
};
