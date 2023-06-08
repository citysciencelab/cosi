import promisedEvent from "../../ReportTemplates/utils/promisedEvent";
export default {
    /**
     *
     * @param {string} toolName name of the requested tool as a character string
     * @param {*} settings as received from toolBridgeOut getter in requested tool
     * @param {function} outputCallback function to be called on the tools returned result
     * @param {boolean} updateInterfaceOnly only update the interface, don't actually apply the analysis itself (may or may not be supported by individual tools)
     * @return {*} function called for side effects only.
     */
    runTool ({commit, getters}, {toolName, settings, outputCallback, updateInterfaceOnly}) {
        // here we only check if the requested tool is supported, then pass the request to the tool's store.
        // the requested tool itself should have a watcher that does the rest (run the analysis based on the settings and commits the results back to the toolBridge' store shelf.)
        // validate inputs
        if (!getters.supportedTools.includes(toolName)) {
            throw new Error(toolName + " not supported");
        }
        if (typeof outputCallback !== "function") {
            throw new Error(outputCallback + " must be a function");
        }


        // validate settings
        //     valid = this.validateToolSettings(toolName, settings);

        // if (valid.success === false) {
        //     throw new Error(valid.message + " for " + toolName);
        // }
        // commit request to the requested tool's store
        // eslint-disable-next-line one-var
        const toolPath = "Tools/" + toolName + "/setToolBridgeIn",
            request = {
                settings: settings,
                outputCallback: outputCallback
            };

        if (updateInterfaceOnly) {
            request.updateInterfaceOnly = updateInterfaceOnly;
        }
        commit(
            toolPath,
            request,
            {root: true} // allows commit to a different module
        );
    }
};
