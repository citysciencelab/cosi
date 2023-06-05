import axios from "axios";
import {Config} from "../../../../config";

const actions = {
    /* Adresses the WhatALocation API and compares to data points
     * @param {Object} commit Commit Object,
     * @param {Object} compareData Object which holds the data to compare
     * @returns {Promise<void>} sets the data in store
     */
    getDataToCompare: async ({commit}, compareData) => {
        const
            options = {
                "Authorization": `Bearer ${Config.whatalocationApi.auth_token}`
            };

        if (compareData.character === "Verweildauer") {
            let date = compareData.dates[0];

            commit("setLoader", true);
            const
                urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/?group_by[date]=&location_id=${compareData.location_id}&group_by[DwellTime]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseA = await axios.get(urlA, {headers: options});

            commit(`setDwellTime${date.dateName}`, responseA.data);
            date = compareData.dates[1];
            // eslint-disable-next-line
            const
                urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/?group_by[date]=&location_id=${compareData.location_id}&group_by[DwellTime]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseB = await axios.get(urlB, {headers: options});

            commit("setLoader", false);
            commit(`setDwellTime${date.dateName}`, responseB.data);

        }

        if (compareData.character === "Individuelle Besucher") {
            let date = compareData.dates[0];

            commit("setLoader", true);
            const
                urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/?group_by[date]=&location_id=${compareData.location_id}&group_by[ReiseArt]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseA = await axios.get(urlA, {headers: options});

            commit(`setIndividualVisitors${date.dateName}`, responseA.data);

            date = compareData.dates[1];
            // eslint-disable-next-line
            const
                urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/?group_by[date]=&location_id=${compareData.location_id}&group_by[ReiseArt]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseB = await axios.get(urlB, {headers: options});

            commit("setLoader", false);
            commit(`setIndividualVisitors${date.dateName}`, responseB.data);
        }
        if (compareData.character === "Altersgruppen") {
            let date = compareData.dates[0];

            commit("setLoader", true);
            const
                urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/?&group_by[date]=&location_id=${compareData.location_id}&group_by[age_group]$format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseA = await axios.get(urlA, {headers: options});

            commit(`setAgeGroups${date.dateName}`, responseA.data);

            date = compareData.dates[1];
            // eslint-disable-next-line
            const
                urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/?&group_by[date]=&location_id=${compareData.location_id}&group_by[age_group]$format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseB = await axios.get(urlB, {headers: options});

            commit("setLoader", false);
            commit(`setAgeGroups${date.dateName}`, responseB.data);
        }


        if (compareData.character === "Besuchergruppen") {
            let date = compareData.dates[0];

            commit("setLoader", false);
            const
                urlA = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/?group_by[date]=&location_id=${compareData.location_id}&group_by[VisitorType]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseA = await axios.get(urlA, {headers: options});

            commit(`setVisitorTypes${date.dateName}`, responseA.data);

            date = compareData.dates[1];
            // eslint-disable-next-line
            const
                urlB = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/?group_by[date]=&location_id=${compareData.location_id}&group_by[VisitorType]&format=agg&aggregate[Avg]=num_visitors&pulse=activate&interval=300&transportation=pedestrian&date=${date.date}`,
                responseB = await axios.get(urlB, {headers: options});

            commit("setLoader", false);
            commit(`setVisitorTypes${date.dateName}`, responseB.data);
        }
    }

};

export default actions;
