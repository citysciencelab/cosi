import {featuresToGeoJsonCollection, featureToGeoJson} from "../../utils/features/convertToGeoJson";
import {downloadJsonToFile} from "../../utils/download";
import store from "../../../../src/app-store";
import {generateColorScale} from "../../utils/colorScale.js";
import {Fill, Stroke, Style, Text} from "ol/style.js";
import {convertColor} from "../../../../src/utils/convertColor";

/**
 * Gets the map's CRS from the app-store
 * @returns {String} the map's current CRS code
 */
function getPortalCrs () {
    return store.getters["Maps/projectionCode"];
}

/**
 * Gets the current key of the attribute "name" from the DistrictSelector
 * @returns {String} the key of the attribute "name"
 */
function getKeyOfAttrName () {
    return store.getters["Tools/DistrictSelector/keyOfAttrName"];
}

/**
 * Exports the results of the supply analysis as geojson
 * @param {Integer} index Index of the set to be deleted in the dataSets Array.
 * @returns {void}
 */
export function exportAsGeoJson (index) {
    const projectionCode = getPortalCrs(),
        total = this.dataSets[index].results.find(res => res.scope === "Gesamt"),
        average = this.results.find(res => res.scope === "Durchschnitt"),
        featureCollection = featuresToGeoJsonCollection(this.selectedFeatures, false, projectionCode),
        values = this.results.map(x => {
            return x.coverage;
        }),
        colorScale = generateColorScale(values);

    // match the result and add it to the resp. geoJSON
    for (const feature of featureCollection.features) {
        const result = this.dataSets[index].results.find(res => res.scope === feature.properties[getKeyOfAttrName()]),
            convertedColor = convertColor(colorScale.scale(result.coverage), "rgb"),
            style = new Style({
                fill: new Fill({color: [...convertedColor, 0.75]}),
                zIndex: 1,
                text: new Text({
                    font: "16px Calibri,sans-serif",
                    fill: new Fill({
                        color: [255, 255, 255]
                    }),
                    stroke: new Stroke({
                        color: [0, 0, 0],
                        width: 3
                    }),
                    text: result.coverage ? parseFloat(result.coverage).toLocaleString("de-DE") : "Keine Daten vorhanden"
                })
            });

        feature.properties = {...feature.properties, paramA_name: this.selectedFieldA.id,
            paramB_name: this.selectedFieldB.id, ...result, total, average, style};
        delete feature.properties.stats;
    }

    for (const field of [this.selectedFieldA, this.selectedFieldB]) {
        if ("layerId" in field) {
            const layerFeatures = this.layerList.find(layer => layer.get("name") === field.id).getSource().getFeatures();

            for (const feature of layerFeatures) {
                const featureGeoJson = featureToGeoJson(feature);

                featureGeoJson.properties = {};
                featureCollection.features.push(featureGeoJson);
            }
        }
    }

    downloadJsonToFile(featureCollection, "Versorgungsanalyse_CoSI.geojson");
}
