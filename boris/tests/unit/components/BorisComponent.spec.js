import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import BorisComponent from "../../../components/BorisComponent.vue";
import Boris from "../../../store/indexBoris";
import MapActions from "../../../../../src/core/maps/store/actions/actionsMapInteractions.js";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("ADDONS: addons/boris/components/BorisComponent.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        borisComponent: {
                            "name": "common:menu.tools.boris",
                            "icon": "bi-vinyl",
                            "active": true,
                            "renderToWindow": false
                        }
                    }
                }
            }
        }
    };
    let store,
        wrapper,
        originalMatchPolygonFeatureWithLanduse,
        originalSimulateLanduseSelect,
        originalSendWpsConvertRequest,
        originalUpdateSelectedBrwFeature,
        originalUnregisterListener;

    beforeEach(() => {
        originalMatchPolygonFeatureWithLanduse = Boris.actions.matchPolygonFeatureWithLanduse;
        Boris.actions.matchPolygonFeatureWithLanduse = sinon.spy();

        originalSimulateLanduseSelect = Boris.actions.simulateLanduseSelect;
        Boris.actions.simulateLanduseSelect = sinon.spy();

        originalSendWpsConvertRequest = Boris.actions.sendWpsConvertRequest;
        Boris.actions.sendWpsConvertRequest = sinon.spy();

        originalUpdateSelectedBrwFeature = Boris.actions.updateSelectedBrwFeature;
        Boris.actions.updateSelectedBrwFeature = sinon.spy();

        originalUnregisterListener = MapActions.unregisterListener;
        MapActions.unregisterListener = sinon.spy();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        BorisComponent: Boris,
                        Print: {
                            namespaced: true,
                            getters: {printFileReady: () => sinon.stub(),
                                fileDownloadUrl: () => sinon.stub(),
                                filename: () => sinon.stub(),
                                printStarted: () => sinon.stub(),
                                progressWidth: () => sinon.stub()}
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    actions: {registerListener: () => sinon.stub(),
                        unregisterListener: () => sinon.stub()}
                }
            },
            getters: {mobile: () => false},
            state: {
                configJson: mockConfigJson
            }
        });
    });
    afterEach(() => {
        Boris.actions.matchPolygonFeatureWithLanduse = originalMatchPolygonFeatureWithLanduse;
        Boris.actions.simulateLanduseSelect = originalSimulateLanduseSelect;
        Boris.actions.sendWpsConvertRequest = originalSendWpsConvertRequest;
        Boris.actions.updateSelectedBrwFeature = originalUpdateSelectedBrwFeature;
        MapActions.unregisterListener = originalUnregisterListener;

        sinon.restore();
        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("Boris template", () => {
        it("renders Boris", () => {
            store.state.Tools.BorisComponent.active = true;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            expect(wrapper.find("#boris").exists()).to.be.true;
        });
        it("do not render Boris if not active", () => {
            store.state.Tools.BorisComponent.active = false;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            expect(wrapper.find("#boris").exists()).to.be.false;
        });
        it("renders input to toggle boarder stripes", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.isAreaLayer = true;
            wrapper = shallowMount(BorisComponent, {store, localVue});

            expect(wrapper.find("#showStripes").exists()).to.be.true;
            expect(wrapper.find("#showStripes").element.checked).to.be.false;
            expect(wrapper.find(".form-check-label").exists()).to.be.true;
            expect(wrapper.find(".form-check-label").text()).to.equals("additional:modules.tools.boris.toggleStripesLayer");
            expect(wrapper.find(".bootstrap-icon", "bi-question-circle-fill").exists()).to.be.true;
            expect(wrapper.find(".info-text").exists()).to.be.false;
        });
        it("render text to click on polygon if no polygon is selected", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.selectedPolygon = null;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            expect(wrapper.find("#selectPolygonText").text()).to.equals("additional:modules.tools.boris.SelectAreaInMap");
        });
        it("render choose landuse selection", () => {
            const feature = {
                get: () => "value"
            };

            store.state.Tools.BorisComponent.active = true;
            store.commit("Tools/BorisComponent/setSelectedPolygon", feature);
            wrapper = shallowMount(BorisComponent, {store, localVue});

            expect(wrapper.find("#landuseSelect").exists()).to.be.true;
        });
    });

    describe("getFilterListWithoutStripes computed property", () => {
        const layer1 = {
                attributes: {
                    name: "ich habe -stripes"
                }
            },
            layer2 = {
                attributes: {
                    name: "ich nicht"
                }
            };

        it("getFilterListWithoutStripes includes & does not include layer without stripes", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.filteredLayerList.push(layer1);
            store.state.Tools.BorisComponent.filteredLayerList.push(layer2);
            wrapper = shallowMount(BorisComponent, {store, localVue});

            expect(wrapper.vm.getFilterListWithoutStripes).to.have.lengthOf(1);
            expect(wrapper.vm.getFilterListWithoutStripes[0]).to.deep.equal(layer2);
        });
    });
    describe("selectedLanduseComputed computed property", () => {
        const oldValue = "BH Burohäuser",
            newValue = "A Acker";

        it("selectedLanduseComputed equals newValue but does not equal oldValue", () => {
            store.state.Tools.BorisComponent.active = true;
            store.commit("Tools/BorisComponent/setSelectedLanduse", newValue);
            wrapper = shallowMount(BorisComponent, {store, localVue});
            expect(wrapper.vm.selectedLanduseComputed).to.equal(newValue);
            expect(wrapper.vm.selectedLanduseComputed).to.not.equal(oldValue);
        });
    });
    describe("active watcher", () => {
        it.skip("unregister listener if active is false", () => {
            store.state.Tools.BorisComponent.active = false;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.$options.watch.active.call(wrapper.vm, false);

            expect(MapActions.unregisterListener.calledOnce).to.equal(true);
        });
        // it("register listener if active is true", () => {
        // store.state.Tools.Boris.active = true;
        // });
    });
    describe("selectedPolygon watcher", () => {
        it("landuse select should be simulated if parametric Url is being used ", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.isProcessFromParametricUrl = true;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.$options.watch.selectedPolygon.call(wrapper.vm);

            expect(Boris.actions.simulateLanduseSelect.calledOnce).to.equal(true);

        });
    });
    describe("selectedLanduse watcher", () => {
        it("selectedLanduse shall change buttonValue and call matchPolygonFeatureWithLanduse", () => {
            const oldValue = "BH Bürohäuser",
                newValue = "A Acker";

            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.buttonValue = "liste";
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.$options.watch.selectedLanduse.call(wrapper.vm, newValue, oldValue);

            expect(store.state.Tools.BorisComponent.buttonValue).to.equals("info");
            expect(Boris.actions.matchPolygonFeatureWithLanduse.calledOnce).to.equal(true);
        });
    });
    describe("selectedBrwFeature watcher", () => {
        it("selectedBrwFeature: should change buttonValue to 'info'", () => {
            const oldVal = {"schichtwert": 3},
                newVal = {"schichtwert": null},
                values = [{
                    "attributes": oldVal,
                    get: (key)=> {
                        return oldVal[key];
                    }
                },
                {"attributes": newVal,
                    get: (key)=> {
                        return newVal[key];
                    }
                }
                ],
                oldValue = values[0],
                newValue = values[1];

            store.state.Tools.BorisComponent.selectedPolygon = null;
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.buttonValue = "liste";
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.$options.watch.selectedBrwFeature.call(wrapper.vm, newValue, oldValue);
            expect(store.state.Tools.BorisComponent.buttonValue).to.equals("info");
        });
    });
    describe("toggleInfoText method", () => {
        it("toggleInfoText", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.textIds = ["id1", "id2"];
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.toggleInfoText("id3");
            wrapper.vm.toggleInfoText("id2");

            expect(store.state.Tools.BorisComponent.textIds).to.have.lengthOf(2);
            expect(store.state.Tools.BorisComponent.textIds).that.includes("id3");
            expect(store.state.Tools.BorisComponent.textIds).that.does.not.include("id2");
        });
    });
    describe("handle input and option change methods", () => {
        it("handle option change: handleBuildingDesignOptionChange", () => {
            const event = {target: {value: store.state.Tools.BorisComponent.buildingDesigns[1]}, get: () => "value"},
                subject = "zBauweise";

            store.state.Tools.BorisComponent.active = true;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.handleBuildingDesignOptionChange(event, subject);

            expect(store.state.Tools.BorisComponent.selectedBuildDesign).to.equal(store.state.Tools.BorisComponent.buildingDesigns[1]);
            expect(Boris.actions.updateSelectedBrwFeature.calledOnce).to.equal(true);
            expect(Boris.actions.sendWpsConvertRequest.calledOnce).to.equal(true);

        });
        it("handleInputChange", () => {
            const event = {type: "change", key: "Enter", currentTarget: {value: "12,34"}},
                subject = "345";

            store.state.Tools.BorisComponent.active = true;
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.handleInputChange(event, subject);
            expect(Boris.actions.updateSelectedBrwFeature.calledOnce).to.equal(true);
            expect(Boris.actions.sendWpsConvertRequest.calledOnce).to.equal(true);

        });
    });
    describe("close method", () => {
        it("close", () => {
            wrapper = shallowMount(BorisComponent, {store, localVue});
            wrapper.vm.close();

            expect(store.state.Tools.BorisComponent.active).to.equal(false);
        });
    });
    describe("startPrint method", () => {
        it("startPrint", () => {
            store.state.Tools.BorisComponent.active = true;
            store.state.Tools.BorisComponent.selectedBrwFeature = {id: 1, name: "feature1", get: () => "value"};

            let printButton = null;
            const startPrintSpy = sinon.spy(BorisComponent.methods, "startPrint");

            wrapper = shallowMount(BorisComponent, {store, localVue});
            printButton = wrapper.find(".btn-infos");

            printButton.trigger("click");
            wrapper.vm.$nextTick();

            expect(startPrintSpy.calledOnce).to.equal(true);
        });
    });

});


