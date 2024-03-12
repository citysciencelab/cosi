import isObject from "../../../../src/utils/isObject";

/**
 * Finds a district by the given name.
 * @param {Object[]} districts - The list of all districts.
 * @param {String} name - The name of the searched district.
 * @returns {Object|undefined} The found district or undefined if no district was found.
 */
function getDistrictByName (districts, name) {
    if (!Array.isArray(districts)) {
        console.error("DistrictSelector/utils/districts/getDistrictByName: The first parameter must be an array, but got " + typeof districts);
        return undefined;
    }
    if (typeof name !== "string") {
        console.error("DistrictSelector/utils/districts/getDistrictByName: The second parameter must be a string, but got " + typeof name);
        return undefined;
    }

    return districts.find(district => district.getName() === name);

}

/**
 * Finds a statistic by the given category.
 * @param {Object} district - The district with its statistics.
 * @param {String} category - The category of the searched statistic.
 * @returns {ol/Feature|undefined} - The found statistic feature or undefined if no feature was found.
 */
function getStatisticByCategory (district, category) {
    if (!isObject(district)) {
        return undefined;
    }

    if (!Array.isArray(district.statFeatures)) {
        console.error("DistrictSelector/utils/districts/getStatisticByCategory: The given district has no stats");
        return undefined;
    }
    if (typeof category !== "string") {
        console.error("DistrictSelector/utils/districts/getStatisticByCategory: The second parameter must be a string, but got " + typeof category);
        return undefined;
    }

    return district.statFeatures.find(stat => stat.get("kategorie") === category);
}

module.exports = {
    getDistrictByName,
    getStatisticByCategory
};
