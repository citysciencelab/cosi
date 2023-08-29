/**
 * User type definition
 * @typedef {Object} ResidentialSimulationState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=true] - Deactivates the gfi if true (config-param).
 * @property {String} [icon="bi-house"] - Bootstrap icon class (config-param).
 * @property {String} id - The id of the district selector component.
 * @property {String} [name=Gebiet auswählen] - The name of the tool (config-param).
 * @property {Boolean} [renderToWindow=true] - Renders tool in a window if true, otherwise in the sidebar (config-param).
 * @property {Boolean} [resizableWindow=false] - If True, window is resizable (config-param).
 */
const state = {
    active: false,
    deactivateGFI: true,
    icon: "bi-house",
    id: "residentialSimulation",
    isVisibleInMenu: true,
    name: "Wohnungsbauquartiere anlegen",
    renderToWindow: false,
    resizableWindow: false,
    width: 0.45,
    // ResidentialSimulation specific state
    timelinePrefix: "jahr_",
    groupsList: ["Bevölkerung", "Bevölkerung unter x Jahren", "Bevölkerung ab x Jahren", "Bevölkerung x bis x Jahren", "Bevölkerung x bis unter 18 Jahren", "Bevölkerung Prognose", "Arbeitslose", "Sozialversicherungspflichtige", "SGB II Leistungen", "Verkehr"],
    basePopulationProp: "Bevölkerung insgesamt",
    drawingLayer: null,
    defaults: {
        name: "Mein Wohnquartier",
        avgHouseholdSize: 2.5,
        gfz: 1.0,
        populationDensity: 5000,
        livingSpace: 30
    },
    referenceDistrictCharts: [
        {
            id: "gender",
            name: "Demographie nach Gender",
            scaleLabels: ["Anteil", "Gender"],
            labels: [
                "Bevölkerung weiblich",
                "Bevölkerung männlich",
                "Sozialversicherungspflichtig Beschäftigte insgesamt",
                "Sozialversicherungspflichtig beschäftigte Frauen",
                "Sozialversicherungspflichtig beschäftigte Männer"
            ],
            type: "BarChart"
        },
        {
            id: "age",
            name: "Demographie nach Altersgruppen",
            scaleLabels: ["Anteil", "Alterskohorten"],
            labels: [
                "Bevölkerung unter 6 Jahren",
                "Bevölkerung 6 bis 9 Jahren",
                "Bevölkerung 10 bis 14 Jahren",
                "Bevölkerung 15 bis 20 Jahren",
                "Bevölkerung 21 bis 44 Jahren",
                "Bevölkerung 45 bis 64 Jahren",
                "Bevölkerung ab 65 Jahren"
            ],
            type: "BarChart"
        }
    ],
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/011residentialsimulation.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/011wohnquartiereanlegen.md"
    }
};

export default state;
