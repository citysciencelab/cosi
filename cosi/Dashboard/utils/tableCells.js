import isObject from "../../../../src/utils/isObject";
import mathutils from "../../utils/math";

/**
 * Returns the value for the cell.
 * If no value is available, checks whether it can be calculated from existing statistical data.
 * @param {*} item - item
 * @param {*} header - header
 * @param {*} timestamp - year
 * @param {Object[]} items - The row Items.
 * @returns {String} The value as Sring for the cell or "-" if no value is available.
 */
export function getValue (item, header, timestamp, items) {
    let val;

    if (!isObject(item)) {
        return "-";
    }

    if (header?.value && item[header.value]) {
        val = parseFloat(item[header.value][String(this.timestampPrefix) + timestamp]);
    }

    if (isNaN(val) && isObject(item.calculation) && item.valueType === "relative") {
        const field_A = items.find(_item => _item.category === item.calculation.category_A),
            field_B = items.find(_item => _item.category === item.calculation.category_B);

        let dividend, divisor, result;

        if (field_A && field_A[header.value] && field_B && field_B[header.value]) {
            dividend = parseFloat(field_A[header.value][String(this.timestampPrefix) + timestamp]);
            divisor = parseFloat(field_B[header.value][String(this.timestampPrefix) + timestamp]);
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
