/**
 * SchoolRoutePlanning tool state definition.
 * @typedef {Object} SchoolRoutePlanningState
 * @property {String} id id of the SchoolRoutePlanning component.
 * @property {Boolean} active if true, SchoolRoutePlanning will be rendered.
 * @property {String} name Displayed as the title.
 * @property {String} icon Icon next to the title.
 * @property {String} layerId The if of the wfs service that contains the schools.
 * @property {String} serviceId The id of the gazetteer service.
 * @property {String} wpsId The id of the used web processing service.
 * @property {Object} wpsTimeout Timeout parameters for the wps.
 * @property {String} fmwProcess FME process triggered via the WPS.
 * @property {Boolean} renderToWindow If true, tool is rendered in a window, else in the sidebar.
 * @property {Boolean} resizableWindow Specifies whether the window should be resizable.
 * @property {Boolean} deactivateGFI Specifies whether the gfi should be disabled when this tool is opened.
 * @property {Number} initialWidth Size of the sidebar when opening.
 * @property {Number} initialWidthMobile Mobile size of the sidebar when opening.
 * @property {String} layerName Name of the VectorLayer for the route elements.
 * @property {Number} printDpi The dpi for the printing.
 * @property {String} printLayout Layout for printing.
 * @property {String} printOutputFormat Format for the printing.
 * @property {String} printTitle Title for the printing.
 * @property {String[]} toggleLayers Layers that can be switched on and off via the toggle button.
 * @property {String} inputAddress The input address.
 * @property {Object[]} schools The available schools.
 * @property {String[]} streetNames The searched street names
 * @property {Object[]} houseNumbers The house numbers for the searched streets.
 * @property {Object[]} filteredHouseNumbers The filtered house numbers for the input address.
 * @property {String} regionalPrimarySchoolNumber The number of the regional primary school.
 * @property {String} regionalPrimarySchoolName The name of the regional primary school.
 * @property {ol/Feature} selectedSchool The selected school as feature.
 * @property {String} selectedSchoolNumber The number of selected school.
 * @property {String} selectedAddress The selected address.
 * @property {String} initialSelectedSchoolNumber The number of initialize selected school.
 * @property {String[]} routeDescription The route description.
 * @property {ol/Geometry} routeGeometry The geometry of the route.
 * @property {Object} routeElements the route elements.
 * @property {String} routeLength The route length in meter.
 */
const state = {
    id: "schoolRoutePlanning",
    active: false,
    name: "additional:modules.tools.schoolRoutePlanning.title",
    icon: "bi-signpost",
    layerId: "8712",
    serviceId: "8",
    wpsId: "1001",
    wpsTimeout: "",
    fmwProcess: "schulwegrouting_portal.fmw",
    renderToWindow: false,
    resizableWindow: true,
    deactivateGFI: false,
    initialWidth: 500,
    initialWidthMobile: 300,
    layerName: "school_route_layer",
    printDpi: 200,
    printLayout: "A4 Hochformat",
    printOutputFormat: "pdf",
    printTitle: "Schulwegrouting",
    toggleLayers: [
        "1935geofox-bus",
        "1935geofox_BusName",
        "1935geofox-bahn",
        "1935geofox_Faehre",
        "1933geofox_stations"
    ],

    inputAddress: "",
    schools: [],
    streetNames: [],
    houseNumbers: [],
    filteredHouseNumbers: [],

    regionalPrimarySchoolNumber: null,
    regionalPrimarySchoolName: null,
    selectedSchool: null,
    selectedSchoolNumber: "",
    selectedAddress: "",
    initialSelectedSchoolNumber: "",

    routeDescription: [],
    routeElements: {},
    routeGeometry: null,
    routeLength: null
};

export default state;
