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
    }
};

export default actions;
