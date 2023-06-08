import validateToolSettings from "../utils/validateToolSettings";
const actions = {

    finishEditingToolSettingsAction (context) {

        // get current settings via toolbridge
        const currentSettings = context.rootGetters["Tools/ToolBridge/currentSettings"],
            settings = currentSettings(context.state.editingTool.toolName),
            //      console.log("SETTINGS ", settings);
            // check if settings are valid
            //       console.log(currentSettings(state.editingTool.toolName));
            validation = validateToolSettings(context.state.editingTool.toolName, settings);

        console.log("VALIDATION", validation);
        // if no success, let caller know and stop:
        if (!validation.success) {
            return validation;
        }
        // stop editing mode
        this.commit("Tools/ReportTemplates/closeToolsInTemplateMode");
        // let reportTemplates know that editing is over and edits are accepted
        context.state.editingTool = {toolName: null, templateItemsIndex: null, accepted: true}; // watcher on editingTool handles rest
        return validation;
    }
};

export default actions;
