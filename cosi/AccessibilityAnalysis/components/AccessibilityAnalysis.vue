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
import mapCanvasToImage, {exportMapView} from "../../utils/mapCanvasToImage";
import AccessibilityAnalysisLegend from "./AccessibilityAnalysisLegend.vue";
import AccessibilityAnalysisTrafficFlow from "./AccessibilityAnalysisTrafficFlow.vue";
import {unpackCluster} from "../../utils/features/unpackCluster.js";
import EditForReportTemplate from "../../components/EditForReportTemplate.vue";
export default {
    name: "AccessibilityAnalysis",
    components: {
        Tool,
        ToolInfo,
        AnalysisPagination,
        AccessibilityAnalysisLegend,
        AccessibilityAnalysisTrafficFlow,
        EditForReportTemplate
    },
    data () {
        this.availableModes = [
            {
                type: "point",
                text: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.mode.point")
            },
            {
                type: "facility",
                text: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.mode.facility")
            },
            {
                type: "region",
                text: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.mode.region")
            },
            {
                type: "path",
                text: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.mode.path")
            }
        ];
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
            legendColors: [
                "rgba(0, 240, 3, 0.6)",
                "rgba(200, 200, 3, 0.6)",
                "rgba(240, 0, 3, 0.6)",
                "rgba(180, 165, 165, 0.8)"
            ],
            askUpdate: false,
            abortController: null,
            currentCoordinates: null,
            hide: false,
            facilityFeature: null
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/AccessibilityAnalysis", Object.keys(getters)),
        ...mapGetters("Tools/AccessibilityAnalysisService", ["progress"]),
        ...mapGetters("Maps", ["projectionCode", "clickCoordinate", "getVisibleLayerList"]),
        ...mapGetters("MapMarker", ["markerPoint", "markerPolygon"]),
        ...mapGetters("Tools/DistrictSelector", ["boundingGeometry"]),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList", "isFeatureActive", "layerMapById"]),
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
        _selectedFacilityNames: {
            get () {
                return this.selectedFacilityNames;
            },
            set (v) {
                this.setSelectedFacilityNames(v);
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
        _isochroneFeatures: {
            get () {
                return this.isochroneFeatures;
            },
            set (v) {
                this.setIsochroneFeatures(v);
            }
        },
        selectedFacilityLayer () {
            const selectedLayerNames = {},
                selectedLayer = [];

            this.selectedFacilityNames.forEach(name => {
                selectedLayerNames[name] = true;
            });

            this.activeVectorLayerList.forEach(layer => {
                if (Object.prototype.hasOwnProperty.call(selectedLayerNames, layer.get("name"))) {
                    selectedLayer.push(layer);
                }
            });
            return selectedLayer;
        }
    },
    watch: {
        active () {
            if (this.active) {
                onSearchbar(this.setSearchResultToOrigin);

                if (this.mode === "path") {
                    this.addLayer(this.directionsLayer);
                }
            }
            else {
                offSearchbar(this.setSearchResultToOrigin);
                this.removePointMarker();
                this.select.getFeatures().clear();
            }
        },
        activeSet (newValue) {
            if (!this.dataSets[newValue]) {
                return;
            }

            for (const key in this.dataSets[newValue].inputs) {
                this[key] = this.dataSets[newValue].inputs[key];
            }

            if (this.dataSets[newValue].inputs._mode === "point" || this.dataSets[newValue].inputs._mode === "facility") {
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

            if (this.mode === "facility") {
                this.addInteraction(this.select);
            }
            else {
                this.removePointMarker();
                this.removeInteraction(this.select);
            }

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
            }
        },
        clickCoordinate (coord) {
            if (this.active && this.mode === "point") {
                this.setCoordinateFromClick(this.clickCoordinate);
                this.placingPointMarker(coord);
            }
        },
        setByFeature (val) {
            if (val && this.mode === "facility" && this.facilityFeature) {
                if (val) {
                    this.setCoordinateFromFeature(this.facilityFeature);
                }
                else {
                    this.setCoordinateFromClick(this.clickCoordinate);
                }
            }
        },
        activeVectorLayerList (newValues) {
            if (newValues.length > 0) {
                this.setFacilityLayers(newValues);
            }
        },
        routingDirections () {
            this._selectedDirections = this.routingDirections;

            if (this.mode === "path" && this.isochroneFeatures.length > 0) {
                this.askUpdate = true;
            }
        },
        selectedFacilityNames (newValue) {
            if (Array.isArray(newValue) && newValue.length > 0) {
                this.updateCurrentMetaData();
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
                    this._selectedFacilityNames = request.settings.selectedFacilityNames;
                    this._selectedDirections = request.settings.selectedDirections;
                    this._transportType = request.settings.transportType;
                    this._scaleUnit = request.settings.scaleUnit;
                    this._distance = request.settings.distance;
                    this._timefi = request.settings.time;
                    this.setUseTravelTimeIndex(request.settings.useTravelTimeIndex);
                    this._setByFeature = request.settings.setByFeature;
                    this.setSteps(request.settings.steps);
                    this.setSelectedFacility(request.settings.selectedFacility);
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
                    return this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
                        {
                            // result: this.dataSets[this.activeSet].geojson, // if we ever wanted raw data (atm we dont, and toolBridge supports only single type of output)
                            result: imgDataUrl,
                            type: "image", // see toolBridge docs for supported output types
                            request: newRequest, // we need to give back the original request as well
                            sourceInfo: this.metaData ? [this.metaData] : null, // return metadata as array if it exists
                            success: true
                        }
                    );
                };

            // Run the three steps, making sure they happen synchronously (so we don't try to return results before analysis is finished)
            updateInterface(newRequest);
            if (newRequest.updateInterfaceOnly) {
                return null;
            }
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
        this.setNonReactiveData();

        this.baseUrl = getServiceUrl("bkg_ors") + "/v2/";
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
        ...mapMutations("Tools/PopulationRequest", {
            setPopulationRequestGeometry: "setGeometry",
            setPopulationRequestActive: "setActive"
        }),
        ...mapMutations("Tools/AccessibilityAnalysis", Object.keys(mutations)),
        ...mapActions("Tools/AccessibilityAnalysisService", ["getIsochrones"]),
        ...mapActions("Tools/SelectionManager", ["addNewSelection"]),
        ...mapActions("Maps", ["setCenter", "removeInteraction", "addInteraction", "addLayer", "registerListener", "unregisterListener"]),
        ...mapMutations("Maps", ["removeLayerFromMap"]),
        ...mapMutations("Tools/ReportTemplates", ["finishEditingToolSettings", "abortEditingToolSettings"]),
        ...mapActions("MapMarker", ["placingPointMarker", "removePointMarker"]),
        ...mapActions("GraphicalSelect", ["featureToGeoJson"]),
        ...mapActions("Maps", ["addNewLayerIfNotExists"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        ...methods,
        /**
         * Sets all needed non reactive data.
         * @returns {void}
         */
        setNonReactiveData () {
            this.select = new Select({
                style: null,
                filter: (feature, layer) => this.activeVectorLayerList.includes(layer)
            });

            this.registerSelectListener(this.select);
        },

        /**
         * Registers listener for select interaction events.
         * On "select" the name of the selected feature and the click coordinate is set.
         * @param {ol/interaction/Select} select - Interaction for selecting features.
         * @returns {void}
         */
        registerSelectListener (select) {
            select.on("select", evt => {
                if (evt.selected.length === 0) {
                    return;
                }

                const selectedFeature = evt.selected[0],
                    layer = evt.target.getLayer(selectedFeature),
                    layerMap = this.layerMapById(layer.get("id")),
                    unpackedFeature = unpackCluster(selectedFeature)[0];

                this.facilityFeature = unpackedFeature;
                this.setSelectedFacility(unpackedFeature.get(layerMap.keyOfAttrName));
                if (this.setByFeature) {
                    this.setCoordinateFromFeature(unpackedFeature);
                }
                else {
                    this.setCoordinateFromClick(this.clickCoordinate);
                }
                this.placingPointMarker(this.clickCoordinate);
            });
        },

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
            this.facilityNames = [];
            vectorLayers.forEach(layer => {
                if (layer.getSource().getFeatures().length > 0) {
                    this.facilityNames.push(layer.get("name"));
                }
                else {
                    layer.getSource().on("featuresloadend", () => {
                        if (layer.getSource().getFeatures().length > 0) {
                            this.facilityNames.push(layer.get("name"));
                        }
                    });
                }
            });
        },

        getDirectionsText: function (routingDirections) {
            return `Route - ${routingDirections.distance} m, ${(routingDirections.duration / 60).toFixed(1)} min`;
        },
        /**
        * closes this component and opens requestInhabitants component and executes makeRequest with the calculated geoJSON of this component
        * @returns {void}
        */
        async requestInhabitants () {
            this.close();
            await this.$nextTick();
            this.setPopulationRequestActive(true);
            this.setPopulationRequestGeometry(this.rawGeoJson);
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
                _mode: this._mode ? JSON.parse(JSON.stringify(this._mode)) : undefined,
                _coordinate: this._coordinate ? JSON.parse(JSON.stringify(this._coordinate)) : undefined,
                _selectedFacilityNames: this._selectedFacilityNames ? JSON.parse(JSON.stringify(this._selectedFacilityNames)) : undefined,
                _selectedDirections: this._selectedDirections ? JSON.parse(JSON.stringify(this._selectedDirections)) : undefined,
                _transportType: this._transportType ? JSON.parse(JSON.stringify(this._transportType)) : undefined,
                _scaleUnit: this._scaleUnit ? JSON.parse(JSON.stringify(this._scaleUnit)) : undefined,
                _distance: this._distance ? JSON.parse(JSON.stringify(this._distance)) : undefined,
                _time: this._time ? JSON.parse(JSON.stringify(this._time)) : undefined,
                _useTravelTimeIndex: this.useTravelTimeIndex ? JSON.parse(JSON.stringify(this.useTravelTimeIndex)) : undefined,
                _setByFeature: this._setByFeature ? JSON.parse(JSON.stringify(this._setByFeature)) : undefined,
                _steps: this.steps ? JSON.parse(JSON.stringify(this.steps)) : this.steps,
                _selectedFacility: this.selectedFacility ? this.selectedFacility : undefined
            };
            this.dataSets.push(analysisSet);

            this.setActiveSet(this.dataSets.length - 1);

            if (this.dataSets.length === 1) {
                this.renderIsochrones(this._isochroneFeatures);
            }

            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.mapLayer);
            // this line adds the accessibility analysis data selection to the selection manger
            // this does not seem to make much sense: the only reason to reproduce this would be to reproduce the accessibility analysis. However, since the accessibility analysis creates this selection on the fly, we need the previous selection for reproduction, not this one. this one is then recreated on the fly everytime the analysis is run. Leaving this in in case we want this for some reason down the line.
            // this.addNewSelection({selection: analysisSet.results, source: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.title"), id: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.transportTypes." + this._transportType) + ", " + this.$t("additional:modules.tools.cosi.accessibilityAnalysis.scaleUnits." + this._scaleUnit) + ", [...]"});
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
            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.activeVectorLayerList, this.mapLayer);

            this.renderIsochrones(this._isochroneFeatures);
        },
        updateUseTravelTimeIndex (value) {
            this.setUseTravelTimeIndex(value);
        },
        updateTime (value) {
            this._time = value;
        },
        updateCurrentMetaData () {
            //  when the selected facility changes, we keep track of the metadata for the datasets used in the analysis
            // this.$store.commit("Tools/AccessibilityAnalysis/setMetaData", {}); // clear any previously stored metadata

            this.getMetadataSelectedData().then(
                res => { // some code duplicated from actionsDistrictSeletor/fetchMetaData(), as metadata preprocessing may depend on the specific tool
                    // pick date
                    let date = "Datum Unbekannt";

                    if (res.getRevisionDate()) {
                        date = res.getRevisionDate();
                    }
                    else if (res.getPublicationDate()) {
                        date = res.getPublicationDate();
                    }
                    else if (res.getCreationDate()) {
                        date = res.getCreateionDate();
                    }
                    // make simple metadata object
                    const metadata = {Titel: res.getTitle(), Datum: date, Abstrakt: res.getAbstract()};

                    this.$store.commit("Tools/AccessibilityAnalysis/setMetaData", metadata); // fetch locally stored metadata for relevant layers
                });
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
                    <EditForReportTemplate
                        :report-template-mode="reportTemplateMode"
                        tool-name="AccessibilityAnalysis"
                    />
                    <div
                        v-if="active"
                        id="accessibilityanalysis"
                    >
                        <v-form>
                            <v-select
                                v-model="_mode"
                                class="mb-4"
                                :items="availableModes"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.dropdownInfo')"
                                item-text="text"
                                item-value="type"
                                outlined
                                dense
                                hide-details
                            />
                            <v-text-field
                                v-if="mode === 'point'"
                                id="coordinate"
                                v-model="_coordinate"
                                class="mb-4"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.pointOfReference')"
                                type="text"
                                min="0"
                                readonly
                                outlined
                                dense
                                hide-details
                            />
                            <v-text-field
                                v-if="mode === 'facility'"
                                id="facility"
                                :value="selectedFacility"
                                class="mb-4"
                                label="Klicken Sie auf eine Einrichtung"
                                type="text"
                                readonly
                                outlined
                                dense
                                hide-details
                            />
                            <v-select
                                v-if="mode === 'region'"
                                v-model="_selectedFacilityNames"
                                class="mb-4"
                                placeholder="Keine Auswahl"
                                :items="facilityNames"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.topic')"
                                multiple
                                outlined
                                dense
                                hide-details
                            />
                            <v-checkbox
                                v-if="mode === 'facility' || mode === 'region'"
                                v-model="_setByFeature"
                                class="mb-4"
                                dense
                                hide-details
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeature')"
                                :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeatureInfo')"
                            />
                            <v-select
                                v-if="mode === 'path'"
                                v-model="_selectedDirections"
                                class="mb-4"
                                placeholder="Keine Auswahl"
                                :item-text="getDirectionsText"
                                return-object
                                :items="[routingDirections || {distance: '-', duration: '-'}]"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.directions')"
                                outlined
                                dense
                                hide-details
                                readonly
                            />
                            <v-select
                                v-model="_transportType"
                                class="mb-4"
                                title="Verkehrsmittel"
                                :items="transportTypes"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.transportType')"
                                item-text="name"
                                item-value="type"
                                outlined
                                dense
                                hide-details
                                :disabled="mode === 'path'"
                            />
                            <v-select
                                v-model="_scaleUnit"
                                class="mb-4"
                                title="Maßeinheit der Entfernung"
                                :items="scaleUnits"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.scaleUnit')"
                                item-text="name"
                                item-value="type"
                                outlined
                                dense
                                hide-details
                                :disabled="mode === 'path'"
                            />
                            <template
                                v-if="_transportType === 'driving-car' && scaleUnit === 'time'"
                            >
                                <AccessibilityAnalysisTrafficFlow
                                    :use-travel-time-index="useTravelTimeIndex"
                                    :time="_time"
                                    @update:useTravelTimeIndex="updateUseTravelTimeIndex"
                                    @update:time="updateTime"
                                />
                            </template>
                            <v-text-field
                                id="range"
                                v-model="_distance"
                                class="mb-4"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.distance')"
                                type="number"
                                min="0"
                                outlined
                                dense
                                hide-details
                            />

                            <v-row
                                v-if="reportTemplateMode===null"
                                dense
                            >
                                <v-col cols="4">
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
                                <AccessibilityAnalysisLegend
                                    v-if="dataSets.length > 0"
                                    :steps="steps"
                                    :colors="legendColors"
                                />
                            </v-row>
                            <v-progress-linear
                                v-if="progress > 0"
                                v-model="progress"
                                background-color="white"
                            />
                        </v-form>
                        <template v-if="dataSets.length > 0">
                            <v-divider />
                            <v-row
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
                                        v-if="mode === 'point' || mode === 'facility'"
                                        dense
                                        small
                                        tile
                                        color="grey lighten-1"
                                        @click="requestInhabitants"
                                    >
                                        {{ $t('additional:modules.tools.cosi.accessibilityAnalysis.requestInhabitants') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-divider />
                            <v-row>
                                <v-col>
                                    <AnalysisPagination
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
                        </template>
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
    @import "~variables";

    #accessibilityanalysis {
        width: 400px;
        min-height: 100px;

        .inline-switch {
            margin-top: 0px;
            height: 40px;
        }

        #download {
            margin-top: 8px;
        }

        .v-input {
            border-radius: $border-radius-base;
            font-size: 14px;
            .v-label {
                font-size: 14px;
            }
        }

        .v-input--checkbox {
            padding: 5px 0;
        }

        button {
            text-transform: inherit;
        }
    }

    .snackbar-text{
        color: black
    }

</style>
