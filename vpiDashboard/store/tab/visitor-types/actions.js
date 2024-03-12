import apiEndpointService from "../../apiEndpointService";

const actions = {
    /**
     * Addresses the WhatALocation visitor-types endpoint to get the data for the complete time range
     * @param {Object} state the stores state object.
     * @param {Object} commit actions commit object.
     * @returns {void}
     **/
    getVisitorTypes: async ({state, commit}) => {
        commit("setLoader", true);

        const response = await apiEndpointService.receiveVisitorTypes(state.selectedLocationId);

        commit("setVisitorTypes", response.data.data);
        commit("setLoader", false);
    },
    /**
     * Addresses the WhatALocation visitor types endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getVisitorTypesToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);

        const
            responseA = await apiEndpointService.receiveVisitorTypes(compareData.location_id_a, compareData.date),
            responseB = await apiEndpointService.receiveVisitorTypes(compareData.location_id_b, compareData.date);

        commit("setVisitorTypesLocationA", responseA.data);
        commit("setVisitorTypesLocationB", responseB.data);
        commit("setLoader", false);
    }
};

export default actions;
