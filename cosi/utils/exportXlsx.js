import * as XLSX from "xlsx";
import isObject from "../../../src/utils/isObject.js";

/**
 * @description returns the width definition for the table columns by reading out the headers char-length
 * @param {String[]} headers - the headers of the table columns
 * @param {Number} [multiply] - multiply the col header length by
 * @returns {Object[]} the column Options array for all columns of the table
 */
function generateColOptions (headers, multiply) {
    const _multiply = multiply || 2;

    return headers.map(header => ({
        wch: header.length * _multiply
    }));
}


/**
 * @description Converts a json array of objects to an styled and exportable XLSX format.
 * @param {String[]} header - the column header
 * @param {Object[]} json - the array of objects to export
 * @param {Object} [options={}] - (optional) sheetname: name of the worksheet, tablename: name of the table, creator: editor of the document, theme: the styletheme of the table
 * @param {module:exceljs/workbook} workbook The workbook to parse the data to
 * @param {String} conversionType[json_to_sheet] -
 * @returns {void}
 */
export function parseJsonToXlsx (header, json, options, workbook, conversionType = "json_to_sheet") {
    if (isObject(json)) {
        Object.entries(json).forEach(([groupName, valuesOfGroup]) => {
            options.sheetname = groupName;
            parseJsonToXlsx(header, valuesOfGroup, options, workbook, conversionType);
        });
        return;
    }

    const sheetname = typeof options?.sheetname === "string" ? options.sheetname.substring(0, 31) : "Neues Arbeitsblatt", // no names longer than 31 chars allowed
        colOptions = options.colOptions || header ? generateColOptions(header, options.multiplyColWidth) : undefined,
        rowOptions = options.rowOptions,
        sheet = XLSX.utils[conversionType](json, {header});

    sheet["!cols"] = colOptions;
    sheet["!rows"] = rowOptions;
    XLSX.utils.book_append_sheet(workbook, sheet, sheetname);
}

/**
 * @description Exports a given JSON Array of Objects to an XLSX-File with each object's keys as column-headers and resp. values as rows.
 * @param {String[]} header - the column header
 * @param {Object[]} json - the array of objects to export
 * @param {String} filename - the filename of the exported XLSX
 * @param {Object} [options={}] - (optional) exlcude: keys to exclude from columns, sheetname: name of the worksheet, rowOptions: height etc., colOptions: width etc.
 * @param {String} conversionType[json_to_sheet] -
 * @returns {void}
 */
export default async function exportXlsx (header, json, filename, options = {}, conversionType = "json_to_sheet") {
    // catch not provided data
    if (!json || json.length === 0) {
        console.warn("Die zu exportierende Tabelle ist leer oder existiert nicht, bitte überprüfen Sie Ihre Einstellungen");
        return false;
    }

    // convert to XLSX
    const workbook = XLSX.utils.book_new();

    parseJsonToXlsx(header, json, {
        sheetname: options.sheetname || filename,
        rowOptions: options.rowOptions,
        colOptions: options.colOptions,
        multiplyColWidth: options.multiplyColWidth
    }, workbook, conversionType);

    // open download dialog
    XLSX.writeFile(workbook, filename + ".xlsx");
    return true;
}

