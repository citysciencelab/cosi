
/**
 *
 * @param {string} toolName name of the tool
 * @param {*} settings settings as received from toolBridgeOut getter in requested tool
 * @param {function} onIssue callback function if there is an issue with the settings, receiving the issue as string
 * @returns {object} {success: boolean, message: string, individualMessages: string[]}‚
 */
function validateToolSettings (toolName, settings) {
    // check if valid tool name
    if (typeof toolName !== "string") {
        return {
            success: false,
            message: "toolName must be a string"
        };
    }
    // check if settings is an object
    if (typeof settings !== "object") {
        return {
            success: false,
            message: "settings must be an object"
        };
    }
    // check if settings is empty
    if (Object.keys(settings).length === 0) {
        return {
            success: false,
            message: "settings must not be empty"
        };
    }
    // check if settings has all required properties
    // ... for AccessibilityAnalysis
    if (toolName === "AccessibilityAnalysis") {
        const problems = [];

        if (!settings.distance) {
            problems.push("Feld \"Entfernung\" fehlt");
        }
        if (!(settings.mode === "region")) {
            problems.push("'Modus Erreichbarkeit der Ausgewählten Einrichtungen' muss ausgewählt sein");
        }
        if (!settings.scaleUnit) {
            problems.push("'Masseinheit der Entfernung muss ausgewählt sein");
        }
        if (!settings.transportType) {
            problems.push("Transportmittel muss ausgewählt sein");
        }
        if (!settings.selectedFacilityNames || settings.selectedFacilityNames.length === 0) {
            problems.push("'Thema' muss ausgewählt sein");
        }

        if (problems.length > 0) {
            const message = "Erreichbarkeitsanalyse:" + problems.join(".\n; ");

            return {success: false, message: message, individualMessages: problems};
        }

    }

    // ... for Dashboard
    if (toolName === "Dashboard") {
        const problems = [];

        // const requestSettingsValid = ("statsFeatureFilter" in newRequest.settings) & ("calculations" in newRequest.settings)
        if (!("statsFeatureFilter" in settings)) {
            problems.push("Statistische Filter fehlt");
        }
        if (!("calculations" in settings)) {
            problems.push("Berechnungen fehlen in Einstellungen");
        }
        if (problems.length > 0) {
            const message = "Dashboard:" + problems.join(".\n; ");

            return {success: false, message: message};
        }

    }

    return {success: true, message: null};

}

export default validateToolSettings;

