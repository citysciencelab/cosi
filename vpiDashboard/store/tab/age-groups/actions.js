import apiEndpointService from "../../apiEndpointService";

const actions = {
    /**
     * Get all data by age group
     * @param {Object} state the store's state and commit object.
     * @returns {Promise<void>} sets the data in store
     */
    getAllAgeGroupsData: async ({state, commit}) => {
        commit("setLoader", true);

        const
            response = await apiEndpointService.receiveAgeGroups(state.selectedLocationId);

        commit("setAllAgeGroupsData", response.data);
        commit("setAllAgeGroupsMonthlyData");
        commit("setLoader", false);
    },
    /**
     * Addresses the WhatALocation age group endpoint with 2
     * request to compare data
     * @param {Object } commit Commit Object
     * @param {Object } compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getAgeGroupsToCompare: async ({commit}, compareData) => {
        commit("setLoader", true);

        const
            responseA = await apiEndpointService.receiveAgeGroups(compareData.location_id_a, compareData.date),
            responseB = await apiEndpointService.receiveAgeGroups(compareData.location_id_b, compareData.date);

        commit("setAgeGroupsLocationA", responseA.data);
        commit("setAgeGroupsLocationB", responseB.data);
        commit("setLoader", false);
    }
};

export default actions;
