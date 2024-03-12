
import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import districtSelectorState from "./stateDistrictSelector";

const getters = {
    ...generateSimpleGetters(districtSelectorState),

    /**
     * Returns the key for the attribute "name" of the district features.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {String} The key for the attribute "name".
     */
    keyOfAttrName: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.keyOfAttrName;
    },

    /**
     * Returns the key for the attribute "name" of the regional statistical data features.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {String} The key for the attribute "name".
     */
    keyOfAttrNameStats: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.stats.keyOfAttrName;
    },

    /**
     * Returns the label of the selected district level.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {String} The label of the selected district level.
     */
    label: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.label;
    },

    /**
     * Returns the layer of the selected district level.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {module:ol/layer} The layer of the selected district level.
     */
    layer: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.layer;
    },

    /**
     * Returns the metadata urls of the regional statistical data.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {String[]} The metadata urls.
     */
    metadataUrls: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.stats.metadataUrls;
    },

    /**
     * Returns the selected districts in an array and not as a collection.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {?module:ol/Collection} getters.selectedDistrictsCollection - The collection with the selected features or null if not exists.
     * @returns {module:ol/Feature[]} The selected features in an array.
     */
    selectedFeatures: (state, {selectedDistrictsCollection}) => {
        if (!selectedDistrictsCollection || selectedDistrictsCollection.getLength() === 0) {
            return [];
        }
        return selectedDistrictsCollection.getArray();
    },

    /**
     * Returns the admin features of the selected districts.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistricts - The selected districts.
     * @returns {module:ol/Feature[]} The admin features.
     */
    selectedAdminFeatures: (state, {selectedDistricts}) => {
        return selectedDistricts.map(district => district.adminFeature);
    },

    /**
     * Returns the selected districts.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistrictLevel - The selected district level.
     * @returns {Object} The selected districts.
     */
    selectedDistricts: (state, {selectedDistrictLevel}) => {
        return selectedDistrictLevel.districts.filter(district => {
            return district.isSelected === true;
        });
    },

    /**
     * Returns the statistical features of the selected districts.
     * @param {Object} state - The DistrictSelector state.
     * @param {Object} getters - The DistrictSelector getters.
     * @param {Object} getters.selectedDistricts - The selected districts.
     * @returns {module:ol/Feature[]} The statistical features.
     */
    selectedStatFeatures: (state, {selectedDistricts}) => {
        return selectedDistricts.map(district => district.statFeatures).flat();
    }
};


export default getters;
