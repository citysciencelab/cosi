import uniqueAbv from "../../../utils/uniqueAbv";
import {expect} from "chai/index";
import { uniq } from "shelljs";
import sinon from "sinon";

describe("SelectionManager/utils/uniqueAbv", () => {
    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("create unique abbreviation from id", () => {
        it("should return a different id, if the id is already found in selections", () => {
            const result = uniqueAbv("Test", "Test", ["T", "T-0"], 0);

            expect(result).to.equal("T-1");
        });
    });
});
