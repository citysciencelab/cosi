import {expect} from "chai";
import {transformFeatures} from "../../features/transform";
import sinon from "sinon";
import Feature from "ol/Feature";
import {Point} from "ol/geom";

describe("utils/features/transform", () => {
    const featureOne = new Feature({
            geometry: new Point([5, 5])
        }),
        featureTwo = new Feature({
            geometry: new Point([40, 40])
        });

    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("transformFeatures", () => {
        it("should return false if the given param is an object", () => {
            expect(transformFeatures({})).to.be.false;
        });

        it("should return false if the given param is null", () => {
            expect(transformFeatures(null)).to.be.false;
        });

        it("should return false if the given param is undefined", () => {
            expect(transformFeatures(undefined)).to.be.false;
        });

        it("should return false if the given param is a number", () => {
            expect(transformFeatures(666)).to.be.false;
        });

        it("should return false if the given param is a string", () => {
            expect(transformFeatures("666")).to.be.false;
        });

        it("should return false if the given param is a boolean", () => {
            expect(transformFeatures(true)).to.be.false;
        });

        it("should return false if the given param is an array", () => {
            expect(transformFeatures([])).to.be.false;
        });

        it("should call an error if the given param is not an array", () => {
            transformFeatures(true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second param is an object", () => {
            expect(transformFeatures([featureOne], {})).to.be.false;
        });

        it("should return false if the second param is null", () => {
            expect(transformFeatures([featureOne], null)).to.be.false;
        });

        it("should return false if the second param is undefined", () => {
            expect(transformFeatures([featureOne], undefined)).to.be.false;
        });

        it("should return false if the second param is a number", () => {
            expect(transformFeatures([featureOne], 666)).to.be.false;
        });

        it("should return false if the second param is a boolean", () => {
            expect(transformFeatures([featureOne], true)).to.be.false;
        });

        it("should return false if the second param is an array", () => {
            expect(transformFeatures([featureOne], [])).to.be.false;
        });

        it("should call an error if the second param is not a string", () => {
            transformFeatures([featureOne], true);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the third param is an object", () => {
            expect(transformFeatures([featureOne], "", {})).to.be.false;
        });

        it("should return false if the third param is null", () => {
            expect(transformFeatures([featureOne], "", null)).to.be.false;
        });

        it("should return false if the third param is undefined", () => {
            expect(transformFeatures([featureOne], "", undefined)).to.be.false;
        });

        it("should return false if the third param is a number", () => {
            expect(transformFeatures([featureOne], "", 666)).to.be.false;
        });

        it("should return false if the third param is a boolean", () => {
            expect(transformFeatures([featureOne], "", true)).to.be.false;
        });

        it("should return false if the third param is an array", () => {
            expect(transformFeatures([featureOne], "", [])).to.be.false;
        });

        it("should call an error if the third param is not a string", () => {
            transformFeatures([featureOne], "", true);
            expect(console.error.calledOnce).to.be.true;
        });

        it.skip("should return the transformed features", () => {
            const features = transformFeatures([featureOne, featureTwo], "EPSG:4326", "EPSG:25832");

            expect(features[0].getGeometry()).to.deep.equal(featureOne.getGeometry());
            expect(features[1].getGeometry()).to.deep.equal(featureTwo.getGeometry());
        });
    });
});
