import axios from "axios";
import {Config} from "../../../config";

const actions = {
    /**
     * Addresses the WhatALocation visitor-types endpoint to get the data for the complete time range
     * @param {Object} state the stores state object.
     * @param {Object} commit actions commit object.
     * @returns {void}
     **/
    getVisitorTypes: async ({state, commit}) => {
        commit("setLoader", true);
        const url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/?group_by[date]=&location_id=${state.selectedLocationId}&group_by[VisitorType]&format=agg&aggregate[Sum]=num_visitors&pulse=activate&interval=300&transportation=pedestrian`,
            response = await axios.get(url);

        commit("setVisitorTypes", response.data.data);
        commit("setLoader", false);
    }
};

export default actions;
