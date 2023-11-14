/**
 * User type definition
 * @typedef {Object} MapState
 * @property {Boolean} active - if true, Boris will be rendered
 * @property {String} id - id of Boris component
 * @property {String} name - displayed as the title
 * @property {String} icon - icon next to the title
 * @property {Boolean} renderToWindow - if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow - if true, window is resizable (config-param)
 * @property {Number} initialWidth: Initial width the sidebar when opening
 * @property {Number} initialWidthMobile: Initial mobile width of the sidebar when opening
 * @property {Boolean} keepOpen: attribute that enables keeping the BORIS component open while opening another tool
 * @property {Boolean} isVisibleInMenu - if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI - flag if tool should deactivate gfi (config-param)
 * @property {Object} filteredLayerList - list of wms layers without the stripes layers
 * @property {Boolean} isAreaLayer - true if it is a polygon layer, then stripes layer can be toggled (true/false)
 * @property {Boolean} isStripesLayer - true or false if stripes layer is turned on or off
 * @property {String} selectedLayer - one selected wms layer from filteredLayerList
 * @property {String} selectedLayerName - the name of the selectedLayer: e.g. 31.12.2020
 * @property {Object} textIds - list of ids for the infotext-toggle
 * @property {Object} selectedPolygon - selected polygon after click on map
 * @property {String} selectedLanduse - selected option from landuse select
 * @property {Object} selectedBrwFeature - selected brwFeature from the list by year/date
 * @property {Object} brwFeatures - list of brwFeatures over multiple years on a clicked element
 * @property {String} convertedBrw - converted brw value with a comma instead of point (e.g. 6,7€)
 * @property {Boolean} isProcessFromParametricUrl - true if paremetric URL is being used
 * @property {Object} paramUrlParams - parameters that are used to center map and select relevant options to display data
 * @property {String} buttonValue - html value of button that indicates which further information are displayed
 * @property {Object} buildingDesigns - list of building designs that are options for the conversion to individual property
 * @property {Object} positionsToStreet - list of positions to streets that are options for the conversion to individual property
 * @property {String} selectedBuildingDesign - is the selected option of building designs
 * @property {String} selectedPositionToStreet - is the selected option of positions to street
 * @property {String} wpsId - the id of the used web processing service
 * @property {String} fmwProcess - the FME process triggered via the WPS
 */


const state = {
    active: false,
    id: "boris",
    name: "common:menu.tools.boris",
    icon: "bi-vinyl",
    renderToWindow: false,
    resizableWindow: true,
    initialWidth: 520,
    initialWidthMobile: 240,
    keepOpen: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    filteredLayerList: [],
    isAreaLayer: true,
    isStripesLayer: false,
    selectedLayer: null,
    selectedLayerName: "01.01.2022",
    textIds: [],
    selectedPolygon: null,
    selectedLanduse: "",
    selectedBrwFeature: {},
    brwFeatures: [],
    convertedBrw: "",
    isProcessFromParametricUrl: false,
    paramUrlParams: {},
    buttonValue: "info",
    buildingDesigns: [
        "eh Einzelhaus (freistehend)", "dh Doppelhaushälfte", " dd Doppelhaus (ganzes Doppelhaus)",
        "rm Reihenmittelhaus", "re Reihenendhaus", "g geschlossene Bauweise",
        "a abweichende Bauweise (Gartenhofhaus)"
    ],
    positionsToStreet: [
        "F Frontlage", "E Ecklage", "P Pfeifenstielgrundstück",
        "H Hinterlage (in 2. Reihe durch Wegerecht erschlossen)"
    ],
    selectedBuildDesign: "eh Einzelhaus (freistehend)",
    selectedPositionToStreet: "F Frontlage",
    wpsId: "1001",
    fmwProcess: "BRWConvert.fmw"
};

export default state;


