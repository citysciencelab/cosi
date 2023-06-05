import sortArrays from "./sortArrays";
const generateDataArray = {
    /**
     * Generates an array that the chartjs library can consume
     * @param {Object} dataFromEndpoint The data from the endpoint respectivly from the state
     * @param {String} label The label for the data.
     * @param {String} backgroundColor The background color for the bars
     * @param {String} endpoint The endpoint flag
     * @return {{datasets: [{backgroundColor, data: *[], hoverOffset: number, label}], labels: *[]}} dataset that can
     * be consumed by the chart.js library
     */
    generateDataArray (dataFromEndpoint, label, backgroundColor, endpoint) {
        let groupByProperty = "";

        // Here we set the specific WhatALocationAPI
        // groupBy property
        if (endpoint === "Individuelle Besucher") {
            groupByProperty = "ReiseArt";
        }
        if (endpoint === "Altersgruppen") {
            groupByProperty = "age_group";
        }
        if (endpoint === "Besuchergruppen") {
            groupByProperty = "VisitorType";
        }
        if (endpoint === "Verweildauer") {
            groupByProperty = "DwellTime";
        }
        // eslint-disable-next-line
        const avg_num_visitors = [];
        // eslint-disable-next-line
        let labels = [];

        dataFromEndpoint?.data.forEach((element) => {
            avg_num_visitors.push(Math.round(element.avg_num_visitors));
            labels.push(element[groupByProperty]);
        });

        if (endpoint === "Verweildauer") {
            labels = sortArrays.sortDwellTimeArray(labels);
        }
        if (endpoint === "Altersgruppen") {
            labels = sortArrays.sortAgeGroupsArray(labels);
            // since we do not want the u data
            // and it is the last item in the array
            avg_num_visitors.splice(-1);
            labels.splice(-1);
        }
        // eslint-disable-next-line
        const data = {
            labels: labels,
            datasets: [{
                label: label,
                data: avg_num_visitors,
                hoverOffset: 4,
                backgroundColor: backgroundColor
            }]
        };

        return data;
    }
};

export default generateDataArray;
