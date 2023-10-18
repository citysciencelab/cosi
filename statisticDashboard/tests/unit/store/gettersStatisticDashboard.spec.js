import {expect} from "chai";
import getters from "../../../store/gettersStatisticDashboard.js";

describe("addons/statisticDashboard/store/gettersStatisticDashboard.js", () => {
    describe("selectedDatesValues", () => {
        it("should return an empty array if no date are selected", () => {
            const values = getters.selectedDatesValues(null, {selectedDates: []});

            expect(values).to.be.empty;
        });

        it("should return the values of the selected dates", () => {
            const selectedDates = [{value: "2020"}, {value: ["2021", "2022"]}];

            expect(getters.selectedDatesValues(null, {selectedDates})).to.deep.equals(["2020", "2021", "2022"]);
        });
    });

    describe("selectedRegionsValues", () => {
        it("should remove empty array", () => {
            expect(getters.selectedRegionsValues(null, {selectedRegion: 0})).to.deep.equals([]);
            expect(getters.selectedRegionsValues(null, {selectedRegion: null})).to.deep.equals([]);
            expect(getters.selectedRegionsValues(null, {selectedRegion: false})).to.deep.equals([]);
            expect(getters.selectedRegionsValues(null, {selectedRegion: ""})).to.deep.equals([]);
            expect(getters.selectedRegionsValues(null, {selectedRegion: []})).to.deep.equals([]);
            expect(getters.selectedRegionsValues(null, {selectedRegion: {}})).to.deep.equals([]);
        });

        it("should get values of selected regions", () => {
            const selectedRegions = [{
                value: "Schwerin",
                label: "Schwerin"
            },
            {
                value: "Harburg",
                label: "Harburg"
            }];

            expect(getters.selectedRegionsValues(null, {selectedRegions})).to.deep.equals(["Schwerin", "Harburg"]);
        });

        it("should get values of selected regions", () => {
            const selectedRegions = [{
                value: "Schwerin",
                label: "Schwerin"
            },
            {
                value: "Harburg",
                label: "Harburg"
            },
            {
                value: ["Harburg", "Lübeck", "Schwerin"],
                label: "Alle Gebiete"
            }];

            expect(getters.selectedRegionsValues(null, {selectedRegions})).to.deep.equals(["Harburg", "Lübeck", "Schwerin"]);
        });
    });
});
