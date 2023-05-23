import {generateSimpleGetters} from ".../../../src/app-store/utils/generators";
import MietenspiegelFormularState from "./stateMietenspiegelFormular.js";

const getters = {
    ...generateSimpleGetters(MietenspiegelFormularState)
};

export default getters;
