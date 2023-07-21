import Worker from "worker-loader!../utils/isochronesWorker.js";
import {WFS, GeoJSON} from "ol/format.js";
import {getFeatureGET} from "../../../../src/api/wfs/getFeature.js";

let worker,
    // eslint-disable-next-line func-style, require-jsdoc
    workerFactory = () => new Worker();

/**
 *
 * @param {*} factory factory
 * @return {void}
 */
export function setWorkerFactory (factory) {
    workerFactory = factory;
}

/**
 *
 * @param {*} newWorker new worker
 * @return {void}
 */
export function setWorker (newWorker) {
    worker = newWorker;
}


/**
 *
 * @export
 * @param {*} url url
 * @param {*} featureType featureType
 * @param {*} projectionCode projectionCode
 * @return {void}
 */
export async function loadFilterPoly (url, featureType, projectionCode) {
    const ret = await getFeatureGET(url, {
            version: "1.1.0",
            featureType,
            srsName: projectionCode
        }),
        wfsReader = new WFS({}),
        feature = wfsReader.readFeatures(ret)[0];

    return feature.getGeometry().getPolygon(0).getCoordinates();
}

/**
 *
 * @param {*} params parameters
 * @param {*} progress progress callback
 * @return {*} isochrones
 */
async function createIsochrones (params, progress) {
    return new Promise((resolve, reject) => {
        worker.addEventListener("message", function handler (event) {
            const data = event.data;

            if (data.type !== "createIsochrones") {
                return;
            }
            if (data.request_canceled) {
                worker.removeEventListener("message", handler);
                reject(data);
            }
            if (data.error) {
                worker.removeEventListener("message", handler);
                reject(data.error);
            }
            else if (data.result) {
                worker.removeEventListener("message", handler);
                resolve(new GeoJSON().readFeatures(data.result));
            }
            else if (data.progress) {
                progress(data.progress);
            }
        });
        worker.postMessage({type: "createIsochrones", ...params});
    });
}

/**
 *
 * @param {*} params parameters
 * @param {*} progress progress callback
 * @return {*} isochrones
 */
async function init (params) {
    return new Promise((resolve, reject) => {
        worker.addEventListener("message", function handler (event) {
            const data = event.data;

            if (data.type !== "init") {
                return;
            }

            if (data.error) {
                worker.removeEventListener("message", handler);
                reject(data.error);
            }
            else if (data.result) {
                worker.removeEventListener("message", handler);
                resolve();
            }
        });

        worker.postMessage({type: "init", ...params});
    });
}

const actions = {
    async getIsochrones ({rootGetters, getters, commit}, params) {
        let ret;

        if (typeof worker === "undefined") {
            // worker.terminate();
            worker = workerFactory();
            worker.postMessage({type: "register", projections: rootGetters.namedProjections});
            worker.onerror = e => {
                console.error(e);
            };
            if (getters.filterPoly) {
                await init({coords: [getters.filterPoly]});
            }
            else if (getters.filterUrl && getters.filterFeatureType) {
                const coords = await loadFilterPoly(getters.filterUrl, getters.filterFeatureType, rootGetters["Maps/projectionCode"]);

                await init({coords});
            }
        }

        try {
            ret = await createIsochrones({...params, batchSize: getters.batchSize, baseUrl: getters.baseUrl(getters.serviceId), projectionCode: rootGetters["Maps/projectionCode"]}, (p) => commit("setProgress", p));
        }
        catch {
            ret = await createIsochrones({...params, batchSize: getters.batchSize, baseUrl: getters.baseUrl(), projectionCode: rootGetters["Maps/projectionCode"]}, (p) => commit("setProgress", p));
        }
        finally {
            commit("setProgress", 0);
        }
        return ret;
    },
    async getFilterPoly () {
        if (typeof worker === "undefined") {
            throw Error("worker not initialized");
        }

        return new Promise((resolve, reject) => {
            worker.addEventListener("message", function handler (event) {
                const data = event.data;

                if (data.type !== "getFilterPoly") {
                    return;
                }
                if (data.error) {
                    worker.removeEventListener("message", handler);
                    reject(data.error);
                }
                else if (data.result) {
                    worker.removeEventListener("message", handler);
                    resolve(data.result);
                }
            });
            worker.postMessage({type: "getFilterPoly"});
        });
    }
};

export default actions;
