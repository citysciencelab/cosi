import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuetify from "vuetify";
import actionsToolBridge from "../../../store/actionsToolBridge";
import ToolBridge from "../../../store/indexToolBridge";

import sinon from "sinon/pkg/sinon-esm";
import ToolBridgeGetters from "../../../store/gettersToolBridge";
import ToolBridgeComponent from "../../../components/ToolBridge.vue";
import ToolBridgeModule from "../../../store/indexToolBridge";

config.mocks.$t = key => key;

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Vuetify);

global.requestAnimationFrame = (fn) => fn();

let store, wrapper;

describe("addons/cosi/ToolBridge/components/ToolBridge.vue", () => {
    const
        mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            ToolBridge:
                                {
                                    "name": "translate#common:menu.tools.layerClusterToggler",
                                    "icon": "bi-easel3",
                                    "renderToWindow": true

                                }
                        }
                    }
                }
            }
        };

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            addInteraction: sinon.stub(),
            removeInteraction: sinon.stub(),
            addLayer: sinon.spy(),
            getLayers: () => {
                return {
                    getArray: () => [{
                        getVisible: () => true,
                        get: () => "layerId"
                    }],
                    getLength: sinon.spy(),
                    forEach: sinon.spy()
                };
            }
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        ToolBridge: ToolBridgeModule
                    }
                },
                Maps: {
                    namespaced: true,
                    actions: {
                        addNewLayerIfNotExists: sinon.spy()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Tools/ToolBridge/setActive", true);

    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });
    describe("Runs Callback when results received", () => {

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        ToolBridge: ToolBridgeModule
                    }
                },
                Maps: {
                    namespaced: true,
                    actions: {
                        addNewLayerIfNotExists: sinon.spy()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        it("toolbridge runs result callback when results received", () => {

            const testCallback = sinon.spy(),
                testResult = {
                    result: "helloooo",
                    request: {outputCallback: testCallback}
                },
                tbwrapper = shallowMount(ToolBridgeComponent, {store, localVue});

            // call watcher
            tbwrapper.vm.$options.watch.receivedResults.call(tbwrapper.vm, testResult);
            expect(testCallback.calledOnce).to.be.true;

        });

        it("runTool action should commit to relevant store variable", () => {
            // mock toolbridge request
            const testRequest = {toolName: "Dashboard", settings: {}, outputCallback: ()=>{}, updateInterfaceOnly: false},

                // run action
                spycommit = sinon.spy();

            actionsToolBridge.runTool({commit: spycommit, getters: {supportedTools: ["Dashboard"]}}, testRequest);
            expect(spycommit.calledOnce).to.be.true;
        });

    });

    //     describe("Component DOM", () => {

    //         it("The animation container should exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const decButton = wrapper.find(".animation-button");

    //             expect(decButton.exists()).to.be.true;
    //         });

    //         it("The chart icons container should exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const icons = wrapper.find(".icons-function");

    //             expect(icons.exists()).to.be.true;
    //         });

    //         it("Each animation button should exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".animation-button").findAllComponents({name: "v-icon"});

    //             expect(buttonWrapperArray.exists()).to.be.true;
    //             expect(buttonWrapperArray).to.have.lengthOf(3);
    //         });

    //         it("Each chart icon should exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"});

    //             expect(buttonWrapperArray.exists()).to.be.true;
    //             expect(buttonWrapperArray).to.have.lengthOf(3);
    //         });

    //         it("The slider range container should exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const sliderRange = wrapper.find(".slider-range");

    //             expect(sliderRange.exists()).to.be.true;
    //         });

    //         it("Chart container should not exist", () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const chart = wrapper.find(".chart");

    //             expect(chart.exists()).to.be.false;
    //         });
    //     });

    //     describe("User Interactions", () => {
    //         it("Bar Chart should exist", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[0].trigger("click");
    //             expect(spyOpenChart.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.true;
    //         });

    //         it("Bar Chart should disappear", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[0].trigger("click");
    //             await buttonWrapperArray.wrappers[0].trigger("click");
    //             expect(spyOpenChart.calledTwice).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.false;
    //         });

    //         it("Line Chart should exist", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[1].trigger("click");
    //             expect(spyOpenChart.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.true;
    //         });

    //         it("Line Chart should disappear", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[1].trigger("click");
    //             await buttonWrapperArray.wrappers[1].trigger("click");
    //             expect(spyOpenChart.calledTwice).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.false;
    //         });

    //         it("Pie Chart should exist", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[2].trigger("click");
    //             expect(spyOpenChart.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.true;
    //         });

    //         it("Pie Chart should disappear", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".icons-function").findAllComponents({name: "v-icon"}),
    //                 spyOpenChart = sinon.spy(wrapper.vm, "openChart");

    //             await buttonWrapperArray.wrappers[2].trigger("click");
    //             await buttonWrapperArray.wrappers[2].trigger("click");
    //             expect(spyOpenChart.calledTwice).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.find(".chart").exists()).to.be.false;
    //         });

    //         it("show decrementSlider function event", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".animation-button").findAll("button"),
    //                 spyDecrementSlider = sinon.spy(wrapper.vm, "decrementSlider");

    //             await wrapper.vm.$nextTick();
    //             await wrapper.setData({firstYear: 2000, min: 1990});
    //             await buttonWrapperArray.wrappers[0].trigger("click");
    //             expect(spyDecrementSlider.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.vm.firstYear).to.be.equal("1999");
    //         });

    //         it("show incrementSlider function event", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".animation-button").findAll("button"),
    //                 spyIncrementSlider = sinon.spy(wrapper.vm, "incrementSlider");

    //             await wrapper.vm.$nextTick();
    //             await wrapper.setData({firstYear: 2000, max: 2022});
    //             await buttonWrapperArray.wrappers[2].trigger("click");
    //             expect(spyIncrementSlider.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(wrapper.vm.firstYear).to.be.equal("2001");
    //         });

    //         it("show toggleIsPlaying function event", async () => {
    //             wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //             const buttonWrapperArray = wrapper.find(".animation-button").findAll("button"),
    //                 spyToggleIsPlaying = sinon.spy(wrapper.vm, "toggleIsPlaying"),
    //                 spyPlaySlider = sinon.spy(wrapper.vm, "playSlider"),
    //                 spyPauseSlider = sinon.spy(wrapper.vm, "pauseSlider");

    //             await wrapper.vm.$nextTick();
    //             await wrapper.setData({firstYear: 2000, max: 2022, interval: null});
    //             await buttonWrapperArray.wrappers[1].trigger("click");
    //             expect(spyToggleIsPlaying.calledOnce).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(spyPlaySlider.calledOnce).to.be.true;
    //             await buttonWrapperArray.wrappers[1].trigger("click");
    //             expect(spyToggleIsPlaying.calledTwice).to.be.true;
    //             await wrapper.vm.$nextTick();
    //             expect(spyPauseSlider.calledOnce).to.be.true;
    //         });
    //     });

    //     describe("Methods", () => {
    //         describe("openChart", () => {
    //             it("should trigger the condition with bar", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const spyGetDataForChart = sinon.spy(wrapper.vm, "getDataForChart"),
    //                     spyGetGivenOptions = sinon.spy(wrapper.vm, "getGivenOptions");

    //                 wrapper.vm.openChart("bar");
    //                 expect(wrapper.vm.barChartData).to.be.not.null;
    //                 expect(wrapper.vm.lineChartData).to.be.null;
    //                 expect(wrapper.vm.pieChartData).to.be.null;
    //                 expect(spyGetDataForChart.calledOnce).to.be.true;
    //                 expect(spyGetGivenOptions.calledOnce).to.be.true;
    //             });

    //             it("should trigger the condition with line", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const spyGetDataForChart = sinon.spy(wrapper.vm, "getDataForChart"),
    //                     spyGetGivenOptions = sinon.spy(wrapper.vm, "getGivenOptions");

    //                 wrapper.vm.openChart("line");
    //                 expect(wrapper.vm.lineChartData).to.be.not.null;
    //                 expect(wrapper.vm.barChartData).to.be.null;
    //                 expect(wrapper.vm.pieChartData).to.be.null;
    //                 expect(spyGetDataForChart.calledOnce).to.be.true;
    //                 expect(spyGetGivenOptions.calledOnce).to.be.true;
    //             });

    //             it("should trigger the condition with pie", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const spyGetDataForChart = sinon.spy(wrapper.vm, "getDataForChart"),
    //                     spyGetGivenOptions = sinon.spy(wrapper.vm, "getGivenOptions");

    //                 wrapper.vm.openChart("pie");
    //                 expect(wrapper.vm.pieChartData).to.be.not.null;
    //                 expect(wrapper.vm.barChartData).to.be.null;
    //                 expect(wrapper.vm.lineChartData).to.be.null;
    //                 expect(spyGetDataForChart.calledOnce).to.be.true;
    //                 expect(spyGetGivenOptions.calledOnce).to.be.true;
    //             });
    //         });

    //         describe("resetChart", () => {
    //             it("should trigger the function getDataForChart and getGivenOptions", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const spyGetDataForChart = sinon.spy(wrapper.vm, "getDataForChart"),
    //                     spyGetGivenOptions = sinon.spy(wrapper.vm, "getGivenOptions");

    //                 wrapper.vm.resetChart("bar", 1999, 2005);
    //                 expect(spyGetDataForChart.calledOnce).to.be.true;
    //                 expect(spyGetGivenOptions.calledOnce).to.be.true;
    //             });
    //         });

    //         describe("getGivenOptions", () => {
    //             it("should return label with default text feature", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const options = {
    //                     scales: {
    //                         yAxes: [{
    //                             scaleLabel: {
    //                                 display: true,
    //                                 labelString: "additional:modules.tools.cosi.ToolBridge.countLabelfeatures"
    //                             }
    //                         }]
    //                     },
    //                     elements: {
    //                         line: {
    //                             fill: false
    //                         }
    //                     }
    //                 };

    //                 expect(wrapper.vm.getGivenOptions(undefined)).to.be.deep.equal(options);
    //             });

    //             it("should return label with key", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const options = {
    //                     scales: {
    //                         yAxes: [{
    //                             scaleLabel: {
    //                                 display: true,
    //                                 labelString: "additional:modules.tools.cosi.ToolBridge.countLabelkey"
    //                             }
    //                         }]
    //                     },
    //                     elements: {
    //                         line: {
    //                             fill: false
    //                         }
    //                     }
    //                 };

    //                 expect(wrapper.vm.getGivenOptions("key")).to.be.deep.equal(options);
    //             });
    //         });

    //         describe("getDataForChart", () => {
    //             it("should call the right function for getting data", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});

    //                 const spyGetCountsOfFeatures = sinon.spy(wrapper.vm, "getCountsOfFeatures"),
    //                     spyGetCountsOfProperty = sinon.spy(wrapper.vm, "getCountsOfProperty");

    //                 wrapper.vm.getDataForChart("", null, "", "", []);
    //                 expect(spyGetCountsOfFeatures.calledOnce).to.be.true;

    //                 wrapper.vm.getDataForChart("", null, undefined, "", []);
    //                 expect(spyGetCountsOfFeatures.calledTwice).to.be.true;

    //                 wrapper.vm.getDataForChart("", null, "count", "", []);
    //                 expect(spyGetCountsOfProperty.calledOnce).to.be.true;
    //             });

    //             it("should return null", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getDataForChart("", null, "", 1999, 2000, 0, [])).to.be.equal(null);
    //                 expect(wrapper.vm.getDataForChart("", "", null, 1999, 2000, 0, [])).to.be.equal(null);
    //                 expect(wrapper.vm.getDataForChart("", "", "", 1999, 2000, 0, null)).to.be.equal(null);
    //             });

    //             it("should return the data with white color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getDataForChart("pie", "", "", 1999, 2000, 2, []).datasets[0].borderColor).to.be.equal("#ffffff");
    //             });

    //             it("should return the data with non-white color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getDataForChart("line", "", "", 1999, 2000, 2, []).datasets[0].borderColor).to.be.equal("#57A845");
    //             });
    //         });

    //         describe("getCountsOfFeatures", () => {
    //             it("should return null", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfFeatures("", null, "", "", [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfFeatures("", "", null, "", [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfFeatures("", "", "", null, [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfFeatures("", "", "", "", null)).to.be.equal(null);
    //             });

    //             it("should return the object with white color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfFeatures("pie", 0, 0, "", []).datasets[0].borderColor).to.be.equal("#ffffff");
    //             });

    //             it("should return the object with non-white color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfFeatures("", 0, 0, "", []).datasets[0].borderColor).to.be.equal("#57A845");
    //             });

    //             it("should return the object with right data", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfFeatures("pie", 2000, 2, "year", [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 1999;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([1, 2]);

    //                 expect(wrapper.vm.getCountsOfFeatures("pie", 2000, 2, ["year", "Jahr"], [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 1999;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "Jahr") {
    //                         return 2000;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([1, 2]);

    //                 expect(wrapper.vm.getCountsOfFeatures("pie", 2000, 2, "year", [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2001;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2002;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2003;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([0, 0]);
    //             });

    //         });

    //         describe("getCountsOfProperty", () => {
    //             it("should return null", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("", null, "", "", "", [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfProperty("", "", null, "", "", [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfProperty("", "", "", null, "", [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfProperty("", "", "", "", null, [])).to.be.equal(null);
    //                 expect(wrapper.vm.getCountsOfProperty("", "", "", "", null, null)).to.be.equal(null);
    //             });

    //             it("should return the object with background color in array", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("pie", "", 0, 10, "", []).datasets[0].backgroundColor).to.be.an("array").with.lengthOf(10);
    //             });

    //             it("should return the object with background color in string", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("bar", "", 0, 10, "", []).datasets[0].backgroundColor).to.be.equal("#57A845");
    //             });

    //             it("should return the object with white border color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("pie", "", 0, 0, "", []).datasets[0].borderColor).to.be.equal("#ffffff");
    //             });

    //             it("should return the object with non-white border color", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("", "", 0, 0, "", []).datasets[0].borderColor).to.be.equal("#57A845");
    //             });

    //             it("should return the object with right data", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getCountsOfProperty("pie", "count", 2000, 2, "year", [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 1999;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([10, 20]);

    //                 expect(wrapper.vm.getCountsOfProperty("pie", "count", 2000, 2, ["year", "Jahr"], [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2000;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 1999;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "Jahr") {
    //                         return 2000;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([10, 20]);

    //                 expect(wrapper.vm.getCountsOfProperty("pie", "count", 2000, 2, "year", [{get: (key) => {
    //                     if (key === "year") {
    //                         return 2001;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2002;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}, {get: (key) => {
    //                     if (key === "year") {
    //                         return 2003;
    //                     }
    //                     if (key === "count") {
    //                         return 10;
    //                     }
    //                     return null;
    //                 }}]).datasets[0].data).to.be.deep.equal([0, 0]);
    //             });
    //         });

    //         describe("getLabels", () => {
    //             it("should return empty labels", () => {
    //                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
    //                 expect(wrapper.vm.getLabels("", "")).to.be.deep.equal([]);
    //                 expect(wrapper.vm.getLabels(null, "")).to.be.deep.equal([]);
    //                 expect(wrapper.vm.getLabels(false, "")).to.be.deep.equal([]);
    //                 expect(wrapper.vm.getLabels([], "")).to.be.deep.equal([]);
    //                 expect(wrapper.vm.getLabels({}, "")).to.be.deep.equal([]);
    //                 expect(wrapper.vm.getLabels(undefined, "")).to.be.deep.equal([]);
    //             });

//             it("should return labels", () => {
//                 wrapper = shallowMount(ToolBridgeComponent, {store, localVue});
//                 expect(wrapper.vm.getLabels(4, 2023)).to.be.deep.equal([2020, 2021, 2022, 2023]);
//             });
//         });
//     });
});
