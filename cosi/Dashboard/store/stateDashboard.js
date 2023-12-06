/**
 * User type definition
 * @typedef {Object} DashboardState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=true] - Deactivates the gfi if true (config-param).
 * @property {String} [icon="bi-speedometer"] - Bootstrap icon class (config-param).
 * @property {String} id - The id of the district selector component.
 * @property {String} [name="Dashboard"] - The name of the tool (config-param).
 * @property {Boolean} [renderToWindow=true] - Renders tool in a window if true, otherwise in the sidebar (config-param).
 * @property {Boolean} [resizableWindow=false] - If True, window is resizable (config-param).
 * @property {object} toolBridgeIn: {settings: {}, type: "", outputCallback: ()=>{}} accepts settings from toolBridge (must have a *watcher*)
 * @property {object} toolBridgeOut: {}  pass current settings to toolBridge (must have a *getter*)
 * @property {String} prefixExportFilename - The prefix of exported file name.
 * @property {Object} columnHeader - The column header object
 */
const state = {
    active: false,
    deactivateGFI: false,
    icon: "bi-speedometer",
    id: "dashboard",
    isVisibleInMenu: true,
    name: "Dashboard",
    renderToWindow: false,
    resizableWindow: true,
    excludedPropsForExport: ["visualized", "expanded", "years", "groupIndex"],
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/016statistischedatenuebersicht.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/016statistischedatenuebersicht.md"
    },
    statsFeatureFilter: [],
    calculations: [],
    reportTemplateMode: null,
    // these two variables are required to make this addon compatible with the toolBridge addon (for details see toolBridge documentation)
    toolBridgeIn: {settings: {}, type: "", outputCallback: null}, // accepts settings from toolBridge - must have a *watcher*
    toolBridgeOut: {}, // pass current settings to toolBridge - must have a *getter*,
    prefixExportFilename: "CoSI",
    columnHeader: {},
    ignoreColumnsByExport: false
};

export default state;
