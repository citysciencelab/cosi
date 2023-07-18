/**
 * User type definition
 * @typedef {Object} MietenspiegelFormularState
 * @property {Boolean} active - If true, MietenspiegelFormular will rendered.
 * @property {String} id - Id of the MietenspiegelFormular component.
 * @property {String} name - Displayed as title.
 * @property {String} icon - Icon next to title.
 * @property {Boolean} renderToWindow - If true, tool is rendered in a window, else in sidebar.
 * @property {Boolean} resizableWindow - If true, window is resizable.
 * @property {Boolean} isVisibleInMenu - If true, tool is selectable in menu.
 * @property {Boolean} deactivateGFI - Flag if tool should deactivate gfi.
 */
const state = {
    active: false,
    id: "mietenspiegelformular",
    // defaults for config.json parameters
    name: "additional:modules.tools.mietenspiegelFormular.title",
    icon: "bi-bar-chart-line-fill",
    renderToWindow: false,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    layerIdMetadata: null,
    rentIndexLayerId: undefined,
    layerIdCalculation: null,
    collectionStatus: undefined,
    noticePdf: undefined
};

export default state;
