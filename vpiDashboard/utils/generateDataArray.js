import sortArrays from "./sortArrays";

const generateDataArray = {
    /**
     * Generates an array that the chartjs library can consume
     * @param {Object} dataFromEndpoint The data from the endpoint respectivly from the state
     * @param {String} backgroundColor The background color for the bars
     * @param {String} endpoint The endpoint flag
     * @return {{datasets: [{backgroundColor, data: *[], hoverOffset: number, label}], labels: *[]}} dataset that can
     * be consumed by the chart.js library
     */
    generateDataArray (dataFromEndpoint, backgroundColor, endpoint) {
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

        // eslint-disable-next-line
        const sum_num_visitors = [];

        // eslint-disable-next-line
        let labels = [];

        dataFromEndpoint?.data.forEach((element) => {
            if (endpoint === "activities") {
                labels.push(i18next.t("additional:modules.tools.vpidashboard.tab.compareDates.dropdown.activities"));
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
            sum_num_visitors.splice(-1);

            labels.splice(-1);
        }

        if (endpoint !== "activities") {
            labels.forEach(l => {
                const data = dataFromEndpoint?.data.find(el => {
                    return el[groupByProperty] === l || el[groupByProperty] === "[" + l + "]";
                });

                sum_num_visitors.push(Math.ceil(data[dataKey] / 100) * 100);
            });
        }

        // eslint-disable-next-line
        const data = {
            labels: labels,
            datasets: [{
                data: sum_num_visitors,
                hoverOffset: 4,
                backgroundColor: backgroundColor
            }]
        };

        return data;
    }
};

export default generateDataArray;
