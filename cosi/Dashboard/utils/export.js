import {replaceValues} from "../../utils/modifyObject.js";
import renameKeys from "../../../../src/utils/renameKeys.js";

const
    keyMap = {
        category: "Kategorie",
        group: "Gruppe",
        valueType: "Datentyp",
        timestamp: "Jahr",
        hamburg_gesamt: "Hamburg gesamt",
        total: "Gesamt",
        average: "Durchschnitt"
    },
    valuesMap = {
        absolute: "absolut",
        relative: "relativ"
    };

/**
 * Prepares the table data for an XLSX export, just the table as displayed
 * @param {Object[]} data - the feature data from the featuresList
 * @param {String[]} districtNames - keys of the districts
 * @param {Number} timestamp - timestamp
 * @param {String} timestampPrefix - timestamp prefix
 * @returns {Object[]} data for export
 */
export function prepareTableExport (data, districtNames, timestamp, timestampPrefix = "jahr_") {
    if (!Array.isArray(data)) {
        console.error("prepareTableExport: data must be an array");
        return null;
    }
    const exportData = data.map(item => {
        const _item = replaceValues(renameKeys(keyMap, item), valuesMap);

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
 * @param {String} timestampPrefix - timestamp prefix
 * @returns {Object[]} data for export
 */
export function prepareTableExportWithTimeline (data, districtNames, timestamps, timestampPrefix) {
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
