import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import stateSelectionManager from "./stateSelectionManager";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateSelectionManager),

    /**
     * If name from config.json starts with "translate#", the corrected key is set to name here.
     * @param {object} state of this component
     * @param {string} payload name of this component
     * @returns {void}
     */
    applyTranslationKey: (state, payload) => {
        if (payload && payload.indexOf("translate#") > -1) {
            state.name = payload.substring("translate#".length);
        }
    },

    toggleVisualizationState (state) {
        state.visualizationState = !state.visualizationState;
    },
    inputActiveSelection: (state, payload) => {
        if (payload !== null & state.activeSelection === payload) {
            state.activeSelection = null;
        }
        else {
            state.activeSelection = payload;

        }

    },
    /**
     * @param {object} state of this component
     * @param {string} payload selection object that has been created through the addNewSelection action
     * @returns {void}
     */
    addSelection: (state, payload) => {
        // we want to use internal methods (i.e. highlight) on this incoming selection, without putting those methods into the state.
        // this is achieved by passing it to a watched store variable
        state.selections.push(payload);
        // acceptSelection = null; // ensure acceptSelection watcher is triggered in next line
        // state.acceptSelection = payload;
    },
    /**
    * @param {object} state of this component
    * @returns {void}
    */
    clearAllSelections: (state) => {
        state.selections = [];
    }
};

export default mutations;
