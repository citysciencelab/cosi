import {expect} from "chai";
import {deepCopyState, deepSerialize, serializeToolDatasets, serializeFeatures, serializeNeighborhood, serializeGeometry, hasDeepFeatures} from "../../../utils/serializeState.js";

describe("serializeState", () => {
    describe("serializeFeatures", () => {
        it("should return default if the parameter is not feature and array", () => {
            expect(serializeFeatures(undefined)).to.be.equal(undefined);
            expect(serializeFeatures(null)).to.be.equal(null);
            expect(serializeFeatures(0)).to.be.equal(0);
            expect(serializeFeatures("")).to.be.equal("");
            expect(serializeFeatures(true)).to.be.equal(true);
        });

        it("should return default if the parameter is array but feature", () => {
            expect(serializeFeatures([])).to.be.deep.equal([]);
            expect(serializeFeatures([""])).to.be.deep.equal([""]);
            expect(serializeFeatures([0])).to.be.deep.equal([0]);
            expect(serializeFeatures([undefined])).to.be.deep.equal([undefined]);
            expect(serializeFeatures([true])).to.be.deep.equal([true]);
        });
    });

    describe("hasDeepFeatures", () => {
        it("should not has deep features", () => {
            expect(hasDeepFeatures("Maps", "layerIds", {
                "AccessibilityAnalysis": [
                    "dataSets"
                ],
                "QueryDistricts": [
                    "propertiesMap"
                ]
            })).to.be.equal(undefined);
        });

        it("should has deep features", () => {
            expect(hasDeepFeatures("AccessibilityAnalysis", "dataSets", {
                "AccessibilityAnalysis": [
                    "dataSets"
                ],
                "QueryDistricts": [
                    "propertiesMap"
                ]
            })).to.be.true;
        });
    });

    describe("deepSerialize", () => {
        it("should return default serialized feature if state is not object or array", () => {
            expect(deepSerialize(undefined)).to.be.equal(undefined);
            expect(deepSerialize(null)).to.be.equal(null);
            expect(deepSerialize(0)).to.be.equal(0);
            expect(deepSerialize("")).to.be.equal("");
            expect(deepSerialize(true)).to.be.equal(true);
        });

        it("should return serialized feature if state is an array", () => {
            expect(deepSerialize(["state1", "state2"])).to.be.deep.equal(["state1", "state2"]);
        });

        it("should return serialized feature if state is an object", () => {
            expect(deepSerialize({"key1": "state1", "key2": "state2"})).to.be.deep.equal({"key1": "state1", "key2": "state2"});
        });
    });

    describe("serializeToolDatasets", () => {
        it("should serialize ToolDatasets", () => {
            expect(serializeToolDatasets({"key1": "state1", "key2": "state2"})).to.be.deep.equal({"key1": "state1", "key2": "state2"});
            expect(serializeToolDatasets(["state1", "state2"])).to.be.deep.equal(["state1", "state2"]);
        });
    });

    describe("deepCopyState", () => {
        it("should deep copy state", () => {
            const map = {
                    "Maps": [
                        "layerIds",
                        "center",
                        "zoomLevel"
                    ]
                },
                store = {
                    "Maps": {
                        "center": [
                            569357.0768686167,
                            5935798.562998234
                        ]
                    }
                },
                deepFeatures = {
                    "AccessibilityAnalysis": [
                        "dataSets"
                    ],
                    "QueryDistricts": [
                        "propertiesMap"
                    ]
                };

            expect(deepCopyState(map, store, deepFeatures)).to.be.deep.equal({
                "Maps": {
                    "center": [
                        569357.0768686167,
                        5935798.562998234
                    ],
                    "layerIds": undefined,
                    "zoomLevel": undefined
                }
            });
        });
    });

    describe("serializeGeometry", () => {
        it("should return serialized geometry", () => {
            const geom = {
                getType: () => "point",
                getCoordinates: () => ["1", "2"]
            };

            expect(serializeGeometry(geom)).to.be.deep.equal({
                type: "point",
                coordinates: ["1", "2"]
            });
        });

        it("should return empty object as serialized geometry", () => {
            const geom = {
                getCoordinates: () => ["1", "2"]
            };

            expect(serializeGeometry(geom)).to.be.deep.equal({});
        });
    });

    describe("serializeNeighborhood", () => {
        it("should return empty object as serialized Neighborhood feature", () => {
            expect(serializeNeighborhood("")).to.be.deep.equal({});
            expect(serializeNeighborhood(null)).to.be.deep.equal({});
            expect(serializeNeighborhood(undefined)).to.be.deep.equal({});
            expect(serializeNeighborhood(0)).to.be.deep.equal({});
            expect(serializeNeighborhood(true)).to.be.deep.equal({});
            expect(serializeNeighborhood([])).to.be.deep.equal({});

            expect(serializeNeighborhood({feature: "feature"}, "")).to.be.deep.equal({});
            expect(serializeNeighborhood({feature: "feature"}, null)).to.be.deep.equal({});
            expect(serializeNeighborhood({feature: "feature"}, undefined)).to.be.deep.equal({});
            expect(serializeNeighborhood({feature: "feature"}, 0)).to.be.deep.equal({});
            expect(serializeNeighborhood({feature: "feature"}, true)).to.be.deep.equal({});
            expect(serializeNeighborhood({feature: "feature"}, [])).to.be.deep.equal({});
        });

        it("should return serialized Neighborhood feature", () => {
            const scenarioNeighborhood = {
                    feature: "feature"
                },
                parse = {
                    writeFeatureObject: (val) => val
                };

            expect(serializeNeighborhood(scenarioNeighborhood, parse)).to.be.deep.equal({feature: "feature"});
        });
    });
});
