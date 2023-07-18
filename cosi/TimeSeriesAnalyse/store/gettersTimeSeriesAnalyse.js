import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import TimeSeriesAnalyseState from "./stateTimeSeriesAnalyse";

const getters = {
    ...generateSimpleGetters(TimeSeriesAnalyseState)
};

export default getters;
