<script>
import {mapGetters, mapActions, mapState} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";
import dayjs from "dayjs";

// Components Import
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import DataCard from "../DataCard.vue";
import BarchartItem from "../../../../src/share-components/charts/components/BarchartItem.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
    name: "IndividualBesucher",
    components: {
        DataCard,
        LinechartItem,
        BarchartItem,
        DatePicker
    },
    data () {
        return {
            chartType: "bar",
            layerList: null,
            dates: [],
            showDatepicker: false,
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
                }
            },
            possibleChartDatasets: [
                {
                    name: "additional:modules.tools.vpidashboard.unique.allData",
                    chart: "overview"
                },
                {
                    name: "additional:modules.tools.vpidashboard.unique.monthlyOverview",
                    chart: "monthlyoverview"
                },
                {
                    name: "additional:modules.tools.vpidashboard.unique.dailyOverview",
                    chart: "dailyoverview"
                },
                {
                    name: "additional:modules.tools.vpidashboard.unique.hourly",
                    chart: "hourly"
                },
                {
                    name: "additional:modules.tools.vpidashboard.unique.timeRange",
                    chart: "timeRange"
                }
            ],
            selectedChartData: "overview",
            chartSubTitle: "",
            renderKey: 0
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapState("Tools/VpiDashboard", [
            "allLocationsArray",
            "barChartDailyData",
            "lineChartDailyData",
            "barChartMonthlyData",
            "lineChartMonthlyData",
            "barChartData",
            "lineChartData",
            "selectedLocationId"
        ]),
        selectedChartDataComputed: {
            /**
             * define, which data shall be the base of the chart
             * will initiate the change of chart when a value is set
             * @returns {String} selectedChartData
             */
            get () {
                return this.selectedChartData;
            },
            /**
             * define, which data shall be the base of the chart
             * will initiate the change of chart when a value is set
             * @param {String} value selected value from dropdown, can be one of possibleChartDatasets.chart
             * @returns {void}
             */
            set (value) {
                this.selectedChartData = value;
                this.switchChart();
            }
        },
        /**
         * will check if a user interaction is neccessary for this chart type (request of date value will be initiated based on this value)
         * @returns {Boolean} isIndividualChartType
        */
        isIndividualChartType () {
            const individualChartTypes = ["hourly", "timeRange"];

            return individualChartTypes.indexOf(this.selectedChartData) !== -1;
        },
        /**
         * switches the datepicker title based on the requested user interaction (choose a single date or a date range)
         * @returns {String} datePickerTitle
        */
        datePickerTitle () {
            switch (this.selectedChartData) {
                case "hourly":
                    return this.translate("additional:modules.tools.vpidashboard.unique.selectDate");
                case "timeRange":
                    return this.translate("additional:modules.tools.vpidashboard.unique.selectDateRange");
                default:
                    return "";
            }
        }
    },
    watch: {
        dates (value) {
            if (value !== "") {
                this.dayDatepickerValueChanged(value);
            }
        },
        async selectedLocationId () {
            await this.getIndividualVisitors();
            await this.fillInitialChartData();
        }
    },
    async created () {
        this.$on("close", this.close);
        await this.getIndividualVisitors();
        await this.fillInitialChartData();
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * Create the chart data for first overview
         * @returns {void}
        */
        async fillInitialChartData () {
            this.chartdata.bar = this.barChartData;
            this.chartdata.line = this.lineChartData;
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
         * prepares the change of the data base of the shown chart
         * if an individual chart type (urges the user to pick a date / daterange before) is selected, the date picker is prepared
         * otherwise the data are selected and the chart change is started
         * @returns {void}
        */
        switchChart () {
            this.showDatepicker = false;
            if (this.isIndividualChartType) {
                // erst Datum und dann Daten abfragen, dann das Chart generieren
                this.resetDates();
            }
            else {
                this.getCurrentBarChartData();
                this.changeChart(this.selectedChartData);
            }
        },
        /**
         * requests the data from the store for those chart data that are static
         * @returns {void}
        */
        getCurrentBarChartData () {
            switch (this.selectedChartData) {
                case "overview":
                    this.chartdata.bar = this.barChartData;
                    this.chartdata.line = this.lineChartData;
                    break;
                case "dailyoverview":
                    this.chartdata.bar = this.barChartDailyData;
                    this.chartdata.line = this.lineChartDailyData;
                    break;
                case "monthlyoverview":
                    this.chartdata.bar = this.barChartMonthlyData;
                    this.chartdata.line = this.lineChartMonthlyData;
                    break;
                default:
                    this.chartdata.bar = {};
                    this.chartdata.line = {};
                    break;
            }
        },
        /**
         * when the user selected a date, the data need to be requested from whatALocation and the chart data need to be created
         * @param {String | Array} values can hold a single day or a date range, depending on the selected chart type
         * @returns {void}
        */
        async dayDatepickerValueChanged (values) {
            this.showDatepicker = false;
            if (!Array.isArray(values)) {
                if (values === "") {
                    this.chartSubTitle = this.translate("additional:modules.tools.vpidashboard.unique.noValidDate");
                }
                else {
                    // just a single day with hourly data shall be displayed
                    this.chartSubTitle = this.translate("additional:modules.tools.vpidashboard.unique.chartTitleDay", {
                        dateValue: dayjs(values).format("DD.MM.YYYY")
                    });
                    await this.getIndividualVisitorsForDay(dayjs(values).format("YYYY-MM-DD")).then((data) => {
                        this.chartdata.bar = this.createChartData(data.data, "bar", "hourly");
                        this.chartdata.line = this.createChartData(data.data, "line", "hourly");
                    });
                }
            }
            else {
                // a date range with daily data shall be displayed
                this.chartSubTitle = this.translate("additional:modules.tools.vpidashboard.unique.chartTitleDayRange", {
                    dateValueFrom: dayjs(values[0]).format("DD.MM.YYYY"),
                    dateValueTo: dayjs(values[1]).format("DD.MM.YYYY")
                });
                await this.getIndividualVisitorsForDateRange({dateFrom: dayjs(values[0]).format("YYYY-MM-DD"), dateTo: dayjs(values[1]).format("YYYY-MM-DD")}).then((data) => {
                    this.chartdata.bar = this.createChartData(data.data, "bar", "daily");
                    this.chartdata.line = this.createChartData(data.data, "line", "daily");
                });
            }

        },
        /**
         * the data for chartjs is created, based on
         * @param {Object} responseData the data responded by whatALocation
         * @param {String} chartType can be one of "bar" or "line"
         * @param {String} dataType can be one of "hourly" or "daily"
         * @returns {Object} the formatted data to be shown in the chart
        */
        createChartData (responseData, chartType, dataType) {
            const labels = [],
                presentation_data = [];
            let datasets = {
                label: dataType === "hourly" ? this.translate("additional:modules.tools.vpidashboard.unique.numberVisitorsHour") : this.translate("additional:modules.tools.vpidashboard.unique.numberVisitorsDay")
            };

            responseData.forEach((element) => {
                if (dataType === "hourly") {
                    labels.push(element.date__hour + ":00");
                    presentation_data.push(Math.floor(element.avg_num_visitors));
                }
                else {
                    labels.push(dayjs(element.date).format("DD.MM.YYYY"));
                    presentation_data.push(Math.floor(element.sum_num_visitors));
                }
            });

            if (chartType === "bar") {
                datasets = Object.assign({
                    data: presentation_data,
                    hoverOffset: 4,
                    backgroundColor: "#FD763B"
                }, datasets);
            }
            else if (chartType === "line") {
                datasets = Object.assign({
                    data: presentation_data,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                }, datasets);
            }

            // eslint-disable-next-line
            const data = {
                labels: labels,
                datasets: [datasets]
            };

            return data;
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
        },
        /**
         * resets all data selection for date picker to allow for selection of another date
         * @returns {void}
         */
        resetDates () {
            this.chartSubTitle = "";
            this.showDatepicker = true;
            this.chartdata.bar = {};
            this.chartdata.line = {};
            this.dates = "";
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
                <div class="row cards">
                    <DataCard
                        :title="translate('additional:modules.tools.vpidashboard.unique.avgVisitorsYear')"
                        detail="individualVisitors"
                        :navigation="true"
                    />
                    <DataCard
                        :title="translate('additional:modules.tools.vpidashboard.unique.avgVisitorsMonth')"
                        :navigation="true"
                        detail="monthly"
                    />
                    <DataCard
                        :title="translate('additional:modules.tools.vpidashboard.unique.avgVisitorsDay')"
                        :navigation="true"
                        detail="daily"
                    />
                </div>
                <div class="chartDataSelection">
                    <h2> {{ translate('additional:modules.tools.vpidashboard.unique.selectDataBase') }}</h2>
                    <select
                        id="chartDataSelector"
                        v-model="selectedChartDataComputed"
                        :aria-label="translate('additional:modules.tools.vpidashboard.unique.selectDataBase')"
                        class="form-select"
                    >
                        <option
                            v-for="(model, index) in possibleChartDatasets"
                            :key="index"
                            :value="model.chart"
                        >
                            {{ translate(model.name) }}
                        </option>
                    </select>
                    <div
                        v-if="showDatepicker"
                        class="pickADate"
                    >
                        <span> {{ datePickerTitle }}</span>
                        <DatePicker
                            v-model="dates"
                            :aria-label="translate('additional:modules.tools.vpidashboard.unique.date')"
                            :placeholder="translate('additional:modules.tools.vpidashboard.unique.date')"
                            type="date"
                            format="DD.MM.YYYY"
                            :range="selectedChartData === 'timeRange'"
                            :multiple="false"
                            :show-week-number="true"
                            title-format="DD.MM.YYYY"
                        />
                    </div>
                </div>
                <div
                    v-if="!showDatepicker"
                    class="charts"
                >
                    <span
                        v-if="isIndividualChartType"
                        class="chartsubtitle"
                    >
                        {{ chartSubTitle }}
                    </span>
                    <button
                        v-if="!showDatepicker && isIndividualChartType"
                        type="button"
                        class="resetDateButton"
                        @click="resetDates()"
                    >
                        {{ translate("additional:modules.tools.vpidashboard.unique.resetDate") }}
                    </button>
                    <!-- Bar Chart -->
                    <div v-if="chartType === 'bar'">
                        <div
                            class="row chart bar"
                        >
                            <BarchartItem :data="chartdata.bar" />
                        </div>
                    </div>
                    <!-- Line Chart -->
                    <div v-if="chartType === 'line'">
                        <div
                            class="row chart line"
                        >
                            <LinechartItem :data="chartdata.line" />
                        </div>
                    </div>
                </div>
                <div
                    v-if="!showDatepicker"
                    class="charts chart-types select"
                >
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
</template>

<style scoped>
.cards {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;

  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
}

.pickADate {
    margin-top: 0.7rem;
}

.charts {
  margin: 0.5rem;
}

.resetDateButton {
    margin-left: 1rem;
}

.chartDataSelection {
    margin-top: 1rem;
}
</style>
