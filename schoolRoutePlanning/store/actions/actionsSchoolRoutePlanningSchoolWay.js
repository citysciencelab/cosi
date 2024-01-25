import WPS from "../../../../src/api/wps";
import LoaderOverlay from "../../../../src/utils/loaderOverlay";
import thousandsSeparator from "../../../../src/utils/thousandsSeparator";

import {MultiLineString} from "ol/geom.js";
import {WKT} from "ol/format.js";

export default {
    /** Select the school from school list and adds to the schoolway vector layer.
     * @param {Object} context The vuex context.
     * @param {Object} payload The payload for select school.
     * @param {Object} payload.selectedSchoolId The selected school id.
     * @param {ol/vectorLayer} payload.layer The vector layer for schoolway features.
     * @returns {void}
     */
    selectSchool ({state, commit, dispatch}, payload) {
        const selectedHouseNumber = state.houseNumbers.find(houseNumber => houseNumber.name.toLowerCase() === state.inputAddress.toLowerCase()),
            selectedSchoolId = payload.selectedSchoolId;

        if (selectedSchoolId) {
            const selectedSchool = state.schools.find(school => school.get("schul_id") === selectedSchoolId);

            commit("setSelectedSchool", selectedSchool);
            dispatch("setGeometryByFeatureId", {
                id: "endPoint",
                source: payload.layer.getSource(),
                geometry: selectedSchool?.getGeometry() || []
            });

            if (selectedHouseNumber) {
                dispatch("prepareWayToSchoolRequest", {selectedHouseNumber, selectedSchoolId});
            }
        }
    },

    /**
     * Builds the payload for wps to request the schoolway.
     * @param {Object} context The vuex context.
     * @param {Object} payload The payload for select school.
     * @param {Object} payload.selectedHouseNumber The selected house number of the student.
     * @param {Object} payload.selectedSchoolId The selected school id.
     * @returns {void}
     */
    prepareWayToSchoolRequest ({state, commit, dispatch}, payload) {
        let wpsPayload = {
            "Schul-ID": {
                "dataType": "string",
                "value": payload.selectedSchoolId
            },
            "SchuelerStrasse": {
                "dataType": "string",
                "value": state.streetNames[0]
            },
            "SchuelerHausnr": {
                "dataType": "integer",
                "value": parseInt(payload.selectedHouseNumber?.properties?.hausnummer._, 10)
            },
            "SchuelerZusatz": {
                "dataType": "string",
                "value": payload.selectedHouseNumber?.properties?.hausnummernzusatz?._ || ""
            },
            "RouteAusgeben": {
                "dataType": "boolean",
                "value": 1
            }
        };

        if (state.wpsTimeout && Object.keys(state.wpsTimeout).length > 0) {
            wpsPayload = Object.assign(wpsPayload, state.wpsTimeout);
        }

        commit("setSelectedAddress", state.inputAddress);
        dispatch("requestWayToSchool", wpsPayload);
    },

    /**
     * Request the  schoolway from trhough a wps.
     * @param {Object} context The vuex context.
     * @param {Object} wpsPayload The payload for the wps  that contains data to student and school.
     * @returns {void}
     */
    requestWayToSchool ({state, dispatch}, wpsPayload) {
        LoaderOverlay.show();
        WPS.wpsRequest(
            state.wpsId,
            state.fmwProcess,
            wpsPayload,
            (response, status) => dispatch("parseResponseWayToSchool", {response, status}),
            50000
        );

    },

    /**
     * Parses the schoolway response data of the wps.
     * @param {Object} context The vuex context.
     * @param {Object} payload The schoolway response data.
     * @returns {void}
     */
    parseResponseWayToSchool ({dispatch}, payload) {
        LoaderOverlay.hide();
        const routeElements = payload?.response?.ExecuteResponse?.ProcessOutputs?.Output?.Data?.ComplexData?.Schulweg?.Ergebnis;

        if (routeElements === undefined) {
            dispatch("Alerting/addSingleAlert", i18next.t("additional:modules.tools.schoolRoutePlanning.responseError", {
                errorMessage: payload?.response?.ExecuteResponse?.ProcessOutputs?.Output?.Data?.ComplexData?.serviceResponse?.statusInfo?.message
                    || payload?.response?.ExecuteResponse?.Status?.ProcessFailed?.ExceptionReport?.Exception?.ExceptionText
            }), {root: true});
        }
        else if (payload.status === 200 && routeElements?.ErrorOccured === "no") {
            dispatch("parseRouteElements", routeElements);

        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("additional:modules.tools.schoolRoutePlanning.wpsError", {status: routeElements.status}), {root: true});
        }
    },

    /**
     * Parse the route elements and start parse route.
     * @param {Object} context The vuex context.
     * @param {Object} routeElements The route elements of the schoolway.
     * @returns {void}
     */
    parseRouteElements ({commit, dispatch}, routeElements) {
        const routeDescription = routeElements.routenbeschreibung.part,
            routeEdges = routeElements.route.edge;

        commit("setRouteElements", routeElements);
        commit("setRouteDescription", Array.isArray(routeDescription) ? routeDescription : [routeDescription]);
        commit("setRouteLength", thousandsSeparator(routeElements.kuerzesteStrecke) + "m");
        dispatch("parseRoute", Array.isArray(routeEdges) ? routeEdges : [routeEdges]);
    },

    /**
     * Creates one MultiLineString geometry from the routing parts.
     * @param {Object} context The vuex context.
     * @param {Object[]} routeEdges The routing edges including wkt geometry
     * @returns {void}
     */
    parseRoute ({commit}, routeEdges) {
        const wktParser = new WKT(),
            lineStringArray = [];
        let multiLineString = "";

        routeEdges.forEach(routePart => {
            lineStringArray.push(wktParser.readGeometry(routePart.wkt));
        });
        multiLineString = new MultiLineString(lineStringArray);

        commit("setRouteGeometry", multiLineString);
    }
};
