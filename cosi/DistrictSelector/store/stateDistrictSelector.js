import MappingJson from "../../assets/mapping.json";

/**
 * User type definition
 * @typedef {Object} DistrictSelectorState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=true] - Deactivates the gfi if true (config-param).
 * @property {Object[]} districtLevels - All avaiable district levels (config-param).
 * @property {Number[]} extent - The extent of the selected districts.
 * @property {String} [icon="bi-image"] - Bootstrap icon class (config-param).
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
 * @property {String[]} selectedDistrictNames - All names of the selected districts.
 * @property {Object {String: String[]}} additionalInfoLayers - Additional Layers to display as guidance and information. Set as keys to display with lists of layerIds. (config-param).
 * @property {Number} [bufferValue=0] - A buffer for the extent of the selected district(s).
 */
const state = {
    active: false,
    deactivateGFI: true,
    districtLevels: [],
    extent: [],
    boundingGeometry: undefined,
    icon: "bi-image",
    id: "districtSelector",
    isVisibleInMenu: true,
    name: "Gebiet auswählen",
    renderToWindow: true,
    resizableWindow: false,
    selectedDistrictLevel: {},
    selectedDistrictLevelId: "",
    selectedDistrictsCollection: null,
    selectedDistrictNames: [],
    additionalInfoLayers: {},
    bufferValue: 0,
    loadend: false,
    mapping: null,
    mappingPath: undefined,
    mappingInit: MappingJson,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/018districtselector.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/018gebietsauswahl.md"
    },
    remoteMetadata: {} // after data is loaded, we also pull metadata remotely and store it here.
};

export default state;
