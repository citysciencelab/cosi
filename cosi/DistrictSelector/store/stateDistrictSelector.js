/**
 * User type definition
 * @typedef {Object} DistrictSelectorState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=true] - Deactivates the gfi if true (config-param).
 * @property {Object[]} districtLevels - All avaiable district levels (config-param).
 * @property {Number[]} extent - The extent of the selected districts.
 * @property {String} [glyphicon="glyphicon-screenshot"] - Bootstrap glyphicon class (config-param).
 * @property {String} id - The id of the district selector component.
 * @property {String} [name=Gebiet auswählen] - The name of the tool (config-param).
 * @property {Boolean} [renderToWindow=true] - Renders tool in a window if true, otherwise in the sidebar (config-param).
 * @property {Boolean} [resizableWindow=false] - If True, window is resizable (config-param).
 * @property {Object} selectedDistrictLevel - The selected district level.
 * @property {String} selectedDistrictLevel.layerId - The id of the layer that belongs to the district level.
 * @property {String} selectedDistrictLevel.label - The label of the district level (e.g. "Statistische Gebiete" or "Stadtteile")
 * @property {String} selectedDistrictLevel.keyOfAttrName - The key for the attribute "name" of the selected district layer.
 * @property {String} selectedDistrictLevel.keyOfAttrNameStats - The key for the attribute "name" of the regional statistical data layer.
 * @property {module:ol/Collection} selectedDistrictsCollection - All districts of the current district level.
 */
const state = {
    active: false,
    deactivateGFI: true,
    districtLevels: [],
    extent: [],
    boundingGeometry: undefined,
    glyphicon: "glyphicon-screenshot",
    id: "districtSelector",
    isVisibleInMenu: true,
    name: "Gebiet auswählen",
    renderToWindow: true,
    resizableWindow: false,
    selectedDistrictLevel: {},
    selectedDistrictsCollection: []
};

export default state;