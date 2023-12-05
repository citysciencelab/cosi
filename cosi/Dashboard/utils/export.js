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
 * @returns {Object[]} data for export
 */
export function prepareTableExport (data, districtNames, timestamp, keyMap, timestampPrefix = "jahr_") {
    if (!Array.isArray(data)) {
        console.error("prepareTableExport: data must be an array");
        return null;
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

    return exportData;
}

/**
 * Prepares the table data for an XLSX export, just the table as displayed
 * @param {Object[]} data - the feature data from the featuresList
 * @param {String[]} districtNames - keys of the districts
 * @param {Number[]} timestamps - timestamps
 * @param {Object} keyMap - key map object
 * @param {String} timestampPrefix - timestamp prefix
 * @returns {Object[]} data for export
 */
export function prepareTableExportWithTimeline (data, districtNames, timestamps, keyMap, timestampPrefix) {
    if (!Array.isArray(data)) {
        console.error("prepareTableExport: data must be an array");
        return null;
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

    return exportData;
}
