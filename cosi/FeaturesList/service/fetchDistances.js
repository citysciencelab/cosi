import axios from "axios";
import {getServiceUrl} from "../../utils/radioBridge.js";

/**
 *
 * @param {[Number, Number][]} sources sources
 * @param {[Number, Number][]} destinations destinations
 * @param {String} [profile] profile
 * @param {String} serviceId routing service
 * @param {String} fallbackId alternative routing service
 * @return {number[]} distances
 */
async function fetchMatrix (sources, destinations, profile, serviceId, fallbackId) {
    if (sources.length === 0) {
        return [];
    }
    if (destinations.length === 0) {
        return sources.map(() => null);
    }
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        const originalRequest = error.config,
            bkg_url = getServiceUrl(serviceId);

        if (!(error.response?.status === 200) && originalRequest.url.indexOf(bkg_url) === 0 && !originalRequest._retry) {
            originalRequest._retry = true;
            const uri = originalRequest.url.replace(bkg_url, getServiceUrl(fallbackId));

            return axios.post(uri, originalRequest.data,
                {
                    headers: originalRequest.headers
                });
        }
        return Promise.reject(error);
    });
    const baseUrl = getServiceUrl(serviceId) + "/v2/",
        service = "matrix",
        uri = baseUrl + service + "/" + (profile || "foot-walking") + "/json",
        opts = {
            "metrics": ["distance"],
            locations: [...sources, ...destinations],
            sources: Array.from(new Array(sources.length), (x, i) => i),
            destinations: Array.from(new Array(destinations.length), (x, i) => i + sources.length)
        },
        response = await axios.post(uri, JSON.stringify(opts),
            {
                headers: {
                    "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                    "Content-Type": "application/json"
                }
            });

    return response.data.distances;
}

/**
 *
 * @param {*} sources sources
 * @param {*} destinations destinations
 * @param {*} msg msg
 * @return {*} ret
 */
function removeInvalidPoints (sources, destinations, msg) {
    const csources = [...sources],
        cdestinations = [...destinations],
        sids = [],
        dids = [];

    if (msg.includes("Source point(s)") && msg.includes("Destination point(s)")) {
        const msgs = msg.split(". Destination");

        sids.push(...JSON.parse(msgs[0].slice(msgs[0].indexOf("["), msgs[0].indexOf("]") + 1)));
        dids.push(...JSON.parse(msgs[1].slice(msgs[1].indexOf("["), msgs[1].indexOf("]") + 1)));
    }
    else if (msg.includes("Source point(s)")) {
        sids.push(...JSON.parse(msg.slice(msg.indexOf("["), msg.indexOf("]") + 1)));
    }
    else if (msg.includes("Destination point(s)")) {
        dids.push(...JSON.parse(msg.slice(msg.indexOf("["), msg.indexOf("]") + 1)));
    }

    for (let i = sids.length - 1; i >= 0; i--) {
        csources.splice(sids[i], 1);
    }
    for (let i = dids.length - 1; i >= 0; i--) {
        cdestinations.splice(dids[i], 1);
    }

    return [sids, csources, cdestinations];
}

/**
 *
 * @param {[Number, Number][]} sources sources
 * @param {[Number, Number][]} destinations destinations
 * @param {String} [profile] profile
 * @param {String} serviceId routing service
 * @param {String} fallbackId alternative routing service
 * @return {Object[]} score
 */
export async function fetchDistances (sources, destinations, profile, serviceId, fallbackId) {
    try {
        return await fetchMatrix(sources, destinations, profile, serviceId, fallbackId);
    }
    catch (err) {
        if (err?.response?.data?.error?.code === 6010) {
            const msg = err?.response?.data?.error.message,
                ret = removeInvalidPoints(sources, destinations, msg),
                dists = await fetchMatrix(ret[1], ret[2], profile, serviceId, fallbackId);

            for (const i of ret[0]) {
                dists.splice(i, 0, null);
            }
            return dists;
        }

        throw err;
    }
}
