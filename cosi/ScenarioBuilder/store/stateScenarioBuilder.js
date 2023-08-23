/**
 * User type definition
 * @typedef {Object} ScenarioBuilderState
 * @property {Boolean} [active=false] - Is activated (will rendered) or not (config-param).
 * @property {Boolean} [deactivateGFI=true] - Deactivates the gfi if true (config-param).
 */
const state = {
    active: false,
    deactivateGFI: true,
    icon: "bi-boxes",
    id: "ScenarioBuilder",
    name: "ScenarioBuilder",
    useIcons: true,
    isVisibleInMenu: true,
    renderToWindow: false,
    resizableWindow: false,
    width: 0.45,
    scenarios: [],
    activeScenario: null,
    guideLayer: null,
    geomAttributes: {
        area: [
            {key: "flaeche_qm", factorToSqm: 1},
            {key: "flaeche_ha", factorToSqm: 0.0001}
        ],
        lineString: [
            {key: "laenge_m", factorToM: 1},
            {key: "laenge_km", factorToM: 0.001}
        ]
    },
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/009scenariobuilder.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/009einrichtungenanlegen.md"
    },
    featureEditorDisabled: false
};

export default state;
