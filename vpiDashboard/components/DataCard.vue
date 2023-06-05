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
        }
    },
    data () {
        return {
            currentMonthIndex: 0,
            currentDayIndex: 0,
            currentYearIndex: 0
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapState(
            "Tools/VpiDashboard",
            [
                "averageVisitorsPerMonth",
                "averageVisitorsPerDay",
                "individualVisitorsPerYear",
                "visitorTypesByTypeAndYear"
            ]),
        /**
         * returns the data for the selected card at the current page
         * @returns {String} the average or yearly number of visitors for the current parameters
         */
        statisticSet () {
            if (this.detail === "monthly" && this.averageVisitorsPerMonth.length > 0) {
                return this.averageVisitorsPerMonth[this.currentMonthIndex].avg.toLocaleString(this.currentLocale);
            }
            if (this.detail === "daily" && this.averageVisitorsPerDay.length > 0) {
                return this.averageVisitorsPerDay[this.currentDayIndex].avg.toLocaleString(this.currentLocale);
            }
            if (this.detail === "individualVisitors" && this.individualVisitorsPerYear !== "") {
                const selectedYearData = this.individualVisitorsPerYear.filter((element) => {
                    return element.date__year === this.currentYearIndex + 2019;
                });

                return selectedYearData[0].avg.toLocaleString(this.currentLocale);
            }

            // Cards for Tab "Visitor Types"
            if (this.detail === "visitorTypeCommutersPerDay") {
                return this.visitorTypesByTypeAndYear.Pendler[this.currentYearIndex + 2019].toLocaleString(this.currentLocale);
            }
            if (this.detail === "visitorTypeResidentsPerDay") {
                return this.visitorTypesByTypeAndYear.Einwohner[this.currentYearIndex + 2019].toLocaleString(this.currentLocale);
            }
            if (this.detail === "visitorTypeTouristsPerDay") {
                return this.visitorTypesByTypeAndYear.Touristen[this.currentYearIndex + 2019].toLocaleString(this.currentLocale);
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
            if (this.detail === "individualVisitors") {
                return [2019, 2020, 2021, 2022, 2023];
            }

            // Cards for Tab "Visitor Types"
            if (this.detail === "visitorTypeCommutersPerDay") {
                return Object.keys(this.visitorTypesByTypeAndYear.Pendler);
            }
            if (this.detail === "visitorTypeResidentsPerDay") {
                return Object.keys(this.visitorTypesByTypeAndYear.Einwohner);
            }
            if (this.detail === "visitorTypeTouristsPerDay") {
                return Object.keys(this.visitorTypesByTypeAndYear.Touristen);
            }

            return null;
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
            if (this.detail === "individualVisitors") {
                this.currentYearIndex = index;
            }

            // Cards for Tab "Visitor Types"
            if (
                this.detail === "visitorTypeCommutersPerDay" ||
                this.detail === "visitorTypeResidentsPerDay" ||
                this.detail === "visitorTypeTouristsPerDay"
            ) {
                this.currentYearIndex = index;
            }
        },
        /**
         * calls a store function to change the used chart data base and initiates change in chart and button style
         * @param {String} chartoverview selected chart to be shown
         * @param {String} title the title of the chart to identify the card and button
         * @returns {void}
         */
        showChart (chartoverview, title) {
            this.changeChart(chartoverview);
            this.changeChartStyle(title);
            this.changeButtonStyles(title);
        },
        /**
         * changes the button style if the "details" button on a card has been pressed
         * @param {String} title the title of the chart to identify the buttonId
         * @returns {void}
         */
        changeButtonStyles (title) {
            const detailButtonId = "button" + title,

                detailButtons = document.querySelectorAll(".detailButton"),
                allDataButton = document.getElementById("all-data-button");

            allDataButton.classList.remove("btn-primary");
            allDataButton.classList.add("btn-secondary");

            detailButtons.forEach(detailButton => {
                if (detailButton.id === detailButtonId) {
                    detailButton.classList.remove("btn-secondary");
                    detailButton.classList.add("buttonClicked");
                }
                else {
                    detailButton.classList.remove("buttonClicked");
                    detailButton.classList.add("btn-secondary");
                }
            });
        },
        /**
         * changes the chart style if the "details" button on a card has been pressed
         * @param {String} title the title of the chart to identify the cardId
         * @returns {void}
         */
        changeChartStyle (title) {
            const cardId = "card" + title,
                cards = document.querySelectorAll(".statistic-card");

            cards.forEach(card => {
                card.classList.remove("blue-card");
                if (card.id === cardId) {
                    card.classList.toggle("blue-card");
                }
            });
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
        class="card statistic-card"
    >
        <h4>{{ title }}</h4>
        <div v-if="navigation">
            <DataCardPaginator
                :paginator-data="paginatorData"
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
                @click="showChart(`${detail}overview`, title)"
            >
                {{ translate("additional:modules.tools.vpidashboard.details") }}
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.card {
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

.card h4 {
    font-size: 0.7rem;
    text-align: center;
    margin-bottom: 0;

}

.card .card-buttons {
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
