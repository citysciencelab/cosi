import apiEndpointService from "../../../apiEndpointService";

const actions = {
    /* Addresses the WhatALocation API and compares to data points
     * @param {Object} commit Commit Object,
     * @param {Object} compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getDataToCompare: async ({commit}, compareData) => {

        // Handle "dwell times"
        if (compareData.character === "dwellTime") {
            commit("setLoader", true);

            const
                responseA = await apiEndpointService.receiveDwellTimes(compareData.location_id, compareData.dates[0].date),
                responseB = await apiEndpointService.receiveDwellTimes(compareData.location_id, compareData.dates[1].date);

            commit(`setDwellTime${compareData.dates[0].dateName}`, responseA.data);
            commit(`setDwellTime${compareData.dates[1].dateName}`, responseB.data);
            commit("setLoader", false);
        }

        // Handle activities
        if (compareData.character === "activities") {
            commit("setLoader", true);

            const
                responseA = await apiEndpointService.receiveActivities(compareData.location_id, compareData.dates[0].date),
                responseB = await apiEndpointService.receiveActivities(compareData.location_id, compareData.dates[1].date);

            commit(`setActivities${compareData.dates[0].dateName}`, responseA.data);
            commit(`setActivities${compareData.dates[1].dateName}`, responseB.data);
            commit("setLoader", false);
        }

        // Handle "age groups"
        if (compareData.character === "ageGroup") {
            commit("setLoader", true);

            const
                responseA = await apiEndpointService.receiveAgeGroups(compareData.location_id, compareData.dates[0].date),
                responseB = await apiEndpointService.receiveAgeGroups(compareData.location_id, compareData.dates[1].date);

            commit(`setAgeGroups${compareData.dates[0].dateName}`, responseA.data);
            commit(`setAgeGroups${compareData.dates[1].dateName}`, responseB.data);
            commit("setLoader", false);
        }

        // Handle "visitor types"
        if (compareData.character === "visitorTypes") {
            commit("setLoader", true);

            const
                responseA = await apiEndpointService.receiveVisitorTypes(compareData.location_id, compareData.dates[0].date),
                responseB = await apiEndpointService.receiveVisitorTypes(compareData.location_id, compareData.dates[1].date);

            commit(`setVisitorTypes${compareData.dates[0].dateName}`, responseA.data);
            commit(`setVisitorTypes${compareData.dates[1].dateName}`, responseB.data);
            commit("setLoader", false);
        }
    }
};

export default actions;
