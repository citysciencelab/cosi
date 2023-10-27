/**
 * Shadow tool state definition.
 * @typedef {Object} ContactState
 * @property {Boolean} active If true, TemplateAdmin will be rendered.
 * @property {String} id Id of the Contact component.
 * @property {String} name Displayed as the title. (config-param)
 * @property {String} icon Icon next to the title. (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 */
const state = {
    active: false,
    id: "TemplateAdmin",
    name: "additional:modules.tools.cosi.TemplateAdmin.title",
    icon: "bi-folder2-open",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true,
    ignorePropertyNames: []
};

export default state;
