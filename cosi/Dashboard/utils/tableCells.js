import isObject from "../../../../src/utils/isObject";
import mathutils from "../../utils/math";
import {getDistrictByName, getStatisticByCategory} from "../../DistrictSelector/utils/districts";
import Feature from "ol/Feature";

/**
 * Returns the value for the cell.
 * If no value is available, checks whether it can be calculated from existing statistical data.
 * @param {*} item - item
 * @param {*} header - header
 * @param {*} timestamp - year
 * @param {Object[]} districts - All districts of the current level.
 * @param {String} [timestampPrefix="jahr_"] - The string the timestamps start with (e.g. jahr_).
 * @returns {String} The value as Sring for the cell or "-" if no value is available.
 */
export function getValue (item, header, timestamp, districts, timestampPrefix = "jahr_") {
    let val;

    if (!isObject(item)) {
        return "-";
    }

    if (header?.value && item[header.value]) {
        val = parseFloat(item[header.value][String(timestampPrefix) + timestamp]);
    }

    if (isNaN(val) && isObject(item.calculation) && item.valueType === "relative" && item[header.value]) {
        const foundDistrict = getDistrictByName(districts, header.value),
            statFeature_A = getStatisticByCategory(foundDistrict, item.calculation.category_A),
            statFeature_B = getStatisticByCategory(foundDistrict, item.calculation.category_B);

        let dividend, divisor, result;

        if (statFeature_A instanceof Feature && statFeature_B instanceof Feature) {
            dividend = Number(statFeature_A.get(String(timestampPrefix) + timestamp));
            divisor = Number(statFeature_B.get(String(timestampPrefix) + timestamp));
            result = mathutils[item.calculation.operation](dividend, divisor) * (item.calculation.modifier || 1);
            val = Number(result.toFixed(2));
            item[header.value].isCalculated = true;
        }
    }
    return val ? val.toLocaleString(this.currentLocale) : "-";
}

/**
 * Returns the class for the cell
 * @param {*} item - item
 * @param {*} header - header
 * @param {*} timestamp - year
 * @returns {String} the class
 */
export function getValueClass (item, header, timestamp) {
    return item[header.value]?.isModified <= timestamp || item[header.value]?.isCalculated ? "modified" : "";
}

/**
 * Returns the tooltip for the cell
 * @param {*} item - item
 * @param {*} header - header
 * @param {*} timestamp - year
 * @returns {String} the tooltip
 */
export function getValueTooltip (item, header, timestamp) {
    return item[header.value]?.isModified <= timestamp ? this.$t("additional:modules.tools.cosi.dashboard.modifiedTooltip") : undefined;
}

/**
 * Returns if the value is calculated or not.
 * @param {Object} item The item.
 * @param {Object} header The header.
 * @returns {Boolean} true if the value is calculated, false if not.
 */
export function isValueCalculated (item, header) {
    if (!isObject(item) || !isObject(header)) {
        return false;
    }
    return item[header.value]?.isCalculated === true;
}
