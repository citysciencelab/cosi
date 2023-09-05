<script>
import {mapGetters, mapActions, mapState} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";
import dayjs from "dayjs";
import "dayjs/locale/de";

// Components Import
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import DataCard from "../DataCard.vue";
import BarchartItem from "../../../../src/share-components/charts/components/BarchartItem.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import ChangeChartTypeButtons from "../ChangeChartTypeButtons.vue";
import apiEndpointService from "../../store/apiEndpointService";

export default {
    name: "TabActivities",
    components: {
        DataCard,
        LinechartItem,
        BarchartItem,
        DatePicker,
        ChangeChartTypeButtons
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
            renderKey: 0,
            currentlySelectedYear: 2019,
            currentlySelectedMonth: 0
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
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
         * @returns {Boolean} is activities chart type
        */
        isActivitiesChartType () {
            return ["hourly", "timeRange"].indexOf(this.selectedChartData) !== -1;
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
        },
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
        dates (value) {
            if (value !== "") {
                this.dayDatepickerValueChanged(value);
            }
        },
        async selectedLocationId () {
            await this.getActivities();
            await this.fillInitialChartData();

            // re-fill the charts with correct data for currently selected year and month after switch of location
            this.yearHasChanged(this.yearList.indexOf(this.currentlySelectedYear));
            this.monthHasChanged(this.currentlySelectedMonth);
        }
    },
    async created () {
        this.$on("close", this.close);
        await this.getActivities();
        await this.fillInitialChartData();
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * Create the chart data for first overview
         * @returns {void}
        */
        async fillInitialChartData () {
            if (this.dates.length !== 0) {
                this.dayDatepickerValueChanged(this.dates);
            }
            this.getCurrentBarChartData();
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
         * if an activities chart type (urges the user to pick a date / daterange before) is selected, the date picker is prepared
         * otherwise the data are selected and the chart change is started
         * @returns {void}
        */
        switchChart () {
            this.showDatepicker = false;
            if (this.isActivitiesChartType) {
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
                        dayName: dayjs(values).locale(this.currentLocale).format("dddd"),
                        dateValue: dayjs(values).format("DD.MM.YYYY")
                    });

                    await this.getActivitiesForDay(dayjs(values).format("YYYY-MM-DD")).then((data) => {
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

                await apiEndpointService.receiveActivities(
                    this.selectedLocationId,
                    dayjs(values[0]).format("YYYY-MM-DD"),
                    dayjs(values[1]).format("YYYY-MM-DD")
                ).then((data) => {
                    this.chartdata.bar = this.createChartData(data.data.data, "bar", "daily");
                    this.chartdata.line = this.createChartData(data.data.data, "line", "daily");
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
                    presentation_data.push(Math.floor(element.sum_num_visitors));
                }
                else {
                    labels.push(dayjs(element.date).locale(this.currentLocale).format("dd, DD.MM.YYYY"));
                    presentation_data.push(Math.ceil(element.sum_num_visitors / 100) * 100);
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
        },
        /**
         * reacts on a change of year in first data card, changes data basis for monthly and daily charts
         * @param {Number} newYear index of new year
         * @returns {void}
         */
        yearHasChanged (newYear) {
            if (this.yearList.length > newYear) {
                this.currentlySelectedYear = this.yearList[newYear];
                this.$store.commit("Tools/VpiDashboard/setBarChartMonthlyData", this.currentlySelectedYear);
                this.$store.commit("Tools/VpiDashboard/setLineChartMonthlyData", this.currentlySelectedYear);
                this.$store.commit("Tools/VpiDashboard/setBarChartDailyData", {year: this.currentlySelectedYear, month: this.currentlySelectedMonth});
                this.$store.commit("Tools/VpiDashboard/setLineChartDailyData", {year: this.currentlySelectedYear, month: this.currentlySelectedMonth});
                this.getCurrentBarChartData();
            }
        },
        /**
         * reacts on a change of month in second data card, changes data basis for daily charts
         * @param {Number} newMonth index of new month
         * @returns {void}
         */
        monthHasChanged (newMonth) {
            this.currentlySelectedMonth = newMonth;
            this.$store.commit("Tools/VpiDashboard/setBarChartDailyData", {year: this.currentlySelectedYear, month: newMonth});
            this.$store.commit("Tools/VpiDashboard/setLineChartDailyData", {year: this.currentlySelectedYear, month: newMonth});
            this.getCurrentBarChartData();
        },
        /**
         * sets the disabled dates for the datepicker
         * only allow past dates, at least 3 days ago but not longer than 01.01.2019
         * @param {Object} val date that shall be checked if it is disabled in the datepicker
         * @return {Boolean} tells if the date shall be disabled or not
         */
        disabledDates (val) {
            const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

            return new Date(val).getTime() >= (new Date().getTime() - threeDaysInMilliseconds) || new Date(val).getTime() < new Date("2019-01-01T00:00:00").getTime();
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
                        detail="activities"
                        :navigation="true"
                        @indexChanged="yearHasChanged"
                    />
                    <DataCard
                        :title="translate('additional:modules.tools.vpidashboard.unique.avgVisitorsMonth', { year: currentlySelectedYear })"
                        :navigation="true"
                        detail="monthly"
                        :subset-year="currentlySelectedYear"
                        @indexChanged="monthHasChanged"
                    />
                    <DataCard
                        :title="translate('additional:modules.tools.vpidashboard.unique.avgVisitorsDay', { year: currentlySelectedYear, month: translate('additional:modules.tools.vpidashboard.time.months', {returnObjects: true})[currentlySelectedMonth] })"
                        :navigation="true"
                        :subset-year="currentlySelectedYear"
                        :subset-month="currentlySelectedMonth"
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
                            {{ translate(model.name, {year: currentlySelectedYear, month: translate('additional:modules.tools.vpidashboard.time.months', {returnObjects: true})[currentlySelectedMonth]}) }}
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
                            :disabled-date="disabledDates"
                            :range="selectedChartData === 'timeRange'"
                            :multiple="false"
                            :show-week-number="true"
                            title-format="DD.MM.YYYY"
                            :lang="translate('common:libraries.vue2-datepicker.lang', {returnObjects: true})"
                        />
                    </div>
                </div>
                <div
                    v-if="!showDatepicker"
                    class="charts"
                >
                    <span
                        v-if="isActivitiesChartType"
                        class="chartsubtitle"
                    >
                        {{ chartSubTitle }}
                    </span>
                    <button
                        v-if="!showDatepicker && isActivitiesChartType"
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
