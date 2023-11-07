import {expect} from "chai";
import {uniq} from "../../array/uniq";
import sinon from "sinon";

describe("utils/array/uniq", () => {
    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    it("should return false if the given parameter is an object", () => {
        expect(uniq({})).to.be.false;
    });

    it("should return false if the given parameter is undefined", () => {
        expect(uniq(undefined)).to.be.false;
    });

    it("should return false if the given parameter is a boolean", () => {
        expect(uniq(true)).to.be.false;
    });

    it("should return false if the given parameter is a string", () => {
        expect(uniq("string")).to.be.false;
    });

    it("should return false if the given parameter is null", () => {
        expect(uniq(null)).to.be.false;
    });

    it("should return false if the given parameter is a number", () => {
        expect(uniq(666)).to.be.false;
    });

    it("should call an error if the given parameter is not an array", () => {
        uniq(666);
        expect(console.error.calledOnce).to.be.true;
    });

    it("should return the expected array", () => {
        const firstArray = [1, 2, 1, true, "3", true, false, "666", "3"],
            expectedArray = [1, 2, true, "3", false, "666"];

        expect(uniq(firstArray)).to.deep.equal(expectedArray);
    });
});
