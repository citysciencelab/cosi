import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import initialState from "./stateTemplateAdmin";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
