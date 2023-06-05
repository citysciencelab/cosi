<script>
import BarchartItem from "../../utils/BarchartItem.vue";
import DatePicker from "vue2-datepicker";
import {mapActions, mapGetters, mapState} from "vuex";
import actions from "../../store/actionsVpiDashboard";
import getters from "../../store/gettersVpiDashboard";
import dayjs from "dayjs";
import Multiselect from "vue-multiselect";
import {highlightSelectedLocationOnMap} from "../../utils/highlightSelectedLocationOnMap";

export default {
    name: "CompareDatesDashboard",
    components: {
        BarchartItem,
        DatePicker,
        Multiselect
    },
    data () {
        return {
            date_a: null,
            date_b: null,
            characteristic: [
                "Altersgruppen",
                "Verweildauer",
                "Besuchergruppen",
                "Individuelle Besucher"
            ],
            character: "",
            showCompareChart: false,
            chartdata: {
                bar: {
                    datasets: [],
                    labels: []
                }
            },
            all_locations: [],
            locations_a: [],
            location_a: ""
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapState("Tools/VpiDashboard", ["showLoader"]),
        showCompareButton () {
            if (this.date_a !== null && this.date_b !== null) {
                return true;
            }
            return false;
        },
        dwellTime () {
            const dwellTimes = {
                dwellTimeDateA: this.getDwellTimeDateA,
                dwellTimeDateB: this.getDwellTimeDateB
            };

            return dwellTimes;
        },
        individualVisitors () {
            const individualVisitors = {
                individualVisitorsDateA: this.getInvididualVisitorsDateA,
                individualVisitorsDateB: this.getInvididualVisitorsDateB
            };

            return individualVisitors;
        },
        ageGroups () {
            const ageGroups = {
                ageGroupsDateA: this.getAgeGroupsDateA,
                ageGroupsDateB: this.getAgeGroupsDateB
            };

            return ageGroups;
        },
        visitorTypes () {
            const visitorTypes = {
                visitorTypesDateA: this.getVisitorTypesDateA,
                visitorTypesDateB: this.getVisitorTypesDateB
            };

            return visitorTypes;
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
            }
        },
        location_a (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.showCompareChart = false;
                highlightSelectedLocationOnMap(newValue.location_id, oldValue.location_id);
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
                location_id = this.location_a.location_id,
                compareData = {
                    location_id: location_id,
                    dates: [
                        {date: date_a, dateName: "DateA"},
                        {date: date_b, dateName: "DateB"}
                    ]
                };

            if (this.character === "Individuelle Besucher") {
                compareData.character = this.character;
                await this.getDataToCompare(compareData);
                this.setBarChartDataForInvidiualVisitors();
            }
            if (this.character === "Altersgruppen") {
                compareData.character = this.character;
                await this.getDataToCompare(compareData);
                this.setBarChartDataForAgeGroups();
            }
            if (this.character === "Verweildauer") {
                compareData.character = this.character;
                await this.getDataToCompare(compareData);
                this.setBarChartDataForDwellTime();
            }
            if (this.character === "Besuchergruppen") {
                compareData.character = this.character;
                await this.getDataToCompare(compareData);
                this.setBarChartDataForVistorTypes();
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
         * sets the bar chart data to compare individual visitors
         * @return {void}
         */
        setBarChartDataForInvidiualVisitors () {
            this.chartdata.bar.datasets[0] = this.individualVisitors.individualVisitorsDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.individualVisitors.individualVisitorsDateB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.individualVisitors.individualVisitorsDateA.labels;
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
         * sets the bar chart data to compare visitor types
         * @return {void}
         */
        setBarChartDataForVistorTypes () {
            this.chartdata.bar.datasets[0] = this.visitorTypes.visitorTypesDateA.datasets[0];
            this.chartdata.bar.datasets[1] = this.visitorTypes.visitorTypesDateB.datasets[0];
            this.chartdata.bar.datasets[0].label = dayjs(this.date_a).format("DD.MM.YYYY");
            this.chartdata.bar.datasets[1].label = dayjs(this.date_b).format("DD.MM.YYYY");
            this.chartdata.bar.labels = this.visitorTypes.visitorTypesDateA.labels;
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
                            {{ translate('additional:modules.tools.vpidashboard.compare.location') }}
                        </label>
                        <div class="col">
                            <Multiselect
                                v-model="location_a"
                                tag-placeholder="Add this as new tag"
                                :placeholder="translate('additional:modules.tools.vpidashboard.locationSelectMenu.menuPlaceholder')"
                                label="street"
                                track-by="street"
                                :options="locations_a"
                            />
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
                                    :value="characterx"
                                >
                                    {{ characterx }}
                                </option>
                            </select>
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
                        <h4>{{ translate('additional:modules.tools.vpidashboard.compare.date_comparison') }} {{ character }}</h4>
                        <BarchartItem :data="chartdata.bar" />
                    </div>
                    <div v-if="showCompareChart">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>
                                        {{ translate('additional:modules.tools.vpidashboard.compare.date') }}
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
                                        {{ dayjs(date_a).format("DD.MM.YYYY") }}
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
                                        {{ dayjs(date_b).format("DD.MM.YYYY") }}
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
    </div>
</template>


<style scoped>

</style>
