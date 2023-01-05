<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import AnalysisPagination from "../../components/AnalysisPagination.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersAccessibilityAnalysis";
import mutations from "../store/mutationsAccessibilityAnalysis";
import methods from "./methodsAnalysis";
import * as Proj from "ol/proj.js";
import deepEqual from "deep-equal";
import {exportAsGeoJson, downloadGeoJson} from "../utils/exportResults";
import {Select} from "ol/interaction";
import ToolInfo from "../../components/ToolInfo.vue";
import travelTimeIndex from "../assets/inrix_traveltimeindex_2021.json";
import {onSearchbar, offSearchbar, getServiceUrl, onShowFeaturesById, onShowAllFeatures, onFeaturesLoaded, getModelByAttributes} from "../../utils/radioBridge.js";
import mapCollection from "../../../../src/core/maps/mapCollection";
import mapCanvasToImage, {exportMapView} from "../../utils/mapCanvasToImage";

export default {
    name: "AccessibilityAnalysis",
    components: {
        Tool,
        ToolInfo,
        AnalysisPagination
    },
    data () {
        return {
            travelTimeIndex,
            facilityNames: [],
            mapLayer: null,
            directionsLayer: null,
            toolName: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.title"),
            transportTypes: [
                {
                    type: "",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.clear")
                },
                {
                    type: "driving-car",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.driving-car")
                },
                {
                    type: "cycling-regular",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.cycling-regular")
                },
                // {
                //     type: "cycling-electric",
                //     name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.cycling-electric")
                // },
                {
                    type: "foot-walking",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.foot-walking")
                },
                {
                    type: "wheelchair",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes.wheelchair")
                }
            ],
            scaleUnits: [
                {
                    type: "",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.scaleUnits.clear")
                },
                {
                    type: "time",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.scaleUnits.time")
                },
                {
                    type: "distance",
                    name: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.scaleUnits.distance")
                }
            ],
            layers: null,
            legendColors: [
                "rgba(0, 240, 3, 0.6)",
                "rgba(200, 200, 3, 0.6)",
                "rgba(240, 0, 3, 0.6)",
                "rgba(180, 165, 165, 0.8)"
            ],
            featureColors: [
                "rgba(240, 0, 3, 0.2)",
                "rgba(200, 200, 3, 0.2)",
                "rgba(0, 240, 3, 0.2)"
            ],
            refFeatureStyle: {
                fill: {
                    color: "rgba(255, 255, 255, 0)"
                },
                stroke: {
                    color: "rgba(100, 80, 80, 1)",
                    width: 2,
                    lineDash: [10, 8]
                }
            },
            askUpdate: false,
            abortController: null,
            currentCoordinates: null,
            select: null,
            hide: false
            // map: undefined
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/AccessibilityAnalysis", Object.keys(getters)),
        ...mapGetters("Tools/AccessibilityAnalysisService", ["progress"]),
        ...mapGetters("Maps", ["projectionCode"]),
        ...mapGetters("MapMarker", ["markerPoint", "markerPolygon"]),
        ...mapGetters("Tools/DistrictSelector", ["boundingGeometry"]),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList", "isFeatureActive"]),
        ...mapGetters("Tools/AreaSelector", {areaSelectorGeom: "geometry"}),
        ...mapGetters("Tools/SelectionManager", ["activeSelection"]),
        ...mapGetters("Tools/ScenarioBuilder", ["scenarioUpdated"]),
        ...mapGetters("Tools/Routing/Directions", ["directionsRouteSource", "directionsRouteLayer", "routingDirections"]),
        ...mapGetters("Tools/Routing", {routingActive: "active", activeRoutingToolOption: "activeRoutingToolOption"}),
        _mode: {
            get () {
                return this.mode;
            },
            set (v) {
                this.setMode(v);
            }
        },
        _coordinate: {
            get () {
                return this.coordinate;
            },
            set (v) {
                this.setCoordinate(v);
            }
        },
        _selectedFacilityName: {
            get () {
                return this.selectedFacilityName;
            },
            set (v) {
                this.setSelectedFacilityName(v);
            }
        },
        _setByFeature: {
            get () {
                return this.setByFeature;
            },
            set (v) {
                this.setSetByFeature(v);
            }
        },
        _transportType: {
            get () {
                return this.transportType;
            },
            set (v) {
                this.setTransportType(v);
            }
        },
        _scaleUnit: {
            get () {
                return this.scaleUnit;
            },
            set (v) {
                this.setScaleUnit(v);
            }
        },
        _distance: {
            get () {
                return this.distance;
            },
            set (v) {
                this.setDistance(v);
            }
        },
        _selectedDirections: {
            get () {
                return this.selectedDirections;
            },
            set (v) {
                this.setSelectedDirections(v);
            }
        },
        _time: {
            get () {
                return this.time;
            },
            set (v) {
                this.setTime(v);
            }
        },
        _useTravelTimeIndex: {
            get () {
                return this.useTravelTimeIndex;
            },
            set (v) {
                this.setUseTravelTimeIndex(v);
            }
        },
        _isochroneFeatures: {
            get () {
                return this.isochroneFeatures;
            },
            set (v) {
                this.setIsochroneFeatures(v);
            }
        },
        _steps: {
            get () {
                return this.steps;
            },
            set (v) {
                this.setSteps(v);
            }
        }
    },
    watch: {
        active () {
            if (this.active) {
                mapCollection.getMap("2D").on("click", this.setCoordinateFromClick);
                onSearchbar(this.setSearchResultToOrigin);

                if (this.mode === "path") {
                    this.addLayer(this.directionsLayer);
                }
            }
            else {
                mapCollection.getMap("2D").un("click", this.setCoordinateFromClick);
                offSearchbar(this.setSearchResultToOrigin);
                this.removePointMarker();
                this.select.getFeatures().clear();
                this.removeLayerFromMap(this.directionsLayer);
            }
        },
        activeSet (newValue) {
            if (!this.dataSets[newValue]) {
                return;
            }

            for (const key in this.dataSets[newValue].inputs) {
                this[key] = this.dataSets[newValue].inputs[key];
            }

            if (this.dataSets[newValue].inputs._mode === "point") {
                const icoord = Proj.transform(this.dataSets[newValue].inputs._coordinate[0], "EPSG:4326", this.projectionCode);

                this.placingPointMarker(icoord);
            }
            else {
                this.removePointMarker();
            }

            this._isochroneFeatures = this.dataSets[newValue].results;
            this.renderIsochrones(this._isochroneFeatures);
            this.hide = false;
        },
        async scenarioUpdated () {
            await this.$nextTick();
            this.tryUpdateIsochrones();
        },
        mode () {
            this.setSetByFeature(false);

            if (this.mode === "region" && this.activeSelection === null) {
                this.resetIsochroneBBox();
            }

            if (this.mode === "path") {
                this._scaleUnit = "distance";
                this._transportType = "foot-walking";
                this.addLayer(this.directionsLayer);
            }
            else {
                this.removeLayerFromMap(this.directionsLayer);

                if (!this.setByFeature) {
                    this.removeInteraction(this.select);
                    this.select.un("select", this.pickDirections.bind(this));
                }
            }
        },
        clickCoordinate (coord) {
            this.placingPointMarker(coord);
        },
        setByFeature (val) {
            if (val && this.mode === "point") {
                this.addInteraction(this.select);
            }
            else {
                if (this.select?.getFeatures().getLength() > 0) {
                    this.select.getFeatures().removeAt(0);
                }
                this.removeInteraction(this.select);
            }
        },
        activeVectorLayerList (newValues) {
            this.setFacilityLayers(newValues);
        },
        routingDirections () {
            this._selectedDirections = this.routingDirections;

            if (this.mode === "path" && this.isochroneFeatures.length > 0) {
                this.askUpdate = true;
            }
        },
        // This watcher makes the addon compatible with toolBridge (see toolbridge docs).
        // The watcher receives a request
        // It has three steps: 1. update interface based on the received settings, 2. run this addon's analysis, 3. send the results back to toolBridge
        toolBridgeIn (newRequest) {
            /**
             * 1. update the interface based on the settings received from toolBridge
             * @param {Object} request the toolBridge request {id:..., settings:{...}}
             * @returns {Object} (run for side effects only, passes along the request)
             */
            const updateInterface = (request) => {
                    this._mode = request.settings.mode;
                    this._coordinate = request.settings.coordinate;
                    this._selectedFacilityName = request.settings.selectedFacilityName;
                    this._selectedDirections = request.settings.selectedDirections;
                    this._transportType = request.settings.transportType;
                    this._scaleUnit = request.settings.scaleUnit;
                    this._distance = request.settings.distance;
                    this._timefi = request.settings.time;
                    this._useTravelTimeIndex = request.settings.useTravelTimeIndex;
                    this._setByFeature = request.settings.setByFeature;
                    this._steps = request.settings.steps;
                    return request; // (we care about the side effects only)
                },
                /**
                * 2. run the specific analysis of this addon
                * @returns {String} imgDataUrl the map canvas as image
                */
                runTool = async () => {
                    await this.createAnalysisSet();

                    return mapCanvasToImage();
                },

                //
                /**
                * 3. hand the results back to toolBridge, in the form of: {request: ..., type: ..., result: ...}
                * @param {String} imgDataUrl the map canvas as image
                * @returns {Object} null (runs for side effects only)
                */
                returnResults = (imgDataUrl) => {
                // (todo mb: should this maybe be a toolbridge action? could simplify creating the bridge)
                    return this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
                        {
                            // result: this.dataSets[this.activeSet].geojson,
                            result: imgDataUrl,
                            type: "image", // see toolBridge docs for supported output types
                            request: newRequest // we need to give back the original request as well
                        }
                    );
                };

            // Run the three steps, making sure they happen synchronously (so we don't try to return results before analysis is finished)
            updateInterface(newRequest);
            runTool().then(returnResults);
            return null; // we care about the side effects only.
        },
        hide: "hideResults"
    },
    /**
    * @returns {void}
    */
    created () {
        this.$on("close", this.close);
        this.select = new Select({
            filter: (feature, layer) => this.activeVectorLayerList.includes(layer)
        });

        this.baseUrl = getServiceUrl("bkg_ors") + "/v2/";
        // this.map = mapCollection.getMap("2D");
    },

    /**
   * Put initialize here if mounting occurs after config parsing
    * @returns {void}
   */
    async mounted () {
        this.applyTranslationKey(this.name);

        this.mapLayer = await this.addNewLayerIfNotExists({layerName: "accessibility-analysis"});
        this.mapLayer.setVisible(true);
        this.mapLayer.setZIndex(10);

        this.directionsLayer = await this.addNewLayerIfNotExists({layerName: "accessibility-directions"});
        this.directionsLayer.setZIndex(10);
        this.directionsLayer.setStyle(this.directionsRouteLayer.getStyleFunction());
        this.directionsLayer.setSource(this.directionsRouteSource);
        this.removeLayerFromMap(this.directionsLayer);

        onSearchbar(this.setSearchResultToOrigin);
        onShowFeaturesById(this.tryUpdateIsochrones);
        onShowAllFeatures(this.tryUpdateIsochrones);
        onFeaturesLoaded(this.tryUpdateIsochrones);
    },
    methods: {
        ...mapMutations("Tools/AccessibilityAnalysis", Object.keys(mutations)),
        ...mapActions("Tools/AccessibilityAnalysisService", ["getIsochrones"]),
        ...mapActions("Tools/SelectionManager", ["addNewSelection"]),
        ...mapActions("Maps", ["setCenter", "removeInteraction", "addInteraction", "addLayer", "registerListener", "unregisterListener"]),
        ...mapMutations("Maps", ["removeLayerFromMap"]),
        ...mapActions("MapMarker", ["placingPointMarker", "removePointMarker"]),
        ...mapActions("GraphicalSelect", ["featureToGeoJson"]),
        ...mapActions("Maps", ["addNewLayerIfNotExists"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        ...methods,

        downloadMap () {
            exportMapView("Erreichbarkeitsanalyse_CoSI");
        },
        tryUpdateIsochrones () {
            if (this.mode === "region" && this.currentCoordinates && this.dataSets.length > 0) {
                const newCoordinates = this.getCoordinates(this.setByFeature);

                if (!deepEqual(this.currentCoordinates.map(e=>[e[0], e[1]]), newCoordinates)) {
                    this.askUpdate = true;
                }
            }
        },

        resetMarkerAndZoom () {
            const icoord = Proj.transform(this.coordinate[0], "EPSG:4326", this.projectionCode);

            this.placingPointMarker(icoord);
            this.setCenter(icoord);
        },

        /**
        * Closes this tool window by setting active to false
        * @returns {void}
        */
        close () {
            this.setActive(false);

            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({
                id: this.$store.state.Tools.AccessibilityAnalysis.id
            });

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
        * set facilityNames in model, trigger renderDropDownView
        * @param {Object} vectorLayers layer models of updated selected layer
        * @returns {void}
        */
        setFacilityLayers: function (vectorLayers) {
            this.facilityNames = vectorLayers.map(v => v.get("name"));
        },

        getDirectionsText: function (routingDirections) {
            return `Route - ${routingDirections.distance} m, ${(routingDirections.duration / 60).toFixed(1)} min`;
        },
        /**
        * closes this component and opens requestInhabitants component and executes makeRequest with the calculated geoJSON of this component
        * @returns {void}
        */
        requestInhabitants: async function () {
            this.close();
            await this.$nextTick();
            this.$root.$emit("populationRequest", this.rawGeoJson);
        },
        createAnalysisSet: async function () {
            this.hide = false;

            const analysisSet = {
                inputs: {},
                results: [],
                geojson: {}
            };

            await this.createIsochrones();

            analysisSet.results = this._isochroneFeatures;
            analysisSet.inputs = {
                _mode: JSON.parse(JSON.stringify(this._mode)),
                _coordinate: JSON.parse(JSON.stringify(this._coordinate)),
                _selectedFacilityName: JSON.parse(JSON.stringify(this._selectedFacilityName)),
                _selectedDirections: JSON.parse(JSON.stringify(this._selectedDirections)),
                _transportType: JSON.parse(JSON.stringify(this._transportType)),
                _scaleUnit: JSON.parse(JSON.stringify(this._scaleUnit)),
                _distance: JSON.parse(JSON.stringify(this._distance)),
                _time: JSON.parse(JSON.stringify(this._time)),
                _useTravelTimeIndex: JSON.parse(JSON.stringify(this._useTravelTimeIndex)),
                _setByFeature: JSON.parse(JSON.stringify(this._setByFeature)),
                _steps: JSON.parse(JSON.stringify(this._steps))
            };

            this.dataSets.push(analysisSet);
            this.setActiveSet(this.dataSets.length - 1);

            if (this.dataSets.length === 1) {
                this.renderIsochrones(this._isochroneFeatures);
            }

            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.mapLayer);
            this.addNewSelection({selection: analysisSet.results, source: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.title"), id: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes." + this._transportType) + ", " + this.$t("additional:modules.tools.cosi.accessibilityAnalysis.scaleUnits." + this._scaleUnit) + ", [...]"});
        },
        exportAsGeoJson,
        // pagination features
        removeSet (index) {
            if (this.activeSet === this.dataSets.length - 1) {
                this.setActiveSet(this.activeSet - 1);
            }

            this.dataSets.splice(index, 1);

            if (this.dataSets.length === 0) {
                this.removeAll();
            }

        },
        removeAll () {
            this.setDataSets([]);
            this.clear();
            this.mapLayer.getSource().clear();
            this.resetIsochroneBBox();
            this.removePointMarker();
            this.removeLayerFromMap(this.directionsLayer);
        },
        downloadSet (index) {
            downloadGeoJson(this.dataSets[index].geojson);
        },
        downloadAll () {
            this.dataSets.forEach(set => {
                downloadGeoJson(set.geojson);
            });
        },
        /**
         * @description Selects the next or the previous supply analysis in the Tool Window.
         * @param {Integer} value +1 or -1.
         * @returns {Void} Function returns nothing.
         */
        setPrevNext (value) {
            const l = this.dataSets.length;

            this.setActiveSet((((this.activeSet + value) % l) + l) % l); // modulo with negative handling
        },

        async updateAnalysisSet () {
            await this.createIsochrones();

            this.dataSets[this.activeSet].results = this._isochroneFeatures;
            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.mapLayer);

            this.renderIsochrones(this._isochroneFeatures);
        }
    }
};
</script>

<template lang="html">
    <div id="toolWrap">
        <Tool
            :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.title')"
            :icon="icon"
            :active="active"
            :render-to-window="renderToWindow"
            :resizable-window="resizableWindow"
            :deactivate-gfi="deactivateGFI"
        >
            <template #toolBody>
                <v-app>
                    <ToolInfo
                        :url="readmeUrl"
                        :locale="currentLocale"
                    />
                    <div
                        v-if="active"
                        id="accessibilityanalysis"
                    >
                        <v-form>
                            <v-select
                                ref="mode"
                                v-model="_mode"
                                :items="availableModes"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.dropdownInfo')"
                                item-text="text"
                                item-value="type"
                                outlined
                                dense
                                @click:append="$refs.mode.blur()"
                            />
                            <v-text-field
                                v-if="mode === 'point'"
                                id="coordinate"
                                v-model="_coordinate"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.pointOfReference')"
                                type="text"
                                min="0"
                                readonly
                                outlined
                                dense
                            />
                            <v-select
                                v-if="mode === 'region'"
                                v-model="_selectedFacilityName"
                                placeholder="Keine Auswahl"
                                :items="facilityNames"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.topic')"
                                outlined
                                dense
                            />
                            <v-select
                                v-if="mode === 'path'"
                                v-model="_selectedDirections"
                                placeholder="Keine Auswahl"
                                :item-text="getDirectionsText"
                                return-object
                                :items="[routingDirections || {distance: '-', duration: '-'}]"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.directions')"
                                outlined
                                dense
                                readonly
                            />
                            <v-select
                                v-model="_transportType"
                                title="Verkehrsmittel"
                                :items="transportTypes"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.transportType')"
                                item-text="name"
                                item-value="type"
                                outlined
                                dense
                                :disabled="mode === 'path'"
                            />
                            <v-select
                                v-model="_scaleUnit"
                                title="Maßeinheit der Entfernung"
                                :items="scaleUnits"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.scaleUnit')"
                                item-text="name"
                                item-value="type"
                                outlined
                                dense
                                :disabled="mode === 'path'"
                            />
                            <v-text-field
                                id="range"
                                v-model="_distance"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.distance')"
                                type="number"
                                min="0"
                                outlined
                                dense
                            />
                            <div class="travel-time-index">
                                <v-icon
                                    small
                                    @click="addSingleAlert({
                                        category: 'Info',
                                        displayClass: 'info',
                                        content: $t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.help')
                                    })"
                                >
                                    mdi-help-circle-outline
                                </v-icon>
                                <v-slider
                                    v-model="_time"
                                    class="time-slider"
                                    :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.time')"
                                    :hint="`${(travelTimeIndex[_time] / Math.min(...Object.values(travelTimeIndex))).toFixed(2)} ${$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.title')}`"
                                    :disabled="!useTravelTimeIndex || transportType !== 'driving-car' || scaleUnit !== 'time'"
                                    :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.tooltip')"
                                    step="1"
                                    ticks="always"
                                    tick-size="4"
                                    min="0"
                                    max="23"
                                    dense
                                    hide-details="auto"
                                >
                                    <template #append>
                                        <!-- eslint-disable-next-line vue/no-multiple-template-root -->
                                        <div class="append-text-field">
                                            {{ _time }}:00
                                            <v-icon small>
                                                mdi-clock
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-slider>
                            </div>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-checkbox
                                        v-model="_useTravelTimeIndex"
                                        dense
                                        hide-details
                                        :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.toggle')"
                                        :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.tooltip')"
                                        :disabled="transportType !== 'driving-car' || scaleUnit !== 'time'"
                                    />
                                    <v-checkbox
                                        v-model="_setByFeature"
                                        dense
                                        hide-details
                                        :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeature')"
                                        :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeatureInfo')"
                                        :disabled="mode === 'path'"
                                    />
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-btn
                                        id="create-isochrones"
                                        dense
                                        small
                                        tile
                                        color="grey lighten-1"
                                        @click.native="createAnalysisSet()"
                                    >
                                        {{ $t("additional:modules.tools.cosi.accessibilityAnalysis.calculate") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row
                                v-if="isochroneFeatures.length > 0"
                                dense
                            >
                                <v-col cols="12">
                                    <v-btn
                                        id="clear"
                                        dense
                                        small
                                        tile
                                        :color="hide ? 'warning' : 'grey lighten-1'"
                                        @click.native="hide = !hide"
                                    >
                                        {{ $t('additional:modules.tools.cosi.accessibilityAnalysis.clear') }}
                                    </v-btn>
                                    <v-btn
                                        v-if="mode === 'point'"
                                        dense
                                        small
                                        tile
                                        color="grey lighten-1"
                                        @click="requestInhabitants"
                                    >
                                        {{ $t('additional:modules.tools.cosi.accessibilityAnalysis.requestInhabitants') }}
                                    </v-btn>
                                    <v-icon
                                        v-if="isochroneFeatures.length > 0 && steps.length === 4"
                                        :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.warning')"
                                    >
                                        mdi-alert
                                    </v-icon>
                                </v-col>
                            </v-row>
                        </v-form>
                        <hr>
                        <v-row dense>
                            <v-col cols="6">
                                <h5 id="legend-header">
                                    <strong>{{ $t("additional:modules.tools.cosi.accessibilityAnalysis.legend") }}</strong>
                                </h5>
                                <div id="legend">
                                    <span
                                        v-for="(j, i) in _steps"
                                        :key="i"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                        >
                                            <circle
                                                cx="7.5"
                                                cy="7.5"
                                                r="7.5"
                                                :style="`fill: ${
                                                    legendColors[i]
                                                }; stroke-width: 0.5; stroke: #e3e3e3;`"
                                            />
                                        </svg>
                                        <span :key="i * 2 + _steps.length">
                                            {{ j }}
                                        </span>
                                    </span>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <AnalysisPagination
                                    v-if="dataSets.length > 0"
                                    :sets="dataSets"
                                    :active-set="activeSet"
                                    :downloads="['GEOJSON']"
                                    :titles="{
                                        downloads: [$t('additional:modules.tools.cosi.accessibilityAnalysis.download.title')],
                                        downloadAll: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationDownloadAll'),
                                        remove: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationRemove'),
                                        removeAll: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationRemoveAll'),
                                        next: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationNext'),
                                        prev: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationPrev'),
                                    }"
                                    @setActiveSet="(n) => setActiveSet(n)"
                                    @setPrevNext="(n) => setPrevNext(n)"
                                    @removeSingle="(n) => removeSet(n)"
                                    @removeAll="removeAll"
                                    @downloadGEOJSON="(n) => downloadSet(n)"
                                    @downloadAll="downloadAll"
                                />
                            </v-col>
                        </v-row>
                        <v-progress-linear
                            v-if="progress > 0"
                            v-model="progress"
                            background-color="white"
                        />
                    </div>
                </v-app>
            </template>
        </Tool>
        <v-app>
            <v-snackbar
                v-model="askUpdate"
                color="white"
                :timeout="-1"
            >
                <span class="snackbar-text">
                    {{ $t("additional:modules.tools.cosi.accessibilityAnalysis.askUpdate") }}
                </span>
                <template #action="{ attrs }">
                    <v-btn
                        color="black"
                        text
                        v-bind="attrs"
                        @click.native="updateAnalysisSet"
                    >
                        Ok
                    </v-btn>
                    <v-btn
                        color="black"
                        text
                        v-bind="attrs"
                        @click="askUpdate = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
        </v-app>
    </div>
</template>

<style lang="scss">
#accessibilityanalysis {
  width: 400px;
  min-height: 100px;

  .inline-switch {
    margin-top: 0px;
    height: 40px;
  }

  #legend-header {
      margin-top: 0;
  }

  #download {
      margin-top: 8px;
  }
}

.snackbar-text{
    color: black
}

.append-text-field {
    width: 70px;
    text-align: right;
}

.travel-time-index {
    display: flex;
    position: relative;
    align-items: baseline;
    justify-content: space-between;
    .time-slider {
        margin-left: 10px;
    }
}

</style>
