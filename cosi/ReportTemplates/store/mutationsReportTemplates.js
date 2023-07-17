import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import ReportTemplatesState from "./stateReportTemplates";
const mutations = {
    ...generateSimpleMutations(ReportTemplatesState),
    templateItemOutput (state, {output, itemID}) { // to overwrite a specific key of a specific array item
        state.templateItems[itemID].output = output;
    },
    closeToolsInTemplateMode (state) {
        // close all tools and stop their editing mode
        for (const i in state.supportedTools) {
            this.commit("Tools/" + state.supportedTools[i].value + "/setReportTemplateMode", null);
            this.commit("Tools/" + state.supportedTools[i].value + "/setActive", false);
        }
        // remember that we are not editing any tool for any chapter right now
        // return to reporttemplates window
        state.active = true;
    }
};

export default mutations;
