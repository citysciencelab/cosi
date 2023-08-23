/**
 * User type definition
 * @typedef {object} selectionmanagerState
 * @property {boolean} active if true, VueAddon will rendered
 * @property {string} id id of the VueAddon component
 * @property {string} name displayed as title (config-param)
 * @property {string} icon icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @todo the rest
 */
const state = {
    active: false,
    id: "SelectionManager",
    // defaults for config.json parameters
    name: "SelectionManager",
    icon: "bi-textarea",
    renderToWindow: false,
    resizableWindow: false,
    isVisibleInMenu: false,
    deactivateGFI: false,
    selections: [],
    activeSelection: null,
    acceptSelection: null, // other tools can commit to this variable. Then, a new selection is added and set as active.
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/022selectionmanager.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/022auswahlmanager.md",
        "en": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/022selectionmanager.md",
        "de": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/022auswahlmanager.md"
    }
};

export default state;
