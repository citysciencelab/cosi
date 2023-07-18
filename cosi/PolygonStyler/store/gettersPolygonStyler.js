import {generateSimpleGetters} from "../../../../src/app-store/utils/generators";
import statePolygonStyler from "./statePolygonStyler";

const getters = {
    ...generateSimpleGetters(statePolygonStyler)
};

export default getters;
