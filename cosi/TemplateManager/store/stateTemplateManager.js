/**
 * User type definition
 * @typedef {Object} DistrictSelectorState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=false] - Deactivates the gfi if true (config-param).
 * @property {String} [icon="bi-folder2-open"] - Bootstrap icon class (config-param).
 * @property {String} id - The id of the district selector component.
 * @property {String} [name="Sitzung speichern"] - The name of the tool (config-param).
 * @property {Boolean} [renderToWindow=true] - Renders tool in a window if true, otherwise in the sidebar (config-param).
 * @property {Boolean} [resizableWindow=false] - If True, window is resizable (config-param).
 * @property {String} toolToOpen - the tool to be open after this tool is closed.
 * @property {Boolean} [useImport=false] - If true, it is possible to import templates.
 * @property {Boolean} [useTemplatesForMapping=false] - If true, the mapping is overwritten with the statistic data from the templates.
 */
const state = {
    active: false,
    deactivateGFI: false,
    icon: "bi-folder2-open",
    id: "templateManager",
    isVisibleInMenu: true,
    importedTemplateNames: [],
    name: "Vorlagen",
    renderToWindow: true,
    resizableWindow: true,
    templatePath: "./assets/templates",
    templateFiles: [
        "Erhaltungsmanagement_Spielplaetze"
    ],
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/015templates.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/015vorlagen.md"
    },
    toolToOpen: undefined,
    useImport: false,
    useTemplatesForMapping: false
};

export default state;
