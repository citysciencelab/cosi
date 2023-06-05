import {expect} from "chai";
import {changeDateFormat} from "../../utils/changeDateFormat";

describe("changeDateFormat", () => {
    it("should return the correctly formatted date", () => {
        const inputDate = "2023-06-01",
            expectedOutput = "06-2023",

            result = changeDateFormat(inputDate);

        expect(result).to.equal(expectedOutput);
    });
});
