import testAction from "../../../../../../test/unittests/VueTestUtils";
import actions from "../../../../store/actions/actionsSchoolRoutePlanningSchoolWay";
import {expect} from "chai";
import sinon from "sinon";

const {
    selectSchool,
    prepareWayToSchoolRequest,
    parseResponseWayToSchool,
    parseRouteElements,
    parseRoute
} = actions;

before(() => {
    i18next.init({
        lng: "cimode",
        debug: false
    });
});


describe("addons/schoolRoutePlanning/store/actions/actionsSchoolRoutePlanningSchoolWay.js", () => {
    describe("selectSchool", () => {
        it("selectSchool from school list and set geometry", done => {
            const state = {
                    inputAddress: "Mickey-Mouse-Street 1",
                    schools: [
                        {
                            name: "school1",
                            schul_id: "5801-0",
                            get: () => "5801-0",
                            getGeometry: () => [100, 200]
                        },
                        {
                            name: "school2",
                            schul_id: "5701-0",
                            get: () => "5701-0",
                            getGeometry: () => [200, 200]
                        }
                    ],
                    houseNumbers: [
                        {
                            name: "Mickey-Mouse-Street 1",
                            geometry: {
                                coordinates: ["100", "200"]
                            }
                        },
                        {
                            name: "Mickey-Mouse-Street 2",
                            geometry: {
                                coordinates: ["100", "200"]
                            }
                        },
                        {
                            name: "Mickey-Mouse-Street 3",
                            geometry: {
                                coordinates: ["100", "200"]
                            }
                        },
                        {
                            name: "Mickey-Mouse-Street 3a",
                            geometry: {
                                coordinates: ["100", "200"]
                            }
                        }
                    ]
                },
                payload = {
                    selectedSchoolId: "5801-0",
                    layer: {
                        getSource: () => "The layer"
                    }
                };

            testAction(selectSchool, payload, state, {}, [
                {type: "setSelectedSchool", payload: state.schools[0]},
                {type: "setGeometryByFeatureId", payload: {
                    id: "endPoint",
                    source: payload.layer.getSource(),
                    geometry: state.schools[0].getGeometry()
                }, dispatch: true},
                {type: "prepareWayToSchoolRequest", payload: {
                    selectedHouseNumber: state.houseNumbers[0],
                    selectedSchoolId: "5801-0"
                }, dispatch: true}
            ], {}, done);
        });
    });

    describe("prepareWayToSchoolRequest", () => {
        it("prepareWayToSchoolRequest sets the selectedAddress and the wpsPayload", done => {
            const state = {
                    inputAddress: "abc 10a",
                    streetNames: ["abc", "def"]
                },
                payload = {
                    selectedSchoolId: "5810-0",
                    selectedHouseNumber: {
                        properties: {
                            hausnummer: {
                                _: "10"
                            },
                            hausnummernzusatz: {
                                _: "a"
                            }
                        }
                    }
                };

            testAction(prepareWayToSchoolRequest, payload, state, {}, [
                {type: "setSelectedAddress", payload: "abc 10a"},
                {type: "requestWayToSchool", payload: {
                    "Schul-ID": {
                        "dataType": "string",
                        "value": "5810-0"
                    },
                    "SchuelerStrasse": {
                        "dataType": "string",
                        "value": "abc"
                    },
                    "SchuelerHausnr": {
                        "dataType": "integer",
                        "value": 10
                    },
                    "SchuelerZusatz": {
                        "dataType": "string",
                        "value": "a"
                    },
                    "RouteAusgeben": {
                        "dataType": "boolean",
                        "value": 1
                    }
                }, dispatch: true}
            ], {}, done);
        });

        it("prepareWayToSchoolRequest adds the wpsTimeout attribute by default", done => {
            const state = {
                    inputAddress: "abc 10a",
                    streetNames: ["abc", "def"],
                    wpsTimeout: {
                        "tm_ttl": {
                            "dataType": "integer",
                            "value": 50
                        }
                    }
                },
                payload = {
                    selectedSchoolId: "5810-0",
                    selectedHouseNumber: {
                        properties: {
                            hausnummer: {
                                _: "10"
                            },
                            hausnummernzusatz: {
                                _: "a"
                            }
                        }
                    }
                };

            testAction(prepareWayToSchoolRequest, payload, state, {}, [
                {type: "setSelectedAddress", payload: "abc 10a"},
                {type: "requestWayToSchool", payload: {
                    "Schul-ID": {
                        "dataType": "string",
                        "value": "5810-0"
                    },
                    "SchuelerStrasse": {
                        "dataType": "string",
                        "value": "abc"
                    },
                    "SchuelerHausnr": {
                        "dataType": "integer",
                        "value": 10
                    },
                    "SchuelerZusatz": {
                        "dataType": "string",
                        "value": "a"
                    },
                    "RouteAusgeben": {
                        "dataType": "boolean",
                        "value": 1
                    },
                    "tm_ttl": {
                        "dataType": "integer",
                        "value": 50
                    }
                }, dispatch: true}
            ], {}, done);
        });

        it("prepareWayToSchoolRequest don't adds the wpsTimeout attribute if wpsTimeout is an empty object", done => {
            const state = {
                    inputAddress: "abc 10a",
                    streetNames: ["abc", "def"],
                    wpsTimeout: {}
                },
                payload = {
                    selectedSchoolId: "5810-0",
                    selectedHouseNumber: {
                        properties: {
                            hausnummer: {
                                _: "10"
                            },
                            hausnummernzusatz: {
                                _: "a"
                            }
                        }
                    }
                };

            testAction(prepareWayToSchoolRequest, payload, state, {}, [
                {type: "setSelectedAddress", payload: "abc 10a"},
                {type: "requestWayToSchool", payload: {
                    "Schul-ID": {
                        "dataType": "string",
                        "value": "5810-0"
                    },
                    "SchuelerStrasse": {
                        "dataType": "string",
                        "value": "abc"
                    },
                    "SchuelerHausnr": {
                        "dataType": "integer",
                        "value": 10
                    },
                    "SchuelerZusatz": {
                        "dataType": "string",
                        "value": "a"
                    },
                    "RouteAusgeben": {
                        "dataType": "boolean",
                        "value": 1
                    }
                }, dispatch: true}
            ], {}, done);
        });
    });

    describe("parseResponseWayToSchool", () => {
        it("The routeElements are unefined", done => {
            const payload = {
                response: {
                    ExecuteResponse: {
                        ProcessOutputs: {
                            Output: {
                                Data: {
                                    ComplexData: {
                                        Schulweg: undefined,
                                        serviceResponse: {
                                            statusInfo: {
                                                message: "Vegeta"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            testAction(parseResponseWayToSchool, payload, {}, {}, [
                {type: "Alerting/addSingleAlert", payload:
                    i18next.t("additional:modules.tools.schoolRoutePlanning.responseError", {
                        errorMessage: "Vegeta"
                    }), dispatch: true}
            ], {}, done);
        });

        it("The routeElements are not undefined and status 200", done => {
            const payload = {
                response: {
                    ExecuteResponse: {
                        ProcessOutputs: {
                            Output: {
                                Data: {
                                    ComplexData: {
                                        Schulweg: {
                                            Ergebnis: {
                                                route: ["Son Goku", "Son Gohan"],
                                                ErrorOccured: "no"
                                            }
                                        },
                                        serviceResponse: {
                                            statusInfo: {
                                                message: "Vegeta"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                status: 200
            };

            testAction(parseResponseWayToSchool, payload, {}, {}, [
                {type: "parseRouteElements", payload: {
                    route: ["Son Goku", "Son Gohan"],
                    ErrorOccured: "no"
                }, dispatch: true}
            ], {}, done);
        });

        it("The routeElements are not undefined but the status is not 200", done => {
            const payload = {
                response: {
                    ExecuteResponse: {
                        ProcessOutputs: {
                            Output: {
                                Data: {
                                    ComplexData: {
                                        Schulweg: {
                                            Ergebnis: {
                                                route: ["Son Goku", "Son Gohan"],
                                                ErrorOccured: "no",
                                                status: "404"
                                            }
                                        },
                                        serviceResponse: {
                                            statusInfo: {
                                                message: "Vegeta"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                status: 404
            };

            testAction(parseResponseWayToSchool, payload, {}, {}, [
                {type: "Alerting/addSingleAlert", payload:
                    i18next.t("additional:modules.tools.schoolRoutePlanning.wpsError", {status: "404"}), dispatch: true}
            ], {}, done);
        });
    });

    describe("parseRouteElements", () => {
        it("parse route elments and start parse route", done => {
            const payload = {
                routenbeschreibung: {
                    part: "The part"
                },
                route: {
                    edge: "The edges"
                },
                kuerzesteStrecke: 100
            };

            testAction(parseRouteElements, payload, {}, {}, [
                {type: "setRouteElements", payload: payload},
                {type: "setRouteDescription", payload: ["The part"]},
                {type: "setRouteLength", payload: "100m"},
                {type: "parseRoute", payload: ["The edges"], dispatch: true}
            ], {}, done);
        });
    });
    describe("parseRoute", () => {
        it("parseRoute", () => {
            const payload = [
                    {
                        attributes: {
                            id: "1"
                        },
                        id: "R2D2",
                        length: "25",
                        wkt: "LINESTRING(571953.8954285234 5933896.703379773,571937.8260000004 5933915.695)"
                    },
                    {
                        attributes: {
                            id: "2"
                        },
                        id: "C3PO",
                        length: "24",
                        wkt: "LINESTRING(571937.8260000004 5933915.695,571925.1399999997 5933956.300000001,571913.9179999996 5933979.132999999)"
                    }
                ],
                commit = sinon.spy();

            parseRoute({commit}, payload);
            expect(commit.calledOnce).to.be.true;
        });
    });
});
