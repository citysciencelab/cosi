/**
 * User type definition
 * @typedef {Object} StreetSmartState
 * @property {Boolean} active if true, viewer will rendered
 * @property {String} id id of the viewer component
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {Number} initialWidth initial width of the sidebar
 * @property {String} serviceId id of the rest-service that provides the panorama pictures
 * @property {String} streetsmartAPIVersion version of the streetsmartAPI to load
 * @property {Boolean} timeTravelVisible enables timeTravel in panoramaViewer
 * @property {Boolean} toggle3DCursor toggles the visibility of the 3D cursor in the PanoramaViewer
 * @property {Boolean} toggleAddressesVisible toggles the visibility of addresses
 * @property {String} reactVersion version of react to load
 * @property {Array} lastCoordinates the last clicked coordinates
 * @property {Number} lastYaw the last recorded yaw
 */

const state = {
    active: false,
    id: "streetsmart",
    name: "additional:menu.tools.streetsmart",
    icon: "bi-camera-fill",
    renderToWindow: false,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    initialWidth: 500,
    supportedMapModes: ["2D"],
    serviceId: "streetsmart",
    streetsmartAPIVersion: "22.2",
    reactVersion: "16.12.0",
    timeTravelVisible: false,
    toggle3DCursor: false,
    toggleAddressesVisible: false,
    cycloLayerID: null,
    styleId: "defaultMapMarkerPoint",
    mapMarkerStyleId: "defaultMapMarkerPoint",
    lastCoordinates: [],
    lastYaw: 0
};

export default state;
