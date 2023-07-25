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
        it("should return the parsed value", () => {
            expect(getValue.call({currentLocale: "de-DE"}, item, header, timestamp)).to.be.equal("2.266");
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
