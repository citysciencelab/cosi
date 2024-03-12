import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import initialState from "./stateTemplateAdmin";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
