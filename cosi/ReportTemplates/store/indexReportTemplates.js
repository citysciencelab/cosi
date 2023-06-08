import state from "./stateReportTemplates";
// import actions from "./actionsReportTemplates";
import getters from "./gettersReportTemplates";
import mutations from "./mutationsReportTemplates";
import actions from "./actionsReportTemplates";
export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters,
    actions
};
