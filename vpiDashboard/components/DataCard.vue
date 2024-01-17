<script>
import {mapActions, mapGetters, mapState} from "vuex";
import getters from "../store/gettersVpiDashboard";
import actions from "../store/actionsVpiDashboard";
import DataCardPaginator from "./DataCardPaginator.vue";

export default {
    name: "DataCard",
    components: {DataCardPaginator},
    props: {
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: false,
            default: ""
        },
        navigation: {
            type: Boolean,
            required: false,
            default: false
        },
        subtitle: {
            type: String,
            required: false,
            default: ""
        },
        showDetailsButton: {
            type: Boolean,
            required: false,
            default: false
        },
        subsetYear: {
            type: Number,
            required: false,
            default: 0
        },
        subsetMonth: {
            type: Number,
            required: false,
            default: 0
        },
        updateIndex: {
            type: Number,
            required: false,
            default: 0
        },
        startValueIndex: {
            type: Number,
            required: false,
            default: 0
        }
    },
    data () {
        return {
            currentMonthIndex: 0,
            currentDayIndex: 0,
            currentYearIndex: this.startValueIndex
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapState(
            "Tools/VpiDashboard",
            [
                "sumVisitorsPerMonth",
                "averageVisitorsPerDay",
                "activitiesPerYear",
                "visitorTypesByTypeAndYear"
            ]),
        /**
         * returns the data for the selected card at the current page
         * @returns {String} the average or yearly number of visitors for the current parameters
         */
        statisticSet () {
            if (this.detail === "monthly" && Object.keys(this.sumVisitorsPerMonth).length > 0 && Object.keys(this.sumVisitorsPerMonth[this.subsetYear]).length > 0) {
                return this.sumVisitorsPerMonth[this.subsetYear][this.currentMonthIndex].sum.toLocaleString(this.currentLocale);
            }
            if (this.detail === "daily" && Object.keys(this.averageVisitorsPerDay).length > 0 && Object.keys(this.averageVisitorsPerDay[this.subsetYear]).length > 0 && Object.keys(this.averageVisitorsPerDay[this.subsetYear][this.subsetMonth]).length > 0) {
                return this.averageVisitorsPerDay[this.subsetYear][this.subsetMonth][this.currentDayIndex].avg.toLocaleString(this.currentLocale);
            }
            if (this.detail === "activities" && this.activitiesPerYear !== "") {
                const selectedYearData = this.activitiesPerYear.filter((element) => {
                    return Number(element.date__year) === this.currentYearIndex + 2019;
                });

                return selectedYearData[0].avg.toLocaleString(this.currentLocale);
            }

            // Cards for Tab "Visitor Types"
            if (this.detail === "visitorTypeCommutersPerWeek" && this.visitorTypesByTypeAndYear?.Pendler) {
                return this.visitorTypesByTypeAndYear.Pendler[this.currentYearIndex + 2019]?.toLocaleString(this.currentLocale) ?? "n/a";
            }
            if (this.detail === "visitorTypeResidentsPerWeek" && this.visitorTypesByTypeAndYear?.Einwohner) {
                return this.visitorTypesByTypeAndYear.Einwohner[this.currentYearIndex + 2019]?.toLocaleString(this.currentLocale) ?? "n/a";
            }
            if (this.detail === "visitorTypeTouristsPerWeek" && this.visitorTypesByTypeAndYear?.Touristen) {
                return this.visitorTypesByTypeAndYear.Touristen[this.currentYearIndex + 2019]?.toLocaleString(this.currentLocale) ?? "n/a";
            }

            return null;
        },
        /**
         * returns a list of month names or day names with can be used together with the paginator to walk through the data
         * @returns {Array} an array of months or days
         */
        paginatorData () {
            if (this.detail === "monthly") {
                return this.translate("additional:modules.tools.vpidashboard.time.months", {returnObjects: true});
            }
            if (this.detail === "daily") {
                return this.translate("additional:modules.tools.vpidashboard.time.days", {returnObjects: true});
            }
            if (this.detail === "activities") {
                const thisYear = new Date().getFullYear(),
                    list = [];
                let firstYear = 2019;

                while (firstYear <= thisYear) {
                    list.push(firstYear);
                    firstYear++;
                }

                return list;
            }

            // Cards for Tab "Visitor Types"
            if (this.detail === "visitorTypeCommutersPerWeek" && this.visitorTypesByTypeAndYear?.Pendler) {
                return Object.keys(this.visitorTypesByTypeAndYear.Pendler);
            }
            if (this.detail === "visitorTypeResidentsPerWeek" && this.visitorTypesByTypeAndYear?.Einwohner) {
                return Object.keys(this.visitorTypesByTypeAndYear.Einwohner);
            }
            if (this.detail === "visitorTypeTouristsPerWeek" && this.visitorTypesByTypeAndYear?.Touristen) {
                return Object.keys(this.visitorTypesByTypeAndYear.Touristen);
            }

            return null;
        }
    },
    watch: {
        updateIndex (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (
                    (this.detail === "visitorTypeCommutersPerWeek" ||
                    this.detail === "visitorTypeResidentsPerWeek" ||
                    this.detail === "visitorTypeTouristsPerWeek") &&
                    this.newValue !== this.currentYearIndex
                ) {
                    this.changeIndex(newValue);
                }
            }
        }
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * reacts on the change of the paginator in monthly or daily data card
         * @param {String} index selected page to be shown
         * @returns {void}
         */
        changeIndex (index) {
            if (this.detail === "monthly") {
                this.currentMonthIndex = index;
            }
            if (this.detail === "daily") {
                this.currentDayIndex = index;
            }
            if (this.detail === "activities") {
                this.currentYearIndex = index;
            }

            // Cards for Tab "Visitor Types"
            if (
                this.detail === "visitorTypeCommutersPerWeek" ||
                this.detail === "visitorTypeResidentsPerWeek" ||
                this.detail === "visitorTypeTouristsPerWeek"
            ) {
                this.currentYearIndex = index;
            }

            this.$emit("indexChanged", index);
        },
        /**
         * calls a store function to change the used chart data base and initiates change in chart and button style
         * @param {String} chartoverview selected chart to be shown
         * @returns {void}
         */
        showChart (chartoverview) {
            this.changeChart(chartoverview);
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
    <div
        :id="`card` + title"
        class="vpicard statistic-card"
    >
        <h4>{{ title }}</h4>
        <div v-if="navigation">
            <DataCardPaginator
                :paginator-data="paginatorData"
                :start-value-index="startValueIndex"
                @pager="changeIndex"
            />
        </div>
        <div v-else>
            <span class="current-index sub-index">{{ subtitle }}</span>
        </div>
        <div>
            <span class="card-text">
                {{ statisticSet }}
            </span>
        </div>
        <div class="card-buttons">
            <button
                v-if="showDetailsButton"
                :id="`button` + title"
                class="btn-secondary detailButton"
                @click="showChart(`${detail}overview`)"
            >
                {{ translate("additional:modules.tools.vpidashboard.details") }}
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.vpicard {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 12rem;
    max-width: 12rem;
    height: 12rem;
    padding: 1rem;
    background: #f6f7f8;
    border: none;
}

.vpicard h4 {
    font-size: 0.7rem;
    text-align: center;
    margin-bottom: 0;

}

.vpicard .card-buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.buttonClicked {
    border: 0.1rem solid white !important;
    color: white;
    background-color: #003063 !important;
}

.buttonClicked:hover {
    color: white !important;
}

.card-text {
    font-family: "HamburgSans-Regular", sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 16pt;
    text-align: center;
    letter-spacing: .2px;
    color: #000;
    display: block;
}


.blue-card {
    background-color: #003063 !important;
    color: white;
}

.blue-card .page-item a {
    background-color: #003063 !important;
    color: white;
}

.blue-card .statistic-value-text {
    color: white;
}
</style>
