/**
 * User type definition
 * @typedef {Object} ReportTemplatesState
 * @property {Boolean}  active - if true, component is rendered
 * @property {Boolean}  deactivateGFI - if true, component activation deactivates gfi component
 * @property {String}   icon - icon next to title
 * @property {String}   id - internal id of component
 * @property {String}   name - Module name
 * @property {Boolean}  renderToWindow - if true, component is rendered in a window pane instead of sidebar
 * @property {Boolean}  resizableWindow - if true and if rendered to window pane, the pane is resizable
 * @property {String}   selectedFiletype - This controls, which openlayers format is used when displaying the file data. Using "auto" will result in selecting one format according to the filename's suffix.
 * @property {String[]}   importedFileNames - list of names of successfully imported files
 * @property {Object}   supportedFiletypes - Configuration object which is used to generate the selectedFiletype radio form from.
 * @property {String}   title - Module title
 */

export default {
    active: false,
    deactivateGFI: false,
    icon: "bi-upload",
    id: "reportTemplates",
    name: "Report Templates",
    onlyDesktop: true,
    renderToWindow: true,
    resizableWindow: true,
    title: "Report Templates",
    supportedTools: [{value: "AccessibilityAnalysis", title: "Erreichbarkeitsanalyse"}, {value: "Dashboard", title: "Dashboard"}], // to support additional tools, you need to hook them up to the toolBridge. Then simply add them in this array.
    templateItems: [ // the current template. It is always an array, each item a chapter with this general structure (see ../docs/ for details)
        // {title: "Titel...", description: "Beschreibung...", tool: {title: "Wählen!", value: null}, settings: {}, hasSettings: false, output: {}, dataSelection: {}, dataSelectionApplied: false, id: 0}
    ],
    editingTool: {toolName: null, templateItemsIndex: null, aborted: false}, // when user edits settings in another tool, need to remember which chapter is being edited
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/024reporttool.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/024reporttool.md"
    }
};
