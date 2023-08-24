import {Config} from "../config";
import axios from "axios";
import {buildEndpointUrl} from "../utils/buildEndpointUrl";

const apiEndpointService = {

    /**
     * Receive "activities" from the "daily-aggregated" endpoint.
     * @param {String} locationId Current location ID
     * @param {String} date Date in format YYYY-MM-DD
     * @param {String} dateTo Date in format YYYY-MM-DD
     * @return {Promise<axios.AxiosResponse<any>>} Dwell times data
     */
    async receiveActivities (locationId, date = null, dateTo = null) {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily-aggregated/`,
            query = {
                "location_id": locationId,
                "group_by[date]": null,
                "aggregate[Sum]": "num_visitors",
                "transportation": "pedestrian",
                "pulse": false,
                "use_zone": true
            };

        if (date !== null && dateTo !== null) {
            query.date__gte = date;
            query.date__lte = dateTo;
        }
        else if (date !== null) {
            query.date = date;
        }

        return axios.get(
            buildEndpointUrl(url, query)
        );
    },

    /**
     * Receive "dwell times" from the "dwell-times" endpoint.
     * @param {String} locationId Current location ID
     * @param {String} date Date in format YYYY-MM-DD
     * @return {Promise<axios.AxiosResponse<any>>} Dwell times data
     */
    async receiveDwellTimes (locationId, date = null) {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/dwell-times/`,
            query = {
                "location_id": locationId,
                "group_by[date]": null,
                "group_by[DwellTime]": null,
                "aggregate[Sum]": "num_visitors",
                "format": "agg",
                "pulse": false,
                "use_zone": true,
                "transportation": "pedestrian"
            };

        if (date !== null) {
            query.date = date;
        }

        return axios.get(
            buildEndpointUrl(url, query)
        );
    },
    /**
     * Receive "age groups" from the "ages" endpoint.
     * @param {String} locationId Current location ID
     * @param {String} date Date in format YYYY-MM-DD
     * @return {Promise<axios.AxiosResponse<any>>} Age groups data
     */
    async receiveAgeGroups (locationId, date = null) {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/ages/`,
            query = {
                "location_id": locationId,
                "group_by[date]": null,
                "group_by[age_group]": null,
                "aggregate[Sum]": "num_visitors",
                "format": "agg",
                "pulse": false,
                "use_zone": true,
                "transportation": "pedestrian"
            };

        if (date !== null) {
            query.date = date;
        }

        return axios.get(
            buildEndpointUrl(url, query)
        );
    },
    /**
     * Receive "visitor types" from the "visitor-types" endpoint.
     * @param {String} locationId Current location ID
     * @param {String} date Date in format YYYY-MM-DD
     * @return {Promise<axios.AxiosResponse<any>>} Visitor types data
     */
    async receiveVisitorTypes (locationId, date = null) {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/visitor-types/`,
            query = {
                "location_id": locationId,
                "group_by[date]": null,
                "group_by[VisitorType]": null,
                "aggregate[Sum]": "num_visitors",
                "format": "agg",
                "pulse": false,
                "use_zone": true,
                "transportation": "pedestrian"
            };

        if (date !== null) {
            query.date = date;
        }

        return axios.get(
            buildEndpointUrl(url, query)
        );
    },
    /**
     * Receive "daily visitors" (hourly) from the "daily" endpoint.
     * The "daily" endpoint requires date_gte and date_lte to be set and doesn't accept the date parameter.
     * @param {String} locationId Current location ID
     * @param {String} date Date in format YYYY-MM-DD
     * @return {Promise<axios.AxiosResponse<any>>} Visitor types data
     */
    async receiveVisitorsDaily (locationId, date = null) {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/daily/`,
            query = {
                "location_id": locationId,
                "group_by[date__hour]": null,
                "aggregate[Sum]": "num_visitors",
                "ReiseArt__in": "eingehend,ausgehend",
                "pulse": false,
                "use_zone": true,
                "transportation": "pedestrian",
                "date__gte": `${date} 00:00:00`,
                "date__lte": `${date} 23:59:59`
            };

        return axios.get(
            buildEndpointUrl(url, query)
        );
    },
    /**
     * Receive "all locations" from the "locations/all_summary" endpoint.
     * @return {Promise<axios.AxiosResponse<any>>} Visitor types data
     */
    async receiveAllSummary () {
        const
            url = `${Config.whatalocationApi.host}${Config.whatalocationApi.basepath}/locations/all_summary/?format=json`,
            query = {};

        return axios.get(
            buildEndpointUrl(url, query)
        );
    }

};

export default apiEndpointService;
