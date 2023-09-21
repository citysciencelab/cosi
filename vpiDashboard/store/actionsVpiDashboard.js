import tabVisitorTypesActions from "./tab/visitor-types/actions";
import tabCompareDatesActions from "./tab/compare/dates/actions";
import tabAgeGroupActions from "./tab/age-groups/actions";
import tabDwellTimeActions from "./tab/dwell-time/actions";
import apiEndpointService from "./apiEndpointService";

const actions = {

    ...tabVisitorTypesActions,
    ...tabCompareDatesActions,
    ...tabAgeGroupActions,
    ...tabDwellTimeActions,

    /**
     * Addresses the WhatALocation locations endpoint to get all locations
     * @param {Object} commit actions commit object.
     * @returns {Object} data returned by the endpoint
     **/
    getAllLocations: async ({commit}) => {
        commit("setLoader", true);

        const
            response = await apiEndpointService.receiveAllSummary();

        commit("setAllLocationsGeoJson", Object.values(response.data));
        commit("setLoader", false);

        return response.data;
    },
    /**
     * Addresses the WhatALocation endpoint to get aggregated values for unique visitors for the complete data collection range
     * @param {Object} state the store's state and commit object.
     * @returns {void}
     **/
    getActivities: async ({state, commit}) => {
        if (state.selectedLocationId !== "") {
            commit("setLoader", true);

            const
                response = await apiEndpointService.receiveActivities(state.selectedLocationId);

            // Tab "Activities", Card: "unique daily visitors per month"
            commit("setSumVisitorsPerMonth", response.data);

            // Tab "Activities", Card: "unique daily visitors on a"
            commit("setAverageVisitorsPerDay", response.data);

            // Tab "Activities", Card: "unique weekly visitors in the year"
            commit("setActivitiesPerYear", response.data);

            // Tab "Activities", Dropdown: "Activities"
            commit("setBarChartData", response.data);
            commit("setLineChartData", response.data);

            // Tab "Activities", Dropdown: "Average of daily activities"
            commit("setBarChartDailyData");
            commit("setLineChartDailyData");

            // Tab "Activities", Dropdown: "Average of monthly activities"
            commit("setBarChartMonthlyData");
            commit("setLineChartMonthlyData");

            commit("setLoader", false);
        }
    },
    /**
     * Addresses the WhatALocation activities endpoint with 2
     * request to compare data
     * @param {Object} commit Commit Object
     * @param {Object} compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getActivitiesToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);

        const
            responseA = await apiEndpointService.receiveActivities(compareData.location_id_a, compareData.date[0], compareData.date[1]),
            responseB = await apiEndpointService.receiveActivities(compareData.location_id_b, compareData.date[0], compareData.date[1]);

        commit("setActivitiesLocationA", responseA.data);
        commit("setActivitiesLocationB", responseB.data);
        commit("setLoader", false);
    },
    /**
     * Addresses the WhatALocation endpoint to get hourly data for one day for unique visitors
     * @param {Object} state the store's state and commit object
     * @param {String} date contains the date to be requested
     * @returns {Object} response object from WhatALocation endpoint
     **/
    getActivitiesForDay: async ({state, commit}, date) => {
        commit("setLoader", true);

        const
            response = await apiEndpointService.receiveVisitorsDaily(state.selectedLocationId, date);

        commit("setLoader", false);
        return response.data;
    },
    /**
     * Addresses the WhatALocation endpoint to get hourly data for one day for unique visitors for two locations
     * @param {Object} commit Commit Object
     * @param {Object} compareData contains the date to be requested (date) and the locationID if it is not the "selectedLocationId" (locID)
     * @returns {Promise<void>} sets the data in store
     **/
    getActivitiesForDayToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);

        const
            responseA = await apiEndpointService.receiveVisitorsDaily(compareData.location_id_a, compareData.date[0]),
            responseB = await apiEndpointService.receiveVisitorsDaily(compareData.location_id_b, compareData.date[0]);

        commit("setActivitiesDailyLocationA", responseA.data);
        commit("setActivitiesDailyLocationB", responseB.data);
        commit("setLoader", false);
    },
    /**
     * changes the selected chart data key
     * @param {Object} commit actions commit object.
     * @param {String} chartname contains dateFrom and dateTo to define daterange to be requested
     * @returns {void}
     **/
    changeChart: ({commit}, chartname) => {
        commit("setChartData", chartname);
    }
};

export default actions;
