import {expect} from "chai";
import sinon from "sinon";
import {getDistances, getTravelTimeIndexDistance, getSteps} from "../../../utils/getDistances";

describe("AccessibiltyAnalysis/utils/getDistances", () => {
    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("getDistances", () => {
        it("should return false if the given parameter is an object", () => {
            expect(getDistances({})).to.be.false;
        });

        it("should return false if the given parameter is an array", () => {
            expect(getDistances([])).to.be.false;
        });

        it("should return false if the given parameter is undefined", () => {
            expect(getDistances(undefined)).to.be.false;
        });

        it("should return false if the given parameter is null", () => {
            expect(getDistances(null)).to.be.false;
        });

        it("should return false if the given parameter is a string", () => {
            expect(getDistances("null")).to.be.false;
        });

        it("should return false if the given parameter is a boolean", () => {
            expect(getDistances(true)).to.be.false;
        });

        it("should call an error if the given parameter is not a number", () => {
            getDistances("666");
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second given parameter is an object", () => {
            expect(getDistances(666, {})).to.be.false;
        });

        it("should return false if the second given parameter is an array", () => {
            expect(getDistances(666, [])).to.be.false;
        });

        it("should return false if the second given parameter is undefined", () => {
            expect(getDistances(666, undefined)).to.be.false;
        });

        it("should return false if the second given parameter is null", () => {
            expect(getDistances(666, null)).to.be.false;
        });

        it("should return false if the second given parameter is a string", () => {
            expect(getDistances(666, "null")).to.be.false;
        });

        it("should return false if the second given parameter is a number", () => {
            expect(getDistances(666, 666)).to.be.false;
        });

        it("should call an error if the second given parameter is not a boolean", () => {
            getDistances(666, 666);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the third given parameter is an object", () => {
            expect(getDistances(666, false, {})).to.be.false;
        });

        it("should return false if the third given parameter is an array", () => {
            expect(getDistances(666, false, [])).to.be.false;
        });

        it("should return false if the third given parameter is undefined", () => {
            expect(getDistances(666, false, undefined)).to.be.false;
        });

        it("should return false if the third given parameter is null", () => {
            expect(getDistances(666, false, null)).to.be.false;
        });

        it("should return false if the third given parameter is a string", () => {
            expect(getDistances(666, false, "666")).to.be.false;
        });

        it("should return false if the third given parameter is a boolean", () => {
            expect(getDistances(666, false, true)).to.be.false;
        });

        it("should call an error if the third given parameter is not a number", () => {
            getDistances(666, false, "666");
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return the right values if travel time index is not used (second param)", () => {
            const {distance, maxDistance, steps} = getDistances(666, false, 12);

            expect(distance).to.be.equal(666);
            expect(maxDistance).to.be.undefined;
            expect(steps).to.deep.equal(["222", "444", "666"]);
        });

        it("should return the right values if travel time index is used (second param)", () => {
            const travelTimeIndexDistance = getTravelTimeIndexDistance(600, 11),
                {distance, maxDistance, steps} = getDistances(600, true, 11);

            expect(distance).to.be.equal(travelTimeIndexDistance);
            expect(maxDistance).to.be.equal(600);
            expect(steps).to.deep.equal(["200", "400", "600", "max"]);
        });
    });

    describe("getSteps", () => {
        it("should return false if the given parameter is an object", () => {
            expect(getSteps({})).to.be.false;
        });

        it("should return false if the given parameter is an array", () => {
            expect(getSteps([])).to.be.false;
        });

        it("should return false if the given parameter is undefined", () => {
            expect(getSteps(undefined)).to.be.false;
        });

        it("should return false if the given parameter is null", () => {
            expect(getSteps(null)).to.be.false;
        });

        it("should return false if the given parameter is a string", () => {
            expect(getSteps("null")).to.be.false;
        });

        it("should return false if the given parameter is a boolean", () => {
            expect(getSteps(true)).to.be.false;
        });

        it("should call an error if the given parameter is not a number", () => {
            getSteps("666");
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return the right steps", () => {
            expect(getSteps(666)).to.deep.equal(["222", "444", "666"]);
        });
    });

    describe("getTravelTimeIndexDistance", () => {
        it("should return false if the given parameter is an object", () => {
            expect(getTravelTimeIndexDistance({})).to.be.false;
        });

        it("should return false if the given parameter is an array", () => {
            expect(getTravelTimeIndexDistance([])).to.be.false;
        });

        it("should return false if the given parameter is undefined", () => {
            expect(getTravelTimeIndexDistance(undefined)).to.be.false;
        });

        it("should return false if the given parameter is null", () => {
            expect(getTravelTimeIndexDistance(null)).to.be.false;
        });

        it("should return false if the given parameter is a string", () => {
            expect(getTravelTimeIndexDistance("null")).to.be.false;
        });

        it("should return false if the given parameter is a boolean", () => {
            expect(getTravelTimeIndexDistance(true)).to.be.false;
        });

        it("should call an error if the given parameter is not a number", () => {
            getTravelTimeIndexDistance("666");
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second given parameter is an object", () => {
            expect(getTravelTimeIndexDistance(666, {})).to.be.false;
        });

        it("should return false if the second given parameter is an array", () => {
            expect(getTravelTimeIndexDistance(666, [])).to.be.false;
        });

        it("should return false if the second given parameter is undefined", () => {
            expect(getTravelTimeIndexDistance(666, undefined)).to.be.false;
        });

        it("should return false if the second given parameter is null", () => {
            expect(getTravelTimeIndexDistance(666, null)).to.be.false;
        });

        it("should return false if the second given parameter is a string", () => {
            expect(getTravelTimeIndexDistance(666, "null")).to.be.false;
        });

        it("should return false if the second given parameter is a boolean", () => {
            expect(getTravelTimeIndexDistance(666, true)).to.be.false;
        });

        it("should call an error if the second given parameter is not a number", () => {
            getTravelTimeIndexDistance(666, "666");
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return a integer that is less than the passed number", () => {
            const travelTimeIndexDistance = getTravelTimeIndexDistance(600, 11);

            expect(travelTimeIndexDistance).to.be.a("number");
            expect(travelTimeIndexDistance).to.be.lessThan(600);
            expect(travelTimeIndexDistance % 1).to.be.equal(0);
        });
    });
});
