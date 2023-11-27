<script>
/* eslint-disable vue/multi-word-component-names */
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersDashboard";
import mutations from "../store/mutationsDashboard";
import actions from "../store/actionsDashboard";
import {getTimestamps} from "../../utils/timeline";
import beautifyKey from "../../../../src/utils/beautifyKey";
import TableRowMenu from "./TableRowMenu.vue";
import EditForReportTemplate from "../../components/EditForReportTemplate.vue";
import {
    addCalculation,
    addDivideSelectedCalculations,
    calculateAll,
    calculateStats,
    calculateCorrelation,
    getTotal,
    getAverage,
    getCulmulativeTotal,
    sumUpSelected,
    divideSelected,
    deleteStats,
    getCalculationId
} from "../utils/operations";
import {generateChartForDistricts, generateChartForCorrelation, generateChartsForItems} from "../utils/chart";
import {prepareTableExport, prepareTableExportWithTimeline} from "../utils/export";
import composeFilename from "../../utils/composeFilename";
import exportXlsx from "../../utils/exportXlsx";
import DashboardToolbar from "./DashboardToolbar.vue";
import ToolInfo from "../../components/ToolInfo.vue";
import TableCell from "./TableCell.vue";


export default {
    name: "Dashboard",
    components: {
        Tool,
        ToolInfo,
        TableRowMenu,
        DashboardToolbar,
        TableCell,
        EditForReportTemplate
    },
    data () {
        return {
            dashboardOpen: false,
            rows: [],
            baseColumns: [
                {
                    value: "category",
                    text: this.$t("additional:modules.tools.cosi.dashboard.categoryCol"),
                    sortable: false,
                    groupable: false,
                    filter: this.filterTable
                },
                {
                    value: "menu",
                    filterable: false,
                    sortable: false,
                    groupable: false
                },
                {
                    value: "years",
                    text: this.$t("additional:modules.tools.cosi.dashboard.timestampCol"),
                    filterable: false,
                    sortable: false,
                    divider: true,
                    groupable: false
                }
            ],
            aggregateColumns: [
                {
                    text: this.$t("additional:modules.tools.cosi.dashboard.totalCol"),
                    value: "total",
                    align: "end",
                    sortable: false,
                    groupable: false,
                    selected: false,
                    isAggregation: true
                },
                {
                    text: this.$t("additional:modules.tools.cosi.dashboard.avgCol"),
                    value: "average",
                    align: "end",
                    sortable: false,
                    groupable: false,
                    selected: false,
                    isAggregation: true
                }
            ],
            districtColumns: [],
            items: [],
            currentItems: [], // all current (visible) items in the table
            selectedItems: [], // selected items in the table
            timestampPrefix: "jahr_",
            timestamps: [],
            search: "",
            fields: {
                A: null,
                B: null
            },
            toolOffset: 0,
            calculationData: {
                id: "",
                operation: "",
                category_A: "",
                category_B: "",
                selectedCategories: "",
                field_A: null,
                field_B: null,
                selectedItems: []
            },
            calculationDialog: false
        };
    },
    computed: {
        ...mapGetters("Tools/Dashboard", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", [
            "selectedDistrictLevel",
            "selectedDistrictNames",
            "mapping",
            "loadend",
            "remoteMetadata"
        ]),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/ColorCodeMap", ["selectedYear"]),
        columns () {
            return [
                ...this.baseColumns,
                ...this.districtColumns,
                ...this.aggregateColumns
            ];
        },
        valueColumns () {
            return [...this.districtColumns, ...this.aggregateColumns];
        },
        selectedColumns () {
            const selectedCols = this.valueColumns.filter(col => col.selected);

            return selectedCols.length > 0
                ? selectedCols
                : this.valueColumns;
        },
        unselectedColumnLabels () {
            return this.valueColumns.filter(col => !this.selectedColumns.includes(col)).map(col => col.text);
        },
        currentTimeStamp: {
            get () {
                return parseInt(this.selectedYear, 10);
            },
            set (v) {
                this.setSelectedYear(v);
            }
        },

        /**
         * Checks whether there is at least one object with an orientation value in the mapping json.
         * @returns {Boolean} True if there is an orientation value.
         */
        hasMappingOrientationValue () {
            return this.mapping.some(obj => typeof obj.orientationValue !== "undefined");
        }
    },

    watch: {
        active (v) {
            if (v) {
                this.toolOffset = 0.4 * window.innerWidth;
                this.calculateAll();
                if (this.loadend) {
                    this.generateTable();
                }
            }
        },
        loadend (v) {
            if (v && this.selectedDistrictNames.length > 0) {
                this.generateTable();
            }
        },
        calculations: "calculateAll",

        toolBridgeIn (newRequest) {
            /** 0. Check if request is valid */
            const requestSettingsValid = ("statsFeatureFilter" in newRequest.settings) & ("calculations" in newRequest.settings),
                /**
             * 1. update the interface based on the settings received from toolBridge
             * @param {Object} request the toolBridge request {id:..., settings:{...}}
             * @returns {void} (run for side effects only, passes along the request)
             */
                updateInterface = (request) => {
                    this.$store.commit("Tools/Dashboard/setStatsFeatureFilter", request.settings.statsFeatureFilter); // not sure why simple this.
                    this.overwriteAllCalculations(request.settings.calculations);
                },

                /**
                * 2. run the specific analysis of this addon
                * @returns {Object} the value of the function that runs the analysis.
                */
                runTool = () => {
                // copied & modified this from exportTable() method
                    if (this.currentItems.length < 1) { // if dashboard was never opened, currentItems is not yet copied from items, so we do it here just in case.
                        this.currentItems = this.items;
                    }
                    this.calculateAll(); // make sure the table is updated
                    this.generateTable(); // make sure the table is updated
                    const items = this.selectedItems.length > 0 ?
                        this.selectedItems :
                        this.items.filter(item => this.filterTable(item.category)); // if no rows in the table are selected, act as if all rows are selected

                    // this.currentItems = items;
                    let data = this.exportTimeline
                        ? this.prepareTableExportWithTimeline(items, this.selectedDistrictNames, this.timestamps, this.timestampPrefix)
                        : this.prepareTableExport(items, this.selectedDistrictNames, this.selectedYear, this.timestampPrefix);

                    data = JSON.parse(JSON.stringify(data)); // cleans the object to pure JSON (rather than array of getters and setters)
                    // eslint-disable-next-line no-unused-vars
                    data = data.map(({visualized, expanded, Datentyp, groupIndex, ...keepAttrs}) => keepAttrs); // remove unwanted keys // this line gives a linter error. the attributes are not used, but that is the point - we want to remove them
                    // make sure each row has all column keys
                    data = this.fillMissingKeys(data, "NA");


                    return data;
                },
                /**
                * 3. hand the results back to toolBridge, in the form of: {request: ..., type: ..., result: ...}
                * @param {Object} data the data table
                * @returns {Object} null (runs for side effects only)
                */
                returnResults = (data) => {
                    return this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
                        {
                            result: data, // change to where results are stored
                            type: "table", // see toolBridge docs for supported output types
                            request: newRequest, // we need to give back the original request as well, leave this as is.
                            sourceInfo: this.remoteMetadata
                        }
                    );
                };

            // Now this runs the three steps, making sure they happen synchronously (so we don't try to return results before analysis is finished)
            if (requestSettingsValid) {
                updateInterface(newRequest);
            }
            returnResults(runTool());

            return null; // we care about the side effects only.

        }
    },
    created () {
        /**
         * If the tool is used from the menu,
         * toggles the menu item inactive if closed
         * @param {boolean} newActive - Defines if the tool is active.
         * @returns {void}
         */
        this.$on("close", () => {
            this.setActive(false);
        });
    },

    methods: {
        ...mapMutations("Tools/Dashboard", Object.keys(mutations)),
        ...mapActions("Tools/Dashboard", Object.keys(actions)),
        ...mapMutations("Tools/DistrictSelector", ["addCategoryToMapping", "removeCategoryFromMapping"]),
        ...mapMutations("Tools/ColorCodeMap", ["setSelectedYear"]),
        ...mapActions("Tools/ChartGenerator", ["channelGraphData"]),
        ...mapActions("Tools/DistrictSelector", ["updateDistricts"]),

        /**
         * Returns the labels of the selected districts.
         * @param {Object[]} districts - The districts of the selected district level.
         * @returns {String[]} The labels.
         */
        getSelectedDistrictsLabels (districts) {
            const selectedDistricts = districts.filter(district => district.isSelected === true);

            return selectedDistricts.map(district => district.getLabel());
        },

        /**
         * Generates the table data for the v-data-table (headers/columns, items/rows)
         * @listens #Change:DistrictSelector/loadend on DistrictSelector/loadend
         * @returns {void}
         */
        generateTable () {
            this.timestamps = [];
            this.handleOrientationColumn(this.hasMappingOrientationValue, this.aggregateColumns);
            this.districtColumns = this.getColumns(this.selectedDistrictLevel, this.selectedDistrictNames, []);
            this.rows = this.getRows();
            this.items = this.getData();
            this.currentTimeStamp = this.selectedYear;
        },
        /**
         * Generates empty rows for all data categories
         * taken from the mapping.json in /portal/cosi/config/ and set in config.json
         * @returns {void}
         */
        getRows () {
            let counter = 0;

            return this.mapping.reduce((rows, category, index, array) => {
                return [
                    ...rows,
                    {
                        visualized: false, // is the data visualized in the map
                        expanded: false, // is the timeline expanded
                        category: category.value,
                        group: category.group,
                        valueType: category.valueType,
                        isTemp: category.isTemp,
                        calculation: category.calculation,
                        groupIndex: array[index].group !== array[index + 1]?.group ? counter++ : counter,
                        orientationValue: category.orientationValue
                    }
                ];
            }, []);
        },
        getData () {
            return this.rows.map(row => this.getDistrictStatsByCategory(row), []);
        },
        getDistrictStatsByCategory (row) {
            const districtStats = {
                ...row
            };

            for (const col of this.districtColumns) {
                const statFeature = col.district.statFeatures
                    .find(feature => feature.get("kategorie") === row.category);

                if (statFeature) {
                    districtStats[col.value] = statFeature.getProperties();
                }
            }

            districtStats.years = [...getTimestamps(districtStats, this.timestampPrefix)];
            districtStats.id = districtStats.category + districtStats.groupIndex;
            this.timestamps = districtStats.years.reduce((timestamps, timestamp) => {
                return timestamps.includes(timestamp) ? timestamps : [timestamp, ...timestamps].sort().reverse();
            }, this.timestamps);

            return districtStats;
        },
        getColumns (districtLevel, districtNames, colList) {
            const districts = districtLevel.displayAll
                    ? districtLevel.districts
                    : districtLevel.districts.filter(dist => districtNames.includes(dist.getName())),
                refDistrictNames = [];
            let district, refDistrictName;

            for (district of districts) {
                colList.push({
                    text: beautifyKey(district.getLabel()),
                    value: district.getLabel(),
                    align: "end",
                    district,
                    districtLevel: districtLevel.label,
                    sortable: false,
                    groupable: false,
                    selected: false,
                    minimized: false
                });

                refDistrictName = district.getReferencDistrictName();

                if (refDistrictName) {
                    refDistrictNames.push(refDistrictName);
                }
            }

            colList[colList.length - 1].divider = true;

            if (districtLevel.referenceLevel) {
                // add columns for reference areas
                this.getColumns(districtLevel.referenceLevel, refDistrictNames, colList);
            }

            return colList;
        },

        setColDividers () {
            for (let i = 0; i < this.districtColumns.length; i++) {
                if (this.districtColumns[i].districtLevel !== this.districtColumns[i + 1]?.districtLevel) {
                    this.districtColumns[i].divider = true;
                }
                else {
                    this.districtColumns[i].divider = false;
                }
            }
        },

        /**
         * Moves a district column left/right
         * @param {Object} col - the column to move
         * @param {0 | 1} [dir=0] - the direction to move, 0 = left, 1 = right
         * @returns {void}
         */
        moveCol (col, dir = 0) {
            // dont move left if index is 0
            if (this.districtColumns.findIndex(_col => _col === col) === 0 && dir === 0) {
                return;
            }

            const i = this.districtColumns.findIndex(_col => _col === col),
                c0 = this.districtColumns.slice(0, i - 1 + dir),
                c1 = this.districtColumns.slice(i + 1 + dir),
                cSwap = this.districtColumns.slice(i - 1 + dir, i + 1 + dir).reverse(),
                cols = [...c0, ...cSwap, ...c1];

            this.districtColumns = cols;
            this.setColDividers();
        },

        minimizeCol (col) {
            col.minimized = !col.minimized;
            col.class = col.minimized ? "minimized" : "";
        },

        getAverageAsString (item, timestamp) {
            const average = this.getAverage(item, this.getSelectedDistrictsLabels(this.selectedDistrictLevel.districts), timestamp, this.timestampPrefix);

            return average.toLocaleString(this.currentLocale);
        },

        getAverageForAllTimestamps (item) {
            return Object.fromEntries(
                item.years.map(timestamp => [
                    this.timestampPrefix + timestamp,
                    this.getAverage(item, this.getSelectedDistrictsLabels(this.selectedDistrictLevel.districts), timestamp, this.timestampPrefix)
                ])
            );
        },

        getTotalAsString (item, timestamp) {
            const total = this.getTotal(item, this.getSelectedDistrictsLabels(this.selectedDistrictLevel.districts), timestamp, this.timestampPrefix);

            return total.toLocaleString(this.currentLocale);
        },

        getTotalForAllTimestamps (item) {
            return Object.fromEntries(
                item.years.map(timestamp => [
                    this.timestampPrefix + timestamp,
                    this.getTotal(item, this.getSelectedDistrictsLabels(this.selectedDistrictLevel.districts), timestamp, this.timestampPrefix)
                ])
            );
        },

        setField (field, item) {
            this.fields[field] = item;
        },

        resetFields () {
            for (const field in this.fields) {
                this.fields[field] = null;
            }
        },

        renderCharts (item) {
            const
                total = this.getTotalForAllTimestamps(item),
                average = this.getAverageForAllTimestamps(item),
                data = {
                    ...item,
                    total,
                    average
                },
                chart = generateChartForDistricts(
                    data,
                    this.selectedColumns,
                    this.selectedDistrictLevel.label,
                    this.timestampPrefix
                );

            this.channelGraphData(chart);
        },

        renderGroupedCharts () {
            if (this.selectedItems.length === 0) {
                return;
            }

            const
                datasets = this.selectedItems.map(item => ({
                    ...item,
                    total: this.getTotalForAllTimestamps(item),
                    average: this.getAverageForAllTimestamps(item)
                })),
                charts = generateChartsForItems(
                    datasets,
                    this.selectedColumns,
                    this.selectedDistrictLevel.label,
                    this.timestampPrefix
                );

            this.channelGraphData(charts);
        },

        renderScatterplot () {
            if (!(this.fields.B && this.fields.A)) {
                return;
            }

            const correlation = this.calculateCorrelation(),
                chart = generateChartForCorrelation(correlation, this.fields.B.category, this.fields.A.category);

            this.channelGraphData(chart);
        },

        onVisualizationChanged () {
            let item;

            for (item of this.items) {
                item.visualized = false;
            }
        },

        /**
         * Export the table as XLSX.
         * Either the simple view for the selected or all years.
         * @param {Boolean} exportTimeline - Whether to include all years.
         * @param {Object[]} selectedItems - Selected items in the table.
         * @param {Object[]} currentItems - All current (visible) items in the table
         * @returns {void}
         */
        exportTable (exportTimeline = false) {
            const items = this.selectedItems.length > 0 ? this.selectedItems : this.currentItems,
                prefix = this.prefixExportFilename,
                data = exportTimeline
                    ? this.prepareTableExportWithTimeline(items, this.selectedDistrictNames, this.timestamps, this.timestampPrefix)
                    : this.prepareTableExport(items, this.selectedDistrictNames, this.selectedYear, this.timestampPrefix),
                filename = composeFilename(this.$t("additional:modules.tools.cosi.dashboard.exportFilename", {prefix}));

            exportXlsx(data, filename, {exclude: [...this.excludedPropsForExport, ...this.unselectedColumnLabels]});
        },

        addCalculation,
        addDivideSelectedCalculations,
        calculateAll,
        calculateStats,
        calculateCorrelation,
        sumUpSelected,
        divideSelected,
        deleteStats,
        getTotal,
        getAverage,
        prepareTableExport,
        prepareTableExportWithTimeline,
        getCulmulativeTotal,

        /**
         * Sets the current (visible) items of the table.
         * @param {Object[]} items - The of the table.
         * @returns {void}
         */
        setCurrentItems (items) {
            this.currentItems = items;
        },

        /**
         * Sets the offs et of the tool sidebar from left viewport
         * @param {Event} evt - the resizeing event
         * @returns {void}
         */
        setToolOffset (evt) {
            if (!this.active) {
                return;
            }

            if (evt) {
                this.toolOffset = window.innerWidth - evt.targetElement.clientWidth;
            }

            if (typeof this.$el.querySelector === "function") {
                if (this.$el.querySelector("#dashboard-toolbar").clientHeight > 50) {
                    this.$el.querySelector(".dashboard-table-wrapper").style.height = "calc(100% - 116px)";
                }
                else {
                    this.$el.querySelector(".dashboard-table-wrapper").style.height = "calc(100% - 80px)";
                }
            }
        },

        /**
         * Opens the dialog to create a new calculation
         * @param {"add" | "subtract" | "multiply" | "divide" | "sumUpSelected"} operation - the mathmatical operation to execute
         * @param {{field_A: Object, field_B: Object, selectedItems: Object[] }} [options={}] - fields and selected items list
         * @returns {void}
         */
        openCalcDialog (operation, options) {
            this.calculationData.operation = operation;
            this.calculationData.field_A = options.field_A;
            this.calculationData.field_B = options.field_B;
            this.calculationData.selectedItems = options.selectedItems;

            if (operation === "sumUpSelected") {
                this.calculationData.selectedCategories = this.calculationData.selectedItems.map(item => item.category);
            }
            else {
                this.calculationData.category_A = this.calculationData.field_A.category;
                this.calculationData.category_B = this.calculationData.field_B.category;
            }

            this.calculationData.id = getCalculationId(this.calculationData);
            this.calculationDialog = true;
        },

        /**
         * Filters the table by category
         * @param {String} value - the category mapping
         * @return {Boolean} should the item be displayed?
         */
        filterTable (value) {
            if (this.statsFeatureFilter.length < 1) {
                return true;
            }
            return this.statsFeatureFilter.map(t => typeof t === "string" ? t : t.value).includes(value);
        },
        /** make sure all objects in array include all the same keys
       *
        * @param {*} arr array of objects
        * @param {*} missingValues what to set the missing values to
        * @returns {array} same array but each item has the same keys
        */
        fillMissingKeys (arr, missingValues = "NA") {
            // Create an object with all the keys in it
            // This will return one object containing all keys the items
            const obj = arr.reduce((res, item) => ({...res, ...item})),

                // Get those keys as an array
                keys = Object.keys(obj),

                // Create an object with all keys set to the default value (0)
                def = keys.reduce((result, key) => {
                    result[key] = missingValues;
                    return result;
                }, {}),

                // Use object destrucuring to replace all default values with the ones we have
                result = arr.map((item) => ({...def, ...item}));

            return result;
        },

        /**
         * Adds a column for the orientations values if it is not yet available and
         * there is at least one orientation value in the mapping json.
         * @param {Boolean} hasMappingOrientationValue - True if there is an orientation value.
         * @param {Object[]} aggregateColumns - Columns for total and average values.
         * @returns {void}
         */
        handleOrientationColumn (hasMappingOrientationValue, aggregateColumns) {
            const hasOrientationColumn = aggregateColumns.find(col => col.value === "orientationValue");

            if (hasMappingOrientationValue && !hasOrientationColumn) {
                this.aggregateColumns.splice(0, 0, {
                    text: "Orientierungswert",
                    value: "orientationValue",
                    align: "end",
                    sortable: false,
                    groupable: false,
                    selected: false,
                    isAggregation: true
                });
            }
        },

        /**
         *  This function collapses the results of dashboard to make it look more clean
         */

        collapseAllGroups () {
            // The second half of the solution is not clear to me but found that it is one way to achieve
            // const groupStates = this.$refs["dashboard-table"]?.$vnode.componentInstance.openCache;

            // if (groupStates) {
            //     for (const e in groupStates) {
            //         groupStates[e] = false;
            //     }
            // }
        }

    }
};
</script>

<template lang="html">
    <Tool
        class="no-scroll"
        :title="$t('additional:modules.tools.cosi.dashboard.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="0.6"
        @endResizing="setToolOffset"
    >
        <template
            #toolBody
        >
            <v-app
                id="dashboard-wrapper"
                absolute
            >
                <v-main>
                    <ToolInfo
                        :url="readmeUrl"
                        :locale="currentLocale"
                    />
                    <EditForReportTemplate
                        :report-template-mode="reportTemplateMode"
                        tool-name="Dashboard"
                        instructions="Wählen sie mindestens ein Gebiet in der Gebietsauswahl aus. Stellen Sie dann hier ein, welche Themen und Daten übernommen werden sollen. Drücken Sie dann auf übernehmen, um die Einstellungen in das Report Template zu übernehmen."
                    />
                    <v-container fluid>
                        <DashboardToolbar
                            :stats-feature-filter="statsFeatureFilter"
                            @setStatsFeatureFilter="setStatsFeatureFilter"
                            @exportTable="exportTable"
                        />
                        <v-row class="dashboard-table-wrapper">
                            <v-data-table
                                ref="dashboard-table"
                                v-model="selectedItems"
                                :headers="columns"
                                :items="items"
                                group-by="groupIndex"
                                show-group-by
                                :items-per-page="-1"
                                :search="search"
                                hide-default-footer
                                fixed-header
                                dense
                                show-select
                                item-key="id"
                                class="dashboard-table"
                                @current-items="setCurrentItems"
                                @hook:mounted="collapseAllGroups"
                            >
                                <!-- Header for years selector -->
                                <template #[`header.years`]>
                                    <v-select
                                        v-model="currentTimeStamp"
                                        :items="timestamps"
                                        :height="20"
                                        :label="$t('additional:modules.tools.cosi.dashboard.timestampCol')"
                                        dense
                                        hide-details
                                    />
                                </template>

                                <!-- Header for districts -->
                                <template
                                    v-for="district in valueColumns"
                                    #[`header.${district.value}`]="{ header }"
                                >
                                    <div
                                        :key="district.value"
                                        class="district-header"
                                    >
                                        <v-checkbox
                                            v-model="header.selected"
                                            :label="header.text"
                                            dense
                                            hide-details
                                        />
                                        <template v-if="!district.isAggregation">
                                            <v-btn
                                                class="move-col left"
                                                icon
                                                x-small
                                                :title="$t('additional:modules.tools.cosi.dashboard.moveColLeft')"
                                                @click="moveCol(district, 0)"
                                            >
                                                <v-icon>mdi-chevron-left</v-icon>
                                            </v-btn>
                                            <v-btn
                                                class="move-col right"
                                                icon
                                                x-small
                                                :title="$t('additional:modules.tools.cosi.dashboard.moveColRight')"
                                                @click="moveCol(district, 1)"
                                            >
                                                <v-icon>mdi-chevron-right</v-icon>
                                            </v-btn>
                                            <v-btn
                                                class="move-col minimize"
                                                icon
                                                x-small
                                                :title="$t('additional:modules.tools.cosi.dashboard.minimizeCol')"
                                                @click="minimizeCol(district)"
                                            >
                                                <v-icon>{{ district.minimized ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                                            </v-btn>
                                        </template>
                                    </div>
                                </template>

                                <template #[`group.header`]="group">
                                    <th
                                        :colspan="group.headers.length"
                                        class="text-start"
                                    >
                                        <v-icon @click="group.toggle">
                                            {{ group.isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                        </v-icon>
                                        {{ group.items[0].group }}
                                    </th>
                                </template>

                                <!-- Base Columns -->
                                <template #[`item.years`]="{ item }">
                                    <div class="text-end">
                                        <template v-if="item.expanded">
                                            <ul class="timeline">
                                                <li
                                                    v-for="year in item.years"
                                                    :key="year"
                                                >
                                                    <small class="timestamp">{{ year }}</small>
                                                </li>
                                            </ul>
                                        </template>
                                        <template v-else>
                                            <span><small class="timestamp">{{ currentTimeStamp }}</small></span>
                                        </template>
                                    </div>
                                </template>
                                <template #[`item.menu`]="{ item }">
                                    <TableRowMenu
                                        :item="item"
                                        :fields="fields"
                                        :selected-items="selectedItems"
                                        @setField="setField"
                                        @resetFields="resetFields"
                                        @add="openCalcDialog('add', {field_A: fields.A, field_B: fields.B})"
                                        @subtract="openCalcDialog('subtract', {field_A: fields.A, field_B: fields.B})"
                                        @multiply="openCalcDialog('multiply', {field_A: fields.A, field_B: fields.B})"
                                        @divide="openCalcDialog('divide', {field_A: fields.A, field_B: fields.B})"
                                        @sum="openCalcDialog('sumUpSelected', {selectedItems})"
                                        @divideSelected="addDivideSelectedCalculations"
                                        @correlate="renderScatterplot"
                                        @visualizationChanged="onVisualizationChanged"
                                        @renderCharts="renderCharts"
                                        @renderGroupedChart="renderGroupedCharts"
                                        @delete="deleteStats"
                                    />
                                </template>

                                <!-- Columns of all Districts -->
                                <template
                                    v-for="district in districtColumns"
                                    #[`item.${district.value}`]="{ item, header }"
                                >
                                    <TableCell
                                        :key="district.value"
                                        :item="item"
                                        :header="header"
                                        :current-timestamp="currentTimeStamp"
                                        :timestamp-prefix="timestampPrefix"
                                        :current-locale="currentLocale"
                                        :tooltip-offset="toolOffset"
                                        :items="items"
                                    />
                                </template>

                                <!-- Columns for aggregated data -->
                                <template #[`item.total`]="{ item, header }">
                                    <TableCell
                                        v-if="item.total"
                                        :item="item"
                                        :header="header"
                                        :current-timestamp="currentTimeStamp"
                                        :timestamp-prefix="timestampPrefix"
                                        :current-locale="currentLocale"
                                        :tooltip-offset="toolOffset"
                                    />
                                    <!-- eslint-disable-next-line -->
                                    <v-tooltip
                                        v-else
                                        bottom
                                        :nudge-top="60"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <div
                                                class="text-end"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-if="item.expanded">
                                                    <ul class="timeline">
                                                        <li
                                                            v-for="year in item.years"
                                                            :key="year"
                                                        >
                                                            {{ getTotalAsString(item, year) }}
                                                        </li>
                                                    </ul>
                                                </template>
                                                <template v-else>
                                                    <span>{{ getTotalAsString(item, currentTimeStamp) }}</span>
                                                </template>
                                            </div>
                                        </template>
                                        <span>{{ $t('additional:modules.tools.cosi.dashboard.totalCol') }} {{ item.expanded ? '' : `(${currentTimeStamp})` }}</span>
                                    </v-tooltip>
                                </template>

                                <template #[`item.average`]="{ item, header }">
                                    <TableCell
                                        v-if="item.average"
                                        :item="item"
                                        :header="header"
                                        :current-timestamp="currentTimeStamp"
                                        :timestamp-prefix="timestampPrefix"
                                        :current-locale="currentLocale"
                                        :tooltip-offset="toolOffset"
                                    />
                                    <!-- eslint-disable-next-line -->
                                    <v-tooltip
                                        v-else
                                        bottom
                                        :nudge-top="60"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <div
                                                class="text-end"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-if="item.expanded">
                                                    <ul class="timeline">
                                                        <li
                                                            v-for="year in item.years"
                                                            :key="year"
                                                        >
                                                            {{ getAverageAsString(item, year) }}
                                                        </li>
                                                    </ul>
                                                </template>
                                                <template v-else>
                                                    {{ getAverageAsString(item, currentTimeStamp) }}
                                                </template>
                                            </div>
                                        </template>
                                        <span>{{ $t('additional:modules.tools.cosi.dashboard.avgCol') }} {{ item.expanded ? '' : `(${currentTimeStamp})` }}</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-row>
                    </v-container>
                </v-main>
                <v-snackbar
                    v-model="calculationDialog"
                    :timeout="-1"
                    color="primary"
                    class="name-input"
                >
                    {{ $t('additional:modules.tools.cosi.dashboard.nameCalc') }}
                    <v-text-field
                        id="title-field"
                        v-model="calculationData.id"
                        name="session-title"
                    />

                    <template #action="{ attrs }">
                        <v-btn
                            id="confirm-calc"
                            v-bind="attrs"
                            text
                            :title="$t('additional:modules.tools.cosi.dashboard.tableRowMenu.calculate')"
                            @click="addCalculation(
                                calculationData.operation,
                                {field_A: calculationData.field_A, field_B: calculationData.field_B, selectedItems: calculationData.selectedItems},
                                calculationData.id
                            ); calculationDialog = false;"
                        >
                            <v-icon>mdi-calculator-variant</v-icon>
                        </v-btn>
                        <v-btn
                            id="cancel-calc"
                            v-bind="attrs"
                            text
                            @click="calculationDialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-snackbar>
            </v-app>
        </template>
    </Tool>
</template>

<style lang="scss">
@import "../../utils/variables.scss";

#dashboard-wrapper {
    height: 100%;
    .v-main {
        height: 100%;
        .container {
            height: 100%;
            .dashboard-table-wrapper {
                height: calc(100% - 80px);
            }
        }
    }

    .name-input {
        .v-snack__wrapper {
            min-width: 40vw;
        }
    }


.dashboard-table {
    height: 100%;
    .v-data-table__wrapper {
        overflow-x: auto;
        overflow-y: auto;
        height: 100%;
    }

    thead {
        .district-header {
            position: relative;
            margin-top: 10px;
            .move-col {
                position: absolute;
                top: -10px;
                font-size: 16px;
                &.left {
                    left: 0px;
                }
                &.right {
                    left: 10px;
                }
                &.minimize {
                    right: 0px;
                }
            }
        }
        .v-input {
            font-size: unset;
            label {
                font-size: 12px;
                font-weight: 700;
                i {
                    font-size: 20px;
                }
            }
        }
    }

    th.minimized {
        width: 20px;
        max-width:20px;

        .v-input {
            display: none;
        }
        .move-col {
            &.left {
                display: none;
            }
            &.right {
                display: none;
            }
            &.minimize {
                left: -10px;
                right: unset;
            }
        }
    }

    td {
        vertical-align: top;

        div.text-end {
            text-align: right;
        }
        ul.timeline {
            list-style: none;
            li {
                text-align: right;
            }
        }
        .timestamp {
            color: $brightblue;
        }
        .no-wrap {
            white-space: nowrap;
        }
        .modified {
            color: $brightred;
        }
        .minimized {
            // overflow: hidden;
            // width: 20px;
            display: none;
        }
    }
}
}
</style>


