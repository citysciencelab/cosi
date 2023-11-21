import sortArrays from "./sortArrays";
import dayjs from "dayjs";
import "dayjs/locale/de";

const generateDataArray = {
    /**
     * Generates an array that the chartjs library can consume
     * @param {Object} dataFromEndpoint The data from the endpoint respectivly from the state
     * @param {String} backgroundColor The background color for the bars
     * @param {String} endpoint The endpoint flag
     * @param {String} chartType the requested chart type (one of bar or line)
     * @return {{datasets: [{backgroundColor, data: *[], hoverOffset: number, label}], labels: *[]}} dataset that can
     * be consumed by the chart.js library
     */
    generateDataArray (dataFromEndpoint, backgroundColor, endpoint, chartType) {
        let
            groupByProperty = "",
            dataKey = "";

        // Here we set the specific WhatALocationAPI, groupBy property
        if (endpoint === "activities") {
            groupByProperty = "date";
            dataKey = "sum_num_visitors";
        }
        if (endpoint === "ageGroup") {
            groupByProperty = "age_group";
            dataKey = "sum_num_visitors";
        }
        if (endpoint === "visitorTypes") {
            groupByProperty = "VisitorType";
            dataKey = "sum_num_visitors";
        }
        if (endpoint === "dwellTime") {
            groupByProperty = "DwellTime";
            dataKey = "sum_num_visitors";
        }
        if (endpoint === "daily") {
            groupByProperty = "date__hour";
            dataKey = "sum_num_visitors";
        }

        // eslint-disable-next-line
        const sum_num_visitors = [];

        // eslint-disable-next-line
        let labels = [];

        dataFromEndpoint?.data.forEach((element) => {
            if (endpoint === "activities") {
                if (dataFromEndpoint.data.length > 1) {
                    labels.push(dayjs(element.date).locale("de").format("dd, DD.MM.YYYY"));
                }
                else {
                    labels.push(i18next.t("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.activities"));
                }
                sum_num_visitors.push(Math.ceil(element[dataKey] / 100) * 100);
            }
            else if (endpoint === "daily") {
                labels.push(element[groupByProperty] + ":00");
                sum_num_visitors.push(Math.ceil(element[dataKey] / 100) * 100);
            }
            else {
                labels.push(element[groupByProperty]);
            }
        });

        if (endpoint === "dwellTime") {
            labels = sortArrays.sortDwellTimeArray(labels);
        }
        if (endpoint === "ageGroup") {
            labels = sortArrays.sortAgeGroupsArray(labels);
            // since we do not want the u data
            // and it is the last item in the array
            labels.splice(-1);
            // since there are not consistent data for all date ranges
            // we do not want the age group 18-19 to be shown in the UI:
            // cut it out here
            if (labels.indexOf("18-19") > -1) {
                labels.splice(labels.indexOf("18-19"), 1);
            }
        }

        if (!["activities", "daily"].includes(endpoint)) {
            labels.forEach(l => {
                const data = dataFromEndpoint?.data.find(el => {
                    return el[groupByProperty] === l || el[groupByProperty] === "[" + l + "]";
                });

                sum_num_visitors.push(Math.ceil(data[dataKey] / 100) * 100);
            });

            if (endpoint === "visitorTypes") {
                labels.forEach((l, index) => {
                    if (l === "Einwohner") {
                        labels[index] = i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.residents");
                    }
                });
            }
        }

        // eslint-disable-next-line
        let chartData = {};

        switch (chartType) {
            case "line":
                chartData = {
                    labels: labels,
                    datasets: [{
                        data: sum_num_visitors,
                        fill: false,
                        borderColor: backgroundColor,
                        tension: 0.1
                    }]
                };
                break;
            case "bar":
            default:
                chartData = {
                    labels: labels,
                    datasets: [{
                        data: sum_num_visitors,
                        hoverOffset: 4,
                        backgroundColor: backgroundColor
                    }]
                };
                break;
        }

        return chartData;
    }
};

export default generateDataArray;
