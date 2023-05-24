/** Calculates the ratio of a set of features.
* @param {Object[]} dataArray Of Objects containing data to be calculated.
* @param {String} year Year from which data is to be selected.
* @param {String[]} [operations=["sum", "sum"]] the operation to apply to the params
* @returns {Object[]} Array of calculated Data.
*/
export default function calculateRatio (dataArray, year, operations = ["sum", "sum"]) {
    const results = [];

    dataArray.forEach(dataset => {
        const calcObj = {
                scope: dataset.name,
                paramA_val: typeof dataset.paramA_calc === "object" ? dataset.paramA_calc[year] : dataset.paramA_calc,
                paramB_val: typeof dataset.paramB_calc === "object" ? dataset.paramB_calc[year] : dataset.paramB_calc
            },
            calculation = calculateSingle(calcObj, dataset, operations);

        results.push(calculation);
    });

    return calculateTotals(results);
}
/** Calculates the extent of a set of features.
* @param {Object} calcObj pre-transformed dataset.
* @param {Object} dataset Original dataset from dataArray.
* @param {String[]} [operations=["sum", "sum"]] the operation to apply to the params
* @returns {Object} calculated single dataset.
*/
function calculateSingle (calcObj, dataset, operations = ["sum", "sum"]) {
    if (isNaN(calcObj.paramA_val) || isNaN(calcObj.paramB_val)) {
        calcObj.relation = 0;
        calcObj.capacity = 0;
        calcObj.need = 0;
        calcObj.coverage = 0;
        calcObj.weightedRelation = 0;
        calcObj.data = dataset;

        return calcObj;
    }
    if (!calcObj.paramA_count) {
        calcObj.paramA_count = calcObj.paramA_val;
    }
    if (!calcObj.paramB_count) {
        calcObj.paramB_count = calcObj.paramB_val;
    }

    calcObj.paramA_val = operations[0] === "avg" ? calcObj.paramA_val / calcObj.paramA_count : calcObj.paramA_val;
    calcObj.paramB_val = operations[0] === "avg" ? calcObj.paramB_val / calcObj.paramB_count : calcObj.paramB_val;

    const
        relation = calcObj.paramA_val / calcObj.paramB_val,
        capacity = calcObj.paramA_val * (dataset.faktorf_B / dataset.faktorf_A),
        need = calcObj.paramB_val * (dataset.faktorf_A / dataset.faktorf_B),
        coverageA = ((calcObj.paramA_val / need) * dataset.perCalc_B) * 100,
        coverageB = ((calcObj.paramB_val / need) * dataset.perCalc_A) * 100,
        weightedRelation = relation * (dataset.perCalc_A / dataset.perCalc_B);

    calcObj.relation = relation;
    calcObj.capacity = capacity;
    calcObj.need = need;
    calcObj.coverage = coverageA;
    calcObj.mirrorCoverage = coverageB;
    calcObj.weightedRelation = weightedRelation;
    calcObj.data = dataset;

    return calcObj;
}
/** Calculates total and average values for all single Datasets.
* @param {Array} results Array of all single dataset.
* @returns {Array} Updated Array.
*/
function calculateTotals (results) {
    const filteredResults = results.filter(function (dataset) {
        if (dataset.paramA_val === undefined || dataset.paramB_val === undefined) {
            return false;
        }

        return true;

    });

    if (filteredResults.length === 0) {
        return results;
    }

    // eslint-disable-next-line one-var
    const dataHelpers_total = {
            faktorf_A: filteredResults[0].data.faktorf_A,
            faktorf_B: filteredResults[0].data.faktorf_B,
            perCalc_A: filteredResults[0].data.perCalc_A,
            perCalc_B: filteredResults[0].data.perCalc_B,
            incompleteDatasets_A: filteredResults.reduce((total, district) => total + district.data.incompleteDatasets_A, 0),
            incompleteDatasets_B: filteredResults.reduce((total, district) => total + district.data.incompleteDatasets_B, 0),
            datasets_A: filteredResults.reduce((total, district) => total + district.data.datasets_A, 0),
            datasets_B: filteredResults.reduce((total, district) => total + district.data.datasets_B, 0)
        },
        resultsTotal = {
            scope: "Gesamt",
            paramA_val: filteredResults.reduce((total, district) => total + district.paramA_val, 0),
            paramB_val: filteredResults.reduce((total, district) => total + district.paramB_val, 0)
        },
        total = calculateSingle(resultsTotal, dataHelpers_total),
        dataHelpers_avg = {
            faktorf_A: filteredResults[0].data.faktorf_A,
            faktorf_B: filteredResults[0].data.faktorf_B,
            perCalc_A: filteredResults[0].data.perCalc_A,
            perCalc_B: filteredResults[0].data.perCalc_B,
            incompleteDatasets_A: resultsTotal.data.incompleteDatasets_A / filteredResults.length,
            incompleteDatasets_B: resultsTotal.data.incompleteDatasets_B / filteredResults.length,
            datasets_A: resultsTotal.data.datasets_A / filteredResults.length,
            datasets_B: resultsTotal.data.datasets_B / filteredResults.length
        },
        resultsAverage = {
            scope: "Durchschnitt",
            paramA_val: resultsTotal.paramA_val / results.length,
            paramB_val: resultsTotal.paramB_val / results.length
        },
        avg = calculateSingle(resultsAverage, dataHelpers_avg);

    results.push(total, avg);
    return results;

}


