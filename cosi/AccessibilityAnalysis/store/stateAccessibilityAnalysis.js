/**
 * User type definition
 * @typedef {object} VueAddonState
 * @property {boolean} active if true, VueAddon will rendered
 * @property {string} id id of the VueAddon component
 * @property {string} name displayed as title (config-param)
 * @property {string} icon icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {String[]} isochroneColors - colors for the isochrone features.
 * @property {String} selectedFacility - The name of the selected feature in facility mode.
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
    rawGeoJson: null,
    isochroneFeatures: [],
    isochroneColors: undefined,
    mode: "point",
    coordinate: [],
    clickCoordinate: null,
    selectedFacilityNames: null,
    selectedFacility: undefined,
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
    metaData: null,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/020accessibilityanalysis.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/020erreichbarkeitsanalyse.md"
    },
    // these two variables are required to make this addon compatible with the toolBridge addon (for details see toolBridge documentation)
    toolBridgeIn: {settings: {}, type: "", outputCallback: null}, // accepts settings from toolBridge - must have a *watcher*
    toolBridgeOut: {}// pass current settings to toolBridge - must have a *getter
};

export default state;
