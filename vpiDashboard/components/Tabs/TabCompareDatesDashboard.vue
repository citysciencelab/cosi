<script>
import BarchartItem from "../../utils/BarchartItem.vue";
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import ChangeChartTypeButtons from "../ChangeChartTypeButtons.vue";
import DatePicker from "vue2-datepicker";
import {mapActions, mapGetters, mapState} from "vuex";
import actions from "../../store/actionsVpiDashboard";
import getters from "../../store/gettersVpiDashboard";
import dayjs from "dayjs";
import {highlightSelectedLocationOnMap} from "../../utils/highlightSelectedLocationOnMap";

export default {
    name: "TabCompareDatesDashboard",
    components: {
        BarchartItem,
        LinechartItem,
        ChangeChartTypeButtons,
        DatePicker
    },
    data () {
        return {
            date_a: null,
            date_b: null,
            characteristic: [
                {
                    id: "activities",
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.activities")
                },
                {
                    id: "daily",
                    name: this.translate("additional:modules.tools.vpidashboard.unique.hourly")
                },
                {
                    id: "ageGroup",
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.age")
                },
                {
                    id: "dwellTime",
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.dwelltime")
                },
                {
                    id: "visitorTypes",
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.types")
                }
            ],
            character: "",
            characterName: "",
            showCompareChart: false,
            chartType: "bar",
            chartdata: {
                bar: {
                    datasets: [],
                    labels: []
                },
                line: {
                    datasets: [],
                    labels: []
                }
            },
            all_locations: [],
            locations_a: []
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapState("Tools/VpiDashboard", ["showLoader", "selectedLocationId"]),
        showCompareButton () {
            if (this.date_a !== null && this.date_b !== null) {
                return true;
            }
            return false;
        },
        dwellTime () {
            return {
                dwellTimeDateA: this.getDwellTimeDateA(this.chartType),
                dwellTimeDateB: this.getDwellTimeDateB(this.chartType)
            };
        },
        activities () {
            return {
                activitiesDateA: this.getActivitiesDateA(this.chartType),
                activitiesDateB: this.getActivitiesDateB(this.chartType)
            };
        },
        ageGroups () {
            return {
                ageGroupsDateA: this.getAgeGroupsDateA(this.chartType),
                ageGroupsDateB: this.getAgeGroupsDateB(this.chartType)
            };
        },
        visitorTypes () {
            return {
                visitorTypesDateA: this.getVisitorTypesDateA(this.chartType),
                visitorTypesDateB: this.getVisitorTypesDateB(this.chartType)
            };
        },
        dailyActivities () {
            return {
                activitiesLocationA: this.getDailyActivitiesDateA(this.chartType),
                activitiesLocationB: this.getDailyActivitiesDateB(this.chartType)
            };
        }
    },
    watch: {
        date_a (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
            }
        },
        date_b (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
            }
        },
        character (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                // reset date picker, if switched from or to 'activities' or 'daily'
                // as 'activities' allow a date range, 'daily' allow all single dates and other characters allow only first day of month
                if (["activities", "daily"].includes(oldValue) || ["activities", "daily"].includes(newValue)) {
                    this.date_a = null;
                    this.date_b = null;
                }
            }
        },
        selectedLocationId (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
                highlightSelectedLocationOnMap(newValue.location_id, oldValue.location_id);
            }

            const locationID = newValue.location_id,
                source = "dropdown";

            if (newValue !== this.selectedLocationId) {
                this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", {locationID, source});
            }
        }
    },
    async created () {
        this.all_locations = await this.getAllLocationsArray;
        this.all_locations.forEach((location) => {
            this.locations_a.push({location_id: location.id, street: location.street});
        });
    },
    methods: {
        dayjs,
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
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
         * compares the data between the selected two dates for a location
         * @returns {void}
         */
        async compareData () {

            const
                date_a = dayjs(this.date_a).format("YYYY-MM-DD"),
                date_b = dayjs(this.date_b).format("YYYY-MM-DD"),
                compareData = {
                    location_id: this.selectedLocationId,
                    dates: [
                        {date: date_a, dateName: "DateA"},
                        {date: date_b, dateName: "DateB"}
                    ]
                };

            compareData.character = this.character;

            if (this.character === "activities") {
                this.characterName = this.translate("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.activities");
                await this.getDataToCompare(compareData);
                this.setBarChartDataForActivities();
                this.setLineChartDataForActivities();
            }
            if (this.character === "ageGroup") {
                this.characterName = this.translate("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.ageGroup") + " (*)";
                await this.getDataToCompare(compareData);
                this.setBarChartDataForAgeGroups();
                this.setLineChartDataForAgeGroups();
            }
            if (this.character === "dwellTime") {
                this.characterName = this.translate("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.dwellTime");
                await this.getDataToCompare(compareData);
                this.setBarChartDataForDwellTime();
                this.setBarChartDataForDwellTime();
            }
            if (this.character === "visitorTypes") {
                this.characterName = this.translate("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.visitorTypes");
                await this.getDataToCompare(compareData);
                this.setBarChartDataForVisitorTypes();
                this.setLineChartDataForVisitorTypes();
            }
            if (this.character === "daily") {
                this.characterName = this.translate("additional:modules.tools.vpidashboard.unique.hourly");
                await this.getDataToCompare(compareData);
                this.setBarChartDataForDailyActivities();
                this.setLineChartDataForDailyActivities();
            }
            this.showCompareChart = true;
        },
        /**
         * sets the bar chart data to compare dwell times
         * @return {void}
         */
        setBarChartDataForDwellTime () {
            this.chartdata.bar.datasets[0] = this.dwellTime.dwellTimeDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.dwellTime.dwellTimeDateB.datasets[0];
            this.chartdata.bar.datasets[0].data = this.dwellTime.dwellTimeDateA.datasets[0].data;
            this.chartdata.bar.datasets[1].data = this.dwellTime.dwellTimeDateB.datasets[0].data;
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.dwellTime.dwellTimeDateA.labels;
        },
        /**
         * sets the line chart data to compare dwell times
         * @return {void}
         */
        setLineChartDataForDwellTime () {
            this.chartdata.line.datasets[0] = this.dwellTime.dwellTimeDateA.datasets[0];
            this.chartdata.line.datasets[1] = this.dwellTime.dwellTimeDateB.datasets[0];
            this.chartdata.line.datasets[0].data = this.dwellTime.dwellTimeDateA.datasets[0].data;
            this.chartdata.line.datasets[1].data = this.dwellTime.dwellTimeDateB.datasets[0].data;
            this.chartdata.line.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.line.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.line.labels = this.dwellTime.dwellTimeDateA.labels;
        },
        /**
         * sets the bar chart data to compare activities
         * @return {void}
         */
        setBarChartDataForActivities () {
            this.chartdata.bar.datasets[0] = this.activities.activitiesDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.activities.activitiesDateB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.activities.activitiesDateA.labels;
        },
        /**
         * sets the line chart data to compare activities
         * @return {void}
         */
        setLineChartDataForActivities () {
            this.chartdata.line.datasets[0] = this.activities.activitiesDateA.datasets[0];
            this.chartdata.line.datasets[1] = this.activities.activitiesDateB.datasets[0];
            this.chartdata.line.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.line.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.line.labels = this.activities.activitiesDateA.labels;
        },
        /**
         * sets the bar chart data to compare age groups
         * @return {void}
         */
        setBarChartDataForAgeGroups () {
            this.chartdata.bar.datasets[0] = this.ageGroups.ageGroupsDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.ageGroups.ageGroupsDateB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.ageGroups.ageGroupsDateA.labels;
        },
        /**
         * sets the line chart data to compare age groups
         * @return {void}
         */
        setLineChartDataForAgeGroups () {
            this.chartdata.line.datasets[0] = this.ageGroups.ageGroupsDateA.datasets[0];
            this.chartdata.line.datasets[1] = this.ageGroups.ageGroupsDateB.datasets[0];
            this.chartdata.line.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.line.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.line.labels = this.ageGroups.ageGroupsDateA.labels;
        },
        /**
         * sets the bar chart data to compare visitor types
         * @return {void}
         */
        setBarChartDataForVisitorTypes () {
            this.chartdata.bar.datasets[0] = this.visitorTypes.visitorTypesDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.visitorTypes.visitorTypesDateB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.visitorTypes.visitorTypesDateA.labels;
        },
        /**
         * sets the line chart data to compare visitor types
         * @return {void}
         */
        setLineChartDataForVisitorTypes () {
            this.chartdata.line.datasets[0] = this.visitorTypes.visitorTypesDateA.datasets[0];
            this.chartdata.line.datasets[1] = this.visitorTypes.visitorTypesDateB.datasets[0];
            this.chartdata.line.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.line.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.line.labels = this.visitorTypes.visitorTypesDateA.labels;
        },
        /**
         * sets the bar chart data to compare daily invidual visitors
         * @return {void}
         */
        setBarChartDataForDailyActivities () {
            this.chartdata.bar.datasets[0] = this.dailyActivities.activitiesLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.dailyActivities.activitiesLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.dailyActivities.activitiesLocationA.labels;
        },
        /**
         * sets the line chart data to compare daily invidual visitors
         * @return {void}
         */
        setLineChartDataForDailyActivities () {
            this.chartdata.line.datasets[0] = this.dailyActivities.activitiesLocationA.datasets[0];
            this.chartdata.line.datasets[1] = this.dailyActivities.activitiesLocationB.datasets[0];
            this.chartdata.line.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.line.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.line.labels = this.dailyActivities.activitiesLocationA.labels;
        },
        /**
         * sets the disabled dates for the datepicker
         * only allow past dates, at least 3 days ago for activities or 2 months ago for other characters but not longer than 01.01.2019
         * for every endpoint except of "Activities" only the first day in month may be selected
         * @param {Object} val date that shall be checked if it is disabled in the datepicker
         * @return {Boolean} tells if the date shall be disabled or not
         */
        disabledDates (val) {
            const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000,
                twoMonthsInMilliseconds = 60 * 24 * 60 * 60 * 1000;

            if (new Date(val).getTime() >= (new Date().getTime() - threeDaysInMilliseconds) || new Date(val).getTime() < new Date("2019-01-01T00:00:00").getTime()) {
                return true;
            }

            if (this.character !== "activities" && this.character !== "daily") {
                if (new Date(val).getTime() >= (new Date().getTime() - twoMonthsInMilliseconds)) {
                    return true;
                }
                return new Date(val).getDate() !== 1;
            }
            return false;
        },
        /**
         * define, which charttype shall be displayed
         * @param {String} chartType an be one of "bar" or "line"
         * @returns {void}
         */
        setChartType (chartType) {
            this.chartType = chartType;

            switch (this.character) {
                case "dwellTime":
                    if (chartType === "bar") {
                        this.setBarChartDataForDwellTime();
                    }
                    else {
                        this.setLineChartDataForDwellTime();
                    }
                    break;
                case "ageGroup":
                    if (chartType === "bar") {
                        this.setBarChartDataForAgeGroups();
                    }
                    else {
                        this.setLineChartDataForAgeGroups();
                    }
                    break;
                case "visitorTypes":
                    if (chartType === "bar") {
                        this.setBarChartDataForVisitorTypes();
                    }
                    else {
                        this.setLineChartDataForVisitorTypes();
                    }
                    break;
                case "activities":
                    if (chartType === "bar") {
                        this.setBarChartDataForActivities();
                    }
                    else {
                        this.setLineChartDataForActivities();
                    }
                    break;
                case "daily":
                    if (chartType === "bar") {
                        this.setBarChartDataForDailyActivities();
                    }
                    else {
                        this.setLineChartDataForDailyActivities();
                    }
                    break;
                default:
                    break;
            }
        },
        /**
         * check if there are data available for the selected characteristic and the selected dates
         * @returns {Boolean} if no data is available
         */
        noData () {
            // if (this.chartdata[this.chartType].datasets[0].data.length === 0 && this.chartdata[this.chartType].datasets[1].data.length === 0) {
            if (this.chartdata.bar.datasets[0].data.length === 0 && this.chartdata.bar.datasets[1].data.length === 0) {
                return true;
            }
            return false;
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
                <div class="row d-flex justify-content-center vpi-dashboard-compare-dashboard">
                    <div
                        id="vpi-dashboard-select-characteristic"
                        class="mt-3"
                    >
                        <label
                            for="vpi-dashboard-select-characteristic-select"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.character') }}
                        </label>
                        <div class="col">
                            <select
                                id="vpi-dashboard-select-characteristic-select"
                                v-model="character"
                                class="font-arial form-select form-select-sm float-start"
                            >
                                >
                                <option
                                    v-for="(characterx, i) in characteristic"
                                    :key="i"
                                    :value="characterx.id"
                                >
                                    {{ characterx.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div
                        id="vpi-dashboard-select-date-a"
                        class="mt-3"
                    >
                        <label
                            for="vpi-dashboard-select-date-picker"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.date_a') }}
                        </label>
                        <div class="col">
                            <DatePicker
                                id="vpi-dashboard-select-date-picker"
                                v-model="date_a"
                                aria-label="Datum"
                                placeholder="Datum"
                                :disabled-date="disabledDates"
                                type="date"
                                format="DD.MM.YYYY"
                                :multiple="false"
                                :show-week-number="true"
                                title-format="DD.MM.YYYY"
                                :lang="$t('common:libraries.vue2-datepicker.lang', {returnObjects: true})"
                            />
                        </div>
                    </div>
                    <div
                        id="vpi-dashboard-select-date-b"
                        class="mt-3"
                    >
                        <label
                            for="vpi-dashboard-select-date-picker"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.date_b') }}
                        </label>
                        <div class="col">
                            <DatePicker
                                id="vpi-dashboard-select-date-picker"
                                v-model="date_b"
                                aria-label="Datum"
                                placeholder="Datum"
                                :disabled-date="disabledDates"
                                type="date"
                                format="DD.MM.YYYY"
                                :multiple="false"
                                :show-week-number="true"
                                title-format="DD.MM.YYYY"
                                :lang="$t('common:libraries.vue2-datepicker.lang', {returnObjects: true})"
                            />
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center mt-3">
                        <Button
                            v-if="showCompareButton"
                            class="btn btn-secondary"
                            @click="compareData"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.compare') }}
                        </Button>
                    </div>
                    <div
                        v-if="showCompareChart && noData()"
                        class="row d-flex justify-content-center mt-3"
                    >
                        {{ translate('additional:modules.tools.vpidashboard.compare.noData') }}
                    </div>
                    <div
                        v-if="showCompareChart && !noData()"
                        class="row d-flex justify-content-center mt-3"
                    >
                        <h4>{{ translate('additional:modules.tools.vpidashboard.compare.date_comparison') }} {{ characterName }}</h4>
                        <BarchartItem
                            v-if="chartType === 'bar'"
                            :data="chartdata.bar"
                            :given-options="{
                                animation: false
                            }"
                        />
                        <LinechartItem
                            v-if="chartType === 'line'"
                            :data="chartdata.line"
                            :given-options="{
                                animation: false
                            }"
                        />
                        <ChangeChartTypeButtons
                            :chart-type="chartType"
                            @updateChartType="setChartType"
                        />
                    </div>
                    <div v-if="showCompareChart && !noData()">
                        <!-- make table horizontally, when max 7 columns (one week selected for activities) for good overview -->
                        <table
                            v-if="chartdata[chartType].labels.length < 8"
                            class="table"
                        >
                            <thead>
                                <tr>
                                    <th>
                                        {{ translate('additional:modules.tools.vpidashboard.compare.date') }}
                                    </th>
                                    <th
                                        v-for="header in chartdata[chartType].labels"
                                        :key="header"
                                    >
                                        {{ header }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {{ dayjs(date_a).format("DD.MM.YYYY") }}
                                    </td>
                                    <td
                                        v-for="(columndata, index) in chartdata[chartType].datasets[0].data"
                                        :key="index"
                                    >
                                        {{ columndata.toLocaleString("de-DE") }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {{ dayjs(date_b).format("DD.MM.YYYY") }}
                                    </td>
                                    <td
                                        v-for="(columndata, index) in chartdata[chartType].datasets[1].data"
                                        :key="index"
                                    >
                                        {{ columndata.toLocaleString("de-DE") }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- make table vertically, when too many columns so that it can be as high as necessary -->
                        <table
                            v-else
                            class="table"
                        >
                            <thead>
                                <tr>
                                    <th v-if="character !== 'daily'">
                                        {{ translate('additional:modules.tools.vpidashboard.compare.date') }}
                                    </th>
                                    <th v-else>
                                        {{ translate('additional:modules.tools.vpidashboard.compare.hour') }}
                                    </th>
                                    <th>
                                        {{ dayjs(date_a).format("DD.MM.YYYY") }}
                                    </th>
                                    <th>
                                        {{ dayjs(date_b).format("DD.MM.YYYY") }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(columndata, index) in chartdata.bar.datasets[0].data"
                                    :key="index"
                                >
                                    <td>
                                        {{ chartdata.bar.labels[index] }}
                                    </td>
                                    <td>
                                        {{ columndata.toLocaleString("de-DE") }}
                                    </td>
                                    <td>
                                        {{ chartdata.bar.datasets[1].data[index].toLocaleString("de-DE") }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <span v-if="character === 'ageGroup'">
                            {{ $t("additional:modules.tools.vpidashboard.tab.ageGroup.footnote") }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
