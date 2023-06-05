import axios from "axios";
import {Config} from "../config";
import tabVisitorTypesActions from "./tab/visitor-types/actions";
import tabCompareDatesActions from "./tab/compare/dates/actions";

const actions = {

    ...tabVisitorTypesActions,
    ...tabCompareDatesActions,

    /**
     * Addresses the WhatALocation endpoint to get aggregated values for unique visitors for the complete data collection range
     * @param {Object} state the store's state and commit object.
     * @param {String} locationId id of the location which data will be loaded
     * @returns {void}
     **/
    getIndividualVisitors: async ({state, commit}) => {
        if (state.selectedLocationId !== "") {
            commit("setLoader", true);
            const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/quick-data/?location_id=${state.selectedLocationId}&transport=pedestrian&interval=300&expands=unique`,
                response = await axios.get(url);

            commit("setLoader", false);
            commit("setFrequencyData", response.data);
            commit("setAverageVisitorsPerMonth", response.data);
            commit("setAverageVisitorsPerDay", response.data);
            commit("setIndividualVisitorsPerYear", response.data);
            commit("setBarChartDailyData", response.data);
            commit("setLineChartDailyData", response.data);
            commit("setBarChartMonthlyData", response.data);
            commit("setLineChartMonthlyData", response.data);
            commit("setBarChartData", response.data);
            commit("setLineChartData", response.data);
        }
    },
    /**
     * Addresses the WhatALocation endpoint to get hourly data for one day for unique visitors
     * @param {Object} state the store's state and commit object
     * @param {String} date contains the date to be requested
     * @returns {Object} response object from WhatALocation endpoint
     **/
    getIndividualVisitorsForDay: async ({state, commit}, date) => {
        commit("setLoader", true);
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily/?location_id=${state.selectedLocationId}&transport=pedestrian&interval=300&use_pulse=activate&&aggregate[Avg]=num_visitors&ReiseArt__in=eingehend,ausgehend&&group_by[date__hour]&date__gte=${date} 00:00:00&date__lte=${date} 23:59:19`,
            response = await axios.get(url);

        commit("setLoader", false);
        return response.data;
    },
    /**
     * Addresses the WhatALocation endpoint to get daily aggregated values for unique visitors
     * @param {Object} state the store's state and commit object
     * @param {Object} dates contains dateFrom and dateTo to define daterange to be requested
     * @returns {Object} response object from WhatALocation endpoint
     **/
    getIndividualVisitorsForDateRange: async ({state, commit}, dates) => {
        commit("setLoader", true);
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/?location_id=${state.selectedLocationId}&transport=pedestrian&interval=300&use_pulse=activate&&aggregate[Sum]=num_visitors&ReiseArt__in=eingehend,ausgehend&&group_by[date]&date__gte=${dates.dateFrom}&date__lte=${dates.dateTo}`,
            response = await axios.get(url);

        commit("setLoader", false);
        return response.data;
    },
    /**
     * changes the selected chart data base
     * @param {Object} commit actions commit object.
     * @param {String} chartname contains dateFrom and dateTo to define daterange to be requested
     * @returns {void}
     **/
    changeChart: ({commit}, chartname) => {
        commit("setChartData", chartname);
    },
    /**
     * Addresses the WhatALocation locations endpoint to get all locations
     * @param {Object} commit actions commit object.
     * @returns {void}
     **/
    getAllLocations: async ({commit}) => {
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/locations/all_summary/`,
            response = await axios.get(url);

        commit("setAllLocationsGeoJson", Object.values(response.data));
    },
    /**
     * Addresses the WhatALocation dwell time endpoint to get the dwell times for the complete time range
     * @param {Object} state the store's state object
     * @param {Object} commit actions commit object.
     * @returns {void}
     **/
    getDwellTimes: async ({state, commit}) => {
        commit("setLoader", true);
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/?group_by[date]&location_id=${state.selectedLocationId}&group_by[DwellTime]&format=agg&aggregate[Sum]=num_visitors&pulse=activate&interval=300&transportation=pedestrian`,
            response = await axios.get(url);

        commit("setDwellTimes", response.data.data);
        commit("setLoader", false);
    },
    /**
     * Adresses the WhatALocation dwell time endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getDwellTimesToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);
        const urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/?group_by[date]=&location_id=${compareData.location_id_a}&group_by[DwellTime]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseA = await axios.get(urlA);

        commit("setDwellTimeLocationA", responseA.data); // return data

        // eslint-disable-next-line
        const urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/?group_by[date]=&location_id=${compareData.location_id_b}&group_by[DwellTime]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseB = await axios.get(urlB);

        commit("setLoader", false);
        commit("setDwellTimeLocationB", responseB.data);
    },
    /**
     * Adresses the WhatALocation age group endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getAgeGroupsToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);
        const urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/?group_by[date]=&location_id=${compareData.location_id_a}&group_by[age_group]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseA = await axios.get(urlA);

        commit("setAgeGroupsLocationA", responseA.data); // return data

        // eslint-disable-next-line
        const urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/?group_by[date]=&location_id=${compareData.location_id_b}&group_by[age_group]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseB = await axios.get(urlB);

        commit("setLoader", false);
        commit("setAgeGroupsLocationB", responseB.data);
    },
    /**
     * Adresses the WhatALocation visitor types endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getVisitorTypesToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);
        const urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/?group_by[date]=&location_id=${compareData.location_id_a}&group_by[VisitorType]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseA = await axios.get(urlA);

        commit("setVisitorTypesLocationA", responseA.data); // return data

        // eslint-disable-next-line
        const urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/?group_by[date]=&location_id=${compareData.location_id_b}&group_by[VisitorType]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseB = await axios.get(urlB);

        commit("setLoader", false);
        commit("setVisitorTypesLocationB", responseB.data);
    },
    /**
     * Adresses the WhatALocation individual visitors endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getIndividualVisitorsToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);
        const urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/?group_by[date]=&location_id=${compareData.location_id_a}&group_by[ReiseArt]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseA = await axios.get(urlA);

        commit("setIndividualVisitorsLocationA", responseA.data); // return data

        // eslint-disable-next-line
        const urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/?group_by[date]=&location_id=${compareData.location_id_b}&group_by[ReiseArt]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${compareData.date}`,
            responseB = await axios.get(urlB);

        commit("setLoader", false);
        commit("setIndividualVisitorsLocationB", responseB.data);
    },
    /**
     * Get all data by age group
     * @param {Object} state the store's state object
     * @param {Object } commit Commit Object
     * @returns {Promise<void>} sets the data in store
     */
    getAllAgeGroupsData: async ({state, commit}) => {
        commit("setLoader", true);
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/?format=agg&group_by[date]&aggregate[Sum]=num_visitors&group_by[age_group]&location_id=${state.selectedLocationId}&interval=300&transportation=pedestrian`,
            response = await axios.get(url);

        await commit("setAllAgeGroupsData", response.data);
        await commit("setAllAgeGroupsMonthlyData");
        commit("setLoader", false);
    }
};

export default actions;
