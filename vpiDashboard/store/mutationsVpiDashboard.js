import {generateSimpleMutations} from "../../../src/app-store/utils/generators";
import stateVpiDashboard from "./stateVpiDashboard";
import tabVisitorTypesMutations from "./tab/visitor-types/mutations";
import {changeDateFormat} from "../utils/changeDateFormat";

const mutations = {
    ...generateSimpleMutations(stateVpiDashboard),

    ...tabVisitorTypesMutations,

    /**
     * Sets the rounded monthly data for unique visitors to the state, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setSumVisitorsPerMonth (state, payload) {
        const
            data = payload.data,
            aggregated = {},
            result = {};

        Object.keys(data).forEach(key => {
            const
                item = data[key],
                date = new Date(item.date),
                label = date.getMonth(),
                year = date.getFullYear();

            if (!aggregated[year]) {
                aggregated[year] = [];
            }

            if (!aggregated[year][label]) {
                aggregated[year][label] = {
                    sum: 0,
                    totalNumberOfDaysInMonthsOverYears: 0
                };
            }
            aggregated[year][label].sum = item.sum_num_visitors + aggregated[year][label].sum;
            aggregated[year][label].totalNumberOfDaysInMonthsOverYears++;
        });

        // Ceil up to 100, e.g. 18318 becomes 18400
        Object.keys(aggregated).forEach(year => {
            result[year] = [
                {index: "0", avg: "n/a", sum: "n/a"},
                {index: "1", avg: "n/a", sum: "n/a"},
                {index: "2", avg: "n/a", sum: "n/a"},
                {index: "3", avg: "n/a", sum: "n/a"},
                {index: "4", avg: "n/a", sum: "n/a"},
                {index: "5", avg: "n/a", sum: "n/a"},
                {index: "6", avg: "n/a", sum: "n/a"},
                {index: "7", avg: "n/a", sum: "n/a"},
                {index: "8", avg: "n/a", sum: "n/a"},
                {index: "9", avg: "n/a", sum: "n/a"},
                {index: "10", avg: "n/a", sum: "n/a"},
                {index: "11", avg: "n/a", sum: "n/a"}
            ];
            Object.keys(aggregated[year]).forEach(key => {
                result[year].find(x=> x.index === key).avg = Math.ceil(aggregated[year][key].sum / 100 / aggregated[year][key].totalNumberOfDaysInMonthsOverYears) * 100;
                result[year].find(x=> x.index === key).sum = Math.ceil(aggregated[year][key].sum / 100) * 100;
            });
        });

        state.sumVisitorsPerMonth = result;
    },
    /**
     * Sets the rounded daily data for unique visitors to the state, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setAverageVisitorsPerDay (state, payload) {
        const
            data = payload.data,
            aggregated = {},
            result = {};

        Object.keys(data).forEach(key => {
            const
                item = data[key],
                date = new Date(item.date),
                //  getDay() gives 0-6, where 0 = Sonntag, 1 = Montag, ... and 6 = Samstag, I prefer 0 = Montag, 1= Dienstag and 6 = Sonntag
                label = date.getDay() === 0 ? 6 : date.getDay() - 1,
                month = date.getMonth(),
                year = date.getFullYear();

            if (!aggregated[year]) {
                aggregated[year] = [];
            }

            if (!aggregated[year][month]) {
                aggregated[year][month] = [];
            }

            if (!aggregated[year][month][label]) {
                aggregated[year][month][label] = {
                    sum: 0,
                    totalNumberOfWeekdaysInMonthsOverYears: 0
                };
            }
            aggregated[year][month][label].sum = item.sum_num_visitors + aggregated[year][month][label].sum;
            aggregated[year][month][label].totalNumberOfWeekdaysInMonthsOverYears++;

        });

        // Ceil up to 100, e.g. 18318 becomes 18400
        Object.keys(aggregated).forEach(year => {
            result[year] = [];
            Object.keys(aggregated[year]).forEach(month => {
                result[year][month] = [
                    {index: "0", avg: "n/a"},
                    {index: "1", avg: "n/a"},
                    {index: "2", avg: "n/a"},
                    {index: "3", avg: "n/a"},
                    {index: "4", avg: "n/a"},
                    {index: "5", avg: "n/a"},
                    {index: "6", avg: "n/a"}
                ];
                Object.keys(aggregated[year][month]).forEach(key => {
                    result[year][month].find(x=> x.index === key).avg = Math.ceil(aggregated[year][month][key].sum / 100 / aggregated[year][month][key].totalNumberOfWeekdaysInMonthsOverYears) * 100;

                });
            });

            // check if there are data available for all months, fill up with "not available" otherwise
            for (let i = 0; i < 12; i++) {
                if (!result[year][i]) {
                    result[year][i] = [
                        {index: "0", avg: "n/a"},
                        {index: "1", avg: "n/a"},
                        {index: "2", avg: "n/a"},
                        {index: "3", avg: "n/a"},
                        {index: "4", avg: "n/a"},
                        {index: "5", avg: "n/a"},
                        {index: "6", avg: "n/a"}
                    ];
                }
            }
        });

        state.averageVisitorsPerDay = result;
    },
    /**
     * Sets the rounded yearly data for unique visitors to the state, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setActivitiesPerYear (state, payload) {
        const
            data = payload.data,
            aggregated = {},
            result = [];

        Object.keys(data).forEach(key => {
            const
                item = data[key],
                date = new Date(item.date),
                label = date.getFullYear();

            if (!aggregated[label]) {
                aggregated[label] = 0;
            }
            aggregated[label] += item.sum_num_visitors;
        });

        // Ceil up to 100, e.g. 18318 becomes 18400
        Object.keys(aggregated).forEach(key => {
            result.push({
                date__year: key,
                avg: Math.ceil(aggregated[key] / 100) * 100
            });
        });

        state.activitiesPerYear = result;
    },
    /**
     * Generate a GeoJson for all WhatALocation Locations.
     * @param {Object} state of this component
     * @param {Array} payload Array of all locations from WhatALocation endpoint
     * @returns {void}
     */
    setAllLocationsGeoJson (state, payload) {
        const geoJSON = {
                type: "FeatureCollection",
                crs: {
                    type: "link",
                    properties: {
                        href: "http://spatialreference.org/ref/epsg/4326/proj4/",
                        type: "proj4"
                    }
                },
                features: []
            },

            allLocationsArray = [];

        let featureJSON;

        payload.forEach(feature => {
            featureJSON = {
                type: "Feature",
                id: feature.location.id,
                geometry: feature.location.point,
                properties: {
                    street: feature.location.street,
                    id: feature.location.id
                    /* avgVisitorsMonday: Math.floor(feature.avg_daily_visitors_isoweekday[1]),
                    avgVisitorsTuesday: Math.floor(feature.avg_daily_visitors_isoweekday[2]),
                    avgVisitorsWednesday: Math.floor(feature.avg_daily_visitors_isoweekday[3]),
                    avgVisitorsThursday: Math.floor(feature.avg_daily_visitors_isoweekday[4]),
                    avgVisitorsFriday: Math.floor(feature.avg_daily_visitors_isoweekday[5]),
                    avgVisitorsSaturday: Math.floor(feature.avg_daily_visitors_isoweekday[6]),
                    avgVisitorsSunday: Math.floor(feature.avg_daily_visitors_isoweekday[7]),
                    avgVisitorsJanuary: Math.floor(feature.avg_daily_visitors_per_month[1]),
                    avgVisitorsFebruary: Math.floor(feature.avg_daily_visitors_per_month[2]),
                    avgVisitorsMarch: Math.floor(feature.avg_daily_visitors_per_month[3]),
                    avgVisitorsApril: Math.floor(feature.avg_daily_visitors_per_month[4]),
                    avgVisitorsMay: Math.floor(feature.avg_daily_visitors_per_month[5]),
                    avgVisitorsJune: Math.floor(feature.avg_daily_visitors_per_month[6]),
                    avgVisitorsJuly: Math.floor(feature.avg_daily_visitors_per_month[7]),
                    avgVisitorsAugust: Math.floor(feature.avg_daily_visitors_per_month[8]),
                    avgVisitorsSeptember: Math.floor(feature.avg_daily_visitors_per_month[9]),
                    avgVisitorsOctober: Math.floor(feature.avg_daily_visitors_per_month[10]),
                    avgVisitorsNovember: Math.floor(feature.avg_daily_visitors_per_month[11]),
                    avgVisitorsDecember: Math.floor(feature.avg_daily_visitors_per_month[12]) */
                }
            };

            /* Object.keys(feature.avg_daily_visitors_per_year).forEach(year => {
                featureJSON.properties["avgVisitors" + year] = Math.floor(feature.avg_daily_visitors_per_year[year]);
            }); */

            geoJSON.features.push(featureJSON);

            allLocationsArray.push({
                id: feature.location.id,
                street: feature.location.street
            });
        });

        geoJSON.styles = [
            {
                styleId: "customLayer",
                rules: [
                    {
                        style: {
                            circleStrokeColor: [
                                255,
                                0,
                                0,
                                1
                            ],
                            circleFillColor: [
                                255,
                                0,
                                0,
                                0.5
                            ]
                        }
                    }
                ]
            }
        ];

        state.allLocationsGeoJson = geoJSON;
        state.allLocationsArray = allLocationsArray.sort((a, b) => {
            if (a.street < b.street) {
                return -1;
            }
            if (a.street > b.street) {
                return 1;
            }
            return 0;
        });
    },
    /**
     * Sets the dwell times (grouped by "dwell time" and by date), selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setDwellTimes (state, payload) {
        const dwellTimeByTime = {},
            dwellTimeByDate = {};

        payload.forEach(item => {
            // Visitor sum as integer
            item.sum_num_visitors = Math.ceil(item.sum_num_visitors / 100) * 100;

            // Grouped by dwell time
            if (!dwellTimeByTime[item.DwellTime]) {
                dwellTimeByTime[item.DwellTime] = [];
            }
            dwellTimeByTime[item.DwellTime].push(item);

            // Grouped by date
            if (!dwellTimeByDate[item.date]) {
                dwellTimeByDate[item.date] = [];
            }
            dwellTimeByDate[item.date].push(item);
        });

        state.dwellTimesComplete = payload;
        state.dwellTimesPerTime = dwellTimeByTime;
        state.dwellTimesPerDate = dwellTimeByDate;
    },
    /**
     * Generates Bar Chart Daily Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} dates the year and the month's index, the data shall be generated for
     * @returns {void}
     */
    setBarChartDailyData (state, dates = {year: 2019, month: 0}) {
        const daily = state.averageVisitorsPerDay[dates.year][dates.month],
            labels = [],
            day_data = [],
            translatedLabelList = i18next.t("additional:modules.tools.vpidashboard.time.days", {returnObjects: true});

        daily.forEach((element, index) => {
            let label_text = translatedLabelList[index];

            if (element.avg === "n/a") {
                label_text = [label_text, i18next.t("additional:modules.tools.vpidashboard.unique.noData")];
            }

            labels.push(label_text);
            day_data.push(element.avg);
        });

        // eslint-disable-next-line one-var
        const data = {
            labels: labels,
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.dailyOverview", {year: dates.year, month: i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true})[dates.month]}),
                data: day_data,
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]
        };

        state.barChartDailyData = data;

    },

    /**
     * Generates Bar Chart Daily Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} dates the year and the month's index, the data shall be generated for
     * @returns {void}
     */
    setLineChartDailyData (state, dates = {year: 2019, month: 0}) {
        const daily = state.averageVisitorsPerDay[dates.year][dates.month],
            labels = [],
            day_data = [],
            translatedLabelList = i18next.t("additional:modules.tools.vpidashboard.time.days", {returnObjects: true});

        daily.forEach((element, index) => {
            let label_text = translatedLabelList[index];

            if (element.avg === "n/a") {
                label_text = [label_text, i18next.t("additional:modules.tools.vpidashboard.unique.noData")];
            }

            labels.push(label_text);
            day_data.push(element.avg);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels,
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.dailyOverview", {year: dates.year, month: i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true})[dates.month]}),
                data: day_data,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }]
        };

        state.lineChartDailyData = data;
    },

    /**
     * Generates Bar Chart Monthly Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Number} year the year, the data shall be generated for
     * @returns {void}
     */
    setBarChartMonthlyData (state, year = 2019) {
        const monthly = state.sumVisitorsPerMonth[year],
            labels = [],
            month_data = [],
            translatedLabelList = i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true});

        monthly.forEach((element) => {
            labels.push(translatedLabelList[element.index]);
            month_data.push(element.sum);
        });

        // eslint-disable-next-line
        const data = {
            labels: labels,
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.monthlyOverview", {year: year}),
                data: month_data,
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]

        };

        state.barChartMonthlyData = data;
    },

    /**
     * Generates Line Chart Monthly Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Number} year the year, the data shall be generated for
     * @returns {void}
     */
    setLineChartMonthlyData (state, year = 2019) {
        const monthly = state.sumVisitorsPerMonth[year],
            labels = [],
            month_data = [],
            translatedLabelList = i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true});

        monthly.forEach((element) => {
            labels.push(translatedLabelList[element.index]);
            month_data.push(element.sum);
        });

        // eslint-disable-next-line
        const data = {
            labels: labels,
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.monthlyOverview", {year: year}),
                data: month_data,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }]
        };

        state.lineChartMonthlyData = data;
    },
    /**
     * Generates Bar Chart Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setBarChartData (state, payload) {
        const
            data = payload.data,
            aggregated = {};

        Object.keys(data).forEach(key => {
            const
                item = data[key],
                label = changeDateFormat(new Date(item.date));

            if (!aggregated[label]) {
                aggregated[label] = 0;
            }
            aggregated[label] += item.sum_num_visitors;
        });

        // Ceil up to 100, e.g. 18318 becomes 18400
        Object.keys(aggregated).forEach(key => {
            aggregated[key] = Math.ceil(aggregated[key] / 100) * 100;
        });

        // Bar chart configuration
        state.barChartData = {
            labels: Object.keys(aggregated),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.uniqueVisitors"),
                data: Object.values(aggregated),
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]
        };
    },
    /**
     * Generates Line Chart Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setLineChartData (state, payload) {
        const
            data = payload.data,
            aggregated = {};

        Object.keys(data).forEach(key => {
            const
                item = data[key],
                label = changeDateFormat(new Date(item.date));

            if (!aggregated[label]) {
                aggregated[label] = 0;
            }
            aggregated[label] += item.sum_num_visitors;
        });

        // Ceil up to 100, e.g. 18318 becomes 18400
        Object.keys(aggregated).forEach(key => {
            aggregated[key] = Math.ceil(aggregated[key] / 100) * 100;
        });

        // Line chart configuration
        state.lineChartData = {
            labels: Object.keys(aggregated),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.uniqueVisitors"),
                data: Object.values(aggregated),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }]
        };
    },
    /**
     * Sets showLoader value in state.
     * Set it true to show loader and set it false to hide loader.
     * @param {Object} state the store's state object
     * @param {Boolean} isLoaderShown variable to set as showLoader
     * @returns {void}
     */
    setLoader (state, isLoaderShown) {
        state.showLoader = isLoaderShown;
    },
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
    },
    /**
     * Sets the id of the selected location.
     * If location B on the compare locations tab is activated the Id will be set for location B.
     * @param {Object} state the store's state object
     * @param {Object} payload containing the locationID and the source where the location was selected from
     * @returns {void}
     */
    setSelectedLocationId (state, payload) {
        if (!state.selectLocationBInMap || payload.source === "dropdown") {
            state.selectedLocationId = payload.locationID;
        }
        else {
            state.selectedLocationB = payload.locationID;
        }
    },
    /**
     * Sets the indicator that location B on the compare location tab is activated.
     * @param {Object} state the store's state object
     * @param {Boolean} value indicates if location B is activated or not
     * @returns {void}
     */
    setSelectLocationBInMap (state, value) {
        state.selectLocationBInMap = value;
    }
};

export default mutations;
