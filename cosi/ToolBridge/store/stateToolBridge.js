/**
 * User type definition
 * @typedef {Object} ToolBridgeState
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
    id: "ToolBridge",
    name: "Tool Brücke",
    onlyDesktop: true,
    renderToWindow: true,
    resizableWindow: false,
    title: "Tool Brücke",
    receivedResults: [], // when tools are finished running a request, they commit the results here; a watcher on this variable calls the callback given in the request.
    supportedTools: ["AccessibilityAnalysis", "Dashboard"],
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/013fileimport.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/013geodatenimportieren.md"
    }
};
