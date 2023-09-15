<script>
import {mapGetters, mapActions} from "vuex";
import getters from "../../store/gettersVpiDashboard";
import actions from "../../store/actionsVpiDashboard";
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import BarchartItem from "../../utils/BarchartItem.vue";
import DataCard from "../DataCard.vue";
import DataCardPaginator from "../DataCardPaginator.vue";
import ChangeChartTypeButtons from "../ChangeChartTypeButtons.vue";

export default {
    name: "TabVisitorTypes",
    components: {
        DataCard,
        DataCardPaginator,
        LinechartItem,
        BarchartItem,
        ChangeChartTypeButtons
    },
    data () {
        return {
            chartType: "bar",
            chartdata: {
                bar: {},
                line: {}
            },
            dataCardIndex: 0
        };
    },
    computed: {
        ...mapGetters("Tools/VpiDashboard", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        hasEntry () {
            if (Object.keys(this.chartdata.bar).length !== 0) {
                return true;
            }
            return false;
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
        async selectedLocationId () {
            await this.updateChartData();
        }
    },
    async created () {
        await this.updateChartData();
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", Object.keys(actions)),
        /**
         * update the chart data
         * @returns {void}
         */
        async updateChartData () {
            await this.getVisitorTypes();
            this.getCurrentChartData();
        },
        /**
         * define, which type of chart shall be displayed
         * @param {String} chartType an be one of "bar" or "line"
         * @returns {void}
         */
        setChartType (chartType) {
            this.chartType = chartType;
        },
        /**
         * requests the data from the store for those chart data that are static
         * @returns {void}
         */
        async getCurrentChartData () {
            this.chartdata.bar = this.getVisitorTypesChartJsData("bar", this.yearList[this.dataCardIndex]);
            this.chartdata.line = this.getVisitorTypesChartJsData("line", this.yearList[this.dataCardIndex]);
        },
        changeIndex (index) {
            this.dataCardIndex = index;
            this.getCurrentChartData();
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
            <div class="tab-content h100 visitortypestab">
                <DataCardPaginator
                    v-if="hasEntry"
                    :paginator-data="yearList"
                    @pager="changeIndex"
                />
                <div
                    v-if="hasEntry"
                    class="row cards"
                >
                    <DataCard
                        :title="$t('additional:modules.tools.vpidashboard.tab.visitorTypes.cardLabels.residentsPerWeek')"
                        detail="visitorTypeResidentsPerWeek"
                        :update-index="dataCardIndex"
                    />
                    <DataCard
                        :title="$t('additional:modules.tools.vpidashboard.tab.visitorTypes.cardLabels.commutersPerWeek')"
                        detail="visitorTypeCommutersPerWeek"
                        :update-index="dataCardIndex"
                    />
                    <DataCard
                        :title="$t('additional:modules.tools.vpidashboard.tab.visitorTypes.cardLabels.touristsPerWeek')"
                        detail="visitorTypeTouristsPerWeek"
                        :update-index="dataCardIndex"
                    />
                </div>
                <h2>
                    {{ $t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartTitle") }}
                </h2>
                <div class="charts">
                    <!-- Bar Chart-->
                    <div v-if="chartType === 'bar'">
                        <div class="row bar">
                            <BarchartItem
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
                                :given-options="{
                                    animation: false
                                }"
                            />
                        </div>
                    </div>
                    <!-- Line Chart -->
                    <div v-if="chartType === 'line'">
                        <div class="row line">
                            <LinechartItem
                                :data="chartdata.line"
                                :given-options="{
                                    animation: false
                                }"
                            />
                        </div>
                    </div>
                </div>
                <div class="charts">
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
h3 {
    margin: 0 0 1rem 0;
}
.charts {
    margin: 0 0 1rem 0;
}
.cards {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 0 auto 1rem auto;
}
</style>
