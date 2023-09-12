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
        ...mapGetters("Maps", ["getVisibleLayerList"]),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapState("Tools/VpiDashboard", ["allLocationsGeoJson", "allLocationsArray", "showLoader"]),
        showLocationSelectMenu () {
            const selectedTab = this.TabItems.find(tab => tab.selected === true);

            return selectedTab.showLocationSelectMenu;
        }
    },
    watch: {
        allLocationsGeoJson (val) {
            const params = {
                name: "WhatALocation Standorte",
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
         * and deactivates the layer when the tool is deactivated.
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
            }
        }

    },
    async created () {
        this.$on("close", this.close);
    },
    async mounted () {
        await this.getAllLocations();
        await this.getWhatALocationData(this.allLocationsArray[0].id);
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
