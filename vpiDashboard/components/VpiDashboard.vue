<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import getters from "../store/gettersVpiDashboard";
import mutations from "../store/mutationsVpiDashboard";
import actions from "../store/actionsVpiDashboard";
import {mapState, mapGetters, mapActions, mapMutations} from "vuex";
import {getComponent} from "../../../src/utils/getComponent";
import Tabs from "./DashboardTabs.vue";
import TabActivities from "./Tabs/TabActivities.vue";
import TabCompareDashboard from "./Tabs/TabCompareDashboard.vue";
import TabDwellTime from "./Tabs/TabDwellTime.vue";
import TabInfo from "./Tabs/TabInfo.vue";
import TabVisitorTypes from "./Tabs/TabVisitorTypes.vue";
import LoaderOverlay from "../utils/loaderOverlay.js";
import VpiLoader from "./VpiLoader.vue";
import TabAgeGroups from "./Tabs/TabAgeGroups.vue";
import LocationSelectMenuVue from "./LocationSelectMenu.vue";
import TabCompareDatesDashboard from "./Tabs/TabCompareDatesDashboard.vue";
import {highlightSelectedLocationOnMap} from "../utils/highlightSelectedLocationOnMap";
import axios from "axios";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import {Vector} from "ol/source.js";
import {Style, Fill, Stroke} from "ol/style.js";

export default {
    name: "VpiDashboard",
    components: {
        ToolTemplate,
        Tabs,
        TabActivities,
        TabCompareDashboard,
        TabDwellTime,
        TabInfo,
        VpiLoader,
        TabAgeGroups,
        TabVisitorTypes,
        LocationSelectMenuVue,
        TabCompareDatesDashboard
    },
    data () {
        return {
            chartType: "bar",
            layerList: null,
            map: null,
            gridLayer: null,
            gridLayerIsVisible: false,
            TabItems: [
                {
                    index: 0,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.activities"),
                    selected: true,
                    showLocationSelectMenu: true
                },
                {
                    index: 1,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.types"),
                    selected: false,
                    showLocationSelectMenu: true
                },
                {
                    index: 2,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.age"),
                    selected: false,
                    showLocationSelectMenu: true
                },
                {
                    index: 3,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.dwelltime"),
                    selected: false,
                    showLocationSelectMenu: true
                },
                {
                    index: 4,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.compare"),
                    selected: false,
                    showLocationSelectMenu: false
                },
                {
                    index: 5,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.compare_dates"),
                    selected: false,
                    showLocationSelectMenu: true
                },
                {
                    index: 6,
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.info"),
                    selected: false,
                    showLocationSelectMenu: false
                }
            ],
            renderTab: false,
            finishedLoading: false
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapState("Tools/VpiDashboard", ["allLocationsGeoJson", "allLocationsArray", "showLoader"]),
        ...mapGetters("Maps", {
            layerById: "getLayerById",
            projectionCode: "projectionCode",
            getVisibleLayerList: "getVisibleLayerList"
        }),
        showLocationSelectMenu () {
            const selectedTab = this.TabItems.find(tab => tab.selected === true);

            return selectedTab.showLocationSelectMenu;
        }
    },
    watch: {
        allLocationsGeoJson (val) {
            const params = {
                name: "Standorte Frequenzdaten",
                id: "vpi",
                geoJSON: val,
                styleId: "customLayer",
                folderName: "VPI",
                gfiAttributes: {
                    street: this.translate("additional:modules.tools.vpidashboard.gfi.street"),
                    id: "ID"
                    /* avgVisitorsMonday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsMonday"),
                    avgVisitorsTuesday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsTuesday"),
                    avgVisitorsWednesday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsWednesday"),
                    avgVisitorsThursday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsThursday"),
                    avgVisitorsFriday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsFriday"),
                    avgVisitorsSaturday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsSaturday"),
                    avgVisitorsSunday: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsSunday"),
                    avgVisitorsJanuary: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsJanuary"),
                    avgVisitorsFebruary: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsFebruary"),
                    avgVisitorsMarch: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsMarch"),
                    avgVisitorsApril: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsApril"),
                    avgVisitorsMay: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsMay"),
                    avgVisitorsJune: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsJune"),
                    avgVisitorsJuly: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsJuly"),
                    avgVisitorsAugust: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsAugust"),
                    avgVisitorsSeptember: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsSeptember"),
                    avgVisitorsOctober: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsOctober"),
                    avgVisitorsNovember: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsNovember"),
                    avgVisitorsDecember: this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorsDecember") */
                },
                gfiTheme: "vpi"
            };
            let model = null;

            /* Object.keys(val.features[0].properties).forEach(key => {
                if (Number.isInteger(parseInt(key.slice(-4), 10))) {
                    params.gfiAttributes[key] = this.translate("additional:modules.tools.vpidashboard.gfi.avgVisitorYear") + key.slice(-4);
                }
            }); */

            this.$store.dispatch("AddLayerRemotely/addGeoJson", params);

            model = Radio.request("ModelList", "getModelByAttributes", {id: "vpi"});
            model.toggleIsVisibleInMap();
            model.setIsSettingVisible(false);
            model.setIsSelected(false);
        },
        /**
         * Shows loader.
         * When the showLoader value in state set to true, it shows the laoder.
         * Otherwise hides to loader.
         * @param {boolean} val showLoader
         * @returns {void}
         */
        showLoader (val) {
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            val ? LoaderOverlay.show() : LoaderOverlay.hide();
        },
        /**
         * activates the WhatALocation-Locations when the tool is activated
         * and deactivates the layer (and the mobile cell grid layer) when the tool is deactivated.
         * @param {boolean} val isToolActive
         * @returns {void}
         */
        active (val) {
            const visibleLayers = this.getVisibleLayerList,
                // eslint-disable-next-line
                vpiLayer = this.$store.getters["Maps/getLayerById"]({layerId: "vpi"}),
                model = Radio.request("ModelList", "getModelByAttributes", {id: "vpi"});

            if (!visibleLayers.includes(vpiLayer)) {
                model.toggleIsVisibleInMap();
            }

            if (!val) {
                model.setIsSettingVisible(false);
                model.setIsSelected(false);
                this.gridLayerIsVisible = false;
            }
        },
        /**
         * Toggles the mobile cell grid layer.
         * When the gridLayerIsVisible value is set to true, it shows the layer.
         * Otherwise hides to layer.
         * @param {boolean} val gridLayerIsVisible
         * @returns {void}
         */
        gridLayerIsVisible (val) {
            this.gridLayer?.setVisible(val);
        }

    },
    async created () {
        this.$on("close", this.close);
    },
    async mounted () {
        this.map = mapCollection.getMap("2D");
        await this.getAllLocations();
        await this.getWhatALocationData(this.allLocationsArray[0].id);
        // create the mobile cell grid layer but do not show it yet (will be toggled by checkbox in this dashboard)
        await this.createGridLayer();
        this.finishedLoading = true;

        const model = Radio.request("ModelList", "getModelByAttributes", {id: "vpi"});

        if (this.$store.getters["Tools/VpiDashboard/active"]) {
            model.toggleIsVisibleInMap();
        }
    },
    methods: {
        ...mapMutations("Tools/VpiDashboard", Object.keys(mutations)),
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * reacts on a close of this tool and sets the component to inactive
         * @returns {void}
         */
        close () {
            this.setActive(false);
            const model = getComponent(this.$store.state.Tools.VpiDashboard.id);

            // ensures that the activities tab is active after reopening the tool
            this.TabItems.forEach((tabItem) => {
                if (tabItem.index === 0) {
                    tabItem.selected = true;
                }
                else {
                    tabItem.selected = false;
                }
            });
            if (model) {
                model.set("isActive", false);
            }

            highlightSelectedLocationOnMap(undefined, "clear");

            this.$store.state.Tools.Gfi.gfiFeatures = [];
        },
        /**
         * initiates the asynchronous request for activities from WhatALocation
         * @param {String} locationId id of the location that its data going to be downloaded.
         * @returns {void}
         */
        async getWhatALocationData (locationId) {
            await this.getActivities(locationId);
            this.renderTab = true;
        },
        /**
         * initiates the asynchronous request for locally stored mobile cell grid geojson
         * creates VectorLayer from this data and add it to the map, does not show it initially
         * @returns {void}
         */
        async createGridLayer () {
            const fetch = await axios.get(this.$store.getters["Tools/VpiDashboard/mobileCellsGeoJSON"]),
                layerId = "vpi-grid-cells";

            let
                layer = this.map
                    ? this.map
                        .getLayers()
                        .getArray()
                        .find((l) => {
                            return l.get("id") === layerId;
                        })
                    : undefined;

            if (layer) {
                layer.setVisible(false);
                return;
            }

            this.geoJSONFeatures = new GeoJSON().readFeatures(fetch.data);

            layer = new VectorLayer({
                id: layerId,
                name: "GridLayer",
                source: this.getVectorSourceFeatures(),
                visible: false
            });

            layer.setZIndex(12);
            layer.setStyle(new Style({
                fill: new Fill({
                    color: ["255", "255", "255", "0"]
                }),
                stroke: new Stroke({
                    color: ["0", "50", "255", "0.5"],
                    width: 2
                })
            }));

            this.gridLayer = layer;

            this.map.addLayer(layer);
        },
        /**
         * creates a vector source for the layer to add to the map
         * @returns {Vector} vector the Vector Source for the layer to add to the map
         */
        getVectorSourceFeatures () {

            const vector = new Vector();

            [...this.geoJSONFeatures].forEach((feature) => {
                const geometry = feature.getGeometry();
                let referenceSystem = feature.get("referenceSystem");

                referenceSystem = referenceSystem === undefined ? "4326" : referenceSystem;
                if (geometry) {
                    geometry.transform("EPSG:" + referenceSystem, this.projectionCode);
                }

                vector.addFeature(feature);
            });
            return vector;
        },
        /**
         * translates the given key, checkes if the key exists and throws a console warning if not
         * @param {String} key the key to translate
         * @param {Object} [options=null] for interpolation, formating and plurals
         * @returns {String} the translation or the key itself on error
         */
        translate (key, options = null) {
            if (key === "additional:" + this.$t(key)) {
                console.warn("the key " + JSON.stringify(key) + " is unknown to the additional translation");
            }

            return this.$t(key, options);
        }
    }
};
</script>

<template lang="html">
    <!--
        Other tools have "ToolTemplate" as root element, but here VpiLoader is necessary.
        Therefore set class dashboardActive to allow hiding tool when not active.
    -->
    <div
        class="vpidashboardbasic"
        :class="{ dashboardActive: active }"
    >
        <VpiLoader />
        <ToolTemplate
            :title="translate(name)"
            :icon="icon"
            :active="active"
            :show-in-sidebar="true"
            :render-to-window="renderToWindow"
            :resizable-window="resizableWindow"
            :initial-width="700"
            :deactivate-g-f-i="deactivateGFI"
        >
            <template #toolBody>
                <div class="row h-100">
                    <div class="col-12 col-md-12 col-lg-12 h-100">
                        <div class="h-100">
                            <div>
                                <div>
                                    <input
                                        id="toggleGridLayer"
                                        v-model="gridLayerIsVisible"
                                        type="checkbox"
                                    >
                                    <label
                                        for="toggleGridLayer"
                                    >
                                        {{ translate("additional:modules.tools.vpidashboard.toggleGridLayer") }}
                                    </label>
                                </div>
                                <LocationSelectMenuVue
                                    v-if="finishedLoading"
                                    v-show="showLocationSelectMenu"
                                />
                            </div>
                            <!-- Tabs Component (START) -->
                            <div
                                class="tabs horizontal"
                                disabled="false"
                            >
                                <!-- <Tabs /> -->
                                <Tabs :tab-items="TabItems">
                                    <div
                                        v-if="renderTab"
                                        slot="tab-content-0"
                                    >
                                        <TabActivities />
                                    </div>
                                    <div slot="tab-content-1">
                                        <TabVisitorTypes />
                                    </div>
                                    <div slot="tab-content-2">
                                        <TabAgeGroups />
                                    </div>
                                    <div slot="tab-content-3">
                                        <TabDwellTime />
                                    </div>
                                    <div slot="tab-content-4">
                                        <TabCompareDashboard />
                                    </div>
                                    <div slot="tab-content-5">
                                        <TabCompareDatesDashboard />
                                    </div>
                                    <div slot="tab-content-6">
                                        <TabInfo />
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ToolTemplate>
    </div>
</template>

<style scoped>
    .vpidashboardbasic.dashboardActive {
        height: 100%;
    }

</style>
