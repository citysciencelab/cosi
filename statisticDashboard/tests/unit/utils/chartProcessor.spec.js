import {expect} from "chai";
import chartProcessor from "../../../utils/chartProcessor";

describe("addons/statisticDashboard/utils/chartProcessor.js", () => {
    describe("parsePreparedDataToLineChartFormat", () => {
        it("should return an empty object if given param is not an object", () => {
            expect(chartProcessor.parsePreparedDataToLineChartFormat(null)).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat(undefined)).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat([])).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat(true)).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat(false)).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat(1234)).to.be.an("object").that.is.empty;
            expect(chartProcessor.parsePreparedDataToLineChartFormat("1234")).to.be.an("object").that.is.empty;
        });
        it("should return an empty object if an empty object is given", () => {
            expect(chartProcessor.parsePreparedDataToLineChartFormat({})).to.be.deep.equal({datasets: [], labels: []});
        });
        it("should return expected object", () => {
            const param = {
                    "foo": {"bar": [1, 2, 3], "bow": [2, 3, 4]}
                },
                expected = {
                    datasets: [
                        {
                            fill: false,
                            label: "foo",
                            data: [[1, 2, 3], [2, 3, 4]],
                            backgroundColor: "rgba(240, 248, 255, 1)",
                            borderColor: "rgba(240, 248, 255, 1)"
                        }
                    ],
                    labels: ["bar", "bow"]
                };

            expect(chartProcessor.parsePreparedDataToLineChartFormat(param)).to.be.deep.equal(expected);
        });
    });
    describe("parsePreparedDataToBarChartFormat", () => {
        it("should return an empty array if no object is given", () => {
            expect(chartProcessor.parsePreparedDataToBarChartFormat(null)).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat(undefined)).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat([])).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat(true)).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat(false)).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat(1234)).to.be.an("array").that.is.empty;
            expect(chartProcessor.parsePreparedDataToBarChartFormat("1234")).to.be.an("array").that.is.empty;
        });
        it("should return an empty array if given object is empty", () => {
            expect(chartProcessor.parsePreparedDataToBarChartFormat({})).to.be.an("array").that.is.empty;
        });
        it("should return expected array", () => {
            const param = {
                    "foo": {
                        "bar": 1
                    },
                    "bow": {
                        "bar": 2
                    }
                },
                expected = [1, 2];

            expect(chartProcessor.parsePreparedDataToBarChartFormat(param)).to.be.deep.equal(expected);
        });
    });
    describe("getYearFromPreparedData", () => {
        it("should return an empty String if no object is given", () => {
            expect(chartProcessor.getYearFromPreparedData(null)).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData(undefined)).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData([])).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData(true)).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData(false)).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData(1234)).to.be.equal("");
            expect(chartProcessor.getYearFromPreparedData("1234")).to.be.equal("");
        });
        it("should return an empty String if no object is given", () => {
            const param = {
                    "foo": {
                        "2001": 1
                    }
                },
                expected = "2001";

            expect(chartProcessor.getYearFromPreparedData(param)).to.be.deep.equal(expected);
        });
    });
    describe("getBarChartColors", () => {
        it("should return an empty String if first param is not an Array", () => {
            expect(chartProcessor.getBarChartColors(null, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors(undefined, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors({}, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors(true, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors(false, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors(1234, [""])).to.be.equal("");
            expect(chartProcessor.getBarChartColors("1234", [""])).to.be.equal("");
        });
        it("should return second color if number is negative", () => {
            const param = [-2],
                color = ["#E28574", "#89C67F"];

            expect(chartProcessor.getBarChartColors(param, color)).to.deep.equal(["#E28574"]);
        });
        it("should return first color if number is positive", () => {
            const param = [2],
                color = ["#E28574", "#89C67F"];

            expect(chartProcessor.getBarChartColors(param, color)).to.deep.equal(["#89C67F"]);
        });
    });
    describe("splitTextByWordAndChunkSize", () => {
        it("should split text into chunks without breaking words", () => {
            const inputText = "This is a sample text that should be split into chunks.",
                chunkSize = 10,
                expectedResult = [
                    "This is a",
                    "sample text",
                    "that should",
                    "be split",
                    "into",
                    "chunks."
                ],
                result = chartProcessor.splitTextByWordAndChunkSize(inputText, chunkSize);

            expect(result).to.deep.equal(expectedResult);
        });

        it("should handle an empty input text", () => {
            const inputText = "",
                chunkSize = 10,
                expectedResult = [""],
                result = chartProcessor.splitTextByWordAndChunkSize(inputText, chunkSize);

            expect(result).to.deep.equal(expectedResult);
        });

        it("should handle a single word that exceeds the chunk size", () => {
            const inputText = "Supercalifragilisticexpialidocious",
                chunkSize = 5,
                expectedResult = ["Supercalifragilisticexpialidocious"],
                result = chartProcessor.splitTextByWordAndChunkSize(inputText, chunkSize);

            expect(result).to.deep.equal(expectedResult);
        });
    });
});
