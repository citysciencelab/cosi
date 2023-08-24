import {expect} from "chai";
import {getCenterOfMass} from "../../features/getCenterOfMass";
import sinon from "sinon";
import Feature from "ol/Feature";
import {Polygon} from "ol/geom";

describe("utils/features/getCenterOfMass", () => {
    const polygonFeature = new Feature({
        geometry: new Polygon([
            [
                [2, 2],
                [78, 2],
                [2, 78],
                [2, 2]
            ]
        ])
    });

    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("getCenterOfMass", () => {
        it("should return false if the given parameter is an object", () => {
            expect(getCenterOfMass({})).to.be.false;
        });

        it("should return false if the given parameter is undefined", () => {
            expect(getCenterOfMass(undefined)).to.be.false;
        });

        it("should return false if the given parameter is a boolean", () => {
            expect(getCenterOfMass(true)).to.be.false;
        });

        it("should return false if the given parameter is a string", () => {
            expect(getCenterOfMass("string")).to.be.false;
        });

        it("should return false if the given parameter is null", () => {
            expect(getCenterOfMass(null)).to.be.false;
        });

        it("should return false if the given parameter is a number", () => {
            expect(getCenterOfMass(666)).to.be.false;
        });

        it("should return false if the given parameter is an array", () => {
            expect(getCenterOfMass([])).to.be.false;
        });

        it("should return an array represents the coordinate of the center of mass", () => {
            expect(getCenterOfMass(polygonFeature)).to.be.an("array").lengthOf(2);
        });

        it("should call an error if the given parameter is not an ol feature", () => {
            getCenterOfMass({});
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second passed parameter is an object", () => {
            expect(getCenterOfMass(polygonFeature, {})).to.be.false;
        });

        it("should return false if the second passed parameter is an array", () => {
            expect(getCenterOfMass(polygonFeature, [])).to.be.false;
        });

        it("should return false if the second passed parameter is a number", () => {
            expect(getCenterOfMass(polygonFeature, 666)).to.be.false;
        });

        it("should return false if the second passed parameter is a boolean", () => {
            expect(getCenterOfMass(polygonFeature, true)).to.be.false;
        });

        it("should return false if the second passed parameter is null", () => {
            expect(getCenterOfMass(polygonFeature, null)).to.be.false;
        });

        it("should call an error if the second passed parameter is not a string or undefined", () => {
            getCenterOfMass(polygonFeature, 666);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return an array represents the coordinate of the center of mass if the second passed parameter is undefined", () => {
            expect(getCenterOfMass(polygonFeature)).to.be.an("array").lengthOf(2);
        });

        it("should return false if the third passed parameter is an object", () => {
            expect(getCenterOfMass(polygonFeature, undefined, {})).to.be.false;
        });

        it("should return false if the third passed parameter is an array", () => {
            expect(getCenterOfMass(polygonFeature, undefined, [])).to.be.false;
        });

        it("should return false if the third passed parameter is a number", () => {
            expect(getCenterOfMass(polygonFeature, undefined, 666)).to.be.false;
        });

        it("should return false if the third passed parameter is a boolean", () => {
            expect(getCenterOfMass(polygonFeature, undefined, true)).to.be.false;
        });

        it("should return false if the third passed parameter is null", () => {
            expect(getCenterOfMass(polygonFeature, undefined, null)).to.be.false;
        });

        it("should call an error if the third passed parameter is not a boolean or undefined", () => {
            getCenterOfMass(polygonFeature, undefined, 666);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return an array represents the coordinate of the center of mass if the third passed parameter is undefined", () => {
            expect(getCenterOfMass(polygonFeature)).to.be.an("array").lengthOf(2);
        });
    });
});
