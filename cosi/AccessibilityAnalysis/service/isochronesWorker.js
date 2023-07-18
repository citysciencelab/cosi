import {writeFeatures} from "../components/util.js";
import {createIsochrones, getFilterPoly, setFilterPoly} from "./createIsochrones";
import "regenerator-runtime/runtime";
import axios from "axios";
import {registerProjections} from "../../utils/registerProjections.js";

/**
 * @param {*} self self
 * @param {*} event event
 * @returns {void}
 */
async function onmessage (self, event) {
    const type = event.data.type;

    try {
        if (event.data.type === "createIsochrones") {
            const features = await createIsochrones(event.data, (p) => {
                self.postMessage({type, "progress": p});
            });

            self.postMessage({type: event.data.type, result: writeFeatures(features)});
        }
        else if (event.data.type === "init") {
            setFilterPoly(event.data.coords);
            self.postMessage({type, result: "ok"});
        }
        else if (event.data.type === "getFilterPoly") {
            self.postMessage({type, result: getFilterPoly()});
        }
        else if (event.data.type === "register") {
            registerProjections(event.data.projections);
        }
    }
    catch (error) {
        if (axios.isCancel(error)) {
            self.postMessage({type, request_canceled: true});
        }
        else {
            self.postMessage({type, error});
        }
    }
}

self.addEventListener("message", function (e) {
    onmessage(self, e);
});

/**
 * use this (for testing) if Workers are not available in the active enviroment
 **/
export class Worker {

    // eslint-disable-next-line require-jsdoc
    constructor () {
        this.listeners = [];
    }

    // eslint-disable-next-line require-jsdoc
    async postMessage (args) {
        await onmessage({
            postMessage: (data) => {
                if (data.error) {
                    this.onerror(data);
                }
                if (this.onmessage) {
                    this.onmessage({data});
                }
                for (const l of this.listeners) {
                    l({data});
                }
            }
        }, {data: args});
    }

    // eslint-disable-next-line require-jsdoc
    terminate () {
        this.status = "terminated";
    }

    // eslint-disable-next-line require-jsdoc
    addEventListener (type, l) {
        if (type === "message") {
            this.listeners.push(l);
        }
    }

    // eslint-disable-next-line require-jsdoc
    removeEventListener (type, l) {
        if (type === "message") {
            const index = this.listeners.indexOf(l);

            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }
    }
}
