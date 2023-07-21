import {expect} from "chai";
import {geometryToGeoJson} from "../../geometry/convertToGeoJson";
import sinon from "sinon";
import {Point} from "ol/geom";

describe("utils/geometry/convertToGeoJson", () => {
    const point = new Point([88, 88]);

    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("geometryToGeoJson", () => {
        it("should return false if the given parameter is an object", () => {
            expect(geometryToGeoJson({})).to.be.false;
        });

        it("should return false if the given parameter is undefined", () => {
            expect(geometryToGeoJson(undefined)).to.be.false;
        });

        it("should return false if the given parameter is a boolean", () => {
            expect(geometryToGeoJson(true)).to.be.false;
        });

        it("should return false if the given parameter is a string", () => {
            expect(geometryToGeoJson("string")).to.be.false;
        });

        it("should return false if the given parameter is null", () => {
            expect(geometryToGeoJson(null)).to.be.false;
        });

        it("should return false if the given parameter is a number", () => {
            expect(geometryToGeoJson(666)).to.be.false;
        });

        it("should return false if the given parameter is an array", () => {
            expect(geometryToGeoJson([])).to.be.false;
        });

        it("should return a GeoJSON geometry if the given parameter an ol geometry", () => {
            expect(geometryToGeoJson(point)).to.be.an("object").that.has.all.keys("type", "coordinates");
        });

        it("should call an error if the given parameter is not an ol geometry", () => {
            geometryToGeoJson({});
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return false if the second passed parameter is an object", () => {
            expect(geometryToGeoJson(point, {})).to.be.false;
        });

        it("should return false if the second passed parameter is an array", () => {
            expect(geometryToGeoJson(point, [])).to.be.false;
        });

        it("should return false if the second passed parameter is a string", () => {
            expect(geometryToGeoJson(point, "")).to.be.false;
        });

        it("should return false if the second passed parameter is a number", () => {
            expect(geometryToGeoJson(point, 666)).to.be.false;
        });

        it("should return false if the second passed parameter is null", () => {
            expect(geometryToGeoJson(point, null)).to.be.false;
        });

        it("should call an error if the second passend parameter is not a boolean or undefined", () => {
            geometryToGeoJson({});
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return a GeoJSON Geometry if the second passed parameter is undefined", () => {
            expect(geometryToGeoJson(point, undefined)).to.be.an("object").that.has.all.keys("type", "coordinates");
        });

        it("should return a GeoJSON Geometry if the second passed parameter is false", () => {
            expect(geometryToGeoJson(point, false)).to.be.an("object").that.has.all.keys("type", "coordinates");
        });

        it("should return a GeoJSON Geometry as string if the second passed parameter is true", () => {
            expect(geometryToGeoJson(point, true)).to.be.a("string");
        });

        it("should return false if the third passed parameter is an object", () => {
            expect(geometryToGeoJson(point, undefined, {})).to.be.false;
        });

        it("should return false if the third passed parameter is an array", () => {
            expect(geometryToGeoJson(point, undefined, [])).to.be.false;
        });

        it("should return false if the third passed parameter is a number", () => {
            expect(geometryToGeoJson(point, undefined, 666)).to.be.false;
        });

        it("should return false if the third passed parameter is a boolean", () => {
            expect(geometryToGeoJson(point, undefined, true)).to.be.false;
        });

        it("should return false if the third passed parameter is null", () => {
            expect(geometryToGeoJson(point, undefined, null)).to.be.false;
        });

        it("should call an error if the third passed parameter is not a boolean or undefined", () => {
            geometryToGeoJson(point, undefined, 666);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return a GeoJSON Geometry if the third passed parameter is undefined", () => {
            expect(geometryToGeoJson(point, undefined, undefined)).to.be.an("object").that.has.all.keys("type", "coordinates");
        });

        it("should return false if the fourth passed parameter is an object", () => {
            expect(geometryToGeoJson(point, undefined, undefined, {})).to.be.false;
        });

        it("should return false if the fourth passed parameter is an array", () => {
            expect(geometryToGeoJson(point, undefined, undefined, [])).to.be.false;
        });

        it("should return false if the fourth passed parameter is a number", () => {
            expect(geometryToGeoJson(point, undefined, undefined, 666)).to.be.false;
        });

        it("should return false if the fourth passed parameter is a boolean", () => {
            expect(geometryToGeoJson(point, undefined, undefined, true)).to.be.false;
        });

        it("should return false if the fourth passed parameter is null", () => {
            expect(geometryToGeoJson(point, undefined, undefined, null)).to.be.false;
        });

        it("should call an error if the fourth passed parameter is not a boolean or undefined", () => {
            geometryToGeoJson(point, undefined, undefined, 666);
            expect(console.error.calledOnce).to.be.true;
        });

        it("should return a GeoJSON Geometry if the fourth passed parameter is undefined", () => {
            expect(geometryToGeoJson(point, undefined, undefined, undefined)).to.be.an("object").that.has.all.keys("type", "coordinates");
        });
    });

});
