import {generateSimpleGetters} from "../../../src/app-store/utils/generators";
import stateVpiDashboard from "./stateVpiDashboard";
import tabVisitorTypesGetters from "./tab/visitor-types/getters";
import tabCompareDatesGetters from "./tab/compare/dates/getters";
import tabCompareLocationsGetters from "./tab/compare/locations/getters";

const getters = {
    /**
     * Returns an object of simple getters for a state object, where
     * simple means that they will just return an entry for any key.
     * For example, given a state object {key: value}, an object
     * {key: state => state[key]} will be returned.
     * This is useful to avoid writing basic operations.
     */
    ...generateSimpleGetters(stateVpiDashboard),

    ...tabVisitorTypesGetters,
    ...tabCompareDatesGetters,
    ...tabCompareLocationsGetters,

    /**
     * Gets data about unique visitors per year (sum per year and daily average), generated from WhatALocation data.
     * @param {Object} state the stores state object
     * @returns {Array} array of yearly data average, rounded
     */
    getActivitiesPerYear (state) {
        return state.activitiesPerYear;
    },

    /**
     * Gets GeoJson containing all WhatALocation locations.
     * @param {Object} state of this component
     * @returns {Object} GeoJson of all locations
     */
    getAllLocationsGeoJson (state) {
        return state.allLocationsGeoJson;
    },
    /**
     * Gets Array containing all WhatALocation locations.
     * @param {Object} state of this component
     * @returns {Array} Array of all locations
     */
    getAllLocationsArray (state) {
        return state.allLocationsArray;
    },
    /**
     * Gets Array containing all WhatALocation dwell time data per date.
     * @param {Object} state of this component
     * @returns {Array} Array of dwell time data
     */
    getDwellTimePerDate (state) {
        return state.dwellTimesPerDate;
    },
    /**
     * Get a dwell time ChartJS data object for the requested chart type.
     * @param {Object} state of this component
     * @returns {Object} ChartJS data for given chartType and requested year
     */
    getDwellTimeChartJsData: (state) => (chartType, year) => {
        const labels = i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true}),
            data_30_60 = state.dwellTimesPerDate[year]["30-60"].map(d => d.sum),
            data_60_120 = state.dwellTimesPerDate[year]["60-120"].map(d => d.sum),
            data_120_240 = state.dwellTimesPerDate[year]["120-240"].map(d => d.sum),
            data_240 = state.dwellTimesPerDate[year]["240+"].map(d => d.sum),
            yearSumForPieData = Object.values(state.dwellTimesPerYear[year]).reduce((a, b) => a + b),
            pieData = [],
            pieDataLabels = [],
            pieDataColors = [],
            colors = {
                "30-60": "#00AA55",
                "60-120": "#063970",
                "120-240": "#B381B3",
                "240+": "#CC3E00"
            };

        Object.keys(state.dwellTimesPerYear[year]).forEach(dwellTimeGroup => {
            // Round and also show trailing zeros, e.g. 18 becomes 18,0
            pieData.push((Math.round(state.dwellTimesPerYear[year][dwellTimeGroup] * 100 / yearSumForPieData * 10) / 10).toFixed(1));
            pieDataColors.push(colors[dwellTimeGroup]);
            pieDataLabels.push(dwellTimeGroup);
        });

        let chartData;

        switch (chartType) {
            case "pie":
                chartData = {
                    labels: pieDataLabels,
                    datasets: [
                        {
                            data: pieData,
                            backgroundColor: pieDataColors,
                            hoverOffset: 4
                        }
                    ]
                };
                break;
            case "line":
                chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "30-60",
                            data: data_30_60,
                            fill: false,
                            borderColor: colors["30-60"],
                            tension: 0.1
                        },
                        {
                            label: "60-120",
                            data: data_60_120,
                            fill: false,
                            borderColor: colors["60-120"],
                            tension: 0.1
                        },
                        {
                            label: "120-240",
                            data: data_120_240,
                            fill: false,
                            borderColor: colors["120-240"],
                            tension: 0.1
                        },
                        {
                            label: "240+",
                            data: data_240,
                            fill: false,
                            borderColor: colors["240+"],
                            tension: 0.1
                        }]
                };
                break;
            case "bar":
            default:
                chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "30-60",
                            data: data_30_60,
                            hoverOffset: 4,
                            backgroundColor: colors["30-60"]
                        },
                        {
                            label: "60-120",
                            data: data_60_120,
                            hoverOffset: 4,
                            backgroundColor: colors["60-120"]
                        },
                        {
                            label: "120-240",
                            data: data_120_240,
                            hoverOffset: 4,
                            backgroundColor: colors["120-240"]
                        },
                        {
                            label: "240+",
                            data: data_240,
                            hoverOffset: 4,
                            backgroundColor: colors["240+"]
                        }]
                };
                break;
        }

        return chartData;
    }
};

export default getters;
