import axios from "axios";
import GeoJSON from "ol/format/GeoJSON";
import {splitIntoChunks} from "../../utils/array/splitIntoChunks";

/**
 * send request to get Isochrone geoJSON
 * @param {String} pathType type of transportation
 * @param {Array} coordinates coordinates of origins
 * @param {String} rangeType  type of range ("time" or "distance")
 * @param {Array} rangeArray array of time range values
 * @param {object} abort abort
 * @param {String} baseUrl url
 * @returns {void}
 */
async function requestIsochrones (pathType, coordinates, rangeType, rangeArray, abort, baseUrl) {
    const promises = [],
        format = new GeoJSON(),
        // locations are limited to 5 in the bkg service
        chunks = splitIntoChunks(coordinates, 2),
        baseUrl_ = baseUrl ? baseUrl : "https://api.openrouteservice.org/v2/";

    for (let i = 0; i < chunks.length; i++) {
        const _baseUrl = baseUrl_ + "isochrones/",
            opts = {"locations": chunks[i], "range_type": rangeType, "range": rangeArray},
            url = _baseUrl + pathType.trim(),
            headers = {
                "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                "Content-Type": "application/json"
            };

        if (baseUrl_ === "https://api.openrouteservice.org/v2/") {
            headers.Authorization = "5b3ce3597851110001cf6248ef277cc626c440eb819e9299870c194c";
        }

        promises.push(
            axios.post(url + "/geojson", JSON.stringify(opts), {
                headers: headers,
                cancelToken: abort && abort.token
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                console.error("Error: ", error);
            })
        );
    }

    return Promise.all(promises).then((featureCollections) => {
        const features = [];

        featureCollections.forEach(collection => {
            if (collection) {
                features.push(...format.readFeatures(collection));
            }
        });

        return features;
    });

}

export default requestIsochrones;
