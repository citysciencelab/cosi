<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import TableComponent from "../../../src/share-components/table/components/TableComponent.vue";
import {getComponent} from "../../../src/utils/getComponent";
import isObject from "../../../src/utils/isObject";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import getters from "../store/gettersStatisticDashboard";
import GridComponent from "./StatisticGridComponent.vue";
import mutations from "../store/mutationsStatisticDashboard";
import Controls from "./StatisticDashboardControls.vue";
import StatisticFilter from "./StatisticDashboardFilter.vue";
import LegendComponent from "./StatisticDashboardLegend.vue";
import FetchDataHandler from "../utils/fetchData.js";
import StatisticsHandler from "../utils/handleStatistics.js";
import FeaturesHandler from "../utils/handleFeatures.js";
import StatisticSwitcher from "./StatisticDashboardSwitcher.vue";
import {rawLayerList} from "@masterportal/masterportalapi";
import {getFeaturePOST} from "../../../src/api/wfs/getFeature";
import ChartProcessor from "../utils/chartProcessor.js";
import {
    and as andFilter,
    equalTo as equalToFilter,
    or as orFilter
} from "ol/format/filter";
import dayjs from "dayjs";
import WFS from "ol/format/WFS";
import {sort} from "../../../src/utils/sort";

export default {
    name: "StatisticDashboard",
    components: {
        ToolTemplate,
        TableComponent,
        GridComponent,
        Controls,
        StatisticFilter,
        StatisticSwitcher,
        LegendComponent
    },
    data () {
        return {
            tableData: [],
            testFixedData: {
                items: []
            },
            selectMode: "column",
            showHeader: true,
            sortable: true,
            categories: null,
            statisticsByCategory: false,
            loadedFilterData: false,
            loadedReferenceData: false,
            loadedFeatures: [],
            timeStepsFilter: [],
            regions: [],
            allRegions: [],
            areCategoriesGrouped: false,
            dates: [],
            selectedLevel: undefined,
            sortedRows: [],
            currentChart: {},
            chartCounts: 0,
            showGrid: false,
            referenceData: undefined,
            referenceFeatures: {},
            selectedColumn: undefined,
            colorArrayDifference: ["#E28574", "#89C67F"],
            legendValue: []
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters)),
        ...mapGetters("Maps", ["projection"]),

        /**
         * Gets the names of the selected statistics.
         * @returns {String[]} The names.
         */
        selectedStatisticsNames () {
            return Object.values(this.selectedStatistics).map(statistic => statistic?.name);
        },
        /**
         * Gets the Descriptions of the selected statistics.
         * @returns {Object[]} The Descriptions.
         */
        controlDescription () {
            if (!this.hasDescription(this.selectedStatistics)) {
                return [];
            }
            return this.setDescriptionsOfSelectedStatistics(this.selectedStatistics);
        },
        /**
         * Gets the buttons with group regions
         * @returns {Object[]} The button group regions
         */
        buttonGroupRegions () {
            if (!Array.isArray(this.data) || !this.data.length) {
                return [];
            }

            return this.data.map(value => {
                return {name: value?.levelName};
            });
        },
        /**
         * Checks if the chart should be shown.
         * @returns {Boolean} true if it should shows the chart, false otherwise.
         */
        showChart () {
            return this.chartTableToggle === "chart";
        },
        /**
         * Checks if the table should be shown.
         * @returns {Boolean} true if it should shows the table, false otherwise.
         */
        showTable () {
            return this.chartTableToggle === "table";
        }
    },
    watch: {
        selectedReferenceData () {
            // this.checkFilterSettings(this.selectedRegionsValues, this.selectedDatesValues, this.selectedReferenceData);
            // why??
            this.checkFilterSettings(getters.selectedRegionsValues(null, {selectedRegions: this.selectedRegions}), getters.selectedDatesValues(null, {selectedDates: this.selectedDates}), this.selectedReferenceData);
        },
        active (value) {
            if (!value) {
                Object.values(this.currentChart).forEach(chart => {
                    if (typeof chart?.chart?.destroy === "function") {
                        chart.chart.destroy();
                    }
                });
            }
            else if (this.selectedStatisticsNames?.length
                && this.selectedRegionsValues?.length
                && this.selectedDatesValues?.length
            ) {
                this.handleChartData(
                    this.selectedStatisticsNames,
                    this.selectedRegionsValues,
                    this.selectedDatesValues,
                    this.statisticsData,
                    this.selectedReferenceData?.type
                );
            }
        },
        legendData (val) {
            this.legendValue = FeaturesHandler.getLegendValue(val);
        }
    },
    async created () {
        this.$on("close", this.close);
        this.layer = await this.addNewLayerIfNotExists({layerName: "statistic-dashboard"});
    },
    mounted () {
        this.selectedLevel = this.data[0];
        this.initializeData(this.selectedLevel);
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),
        ...mapActions("Maps", ["addNewLayerIfNotExists"]),

        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Gets the unique values for the inputs of the filter for the given level.
         * @param {Object} level The level to get the unique values for.
         * @param {Object} level.mappingFilter The mapping object which holds the configuration of the time attribute and region name attribute.
         * @param {Object} level.timeAttribute The config object for the time attribute.
         * @param {String} level.timeAttribute.attrName The attrName of the time attribute.
         * @param {String} level.timeAttribute.inputFormat The format of the incoming date.
         * @param {String} level.timeAttribute.outputFormat The format in which the date should be displayed to the user.
         * @param {Object} level.regionNameAttribute The config object of the region name attribute.
         * @param {String} level.regionNameAttribute.attrName The attrName of the region name attribute.
         * @returns {Object} An object with the time and region attrName as key and an unique value list as value.
         */
        async getUniqueValuesForLevel (level) {
            if (!isObject(level) || !isObject(level.mappingFilter) || !isObject(level.mappingFilter.timeAttribute) || !isObject(level.mappingFilter.regionNameAttribute)) {
                return {};
            }
            const layerId = level.layerId,
                timeAttribute = level.mappingFilter.timeAttribute.attrName,
                timeInputFormat = level.mappingFilter.timeAttribute.inputFormat,
                timeOutputFormat = level.mappingFilter.timeAttribute.outputFormat,
                regionNameAttribute = level.mappingFilter.regionNameAttribute.attrName;
            let uniqueValues = null;

            uniqueValues = await FetchDataHandler.getUniqueValues(layerId, [timeAttribute, regionNameAttribute], timeInputFormat, timeOutputFormat);
            return uniqueValues;
        },

        /**
         * Gets the time steps for the filter. It will merge the unique list with the given
         * configured time steps if they are configured.
         * @param {Object} timeSteps The time steps object with {Number: Label}.
         * @param {Object} uniqueList The list as object with {value: true}.
         * @param {String} inputFormat The input format for the date.
         * @param {String} outputFormat The format to transform the date to.
         * @returns {Object[]} The merged time steps.
         */
        getTimestepsMerged (timeSteps, uniqueList, inputFormat, outputFormat) {
            let result = [],
                uniqueListAsArray = [];

            if (isObject(uniqueList)) {
                uniqueListAsArray = Object.keys(uniqueList);
                uniqueListAsArray.forEach(uniqueTime => {
                    result.push({value: uniqueTime, label: dayjs(uniqueTime, inputFormat).format(outputFormat)});
                });
            }
            if (isObject(timeSteps)) {
                Object.entries(timeSteps).forEach(([key, value]) => {
                    const uniqueTime = key === "all" ? uniqueListAsArray : uniqueListAsArray.slice(Number(`-${key}`));

                    if (Array.isArray(uniqueTime) && uniqueTime.length) {
                        result.push({value: uniqueTime, label: value});
                    }
                });
            }

            result = sort("", result, "label").reverse();

            return result;
        },
        /**
         * Get the direction of the bar chart.
         * @param {String[]} regions - The selected regions for the statistic(s).
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {String} horizontal or vertical.
         */
        getChartDirection (regions, differenceMode) {
            const regionsLength = differenceMode === false ? regions.length : regions.length - 1,
                chartDirectionValue = this.selectedLevel?.chartDirectionValue ? this.selectedLevel?.chartDirectionValue : 5;

            return regionsLength < chartDirectionValue ? "vertical" : "horizontal";
        },

        /**
         * Gets all regions list with all option
         * @param {String[]} regions The regions.
         * @returns {Object[]} All regions
         */
        getAllRegions (regions) {
            const result = [];

            if (!Array.isArray(regions) || !regions.length) {
                return [];
            }

            result.push({value: regions, label: "Alle Gebiete"});

            regions.forEach(region => {
                result.push({value: region, label: region});
            });

            return result;
        },

        /**
         * Sets the statistics selected in the filter.
         * @param {String} categoryName - The category name.
         * @returns {void}
         */
        setStatisticsByCategory (categoryName) {
            this.statisticsByCategory = StatisticsHandler.getStatisticsByCategory(categoryName, this.getSelectedLevelStatisticsAttributes(this.selectedLevel));
        },

        /**
         * Sets the sorted rows.
         * @param {Array[]} value - An array of arrays of sorted rows.
         * @returns {void}
         */
        setSortedRows (value) {
            this.sortedRows = value;
        },

        /**
         * Checks if there is a reference value for the regions or dates and merges them.
         * @param {String[]} regions - The selected regions for the statistic(s).
         * @param {String[]} dates - The selected dates for the statistic(s).
         * @param {Object} referenceData - The selected reference data.
         * @returns {void}
         */
        checkFilterSettings (regions, dates, referenceData) {
            if (!isObject(referenceData)) {
                this.handleFilterSettings(regions, dates, false);
                return;
            }
            if (typeof referenceData.value === "string") {
                regions.push(referenceData.value);
                this.handleFilterSettings([...new Set(regions)], dates, "region");
            }
            else if (isObject(referenceData.value) && typeof referenceData.value.label === "string") {
                dates.push(referenceData.value.value);
                this.handleFilterSettings(regions, [...new Set(dates)], "date");
            }
        },

        /**
         * Updates the features displayed on the map and their styles.
         * @param {String} date - The chosen date from the column.
         * @param {Boolean} differenceMode - true if difference mode is on otherwise false.
         * @param {Object} [selectedReferenceData] - The selected reference data.
         * @returns {void}
         */
        updateFeatureStyle (date, differenceMode, selectedReferenceData) {
            this.layer.getSource().clear();
            const regionNameAttribute = this.getSelectedLevelRegionNameAttribute(this.selectedLevel).attrName,
                selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(this.selectedLevel),
                filteredFeatures = FeaturesHandler.filterFeaturesByKeyValue(this.loadedFeatures, selectedLevelDateAttribute.attrName, date);

            this.layer.getSource().addFeatures(filteredFeatures);

            if (!differenceMode) {
                FeaturesHandler.styleFeaturesByStatistic(filteredFeatures, this.statisticsData[this.selectedStatisticsNames[0]], this.colorScheme.comparisonMap, date, regionNameAttribute);
                this.setLegendData({
                    "color": this.colorScheme.comparisonMap,
                    "value": FeaturesHandler.getStepValue(this.statisticsData[this.selectedStatisticsNames[0]], this.colorScheme.comparisonMap, date)
                });
                return;
            }
            FeaturesHandler.styleFeaturesByStatistic(filteredFeatures, this.statisticsData[this.selectedStatisticsNames[0]], this.colorScheme.differenceMap, date, regionNameAttribute);
            this.setLegendData({
                "color": this.colorScheme.differenceMap,
                "value": FeaturesHandler.getStepValue(this.statisticsData[this.selectedStatisticsNames[0]], this.colorScheme.differenceMap, date)
            });
            if (selectedReferenceData?.type === "region") {
                const referenceFeature = filteredFeatures.find(feature => feature.get(regionNameAttribute) === selectedReferenceData.value);

                FeaturesHandler.styleFeature(referenceFeature, this.colorScheme.referenceRegion);
            }
        },

        /**
         * Updates the created reference tag.
         * @param {String} date the selected date
         * @param {Object} selectedLevel the selected level
         * @param {Object} referenceFeatures the selected region reference
         * @returns {void}
         */
        updateReferenceTag (date, selectedLevel, referenceFeatures) {
            if (typeof date !== "undefined" && isObject(selectedLevel) && isObject(referenceFeatures)) {
                const selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(selectedLevel);

                if (isObject(selectedLevelDateAttribute)) {
                    Object.entries(referenceFeatures).forEach(([key, val]) => {
                        const formattedDate = dayjs(key).format(selectedLevelDateAttribute.outputFormat);

                        if (formattedDate === date) {
                            this.setSelectedReferenceValueTag(val);
                        }
                    });
                }
            }
        },

        /**
         * Set the selected table column.
         * @param {String} value - The selected column (date).
         * @returns {void}
         */
        setSelectedColumn (value) {
            if (this.selectedReferenceData?.type === "region") {
                this.updateReferenceTag(value, this.selectedLevel, this.referenceFeatures);
            }

            this.selectedColumn = value;
            if (typeof this.selectedReferenceData !== "undefined") {
                this.updateFeatureStyle(value, true, this.selectedReferenceData);
            }
            else {
                this.updateFeatureStyle(value, false);
            }
        },

        /**
         * Handles the filter settings and starts a POST request based on given settings.
         * @param {String[]} regions - The selected regions for the statistic(s).
         * @param {String[]} dates - The selected dates for the statistic(s).
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {void}
         */
        async handleFilterSettings (regions, dates, differenceMode) {
            const statsKeys = StatisticsHandler.getStatsKeysByName(this.statisticsByCategory, this.selectedStatisticsNames),
                selectedLayer = this.getRawLayerByLayerId(this.selectedLevel.layerId),
                selectedLevelRegionNameAttribute = this.getSelectedLevelRegionNameAttribute(this.selectedLevel),
                selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(this.selectedLevel),
                payload = {
                    featureTypes: [selectedLayer.featureType],
                    featureNS: selectedLayer.featureNS,
                    srsName: this.projection.getCode(),
                    propertyNames: [...statsKeys, selectedLevelRegionNameAttribute.attrName, selectedLevelDateAttribute.attrName, this.selectedLevel.geometryAttribute],
                    filter: this.getFilter(regions, dates)
                },
                response = await getFeaturePOST(selectedLayer.url, payload, error => {
                    console.error(error);
                });

            this.loadedFeatures = new WFS().readFeatures(response);

            if (differenceMode) {
                this.referenceFeatures = {};
            }

            this.statisticsData = this.prepareStatisticsData(this.loadedFeatures, this.selectedStatisticsNames, regions, dates, selectedLevelDateAttribute, selectedLevelRegionNameAttribute, differenceMode);
            this.tableData = this.getTableData(this.statisticsData);
            this.chartCounts = this.selectedStatisticsNames.length;
            this.handleChartData(this.selectedStatisticsNames, regions, dates, this.statisticsData, differenceMode);

            if (this.selectedStatisticsNames.length === 1) {
                this.updateFeatureStyle(this.selectedColumn || dates[0], differenceMode, this.selectedReferenceData);
            }
            else {
                this.layer.getSource().clear();
                const filteredFeatures = FeaturesHandler.filterFeaturesByKeyValue(this.loadedFeatures, selectedLevelDateAttribute.attrName, this.selectedColumn || dates[0]);

                this.layer.getSource().addFeatures(filteredFeatures);

                filteredFeatures.map(feature => {
                    return FeaturesHandler.styleFeature(feature);
                });
            }
        },

        /**
         * Handles chart data and resets the showGrid property.
         * @param {String[]} filteredStatistics The statistics.
         * @param {String[]} regions The regions.
         * @param {String[]} dates The dates.
         * @param {Object} preparedData The prepared data.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {void}
         */
        handleChartData (filteredStatistics, regions, dates, preparedData, differenceMode) {
            const directionBarChart = this.getChartDirection(regions, differenceMode);

            this.showGrid = false;
            if (filteredStatistics.length > 1) {
                this.prepareGridCharts(filteredStatistics, preparedData, directionBarChart, differenceMode, dates.length >= 2 && !differenceMode || dates.length >= 3 || dates.length === 2 && differenceMode === "region");
            }
            else if (regions.length >= 1) {
                this.$nextTick(() => {
                    if (dates.length >= 2 && !differenceMode || dates.length >= 3 || dates.length === 2 && differenceMode === "region") {
                        this.prepareChartData(filteredStatistics[0], preparedData[filteredStatistics[0]], undefined, "line", differenceMode);
                        return;
                    }
                    this.prepareChartData(filteredStatistics[0], preparedData[filteredStatistics[0]], undefined, "bar", directionBarChart, differenceMode);
                });
            }
        },
        /**
         * Prepares the charts for the grid and also creates canvas elements for each chart to render on.
         * @param {String[]} filteredStatistics The statistics.
         * @param {Object} preparedData The prepared data.
         * @param {String[]} direction - Direction of bar chart.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @param {Boolean} renderAsLine Flag to render line charts. Default is false.
         * @returns {void}
         */
        prepareGridCharts (filteredStatistics, preparedData, direction, differenceMode, renderAsLine = false) {
            this.showGrid = true;
            this.$nextTick(() => {
                filteredStatistics.forEach((statistic, idx) => {
                    const ctx = this.$refs[`chart${idx + 1}`],
                        ctxInModal = this.$refs[`chart-modal-${idx + 1}`];

                    if (renderAsLine) {
                        this.prepareChartData(statistic, preparedData[statistic], ctx, "line", undefined, differenceMode, true);
                        this.prepareChartData(statistic, preparedData[statistic], ctxInModal, "line", undefined, differenceMode, false, true);
                        return;
                    }
                    this.prepareChartData(statistic, preparedData[statistic], ctx, "bar", direction, differenceMode, true);
                    this.prepareChartData(statistic, preparedData[statistic], ctxInModal, "bar", direction, differenceMode, false, true);
                });
            });
        },
        /**
         * Prepares the chart and also handles the destruction of previous charts.
         * @param {String} topic The topic of the chart.
         * @param {Object} preparedData The data.
         * @param {HTMLElement} canvas The canvas to render the chart on.
         * @param {String} type The type. Can be bar or line.
         * @param {String} direction The direction of the bar chart.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @param {Boolean} renderSimple true if should be rendered as simple chart because its in the grid. Default is false.
         * @param {Boolean} renderToModal true if chart is rendered in modal. Default is false
         * @returns {void}
         */
        prepareChartData (topic, preparedData, canvas, type, direction, differenceMode, renderSimple = false, renderToModal = false) {
            const chart = canvas || this.$refs.chart,
                uniqueTopic = renderToModal ? `modal-${topic}` : topic;

            if (typeof this.currentChart[uniqueTopic] !== "undefined") {
                this.currentChart[uniqueTopic].chart.destroy();
            }
            this.currentChart[uniqueTopic] = {};
            if (type === "line") {
                this.currentChart[uniqueTopic].chart = ChartProcessor.createLineChart(topic, preparedData, chart, this.colorScheme.lineCharts, renderSimple);
            }
            else if (type === "bar") {
                if (typeof differenceMode === "string") {
                    this.currentChart[uniqueTopic].chart = ChartProcessor.createBarChart(topic, preparedData, direction, chart, renderSimple, this.colorArrayDifference);
                }
                else {
                    this.currentChart[uniqueTopic].chart = ChartProcessor.createBarChart(topic, preparedData, direction, chart, renderSimple);
                }
            }
        },

        /**
         * Gets the filter based on given regions and dates array.
         * Gets an Or Filter if one of them has more than one entry.
         * Gets an And Filter if both of them has entries.
         * Gets an EqualTo Filter if one of them has only one entry.
         * @param {String[]} regions The regions.
         * @param {String[]} dates The dates.
         * @returns {ol/format/filter} The filter.
         */
        getFilter (regions, dates) {
            if (!Array.isArray(regions) || !Array.isArray(dates)) {
                return undefined;
            }
            const regionAttrName = this.getSelectedLevelRegionNameAttribute(this.selectedLevel)?.attrName,
                dateAttrName = this.getSelectedLevelDateAttribute(this.selectedLevel)?.attrName;

            if (regions.length === this.regions.length) {
                if (dates.length === this.dates.length) {
                    return undefined;
                }
                return this.getFilterForList(dates, dateAttrName);
            }
            else if (dates.length === this.dates.length) {
                return this.getFilterForList(regions, regionAttrName);
            }
            return andFilter(this.getFilterForList(dates, dateAttrName), this.getFilterForList(regions, regionAttrName));
        },
        /**
         * Gets the filter for given list and property.
         * If given list has more than one entry the function returns an
         * Or Filter otherwise an EqualTo Filter.
         * @param {String[]} list The list to create a filter for.
         * @param {String} propertyName The propertyName to create a filter for.
         * @returns {ol/format/filter} The filter.
         */
        getFilterForList (list, propertyName) {
            if (!Array.isArray(list) || typeof propertyName !== "string") {
                return undefined;
            }

            const filterArray = list.map(entry => equalToFilter(propertyName, entry));

            return filterArray.length > 1 ? orFilter(...filterArray) : filterArray[0];
        },

        /**
         * Gets the data for the table from the prepared statistics.
         * @param {Object} statisticsData - Prepared statistical data.
         * @returns {Object[]} Data for table with header and items.
         */
        getTableData (statisticsData) {
            const headers = [],
                data = [];

            Object.keys(statisticsData).forEach(statData => {
                const items = [];

                Object.entries(statisticsData[statData]).forEach(([region, years]) => {
                    items.push([region, ...Object.values(years).reverse()]);
                    if (headers.length === 0) {
                        headers.push("Gebiet", ...Object.keys(years).reverse());
                    }
                });
                data.push({
                    headers,
                    items
                });
            });
            return data;
        },

        /**
         * Prepares the statistical data from the features.
         * @param {ol/Feature[]} features - The features.
         * @param {String[]} statistics - The key to the statistic whose value is being looked for.
         * @param {String[]} regions - The regions of the statistic wanted.
         * @param {String[]} dates - The dates of the statsitic wanted.
         * @param {String} dateAttribute - The configured date attribute.
         * @param {String} regionAttribute - The configured region attribute.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {Object} The prepared statistical data.
         */
        prepareStatisticsData (features, statistics, regions, dates, dateAttribute, regionAttribute, differenceMode) {
            const data = {};

            statistics.forEach(stat => {
                const statsKey = StatisticsHandler.getStatsKeysByName(this.statisticsByCategory, [stat])[0];

                data[stat] = {};
                regions.forEach(region => {
                    if (region === this.selectedReferenceData?.value) {
                        return;
                    }
                    data[stat][region] = {};
                    dates.forEach(date => {
                        if (date === this.selectedReferenceData?.value?.value) {
                            return;
                        }
                        const formatedDate = dayjs(date).format(dateAttribute.outputFormat),
                            regionKey = regionAttribute.attrName,
                            dateKey = dateAttribute.attrName;

                        data[stat][region][formatedDate] = this.getStatisticValue(features, statsKey, region, regionKey, date, dateKey, differenceMode);
                    });
                });
            });
            return data;
        },

        /**
         * Finds the feature based on the region and the date.
         * Returns the corresponding value of the passed statistic from the feature.
         * @param {ol/Feature[]} features - The features.
         * @param {String[]} statisticKey - The key to the statistic whose value is being looked for.
         * @param {String} region - The region of the statistic wanted.
         * @param {String} regionKey - The key to the region.
         * @param {String} date - The date of the statsitic wanted.
         * @param {String} dateKey - The key to the date.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {String} The value of the given statistic.
         */
        getStatisticValue (features, statisticKey, region, regionKey, date, dateKey, differenceMode) {
            const foundFeature = this.findFeatureByDateAndRegion(features, region, regionKey, date, dateKey);
            let refFeature = null,
                value = NaN;

            if (differenceMode !== "date" && differenceMode !== "region" || !this.selectedReferenceData) {
                return parseInt(foundFeature?.get(statisticKey), 10) || "-";
            }

            if (differenceMode === "date") {
                refFeature = this.findFeatureByDateAndRegion(features, region, regionKey, this.selectedReferenceData.value.value, dateKey);
                value = parseInt(foundFeature?.get(statisticKey), 10) - parseInt(refFeature?.get(statisticKey), 10);
                this.setSelectedReferenceValueTag("");

                return isNaN(value) ? "-" : value;
            }
            refFeature = this.findFeatureByDateAndRegion(features, this.selectedReferenceData.value, regionKey, date, dateKey);
            value = parseInt(foundFeature?.get(statisticKey), 10) - parseInt(refFeature?.get(statisticKey), 10);

            this.referenceFeatures[date] = parseInt(refFeature?.get(statisticKey), 10);
            this.setSelectedReferenceValueTag(parseInt(refFeature?.get(statisticKey), 10));

            return isNaN(value) ? "-" : value;
        },

        /**
         * Finds a feature by the given region and date.
         * @param {ol/Feature[]} features - The features.
         * @param {String} region - The region value.
         * @param {String} regionKey - The key to the region.
         * @param {String} date - The date value.
         * @param {String} dateKey - The key to the date.
         * @returns {ol/Feature} The found feature.
         */
        findFeatureByDateAndRegion (features, region, regionKey, date, dateKey) {
            return features.find(feature => {
                return feature.get(regionKey) === region && feature.get(dateKey) === date;
            });
        },

        /**
         * Gets the currently selected layer by the given level.
         * @param {String} layerId The layer id.
         * @returns {Object} The layer.
         */
        getRawLayerByLayerId (layerId) {
            return rawLayerList.getLayerWhere({id: layerId}) || {};
        },

        /**
         * Gets the region attribute object by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The region attribute object.
         */
        getSelectedLevelRegionNameAttribute (level) {
            return level?.mappingFilter?.regionNameAttribute || {};
        },

        /**
         * Gets the date attribute by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The time attribute object.
         */
        getSelectedLevelDateAttribute (level) {
            return level?.mappingFilter?.timeAttribute || {};
        },

        /**
         * Gets the statistic attributes by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The statistics attribute object.
         */
        getSelectedLevelStatisticsAttributes (level) {
            return level?.mappingFilter.statisticsAttributes || {};
        },

        /**
         * Toggles between chart and table.
         * @returns {void}
         */
        toggleChartTable () {
            this.setChartTableToggle(this.chartTableToggle === "table" ? "chart" : "table");
        },
        /**
         * Reset tables and charts.
         * @returns {void}
         */
        handleReset () {
            this.layer.getSource().clear();
            this.tableData = [];
            Object.values(this.currentChart).forEach(val => {
                val.chart.destroy();
            });
            this.currentChart = {};
            this.showGrid = false;
            this.legendValue = [];
        },
        /**
         * Checks if at least one description is present in the statistics.
         * @param {Object} statistics - The selected statistics.
         * @returns {Boolean} true if a description is present.
         */
        hasDescription (statistics) {
            let isDescriptionAvailable = false;

            Object.values(statistics).forEach(stat => {
                if (Object.prototype.hasOwnProperty.call(stat, "description")) {
                    isDescriptionAvailable = true;
                }
            });
            return isDescriptionAvailable;
        },
        /**
         * Sets the title and the content of the descriptions of the selected statistics.
         * @param {Object} statistics - The selected statistics.
         * @returns {Object[]} The descriptions.
         */
        setDescriptionsOfSelectedStatistics (statistics) {
            const descriptions = [];

            Object.values(statistics).map(statistic => {
                return descriptions.push({"title": statistic?.name, "content": statistic?.description !== undefined ? statistic?.description : "Diese Satistik enthält keine Beschreibung."});
            });
            return descriptions;
        },
        /**
         * Gets the metadata link.
         * @returns {String} Empty if no metadata was found - otherwise it returns the url.
         */
        getMetadataLink () {
            if (!isObject(this.selectedLevel)) {
                return "";
            }
            const currentLayer = this.getRawLayerByLayerId(this.selectedLevel.layerId);

            if (!isObject(currentLayer) || !Array.isArray(currentLayer.datasets) || !isObject(currentLayer.datasets[0])
                || !currentLayer.datasets[0].show_doc_url || typeof currentLayer.datasets[0].md_id === "undefined") {
                return "";
            }

            return `${currentLayer.datasets[0].show_doc_url}${currentLayer.datasets[0].md_id}`;
        },
        /**
         * Opens the metadata in a new tab.
         * @returns {void}
         */
        openMetadata () {
            const metadataUrl = this.getMetadataLink();

            if (!metadataUrl) {
                return;
            }
            window.open(metadataUrl, "_blank");
        },
        /**
         * Initializes the data from selected level.
         * @param {Object} selectedLevel - The selected level object
         * @returns {void}
         */
        async initializeData (selectedLevel) {
            if (!isObject(selectedLevel)) {
                return;
            }
            const uniqueValues = await this.getUniqueValuesForLevel(selectedLevel),
                selectedLevelRegionNameAttribute = this.getSelectedLevelRegionNameAttribute(selectedLevel),
                selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(selectedLevel);

            if (uniqueValues[selectedLevelRegionNameAttribute.attrName] && uniqueValues[selectedLevelDateAttribute.attrName]) {
                this.regions = sort("", Object.keys(uniqueValues[selectedLevelRegionNameAttribute.attrName]), "value");
                this.allRegions = this.getAllRegions(this.regions);
                this.dates = Object.keys(uniqueValues[selectedLevelDateAttribute.attrName]);
                this.timeStepsFilter = this.getTimestepsMerged(selectedLevel?.timeStepsFilter, uniqueValues[selectedLevelDateAttribute.attrName], selectedLevelDateAttribute.inputFormat, selectedLevelDateAttribute.outputFormat);
            }
            this.areCategoriesGrouped = StatisticsHandler.hasOneGroup(this.getSelectedLevelStatisticsAttributes(selectedLevel));
            this.categories = sort("", StatisticsHandler.getCategoriesFromStatisticAttributes(this.getSelectedLevelStatisticsAttributes(selectedLevel), this.areCategoriesGrouped), "name");
            this.loadedFilterData = true;
            this.loadedReferenceData = true;
            this.referenceData = {
                "date": this.getTimestepsMerged(undefined, uniqueValues[selectedLevelDateAttribute.attrName], selectedLevelDateAttribute.inputFormat, selectedLevelDateAttribute.outputFormat),
                "region": this.regions
            };
        },
        /**
         * Gets the current level object.
         * @param {String} name - The toggled level name.
         * @returns {void}
         */
        toggleLevel (name) {
            if (typeof name !== "string") {
                return;
            }

            this.resetLevel();

            this.selectLevel = this.data.find(val=> {
                return val?.levelName === name;
            });

            this.initializeData(this.selectLevel);
        },
        /**
         * Resets to the original status
         * @returns {void}
         */
        resetLevel () {
            this.loadedFilterData = false;
            this.loadedReferenceData = false;
            this.setSelectedRegions([]);
            this.setSelectedDates([]);
            this.setSelectedReferenceData({});
            this.setSelectedStatistics({});
            this.handleReset();
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="720"
        class="static-dashboard"
    >
        <template #toolBody>
            <div class="row justify-content-between">
                <div class="col-md-4 d-flex align-items-center">
                    <h4 class="mb-0">
                        {{ $t("additional:modules.tools.statisticDashboard.headings.mrhstatistics") }}
                    </h4>
                    <div
                        v-if="getMetadataLink()"
                        class="mx-2"
                        role="button"
                        tabindex="0"
                        @click="openMetadata"
                        @keypress.enter="openMetadata"
                    >
                        <span class="bootstrap-icon">
                            <i
                                class="bi-info-circle-fill"
                                :title="$t('additional:modules.tools.statisticDashboard.headings.mrhstatisticsTooltip')"
                            />
                        </span>
                    </div>
                </div>
                <div
                    v-if="buttonGroupRegions.length > 1"
                    class="col-md-auto"
                >
                    <StatisticSwitcher
                        :buttons="buttonGroupRegions"
                        group="regions"
                        class="level-switch"
                        @showView="toggleLevel"
                    />
                </div>
            </div>
            <StatisticFilter
                v-if="loadedFilterData"
                :categories="categories"
                :are-categories-grouped="areCategoriesGrouped"
                :statistics="statisticsByCategory"
                :time-steps-filter="timeStepsFilter"
                :regions="allRegions"
                @changeCategory="setStatisticsByCategory"
                @changeFilterSettings="checkFilterSettings"
                @resetStatistics="handleReset"
            />
            <div
                v-else
                class="d-flex justify-content-center"
            >
                <div
                    class="spinner-border spinner-color"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <LegendComponent
                v-if="Array.isArray(legendValue) && legendValue.length"
                class="mt-3"
                :legend-value="legendValue"
                :title="selectedStatisticsNames[0]"
                :show-notice-text="selectedStatisticsNames.length > 1"
            />
            <Controls
                v-if="loadedReferenceData"
                :descriptions="controlDescription"
                :reference-data="referenceData"
                @showChartTable="toggleChartTable"
            />
            <div v-show="showTable">
                <div v-if="!showGrid">
                    <TableComponent
                        v-for="(data, index) in tableData"
                        :key="index"
                        :title="selectedStatisticsNames[index]"
                        :data="data"
                        :fixed-data="testFixedData"
                        :select-mode="selectMode"
                        :show-header="showHeader"
                        :sortable="sortable"
                        @setSortedRows="setSortedRows"
                        @columnSelected="setSelectedColumn"
                    />
                </div>
                <GridComponent
                    v-else
                    :dates="tableData"
                    :titles="selectedStatisticsNames"
                >
                    <template
                        slot="tableContainers"
                        slot-scope="props"
                    >
                        <TableComponent
                            :data="props.data"
                            :fixed-data="testFixedData"
                            :show-header="showHeader"
                            @setSortedRows="setSortedRows"
                        />
                    </template>
                    <template
                        slot="tableContainersModal"
                        slot-scope="props"
                    >
                        <TableComponent
                            :data="props.data"
                            :fixed-data="testFixedData"
                            :show-header="showHeader"
                            :sortable="sortable"
                            @setSortedRows="setSortedRows"
                        />
                    </template>
                </GridComponent>
            </div>
            <div v-show="showChart">
                <canvas
                    v-if="!showGrid"
                    ref="chart"
                    class="chart-container"
                />
                <GridComponent
                    v-else
                    :charts-count="chartCounts"
                    :titles="selectedStatisticsNames"
                >
                    <template
                        slot="chartContainers"
                        slot-scope="props"
                    >
                        <canvas
                            :id="'chart' + props.chartId"
                            :ref="'chart' + props.chartId"
                        />
                    </template>
                    <template
                        slot="chartContainersModal"
                        slot-scope="propsModal"
                    >
                        <canvas
                            :id="'chart-modal-' + propsModal.chartId"
                            :ref="'chart-modal-' + propsModal.chartId"
                        />
                    </template>
                </GridComponent>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>
