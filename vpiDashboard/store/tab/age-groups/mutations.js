const mutations = {
    /**
     * Get all age groups data
     * @param {Object} state of this component
     * @param {Array} payload Array of all age groups from the selected location
     * @returns {void}
     */
    setAllAgeGroupsData (state, payload) {
        state.allAgeGroupsData = payload.data;
    },
    /**
     * Get all age groups monthly data
     * @param {Object} state of this component
     * @returns {void}
     */
    setAllAgeGroupsMonthlyData (state) {
        const dataset = {},
            datasetLine = {},
            tempDataset = {},
            tempDatasetGroups = {},
            xLabels = i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true}),
            colors = {
                "18-19": "#708090",
                "20-29": "#00aa55",
                "30-39": "#007ea8",
                "40-49": "#9784ff",
                "50-59": "#CC3E00",
                "60-69": "#ffa300",
                ">69": "#f8e08e"
            },
            labels = state.ageGroupPieChartLabels,
            ageGroupsByYear = {};

        state.allAgeGroupsData.forEach(entry => {

            if (entry.age_group === "u") {
                return;
            }

            // get the age groups by year and month
            const [yearOfEntry, monthOfEntry] = entry.date.split("-"),
                ageGroupLabel = entry.age_group.replace(/[[\]']+/g, "");

            if (!tempDataset[yearOfEntry]) {
                tempDataset[yearOfEntry] = {};
                tempDatasetGroups[yearOfEntry] = [];
            }

            // set default values
            if (!tempDataset[yearOfEntry][ageGroupLabel]) {
                tempDataset[yearOfEntry][ageGroupLabel] = [
                    {index: "01", sum: "n/a", label: ageGroupLabel},
                    {index: "02", sum: "n/a", label: ageGroupLabel},
                    {index: "03", sum: "n/a", label: ageGroupLabel},
                    {index: "04", sum: "n/a", label: ageGroupLabel},
                    {index: "05", sum: "n/a", label: ageGroupLabel},
                    {index: "06", sum: "n/a", label: ageGroupLabel},
                    {index: "07", sum: "n/a", label: ageGroupLabel},
                    {index: "08", sum: "n/a", label: ageGroupLabel},
                    {index: "09", sum: "n/a", label: ageGroupLabel},
                    {index: "10", sum: "n/a", label: ageGroupLabel},
                    {index: "11", sum: "n/a", label: ageGroupLabel},
                    {index: "12", sum: "n/a", label: ageGroupLabel}
                ];
            }

            // add each dataset to the correct object
            tempDataset[yearOfEntry][ageGroupLabel].find(x=> x.index === monthOfEntry).sum = Math.ceil(entry.sum_num_visitors / 100) * 100;

            if (!tempDatasetGroups[yearOfEntry][ageGroupLabel]) {
                tempDatasetGroups[yearOfEntry][ageGroupLabel] = 0;
            }

            // sum the single month's datasets for each age group (to be used in the pie chart later)
            tempDatasetGroups[yearOfEntry][ageGroupLabel] += Math.ceil(entry.sum_num_visitors / 100) * 100;
        });

        // now sort them for the correct oder (given by 'labels') and convert them to data objects for chartJS
        Object.keys(tempDataset).forEach(function (year) {

            if (!dataset[year]) {
                dataset[year] = [];
                datasetLine[year] = [];
                ageGroupsByYear[year] = [];
            }

            const yearSumForAllGroups = Object.values(tempDatasetGroups[year]).reduce((a, b) => a + b),
                yearGroupObj = {
                    data: [],
                    hoverOffset: 4,
                    backgroundColor: []
                };

            labels.forEach(label => {
                const dataObj = {
                        data: [],
                        hoverOffset: 4,
                        label: label,
                        backgroundColor: colors[label]
                    },
                    dataObjLine = {
                        data: [],
                        label: label,
                        fill: false,
                        tension: 0.1,
                        borderColor: colors[label]
                    };

                tempDataset[year][label].forEach(ageGroupPerMonth => {
                    dataObj.data.push(ageGroupPerMonth.sum);
                    dataObjLine.data.push(ageGroupPerMonth.sum);
                });

                // Round and also show trailing zeros, e.g. 18 becomes 18,0
                yearGroupObj.data.push((Math.round(tempDatasetGroups[year][label] * 100 / yearSumForAllGroups * 10) / 10).toFixed(1));
                yearGroupObj.backgroundColor.push(colors[label]);

                dataset[year].push(dataObj);
                datasetLine[year].push(dataObjLine);
            });

            ageGroupsByYear[year].push(yearGroupObj);
        });

        state.allAgeGroupsMonthlyData = dataset;
        state.allAgeGroupsMonthlyDataLine = datasetLine;
        state.ageGroupxLabels = xLabels;
        state.ageGroupsYearlyData = ageGroupsByYear;
    }
};

export default mutations;
