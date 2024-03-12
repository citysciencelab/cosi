import union from "@turf/union";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import uniqueAbv from "../utils/uniqueAbv";
/**
     * @description Merges all polygons into a single openlayers feature and commits it to the store
     * @param {Function} store.commit - Function to commit a mutation.
     * @param {Array} selection - Array of all openlayers features relevant for the selected geometry
     * @param {String} source - Name of the Tool the selection has been sent from
     * @param {String} id - Unique id for the selection
     * @returns {void}
     */
const actions = {
    addNewSelection ({state, commit}, {selection, source, id}) {
        let collection;
        const format = new GeoJSON(),
            selectionObject = {
                selection: Array,
                bufferedSelection: Array,
                source: String,
                id: String,
                abv: String,
                storedLayers: [],
                filterSettings: [],
                settings: {
                    buffer: 0,
                    bufferActive: false
                }
            },
            mergedPolygons = [];

        for (let i = 0; i < selection.length; i++) {

            // turns feature into geojson readable for turf
            const turfObj = format.writeFeatureObject(selection[i]);

            if (!collection) {
                collection = turfObj;
            }
            else {
                collection = union(collection, turfObj);
            }
        }
        // rewrite elements to openlayers features
        if (format.readFeature(collection).getGeometry()?.getType() === "MultiPolygon") {
            format.readFeature(collection).getGeometry().getPolygons().forEach(polygon => {
                mergedPolygons.push(new Feature(polygon));
            });
        }
        else {
            mergedPolygons.push(format.readFeature(collection));
        }

        selectionObject.selection = mergedPolygons;
        selectionObject.source = source;
        selectionObject.id = id;
        // selectionObject.abv = state.selections.filter(sel => sel.abv === id.match(/\b([A-Z0-9])/g).join("")).length > 0 ? id.match(/\b([A-Z0-9])/g).join("") + "-" + state.selections.filter(sel => sel.abv === id.match(/\b([A-Z0-9])/g).join("")).length : id.match(/\b([A-Z0-9])/g).join("");
        selectionObject.abv = uniqueAbv(id, id, state.selections.map(sel => sel.abv), 0);
        commit("addSelection", selectionObject);
    }
};

export default actions;
