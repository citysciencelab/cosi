import apiEndpointService from "../../apiEndpointService";

const actions = {
    /**
     * Addresses the WhatALocation dwell time endpoint to get the dwell times for the complete time range
     * @param {Object} state the store's state and commit object.
     * @returns {void}
     **/
    getDwellTimes: async ({state, commit}) => {
        commit("setLoader", true);

        const
            response = await apiEndpointService.receiveDwellTimes(state.selectedLocationId);

        commit("setDwellTimes", response.data.data);
        commit("setLoader", false);
    },
    /**
     * Addresses the WhatALocation dwell time endpoint with 2
     * request to compare data
     * @param {Object} commit Commit Object
     * @param {Object} compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getDwellTimesToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);

        const
            responseA = await apiEndpointService.receiveDwellTimes(compareData.location_id_a, compareData.date),
            responseB = await apiEndpointService.receiveDwellTimes(compareData.location_id_b, compareData.date);

        commit("setDwellTimeLocationA", responseA.data);
        commit("setDwellTimeLocationB", responseB.data);
        commit("setLoader", false);
    }
};

export default actions;
