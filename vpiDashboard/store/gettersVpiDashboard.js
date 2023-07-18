import {generateSimpleGetters} from "../../../src/app-store/utils/generators";
import stateVpiDashboard from "./stateVpiDashboard";
import tabVisitorTypesGetters from "./tab/visitor-types/getters";
import tabCompareDatesGetters from "./tab/compare/dates/getters";
import {changeDateFormat} from "../utils/changeDateFormat";
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
    /*
     * Gets Array containing all WhatALocation dwell time data per dwell time range.
     * @param {Object} state of this component
     * @returns {Array} Array of dwell time data
     */
    getDwellTimePerTime (state) {
        return state.dwellTimesPerTime;
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
     * @returns {Object} ChartJS data for given chartType
     */
    getDwellTimeChartJsData: (state) => (chartType) => {
        const labels = [],
            data_30_60 = [],
            data_60_120 = [],
            data_120_240 = [],
            data_240 = [];

        Object.keys(state.dwellTimesPerDate).forEach(date => {
            const items = state.dwellTimesPerDate[date];

            // Set label from date, e.g. 2023-01-01 becomes 2023-01
            labels.push(changeDateFormat(date));

            data_30_60.push(
                items.find(i => i.DwellTime === "30-60")?.sum_num_visitors || 0
            );
            data_60_120.push(
                items.find(i => i.DwellTime === "60-120")?.sum_num_visitors || 0
            );
            data_120_240.push(
                items.find(i => i.DwellTime === "120-240")?.sum_num_visitors || 0
            );
            data_240.push(
                items.find(i => i.DwellTime === "240+")?.sum_num_visitors || 0
            );
        });

        let chartData;

        switch (chartType) {
            case "line":
                chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "30-60",
                            data: data_30_60,
                            fill: false,
                            borderColor: "#00AA55",
                            tension: 0.1
                        },
                        {
                            label: "60-120",
                            data: data_60_120,
                            fill: false,
                            borderColor: "#063970",
                            tension: 0.1
                        },
                        {
                            label: "120-240",
                            data: data_120_240,
                            fill: false,
                            borderColor: "#B381B3",
                            tension: 0.1
                        },
                        {
                            label: "240+",
                            data: data_240,
                            fill: false,
                            borderColor: "#CC3E00",
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
                            backgroundColor: "#00AA55"
                        },
                        {
                            label: "60-120",
                            data: data_60_120,
                            hoverOffset: 4,
                            backgroundColor: "#063970"
                        },
                        {
                            label: "120-240",
                            data: data_120_240,
                            hoverOffset: 4,
                            backgroundColor: "#B381B3"
                        },
                        {
                            label: "240+",
                            data: data_240,
                            hoverOffset: 4,
                            backgroundColor: "#CC3E00"
                        }]
                };
                break;
        }

        return chartData;
    }
};

export default getters;
