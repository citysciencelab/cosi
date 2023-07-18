import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import TimeSeriesAnalyseState from "./stateTimeSeriesAnalyse";
const mutations = {
    ...generateSimpleMutations(TimeSeriesAnalyseState)
};

export default mutations;
