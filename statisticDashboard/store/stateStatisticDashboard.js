/**
 * Shadow tool state definition.
 * @typedef {Object} ContactState
 * @property {Boolean} active If true, SaveSelection will be rendered.
 * @property {String} id Id of the Contact component.
 * @property {String} name Displayed as the title. (config-param)
 * @property {String} icon Icon next to the title. (config-param)
 * @property {Boolean} renderToWindow If true, tool is rendered in a window, else in the sidebar. (config-param)
 * @property {Boolean} resizableWindow If true, window is resizable. (config-param)
 * @property {Boolean} isVisibleInMenu If true, tool is selectable in menu. (config-param)
 * @property {Boolean} deactivateGFI Flag determining if the tool should deactivate GFI. (config-param)
 * @property {Object} selectedReferenceData the selected reference data
 * @property {Object[]} selectedRegions - The selected regions.
 * @property {Object[]} selectedDates - The selected dates.
 * @property {Object} legendData the legendValues with colors and value
 */
const state = {
    active: false,
    id: "statisticDashboard",
    name: "additional:modules.tools.StatisticDashboard.title",
    icon: "bi-speedometer",
    renderToWindow: false,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true,
    colorScheme: {},
    data: [],
    selectedReferenceData: undefined,
    selectedCategories: [],
    selectedReferenceValueTag: undefined,
    selectedRegions: [],
    selectedDates: [],
    selectedStatistics: {},
    chartTableToggle: "table",
    legendData: []
};

export default state;
