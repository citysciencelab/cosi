import * as Proj from "ol/proj.js";
import * as Extent from "ol/extent";
import GeometryCollection from "ol/geom/GeometryCollection";
import {setBBoxToGeom} from "../../utils/setBBoxToGeom";
import {getSearchResultsCoordinates} from "../../utils/getSearchResultsGeom";
import {
    lineString as turfLineString,
    featureCollection as turfFeatureCollection
} from "@turf/helpers";
import {default as turfBuffer} from "@turf/buffer";
import {readFeatures} from "../components/util.js";
import {transformFeatures} from "../../utils/features/transform";
import {getModelByAttributes} from "../../utils/radioBridge.js";
import {getRecordById} from "../../../../src/api/csw/getRecordById";
import {filterAllFeatures} from "../../utils/layer/filterAllFeatures";
import {styleIsochroneFeatures} from "../utils/styleIsochroneFeatures.js";
import {simplify} from "../../utils/geometry/simplify";
import {getFlatCoordinates} from "../../utils/geometry/getFlatCoordinates";
import {transformCoordinates} from "../utils/transformCoordinates";

export const methodConfig = {
    store: null
};
export default {
    /**
     * create isochrones features
     * @returns {void}
     */
    createIsochrones: async function () {
        this.clear();
        // TODO: Use store-method - see DistrictSelector component
        this.askUpdate = false;

        try {
            if (this.mode === "point" || this.mode === "facility") {
                await this.createIsochronesPoint();
            }
            else if (this.mode === "region") {
                await this.createIsochronesRegion();
            }
            else if (this.mode === "path") {
                await this.createBufferFromDirections();
            }
        }
        catch (err) {

            if (err.request_canceled) {
                return;
            }

            console.error(err);

            try {
                const code = (err.error || err).response.data.error.code;


                if (code === 3002 || code === 3099) {
                    this.showErrorInvalidInput();
                }
                else {
                    this.showError();
                }
            }
            catch (e) {
                console.error(e);
                this.showError();
            }
        }
    },
    /**
     * create isochrones features for selected several coordiantes
     * TODO: break apart into smaller functions
     * @fires Core#RadioRequestMapGetLayerByName
     * @fires OpenRouteService#RadioRequestOpenRouteServiceRequestIsochrones
     * @returns {void}
     */
    createIsochronesRegion: async function () {
        const allActiveFeatures = filterAllFeatures(this.selectedFacilityLayer, this.isFeatureActive),
            coordinates = this.getCoordinates(allActiveFeatures, this.setByFeature),
            {distance, maxDistance, minDistance, steps} = this.getDistances();

        if (
            coordinates !== null &&
            this.transportType !== "" &&
            this.scaleUnit !== "" &&
            distance !== 0
        ) {
            this.cleanup();

            const features = await this.getIsochrones({
                transportType: this.transportType,
                coordinates,
                scaleUnit: this.scaleUnit,
                distance,
                maxDistance,
                minDistance,
                baseUrl: this.baseUrl
            });

            // TODO: get locale from store
            this.setSteps(steps);
            this.setIsochroneFeatures(features);
            this.currentCoordinates = coordinates;
        }
        else {
            this.inputReminder();
        }
    },
    /**
     * TODO: see TODOs in createIsochronesRegion
     * create isochrones features for selected several coordiantes
     * @returns {void}
     */
    createIsochronesPoint: async function () {
        const
            {distance, maxDistance, minDistance, steps} = this.getDistances();

        if (
            this.coordinate.length > 0 &&
            this.transportType !== "" &&
            this.scaleUnit !== "" &&
            distance !== 0
        ) {
            const features = await this.getIsochrones({
                transportType: this.transportType,
                coordinates: this.coordinate,
                scaleUnit: this.scaleUnit,
                distance,
                maxDistance,
                minDistance,
                baseUrl: this.baseUrl
            });

            this.setSteps(steps);
            this.setRawGeoJson(await this.featureToGeoJson(features[0]));
            this.setIsochroneFeatures(features);
            this.showRequestButton = true;
            this.cleanup();
        }
        else {
            this.inputReminder();
        }
    },
    renderIsochrones (newFeatures) {
        this.mapLayer.getSource().clear();

        if (newFeatures.length === 0) {
            setBBoxToGeom.call(this, this.areaSelectorGeom || this.boundingGeometry);
            return;
        }

        styleIsochroneFeatures(newFeatures, this.isochroneColors);
        this.mapLayer.getSource().addFeatures(newFeatures);
        if (this.mode !== "region") {
            this.setIsochroneAsBbox();
        }
    },
    /**
     * add coordinate after user click
     * @param {event} clickCoordinate - The coordinate of the click event on the map.
     * @returns {void}
     */
    setCoordinateFromClick: function (clickCoordinate) {
        this.setCoordinate(transformCoordinates([clickCoordinate], this.projectionCode));
        this.setSetBySearch(false);
    },

    setCoordinateFromFeature: function (feature) {
        const simplifiedGeom = simplify(feature.getGeometry()),
            coordiantes = getFlatCoordinates(simplifiedGeom);

        this.setCoordinate(transformCoordinates(coordiantes, this.projectionCode));
    },

    createBufferFromDirections: function () {
        let bufferFeatures;
        const
            featureType = "Erreichbarkeit entlang einer Route",
            distance = parseFloat(this.distance) / 1000,
            steps = [distance, distance * 2 / 3, distance / 3],
            coords = this.selectedDirections?.lineString
                .map(pt => Proj.transform(pt, this.projectionCode, "EPSG:4326")),
            lineString = turfLineString(coords),
            buffer = turfFeatureCollection(steps.map(dist => turfBuffer(lineString, dist)));

        bufferFeatures = readFeatures(JSON.stringify(buffer));
        bufferFeatures = transformFeatures(bufferFeatures, "EPSG:4326", this.projectionCode);
        bufferFeatures.forEach((feature, i) => {
            feature.set("featureType", featureType);
            feature.set("value", steps[i]);
            feature.set("mode", this.transportType);
            feature.set("unit", this.scaleUnit);
        });

        this.setSteps([distance * 1000 / 3, distance * 2000 / 3, distance * 1000].map((n) => Number.isInteger(n) ? n.toLocaleString("de-DE") : n.toFixed(2)));
        this.setRawGeoJson(buffer);
        this.setIsochroneFeatures(bufferFeatures);
    },

    /**
     * TODO: replace calls to this function with /addons/cosi/utils/getSearchResultsCoordinate.js
     * @returns {void}
     */
    setSearchResultToOrigin: function () {
        const coord = getSearchResultsCoordinates();

        if (coord) {
            this.setCoordinate([Proj.transform(coord, this.projectionCode, "EPSG:4326")]);
            this.setClickCoordinate(coord);
            this.setSetBySearch(true);
        }
    },
    /**
     * reminds user to set inputs
     * @returns {void}
     */
    inputReminder: function () {
        this.addSingleAlert({
            category: "Info",
            content: "<strong>" + this.$t("additional:modules.tools.cosi.accessibilityAnalysis.inputReminder") + "</strong>",
            displayClass: "info"
        });
    },

    showError: function () {
        this.addSingleAlert({
            content: "<strong>" + this.$t("additional:modules.tools.cosi.accessibilityAnalysis.showError") + "</strong>",
            category: "Fehler",
            displayClass: "error"
        });
    },
    showErrorInvalidInput: function () {
        this.addSingleAlert({
            content: "<strong>" + this.$t("additional:modules.tools.cosi.accessibilityAnalysis.showErrorInvalidInput") + "</strong>",
            category: "Fehler",
            displayClass: "error"
        });
    },

    /**
     * sets facility layers' bbox as the isochrones
     * @fires Core.ConfigLoader#RadioRequestParserGetItemsByAttributes
     * @fires BboxSettor#RadioTriggerSetBboxGeometryToLayer
     * @returns {void}
     */
    setIsochroneAsBbox: function () {
        const polygonGeometry = this.isochroneFeatures[this.isochroneFeatures.length === 4 ? 1 : 0].getGeometry(),
            geometryCollection = new GeometryCollection([polygonGeometry]);

        setBBoxToGeom.call(this, geometryCollection);
    },

    /**
    * resets facility layers' bbox
    * @returns {void}
    */
    resetIsochroneBBox () {
        setBBoxToGeom.call(this, this.areaSelectorGeom || this.boundingGeometry);
    },
    /**
     * clears the component
     * @returns {void}
     */
    clear: function () {
        this.showRequestButton = false;
        this.setSteps([0, 0, 0]);
        this.setRawGeoJson(null);
        this.setIsochroneFeatures([]);
    },


    /**
     * Hides the current result without destroying it
     * @param {Boolean} v - the current val of "hide"
     * @returns {void}
     */
    hideResults (v) {
        if (v) {
            this.renderIsochrones([]);
            if (this.mode === "point") {
                this.removePointMarker();
            }
        }
        else {
            this.renderIsochrones(this._isochroneFeatures);
            if (this.mode === "point") {
                this.placingPointMarker(
                    Proj.transform(this.coordinate[0], "EPSG:4326", this.projectionCode)
                );
            }
        }
    },

    /**
     * gets the distance weighted by travel time index
     * @returns {{distance: Number, maxDistance: Number, minDistance: Number, steps: String[]}} distance with penalty and legend
     */
    getDistances: function () {
        const
            hasPenalty = this.useTravelTimeIndex && this.scaleUnit === "time" && this.transportType === "driving-car",
            penalty = this.travelTimeIndex[this.time] / Math.min(...Object.values(this.travelTimeIndex)),
            rawDistance = parseFloat(this.distance);
        let
            distance = rawDistance,
            maxDistance, minDistance,
            steps = [rawDistance / 3, rawDistance * 2 / 3, rawDistance].map(n => Number.isInteger(n) ? n.toLocaleString("de-DE") : n.toFixed(2));

        if (hasPenalty) {
            distance = rawDistance / penalty;
            maxDistance = rawDistance;
            minDistance = rawDistance / (Math.max(...Object.values(this.travelTimeIndex)) / Math.min(...Object.values(this.travelTimeIndex)));
            steps = [...steps, "max"];
        }

        return {distance, maxDistance, minDistance, steps};
    },
    // pull meta data for the dataset used for the analysis
    getMetadataSelectedData: async function () {
        // first find out what layer we are working with
        const selectedLayerModel = getModelByAttributes({
                name: this.selectedFacilityNames[0],
                type: "layer"
            }),
            // then get the matching metadata as promise
            metadata = await getRecordById(selectedLayerModel.get("datasets")[0].csw_url, selectedLayerModel.get("datasets")[0].md_id);

        return metadata;

    },

    getCoordinates: function (features, setByFeature) {
        if (Array.isArray(features) && features.length > 0) {
            return features
                .reduce((res, feature) => {
                    const geometry = feature.getGeometry();

                    if (geometry.getType() === "Point") {
                        return [...res, geometry.getCoordinates().splice(0, 2)];
                    }
                    if (setByFeature) {
                        return [...res, ...getFlatCoordinates(simplify(geometry, 10)) || [Extent.getCenter(geometry.getExtent())]];
                    }
                    return [...res, Extent.getCenter(geometry.getExtent())];

                }, []).map(coord => Proj.transform(coord, this.projectionCode, "EPSG:4326"));
        }
        return null;
    }
};
