import state from "./stateTimeSeriesAnalyse";
// import actions from "./actionsTimeSeriesAnalyse";
import getters from "./gettersTimeSeriesAnalyse";
import mutations from "./mutationsTimeSeriesAnalyse";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters
    // actions
};
