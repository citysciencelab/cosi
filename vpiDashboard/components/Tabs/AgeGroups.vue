
<script>
import {mapGetters, mapActions, mapState} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";

// Components Import
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import BarchartItem from "../../utils/BarchartItem.vue";
import PiechartItem from "../../../../src/share-components/charts/components/PiechartItem.vue";
import DataCardPaginator from "../DataCardPaginator.vue";

export default {
    name: "AgeGroups",
    components: {
        LinechartItem,
        BarchartItem,
        PiechartItem,
        DataCardPaginator
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
                animation: false
            },
            timestamp: null,
            showChart: false,
            currentYearIndex: 0
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapState("Tools/VpiDashboard", ["allAgeGroupsMonthlyData"]),
        ...mapGetters("Language", ["currentLocale"])
    },
    watch: {
        async selectedLocationId () {
            this.showChart = false;
            await this.getAllAgeGroupsData();
            await this.fillInitialChartData();
            this.showChart = true;
        }
    },
    async created () {
        await this.getAllAgeGroupsData();
        await this.fillInitialChartData();
        this.showChart = true;
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /*
         * Create the chart data for first overview
         * @returns {void}
         */
        async fillInitialChartData () {
            this.chartdata.bar.datasets = this.allAgeGroupsMonthlyData;
            this.chartdata.bar.labels = this.ageGroupxLabels;
            this.chartdata.line.datasets = this.allAgeGroupsMonthlyDataLine;
            this.chartdata.line.labels = this.ageGroupxLabels;
            this.createPieChartData();
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
         * reacts on the change of the paginator in monthly or daily data card
         * @param {String} index selected page to be shown
         * @returns {void}
         */
        async changeIndex (index) {
            this.currentYearIndex = index;
            this.createPieChartData();
            this.timestamp = window.performance.now();
        },
        /**
         * generate the dataset for the pie chart
         * @returns {void}
         */
        async createPieChartData () {
            const year = this.allAgeGroupsYears[this.currentYearIndex],
                chartObj = {
                    backgroundColor: [],
                    data: [],
                    hoverOffset: 4
                },
                reorderedLabels = [...this.ageGroupPieChartLabels];

            this.ageGroupsYearlyData.forEach(ageGroups => {
                if (ageGroups.year === year && reorderedLabels.includes(ageGroups.label)) {
                    chartObj.backgroundColor.push(ageGroups.backgroundColor);
                    chartObj.label = ageGroups.ageGroup;
                    chartObj.data.push(ageGroups.sum);
                }

            });

            // set the labels in the same order as the data for the pie chart
            // by moving the last group >69 to the first item in the array
            reorderedLabels.unshift(reorderedLabels.pop());

            this.chartdata.pie.datasets = [];
            this.chartdata.pie.datasets.push(chartObj);
            this.chartdata.pie.labels = reorderedLabels;
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
                                    :paginator-data="allAgeGroupsYears"
                                    @pager="changeIndex"
                                />
                                <PiechartItem
                                    v-if="showChart"
                                    :key="timestamp"
                                    ref="pieChart"
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
                                <h4> {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.lineBarChartTitle") }} </h4>
                                <BarchartItem
                                    v-if="showChart"
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
                                />
                            </div>
                        </div>
                        <!-- Line Chart -->
                        <div v-if="chartType === 'line'">
                            <div
                                class="row chart line"
                            >
                                <h4> {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.lineBarChartTitle") }} </h4>
                                <LinechartItem
                                    :data="chartdata.line"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="charts chart-types select">
                        <button
                            type="button"
                            :class="['btn', chartType === 'bar' ? 'btn-primary' : 'btn-secondary']"
                            @click="setChartType('bar')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-bar-chart-line"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            :class="['btn', chartType === 'line' ? 'btn-primary' : 'btn-secondary']"
                            @click="setChartType('line')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-graph-up"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
                                />
                            </svg>
                        </button>
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
