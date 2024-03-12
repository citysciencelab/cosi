import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import defaults from "@masterportal/masterportalapi/src/defaults";

/**
 *
 * @export
 * @param {Object} [layerConf=defaults.layerConf] - recreates the initialization of the layerList from masterportal
 * @return {Promise} -
 */
export async function initializeLayerList (layerConf = defaults.layerConf) {
    return new Promise((resolve, reject) => {
        try {
            rawLayerList.initializeLayerList(layerConf, () => {
                resolve();
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
