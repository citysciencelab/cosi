/**
 * User type definition
 * @typedef {object} ColorCodeMapState
 * @property {boolean} active if true, VueAddon will rendered
 * @property {string} id id of the VueAddon component
 * @property {string} name displayed as title (config-param)
 * @property {string} icon icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @todo the rest
 */
const state = {
    active: false,
    id: "ColorCodeMap",
    // defaults for config.json parameters
    name: "ColorCodeMap",
    icon: "bi-map",
    renderToWindow: false,
    resizableWindow: false,
    isVisibleInMenu: false,
    deactivateGFI: false,
    minimized: true,
    yearSelector: "jahr_",
    colorScheme: "interpolateBlues",
    visualizationState: false,
    showMapNames: false,
    playState: false,
    selectedFeature: "",
    selectedYear: null,
    chart: false,
    upperEdge: 80,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/019colorcodemap.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/019kartenvisualisierung.md",
        "en": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/019colorcodemap.md",
        "de": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/019kartenvisualisierung.md"
    }
};

export default state;
