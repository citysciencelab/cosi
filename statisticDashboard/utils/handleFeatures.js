import {Fill, Stroke, Style} from "ol/style.js";
import {convertColor} from "../../../src/utils/convertColor";
import isObject from "../../../src/utils/isObject";
import thousandsSeparator from "../../../src/utils/thousandsSeparator";

/**
 * Filters the features by the passed key and value.
 * @param {ol/Feature[]} features - The features that are filtered.
 * @param {String} key - The name of the key.
 * @param {*} value - The value to be filtered for.
 * @returns {ol/Feature[]} The filtered features.
 */
function filterFeaturesByKeyValue (features, key, value) {
    if (!Array.isArray(features) || typeof key !== "string" || typeof value === "undefined") {
        return [];
    }

    return features.filter(feature => feature.get(key).split(value).length - 1 === 1);
}

/**
 * Styles the features by values in the statistics.
 * The number of colors in the scheme indicates the number of classes for the styling.
 * @param {ol/Feature[]} features - The features that are styled.
 * @param {Object} statisticData - The statistic whose values are visualized.
 * @param {Number[]} colorScheme - The color scheme used for styling.
 * @param {String} date - The date for which the values are visualized
 * @param {String} regionKey - The key to the region in the feature.
 * @returns {void}
 */
function styleFeaturesByStatistic (features, statisticData, colorScheme, date, regionKey) {
    if (!Array.isArray(features) || !Array.isArray(colorScheme)) {
        return;
    }

    const stepValues = getStepValue(statisticData, colorScheme, date);

    Object.keys(statisticData).forEach((region) => {
        const index = closestIndex(stepValues, statisticData[region][date]),
            foundFeature = features.find(feature => feature.get(regionKey) === region);

        styleFeature(foundFeature, colorScheme[index]);
    });
}

/**
 * Sets a feature style as a function.
 * @param {ol/Feature} feature - The feature to style.
 * @param {Number[]} [fillColor = [255, 255, 255, 0.9]] - The fill color.
 * @returns {void}
 */
function styleFeature (feature, fillColor = [255, 255, 255, 0.9]) {
    if (typeof feature?.setStyle !== "function") {
        return;
    }
    feature.setStyle(() => {
        return new Style({
            fill: new Fill({
                color: fillColor
            }),
            stroke: new Stroke({
                color: [166, 166, 166, 1],
                width: 1
            })
        });
    });
}

/**
 * Gets the step value.
 * @param {Object} statisticData - The statistic whose values are visualized.
 * @param {Number[]} colorScheme - The color scheme used for styling.
 * @param {String} date - The date for which the values are visualized
 * @returns {void}
 */
function getStepValue (statisticData, colorScheme, date) {
    const statisticsValues = getStatisticValuesByDate(statisticData, date),
        minStatisticValue = Math.min(...statisticsValues),
        maxStatisticValue = Math.max(...statisticsValues);

    return calcStepValues(minStatisticValue, maxStatisticValue, colorScheme.length);
}

/**
 * Calculates the values for the steps using the min and max values and the number of steps.
 * @param {Number} min - The min value.
 * @param {Number} max - The max value.
 * @param {Number} [steps=5] - The number of steps.
 * @return {Number[]} The calculated values.
 */
function calcStepValues (min, max, steps = 5) {
    if (typeof min !== "number" || typeof max !== "number" || typeof steps !== "number" || steps <= 1) {
        return [0];
    }

    if (min === max) {
        return [min];
    }

    const values = [min],
        step = (max - min) / (steps - 1);

    for (let i = 0; i < steps - 1; i++) {
        values.push(Number((values[i] + step).toFixed(2)));
    }

    return values;
}

/**
 * Gets the values of all regions of one statistic from the given date.
 * @param {Object} statistic - The statistic.
 * @param {String} date - The key of the date value.
 * @returns {String[]} The values.
 */
function getStatisticValuesByDate (statistic, date) {
    return Object.keys(statistic)
        .filter(region => typeof statistic[region][date] === "number")
        .map(region => statistic[region][date]);
}

/**
 * Finds the closest value in an array for the given value and return its index.
 * @param {Number[]} arr - The array to search in.
 * @param {Number} value - The value for which the closest index is searched.
 * @returns {Number} The index.
 */
function closestIndex (arr, value) {
    if (!Array.isArray(arr) || typeof value !== "number") {
        return -1;
    }

    const differenceArray = arr.map(x => Math.abs(value - x)),
        minNumber = Math.min(...differenceArray),
        index = differenceArray.findIndex(x => x === minNumber);

    return index;
}

/**
 * Prepares the legend for polygon style.
 * @param {Object} legendObj The legend object.
 * @param {Object} style The styleObject.
 * @returns {Object} - prepare legendObj
 */
function prepareLegendForPolygon (legendObj, style) {
    if (!isObject(legendObj) || !isObject(style)) {
        return legendObj;
    }
    const fillColor = convertColor(style.polygonFillColor, "rgbString"),
        strokeColor = convertColor(style.polygonStrokeColor, "rgbString"),
        strokeWidth = style.polygonStrokeWidth,
        fillOpacity = style.polygonFillColor?.[3] || 0,
        strokeOpacity = style.polygonStrokeColor[3] || 0;
    let svg = "data:image/svg+xml;charset=utf-8,";

    svg += "<svg height='35' width='35' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
    svg += "<polygon points='5,5 30,5 30,30 5,30' style='fill:";
    svg += fillColor;
    svg += ";fill-opacity:";
    svg += fillOpacity;
    svg += ";stroke:";
    svg += strokeColor;
    svg += ";stroke-opacity:";
    svg += strokeOpacity;
    svg += ";stroke-width:";
    svg += strokeWidth;
    svg += ";stroke-linecap:";
    svg += "round";
    svg += ";stroke-dasharray:";
    svg += ";'/>";
    svg += "</svg>";

    legendObj.graphic = svg;

    return legendObj;
}

/**
 * Gets the Legend value
 * @param {Object} val - The raw value of legend
 * @returns {Object[]} the legend Value
 */
function getLegendValue (val) {
    if (!isObject(val) || !val?.color || !val?.value) {
        return [];
    }

    if (!Array.isArray(val.color) || !Array.isArray(val.value)) {
        return [];
    }

    if (val.color.length < val.value.length) {
        return [];
    }

    const legengValue = [];

    val.value.forEach((data, index) => {
        if (!isNaN(data) && isFinite(data)) {
            let legendObj,
                style;

            if (index === val.value.length - 1) {
                legendObj = {
                    "name": thousandsSeparator(Math.round(data))
                };
                style = {
                    "polygonFillColor": val.color[index],
                    "polygonStrokeColor": val.color[index],
                    "polygonStrokeWidth": 3
                };
            }
            else {
                legendObj = {
                    "name": i18next.t("additional:modules.tools.statisticDashboard.legend.between", {minimum: thousandsSeparator(Math.round(data)), maximum: thousandsSeparator(Math.round(val.value[index + 1]))})
                };
                style = {
                    "polygonFillColor": val.color[index + 1],
                    "polygonStrokeColor": val.color[index + 1],
                    "polygonStrokeWidth": 3
                };
            }

            legengValue[index] = prepareLegendForPolygon(legendObj, style);
        }
    });

    return legengValue;
}

export default {
    filterFeaturesByKeyValue,
    styleFeaturesByStatistic,
    styleFeature,
    calcStepValues,
    getStepValue,
    getLegendValue,
    closestIndex,
    prepareLegendForPolygon
};
