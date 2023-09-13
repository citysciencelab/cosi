<script>
import {mapGetters, mapActions} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";

// Components Import
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import BarchartItem from "../../utils/BarchartItem.vue";
import PiechartItem from "../../../../src/share-components/charts/components/PiechartItem.vue";
import DataCardPaginator from "../DataCardPaginator.vue";
import ChangeChartTypeButtons from "../ChangeChartTypeButtons.vue";

export default {
    name: "TabAgeGroups",
    components: {
        LinechartItem,
        BarchartItem,
        PiechartItem,
        DataCardPaginator,
        ChangeChartTypeButtons
    },
    data () {
        return {
            chartType: "bar",
            chartdata: {
                bar: {
                    datasets: [
                        {
                            backgroundColor: "#FD736B",
                            data: [1, 2, 3],
                            hoverOffset: 4,
                            label: "Label"
                        }
                    ]
                },
                line: {
                    datasets: [
                        {
                            backgroundColor: "#FD736B",
                            data: [1, 2, 3],
                            hoverOffset: 4,
                            label: "Label"
                        }
                    ]
                },
                pie: {
                    datasets: [
                        {
                            backgroundColor: [],
                            data: [],
                            hoverOffset: 4,
                            label: "Label"
                        }
                    ]
                }
            },
            pieChartOptions: {
                legend: {
                    display: false
                },
                aspectRatio: 3,
                animation: false,
                tooltips: {
                    callbacks: {
                        // Creates a PieChart Tooltip like "30-90: 30.9%"
                        label: (tooltipItem, data) => {

                            const
                                label = data.labels[tooltipItem.index],
                                value = parseFloat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])
                                    .toLocaleString(this.currentLocale);

                            return `${label}: ${value}%`;
                        }
                    }
                }
            },
            timestamp: null,
            showChart: false,
            currentlySelectedYear: new Date().getFullYear()
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        /**
         * creates an array of years, starting from 2019 (first available year in data from WhatALocation) till current year
         * @returns {Array} list of years available in the dashboard
        */
        yearList () {
            const thisYear = new Date().getFullYear(),
                list = [];
            let firstYear = 2019;

            while (firstYear <= thisYear) {
                list.push(firstYear);
                firstYear++;
            }

            return list;
        }
    },
    watch: {
        async selectedLocationId () {
            this.showChart = false;
            await this.updateChartData();
            this.showChart = true;
        }
    },
    async created () {
        await this.getAllAgeGroupsData();
        await this.updateChartData();
        this.showChart = true;
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /*
         * get the chart data from the store for the selected year
         * @returns {void}
         */
        async updateChartData () {
            this.chartdata.bar.datasets = this.allAgeGroupsMonthlyData[this.currentlySelectedYear];
            this.chartdata.bar.labels = this.ageGroupxLabels;
            this.chartdata.line.datasets = this.allAgeGroupsMonthlyDataLine[this.currentlySelectedYear];
            this.chartdata.line.labels = this.ageGroupxLabels;
            this.chartdata.pie.datasets = this.ageGroupsYearlyData[this.currentlySelectedYear];
            this.chartdata.pie.labels = this.ageGroupPieChartLabels;
        },
        /**
         * define, which charttype shall be displayed
         * @param {String} chartType an be one of "bar" or "line"
         * @returns {void}
         */
        setChartType (chartType) {
            this.chartType = chartType;
        },
        /**
         * reacts on the change of the year paginator
         * @param {String} index selected page to be shown
         * @returns {void}
         */
        async changeIndex (index) {
            this.currentlySelectedYear = 2019 + index;
            this.updateChartData();
            this.timestamp = window.performance.now();
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

<template>
    <div class="tab">
        <div
            class="tab-panel h-100"
            role="tabpanel"
        >
            <div class="tab-content h100">
                <div class="row">
                    <h2>
                        {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.chartTitle") }}
                    </h2>
                    <div class="charts">
                        <!-- Pie Chart -->
                        <div class="piechart">
                            <div
                                class="row chart pie"
                            >
                                <h4> {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.pieChartTitle") }} </h4>
                                <DataCardPaginator
                                    :paginator-data="yearList"
                                    :start-value-index="yearList.length - 1"
                                    @pager="changeIndex"
                                />
                                <PiechartItem
                                    v-if="showChart"
                                    ref="pieChart"
                                    :key="timestamp"
                                    :data="chartdata.pie"
                                    :given-options="pieChartOptions"
                                    class="pieChart"
                                />
                            </div>
                        </div>
                        <!-- Bar Chart -->
                        <div v-if="chartType === 'bar'">
                            <div
                                class="row chart bar"
                            >
                                <h4> {{ translate("additional:modules.tools.vpidashboard.tab.ageGroup.lineBarChartTitle", { year: currentlySelectedYear }) }} </h4>
                                <BarchartItem
                                    v-if="showChart"
                                    :key="timestamp"
                                    :data="chartdata.bar"
                                    :given-scales="{
                                        xAxes: [{
                                            stacked: true
                                        }],
                                        yAxes: [{
                                            stacked: true,
                                            ticks: {
                                                callback: function(value, index, values) {
                                                    return value.toLocaleString(currentLocale);
                                                }
                                            }
                                        }]
                                    }"
                                    :given-options="{
                                        animation: false
                                    }"
                                />
                            </div>
                        </div>
                        <!-- Line Chart -->
                        <div v-if="chartType === 'line'">
                            <div
                                class="row chart line"
                            >
                                <h4> {{ translate("additional:modules.tools.vpidashboard.tab.ageGroup.lineBarChartTitle", { year: currentlySelectedYear }) }} </h4>
                                <LinechartItem
                                    :key="timestamp"
                                    :data="chartdata.line"
                                    :given-options="{
                                        animation: false
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                    {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.footnote") }}
                    <div class="charts chart-types select">
                        <ChangeChartTypeButtons
                            :chart-type="chartType"
                            @updateChartType="setChartType"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .charts {
        margin: 0 0 1rem 0;
        padding: 1rem;
    }

    .piechart {
        margin-bottom: 30px;
    }

    h4 {
        font-size: 0.7rem;
        text-align: center;
        margin-bottom: 10px;
    }
</style>
