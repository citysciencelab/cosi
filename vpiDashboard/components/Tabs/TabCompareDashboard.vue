<script>
import BarchartItem from "../../../../src/share-components/charts/components/BarchartItem.vue";
import DatePicker from "vue2-datepicker";
import {mapActions, mapGetters, mapState} from "vuex";
import actions from "../../store/actionsVpiDashboard";
import getters from "../../store/gettersVpiDashboard";
import dayjs from "dayjs";
import Multiselect from "vue-multiselect";
import {highlightSelectedLocationOnMap} from "../../utils/highlightSelectedLocationOnMap";

export default {
    name: "TabCompareDashboard",
    components: {
        BarchartItem,
        DatePicker,
        Multiselect
    },
    data () {
        return {
            date: null,
            all_locations: [],
            locations_a: [],
            location_a: "",
            location_b: "",
            chartdata: {
                bar: {
                    datasets: [],
                    labels: []
                }
            },
            characteristic: [
                {
                    id: "activities",
                    name: this.translate("additional:modules.tools.vpidashboard.tabitems.activities")
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
            compare: false,
            location_a_data: null,
            showCompareChart: false,
            selectBInMap: true,
            locationCheckboxLabel: this.$t("additional:modules.tools.vpidashboard.compare.deselectLocationBinMap")
        };
    },
    computed: {
        ...mapState("Tools/VpiDashboard", ["selectedLocationId", "selectedLocationB"]),
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        locations_b () {
            return this.locations_a.filter(location => location.location_id !== this.location_a.location_id);
        },
        disabled () {
            if (this.location_a !== "") {
                return false;
            }
            return true;
        },
        dwellTime () {
            return {
                dwellTimeLocationA: this.getDwellTimeLocationA,
                dwellTimeLocationB: this.getDwellTimeLocationB
            };
        },
        ageGroups () {
            return {
                ageGroupsLocationA: this.getAgeGroupsLocationA,
                ageGroupsLocationB: this.getAgeGroupsLocationB
            };
        },
        visitorTypes () {
            return {
                visitorTypesLocationA: this.getVisitorTypesLocationA,
                visitorTypesLocationB: this.getVisitorTypesLocationB
            };
        },
        invidualVisitors () {
            return {
                activitiesLocationA: this.getActivitiesLocationA,
                activitiesLocationB: this.getActivitiesLocationB
            };
        },
        showCompareButton () {
            if (this.location_a !== "" && this.location_b !== "" && this.character !== "" && this.date !== null) {
                return true;
            }
            return false;
        },
        showSpinner () {
            if (this.chartdata.bar.datasets.length < 1) {
                return true;
            }
            return false;
        }
    },
    watch: {
        date (oldValue, newValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
            }
        },
        character (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                // reset date picker, if switched from 'activities' to other character,
                // as 'activities' allow every date and other characters allow only first day of month
                if (oldValue === "activities") {
                    this.date = null;
                }
            }
        },
        location_a (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                highlightSelectedLocationOnMap(newValue.location_id, oldValue.location_id);

                const locationID = newValue.location_id,
                    source = "dropdown";

                if (newValue !== this.selectedLocationId) {
                    this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", {locationID, source});
                }
            }
        },
        location_b (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                if (newValue) {
                    highlightSelectedLocationOnMap(newValue.location_id, oldValue?.location_id);
                }
            }
        },
        selectedLocationId (newValue) {
            this.location_a = this.locations_a.find(l => {
                return l.location_id === newValue;
            });
        },
        selectedLocationB (newValue) {
            if (newValue !== this.selectedLocationId) {
                this.location_b = this.locations_b.find(l => {
                    return l.location_id === newValue;
                });
            }
        },
        selectBInMap (newVal) {
            this.$store.commit("Tools/VpiDashboard/setSelectLocationBInMap", newVal);

            this.locationCheckboxLabel = !newVal
                ? this.$t("additional:modules.tools.vpidashboard.compare.selectLocationBinMap")
                : this.$t("additional:modules.tools.vpidashboard.compare.deselectLocationBinMap");
        }
    },
    async created () {
        this.all_locations = this.getAllLocationsArray;
        this.all_locations.forEach((location) => {
            this.locations_a.push({location_id: location.id, street: location.street});
        });

        this.location_a = this.locations_a.find(l => {
            return l.location_id === this.selectedLocationId;
        });

        this.$store.commit("Tools/VpiDashboard/setSelectLocationBInMap", true);
    },
    methods: {
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
         * compares data between to location ids (location_id_a & location_id_b)
         * with a given date for a day in the format YYYY-MM-DD.
         * @return {void}
         */
        async compareData () {
            const
                date = dayjs(this.date).format("YYYY-MM-DD"),
                location_id_a = this.location_a.location_id,
                location_id_b = this.location_b.location_id,
                compareData = {
                    location_id_a: location_id_a,
                    location_id_b: location_id_b,
                    date: date
                };

            if (this.character === "dwellTime") {
                await this.getDwellTimesToCompare(compareData);
                this.setBarChartDataForDwellTime();
            }
            if (this.character === "ageGroup") {
                await this.getAgeGroupsToCompare(compareData);
                this.setBarCharDataForAgeGroups();
            }
            if (this.character === "visitorTypes") {
                await this.getVisitorTypesToCompare(compareData);
                this.setBarCharDataForVisitorTypes();
            }
            if (this.character === "activities") {
                await this.getActivitiesToCompare(compareData);
                this.setBarCharDataForActivities();
            }
            this.showCompareChart = true;
        },
        /**
         * sets the bar chart data to compare dwell times
         * @return {void}
         */
        setBarChartDataForDwellTime () {
            this.chartdata.bar.datasets[0] = this.dwellTime.dwellTimeLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.dwellTime.dwellTimeLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = this.location_a.street;
            this.chartdata.bar.datasets[1].label = this.location_b.street;
            this.chartdata.bar.labels = this.dwellTime.dwellTimeLocationA.labels;
        },
        /**
         * sets the bar chart data to compare age groups
         * @return {void}
         */
        setBarCharDataForAgeGroups () {
            this.chartdata.bar.datasets[0] = this.ageGroups.ageGroupsLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.ageGroups.ageGroupsLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = this.location_a.street;
            this.chartdata.bar.datasets[1].label = this.location_b.street;
            this.chartdata.bar.labels = this.ageGroups.ageGroupsLocationA.labels;
        },
        /**
         * sets the bar chart data to compare visitor type
         * @return {void}
         */
        setBarCharDataForVisitorTypes () {
            this.chartdata.bar.datasets[0] = this.visitorTypes.visitorTypesLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.visitorTypes.visitorTypesLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = this.location_a.street;
            this.chartdata.bar.datasets[1].label = this.location_b.street;
            this.chartdata.bar.labels = this.visitorTypes.visitorTypesLocationA.labels;
        },
        /**
         * sets the bar chart data to compare invidual visitors
         * @return {void}
         */
        setBarCharDataForActivities () {
            this.chartdata.bar.datasets[0] = this.invidualVisitors.activitiesLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.invidualVisitors.activitiesLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = this.location_a.street;
            this.chartdata.bar.datasets[1].label = this.location_b.street;
            this.chartdata.bar.labels = this.invidualVisitors.activitiesLocationA.labels;
        },
        /**
         * sets the disabled dates for the datepicker
         * only allow past dates, at least 3 days ago for activities or 2 months ago for other characters but not longer than 01.01.2019
         * for every endpoint except of "activities" only the first day in month may be selected
         * @param {Object} val date that shall be checked if it is disabled in the datepicker
         * @return {Boolean} tells if the date shall be disabled or not
         */
        disabledDates (val) {
            const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000,
                twoMonthsInMilliseconds = 60 * 24 * 60 * 60 * 1000;

            if (new Date(val).getTime() >= (new Date().getTime() - threeDaysInMilliseconds) || new Date(val).getTime() < new Date("2019-01-01T00:00:00").getTime()) {
                return true;
            }

            if (this.character !== "activities") {
                if (new Date(val).getTime() >= (new Date().getTime() - twoMonthsInMilliseconds)) {
                    return true;
                }
                return new Date(val).getDate() !== 1;
            }
            return false;
        },
        /**
         * Return the translated label for the selected comparison.
         * @param {String} id current selected comparison id from dropdown
         * @return {string} the label for the selected comparison type
         */
        getComparisonChartLabel (id) {
            const
                selectedItem = this.characteristic.find(item => item.id === id);

            return selectedItem.name;
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
                    <div id="vpi-dashboard-select-location-a">
                        <label
                            for="vpi-dashboard-select-location-a-select"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.location') }} A
                        </label>
                        <div class="col">
                            <Multiselect
                                v-model="location_a"
                                tag-placeholder="Add this as new tag"
                                :placeholder="translate('additional:modules.tools.vpidashboard.locationSelectMenu.menuPlaceholder')"
                                label="street"
                                track-by="street"
                                :options="locations_a"
                                :allow-empty="false"
                            />
                        </div>
                    </div>
                    <div id="vpi-dashboard-select-location-b">
                        <label
                            for="vpi-dashboard-select-location-b-select"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.location') }} B
                        </label>
                        <div class="col">
                            <Multiselect
                                v-model="location_b"
                                tag-placeholder="Add this as new tag"
                                :placeholder="translate('additional:modules.tools.vpidashboard.locationSelectMenu.menuPlaceholder')"
                                label="street"
                                track-by="street"
                                :options="locations_b"
                                :allow-empty="false"
                            />
                        </div>
                        <div>
                            <input
                                id="selectBInMap"
                                v-model="selectBInMap"
                                type="checkbox"
                            >
                            <label
                                for="selectBInMap"
                            >
                                {{ locationCheckboxLabel }}
                            </label>
                        </div>
                    </div>
                    <div id="vpi-dashboard-select-characteristic">
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
                    <div id="vpi-dashboard-select-date">
                        <label
                            for="vpi-dashboard-select-date-picker"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.date') }}
                        </label>
                        <div class="col">
                            <DatePicker
                                id="vpi-dashboard-select-date-picker"
                                v-model="date"
                                aria-label="Datum"
                                placeholder="Datum"
                                :disabled-date="disabledDates"
                                type="date"
                                format="DD.MM.YYYY"
                                :multiple="false"
                                :show-week-number="true"
                                title-format="DD.MM.YYYY"
                                :lang="translate('common:libraries.vue2-datepicker.lang', {returnObjects: true})"
                            />
                        </div>
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
                    v-if="showCompareChart"
                    class="row d-flex justify-content-center mt-3"
                >
                    <h4>
                        {{ translate('additional:modules.tools.vpidashboard.compare.location_comparison') }}
                        {{ getComparisonChartLabel(character) }}
                    </h4>
                    <BarchartItem :data="chartdata.bar" />
                </div>
                <div v-if="showCompareChart">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    {{ translate('additional:modules.tools.vpidashboard.compare.location') }}
                                </th>
                                <th
                                    v-for="header in chartdata.bar.labels"
                                    :key="header"
                                >
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {{ location_a.street }}
                                </td>
                                <td
                                    v-for="(columndata, index) in chartdata.bar.datasets[0].data"
                                    :key="index"
                                >
                                    {{ columndata.toLocaleString("de-DE") }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {{ location_b.street }}
                                </td>
                                <td
                                    v-for="(columndata, index) in chartdata.bar.datasets[1].data"
                                    :key="index"
                                >
                                    {{ columndata.toLocaleString("de-DE") }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    input[type="checkbox"] {
        height: 1.2em;
        width: 1.2em;
        margin: 10px 5px;
    }
</style>
