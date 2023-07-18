/**
 * User type definition
 * @typedef {Object} FeaturesListState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=false] - Deactivates the gfi if true (config-param).
 * @property {String} [icon="bi-apple"] - Bootstrap icon class (config-param).
 * @property {String} id - The id of the district selector component.
 * @property {String} [name=Einrichtungsübersicht] - The name of the tool (config-param).
 * @property {Boolean} [renderToWindow=true] - Renders tool in a window if true, otherwise in the sidebar (config-param).
 * @property {Boolean} [resizableWindow=false] - If True, window is resizable (config-param).
 */
const state = {
    active: false,
    deactivateGFI: false,
    icon: "bi-pencil-square",
    id: "polygonStyler",
    isVisibleInMenu: true,
    name: "Flächen Stylen",
    renderToWindow: false,
    resizableWindow: true
};

export default state;
