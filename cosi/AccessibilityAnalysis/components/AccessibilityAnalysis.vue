<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import AnalysisPagination from "../../components/AnalysisPagination.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersAccessibilityAnalysis";
import mutations from "../store/mutationsAccessibilityAnalysis";
import methods from "./methodsAnalysis";
import deepEqual from "deep-equal";
import {exportAsGeoJson, downloadGeoJson} from "../utils/exportResults";
import {Select} from "ol/interaction";
import ToolInfo from "../../components/ToolInfo.vue";
import {onSearchbar, offSearchbar, onShowFeaturesById, onShowAllFeatures, onFeaturesLoaded, getModelByAttributes} from "../../utils/radioBridge.js";
import mapCanvasToImage, {exportMapView} from "../../utils/mapCanvasToImage";
import AccessibilityAnalysisLegend from "./AccessibilityAnalysisLegend.vue";
import AccessibilityAnalysisTrafficFlow from "./AccessibilityAnalysisTrafficFlow.vue";
import {unpackCluster} from "../../utils/features/unpackCluster.js";
import {getLayerSource} from "../../utils/layer/getLayerSource";
import {geometryToGeoJson} from "../../utils/geometry/convertToGeoJson";
import {transformCoordinate, transformCoordinates} from "../utils/transformCoordinates";
import {simplify} from "../../utils/geometry/simplify";
import {getFlatCoordinates} from "../../utils/geometry/getFlatCoordinates";
import {filterAllFeatures} from "../../utils/layer/filterAllFeatures";

export default {
    name: "AccessibilityAnalysis",
    components: {
        Tool,
        ToolInfo,
        AnalysisPagination,
        AccessibilityAnalysisLegend,
        AccessibilityAnalysisTrafficFlow
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
            facilityFeature: null,
            addMultiplePoints: false
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/AccessibilityAnalysis", Object.keys(getters)),
        ...mapGetters("Maps", ["projectionCode", "clickCoordinate", "getVisibleLayerList"]),
        ...mapGetters("MapMarker", ["markerPoint", "markerPolygon"]),
        ...mapGetters("Tools/DistrictSelector", ["boundingGeometry"]),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList", "isFeatureActive", "layerMapById"]),
        ...mapGetters("Tools/AreaSelector", {areaSelectorGeom: "geometry"}),
        ...mapGetters("Tools/SelectionManager", ["activeSelection"]),
        ...mapGetters("Tools/ScenarioBuilder", ["scenarioUpdated"]),
        ...mapGetters("Tools/Routing/Directions", ["directionsRouteSource", "directionsRouteLayer", "routingDirections"]),

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
        _useTravelTimeIndex: {
            get () {
                return this.transportType === "driving-car" && this.scaleUnit === "time" ? this.useTravelTimeIndex : false;
            },
            set (v) {
                this.setUseTravelTimeIndex(v);
            }
        },
        selectedFacilityLayer () {
            return this.activeVectorLayerList.filter(layer => this.selectedFacilityNames.includes(layer.get("name")));
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
            this.removePointMarker();
            if (this.dataSets[newValue].inputs._mode === "point" || this.dataSets[newValue].inputs._mode === "facility") {
                for (const coordinate of this.dataSets[newValue].inputs._coordinate) {
                    const icoord = transformCoordinate(coordinate, "EPSG:4326", this.projectionCode);

                    if (!this.dataSets[newValue].inputs._setByFeature) {
                        icoord.keepPreviousMarker = true;
                    }
                    this.placingPointMarker(icoord);
                }
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
        setByFeature (val) {
            if (val && this.mode === "facility" && this.facilityFeature) {
                if (val) {
                    this.setCoordinateFromFeature(this.facilityFeature, this.projectionCode);
                }
                else {
                    this.setCoordinateFromClick(this.clickCoordinate, this.projectionCode);
                }
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
                            sourceInfo: this.metaData ? [this.metaData] : null // return metadata as array if it exists
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
        this.setNonReactiveData();
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
        ...mapActions("Tools/AccessibilityAnalysis", ["getIsochrones"]),
        ...mapActions("Tools/SelectionManager", ["addNewSelection"]),
        ...mapActions("Maps", ["setCenter", "removeInteraction", "addInteraction", "addLayer", "registerListener", "unregisterListener"]),
        ...mapMutations("Maps", ["removeLayerFromMap"]),
        ...mapActions("MapMarker", ["placingPointMarker", "removePointMarker"]),
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
            this.registerClickListener();
        },

        /**
         * Registers the listeners to keyboard events onkeydown and onkeyup
         * @returns {void}
         */
        registerClickListener () {
            mapCollection.getMap("2D").addEventListener("click", evt => {
                if (this.active && this.mode === "point") {
                    this.setCoordinateFromClick(this.clickCoordinate, this.projectionCode, evt.originalEvent.shiftKey);
                }
            });
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
                    this.setCoordinateFromFeature(unpackedFeature, this.projectionCode);
                }
                else {
                    this.setCoordinateFromClick(this.clickCoordinate, this.projectionCode, evt.mapBrowserEvent.originalEvent.shiftKey);
                }
            });
        },

        /**
         * Sets and transforms the click coordinate to EPSG 4326.
         * @param {event} clickCoordinate - The coordinate of the click.
         * @param {String} mapProjectionCode - The code of the current map projection.
         * @param {String} [shiftKeyPressed] - add points to selection if shiftKey is pressed
         * @returns {void}
         */
        setCoordinateFromClick: function (clickCoordinate, mapProjectionCode, shiftKeyPressed) {
            const coordinate = transformCoordinate(clickCoordinate, mapProjectionCode);

            this.setSetBySearch(false);
            if (shiftKeyPressed || this.addMultiplePoints) {
                const markerCoord = [...clickCoordinate];

                markerCoord.keepPreviousMarker = true;
                this.setCoordinate([...this.coordinate, coordinate]);
                this.placingPointMarker(markerCoord);
            }
            else {
                this.setCoordinate([coordinate]);
                this.placingPointMarker(clickCoordinate);
            }
        },

        /**
         * Sets and transforms the coordinate(s) of a feature to EPSG 4326.
         * @param {ol/Feature} feature - The feature.
         * @param {String} mapProjectionCode - The code of the current map projection.
         * @returns {void}
         */
        setCoordinateFromFeature: function (feature, mapProjectionCode) {
            const simplifiedGeom = simplify(feature.getGeometry()),
                coordiantes = getFlatCoordinates(simplifiedGeom);

            this.setCoordinate(transformCoordinates(coordiantes, mapProjectionCode));
            this.placingPointMarker(this.clickCoordinate);
        },

        downloadMap () {
            exportMapView("Erreichbarkeitsanalyse_CoSI");
        },

        tryUpdateIsochrones () {
            if (this.mode === "region" && this.currentCoordinates && this.dataSets.length > 0) {
                const allActiveFeatures = filterAllFeatures(this.selectedFacilityLayer, this.isFeatureActive),
                    newCoordinates = this.getCoordinates(allActiveFeatures, this.setByFeature);

                if (!deepEqual(this.currentCoordinates.map(e=>[e[0], e[1]]), newCoordinates)) {
                    this.askUpdate = true;
                }
            }
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
                if (getLayerSource(layer).getFeatures().length > 0) {
                    this.facilityNames.push(layer.get("name"));
                }
                else {
                    getLayerSource(layer).on("featuresloadend", () => {
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
            const outerPolygon = geometryToGeoJson(this.isochroneFeatures[0].getGeometry(), false, "EPSG:25832", "EPSG:25832");

            this.close();
            await this.$nextTick();
            this.setPopulationRequestActive(true);
            this.setPopulationRequestGeometry(outerPolygon);
        },
        createAnalysisSet: async function () {
            this.hide = false;
            this.addMultiplePoints = false;

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
                _selectedFacilityNames: JSON.parse(JSON.stringify(this._selectedFacilityNames)),
                _selectedDirections: JSON.parse(JSON.stringify(this._selectedDirections)),
                _transportType: JSON.parse(JSON.stringify(this._transportType)),
                _scaleUnit: JSON.parse(JSON.stringify(this._scaleUnit)),
                _distance: JSON.parse(JSON.stringify(this._distance)),
                _time: JSON.parse(JSON.stringify(this._time)),
                _useTravelTimeIndex: JSON.parse(JSON.stringify(this._useTravelTimeIndex)),
                _setByFeature: JSON.parse(JSON.stringify(this._setByFeature)),
                _steps: JSON.parse(JSON.stringify(this.steps)),
                _selectedFacility: this.selectedFacility
            };
            this.dataSets.push(analysisSet);

            this.setActiveSet(this.dataSets.length - 1);

            if (this.dataSets.length === 1) {
                this.renderIsochrones(this._isochroneFeatures);
            }

            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.mapLayer, this.projectionCode);
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

        async updateAnalysisSet () {
            await this.createIsochrones();

            this.dataSets[this.activeSet].results = this._isochroneFeatures;
            this.dataSets[this.activeSet].geojson = this.exportAsGeoJson(this.mapLayer, this.projectionCode);

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
                <v-app id="accessibilityanalysis">
                    <ToolInfo
                        :url="readmeUrl"
                        :locale="currentLocale"
                        :summary="$t('additional:modules.tools.cosi.accessibilityAnalysis.description')"
                    />
                    <div
                        v-if="active"
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
                                :append-icon="addMultiplePoints ? 'mdi-map-marker-plus' : 'mdi-map-marker-plus-outline'"
                                :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeatureInfo')"
                                @click:append="addMultiplePoints = !addMultiplePoints"
                            />
                            <v-text-field
                                v-if="mode === 'facility'"
                                id="facility"
                                :value="selectedFacility"
                                class="mb-4"
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeature')"
                                type="text"
                                readonly
                                outlined
                                dense
                                hide-details
                                :append-icon="addMultiplePoints ? 'mdi-map-marker-plus' : 'mdi-map-marker-plus-outline'"
                                :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeatureInfo')"
                                @click:append="addMultiplePoints = !addMultiplePoints"
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
                                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.setByFeatureOutline')"
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
                            <v-row dense>
                                <v-col class="mb-2">
                                    <v-select
                                        v-model="_scaleUnit"
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
                                </v-col>
                                <v-col class="mb-2">
                                    <v-text-field
                                        id="range"
                                        v-model="_distance"
                                        :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.distance')"
                                        type="number"
                                        min="0"
                                        outlined
                                        dense
                                        hide-details
                                    />
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <AccessibilityAnalysisLegend
                                    v-if="dataSets.length > 0"
                                    :steps="steps"
                                    :colors="legendColors"
                                />
                            </v-row>
                            <v-row
                                v-if="_transportType === 'driving-car' && scaleUnit === 'time'"
                                dense
                            >
                                <AccessibilityAnalysisTrafficFlow
                                    :use-travel-time-index="useTravelTimeIndex"
                                    :time="_time"
                                    @update:useTravelTimeIndex="updateUseTravelTimeIndex"
                                    @update:time="updateTime"
                                />
                            </v-row>
                            <v-row dense>
                                <v-col cols="4">
                                    <v-btn
                                        id="create-isochrones"
                                        tile
                                        depressed
                                        color="grey lighten-1"
                                        @click.native="createAnalysisSet()"
                                    >
                                        {{ $t("additional:modules.tools.cosi.accessibilityAnalysis.calculate") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-progress-linear
                            v-if="progress > 0"
                            v-model="progress"
                            background-color="white"
                            height="10"
                        />
                        <template v-if="dataSets.length > 0">
                            <v-divider />
                            <v-row
                                dense
                            >
                                <v-col cols="12">
                                    <v-btn
                                        id="clear"
                                        tile
                                        depressed
                                        :color="hide ? 'warning' : 'grey lighten-1'"
                                        @click.native="hide = !hide"
                                    >
                                        {{ $t('additional:modules.tools.cosi.accessibilityAnalysis.clear') }}
                                    </v-btn>
                                    <v-btn
                                        v-if="mode === 'point' || mode === 'facility' || mode === 'path'"
                                        tile
                                        depressed
                                        color="grey lighten-1"
                                        @click="requestInhabitants"
                                    >
                                        {{ $t('additional:modules.tools.cosi.accessibilityAnalysis.requestInhabitants') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-divider />
                            <AnalysisPagination
                                :sets="dataSets"
                                :active-set="activeSet"
                                :downloads="['GEOJSON']"
                                :titles="{
                                    downloads: [$t('additional:modules.tools.cosi.accessibilityAnalysis.download.title')],
                                    downloadAll: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationDownloadAll'),
                                    remove: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationRemove'),
                                    removeAll: $t('additional:modules.tools.cosi.accessibilityAnalysis.paginationRemoveAll')
                                }"
                                @setActiveSet="(n) => setActiveSet(n)"
                                @removeSingle="(n) => removeSet(n)"
                                @removeAll="removeAll"
                                @downloadGEOJSON="(n) => downloadSet(n)"
                                @downloadAll="downloadAll"
                            />
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
        font-family: $font_family_default;
        width: 430px;

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
            font-family: $font_family_accent;
        }
    }

    .snackbar-text{
        color: black
    }

</style>
