import crs from "@masterportal/masterportalapi/src/crs";
import getProxyUrl from "../../../src/utils/getProxyUrl";

const actions = {
    /**
    * InitObliqueView creates a click listener at the map. Creates a listener at the olMap in the oblique application when the oblique aerial images have been moved in the sidebar.
    * Removes unwanted html elements once the iframe content has been loaded.
    * Sets the special MapMarker style for the oblique map
    * @param {Object} param store context
    * @param {Object} param.commit the commit
    * @param {Object} param.dispatch the dispatch
    * @param {Object} param.getters the getters
    * @param {Object} param.rootGetters the rootGetters
    * @returns {void}
    */
    initObliqueView ({commit, dispatch, getters, rootGetters}) {
        const iframe = document.getElementById("obliqueIframe");

        iframe?.addEventListener("load", () => {
            const observer = new MutationObserver(() => {
                const header = iframe.contentWindow.document.getElementById("header"),
                    mapMenu = iframe.contentWindow.document.getElementsByClassName("vcm-btn-icon single-first maptool-btn vcm-btn-base-default vcm-btn-base-splash-hover vcm-border vcm-border-dye03 vcm-btn-icon-font-default vcm-btn-icon-font-dye01-hover vcm-no-select vcm-btn-map-Oblique")[0],
                    overviewMap = iframe.contentWindow.document.getElementsByClassName("overview-map-wrap")[0],
                    vcs = document.getElementById("obliqueIframe").contentWindow.vcs,
                    map = vcs.vcm.Framework.getInstance().getActiveMap(),
                    pixelCoordinate = mapCollection.getMap("2D").getPixelFromCoordinate(rootGetters["Maps/initialCenter"]),
                    mapElements = iframe.contentWindow.document.getElementsByClassName("mapElement vcm-map-top");


                commit("Maps/setClickCartesianCoordinate", pixelCoordinate, {root: true});

                if (map) {
                    map.olMap.on("moveend", () => {
                        const transformedCooridnates = crs.transform("EPSG:4326", mapCollection.getMapView("2D").getProjection().getCode(), map.getViewPointSync().groundPosition);

                        transformedCooridnates.every((coordinate, index) => {
                            if (Math.round(coordinate) !== Math.round(getters.lastCoordinates[index]) && (coordinate - getters.lastCoordinates[index] > 50 || coordinate - getters.lastCoordinates[index] < -50)) {
                                dispatch("setObliqueView", transformedCooridnates);
                                return false;
                            }
                            return true;
                        });
                    });

                    map.imageChanged.addEventListener(async () => {
                        const viewPoint = await map.getViewPoint();

                        if (viewPoint.heading !== getters.heading) {
                            dispatch("MapMarker/rotatePointMarker", viewPoint.heading, {root: true});
                        }
                        commit("setHeading", viewPoint.heading);
                    });
                }

                if (header) {
                    header.style.display = "none";
                    header.parentElement.style.display = "none";

                    for (const element of mapElements) {
                        element.style.top = 0;
                    }

                    commit("setDefaultMapMarkerStyleId", rootGetters["MapMarker/pointStyleId"]);
                    if (getters.styleId) {
                        commit("MapMarker/setPointStyleId", getters.styleId, {root: true});
                    }
                    dispatch("setObliqueView", rootGetters["Maps/center"]);
                    observer.disconnect();
                }
                if (mapMenu) {
                    mapMenu.style.display = "none";
                }
                if (overviewMap) {
                    overviewMap.style.display = "none";
                }
            });

            observer.observe(iframe.contentDocument, {
                childList: true,
                subtree: true
            });
        });
    },

    /**
    * Unregister the map listener. Resets the mapMarker style. Removes the MapMarker.
    * @param {Object} param store context
    * @param {Object} param.commit the commit
    * @param {Object} param.dispatch the dispatch
    * @param {Object} param.getters the getters
    * @returns {void}
    */
    resetObliqueViewer ({commit, dispatch, getters}) {
        commit("MapMarker/setPointStyleId", getters.defaultMapMarkerStyleId, {root: true});
        dispatch("MapMarker/removePointMarker", null, {root: true});
    },

    /**
    * SetObliqueView moves the map marker to the click position and centers the oblique aerial images at the point in the sidebar.
    * @param {Object} param store context
    * @param {Object} param.commit the commit
    * @param {Object} param.dispatch the dispatch
    * @param {Object} param.getters the getters
    * @param {Array} coordinate the click/center coordinate
    * @returns {void}
    */
    async setObliqueView ({commit, dispatch, getters}, coordinate = []) {
        const vcs = document.getElementById("obliqueIframe")?.contentWindow?.vcs,
            framework = vcs?.vcm?.Framework?.getInstance(),
            map = framework?.getActiveMap();
        let viewPoint = {};

        if (framework && coordinate && Array.isArray(coordinate) && coordinate.length > 1) {
            commit("setLastCoordinates", coordinate);
            if (vcs?.vcm?.util) {
                viewPoint = new vcs.vcm.util.ViewPoint({
                    groundPosition: crs.transform(mapCollection.getMapView("2D").getProjection().getCode(), "EPSG:4326", coordinate),
                    heading: getters.heading,
                    distance: map.getViewPointSync().distance
                });
            }

            await framework?.getActiveMap().gotoViewPoint(viewPoint);

            dispatch("MapMarker/placingPointMarker", coordinate, {root: true});
            dispatch("MapMarker/rotatePointMarker", getters.heading, {root: true});
        }
        else {
            dispatch("Alerting/addSingleAlert",
                "<strong>" + i18next.t("additional:modules.tools.vcOblique.frameworkUndefined") + "</strong>"
                + "<br>"
                + "<small>" + i18next.t("additional:modules.tools.vcOblique.frameworkUndefinedMessage") + "</small>",
                {root: true}
            );
        }
    },
    /**
    * SetObliqueViewerURL gets the initaialCenter coordinate and creates the URL for the Oblique Map.
    * @param {Object} param store context
    * @param {Object} param.commit the commit
    * @param {Object} param.dispatch the dispatch
    * @param {Object} param.getters the getters
    * @param {Object} param.rootGetters the rootGetters
    * @param {Number[]} initialCenter the initial center coordinate
    * @returns {void}
    */
    setObliqueViewerURL ({commit, dispatch, getters, rootGetters}, initialCenter) {
        if (initialCenter && Array.isArray(initialCenter) && initialCenter.length > 1) {
            const transformedCoordinates = crs.transform(mapCollection.getMapView("2D").getProjection().getCode(), "EPSG:4326", initialCenter),
                startCoordinates = transformedCoordinates[0] + ", " + transformedCoordinates[1];

            if (document.location.hostname === "localhost") {
                commit("setObliqueViewerURL", getProxyUrl(rootGetters.getRestServiceById(getters.serviceId).url) + "?groundPosition=" + startCoordinates);
            }
            else {
                dispatch("setObliqueViewerURLWithSameHostname", startCoordinates);
            }
        }
    },

    /**
     * Checks if the oblique viewer URL and called website have the same origin (hostname) and sets the URL in the state.
     * Different ports will be handled as same origin.
     * Difference only in `www.` is handled separately.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @param {String} startCoordinates The start coordinates
     * @returns {void}
     */
    setObliqueViewerURLWithSameHostname ({commit, dispatch, getters, rootGetters}, startCoordinates) {
        const serviceUrl = rootGetters.getRestServiceById(getters.serviceId).url,
            serviceOrigin = new URL(serviceUrl),
            currentOrigin = new URL(document.location.href);

        if (serviceOrigin.hostname === currentOrigin.hostname) {
            commit("setObliqueViewerURL", serviceUrl + "?groundPosition=" + startCoordinates);
        }
        else if (document.location.hostname.startsWith("www.") && document.location.hostname.split("www.")[1] === serviceOrigin.hostname) {
            dispatch("setObliqueViewerURLWithReplacedHostname", {urlParts: serviceOrigin.pathname, startCoordinates});
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("additional:modules.tools.vcOblique.sameOrigin"), {root: true});
        }
    },

    /**
     * Replaces the hostname of the oblique viewer url with the one of the called portal and sets it in state.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {String} payload The payload
     * @param {String[]} payload.urlParts The parts of the url.
     * @param {String} payload.startCoordinates The start coordinates
     * @returns {void}
     */
    setObliqueViewerURLWithReplacedHostname ({commit}, {urlParts, startCoordinates}) {
        let changedUrl = "https:/";

        urlParts.forEach((part, index) => {
            if (index === 0) {
                changedUrl = changedUrl + "/" + document.location.hostname;
            }
            else {
                changedUrl = changedUrl + "/" + part;
            }
        });

        commit("setObliqueViewerURL", changedUrl + "?groundPosition=" + startCoordinates);
    }

};

export default actions;
