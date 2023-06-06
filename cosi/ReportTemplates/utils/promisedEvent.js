/**
 * returns a promise that is reolved upon an event. Use promisedEvent.call(eventName, timeOut, this) to ensure
 * @param {*} eventName name of event that should be awaited
 * @param {integer} timeOut ms how long to wait for event before rejecting the promoise (waits forever if not provided)
 * @return {Promise} empty promise, resolved when promisedEvent is emitted
 */
export default function promisedEvent (eventName, timeOut) {
    if (!this.$root.$on) {
        throw new Error("$root not available; use promisedEvent.call(this,parameters...)");
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

