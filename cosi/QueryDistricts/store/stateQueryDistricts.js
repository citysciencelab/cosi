/**
 * User type definition
 * @typedef {object} QueryDistricts
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
 * @property {string} [icon="bi-binoculars"] icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 */
const state = {
    active: false,
    id: "QueryDistricts",
    // defaults for config.json parameters
    name: "QueryDistricts",
    icon: "bi-shuffle",
    renderToWindow: true,
    resizableWindow: false,
    isVisibleInMenu: true,
    deactivateGFI: true,
    referenceLayers: [{"id": "15563"}, {"id": "15990"}, {"id": "19041"}, {"id": "19034"}, {"id": "18977"}, {"id": "18970"}],
    propertiesMap: {},
    dataSets: [{
        inputs: {
            selectedDistrict: "",
            layerFilterModels: [],
            selectedLayer: "",
            resultTableHeaders: []
        },
        results: []
    }],
    activeSet: 0,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/004querydistricts.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/004vergleichbaregebieteermitteln.md"
    }
};

export default state;
