import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmTemplateAdmin";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
