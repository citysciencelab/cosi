import {generateSimpleGetters} from "../../../src/app-store/utils/generators";
import stateVpiDashboard from "./stateVpiDashboard";
import tabVisitorTypesGetters from "./tab/visitor-types/getters";
import tabCompareDatesGetters from "./tab/compare/dates/getters";
import tabCompareLocationsGetters from "./tab/compare/locations/getters";
import tabDwellTimeGetters from "./tab/dwell-time/getters";

const getters = {
    /**
     * Returns an object of simple getters for a state object, where
     * simple means that they will just return an entry for any key.
     * For example, given a state object {key: value}, an object
     * {key: state => state[key]} will be returned.
     * This is useful to avoid writing basic operations.
     */
    ...generateSimpleGetters(stateVpiDashboard),

    ...tabVisitorTypesGetters,
    ...tabCompareDatesGetters,
    ...tabCompareLocationsGetters,
    ...tabDwellTimeGetters,

    /**
     * Gets data about unique visitors per year (sum per year and daily average), generated from WhatALocation data.
     * @param {Object} state the stores state object
     * @returns {Array} array of yearly data average, rounded
     */
    getActivitiesPerYear (state) {
        return state.activitiesPerYear;
    },

    /**
     * Gets GeoJson containing all WhatALocation locations.
     * @param {Object} state of this component
     * @returns {Object} GeoJson of all locations
     */
    getAllLocationsGeoJson (state) {
        return state.allLocationsGeoJson;
    },
    /**
     * Gets Array containing all WhatALocation locations.
     * @param {Object} state of this component
     * @returns {Array} Array of all locations
     */
    getAllLocationsArray (state) {
        return state.allLocationsArray;
    }
};

export default getters;
