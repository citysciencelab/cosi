import {replaceValues} from "../../utils/modifyObject.js";
import renameKeys from "../../../../src/utils/renameKeys.js";

const keyMap = {
        name: "Einrichtung",
        address: "Adresse",
        district: "Gebiet",
        type: "Typ",
        group: "Thema",
        style: "Icon",
        layerName: "Layer",
        actions: "Aktionen",
        enabled: "Ein-/Ausschalten",
        isSimulation: "Simuliert?",
        isModified: "Modifiziert?"
    },
    valuesMap = {
        true: "Ja",
        false: "Nein"
    };

/**
 * Composes a filename from a given name and the current date
 * @param {String} filename - the raw filename
 * @returns {String} the filename
 */
export function composeFilename (filename) {
    const date = new Date().toLocaleDateString("de-DE", {year: "numeric", month: "numeric", day: "numeric"});

    return `${filename}_${date}`;
}

/**
 * Prepares the table data for an XLSX export, just the table as displayed
 * @param {Object[]} data - the feature data from the featuresList
 * @returns {Object[]} data for export
 */
export function prepareTableExport (data) {
    if (data.constructor !== Array) {
        console.error("prepareTableExport: data must be an array");
        return null;
    }
    const exportData = data.map(item => replaceValues(renameKeys(keyMap, item), valuesMap, true, false));

    return exportData;
}

/**
 * Prepares the table data for an XLSX export, includes all selected Properties
 * @param {Object[]} data - the feature data from the featuresList
 * @param {Object} filterProps - the props to export for each feature type
 * @returns {Object[]} data for export
 */
export function prepareDetailsExport (data, filterProps) {
    if (data.constructor !== Array) {
        console.error("prepareDetailsExport: data must be an array");
        return null;
    }

    const exportData = data.map(item => {
        const properties = Object.entries(item.feature.getProperties()) // the feature's properties as tuples
            .filter(prop => {
                // return all properties if no filter is set
                if (!filterProps[item.layerId] || filterProps[item.layerId].length === 0) {
                    return true;
                }
                // filter according to the properties selected in the detail view
                return filterProps[item.layerId].includes(prop[0]);
            });

        return replaceValues(renameKeys({...Object.fromEntries(properties), ...item}, keyMap), valuesMap, true, false);
    });

    return exportData;
}
