import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import PolygonStyler from "../../../components/PolygonStyler.vue";
import PolygonStylerStore from "../../../store/indexPolygonStyler";
import Vuetify from "vuetify";
import Vue from "vue";
import Vuex from "vuex";
import sinon from "sinon";
import Tool from "../../../../../../src/modules/tools/ToolTemplate.vue";
import Layer from "ol/layer/Vector.js";
import Source from "ol/source/Vector.js";

config.mocks.$t = key => key;

const localVue = createLocalVue();

localVue.use(Vuex);
Vue.use(Vuetify);

describe("addons/cosi/PolygonStyler/components/PolygonStyler.vue", () => {
    let vuetify,
        store;

    const factory = {
            getShallowMount: (options) => {
                return shallowMount(PolygonStyler, {
                    stubs: {Tool},
                    localVue,
                    vuetify,
                    store,
                    ...options
                });
            }
        },
        layerOne = new Layer({id: "123", name: "first", source: new Source(), gfiAttributes: {test: "Test"}}),
        layerTwo = new Layer({id: "456", name: "second", source: new Source()});

    beforeEach(() => {
        vuetify = new Vuetify();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        FeaturesList: {
                            namespaced: true,
                            getters: {
                                activeVectorLayerList: () => sinon.stub()
                            }
                        },
                        PolygonStyler: PolygonStylerStore
                    }
                },
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de"
                    }
                }
            },
            getters: {
                uiStyle: () => true,
                mobile: () => sinon.stub()
            }
        });
        store.commit("Tools/PolygonStyler/setActive", true);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find Tool component", () => {
            const wrapper = factory.getShallowMount(),
                toolWrapper = wrapper.find(".tool-window-vue");

            expect(toolWrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find a select component with correct items", () => {
            const wrapper = factory.getShallowMount({
                    data () {
                        return {
                            layerList: [layerOne, layerTwo]
                        };
                    }
                }),
                selectComponent = wrapper.findComponent("v-select-stub");

            expect(selectComponent.exists()).to.be.true;
            expect(selectComponent.vm.items).to.deep.equal(["first", "second"]);
            wrapper.destroy();
        });

        it("should find a data table component with correct items", () => {
            const wrapper = factory.getShallowMount({
                    data () {
                        return {
                            tableItems: [{isVisible: true}, {isVisible: false}]
                        };
                    }
                }),
                tableComponent = wrapper.findComponent("v-data-table-stub");

            expect(tableComponent.exists()).to.be.true;
            expect(tableComponent.vm.items).to.deep.equal([{isVisible: true}]);
            wrapper.destroy();
        });

        it("should find a data table component with correct items", () => {
            const wrapper = factory.getShallowMount({
                    data () {
                        return {
                            selectedTableItem: {
                                styleList: []
                            }
                        };
                    }
                }),
                polygonStylerSettingsComponent = wrapper.findComponent("polygonstylersettings-stub");

            expect(polygonStylerSettingsComponent.exists()).to.be.true;
            wrapper.destroy();
        });
    });

    describe("Computed Properties", () => {
        it("should update 'layerNameList' if 'layerList' was changed", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.setData({
                layerList: [layerOne, layerTwo]
            });
            expect(wrapper.vm.layerNameList).to.deep.equal(["first", "second"]);
            wrapper.destroy();
        });

        it("should update 'visibleTableItems' if 'tableItems' was changed", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.setData({
                tableItems: [{isVisible: true}, {isVisible: false}, {isVisible: true}]
            });
            expect(wrapper.vm.visibleTableItems).to.deep.equal([{isVisible: true}, {isVisible: true}]);
            wrapper.destroy();
        });
    });

    describe("Watchers", () => {
        it("should call 'updateSelectedLayerNameList' if the layer list gets smaller", async () => {
            const spyUpdateSelectedLayerNameList = sinon.spy(PolygonStyler.methods, "updateSelectedLayerNameList"),
                wrapper = factory.getShallowMount({
                    data () {
                        return {
                            layerList: [layerOne, layerTwo]
                        };
                    }
                });

            await wrapper.setData({
                layerList: [layerOne]
            });

            expect(spyUpdateSelectedLayerNameList.calledOnce).to.be.true;
            wrapper.destroy();
        });
        it("should not call 'updateSelectedLayerNameList' if the layer list gets bigger", async () => {
            const spyUpdateSelectedLayerNameList = sinon.spy(PolygonStyler.methods, "updateSelectedLayerNameList"),
                wrapper = factory.getShallowMount({
                    data () {
                        return {
                            layerList: [layerOne, layerTwo]
                        };
                    }
                });

            await wrapper.setData({
                layerList: [layerOne, layerTwo, layerOne]
            });

            expect(spyUpdateSelectedLayerNameList.notCalled).to.be.true;
            wrapper.destroy();
        });

        it("should call 'addTableItem' if no table item with the name 'First' exists", async () => {
            const spyAddTableItem = sinon.stub(PolygonStyler.methods, "addTableItem"),
                wrapper = factory.getShallowMount();

            await wrapper.setData({
                selectedLayerNameList: ["First"]
            });

            expect(spyAddTableItem.calledOnce).to.be.true;
            wrapper.destroy();
        });

        it("should call toggle the visiblity if the table item with the name 'first' exists", async () => {
            const wrapper = factory.getShallowMount({
                data () {
                    return {
                        tableItems: [{isVisible: true, name: "first"}, {isVisible: false, name: "second"}]
                    };
                }
            });

            await wrapper.setData({
                selectedLayerNameList: ["first"]
            });

            expect(wrapper.vm.tableItems[0].isVisible).to.be.false;
            wrapper.destroy();
        });
    });

    describe("Methods", () => {
        describe("addTableItem", () => {
            it("should add a new item with special keys to the given list", () => {
                const wrapper = factory.getShallowMount({
                        data () {
                            return {
                                layerList: [layerOne, layerTwo]
                            };
                        }
                    }),
                    testArray = [];

                wrapper.vm.addTableItem(testArray, "first");

                expect(testArray[0]).to.have.all.keys("name", "layer", "features", "featureAttributes", "isVisible", "defaultRenderer", "styleList");
            });
        });

        describe("differenceOfTwoArrays", () => {
            it("should return the difference of two arrays ", () => {
                const wrapper = factory.getShallowMount(),
                    testArray = [1, 2, 3, 4],
                    testArrayTwo = [1, 2];

                expect(wrapper.vm.differenceOfTwoArrays(testArray, testArrayTwo)).to.deep.equal([3, 4]);
            });
            it("should return the difference of two arrays", () => {
                const wrapper = factory.getShallowMount(),
                    testArray = [1, 2, 3],
                    testArrayTwo = [1, 2, 3, 4];

                expect(wrapper.vm.differenceOfTwoArrays(testArray, testArrayTwo)).to.deep.equal([4]);
            });
            it("should return an empty array if there is no difference", () => {
                const wrapper = factory.getShallowMount(),
                    testArray = [1, 2],
                    testArrayTwo = [1, 2];

                expect(wrapper.vm.differenceOfTwoArrays(testArray, testArrayTwo)).to.deep.equal([]);
            });
        });

        describe("getWebglLayer", () => {
            it("should return layers that have webgl set as renderer and do not have point geometries", () => {
                const wrapper = factory.getShallowMount(),
                    webglLayer = new Layer({renderer: "webgl", isPointLayer: false, source: new Source()}),
                    webglPointLayer = new Layer({renderer: "webgl", isPointLayer: true, source: new Source()});

                expect(wrapper.vm.getWebglLayer([webglLayer, webglPointLayer])).to.deep.equal([webglLayer]);
            });

        });

        describe("mapAttributes", () => {
            it("should map the given object correctly", () => {
                const wrapper = factory.getShallowMount(),
                    attributes = {
                        test: "Test",
                        hier: "da"
                    },
                    mappedAttributes = wrapper.vm.mapAttributes(attributes);

                expect(mappedAttributes).to.deep.equal([{text: "Test", value: "test"}, {text: "da", value: "hier"}]);
            });

        });

        describe("getDefaultStyleList", () => {
            it("should return the default style correctly", () => {
                const wrapper = factory.getShallowMount(),
                    styleList = wrapper.vm.getDefaultStyleList(["first", "second"]),
                    expectedStyleList = [
                        {
                            attribute: "first",
                            fill: {
                                color: "#898989",
                                opacity: 0
                            },
                            stroke: {
                                color: "#898989",
                                opacity: 1,
                                width: 2
                            },
                            text: "first"
                        },
                        {
                            attribute: "second",
                            fill: {
                                color: "#898989",
                                opacity: 0
                            },
                            stroke: {
                                color: "#898989",
                                opacity: 1,
                                width: 2
                            },
                            text: "second"
                        }
                    ];

                expect(styleList).to.deep.equal(expectedStyleList);
            });
        });

        describe("getRenderFunctions", () => {
            it("should get the right renderFunctions for the given style", () => {
                const wrapper = factory.getShallowMount(),
                    expectedStyleList = [
                        {
                            attribute: "first",
                            fill: {
                                color: "#e3e3e3",
                                opacity: 0
                            },
                            stroke: {
                                color: "#e3e3e3",
                                opacity: 1,
                                width: 1
                            }
                        }
                    ],
                    renderFunctions = wrapper.vm.getRenderFunctions(expectedStyleList, "first");

                expect(renderFunctions).to.have.all.keys("fill", "stroke");
                expect(renderFunctions.fill.attributes.color).to.be.a("function");
                expect(renderFunctions.fill.attributes.opacity).to.be.a("function");
                expect(renderFunctions.stroke.attributes.color).to.be.a("function");
                expect(renderFunctions.stroke.attributes.width).to.be.a("function");
            });
        });
    });
});
