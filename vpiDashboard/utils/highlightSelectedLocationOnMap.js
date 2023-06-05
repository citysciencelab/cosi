import {Circle, Fill, Stroke, Style} from "ol/style.js";

/**
 * Selects the current location and deselects the previous selected location on the map
 * @param {String} newLocationID ID of the current location
 * @param {String} oldLocationID ID of the previously selected location
 * @return {void}
 */
export function highlightSelectedLocationOnMap (newLocationID, oldLocationID) {
    const map = mapCollection.getMap("2D"),
        vpiLayer = map.getLayers()
            .getArray()
            .find((l) => {
                return l.get("id") === "vpi";
            }),
        features = vpiLayer
            .getSource()
            .getFeatures();

    features.forEach(feat => {
        if (oldLocationID && oldLocationID !== "clear") {
            if (feat.getId().toString() === oldLocationID) {
                feat.setStyle(new Style({
                    image: new Circle({
                        radius: 10,
                        fill: new Fill({color: [255, 0, 0, 0.5]}),
                        stroke: new Stroke({color: "#fa0505", width: 2})
                    })
                }));
            }
        }
        else if (oldLocationID === "clear") {
            feat.setStyle(new Style({
                image: new Circle({
                    radius: 10,
                    fill: new Fill({color: [255, 0, 0, 0.5]}),
                    stroke: new Stroke({color: "#fa0505", width: 2})
                })
            }));
        }

        if (newLocationID && feat.getId().toString() === newLocationID) {
            feat.setStyle(new Style({
                image: new Circle({
                    radius: 12,
                    fill: new Fill({color: [255, 0, 0, 0.5]}),
                    stroke: new Stroke({color: [0, 240, 230], width: 5})
                })
            }));
        }
    });
}

