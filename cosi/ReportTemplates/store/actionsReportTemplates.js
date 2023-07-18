import validateToolSettings from "../utils/validateToolSettings";
const actions = {
    startEditingToolSettings (context, payload) {
        if (!payload.toolName) {
            throw new Error("Kein tool zum bearbeiten gewählt");

        }
        // close all other tools and stop their editing mode
        this.commit("Tools/ReportTemplates/returnToReportTemplatesInterface");
        // open selected tool in editing mode
        this.commit("Tools/" + payload.toolName + "/setReportTemplateMode", payload.templateItemsIndex);
        this.commit("Tools/" + payload.toolName + "/setActive", true);
        // remember which tool we are editing for which chapter
        context.state.editingTool = {toolName: payload.toolName, templateItemsIndex: payload.templateItemsIndex};
        // close report templates window
        context.state.active = false;
    },
    finishEditingToolSettings (context) {
        console.log("FINISH - ACTION");

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
        this.commit("Tools/ReportTemplates/returnToReportTemplatesInterface");
        // let reportTemplates know that editing is over and edits are accepted
        context.state.editingTool = {toolName: null, templateItemsIndex: null, accepted: true}; // watcher on editingTool handles rest
        return validation;
    },
    abortEditingToolSettings (context) {
        console.log("ABORT - ACTION");

        // stop editing mode
        this.commit("Tools/ReportTemplates/returnToReportTemplatesInterface");
        // let reportTemplates know that editing is over but edits are not accepted
        context.state.editingTool = {toolName: null, templateItemsIndex: null, accepted: false}; // watcher on editingTool handles rest
    }
};

export default actions;