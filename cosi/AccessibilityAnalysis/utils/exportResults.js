import {featuresToGeoJsonCollection, featureToGeoJson} from "../../utils/features/convertToGeoJson";
import {downloadJsonToFile} from "../../utils/download";
import {Point} from "ol/geom.js";
import Feature from "ol/Feature.js";
import {filterAllFeatures} from "../../utils/layer/filterAllFeatures";

/**
 * Prepares the export of the results of the supply analysis as geojson
 * @param {*} mapLayer - the components mapLayer
 * @param {String} projectionCode - The map projection code.
 * @returns {void}
 */
export function exportAsGeoJson (mapLayer, projectionCode) {
    const features = mapLayer.getSource().getFeatures(),
        featureCollection = featuresToGeoJsonCollection(mapLayer.getSource().getFeatures(), false, projectionCode),
        startIndex = featureCollection.features.length === 3 ? 0 : 1;

    if (!featureCollection.features.length) {
        return featureCollection;
    }

    for (let i = startIndex; i < featureCollection.features.length; i++) {
        const style = {
            fill: {
                color: features[i].getStyle().getFill().getColor()
            },
            stroke: {
                color: features[i].getStyle().getStroke().getColor(),
                width: features[i].getStyle().getStroke().getWidth()
            }
        };

        featureCollection.features[i].style = style;
        featureCollection.features[i].properties.index = i;
    }

    if (startIndex === 1) {
        featureCollection.features[0].style = {
            fill: {
                color: features[0].getStyle().getFill().getColor()
            },
            stroke: {
                color: features[0].getStyle().getStroke().getColor(),
                width: features[0].getStyle().getStroke().getWidth(),
                lineDash: features[0].getStyle().getStroke().getLineDash()
            }
        };
        featureCollection.features[0].properties.index = "ref";
    }

    if (this.mode === "point") {
        const feature = new Feature(new Point(this.clickCoordinate)),
            featureGeoJson = featureToGeoJson(feature, false, "EPSG:4326");

        featureCollection.features.push(featureGeoJson);
    }
    else if (this.mode === "region") {
        const allActviceFeatures = filterAllFeatures(this.activeVectorLayerList, this.isFeatureActive),
            coordinates = this.getCoordinates(allActviceFeatures);

        for (let i = 0; i < coordinates.length; i++) {
            const feature = new Feature(new Point(coordinates[i])),
                featureGeoJson = featureToGeoJson(feature, false, "EPSG:4326");

            featureCollection.features.push(featureGeoJson);
        }
    }

    return featureCollection;
}

/**
 * Downloads the results of the supply analysis as geojson
 * @param {*} featureCollection - the prepared geojson
 * @returns {void}
 */
export function downloadGeoJson (featureCollection) {
    downloadJsonToFile(featureCollection, "Erreichbarkeitsanalyse_CoSI.geojson");
    downloadJsonToFile(require("../assets/Erreichbarkeitsanalyse_style.json"), "Erreichbarkeitsanalyse_CoSI_styles.json");
}
