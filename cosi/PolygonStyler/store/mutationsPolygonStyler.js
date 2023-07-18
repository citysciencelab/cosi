import {generateSimpleMutations} from "../../../../src/app-store/utils/generators";
import statePolygonStyler from "./statePolygonStyler";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(statePolygonStyler)
};

export default mutations;
