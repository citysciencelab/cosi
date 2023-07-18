<script>
import {mapGetters, mapActions, mapState} from "vuex";
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
                reorderedLabels = [...this.ageGroupPieChartLabels],
                yearTotal = this.ageGroupsYearlyData.reduce((total, value) => {
                    if (value.year === year && reorderedLabels.includes(value.label)) {
                        return total + value.sum;
                    }
                    return total;
                }, 0);

            this.ageGroupsYearlyData.forEach(ageGroups => {
                if (ageGroups.year === year && reorderedLabels.includes(ageGroups.label)) {
                    chartObj.backgroundColor.push(ageGroups.backgroundColor);
                    chartObj.label = ageGroups.ageGroup;

                    // Round and also show trailing zeros, e.g. 18 becomes 18,0
                    const percentValue = (Math.round(ageGroups.sum * 100 / yearTotal * 10) / 10)
                        .toFixed(1);

                    chartObj.data.push(percentValue);
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
