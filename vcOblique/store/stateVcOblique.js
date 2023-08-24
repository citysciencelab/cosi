/**
 * User type definition
 * @typedef {Object} vcObliqueState
 * @property {Boolean} active if true, viewer will rendered
 * @property {String} id id of the viewer component
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {String} styleId style.json id to style the mapMarker (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {Number} initialWidth initial width of the sidebar
 * @property {String} lastCoordinates contains the last coordinates of the map click
 * @property {String} defaultMapMarkerStyleId contains the default styleId of the mapMarker
 * @property {String} heading contains the heading of the oblique viewer
 * @property {String} serviceId contains the id of the oblique viewer from the rest-services.json
 * @property {String} dataYear the year of the datasource shown
 * */

const state = {
    active: false,
    id: "vcOblique",
    name: "additional:menu.tools.obliqueViewer",
    icon: "bi-camera-fill",
    styleId: "",
    renderToWindow: false,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true,
    initialWidth: 500,
    obliqueViewerURL: "",
    lastCoordinates: "",
    defaultMapMarkerStyleId: "",
    heading: 0,
    serviceId: "oblique",
    dataYear: ""
};

export default state;
