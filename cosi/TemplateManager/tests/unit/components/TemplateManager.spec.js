import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateManager from "../../../components/TemplateManager.vue";
import TemplateManagerStore from "../../../store/indexTemplateManager";
import Vuetify from "vuetify";
import sinon from "sinon";
import Vue from "vue";
import mapping from "../../../../assets/mapping.json";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);
localVue.use(Vuex);

describe("addons/cosi/TemplateManager/components/TemplateManager.vue", () => {
    let vuetify, store, stubSetMapping;

    const factory = {
        getMount: () => {
            return mount(TemplateManager, {
                store,
                localVue,
                vuetify,
                computed: {
                    name: () => "Hallo",
                    renderToWindow: () => true,
                    resizableWindow: () => false,
                    deactivateGFI: () => true,
                    active: () => true,
                    icon: () => "bi-image"
                }
            });
        }
    };

    beforeEach(() => {
        vuetify = new Vuetify();
        stubSetMapping = sinon.stub();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        TemplateManager: TemplateManagerStore,
                        DistrictSelector: {
                            namespaced: true,
                            mutations: {
                                setMapping: stubSetMapping
                            }
                        }
                    }
                },
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de"
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: () => sinon.stub()
                    }
                }
            },
            getters: {
                uiStyle: () => true,
                mobile: () => sinon.stub()
            }
        });
    });

    describe("Methdos", () => {
        describe("createMappingByTemplates", () => {
            const templates = [
                {
                    meta: {
                        isActive: true,
                        title: "Vielfalt für alle"
                    },
                    state: {
                        Tools: {
                            Dashboard: {
                                statsFeatureFilter: ["Bevölkerung insgesamt", "Bevölkerung ab 65 Jahren", "Diese Statistik gibt es nicht"]
                            }
                        }
                    }
                },
                {
                    meta: {
                        isActive: true,
                        title: "Alle für alle"
                    },
                    state: {
                        Tools: {
                            Dashboard: {
                                statsFeatureFilter: ["Bevölkerung insgesamt"]
                            }
                        }
                    }
                },
                {
                    meta: {
                        isActive: false,
                        title: "Alle für Vielfalt"
                    },
                    state: {
                        Tools: {
                            Dashboard: {
                                statsFeatureFilter: ["Bevölkerung insgesamt", "Einwohner je ha", "Diese Statistik gibt es nicht"]
                            }
                        }
                    }
                }
            ];

            it("should call 'setMapping' if this function is called", () => {
                const wrapper = factory.getMount();

                wrapper.vm.createMappingByTemplates(templates, mapping);
                expect(stubSetMapping.calledOnce).to.be.true;
                sinon.restore();
                wrapper.destroy();
            });

            it("should call 'setMapping' with the expected values", () => {
                const wrapper = factory.getMount(),
                    expectedValues = [
                        {
                            category: "bev_insgesamt",
                            value: "Bevölkerung insgesamt",
                            group: "Vielfalt für alle",
                            valueType: "absolute",
                            stat_gebiet: "112233",
                            stadtteil: "11223344",
                            bezirk: "1122334455"
                        },
                        {
                            category: "bev_ab65",
                            value: "Bevölkerung ab 65 Jahren",
                            group: "Vielfalt für alle",
                            valueType: "absolute",
                            stat_gebiet: "112233",
                            stadtteil: "11223344",
                            summable: true,
                            bezirk: "1122334455"
                        },
                        {
                            category: "bev_insgesamt",
                            value: "Bevölkerung insgesamt",
                            group: "Alle für alle",
                            valueType: "absolute",
                            stat_gebiet: "112233",
                            stadtteil: "11223344",
                            bezirk: "1122334455"
                        }
                    ];

                wrapper.vm.createMappingByTemplates(templates, mapping);
                expect(stubSetMapping.calledWith({}, expectedValues)).to.be.true;
                sinon.restore();
                wrapper.destroy();
            });

            it("should change the group of all stats in the mapping to the title of the template", () => {
                let newMapping = [],
                    mappingGroup = "";

                const templatesWithNoStats = [
                        {
                            meta: {
                                isActive: true,
                                title: "Keine Stats to filter"
                            },
                            state: {
                                Tools: {}
                            }
                        }
                    ],
                    wrapper = factory.getMount();

                wrapper.vm.createMappingByTemplates(templatesWithNoStats, mapping);
                newMapping = stubSetMapping.getCall(0).args[1];
                mappingGroup = newMapping.every(mappingObject => mappingObject.group === "Keine Stats to filter");
                expect(mappingGroup).to.be.true;
                sinon.restore();
                wrapper.destroy();
            });

            it("should call 'setMapping' with the correct values including orientation values", () => {
                const templatesWithOrientationValues = [
                        {
                            meta: {
                                isActive: true,
                                title: "Vielfalt für alle"
                            },
                            state: {
                                Tools: {
                                    Dashboard: {
                                        statsFeatureFilter: ["Bevölkerung insgesamt", "Bevölkerung ab 65 Jahren", "Diese Statistik gibt es nicht"],
                                        orientationValues: [
                                            {
                                                "value": "123",
                                                "statisticName": "Bevölkerung insgesamt"
                                            },
                                            {
                                                "value": "456",
                                                "statisticName": "Bevölkerung ab 65 Jahren"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    wrapper = factory.getMount(),
                    expectedValues = [
                        {
                            category: "bev_insgesamt",
                            value: "Bevölkerung insgesamt",
                            group: "Vielfalt für alle",
                            stat_gebiet: "112233",
                            stadtteil: "11223344",
                            bezirk: "1122334455",
                            valueType: "absolute",
                            orientationValue: "123"
                        },
                        {
                            category: "bev_ab65",
                            value: "Bevölkerung ab 65 Jahren",
                            group: "Vielfalt für alle",
                            stat_gebiet: "112233",
                            stadtteil: "11223344",
                            bezirk: "1122334455",
                            summable: true,
                            valueType: "absolute",
                            orientationValue: "456"
                        }
                    ];

                wrapper.vm.createMappingByTemplates(templatesWithOrientationValues, mapping);
                expect(stubSetMapping.calledWith({}, expectedValues)).to.be.true;
                sinon.restore();
                wrapper.destroy();
            });

        });

        describe("getOrientationValueByStatistic", () => {
            const orientationValues = [
                {
                    "value": "123",
                    "statisticName": "Bevölkerung insgesamt"
                },
                {
                    "value": "789",
                    "statisticName": "Bevölkerung männlich"
                }
            ];

            it("should return the correct orientation value", () => {
                const wrapper = factory.getMount(),
                    orientationValue = wrapper.vm.getOrientationValueByStatistic(orientationValues, "Bevölkerung männlich");

                expect(orientationValue).to.be.equal("789");
                wrapper.destroy();
            });

            it("should return '-' if no orientation value was found", () => {
                const wrapper = factory.getMount(),
                    orientationValue = wrapper.vm.getOrientationValueByStatistic(orientationValues, "Bevölkerung weiblich");

                expect(orientationValue).to.be.equal("-");
                wrapper.destroy();
            });
        });
    });
});
