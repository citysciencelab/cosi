import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import initialState from "./stateDsmTemplateManager";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
