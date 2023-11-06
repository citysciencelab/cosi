import {replaceValues} from "../../utils/modifyObject.js";
import renameKeys from "../../../../src/utils/renameKeys.js";

const valuesMap = {
        absolute: "absolut",
        relative: "relativ"
    },
    keysToIgnore = ["id"];

/**
 * Prepares the table data for an XLSX export, just the table as displayed
 * @param {Object[]} data - the feature data from the featuresList
 * @param {String[]} districtNames - keys of the districts
 * @param {Number} timestamp - timestamp
 * @param {Object} keyMap - key map object
 * @param {String} timestampPrefix - timestamp prefix
 * @param {Boolean} exportGrouped - true if table should be exported in seperate groups
 * @returns {Object[]} data for export
 */
export function prepareTableExport (data, districtNames, timestamp, keyMap, timestampPrefix = "jahr_", exportGrouped = false) {
    if (!Array.isArray(data)) {
        console.error("prepareTableExport: data must be an array");
        return null;
    }
    if (exportGrouped) {
        delete keyMap.group;
    }
    const exportData = data.map(item => {
        const _item = replaceValues(renameKeys(keyMap, item), valuesMap);

        keysToIgnore.forEach(keyToIgnore => {
            delete _item[keyToIgnore];
        });
        for (const col in _item) {
            if (typeof _item[col] === "object") {
                const val = parseFloat(_item[col][timestampPrefix + timestamp]);

                _item[col] = !isNaN(val) ? val : _item[col][timestampPrefix + timestamp];
            }
        }

        /**
         * @todo localize
         */
        _item[keyMap.total] = this.getTotal(item, districtNames, timestamp, timestampPrefix);
        _item[keyMap.average] = this.getAverage(item, districtNames, timestamp, timestampPrefix);
        _item[keyMap.timestamp] = timestamp;

        return _item;
    });

    return exportGrouped ? groupDataByKey(exportData, "group") : exportData;
}

/**
 * Prepares the table data for an XLSX export, just the table as displayed
 * @param {Object[]} data - the feature data from the featuresList
 * @param {String[]} districtNames - keys of the districts
 * @param {Number[]} timestamps - timestamps
 * @param {Object} keyMap - key map object
 * @param {String} timestampPrefix - timestamp prefix
 * @param {Boolean} exportGrouped - true if table should be exported in seperate groups
 * @returns {Object[]} data for export
 */
export function prepareTableExportWithTimeline (data, districtNames, timestamps, keyMap, timestampPrefix, exportGrouped = false) {
    if (!Array.isArray(data)) {
        console.error("prepareTableExport: data must be an array");
        return null;
    }
    if (exportGrouped) {
        delete keyMap.group;
    }
    const
        ctimestamps = timestamps.slice().reverse(),
        exportData = data.reduce((items, item) => {
            const _item = replaceValues(renameKeys(keyMap, item), valuesMap),
                categoryRows = ctimestamps.map(timestamp => {
                    const el = {..._item};

                    keysToIgnore.forEach(keyToIgnore => {
                        delete el[keyToIgnore];
                    });

                    for (const col in el) {
                        if (typeof _item[col] === "object") {
                            const val = parseFloat(el[col][timestampPrefix + timestamp]);

                            el[col] = !isNaN(val) ? val : "-";
                        }
                    }

                    /**
                     * @todo localize
                     */
                    el[keyMap.total] = this.getTotal(item, districtNames, timestamp, timestampPrefix);
                    el[keyMap.average] = this.getAverage(item, districtNames, timestamp, timestampPrefix);
                    el[keyMap.timestamp] = timestamp;

                    return el;
                });

            return [...items, ...categoryRows];
        }, []);

    return exportGrouped ? groupDataByKey(exportData, "group") : exportData;
}
/**
 * Groups an array of objects by the given keys. It also removes the entry of the given key on each data object.
 * @param {Object[]} data The array of data.
 * @param {String} key The key to group by.
 * @returns {Object|null} an object with following structure: {group1: [], ..., additional: []}
 */
export function groupDataByKey (data, key) {
    if (!Array.isArray(data) || typeof key !== "string") {
        return null;
    }
    const result = {};

    data.forEach(obj => {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!Array.isArray(result.additional)) {
                result.additional = [];
            }
            result.additional.push(obj);
            return;
        }
        const valueOfKey = obj[key];

        delete obj[key];
        if (!Array.isArray(result[valueOfKey])) {
            result[valueOfKey] = [];
        }
        result[valueOfKey].push(obj);
    });
    return result;
}
