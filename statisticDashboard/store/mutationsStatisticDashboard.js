import {generateSimpleMutations} from "../../../src/app-store/utils/generators";
import initialState from "./stateStatisticDashboard";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
