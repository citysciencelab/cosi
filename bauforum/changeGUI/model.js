import store from "../../../src/app-store";

const BauforumGUIModeler = Backbone.Model.extend(/** @lends BauforumGUIModeler.prototype */{
    defaults: {
        mainStreet: {},
        overviewURL: "",
        conceptId: null
    },

    /**
     * Initialize Model
     * @returns {void}
     */
    initialize: function () {
        const magistrale = this.getMagistraleFromParametricURL(),
            overviewURL = this.getOverviewURL();

        if (!magistrale) {
            console.error("Missing or invalid parameter for MAGISTRALE. Aborting bauforum.");
            return;
        }
        this.setMainStreet(Object.values(magistrale)[0]);
        this.setOverviewURL(overviewURL);
        this.triggerMapView(this.get("mainStreet"));
    },

    /**
     * Triggers center coordinates and zoomLevel to mapView with values from config.json
     * @param   {Object} mainStreetSettings Settings of Magistrale
     * @returns {void}
     */
    triggerMapView: function (mainStreetSettings) {
        Radio.trigger("MapView", "setCenter", mainStreetSettings.center, mainStreetSettings.zoomLevel);
    },

    /**
     * Investigates parametricURL for MAGISTRALE and returns it's value in config.json.
     * @returns {Object | null} Data for main street from config.json
     */
    getMagistraleFromParametricURL: function () {
        const urlParamValue = store.state.urlParams?.MAGISTRALE,
            knownMainStreets = Radio.request("Parser", "getPortalConfig").bauforumHackathon;

        if (urlParamValue && knownMainStreets && Object.prototype.hasOwnProperty.call(knownMainStreets, urlParamValue)) {
            return Radio.request("Util", "pick", knownMainStreets, [urlParamValue]);
        }

        return null;
    },

    /**
     * Returns bauforumOverviewPage from config.json
     * @fires Parser#RadioRequestParserGetPortalConfig
     * @returns {string} url URL configured in config.json as overview page
     */
    getOverviewURL: function () {
        return Radio.request("Parser", "getPortalConfig").bauforumOverviewPage;
    },

    /**
     * Toggles the Stadtmodell according to value
     * @param   {boolean} value layer visibility to set
     * @returns {void}
     */
    toggleStadtmodell: function (value) {
        const layer = Radio.request("ModelList", "getModelByAttributes", {name: "Gebäude LoD2"});

        layer.setIsVisibleInMap(value);
    },

    /**
     * Setter for mainStreet
     * @param {string} mainStreet mainStreet
     * @returns {void}
     */
    setMainStreet: function (mainStreet) {
        this.set("mainStreet", mainStreet);
    },

    /**
     * Setter for overviewURL
     * @param {string} url URL
     * @returns {void}
     */
    setOverviewURL: function (url) {
        this.set("overviewURL", url);
    },

    /**
     * Setter for conceptId
     * @param {string} value conceptId
     * @returns {void}
     */
    setConceptId: function (value) {
        this.set("conceptId", value);
    }
});

export default new BauforumGUIModeler();
