<script>
import BarchartItem from "../../../../src/share-components/charts/components/BarchartItem.vue";
import DatePicker from "vue2-datepicker";
import {mapActions, mapGetters} from "vuex";
import actions from "../../store/actionsVpiDashboard";
import getters from "../../store/gettersVpiDashboard";
import dayjs from "dayjs";
import {highlightSelectedLocationOnMap} from "../../utils/highlightSelectedLocationOnMap";

export default {
    name: "CompareDashboard",
    components: {
        BarchartItem,
        DatePicker
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
            characteristic: ["Altersgruppen", "Verweildauer", "Besuchergruppen", "Individuelle Besucher"],
            character: "",
            compare: false,
            location_a_data: null,
            showCompareChart: false
        };
    },
    computed: {
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
            const dwellTimes = {
                dwellTimeLocationA: this.getDwellTimeLocationA,
                dwellTimeLocationB: this.getDwellTimeLocationB
            };

            return dwellTimes;
        },
        ageGroups () {
            const ageGroups = {
                ageGroupsLocationA: this.getAgeGroupsLocationA,
                ageGroupsLocationB: this.getAgeGroupsLocationB
            };

            return ageGroups;
        },
        visitorTypes () {
            const visitorTypes = {
                visitorTypesLocationA: this.getVisitorTypesLocationA,
                visitorTypesLocationB: this.getVisitorTypesLocationB
            };

            return visitorTypes;
        },
        invidualVisitors () {
            const individualVisitors = {
                individualVisitorsLocationA: this.getIndividualVisitorsLocationA,
                individualVisitorsLocationB: this.getIndividualVisitorsLocationB
            };

            return individualVisitors;
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
        character (oldValue, newValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
            }
        },
        location_a (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                highlightSelectedLocationOnMap(newValue.location_id, oldValue.location_id);
            }
        },
        location_b (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;

                highlightSelectedLocationOnMap(newValue.location_id, oldValue.location_id);
            }
        }
    },
    async created () {
        this.all_locations = this.getAllLocationsArray;
        this.all_locations.forEach((location) => {
            this.locations_a.push({location_id: location.id, street: location.street});
        });
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

            if (this.character === "Verweildauer") {
                await this.getDwellTimesToCompare(compareData);
                this.setBarChartDataForDwellTime();
            }
            if (this.character === "Altersgruppen") {
                await this.getAgeGroupsToCompare(compareData);
                this.setBarCharDataForAgeGroups();
            }
            if (this.character === "Besuchergruppen") {
                await this.getVisitorTypesToCompare(compareData);
                this.setBarCharDataForVisitorTypes();
            }
            if (this.character === "Individuelle Besucher") {
                await this.getIndividualVisitorsToCompare(compareData);
                this.setBarCharDataForIndividualVisitors();
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
        setBarCharDataForIndividualVisitors () {
            this.chartdata.bar.datasets[0] = this.invidualVisitors.individualVisitorsLocationA.datasets[0];
            this.chartdata.bar.datasets[1] = this.invidualVisitors.individualVisitorsLocationB.datasets[0];
            this.chartdata.bar.datasets[0].label = this.location_a.street;
            this.chartdata.bar.datasets[1].label = this.location_b.street;
            this.chartdata.bar.labels = this.invidualVisitors.individualVisitorsLocationA.labels;
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
                            <select
                                id="vpi-dashboard-select-location-a-select"
                                v-model="location_a"
                                class="font-arial form-select form-select-sm float-start"
                            >
                                <option
                                    v-for="(location, i) in locations_a"
                                    :key="i"
                                    :value="location"
                                >
                                    {{ location.street }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div id="vpi-dashboard-select-location-b">
                        <label
                            for="vpi-dashboard-select-location-b-select"
                        >
                            {{ translate('additional:modules.tools.vpidashboard.compare.location') }} B
                        </label>
                        <div class="col">
                            <select
                                id="vpi-dashboard-select-location-b-select"
                                v-model="location_b"
                                class="font-arial form-select form-select-sm float-start"
                                :disabled="disabled"
                            >
                                <option
                                    v-for="(location, i) in locations_b"
                                    :key="i"
                                    :value="location"
                                >
                                    {{ location.street }}
                                </option>
                            </select>
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
                                    :value="characterx"
                                >
                                    {{ characterx }}
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
                                type="date"
                                format="DD.MM.YYYY"
                                :multiple="false"
                                :show-week-number="true"
                                title-format="DD.MM.YYYY"
                                :lang="$t('common:libraries.vue2-datepicker.lang', {returnObjects: true})"
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
                    <h4>{{ translate('additional:modules.tools.vpidashboard.compare.location_comparison') }} {{ character }}</h4>
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

</style>
