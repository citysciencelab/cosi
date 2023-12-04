import {
    getValue,
    getValueClass,
    getValueTooltip,
    isValueCalculated
} from "../../../utils/tableCells.js";
import {expect} from "chai/index";
import selectedDistrictLevel from "../components/mock.districtLevel.js";

describe("Dashboard/utils/tableCells", () => {
    const item = {
            "39003": {
                "jahr_2020": "2266",
                "isModified": 2020
            }
        },
        itemTwo = {
            "Wolkenkuckucksheim": {
                "jahr_2012": "150"
            },
            "valueType": "relative",
            "calculation": {
                "operation": "divide",
                "category_A": "Arbeitslose insgesamt",
                "category_B": "Bevölkerung insgesamt",
                "modifier": 100
            }
        },
        header = {value: "39003"},
        timestamp = 2020;

    describe("getValue", () => {
        it("should return default -", () => {
            expect(getValue({})).to.be.equal("-");
            expect(getValue({}, {})).to.be.equal("-");
            expect(getValue({}, {}, "")).to.be.equal("-");
        });

        it("should return default '-' if no object is given", () => {
            expect(getValue([])).to.be.equal("-");
            expect(getValue(true)).to.be.equal("-");
            expect(getValue(666)).to.be.equal("-");
            expect(getValue("666")).to.be.equal("-");
            expect(getValue(undefined)).to.be.equal("-");
            expect(getValue(null)).to.be.equal("-");
        });

        it("should return the parsed value", () => {
            expect(getValue.call({currentLocale: "de-DE"}, item, header, timestamp)).to.be.equal("2.266");
        });

        it("should return the calculated value", () => {
            expect(getValue(itemTwo, {value: "Wolkenkuckucksheim"}, timestamp, selectedDistrictLevel.districts)).to.be.equal("16,32");
        });
    });

    describe("getValueClass", () => {
        it("should return empty string", () => {
            expect(getValueClass(item, header, 2019)).to.be.equal("");
            expect(getValueClass(item, header, null)).to.be.equal("");
            expect(getValueClass(item, header, false)).to.be.equal("");
            expect(getValueClass(item, header, {})).to.be.equal("");
            expect(getValueClass(item, header, [])).to.be.equal("");
        });

        it("should return string 'modified'", () => {
            expect(getValueClass(item, header, 2020)).to.be.equal("modified");
            expect(getValueClass(item, header, 2021)).to.be.equal("modified");
            expect(getValueClass(item, header, 2022)).to.be.equal("modified");
        });
    });

    describe("getValueTooltip", () => {
        it("should return undfined", () => {
            expect(getValueTooltip(item, header, 2019)).to.be.undefined;
            expect(getValueTooltip(item, header, null)).to.be.undefined;
            expect(getValueTooltip(item, header, false)).to.be.undefined;
            expect(getValueTooltip(item, header, {})).to.be.undefined;
            expect(getValueTooltip(item, header, [])).to.be.undefined;
        });
    });

    describe("isValueCalculated", () => {
        it("should return false if first param is not an object", () => {
            expect(isValueCalculated(undefined)).to.be.false;
            expect(isValueCalculated([])).to.be.false;
            expect(isValueCalculated(null)).to.be.false;
            expect(isValueCalculated(true)).to.be.false;
            expect(isValueCalculated(false)).to.be.false;
            expect(isValueCalculated(1234)).to.be.false;
            expect(isValueCalculated("1234")).to.be.false;
        });
        it("should return false if the second param is not an object", () => {
            expect(isValueCalculated({}, undefined)).to.be.false;
            expect(isValueCalculated({}, [])).to.be.false;
            expect(isValueCalculated({}, null)).to.be.false;
            expect(isValueCalculated({}, true)).to.be.false;
            expect(isValueCalculated({}, false)).to.be.false;
            expect(isValueCalculated({}, 1234)).to.be.false;
            expect(isValueCalculated({}, "1234")).to.be.false;
        });
        it("should return true if the value is calculated", () => {
            expect(isValueCalculated({foo: {isCalculated: true}}, {value: "foo"})).to.be.true;
        });
    });
});
