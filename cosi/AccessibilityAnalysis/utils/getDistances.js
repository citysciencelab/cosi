import travelTimeIndex from "../assets/inrix_traveltimeindex_2021.json";

/**
 * Gets the distance and the distance divided into three steps. If the travel time index is set, the distance is returned weighted.
 * @param {Number} originDistance - The origin distance in meters or minutes.
 * @param {Boolean} useTravelTimeIndex - Flag to use the travel time index.
 * @param {Number} time - Time for the travel time index.
 * @returns {Object|Boolean} The distance, max distance and the steps. False if something fails.
 */
function getDistances (originDistance, useTravelTimeIndex, time) {
    if (typeof originDistance !== "number") {
        console.error(`addons/cosi/Accessibility/utils/getDistances: The first parameter must be a number, but got ${typeof originDistance}`);
        return false;
    }
    if (typeof useTravelTimeIndex !== "boolean") {
        console.error(`addons/cosi/Accessibility/utils/getDistances: The second parameter must be a boolean, but got ${typeof useTravelTimeIndex}`);
        return false;
    }
    if (typeof time !== "number") {
        console.error(`addons/cosi/Accessibility/utils/getDistances: The third parameter must be a number, but got ${typeof time}`);
        return false;
    }

    let distance = originDistance,
        maxDistance,
        steps = getSteps(originDistance);

    if (useTravelTimeIndex) {
        distance = getTravelTimeIndexDistance(originDistance, time);
        maxDistance = originDistance;
        steps = [...steps, "max"];
    }

    return {distance, maxDistance, steps};
}

/**
 * Gets the steps of the distance rounded to two digits.
 * @param {Number} distance - The ditance to be divided.
 * @returns {String[]|Boolean} The distance divided into three steps. False if something fails.
 */
function getSteps (distance) {
    if (typeof distance !== "number") {
        console.error(`addons/cosi/Accessibility/utils/getSteps: The first parameter must be a number, but got ${typeof distance}`);
        return false;
    }

    const distanceSteps = [distance / 3, distance * 2 / 3, distance];

    return distanceSteps.map(step => Number.isInteger(step) ? step.toLocaleString("de-DE") : step.toFixed(2));
}

/**
 * Gets the distance weighted by the travel time index.
 * @param {Number} distance - The origin distance in meters or minutes.
 * @param {Number} time - Time for the travel time index.
 * @returns {Number|Boolean} The weighted distance. False if something fails.
 */
function getTravelTimeIndexDistance (distance, time) {
    if (typeof distance !== "number") {
        console.error(`addons/cosi/Accessibility/utils/getDistanceByTravelTimeIndex: The first parameter must be a number, but got ${typeof distance}`);
        return false;
    }

    if (typeof time !== "number") {
        console.error(`addons/cosi/Accessibility/utils/getDistanceByTravelTimeIndex: The second parameter must be a number, but got ${typeof time}`);
        return false;
    }

    const penalty = travelTimeIndex[time] / Math.min(...Object.values(travelTimeIndex));

    return Math.round(distance / penalty);
}

module.exports = {
    getTravelTimeIndexDistance,
    getDistances,
    getSteps
};
