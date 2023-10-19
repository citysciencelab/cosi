import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmTemplateManager";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
