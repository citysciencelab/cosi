<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../../src/utils/getComponent";
import {mapState, mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersFeaturesList";
import mutations from "../store/mutationsFeaturesList";
import actions from "../store/actionsFeaturesList";
import getVectorlayerMapping from "../utils/getVectorlayerMapping";
import {getContainingDistrictForFeature} from "../../utils/geomUtils";
import {getLayerSource} from "../../utils/layer/getLayerSource";
import highlightVectorFeature from "../../utils/highlightVectorFeature";
import DetailView from "./DetailView.vue";
import FeatureIcon from "./FeatureIcon.vue";
import FeaturesListToolbar from "./FeaturesListToolbar.vue";
import {prepareTableExport, prepareDetailsExport, composeFilename} from "../utils/prepareExport";
import exportXlsx from "../../utils/exportXlsx";
import {isEqual} from "../../utils/array/isEqual";
import getColorFromNumber from "../../utils/getColorFromNumber";
import chartMethods from "../utils/charts";
import FeaturesScore from "./FeaturesListScore.vue";
import setGeomAttributes from "../../utils/features/setGeomAttributes";
import getFeatureStyle from "../../utils/features/getFeatureStyle";

import
{
    Fill,
    Style,
    Stroke,
    Text,
    Circle
} from "ol/style.js";
import Feature from "ol/Feature";
import ToolInfo from "../../components/ToolInfo.vue";
import {onFeaturesLoaded, onResetFeatures, onShowFeaturesById, onShowAllFeatures} from "../../utils/radioBridge.js";

export default {
    name: "FeaturesList",
    components: {
        Tool,
        ToolInfo,
        DetailView,
        FeatureIcon,
        FeaturesScore,
        FeaturesListToolbar
    },
    data () {
        return {
            search: "",
            layerFilter: [],
            expanded: [],
            filterProps: {},
            filteredItems: [],
            excludedPropsForExport: [
                "Icon",
                "Aktionen",
                "Ein-/ Ausblenden",
                "layerId",
                "feature",
                "key",
                "gfiAttributes"
            ],
            featureColumns: [
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colIcon"),
                    value: "style",
                    filterable: false,
                    sortable: false
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colToggleEnabled"),
                    value: "enabled"
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colFacility"),
                    value: "name"
                },
                {
                    value: "warning"
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colDistrict"),
                    value: "district"
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colAddress"),
                    value: "address",
                    divider: true
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colLayerName"),
                    value: "layerName",
                    filter: value => {
                        if (this.layerFilter.length < 1) {
                            return true;
                        }

                        return this.layerFilter.map(t => t.id).includes(value);
                    }
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colType"),
                    value: "type",
                    divider: true
                },
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colGroup"),
                    value: "group",
                    divider: true
                }
            ],
            actionColumns: [
                {
                    text: this.$t("additional:modules.tools.cosi.featuresList.colToggleEnabled"),
                    value: "enabled"
                }
            ],
            numericalColumns: [],
            distScoreLayer: null,
            exportDetails: false,
            dipasInFeaturesList: true,
            sumUpLayers: false
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/FeaturesList", Object.keys(getters)),
        ...mapGetters("Tools/ScenarioBuilder", ["activeSimulatedFeatures", "scenarioUpdated", "geomAttributes"]),
        ...mapGetters("Tools/DistrictSelector", {selectedDistrictLevel: "selectedDistrictLevel", selectedDistrictFeatures: "selectedFeatures", districtLayer: "layer", bufferValue: "bufferValue", extent: "extent"}),
        ...mapGetters("Tools/DistanceScoreService", ["wmsLayersInfo"]),
        ...mapState(["configJson"]),
        columns () {
            return [
                ...this.featureColumns,
                ...this.numericalColumns
            ];
        },
        selected: {
            get () {
                return this.selectedFeatureItems;
            },
            set (value) {
                this.setSelectedFeatureItems(value);
            }
        },
        items: {
            get () {
                return this.featuresListItems;
            },
            set (value) {
                this.setFeaturesListItems(value);
                this.numericalColumns = this.getNumericalColumns();
            }
        }
    },
    watch: {
        /**
         * Unselect the Menu item if the tool is deactivated
         * @param {boolean} state - Defines if the tool is active.
         * @returns {void}
         */
        active (state) {
            if (!state) {
                const model = getComponent(this.id);

                if (model) {
                    model.set("isActive", false);
                }

                this.removeHighlightFeature();
                this.setShow(true);
            }
        },

        /**
         * Updates the feature highlighting on selection change
         * @param {object} newValue new value
         * @listens #change:this.$data.selected
         * @returns {void}
         */
        selected (newValue) {
            this.removeHighlightFeature();
            newValue.forEach(item => {
                this.highlightVectorFeature(item.feature, item.layerId);
            });
            this.showDistanceScoreFeatures();
        },

        /**
         * Updates the list on added/removed scenario features
         * @listens #change:Tools/ScenarioBuilder/activeSimulatedFeatures
         * @returns {void}
         */
        scenarioUpdated: "updateFeaturesList",

        /**
         * Updates the list on added/removed scenario features
         * @listens #change:Tools/ScenarioBuilder/activeSimulatedFeatures
         * @returns {void}
         */
        selectedDistrictLevel: "updateFeaturesList",

        /**
         * Listens to the layers change on the map to refresh the table
         * @listens #change:FeaturesList/activeVectorLayerList
         * @param {module:ol/layer/Vector[]} newList - the new activeVectorLayerList
         * @param {module:ol/layer/Vector[]} oldList - the old activeVectorLayerList
         * @returns {void}
         */
        activeVectorLayerList (newList, oldList) {
            if (!isEqual(newList, oldList)) {
                this.$nextTick(() => {
                    this.updateFeaturesList();
                });
            }
        },

        groupActiveLayer () {
            this.numericalColumns = this.getNumericalColumns();
        },

        items (newItems) {
            if (newItems.length > 0 && newItems.some(item => item.group === "DIPAS")) {
                this.dipasInFeaturesList = true;
            }
            else {
                this.dipasInFeaturesList = false;
            }
            this.showDistanceScoreFeatures();
        },

        layerFilter () {
            this.numericalColumns = this.getNumericalColumns();
        },

        show (val) {
            if (val) {
                this.$nextTick(() => {
                    if (this.active) {
                        this.$el.style.width = "inherit";
                        this.$el.querySelector("#basic-resize-handle-sidebar").style.display = "inherit";
                        mapCollection.getMap("2D").updateSize();
                    }
                });
            }
            else {
                this.$nextTick(() => {
                    if (this.active) {
                        this.$el.style.width = "80px";
                        this.$el.querySelector("#basic-resize-handle-sidebar").style.display = "none";
                        mapCollection.getMap("2D").updateSize();
                    }
                });
            }
        }
    },
    created () {
        /**
         * listens to the close event of the Tool Component
         * @listens #close
         */
        this.$on("close", () => {
            this.setActive(false);
        });

        this.isTimeSeriesAnalyseShow = typeof this.$store.state.configJson.Portalconfig.menu.tools.children.timeSeriesAnalyse !== "undefined";
    },
    async mounted () {
        // initally set the facilities mapping based on the config.json
        this.setMapping(getVectorlayerMapping(this.configJson.Themenconfig));
        this.updateFeaturesList();

        /**
         * @description Listen to newly loaded VectorLayer Features to update the FeaturesList
         * Doubles execution from the visibleLayerList listener, but necessary due to delay in features loaded
         * @todo refactor to vuex, there should be an event on the map calling out loaded features
         * @deprecated
         */
        onFeaturesLoaded(this.updateFeaturesList);
        onResetFeatures(this.updateFeaturesList);
        onShowFeaturesById(this.updateFeaturesList);
        onShowAllFeatures(this.updateFeaturesList);

        this.$root.$on("updateFeaturesList", this.updateFeaturesList);

        this.distScoreLayer = await this.addNewLayerIfNotExists({layerName: "distance-score-features"});
        this.distScoreLayer.setVisible(true);
        this.distScoreLayer.setZIndex(22);
    },
    methods: {
        ...mapMutations("Tools/FeaturesList", Object.keys(mutations)),
        ...mapActions("Tools/FeaturesList", Object.keys(actions)),
        ...mapActions("Tools/DistanceScoreService", ["getDistanceScore", "getFeatureValues"]),
        ...mapActions("Tools", ["setToolActive"]),
        ...mapActions("Maps", ["removeHighlightFeature", "addNewLayerIfNotExists"]),
        ...mapActions("Tools/ChartGenerator", ["channelGraphData"]),
        ...chartMethods,

        getNumericalColumns () {
            const numCols = this.getActiveLayers().reduce((cols, mappingObj) => {
                const _numCols = mappingObj.numericalValues.map(v => ({
                    text: v.name,
                    value: v.id
                }));

                for (const col of _numCols) {
                    if (!cols.find(c => c.value === col.value)) {
                        cols.push(col);
                    }
                }
                return cols;
            }, []);

            // add divider to last col
            if (numCols.length > 0) {
                numCols[numCols.length - 1].divider = true;
            }

            if (this.items.length && typeof this.items[0]?.score?.value !== "undefined") {
                numCols.push({
                    text: this.$t("additional:modules.tools.cosi.featuresList.distanceScore"),
                    value: "distanceScore",
                    divider: true,
                    hasAction: true,
                    invertColor: true
                });
            }

            if (this.items.length) {
                this.wmsLayersInfo.forEach(info => {
                    if (Object.hasOwn(this.items[0], info.name)) {
                        numCols.push({
                            text: info.name,
                            value: info.name
                        });
                    }
                });
            }

            return numCols;
        },

        /**
         * Reads the active vector layers, constructs the list of table items and writes them to the store.
         * Finds the containing district from districtSelector for each feature
         * @todo connect to other features and statistics to build location score
         * @returns {void}
         */
        updateFeaturesList () {
            if (this.groupActiveLayer.length > 0) {
                this.items = this.activeVectorLayerList.reduce((list, vectorLayer) => {

                    const features = getLayerSource(vectorLayer)?.getFeatures() || [],
                        // only features that can be seen on the map
                        visibleFeatures = features.filter(this.isFeatureActive),
                        layerMap = this.layerMapById(vectorLayer.get("id")),
                        layerStyleFunction = vectorLayer.getStyleFunction?.();

                    list.push(...this.checkDisabledFeatures(vectorLayer));
                    return [...list, ...visibleFeatures.map((feature) => {
                        /**
                         * Set area attributes for polygons, where they are not set in the dataset
                         * @todo should go somewhere else...
                         */
                        setGeomAttributes(feature, this.geomAttributes);
                        return {
                            key: feature.getId(),
                            name: feature.get(layerMap.keyOfAttrName),
                            style: getFeatureStyle(feature, layerStyleFunction),
                            district: getContainingDistrictForFeature(this.selectedDistrictLevel, feature, false),
                            group: layerMap.group,
                            layerName: layerMap.id,
                            layerId: layerMap.layerId,
                            gfiAttributes: vectorLayer.values_.gfiAttributes,
                            type: feature.get(layerMap.categoryField),
                            address: layerMap.addressField.map(field => feature.get(field)).join(", "),
                            feature: feature,
                            enabled: true,
                            isSimulation: feature.get("isSimulation") || false,
                            isModified: feature.get("isModified") || false,
                            ...Object.fromEntries(layerMap.numericalValues.map(field => [field.id, feature.get(field.id)]))
                        };
                    })];
                }, []);
            }
            else {
                this.items = [];
            }
        },

        checkDisabledFeatures (layer) {
            return this.disabledFeatureItems.filter(item => item.layerId === layer.get("id"));
        },

        /**
         * Checks each table item for values to set specific css-classes for the row
         * @param {Object} item - the table item to check
         * @returns {String[]} an array of css-classes
         */
        getRowClasses (item) {
            const classes = [];

            if (item.isSimulation) {
                classes.push("light-green", "lighten-5");
            }
            // potentially add more conditionals here

            return classes;
        },

        handleClickRow (item) {
            if (item.enabled) {
                this.removeHighlightFeature();
                this.highlightVectorFeature(item.feature, item.layerId);
            }
        },

        updateFilterProps (newFilterProps) {
            this.filterProps = {
                ...this.filterProps,
                ...newFilterProps
            };
        },

        /**
         * @todo
         * @param {Object} item - the table item clicked
         * @returns {void}
         */
        editFeature (item) {
            console.warn(item, "not implemented");
        },

        /**
         * @todo
         * @param {Object} item - the table item clicked
         * @returns {void}
         */
        deleteFeature (item) {
            console.warn(item, "not implemented");
        },

        /**
         * Sets the filteredItems for export
         * @param {Object[]} items - the table items visible
         * @returns {void}
         */
        setFilteredItems (items) {
            this.filteredItems = items;
        },

        getActiveItems () {
            return this.items.filter(item => {
                if (this.search && !this.filteredItems.includes(item)) {
                    return false;
                }
                if (this.selected.length > 0 && !this.selected.includes(item)) {
                    return false;
                }
                if (this.layerFilter.length > 0 && !this.layerFilter.map(l => l.layerId).includes(item.layerId)) {
                    return false;
                }
                return true;
            });
        },

        getActiveDipasItems () {
            return this.getActiveItems().filter(item => {
                if (item.group === "DIPAS") {
                    return true;
                }
                return false;
            });
        },

        getActiveLayers () {
            return this.layerFilter.length > 0 ?
                this.flatActiveLayerMapping.filter(layerMap => this.layerFilter.map(l => l.layerId).includes(layerMap.layerId)) :
                this.flatActiveLayerMapping;
        },

        getActiveDipasLayers () {
            return this.sumUpLayers ?
                [
                    {
                        id: this.$t("additional:modules.tools.cosi.featuresList.dipas.allProjects"),
                        layerId: this.$t("additional:modules.tools.cosi.featuresList.dipas.allProjects")
                    }
                ] :
                this.getActiveLayers().filter(layer => layer.group === "DIPAS");
        },

        getActiveLayersWithNumValue (id) {
            return this.getActiveLayers().filter(layerMap => layerMap.numericalValues.map(numVal => numVal.id).includes(id));
        },

        /**
         * Export the table as XLSX
         * Either the simple view or incl. details
         * @param {Boolean} withDetails - whether to include the detailed feature data
         * @returns {void}
         */
        exportTable (withDetails) {
            const data = this.getActiveItems(),
                exportData = withDetails ? prepareDetailsExport(data, this.filterProps) : prepareTableExport(data),
                filename = composeFilename(this.$t("additional:modules.tools.cosi.featuresList.exportFilename"));

            exportXlsx(exportData, filename, {exclude: this.excludedPropsForExport});
        },

        /**
         * Toggle a feature on/off and emit the corresponding event to trigger uodated
         * @param {Object} featureItem - the item from the table
         * @returns {void}
         */
        toggleFeature (featureItem) {
            featureItem.enabled = !featureItem.enabled;
            this.toggleFeatureDisabled(featureItem);
            this.$root.$emit("updateFeature");
        },

        /**
         * Searches for any match in the table in all feature properties, not only the columns
         * @param {*} value - the value of the feature (not needed)
         * @param {String} search - the value to search for
         * @param {Object} item - the feature to search in
         * @return {Boolean} match or no match
         */
        searchAllAttributes (value, search, item) {
            const allProps = {...item.feature.getProperties(), ...item};

            return Object.values(allProps).some(v => v && v.toString().toLowerCase().includes(search.toLowerCase()));
        },

        getNumericalValueColor (item, key, invertColor) {
            const maxVal = Math.max(
                ...this.items
                    .map(_item => parseFloat(_item[key]))
                    .filter(_item => !isNaN(_item))
            );
            let val = parseFloat(item[key]) / maxVal;

            if (invertColor) {
                val = 1 - val;
            }

            if (isNaN(val)) {
                return "grey";
            }

            if (val > 0.9) {
                return "purple";
            }
            if (val > 0.8) {
                return "indigo";
            }
            if (val > 0.7) {
                return "blue";
            }
            if (val > 0.6) {
                return "cyan";
            }
            if (val > 0.5) {
                return "teal";
            }
            if (val > 0.4) {
                return "green";
            }
            if (val > 0.4) {
                return "light-green";
            }
            if (val > 0.2) {
                return "lime";
            }
            if (val > 0.1) {
                return "amber";
            }
            return "red";
        },
        getNumericalValueStyle (item, key) {
            const val = parseFloat(item[key]),
                maxVal = Math.max(
                    ...this.items
                        .map(_item => parseFloat(_item[key]))
                        .filter(_item => !isNaN(_item))
                );

            return {
                padding: 0,
                height: "10px",
                width: Math.round(100 * val / maxVal) + "%"
            };
        },

        getDistrictsAndTypes (items) {
            const
                districts = {},
                types = {};

            for (const layerMap of this.flatActiveLayerMapping) {
                districts[layerMap.layerId] = [];
                types[layerMap.layerId] = [];

                for (const item of items.filter(el => el.layerId === layerMap.layerId)) {
                    if (!districts[layerMap.layerId].includes(item.district)) {
                        districts[layerMap.layerId].push(item.district);

                    }
                    if (!types[layerMap.layerId].includes(item.type)) {
                        types[layerMap.layerId].push(item.type);
                    }
                }

                districts[layerMap.layerId].sort();
                types[layerMap.layerId].sort();
            }

            return {districts, types};
        },

        showDistanceScoreFeatures () {
            if (this.distScoreLayer === null || this.selected.length === 0 || !this.selected[0].score) {
                if (this.distScoreLayer) {
                    this.distScoreLayer.getSource().clear();
                }
                return;
            }

            const test = Object.keys(this.selected[0].score.distance.facilities),
                colorMap = test.reduce((acc, layerId, index) => (
                    {...acc, [layerId]: getColorFromNumber(index, test.length)}), {});

            this.selected.forEach(item => {
                if (item.score.distance) {
                    for (const [layerId, entry] of Object.entries(item.score.distance.facilities)) {
                        if (entry.feature) {
                            const feature = new Feature({geometry: entry.feature.getGeometry()});

                            feature.set("styleId", entry.feature.getId() + "-ds");
                            feature.setStyle(new Style({
                                image: new Circle({
                                    radius: 5,
                                    fill: new Fill({color: colorMap[layerId]})
                                }),
                                text: new Text({
                                    text: entry.layerName,
                                    placement: "point",
                                    offsetY: -10,
                                    offsetX: 10,
                                    font: "12px Calibri, sans-serif",
                                    fill: new Fill({
                                        color: [255, 2550, 255]
                                    }),
                                    stroke: new Stroke({
                                        color: [0, 0, 0],
                                        width: 1
                                    })
                                })
                            }));
                            this.distScoreLayer.getSource().addFeature(feature);
                        }
                    }
                }
            });
        },
        updateItems (items) {
            this.items = items;

            // set the selected items on the updated list
            this.selected = this.selected.map(sel => this.items.find(item => item.key === sel.key));
        },
        highlightVectorFeature,
        openTimeSeriesAnalyse () {
            this.setToolActive({id: "TimeSeriesAnalyse", active: true});
            this.setShow(false);
        },
        /**
         * To show or hide the featureList tool
         * @return {void}
         */
        toggleTool () {
            this.setShow(!this.show);
        },

        setLayerFilter (value) {
            this.layerFilter = value;
        },
        setSearch (value) {
            this.search = value;
        }
    }
};
</script>

<template lang="html">
    <Tool
        ref="tool"
        :class="show ? 'show' : 'hide'"
        :title="$t('additional:modules.tools.cosi.featuresList.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template
            v-if="active"
            #toolBody
        >
            <div v-if="isTimeSeriesAnalyseShow">
                <v-btn
                    class="ma-2 time-series"
                    color="success"
                    :title="$t('additional:modules.tools.cosi.timeSeriesAnalyse.title')"
                    @click="openTimeSeriesAnalyse"
                    @keydown="openTimeSeriesAnalyse"
                >
                    {{ $t('additional:modules.tools.cosi.timeSeriesAnalyse.title') }}
                </v-btn>
            </div>
            <div
                v-if="isTimeSeriesAnalyseShow"
                class="toggle"
                role="button"
                tabindex="0"
                @click="toggleTool"
                @keydown="toggleTool"
            >
                <span
                    :class="show ? 'bi bi-chevron-double-right': 'bi bi-chevron-double-left'"
                    :title="show ? $t('additional:modules.tools.cosi.featuresList.hide') : $t('additional:modules.tools.cosi.featuresList.show')"
                />
            </div>
            <ToolInfo
                :url="readmeUrl"
                :locale="currentLocale"
            />
            <v-app id="features-list-wrapper">
                <FeaturesListToolbar
                    :filter-items="groupActiveLayer"
                    :show-dipas-button="dipasInFeaturesList"
                    @setLayerFilter="setLayerFilter"
                    @setSearch="setSearch"
                    @createCharts="createCharts"
                    @createDipasCharts="createDipasCharts"
                    @exportTable="exportTable"
                />
                <v-divider />
                <div id="features-list">
                    <form class="features-list-table-wrapper">
                        <div class="features-list-table">
                            <v-data-table
                                v-model="selected"
                                :headers="columns"
                                :items="items"
                                :search="search"
                                :custom-filter="searchAllAttributes"
                                :expanded.sync="expanded"
                                multi-sort
                                item-key="key"
                                show-select
                                fixed-header
                                show-expand
                                :items-per-page="10"
                                :footer-props="{
                                    itemsPerPageText: $t('additional:modules.tools.cosi.featuresList.itemsPerPage'),
                                    itemsPerPageAllText: $t('additional:modules.tools.cosi.featuresList.itemsPerPageAll')
                                }"
                                :item-class="getRowClasses"
                                @click:row="handleClickRow"
                                @current-items="setFilteredItems"
                            >
                                <template #expanded-item="{ headers, item }">
                                    <td
                                        class="detail-view"
                                        :colspan="headers.length"
                                    >
                                        <DetailView
                                            :item="item"
                                            :prop-blacklist="propBlacklist"
                                            :filter-props="filterProps"
                                            @filterProps="updateFilterProps"
                                        />
                                    </td>
                                </template>
                                <template #[`item.warning`]="{ item }">
                                    <v-icon
                                        v-if="item.isModified"
                                        :title="$t('additional:modules.tools.cosi.featuresList.warningIsModified')"
                                    >
                                        mdi-alert
                                    </v-icon>
                                    <v-icon
                                        v-if="item.isSimulation"
                                        :title="$t('additional:modules.tools.cosi.featuresList.warningIsSimulated')"
                                    >
                                        mdi-sprout
                                    </v-icon>
                                </template>
                                <template #[`item.style`]="{ item }">
                                    <FeatureIcon :item="item" />
                                </template>
                                <template #[`item.enabled`]="{ item }">
                                    <div class="text-center">
                                        <v-icon
                                            right
                                            class="featureToggle"
                                            @click="toggleFeature(item)"
                                        >
                                            {{ item.enabled ? 'mdi-eye' : 'mdi-eye-off' }}
                                        </v-icon>
                                    </div>
                                </template>
                                <template
                                    v-for="col in numericalColumns"
                                    #[`item.${col.value}`]="{ item }"
                                >
                                    <!-- eslint-disable-next-line vue/no-multiple-template-root -->
                                    <template v-if="!isNaN(parseFloat(item[col.value]))">
                                        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                                        <div
                                            :key="col.value"
                                            class="text-right"
                                            role="button"
                                            tabindex="0"
                                            :class="col.hasAction ? 'number-action' : ''"
                                            @click="col.hasAction ? showDistanceScoreForItem(item) : null"
                                            @keydown="col.hasAction ? showDistanceScoreForItem(item) : null"
                                        >
                                            <div>
                                                {{ parseFloat(item[col.value]).toLocaleString(currentLocale) }}
                                                {{ item[col] }}
                                            </div>
                                            <div>
                                                <v-chip
                                                    :style="getNumericalValueStyle(item, col.value)"
                                                    :color="getNumericalValueColor(item, col.value, col.invertColor)"
                                                    dark
                                                    dense
                                                />
                                            </div>
                                        </div>
                                    </template>
                                </template>
                            </v-data-table>
                        </div>
                    </form>
                </div>
                <FeaturesScore
                    v-if="distanceScoreEnabled"
                    :grouped-layer="mapping"
                    :feature-list="items"
                    @showDistanceScoreHistogram="showDistanceScoreHistogram"
                    @showDistanceScoresForSelected="showDistanceScoresForSelected"
                    @updateItems="updateItems"
                />
            </v-app>
            <div class="mini-sidebar" />
        </template>
    </Tool>
</template>

<style lang="scss">
    @import "../../utils/variables.scss";
    @import "~variables";

    #features-list-wrapper {
        font-family: $font_family_default;
        // height: 100%;
        position: relative;

        .v-input {
            border-radius: $border-radius-base;
            font-size: 14px;
            .v-label {
                font-size: 14px;
            }
        }

        .v-divider {
            border-color: $light_grey;
        }

        button {
            text-transform: inherit;
            font-family: $font_family_accent;
        }
    }
    #features-list {
        height: 100%;
        .features-list-table-wrapper {
        //    height: calc(100% - 220px);
            display: block;
            position: relative;
           .features-list-table {
               height: 100%;
               margin-bottom: 30px;
               .v-data-table {
                   height: 100%;
                   .v-data-table__wrapper {
                    overflow-x: auto;
                    overflow-y: auto;
                    max-height: 70vh;
                    background-color: white;
                   }
                   td.detail-view {
                       .v-data-table__wrapper {
                           overflow-y: hidden;
                       }
                   }
               }
           }
        }
        .detail-view {
            padding: 0;
        }
        .selection {
            width: 40%;
        }
        .number-action{
            cursor: pointer;
        }
    }
</style>

<style lang="scss" scoped>
    @import "../../utils/variables.scss";
    .show {
        .mini-sidebar {
            display: none;
        }
    }
    .hide {
        .mini-sidebar {
            position: absolute;
            width: 80px;
            height: 100%;
            background-color: $green;
            left: 0;
            top: 0;
            z-index: 10;
        }
        .toggle {
            z-index: 11;
            right: 0px;
        }
    }
    .theme--light.v-btn.v-btn--has-bg.time-series {
        background-color: $green;
        color: #000000;
        position: absolute;
        height: 30px;
        top: 12px;
    }
    .toggle {
        position: absolute;
        right: 15px;
        top: 11px;
        padding: 0 10px;
        cursor: pointer;
        span {
            font-size: 30px;
        }
    }
</style>
