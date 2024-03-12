/**
 * Returns a promise that is reolved upon an event. Use promisedEvent.call(eventName, timeOut, this) to ensure
 * @param {string} eventName name of event that should be awaited
 * @param {number} timeOut ms how long to wait for event before rejecting the promise
 * @return {Promise} empty promise, resolved when promisedEvent is emitted
 */
export default function promisedEvent (eventName, timeOut = 1500) {
    if (!this.$root.$on) {
        throw new Error("$root not available; use promisedEvent.call(parameters..., this)");
    }
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line require-jsdoc
        function listener () {
            this.$root.$off(eventName);
            resolve();
        }
        // resolve promise when event is heard
        this.$root.$on(eventName, listener);
        // reject promise after timeOut
        if (timeOut) {
            setTimeout(() => {
                reject("waiting for promise timed out after " + timeOut + "ms");
            }, timeOut);
        }
    });
}

