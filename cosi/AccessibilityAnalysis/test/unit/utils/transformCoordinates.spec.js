import {expect} from "chai";
import {transformCoordinates, transformCoordinate} from "../../../utils/transformCoordinates";
import sinon from "sinon";

describe("Accessibility/utils/transformCoordinates", () => {
    const coordinates = [[567365.4714596295, 5939001.647575631], [565224.7537994956, 5938496.534138625], [567461.6848501588, 5937991.420701618]],
        transCoordinates = [[10.017877366728525, 53.595515231189246], [9.985431302078034, 53.59124641953129], [10.01911238545045, 53.58642383664248]];

    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("transformCoordinates", () => {
        it("should return false if the given param is an object", () => {
            expect(transformCoordinates({})).to.be.false;
        });

        it("should return false if the given param is null", () => {
            expect(transformCoordinates(null)).to.be.false;
        });

        it("should return false if the given param is undefined", () => {
            expect(transformCoordinates(undefined)).to.be.false;
        });

        it("should return false if the given param is a number", () => {
            expect(transformCoordinates(666)).to.be.false;
        });

        it("should return false if the given param is a string", () => {
            expect(transformCoordinates("666")).to.be.false;
        });

        it("should return false if the given param is a boolean", () => {
            expect(transformCoordinates(true)).to.be.false;
        });

        it("should return false if the given param is an empty array", () => {
            expect(transformCoordinates([])).to.be.false;
        });

        it("should call an error if the given param is not an array", () => {
            transformCoordinates(true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second param is an object", () => {
            expect(transformCoordinates(coordinates, {})).to.be.false;
        });

        it("should return false if the second param is null", () => {
            expect(transformCoordinates(coordinates, null)).to.be.false;
        });

        it("should return false if the second param is undefined", () => {
            expect(transformCoordinates(coordinates, undefined)).to.be.false;
        });

        it("should return false if the second param is a number", () => {
            expect(transformCoordinates(coordinates, 666)).to.be.false;
        });

        it("should return false if the second param is a boolean", () => {
            expect(transformCoordinates(coordinates, true)).to.be.false;
        });

        it("should return false if the second param is an array", () => {
            expect(transformCoordinates(coordinates, [])).to.be.false;
        });

        it("should call an error if the second param is not a string", () => {
            transformCoordinates(coordinates, true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the third param is an object", () => {
            expect(transformCoordinates(coordinates, "", {})).to.be.false;
        });

        it("should return false if the third param is null", () => {
            expect(transformCoordinates(coordinates, "", null)).to.be.false;
        });

        it("should return false if the third param is a number", () => {
            expect(transformCoordinates(coordinates, "", 666)).to.be.false;
        });

        it("should return false if the third param is a boolean", () => {
            expect(transformCoordinates(coordinates, "", true)).to.be.false;
        });

        it("should return false if the third param is an array", () => {
            expect(transformCoordinates(coordinates, "", [])).to.be.false;
        });

        it("should call an error if the third param is not a string", () => {
            transformCoordinates(coordinates, "", true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return the transformed coordinates if the third param is undefined", () => {
            expect(transformCoordinates(coordinates, "EPSG:25832", undefined)).to.deep.equal(transCoordinates);
        });

        it("should return the transformed coordinates in the correct crs", () => {
            expect(transformCoordinates(coordinates, "EPSG:25832", "EPSG:4326")).to.deep.equal(transCoordinates);
        });
    });

    describe("transformCoordinate", () => {
        it("should return false if the given param is an object", () => {
            expect(transformCoordinate({})).to.be.false;
        });

        it("should return false if the given param is null", () => {
            expect(transformCoordinate(null)).to.be.false;
        });

        it("should return false if the given param is undefined", () => {
            expect(transformCoordinate(undefined)).to.be.false;
        });

        it("should return false if the given param is a number", () => {
            expect(transformCoordinate(666)).to.be.false;
        });

        it("should return false if the given param is a string", () => {
            expect(transformCoordinate("666")).to.be.false;
        });

        it("should return false if the given param is a boolean", () => {
            expect(transformCoordinate(true)).to.be.false;
        });

        it("should return false if the given param is an empty array", () => {
            expect(transformCoordinate([])).to.be.false;
        });

        it("should call an error if the given param is not an array", () => {
            transformCoordinate(true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second param is an object", () => {
            expect(transformCoordinate(coordinates, {})).to.be.false;
        });

        it("should return false if the second param is null", () => {
            expect(transformCoordinate(coordinates, null)).to.be.false;
        });

        it("should return false if the second param is undefined", () => {
            expect(transformCoordinate(coordinates, undefined)).to.be.false;
        });

        it("should return false if the second param is a number", () => {
            expect(transformCoordinate(coordinates, 666)).to.be.false;
        });

        it("should return false if the second param is a boolean", () => {
            expect(transformCoordinates(coordinates, true)).to.be.false;
        });

        it("should return false if the second param is an array", () => {
            expect(transformCoordinate(coordinates, [])).to.be.false;
        });

        it("should call an error if the second param is not a string", () => {
            transformCoordinate(coordinates, true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the third param is an object", () => {
            expect(transformCoordinate(coordinates, "", {})).to.be.false;
        });

        it("should return false if the third param is null", () => {
            expect(transformCoordinate(coordinates, "", null)).to.be.false;
        });

        it("should return false if the third param is a number", () => {
            expect(transformCoordinate(coordinates, "", 666)).to.be.false;
        });

        it("should return false if the third param is a boolean", () => {
            expect(transformCoordinate(coordinates, "", true)).to.be.false;
        });

        it("should return false if the third param is an array", () => {
            expect(transformCoordinate(coordinates, "", [])).to.be.false;
        });

        it("should call an error if the third param is not a string", () => {
            transformCoordinate(coordinates, "", true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return the transformed coordinates if the third param is undefined", () => {
            expect(transformCoordinate(coordinates[0], "EPSG:25832", undefined)).to.deep.equal(transCoordinates[0]);
        });

        it("should return the transformed coordinates in the correct crs", () => {
            expect(transformCoordinate(coordinates[0], "EPSG:25832", "EPSG:4326")).to.deep.equal(transCoordinates[0]);
        });
    });
});
