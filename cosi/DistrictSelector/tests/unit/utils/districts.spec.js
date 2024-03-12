import {getDistrictByName, getStatisticByCategory} from "../../../utils/districts.js";
import {expect} from "chai/index";
import Feature from "ol/Feature";

describe("DistrictSelector/utils/districts", () => {
    describe("getDistrictByName", () => {
        it("should return undefined if the first param is not an array", () => {
            expect(getDistrictByName({})).to.be.undefined;
            expect(getDistrictByName(123)).to.be.undefined;
            expect(getDistrictByName("666")).to.be.undefined;
            expect(getDistrictByName(false)).to.be.undefined;
            expect(getDistrictByName(null)).to.be.undefined;
            expect(getDistrictByName(undefined)).to.be.undefined;
        });

        it("should return undefined if the second param is not a string", () => {
            expect(getDistrictByName([], {})).to.be.undefined;
            expect(getDistrictByName([], 123)).to.be.undefined;
            expect(getDistrictByName([], ["666"])).to.be.undefined;
            expect(getDistrictByName([], false)).to.be.undefined;
            expect(getDistrictByName([], null)).to.be.undefined;
            expect(getDistrictByName([], undefined)).to.be.undefined;
        });

        it("should return undefind if the district was not found", () => {
            const districts = [
                {
                    getName: () => "Det"
                },
                {
                    getName: () => "Edi"
                }
            ];

            expect(getDistrictByName(districts, "Berti")).to.be.undefined;
        });

        it("should find the correct dsitrict", () => {
            const districts = [
                {
                    getName: () => "Det"
                },
                {
                    getName: () => "Edi"
                }
            ];

            expect(getDistrictByName(districts, "Det")).to.deep.equal(districts[0]);
        });
    });

    describe("getStatisticByCategory", () => {
        const district = {
            statFeatures: [
                new Feature({
                    kategorie: "Vegan"
                }),
                new Feature({
                    kategorie: "Vegetarisch"
                })
            ]
        };

        it("should return undefined if the first param is not an object", () => {
            expect(getStatisticByCategory([])).to.be.undefined;
            expect(getStatisticByCategory(123)).to.be.undefined;
            expect(getStatisticByCategory("666")).to.be.undefined;
            expect(getStatisticByCategory(false)).to.be.undefined;
            expect(getStatisticByCategory(null)).to.be.undefined;
            expect(getStatisticByCategory(undefined)).to.be.undefined;
        });

        it("should return undefined if the second param is not a string", () => {
            expect(getStatisticByCategory(district, {})).to.be.undefined;
            expect(getStatisticByCategory(district, 123)).to.be.undefined;
            expect(getStatisticByCategory(district, ["666"])).to.be.undefined;
            expect(getStatisticByCategory(district, false)).to.be.undefined;
            expect(getStatisticByCategory(district, null)).to.be.undefined;
            expect(getStatisticByCategory(district, undefined)).to.be.undefined;
        });

        it("should return undefind if the statistic was not found", () => {
            expect(getStatisticByCategory(district, "Aasfresser")).to.be.undefined;
        });

        it("should find the correct statistic", () => {
            expect(getStatisticByCategory(district, "Vegan")).to.deep.equal(district.statFeatures[0]);
        });
    });
});
