const mutations = {
    /**
     * Sets the dwell times (grouped by "dwell time" and by date), selected from WhatALocation data.
     * @param {Object} state the store's state object
     * @param {Object} payload data from WhatALocation endpoint
     * @returns {void}
     */
    setDwellTimes (state, payload) {
        const dwellTimeByDate = {},
            dwellTimeYearlySums = {};

        payload.forEach(item => {
            // get the age groups by year and month
            const [yearOfEntry, monthOfEntry] = item.date.split("-");

            if (!dwellTimeByDate[yearOfEntry]) {
                dwellTimeByDate[yearOfEntry] = {};
                dwellTimeYearlySums[yearOfEntry] = {};
            }

            if (!dwellTimeByDate[yearOfEntry][item.DwellTime]) {
                dwellTimeByDate[yearOfEntry][item.DwellTime] = [
                    {index: "01", sum: "n/a", label: item.DwellTime},
                    {index: "02", sum: "n/a", label: item.DwellTime},
                    {index: "03", sum: "n/a", label: item.DwellTime},
                    {index: "04", sum: "n/a", label: item.DwellTime},
                    {index: "05", sum: "n/a", label: item.DwellTime},
                    {index: "06", sum: "n/a", label: item.DwellTime},
                    {index: "07", sum: "n/a", label: item.DwellTime},
                    {index: "08", sum: "n/a", label: item.DwellTime},
                    {index: "09", sum: "n/a", label: item.DwellTime},
                    {index: "10", sum: "n/a", label: item.DwellTime},
                    {index: "11", sum: "n/a", label: item.DwellTime},
                    {index: "12", sum: "n/a", label: item.DwellTime}
                ];
            }

            // Visitor sum as integer
            item.sum_num_visitors = Math.ceil(item.sum_num_visitors / 100) * 100;

            dwellTimeByDate[yearOfEntry][item.DwellTime].find(x=> x.index === monthOfEntry).sum = item.sum_num_visitors;

            if (!dwellTimeYearlySums[yearOfEntry][item.DwellTime]) {
                dwellTimeYearlySums[yearOfEntry][item.DwellTime] = 0;
            }

            // sum the single month's datasets for each dwelltime group (to be used in the pie chart later)
            dwellTimeYearlySums[yearOfEntry][item.DwellTime] += Math.ceil(item.sum_num_visitors / 100) * 100;
        });

        state.dwellTimesComplete = payload;
        state.dwellTimesPerDate = dwellTimeByDate;
        state.dwellTimesPerYear = dwellTimeYearlySums;
    }
};

export default mutations;
