import {generateSimpleGetters} from "../../../src/app-store/utils/generators";
import isObject from "../../../src/utils/isObject";
import initialState from "./stateStatisticDashboard";

const getters = {
    ...generateSimpleGetters(initialState),

    /**
     * Gets the values of the selected dates.
     * @param {Object} state - The StatisticDashboard state.
     * @param {Object} getters - The StatisticDashboard getters.
     * @param {Object[]} getters.selectedDates - The selected dates.
     * @return {String[]} The values of the selected dates.
     */
    selectedDatesValues (state, {selectedDates}) {
        const datesValues = [];

        selectedDates.forEach(date => {
            if (!isObject(date)) {
                return;
            }
            if (Array.isArray(date.value)) {
                datesValues.push(...date.value);
            }
            else {
                datesValues.push(date.value);
            }
        });

        return datesValues;
    },

    /**
     * Gets the values of the selected regions.
     * @param {Object} state - The StatisticDashboard state.
     * @param {Object} getters - The StatisticDashboard getters.
     * @param {Object[]} getters.selectedRegions - The selected regions.
     * @returns {String[]} The values(names) of the selected regions.
     */
    selectedRegionsValues (state, {selectedRegions}) {
        if (!Array.isArray(selectedRegions)) {
            return [];
        }
        const mappedRegionsValues = selectedRegions.map(region => region.value),
            allRegions = mappedRegionsValues.find(region => Array.isArray(region));

        return typeof allRegions !== "undefined" ? allRegions : mappedRegionsValues;
    }
};

export default getters;
