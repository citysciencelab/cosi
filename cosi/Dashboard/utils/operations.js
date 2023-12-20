import Feature from "ol/Feature";
import intersect from "../../utils/array/intersect";
import mathutils from "../../utils/math";
import {getDistrictByName, getStatisticByCategory} from "../../DistrictSelector/utils/districts";

const operationSymbols = {
        add: "+",
        subtract: "-",
        multiply: "*",
        divide: "/"
    },
    valueTypes = {
        add: "absolute",
        subtract: "absolute",
        multiply: "relative",
        divide: "relative"
    };

/**
 * removes the timestamp values from the object before refilling it
 * @param {Object} properties - the properties to clean
 * @param {String} timestampPrefix - the string to look for
 * @return {Object} the clean object
 */
function pruneProps (properties, timestampPrefix) {
    for (const key in properties) {
        if (key.includes(timestampPrefix)) {
            delete properties[key];
        }
    }

    return properties;
}

/**
 * adds or replaces a statsFeature by category
 * @param {Object} district - the district object from districtSelector
 * @param {module:ol/Feature} feature - the statsFeature
 * @returns {void}
 */
function addOrReplaceStatsFeature (district, feature) {
    const i = district.statFeatures.findIndex(feat => feat.get("kategorie") === feature.get("kategorie"));

    if (i > -1) {
        district.statFeatures.splice(i, 1);
    }

    district.statFeatures.push(feature);
}

/**
 * Generates the id name for a given calculation
 * @param {{category_A: String, category_B: String, operation: String}} calculation - the calculation options
 * @returns {String} the id
 */
export function getCalculationId (calculation) {
    return calculation.operation === "sumUpSelected" ?
        calculation.selectedCategories.join(" + ") :
        calculation.category_A + ` ${operationSymbols[calculation.operation]} ` + calculation.category_B;
}

/**
 * Performs all calculations from the calculations list
 * @returns {void}
 */
export function calculateAll () {
    for (const calculation of this.calculations) {
        if (calculation.operation === "sumUpSelected") {
            this.sumUpSelected(calculation);
        }
        else if (calculation.operation === "divideSelected") {
            this.divideSelected(calculation);
        }
        else {
            this.calculateStats(calculation);
        }
    }
}

/**
 * Adds multiple divisions for selectedItems
 * Breaks up "divideSelected" calculations into individual "divide" calculations for simple selection
 * @returns {void}
 */
export function addDivideSelectedCalculations () {
    for (const field_A of this.selectedItems) {
        this.addCalculation("divide", {field_A, field_B: this.fields.B});
    }
}

/**
 * Adds a new calc to the calculation list
 * @param {"add" | "subtract" | "multiply" | "divide" | "sumUpSelected"} operation - the mathmatical operation to execute
 * @param {{field_A: Object, field_B: Object, selectedItems: Object[] }} [options={}] - fields and selected items list
 * @param {String} [id] - the ID for the new calculation
 * @returns {void}
 */
export function addCalculation (operation, options = {}, id = undefined) {
    const
        calculation = {operation},
        field_A = options.field_A || this.fields.A,
        field_B = options.field_B || this.fields.B,
        selectedItems = options.selectedItems || this.selectedItems;

    if (operation === "sumUpSelected") {
        calculation.selectedCategories = selectedItems.map(item => item.category);
    }
    else {
        calculation.category_A = field_A.category;
        calculation.category_B = field_B.category;
    }

    calculation.id = id || getCalculationId(calculation);
    this.setCalculation(calculation);
}

/**
 * Calculates a new statsFeature for the selected districts and their reference districts
 * @param {{category_A: String, category_B: String, operation: String}} calculation - the calculation options
 * @returns {void}
 */
export function calculateStats (calculation) {
    let
        properties, feature, val_A, val_B, res,
        timestamps = null;
    const
        field_A = this.items.find(item => item.category === calculation.category_A),
        field_B = this.items.find(item => item.category === calculation.category_B),
        mappingObject = {
            category: calculation.id,
            group: "Berechnungen",
            valueType: valueTypes[calculation.operation],
            isTemp: true,
            calculation
        };

    if (!(field_A && field_B)) {
        return;
    }

    this.addCategoryToMapping(mappingObject);
    timestamps = intersect(field_A.years, field_B.years);

    for (const col of this.districtColumns) {
        properties = {
            ...field_A[col.value],
            kategorie: mappingObject.category,
            group: mappingObject.group
        };

        pruneProps(properties, this.timestampPrefix);

        for (const timestamp of timestamps) {
            val_A = parseFloat(field_A[col.value]?.[this.timestampPrefix + timestamp]);
            val_B = parseFloat(field_B[col.value]?.[this.timestampPrefix + timestamp]);
            res = mathutils[calculation.operation](val_A, val_B);

            properties[this.timestampPrefix + timestamp] = res;
        }

        feature = new Feature(properties);
        addOrReplaceStatsFeature(col.district, feature);
    }

    this.updateDistricts();
}

/**
 * Sums up the values for all selected rows
 * @param {{category_A: String, category_B: String, operation: String}} calculation - the calculation options
 * @returns {void}
 */
export function sumUpSelected (calculation) {
    let properties, feature, vals, res,
        timestamps = null;
    const
        selectedItems = this.items.filter(item => calculation.selectedCategories.includes(item.category)),
        mappingObject = {
            category: calculation.id,
            group: "Berechnungen",
            valueType: "absolute",
            isTemp: true
        };

    if (selectedItems.some(item => !item) || selectedItems.length === 0) {
        return;
    }

    this.addCategoryToMapping(mappingObject);
    timestamps = selectedItems.reduce((years, item) => intersect(years, item.years), [...selectedItems[0].years]);

    for (const col of this.districtColumns) {
        // skip columns for which not all properties are available
        if (selectedItems.find(item => !item[col.value])) {
            continue;
        }

        properties = {
            ...selectedItems[0][col.value],
            kategorie: mappingObject.category,
            group: mappingObject.group
        };

        pruneProps(properties, this.timestampPrefix);

        for (const timestamp of timestamps) {
            vals = selectedItems.map(item => parseFloat(item[col.value][this.timestampPrefix + timestamp]));
            res = mathutils.sum(vals);

            properties[this.timestampPrefix + timestamp] = res;
        }

        feature = new Feature(properties);
        col.district.statFeatures.push(feature);
    }

    this.updateDistricts();
}

/**
 * Divides all selected rows by field B
 * @param {{category_A: String, category_B: String, operation: String}} calculation - the calculation options
 * @returns {void}
 */
export function divideSelected (calculation) {
    for (const category of calculation.selectedCategories) {
        this.calculateStats({
            operation: "divide",
            category_A: category,
            category_B: calculation.category_B
        });
    }
}

/**
 * gets matching X/Y pairs for two data sets
 * @param {Object} datasetA - the data for category A
 * @param {Object} datasetB - the data for category B
 * @param {String[]} districts - the district name list
 * @param {Number[]} timestamps - the list of timestamps to include
 * @param {String} timestampPrefix - the prefix for timestamp attributes
 * @returns {Object[]} the data pairs as array
 */
export function getXYPairs (datasetA, datasetB, districts, timestamps, timestampPrefix) {
    const data = [];

    for (const district of districts) {
        for (const timestamp of timestamps) {
            const datum = {
                district: district,
                timestamp: timestamp,
                x: parseFloat(datasetA[district][timestampPrefix + timestamp]),
                y: parseFloat(datasetB[district][timestampPrefix + timestamp])
            };

            if (isNaN(datum.x) || isNaN(datum.y)) {
                continue;
            }

            data.push(datum);
        }
    }

    return data;
}

/**
 * Calculates a correlation and regression between two datasets
 * Can be used for the rendering of a scatterplot
 * @returns {Object} the correlation dataset
 */
export function calculateCorrelation () {
    const timestamps = intersect(this.fields.A.years, this.fields.B.years),
        data = getXYPairs(this.fields.A, this.fields.B, this.selectedColumns
            .map(col => col.value)
            .filter(colName => colName !== "average" && colName !== "total"),
        timestamps, this.timestampPrefix),
        xArr = data.map(d => d.x),
        yArr = data.map(d => d.y),
        fReg = mathutils.linearRegression(xArr, yArr),
        yEstArr = mathutils.yEst(data, fReg),
        stdDevArr = mathutils.stdDev(data, yEstArr),
        stdDev = mathutils.mean(stdDevArr),
        covar = mathutils.covar(xArr, yArr),
        corr = mathutils.pearsons(xArr, yArr);

    return {
        data,
        standardDeviation: stdDev,
        covariance: covar,
        correlation: corr,
        regression: fReg
    };
}

/**
 * Calculates the average of a dataset
 * @param {Object} item - the data for that category
 * @param {String[]} districtNames - the districts objects to generate the chart data for
 * @param {Number} timestamp - the current timestamp
 * @param {String} timestampPrefix - the prefix for timestamp attributes
 * @returns {Number} the average
 */
export function getAverage (item, districtNames, timestamp, timestampPrefix) {
    if (item?.valueType !== "absolute") {
        return "-";
    }
    let result = this.getTotal(item, districtNames, timestamp, timestampPrefix, true);

    result /= districtNames.filter(dist => item[dist]).length;

    return result;
}

/**
 * Calculates the total of a dataset
 * @param {Object} item - the data for that category
 * @param {String[]} districtNames - the districts objects to generate the chart data for
 * @param {Number} timestamp - the current timestamp
 * @param {String} timestampPrefix - the prefix for timestamp attributes
 * @param {Boolean} [simple=false] - get culmulative total if available
 * @returns {Number} the total
 */
export function getTotal (item, districtNames, timestamp, timestampPrefix, simple = false) {
    if (!simple && item?.calculation && item?.valueType === "relative") {
        return this.getCulmulativeTotal(item, districtNames, timestamp, timestampPrefix);
    }
    if (!simple && item?.valueType !== "absolute") {
        return "-";
    }

    let result = 0;

    for (const district of districtNames) {
        if (item[district]?.[timestampPrefix + timestamp]) {
            result += parseFloat(item[district][timestampPrefix + timestamp]);
        }
    }

    return result;
}

/**
 * Calculates the total of a relative dataset
 * @param {Object} item - the data for that category
 * @param {String[]} districtNames - the districts objects to generate the chart data for
 * @param {Number} timestamp - the current timestamp
 * @param {String} timestampPrefix - the prefix for timestamp attributes
 * @returns {Number} the total
 */
export function getCulmulativeTotal (item, districtNames, timestamp, timestampPrefix) {

    const
        field_A = this.items.find(_item => _item.category === item.calculation.category_A) || createItemForCalc(item.calculation.category_A, districtNames, this.selectedDistrictLevel.districts),
        field_B = this.items.find(_item => _item.category === item.calculation.category_B) || createItemForCalc(item.calculation.category_B, districtNames, this.selectedDistrictLevel.districts),
        total_A = field_A ? this.getTotal(field_A, districtNames, timestamp, timestampPrefix) : undefined,
        total_B = field_B ? this.getTotal(field_B, districtNames, timestamp, timestampPrefix) : undefined;

    if (!(total_A && total_B)) {
        return "-";
    }

    return mathutils[item.calculation.operation](total_A, total_B) * (item.calculation.modifier || 1);
}

/**
 * If the information is not available in the items, the information is taken from the districts.
 * This can happen if the statistics required for the calculation are not displayed/filtered in the dashboard.
 * @param {String} category - The category of the statistic
 * @param {String[]} districtNames - All district names of the current district level.
 * @param {Object[]} districts - All districts of the current district level.
 * @returns {Object} The item with the required informations.
 */
export function createItemForCalc (category, districtNames, districts) {
    const newItem = {
        valueType: "absolute"
    };

    districtNames.forEach(name => {
        const foundDistrict = getDistrictByName(districts, name),
            statFeature = getStatisticByCategory(foundDistrict, category);

        newItem[name] = statFeature.getProperties();
    });

    return newItem;
}

/**
 * Removes a stats category from the table
 * @param {String} category - the category to delete
 * @param {String} group - the group the category belongs to (to avoid duplicates)
 * @returns {void}
 */
export function deleteStats (category, group) {
    this.removeCategoryFromMapping({category, group});
    this.removeCalculation(category);
    this.updateDistricts();
}

