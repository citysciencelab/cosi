import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmDashboard";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
