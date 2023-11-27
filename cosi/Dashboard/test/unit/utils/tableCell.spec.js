import {
    getValue,
    getValueClass,
    getValueTooltip
} from "../../../utils/tableCells.js";
import {expect} from "chai/index";

describe("Dashboard/utils/tableCells", () => {
    const item = {
            "39003": {
                "undefined2020": "2266",
                "isModified": 2020
            },
            "49004": {
                "undefined2020": "10"
            },
            "category": "one"
        },
        itemTwo = {
            "49004": {
                "undefined2020": "150"
            },
            "category": "two"
        },
        itemThree = {
            "49004": {
                "undefined2012": "150"
            },
            "valueType": "relative",
            "calculation": {
                "operation": "divide",
                "category_A": "one",
                "category_B": "two",
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
            expect(getValue(itemThree, {value: "49004"}, timestamp, [item, itemTwo, itemThree])).to.be.equal("6,67");
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
});
