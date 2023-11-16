import * as XLSX from "xlsx";

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
 * @description Sanitizes the export data. Removes excluded columns.
 * @param {Object[]} json - the array of objects
 * @param {String[]} exclude - the list of keys to exclude
 * @returns {Object[]} the sanitized data
 */
function sanitizeData (json, exclude) {
    if (exclude) {
        json.forEach(column => {
            exclude.forEach(key => {
                delete column[key];
            });
        });
    }

    return json;
}

/**
 * converts an object to an array of objects
 * @param {Object} data - the input data
 * @returns {Object[]} the converted array
 */
function convertObject (data) {
    const objArr = [];
    let row;

    for (const key in data) {
        row = {id: key, ...data[key]};
        objArr.push(row);
    }

    return objArr;
}

/**
 * @description Converts a json array of objects to an styled and exportable XLSX format.
 * @param {Object[]} json - the array of objects to export
 * @param {Object} [options={}] - (optional) sheetname: name of the worksheet, tablename: name of the table, creator: editor of the document, theme: the styletheme of the table
 * @param {String} conversionType[json_to_sheet] -
 * @returns {module:exceljs/workbook} returns the XLSX workbook
 */
export function parseJsonToXlsx (json, options, conversionType = "json_to_sheet") {
    const sheetname = options.sheetname.substring(0, 31) || "Neues Arbeitsblatt", // no names longer than 31 chars allowed

        iniHeader = conversionType === "json_to_sheet" ? Object.keys(json[0]) : undefined,
        fixedHeaderStart = ["Kategorie", "Gruppe", "Datentyp"],
        fixedHeaderEnd = iniHeader.includes("Orientierungswert") ? ["Orientierungswert", "Gesamt", "Durchschnitt", "Jahr"] : ["Gesamt", "Durchschnitt", "Jahr"],
        header = fixedHeaderStart.concat(iniHeader.filter((value) => {
            return !fixedHeaderStart.includes(value) && !fixedHeaderEnd.includes(value);
        }), fixedHeaderEnd),
        colOptions = options.colOptions || header ? generateColOptions(header, options.multiplyColWidth) : undefined,
        rowOptions = options.rowOptions,
        workbook = XLSX.utils.book_new(),
        sheet = XLSX.utils[conversionType](json, {header});

    sheet["!cols"] = colOptions;
    sheet["!rows"] = rowOptions;
    XLSX.utils.book_append_sheet(workbook, sheet, sheetname);

    return workbook;
}

/**
 * @description Exports a given JSON Array of Objects to an XLSX-File with each object's keys as column-headers and resp. values as rows.
 * @param {Object[]} json - the array of objects to export
 * @param {String} filename - the filename of the exported XLSX
 * @param {Object} [options={}] - (optional) exlcude: keys to exclude from columns, sheetname: name of the worksheet, rowOptions: height etc., colOptions: width etc.
 * @param {String} conversionType[json_to_sheet] -
 * @returns {void}
 */
export default async function exportXlsx (json, filename, options = {}, conversionType = "json_to_sheet") {
    let _json = json;

    // catch not provided data
    if (!_json || _json.length === 0) {
        console.warn("Die zu exportierende Tabelle ist leer oder existiert nicht, bitte überprüfen Sie Ihre Einstellungen");
        return false;
    }

    // catch wrong data formats
    if (_json.constructor !== Array) {

        // convert if data is a dictionary
        if (_json.constructor === Object) {
            _json = convertObject(_json);
            console.warn("Die exportierenden Daten liegen nicht als Array Of Object vor. Sie werden automatisch konvertiert.");
        }

        // break if other format
        else {
            console.warn("Die zu exportierenden Daten müssen als Array of Objects vorliegen. Bitte überprüfen Sie die Daten. Input: ", json);
            return false;
        }
    }

    // convert to XLSX
    const exportJson = sanitizeData(JSON.parse(JSON.stringify(_json)), options.exclude),
        workbook = parseJsonToXlsx(exportJson, {
            sheetname: options.sheetname || filename,
            rowOptions: options.rowOptions,
            colOptions: options.colOptions,
            multiplyColWidth: options.multiplyColWidth
        }, conversionType);

    // open download dialog
    XLSX.writeFile(workbook, filename + ".xlsx");
    return true;
}

