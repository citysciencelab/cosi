import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmDashboard";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
