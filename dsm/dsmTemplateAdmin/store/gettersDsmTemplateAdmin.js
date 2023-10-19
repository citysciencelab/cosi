import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmTemplateAdmin";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
