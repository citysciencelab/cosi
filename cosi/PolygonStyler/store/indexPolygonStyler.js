import getters from "./gettersPolygonStyler";
import mutations from "./mutationsPolygonStyler";
import state from "./statePolygonStyler";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters
};
