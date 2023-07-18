import {expect} from "chai";
import sortArrays from "../../utils/sortArrays";

describe("sortArrays", () => {
    it("should sort the dwell time array", () => {
        const inputData = ["240+", "120-240", "30-60"],
            expectedOutput = ["30-60", "120-240", "240+"];

        let result = sortArrays.sortDwellTimeArray(inputData);

        expect(result).to.deep.equal(expectedOutput);

        result = sortArrays.sortDwellTimeArray([]);
        expect(result).to.deep.equal([]);

        result = sortArrays.sortDwellTimeArray(null);
        expect(result).to.deep.equal([]);
    });
    it("should sort the age groups array", () => {
        const inputData = ["[60-69]", "[30-39]", ">69", "[20-29]"],
            expectedOutput = ["20-29", "30-39", "60-69", ">69"];

        let result = sortArrays.sortAgeGroupsArray(inputData);

        expect(result).to.deep.equal(expectedOutput);

        result = sortArrays.sortAgeGroupsArray([]);
        expect(result).to.deep.equal([]);

        result = sortArrays.sortAgeGroupsArray(null);
        expect(result).to.deep.equal([]);
    });
});
