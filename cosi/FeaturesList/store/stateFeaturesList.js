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
    icon: "bi-apple",
    id: "featuresList",
    isVisibleInMenu: true,
    name: "Einrichtungsübersicht",
    renderToWindow: false,
    resizableWindow: true,
    width: 0.5,
    // FeaturesList State
    mapping: [],
    featuresListItems: [],
    selectedFeatureItems: [],
    propBlacklist: [
        "geometry",
        "geom",
        "the_geom",
        "coordinates",
        "flatCoordinates",
        "x",
        "y",
        "lat",
        "lon",
        "latlon",
        "lonlat",
        "originalData"
    ],
    disabledFeatureItems: [],
    distanceScoreEnabled: true,
    readmeUrl: {
        "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/featureslist.md",
        "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/einrichtungsuebersicht.md"
    },
    show: true
};

export default state;
