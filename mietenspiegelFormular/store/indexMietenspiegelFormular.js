import mutations from "./mutationsMietenspiegelFormular";
import getters from "./gettersMietenspiegelFormular";
import state from "./stateMietenspiegelFormular";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters
};
