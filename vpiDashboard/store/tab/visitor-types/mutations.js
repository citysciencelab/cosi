const mutations = {
    /**
     * Sets the visitor types, selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setVisitorTypes (state, payload) {
        const
            visitorTypesByTypeAndYearComplete = {},
            visitorTypesByTypeAndYear = {};

        // Prepare "grouped by visitor type and year"
        payload.forEach(item => {

            // get the age groups by year and month
            const [yearOfEntry, monthOfEntry] = item.date.split("-");

            item.sum_num_visitors_origin = item.sum_num_visitors;
            item.sum_num_visitors = Math.ceil(item.sum_num_visitors / 100) * 100;

            if (!visitorTypesByTypeAndYearComplete[yearOfEntry]) {
                visitorTypesByTypeAndYearComplete[yearOfEntry] = {};
            }

            if (!visitorTypesByTypeAndYearComplete[yearOfEntry][item.VisitorType]) {
                visitorTypesByTypeAndYearComplete[yearOfEntry][item.VisitorType] = [
                    {index: "01", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "02", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "03", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "04", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "05", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "06", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "07", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "08", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "09", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "10", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "11", sum: "n/a", sumOrig: "n/a", label: item.VisitorType},
                    {index: "12", sum: "n/a", sumOrig: "n/a", label: item.VisitorType}
                ];
            }

            visitorTypesByTypeAndYearComplete[yearOfEntry][item.VisitorType].find(x=> x.index === monthOfEntry).sum = item.sum_num_visitors;
            visitorTypesByTypeAndYearComplete[yearOfEntry][item.VisitorType].find(x=> x.index === monthOfEntry).sumOrig = item.sum_num_visitors_origin;
        });

        // Sum "grouped by visitor type and year" (daily)
        // Example: {"Touristen": {"2021": 12344, "2022": 4321}, "Pendler": { ... }}
        Object.keys(visitorTypesByTypeAndYearComplete).forEach(year => {
            Object.keys(visitorTypesByTypeAndYearComplete[year]).forEach(type => {

                if (!visitorTypesByTypeAndYear[type]) {
                    visitorTypesByTypeAndYear[type] = {};
                }
                if (!visitorTypesByTypeAndYear[type][year]) {
                    visitorTypesByTypeAndYear[type][year] = 0;
                }
                // combine Tagestouristen and Übernachtungstouristen to "Touristen" for display in the data cards
                if (["Tagestouristen", "Übernachtungstouristen"].includes(type)) {
                    if (!visitorTypesByTypeAndYear.Touristen) {
                        visitorTypesByTypeAndYear.Touristen = {};
                    }
                    if (!visitorTypesByTypeAndYear.Touristen[year]) {
                        visitorTypesByTypeAndYear.Touristen[year] = 0;
                    }
                }
                const sum = visitorTypesByTypeAndYearComplete[year][type].reduce((acc, value) => {
                        return value.sumOrig === "n/a" ? acc : acc + value.sumOrig;
                    }, 0),
                    filledDates = visitorTypesByTypeAndYearComplete[year][type].filter((val) => val.sum !== "n/a"),
                    numberOfDatasets = filledDates.length;

                visitorTypesByTypeAndYear[type][year] = Math.ceil(sum / numberOfDatasets);

                // sum Tagestouristen and Übernachtungstouristen to "Touristen"
                if (["Tagestouristen", "Übernachtungstouristen"].includes(type)) {
                    visitorTypesByTypeAndYear.Touristen[year] += Math.ceil(sum / numberOfDatasets);
                }
            });
        });

        state.visitorTypesByYearAndTypeComplete = visitorTypesByTypeAndYearComplete;
        state.visitorTypesByTypeAndYear = visitorTypesByTypeAndYear;
    }

};

export default mutations;
