import isObject from "../../../src/utils/isObject";

/**
 * Gets the categories grouped or ungrouped.
 * @param {Object} statisticsAttributes - The configured statistics attributes.
 * @param {Boolean} areCategoriesGrouped - True if categories should be grouped.
 * @returns {Object} The categeories.
 */
function getCategoriesFromStatisticAttributes (statisticsAttributes, areCategoriesGrouped) {
    if (!isObject(statisticsAttributes)) {
        return [];
    }

    if (!areCategoriesGrouped) {
        return getUngroupedCategories(statisticsAttributes);
    }

    return getGroupedCategories(statisticsAttributes);
}

/**
 * Gets all categories grouped.
 * @param {Object} statistics - The configured statistics.
 * @returns {Object[]} The grouped categories.
 */
function getGroupedCategories (statistics) {
    const groups = [];

    Object.values(statistics).forEach(attributesObject => {
        // A stat with no category group
        if (!Object.prototype.hasOwnProperty.call(attributesObject, "categoryGroup")
            && Object.prototype.hasOwnProperty.call(attributesObject, "category")) {

            const additionalGroup = groups.find(object => object.name === i18next.t("additional:modules.tools.statisticDashboard.filterInputs.additional"));

            if (!additionalGroup) {
                groups.push({
                    name: i18next.t("additional:modules.tools.statisticDashboard.filterInputs.additional"),
                    categories: [{name: attributesObject.category}]
                });
            }
            else if (additionalGroup.categories.findIndex(category => category.name === attributesObject.category) === -1) {
                additionalGroup.categories.push({name: attributesObject.category});
            }
        }
        // A stat with a category group
        else if (Object.prototype.hasOwnProperty.call(attributesObject, "category")
            && Object.prototype.hasOwnProperty.call(attributesObject, "categoryGroup")) {
            const group = groups.find(object => object.name === attributesObject?.categoryGroup);

            if (!group) {
                groups.push({
                    name: attributesObject.categoryGroup,
                    categories: [{name: attributesObject.category}]
                });
            }

            else if (group.categories.findIndex(category => category.name === attributesObject.category) === -1) {
                group.categories.push({name: attributesObject.category});
            }
        }
    });

    return groups;
}

/**
 * Gets all categories ungrouped.
 * @param {Object} statistics - The configured statistics.
 * @returns {Object[]} The categories.
 */
function getUngroupedCategories (statistics) {
    const categories = [];

    Object.values(statistics).forEach(statistic => {
        if (!categories.find(category => category.name === statistic.category)) {
            categories.push({
                name: statistic.category
            });
        }
    });

    return categories;
}

/**
 * Gets all statistics of a category.
 * @param {String} categoryName - The name of the category.
 * @param {Object} statistics - The configured statistics.
 * @returns {Object} The statistics by the given category.
 */
function getStatisticsByCategory (categoryName, statistics) {
    const statsByCategory = {};

    Object.keys(statistics).forEach(key => {
        if (statistics[key].category === categoryName) {
            statsByCategory[key] = statistics[key];
        }
    });

    return statsByCategory;
}

/**
 * Checks if at least one category group is present in the statistics.
 * @param {Object} statistics - The configured statistics.
 * @returns {Boolean} true if a group is present.
 */
function hasOneGroup (statistics) {
    let isGroupAvailable = false;

    Object.values(statistics).forEach(statistic => {
        if (Object.prototype.hasOwnProperty.call(statistic, "categoryGroup")) {
            isGroupAvailable = true;
        }
    });

    return isGroupAvailable;
}

/**
 * Gets the keys of the statistics included in the given names.
 * @param {Object} statistics - The configured statistics.
 * @param {String[]} statisticsNames - The names of the statistics.
 * @returns {String[]} The names(keys) of the statistic attributes.
 */
function getStatsKeysByName (statistics, statisticsNames) {
    if (!isObject(statistics) || !Array.isArray(statisticsNames)) {
        return [];
    }
    const statsKeys = [];

    Object.entries(statistics).forEach(([key, statistic]) => {
        if (statisticsNames.includes(statistic.name)) {
            statsKeys.push(key);
        }
    });

    return statsKeys;
}

export default {
    getCategoriesFromStatisticAttributes,
    getStatisticsByCategory,
    hasOneGroup,
    getUngroupedCategories,
    getGroupedCategories,
    getStatsKeysByName
};
