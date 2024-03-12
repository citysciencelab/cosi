import {
    groupDataByKey,
    prepareTableExport,
    prepareTableExportWithTimeline
} from "../../../utils/export.js";
import {expect} from "chai/index";
import sinon from "sinon";
import data from "../data.json";
import expectedExportData from "../expectedExportData.json";

describe("Dashboard/utils/export", () => {
    beforeEach(function () {
        sinon.spy(console, "error");
    });

    afterEach(function () {
        console.error.restore();
        sinon.restore();
    });

    describe("prepareTableExport", () => {
        it("should return null if the parameter data is not array", () => {
            expect(prepareTableExport({})).to.be.null;
            expect(prepareTableExport(true)).to.be.null;
            expect(prepareTableExport("test")).to.be.null;
            expect(prepareTableExport(undefined)).to.be.null;
            expect(prepareTableExport(null)).to.be.null;
            expect(prepareTableExport(42)).to.be.null;
        });
    });

    describe("prepareTableExportWithTimeline", () => {
        it("should return null if the parameter data is not array", () => {
            expect(prepareTableExportWithTimeline({})).to.be.null;
            expect(prepareTableExportWithTimeline(true)).to.be.null;
            expect(prepareTableExportWithTimeline("test")).to.be.null;
            expect(prepareTableExportWithTimeline(undefined)).to.be.null;
            expect(prepareTableExportWithTimeline(null)).to.be.null;
            expect(prepareTableExportWithTimeline(42)).to.be.null;
        });

        it.skip("prepareTableExportWithTimeline should not reverse timestamps argument", () => {
            const timestamps = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
                timestampsCopy = [...timestamps],
                exportData = prepareTableExportWithTimeline(data, ["Altona"], timestampsCopy, "jahr_");

            expect(exportData).to.be.eql(expectedExportData);
            expect(timestampsCopy).to.be.eql(timestamps);
        });
    });

    describe("groupDataByKey", () => {
        it("should return null if first param is not an array", () => {
            expect(groupDataByKey(undefined)).to.be.null;
            expect(groupDataByKey({})).to.be.null;
            expect(groupDataByKey(null)).to.be.null;
            expect(groupDataByKey(true)).to.be.null;
            expect(groupDataByKey(false)).to.be.null;
            expect(groupDataByKey(1234)).to.be.null;
            expect(groupDataByKey("1234")).to.be.null;
        });
        it("should return null if second param is not a string", () => {
            expect(groupDataByKey([], undefined)).to.be.null;
            expect(groupDataByKey([], {})).to.be.null;
            expect(groupDataByKey([], [])).to.be.null;
            expect(groupDataByKey([], null)).to.be.null;
            expect(groupDataByKey([], true)).to.be.null;
            expect(groupDataByKey([], false)).to.be.null;
            expect(groupDataByKey([], 1234)).to.be.null;
        });
        it("should return an object with key as group key and value the group values", () => {
            const tmpData = [
                    {
                        "foo": "foo",
                        "bar": "bar1",
                        "boo": "boo"
                    },
                    {
                        "foo": "fo1",
                        "bar": "bar2",
                        "boo": "bo1"
                    }
                ],
                key = "bar",
                expected = {
                    "bar1": [{"foo": "foo", "boo": "boo"}],
                    "bar2": [{"foo": "fo1", "boo": "bo1"}]
                };

            expect(groupDataByKey(tmpData, key)).to.deep.equal(expected);
        });
    });
});
