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
    setAverageVisitorsPerMonth (state, payload) {
        const monthly = payload.unique?.monthly,
            months = [];

        monthly.forEach(month => {
            const newMonth = {};

            newMonth.index = month.date__month - 1;
            newMonth.avg = Math.floor(month.avg);
            months.push(newMonth);
        });
        months.sort((a, b) => a.index - b.index);
        state.averageVisitorsPerMonth = months;
    },
    /**
     * Sets the rounded daily data for unique visitors to the state, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setAverageVisitorsPerDay (state, payload) {
        const dayly = payload.unique?.dayly,
            days = [],
            dayIndexTranslator = ["mo", "tu", "we", "th", "fr", "sa", "su"];

        dayly.forEach(day => {
            const newDay = {};

            newDay.index = day.weekday;
            newDay.avg = Math.floor(day.avg);
            days.push(newDay);
        });

        state.averageVisitorsPerDay = days.toSorted((a, b) => dayIndexTranslator.indexOf(a.index) - dayIndexTranslator.indexOf(b.index));
    },
    /**
     * Sets the rounded yearly data for unique visitors to the state, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setIndividualVisitorsPerYear (state, payload) {
        const yearly_average = payload?.unique?.best_year,
            individualVisitorsPerYear = yearly_average.map((element) => {
                element.avg = Math.floor(element.avg);
                element.sum = Math.floor(element.sum);

                return element;
            });

        state.individualVisitorsPerYear = individualVisitorsPerYear;
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
                    id: feature.location.id,
                    avgVisitorsMonday: Math.floor(feature.avg_daily_visitors_isoweekday[1]),
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
                    avgVisitorsDecember: Math.floor(feature.avg_daily_visitors_per_month[12])
                }
            };

            Object.keys(feature.avg_daily_visitors_per_year).forEach(year => {
                featureJSON.properties["avgVisitors" + year] = Math.floor(feature.avg_daily_visitors_per_year[year]);
            });

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
        state.allLocationsArray = allLocationsArray;
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
            item.sum_num_visitors = Math.floor(item.sum_num_visitors);

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
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setBarChartDailyData (state, payload) {
        const daily = payload?.unique?.dayly,
            labels = [],
            day_data = [];

        daily.forEach((element) => {
            labels.push(element.weekday);
            day_data.push(element.sum);
        });
        // eslint-disable-next-line one-var
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.dailyOverview"),
                data: day_data.reverse(),
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]
        };

        state.barChartDailyData = data;

    },

    /**
     * Generates Bar Chart Daily Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setLineChartDailyData (state, payload) {
        const daily = payload?.unique?.dayly,

            labels = [],
            day_data = [];

        daily.forEach((element) => {
            labels.push(element.weekday);
            day_data.push(element.sum);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.dailyOverview"),
                data: day_data.reverse(),
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
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setBarChartMonthlyData (state, payload) {
        const monthly = payload?.unique?.monthly,
            labels = [],
            month_data = [];

        monthly.forEach((element) => {
            labels.push(element.date__month);
            month_data.push(element.sum);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.monthlyOverview"),
                data: month_data.reverse(),
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]
        };

        state.barChartMonthlyData = data;
    },

    /**
     * Generates Line Chart Monthly Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setLineChartMonthlyData (state, payload) {
        const monthly = payload?.unique?.monthly,

            labels = [],
            month_data = [];

        monthly.forEach((element) => {
            labels.push(element.date__month);
            month_data.push(element.sum);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.monthlyOverview"),
                data: month_data.reverse(),
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
        const best_month = payload?.unique?.best_month,
            labels = [],
            month_data = [];

        best_month.forEach((element) => {
            if (element.date__month < 10) {
                labels.push(`0${element.date__month}-${element.date__year}`);
            }
            else {
                labels.push(`${element.date__month}-${element.date__year}`);
            }
            month_data.push(element.sum);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.uniqueVisitors"),
                data: month_data.reverse(),
                hoverOffset: 4,
                backgroundColor: "#FD763B"
            }]
        };

        state.barChartData = data;
    },

    /**
     * Generates Line Chart Data and saves it to state.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setLineChartData (state, payload) {
        const best_month = payload?.unique?.best_month,
            labels = [],
            month_data = [];

        best_month.forEach((element) => {
            if (element.date__month < 10) {
                labels.push(`0${element.date__month}-${element.date__year}`);
            }
            else {
                labels.push(`${element.date__month}-${element.date__year}`);
            }
            month_data.push(element.sum);
        });
        // eslint-disable-next-line
        const data = {
            labels: labels.reverse(),
            datasets: [{
                label: i18next.t("additional:modules.tools.vpidashboard.unique.uniqueVisitors"),
                data: month_data.reverse(),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }]
        };

        state.lineChartData = data;
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
        const dataset = [],
            datasetLine = [],
            tempDataset = [],
            tempDatasetLine = [],
            xLabels = [],
            colors = ["#00aa55", "#007ea8", "#9784ff ", "#CC3E00", "#ffa300", "#f8e08e", "#708090"],
            labels = state.ageGroupPieChartLabels,
            grouped = {},
            allYears = [];

        let entryCount = 0,
            xlabel = "",
            ageGroupsByYear = [];

        state.allAgeGroupsData.forEach(entry => {

            if (entry.age_group === "u") {
                return;
            }

            // get the age groups by year and month
            const ageGroupIndex = tempDataset.findIndex((i) => {
                return i.label === entry.age_group;
            });

            if (ageGroupIndex > -1) {

                tempDataset[ageGroupIndex].data.push(Math.floor(entry.sum_num_visitors));
                tempDatasetLine[ageGroupIndex].data.push(Math.floor(entry.sum_num_visitors));
            }
            else {
                const dataObj = {
                        data: [Math.floor(entry.sum_num_visitors)],
                        hoverOffset: 4,
                        label: entry.age_group
                    },
                    dataObjLine = {
                        data: [Math.floor(entry.sum_num_visitors)],
                        label: entry.age_group,
                        fill: false,
                        tension: 0.1
                    };

                tempDataset.push(dataObj);
                tempDatasetLine.push(dataObjLine);
            }

            xlabel = changeDateFormat(entry.date);

            if (!xLabels.find(l => {
                return l === xlabel;
            })) {
                xLabels.push(xlabel);
            }

            // generate the sum of the age groups by year for pie chart
            // eslint-disable-next-line
            const ageGroup = entry.age_group,
                [year] = entry.date.split("-"),
                key = `${ageGroup}-${year}`;

            grouped[key] = grouped[key] || {ageGroup, year, sum: 0};
            grouped[key].sum += Math.floor(entry.sum_num_visitors);

            ageGroupsByYear = Object.values(grouped);

            if (allYears.indexOf(year) < 0) {
                allYears.push(year);
            }

        });

        labels.forEach(l => {
            const ageGroupObj = tempDataset.find(ageGroup => {
                    return ageGroup.label.replace(/[[\]']+/g, "") === l;
                }),
                ageGroupObjLine = tempDatasetLine.find(ageGroup => {
                    return ageGroup.label.replace(/[[\]']+/g, "") === l;
                });

            ageGroupObj.backgroundColor = colors[entryCount];
            ageGroupObj.label = l;

            ageGroupObjLine.borderColor = colors[entryCount];
            ageGroupObjLine.label = l;

            dataset.push(ageGroupObj);
            datasetLine.push(ageGroupObjLine);

            ageGroupsByYear.forEach(year => {
                if (year.ageGroup.replace(/[[\]']+/g, "") === l) {
                    year.backgroundColor = colors[entryCount];
                    year.label = l;
                }
            });

            entryCount += 1;
        });

        state.allAgeGroupsMonthlyData = dataset;
        state.allAgeGroupsMonthlyDataLine = datasetLine;
        state.ageGroupxLabels = xLabels;
        state.ageGroupsYearlyData = ageGroupsByYear;
        state.allAgeGroupsYears = allYears;
    },
    /**
     * Sets the id of the selected location.
     * @param {Object} state the store's state object
     * @param {Integer} selectedLocationId the id of the selected location
     * @returns {void}
     */
    setSelectedLocationId (state, selectedLocationId) {
        state.selectedLocationId = selectedLocationId;
    }
};

export default mutations;
