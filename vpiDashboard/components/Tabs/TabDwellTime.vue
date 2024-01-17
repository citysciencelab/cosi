<script>
import {mapGetters, mapActions} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import BarchartItem from "../../utils/BarchartItem.vue";
import PiechartItem from "../../../../src/share-components/charts/components/PiechartItem.vue";
import DataCardPaginator from "../DataCardPaginator.vue";
import ChangeChartTypeButtons from "../ChangeChartTypeButtons.vue";

export default {
    name: "TabDwellTime",
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
                bar: {},
                line: {},
                pie: {}
            },
            currentlySelectedYear: new Date().getFullYear(),
            timestamp: 0,
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
            noDataAvailable: ""
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
            await this.updateChartData();
        }
    },
    async created () {
        await this.updateChartData();
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * update the chart data
         * @returns {void}
         */
        async updateChartData () {
            await this.getDwellTimes();
            this.getCurrentChartData();
        },
        /**
         * define, which type of chart shall be displayed
         * @param {String} chartType an be one of "bar" or "line"
         * @returns {void}
         */
        setChartType (chartType) {
            this.chartType = chartType;
        },
        /**
         * requests the data from the store for those chart data that are static
         * @returns {void}
         */
        async getCurrentChartData () {
            this.chartdata.bar = this.getDwellTimeChartJsData("bar", this.currentlySelectedYear);
            this.chartdata.line = this.getDwellTimeChartJsData("line", this.currentlySelectedYear);
            this.chartdata.pie = this.getDwellTimeChartJsData("pie", this.currentlySelectedYear);

            if (this.chartdata.pie.datasets[0]?.data.length === 0) {
                this.noDataAvailable = this.$t("additional:modules.tools.vpidashboard.tab.noData");
            }
            else {
                this.noDataAvailable = "";
            }
        },
        /**
         * reacts on the change of the year paginator
         * @param {String} index selected page to be shown
         * @returns {void}
         */
        async changeIndex (index) {
            this.currentlySelectedYear = 2019 + index;
            this.getCurrentChartData();
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
    <div class="tab tab-dwell-time">
        <div
            class="tab-panel h-100"
            role="tabpanel"
        >
            <div class="tab-content h100">
                <h2>
                    {{ $t("additional:modules.tools.vpidashboard.tab.dwelltime.chartTitle") }}
                </h2>
                <div class="charts">
                    <DataCardPaginator
                        :paginator-data="yearList"
                        :start-value-index="yearList.length - 1"
                        @pager="changeIndex"
                    />
                    <span
                        v-if="noDataAvailable !== ''"
                        class="noDataAvailableMessage"
                    >
                        {{ noDataAvailable }}
                    </span>
                    <!-- Pie Chart -->
                    <PiechartItem
                        ref="pieChart"
                        :key="timestamp"
                        :data="chartdata.pie"
                        :given-options="pieChartOptions"
                        class="piechart"
                    />
                    <!-- Bar Chart -->
                    <div v-if="chartType === 'bar'">
                        <div class="row bar">
                            <h2> {{ translate("additional:modules.tools.vpidashboard.tab.dwelltime.lineBarChartTitle", { year: currentlySelectedYear }) }} </h2>
                            <BarchartItem
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
                        <div class="row line">
                            <h2> {{ translate("additional:modules.tools.vpidashboard.tab.dwelltime.lineBarChartTitle", { year: currentlySelectedYear }) }} </h2>
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
                <div class="charts">
                    <ChangeChartTypeButtons
                        :chart-type="chartType"
                        @updateChartType="setChartType"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h3 {
    margin: 0 0 1rem 0;
}

.charts {
    margin: 0 0 1rem 0;
    text-align: center;
}

.charts .noDataAvailableMessage {
    font-size: 16px;
    font-weight: normal;
}

.piechart {
    margin-bottom: 30px;
}
</style>
