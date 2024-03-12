import borisState from "../store/stateBoris";
import store from "../../../src/app-store/index";
import SpecModel from "../../../src/modules/tools/print/utils/buildSpec.js";

/**
 * Helper Function to prepare the Pdf file from currently selected layer and its features on the comparison list.
 * @param {function} getResponse function that will get axios response
 * @returns {void}
 */
export async function preparePrint (getResponse) {
    const visibleLayerList = mapCollection.getMap("2D").getLayers().getArray().filter(function (layer) {
            return layer.getVisible() === true;
        }),
        scale = store.state.Maps.scale,
        feature = borisState.selectedBrwFeature,
        selectedOption = borisState.selectedOption,
        defaultString = "",
        date = new Date(),
        month = date.getMonth() + 1,
        attributes = {
            "layout": "A4 Hochformat",
            "outputFormat": "pdf",
            "outputFilename": "Auszug_aus_BORIS_HH-" + date.getDate() + "-" + month + "-" + date.getFullYear(),
            "attributes": {
                "richtwertnummer": "Bodenrichtwertnummer: " + feature.get("richtwertnummer"),
                "scale": "Maßstab 1:" + scale,
                "entwicklungszustand": feature.get("entwicklungszustand") || defaultString,
                "sanierungszusatz": feature.get("sanierungszusatz") || defaultString,
                "beitragszustand": feature.get("beitragszustand") || defaultString,
                "nutzungsart": feature.get("nutzung_kombiniert") || defaultString,
                "anbauart": feature.get("anbauart") || defaultString,
                "geschossfl_zahl": feature.get("geschossfl_zahl") || defaultString,
                "grdstk_flaeche": feature.get("grdstk_flaeche") || defaultString,
                "gruenlandzahl": feature.get("gruenlandzahl") || defaultString,
                "bemerkung": feature.get("bemerkung") || defaultString,
                "stichtag": feature.get("stichtag"),
                "richtwert_euro": feature.get("richtwert_euro") || defaultString,
                "richtwert_dm": feature.get("richtwert_dm") || defaultString,
                "strasse_hausnr": createAddressString(feature),
                "weitere_lage": feature.get("lagebezeichnung") || defaultString,
                "plz_gemeinde": createPostalCodeCityString(feature),
                "bezirk": feature.get("bezirk") || defaultString,
                "stadtteil": feature.get("stadtteil") || defaultString,
                "sge": feature.get("statistisches_gebiet") || defaultString,
                "baublock": feature.get("baublock") || defaultString,
                "convertedBrw": feature.get("convertedBrw") && feature.get("convertedBrw") !== feature.get("richtwert_euro") ? feature.get("convertedBrw") : defaultString,
                "convertedBrwDM": feature.get("convertedBrwDM") || defaultString,
                "zBauweise": selectedOption ? selectedOption : feature.get("zBauweise") || defaultString,
                "zStrassenlage": feature.get("zStrassenLage") || defaultString,
                "zGeschossfl_zahl": feature.get("zGeschossfl_zahl") || defaultString,
                "zGrdstk_flaeche": feature.get("zGrdstk_flaeche") || defaultString,
                "show_schichtwerte": printFloorValues(feature.get("schichtwert")),
                "normschichtwert_wohnen_text": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_wohnen ? "normierter Bodenrichtwert für Mehrfamilienhäuser" : defaultString,
                "normschichtwert_wohnen": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_wohnen ? feature.get("schichtwert").normschichtwert_wohnen : defaultString,
                "normschichtwert_wohnenDM": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_wohnenDM ? feature.get("schichtwert").normschichtwert_wohnenDM : defaultString,
                "normschichtwert_buero_text": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_buero ? "normierter Bodenrichtwert für Bürohäuser" : defaultString,
                "normschichtwert_buero": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_buero ? feature.get("schichtwert").normschichtwert_buero : defaultString,
                "normschichtwert_bueroDM": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_bueroDM ? feature.get("schichtwert").normschichtwert_bueroDM : defaultString,
                "normschichtwert_laden_text": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_laden ? "normierter Bodenrichtwert für Geschäftshäuser (Erdgesch.-anteil)" : defaultString,
                "normschichtwert_laden": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_laden ? feature.get("schichtwert").normschichtwert_laden : defaultString,
                "normschichtwert_ladenDM": feature.get("schichtwert") && feature.get("schichtwert").normschichtwert_ladenDM ? feature.get("schichtwert").normschichtwert_ladenDM : defaultString,
                "schichtwerte": {
                    "rows": feature.get("schichtwert") && feature.get("schichtwert").schichtwerte ? feature.get("schichtwert").schichtwerte : []
                },
                "map": {
                    "dpi": 200,
                    "projection": store.state.Maps.projection.getCode(),
                    "center": store.state.Maps.center,
                    "scale": scale
                }
            }
        },
        spec = SpecModel;

    let printJob = {};

    store.dispatch("Tools/Print/retrieveCapabilites", true, {root: true});
    store.dispatch("Tools/Print/activatePrintStarted", true, {root: true});

    spec.setAttributes(attributes);
    await spec.buildLayers(visibleLayerList);

    printJob = {
        payload: encodeURIComponent(JSON.stringify(spec.defaults)),
        printAppId: "boris",
        currentFormat: "pdf",
        getResponse: getResponse
    };

    store.dispatch("Tools/Print/createPrintJob", printJob, {root: true});
}

/**
 * Helpers function for preparePrint that creates an address string based on the ol.feature\"s attributes strassenname, hausnummer and hausnummerzusatz
 * @param  {ol.feature} feature The ol-Feature
 * @return {String} The result string
 */
export function createAddressString (feature) {
    let addressString = "";

    addressString += feature.get("strassenname") || "";
    addressString += " ";
    addressString += feature.get("hausnummer") || "";
    addressString += feature.get("hausnummerzusatz") || "";

    return addressString.trim();
}
/**
 * Helpers function for preparePrint that creates a string based on the ol.feature\"s attributes postal code and municipality
 * @param  {ol.feature} feature The ol-Feature
 * @return {String} The result String
 */
export function createPostalCodeCityString (feature) {
    let postalCodeCityString = "";

    postalCodeCityString += feature.get("postleitzahl") || "";
    postalCodeCityString += " ";
    postalCodeCityString += feature.get("gemeinde") || "";

    return postalCodeCityString.trim();
}
/**
 * Helpers function for preparePrint that checks if 'schichtwerte' should be printed
 * @param   {object} floorvalue 'schichtwerte'-Object of feature
 * @returns {boolean} true when 'schichtwerte' should be printed
 */
export function printFloorValues (floorvalue) {
    if (floorvalue && floorvalue.schichtwerte && floorvalue.schichtwerte.length > 0) {
        return true;
    }
    return false;
}

