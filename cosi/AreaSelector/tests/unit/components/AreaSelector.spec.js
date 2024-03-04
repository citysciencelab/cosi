import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import AreaSelector from "../../../components/AreaSelector.vue";
import AreaSelectorStore from "../../../store/indexAreaSelector";
import Vuetify from "vuetify";
import Layer from "ol/layer/Vector.js";
import Source from "ol/source/Vector.js";
import sinon from "sinon";
import Vue from "vue";
import {Polygon} from "ol/geom";
import ToGeom from "../../../../utils/setBBoxToGeom";
import Feature from "ol/Feature";
import ToGeoJson from "../../../../utils/features/convertToGeoJson";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);
localVue.use(Vuex);


global.requestAnimationFrame = (fn) => fn();

describe("addons/cosi/AreaSelector/components/AreaSelector.vue", () => {
    let vuetify, store;

    const layer = new Layer({id: "123", source: new Source()}),
        polygon = new Polygon([
            [
                [2, 2],
                [78, 2],
                [2, 78],
                [2, 2]
            ]
        ]),
        polygonNext = new Polygon([
            [
                [2, 2],
                [78, 2],
                [2, 78],
                [2, 2]
            ]
        ]),
        factory = {
            getMount: (isActive = true) => {
                return mount(AreaSelector, {
                    store,
                    localVue,
                    vuetify,
                    computed: {
                        name: () => "Hallo",
                        renderToWindow: () => true,
                        resizableWindow: () => false,
                        deactivateGFI: () => true,
                        active: () => isActive,
                        icon: () => "bi-image"
                    }
                });
            }
        };

    beforeEach(() => {
        sinon.stub(ToGeom, "setBBoxToGeom");

        vuetify = new Vuetify();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        AreaSelector: AreaSelectorStore,
                        SelectionManager: {
                            namespaced: true,
                            actions: {
                                addNewSelection: sinon.stub()
                            }
                        },
                        PopulationRequest: {
                            namespaced: true,
                            mutations: {
                                setActive: sinon.stub(),
                                setGeometry: sinon.stub()
                            }
                        },
                        Filter: {
                            namespaced: true,
                            mutations: {
                                setFilterGeometry: sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        projectionCode: () => "EPSG:25832"
                    },
                    actions: {
                        addNewLayerIfNotExists: () => layer
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
    afterEach(function () {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getMount();


            expect(wrapper.exists()).to.be.true;
        });

        it("should find Tool component", () => {
            const wrapper = factory.getMount(),
                toolWrapper = wrapper.find(".tool-window-vue");

            expect(toolWrapper.exists()).to.be.true;
        });

        it("should find ToolInfo component", () => {
            const wrapper = factory.getMount(),
                toolInfoWrapper = wrapper.findComponent({name: "ToolInfo"});

            expect(toolInfoWrapper.exists()).to.be.true;
        });

        it("should find GeometryPicker component", () => {
            const wrapper = factory.getMount(),
                geometryPickerWrapper = wrapper.findComponent({name: "GeometryPicker"});

            expect(geometryPickerWrapper.exists()).to.be.true;
        });

        it("should not render if active is false", () => {
            const wrapper = factory.getMount(false);

            expect(wrapper.find(".clamp-600px").exists()).to.be.false;
        });

        it("should not find button for request inhabitants, if no geometry is set", () => {
            const wrapper = factory.getMount(),
                buttonWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            expect(buttonWrapperArray.wrappers[5]).to.be.undefined;
        });

        it("should find button for request inhabitants with the right content, if geometry is set", () => {
            store.commit("Tools/AreaSelector/setGeometry", polygon);

            const wrapper = factory.getMount(),
                buttonWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            expect(buttonWrapperArray.wrappers[5].exists()).to.be.true;
            expect(buttonWrapperArray.wrappers[5].text()).to.equal("additional:modules.tools.cosi.areaSelector.requestInhabitants");
        });
    });

    describe("Lifecycle Hooks", () => {
        it("should call 'createDrawingLayer' if created", () => {
            const spyCreateDrawingLayer = sinon.spy(AreaSelector.methods, "createDrawingLayer");

            factory.getMount();
            expect(spyCreateDrawingLayer.calledOnce).to.be.true;
            spyCreateDrawingLayer.restore();
        });
    });

    describe("Watchers", () => {
        it("should make some stuff when the geometry changes", async () => {
            const spyAddNewSelection = sinon.spy(AreaSelector.methods, "addNewSelection"),
                wrapper = factory.getMount();

            await wrapper.vm.$nextTick(); // createDrawingLayer in created hook
            store.commit("Tools/AreaSelector/setGeometry", polygonNext);
            await wrapper.vm.$nextTick(); // this.feature
            expect(wrapper.vm.feature).to.be.an.instanceof(Feature);
            expect(spyAddNewSelection.calledOnce).to.be.true;
            expect(wrapper.vm.drawingLayer.getSource().getFeatures()).to.be.lengthOf(1);
            expect(wrapper.vm.drawingLayer.getSource().getFeatures()[0]).to.be.equal(wrapper.vm.feature);
            spyAddNewSelection.restore();
        });
    });

    describe("User Interactions", () => {
        it("should display the correct value if the user changes the district level selection", async () => {
            store.commit("Tools/AreaSelector/setGeometry", polygon);

            const spyRequestInhabitants = sinon.spy(AreaSelector.methods, "requestInhabitants"),
                wrapper = factory.getMount(),
                buttonWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            await buttonWrapperArray.wrappers[5].trigger("click");
            expect(spyRequestInhabitants.calledOnce).to.be.true;
        });
    });

    describe("Methdos", () => {
        it("createDrawingLayer - should call 'addNewLayerIfNotExists'", () => {
            const spyNewLayerIfNotExists = sinon.spy(AreaSelector.methods, "addNewLayerIfNotExists");

            factory.getMount();
            expect(spyNewLayerIfNotExists.calledOnce).to.be.true;
            spyNewLayerIfNotExists.restore();
        });

        it("createDrawingLayer - should set 'drawingLayer' visible", async () => {
            const wrapper = factory.getMount();

            await wrapper.vm.$nextTick(); // createDrawingLayer in created hook
            expect(wrapper.vm.drawingLayer.getVisible()).to.be.true;
        });

        it("createDrawingLayer - should set the style for 'drawingLayer'", async () => {
            const wrapper = factory.getMount();

            await wrapper.vm.$nextTick(); // createDrawingLayer in created hook
            expect(wrapper.vm.drawingLayer.getStyle()).to.be.equal(wrapper.vm.drawingStyle);
        });

        it("requestInhabitants - should call 'featureToGeoJson'", () => {
            const spyFeatureToGeoJson = sinon.spy(ToGeoJson, "featureToGeoJson"),
                wrapper = factory.getMount();

            wrapper.vm.requestInhabitants();
            expect(spyFeatureToGeoJson.calledOnce).to.be.true;
            spyFeatureToGeoJson.restore();
        });

        it("requestInhabitants - should call 'close'", () => {
            const spyClose = sinon.spy(AreaSelector.methods, "close"),
                wrapper = factory.getMount();

            wrapper.vm.requestInhabitants();
            expect(spyClose.calledOnce).to.be.true;
            spyClose.restore();
        });

        it("requestInhabitants - should call 'setPopulationRequestActive'", async () => {
            const spySetPopulationRequestActive = sinon.spy(AreaSelector.methods, "setPopulationRequestActive"),
                wrapper = factory.getMount();

            wrapper.vm.requestInhabitants();
            await wrapper.vm.$nextTick(); // next tick in requestInhabitants function
            expect(spySetPopulationRequestActive.calledOnce).to.be.true;
            spySetPopulationRequestActive.restore();
        });

        it("requestInhabitants - should call 'setPopulationRequestGeometry'", async () => {
            const spySetPopulationRequestGeometry = sinon.spy(AreaSelector.methods, "setPopulationRequestGeometry"),
                wrapper = factory.getMount();

            wrapper.vm.requestInhabitants();
            await wrapper.vm.$nextTick(); // next tick in requestInhabitants function
            expect(spySetPopulationRequestGeometry.calledOnce).to.be.true;
            spySetPopulationRequestGeometry.restore();
        });
    });
});
