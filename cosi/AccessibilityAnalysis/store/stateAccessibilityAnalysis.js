/**
 * User type definition
 * @typedef {object} VueAddonState
 * @property {boolean} active if true, VueAddon will rendered
 * @property {string} id id of the VueAddon component
 * @property {module:ol/interaction/Pointer} selectPointerMove contains interaction listener to map
 * @property {object[]} projections list of available projections
 * @property {object} mapProjection projection of the map
 * @property {number[]} positionMapProjection position of the projection in the map
 * @property {boolean} updatePosition if true, position is updated in tool
 * @property {string} currentProjectionName name of the current projection
 * @property {object} currentProjection the current projection
 * @property {string} currentSelection currently selected projection value
 * @property {string} coordinatesEastingField label of the easting field
 * @property {string} coordinatesNorthingField label of the northing field
 * @property {string} name displayed as title (config-param)
 * @property {string} icon icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {object} toolBridgeIn: {settings: {}, type: "", outputCallback: ()=>{}} accepts settings from toolBridge (must have a *watcher*)
 * @property {object} toolBridgeOut: {}  pass current settings to toolBridge (must have a *getter*)
 */
const state = {
    active: false,
    id: "AccessibilityAnalysis",
    // defaults for config.json parameters
    name: "Accessibility Analysis",
    icon: "bi-geo",
    renderToWindow: true,
    resizableWindow: false,
    isVisibleInMenu: true,
    deactivateGFI: true,
    availableModes: [
        {
            type: "point",
            text: "Erreichbarkeit ab einem Referenzpunkt"
        },
        {
            type: "region",
            text: "Erreichbarkeit der ausgewählten Einrichtungen"
        },
        {
            type: "path",
            text: "Erreichbarkeit entlang einer Route"
        }
    ],
    rawGeoJson: null,
    isochroneFeatures: [],
    mode: "point",
    coordinate: [],
    clickCoordinate: null,
    selectedFacilityName: null,
    selectedDirections: null,
    setByFeature: false,
    setBySearch: false,
    useTravelTimeIndex: true,
    transportType: "",
    scaleUnit: "",
    distance: "",
    time: 9,
    steps: [0, 0, 0],
    dataSets: [],
    activeSet: 0,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/cosi-prod/cosi/manuals/accessibilityanalysis.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/cosi-prod/cosi/manuals/erreichbarkeitsanalyse.md"
    },
    // these two variables are required to make this addon compatible with the toolBridge addon (for details see toolBridge documentation)
    toolBridgeIn: {settings: {}, type: "", outputCallback: null}, // accepts settings from toolBridge - must have a *watcher*
    toolBridgeOut: {}// pass current settings to toolBridge - must have a *getter
};

export default state;
