import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SelectionManagerComponent from "../../components/SelectionManager.vue";
import SelectionManager from "../../store/index";
import {expect} from "chai";
import sinon from "sinon";
import Vuetify from "vuetify";
import demo_selection from "./demo_selection.json";
import GeoJSON from "ol/format/GeoJSON";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Vuetify);

config.mocks.$t = key => key;

/**
 * mocks vuetify data-app attr
 * @returns {void}
 */
function addElemWithDataAppToBody () {
    const app = document.createElement("div");

    app.setAttribute("data-app", true);
    document.body.append(app);
}

describe("SelectionManager.vue", () => {
    before(() => {
        addElemWithDataAppToBody();
    });

    let component, store, sandbox, selectionMock, mapMock, getMapStub, dashboardOpenStub, layerListStub, activeVectorLayerListStub, inputActiveSelectionStub, vuetify;

    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        SelectionManager: {
                            name: "translate#additional:modules.tools.selectionManager.title",
                            icon: "bi-sliders2"
                        }
                    }
                }
            }
        }
    };

    beforeEach(() => {
        const format = new GeoJSON(),
            demoSelection = format.readFeatures(demo_selection);

        sandbox = sinon.createSandbox();
        activeVectorLayerListStub = sandbox.stub();
        layerListStub = sandbox.stub();
        dashboardOpenStub = sandbox.stub();
        getMapStub = sandbox.stub(mapCollection, "getMap");
        inputActiveSelectionStub = sandbox.stub();
        vuetify = new Vuetify();

        SelectionManager.mutations.inputActiveSelection = inputActiveSelectionStub;

        selectionMock = {
            selection: demoSelection,
            source: "test1",
            id: "Test_Selection_1"
        };

        mapMock = {
            getLayers: function () {
                return {
                    getArray: function () {
                        return [
                            {
                                get: function (propertyName) {
                                    if (propertyName === "name") {
                                        return "selection_manager";
                                    }
                                    return null;
                                },
                                setStyle: function (style) {
                                    if (style) {
                                        return true;
                                    }

                                    return false;
                                }
                            }
                        ];
                    }
                };
            },
            addLayer: function (layer) {
                if (layer) {
                    return true;
                }

                return false;
            },
            removeLayer: function (layer) {
                if (layer) {
                    return true;
                }

                return false;
            }
        };

        activeVectorLayerListStub.returns([{
            getProperties: () => ({name: "layer1"})
        }]);
        getMapStub.withArgs("2D").returns(mapMock);

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        SelectionManager,
                        DistrictSelector: {
                            namespaced: true,
                            getters: {
                                bufferValue: () => {
                                    return 0;
                                }
                            }
                        },
                        FeaturesList: {
                            namespaced: true,
                            getters: {
                                active: dashboardOpenStub,
                                activeVectorLayerList: activeVectorLayerListStub
                            }
                        },
                        Dashboard: {
                            namespaced: true,
                            getters: {
                                active: dashboardOpenStub
                            }
                        }
                    }
                },
                Map: {
                    namespaced: true,
                    getters: {
                        getVisibleLayerList: layerListStub
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        store.commit("Tools/SelectionManager/setActive", true);
    });

    afterEach(() => {
        component.destroy();
        sandbox.restore();
    });

    // eslint-disable-next-line require-jsdoc
    async function mount () {
        component = shallowMount(SelectionManagerComponent, {
            store,
            localVue,
            vuetify
        });

        await component.vm.$nextTick();
        return component;
    }

    describe("Component DOM", () => {
        it("should not render if selections is empty", async () => {
            const wrapper = await mount();

            expect(wrapper.find("#sm").exists()).to.be.false;
        });

        it("should not render Component if dashboard is open", async () => {
            dashboardOpenStub.returns(true);
            const wrapper = await mount();

            expect(wrapper.find("#sm").exists()).to.be.false;
        });

        it("should not render if selections is not empty and dashboard is open", async () => {
            store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});

            dashboardOpenStub.returns(true);

            const wrapper = await mount();

            expect(wrapper.find("#sm").exists()).to.be.false;
        });

        it("should render if selections is not empty and dashboard is close", async () => {
            store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            dashboardOpenStub.returns(false);

            const wrapper = await mount();

            expect(wrapper.find("#sm").exists()).to.be.true;
        });

        it("should set activeSelection to selection.length -1 everytime a new selection is added", async () => {
            const wrapper = await mount();

            await store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            await wrapper.vm.$nextTick();
            await store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            await wrapper.vm.$nextTick();

            expect(inputActiveSelectionStub.callCount).to.equal(2);
        });

        it("should have 4 selections rendered in the selection manager by now", async () => {
            const wrapper = await mount();

            expect(wrapper.findAll("#sm_wrapper ul.selections li").length).to.equal(4);
        });

        it("should render add_btn when selections.length is greater than 1", async () => {
            const wrapper = await mount();

            expect(wrapper.findAll("#sm_wrapper .add_btn").length).to.equal(4);
        });

        it("should render all_function_buttons when selection.length is greater than 1", async () => {
            const wrapper = await mount();

            expect(wrapper.find("#sm_wrapper .all_function_buttons").exists()).to.be.true;
        });

        it("should enable connect_btn when length of selectionsToMerge is longer than 2", async () => {
            const wrapper = await mount();

            wrapper.vm.selectionsToMerge = [0, 1, 2];
            await wrapper.vm.$nextTick();
            expect(wrapper.find("#sm_wrapper .cache").exists()).to.be.true;
            expect(wrapper.find("#sm_wrapper .cache .connect_btn").classes()).to.not.include("disabled");
        });
    });

    describe("watchers", () => {
        it("should call inputeActiveSelection if selectionsLength changed", async () => {
            // let the stub return the actual value, so that the watcher on activeSelection triggers
            inputActiveSelectionStub.callsFake((state, value) => {
                state.activeSelection = value - 1;
            });

            const activateSelectionStub = sinon.stub(SelectionManagerComponent.methods, "activateSelection"),
                wrapper = await mount();

            await store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            await wrapper.vm.$nextTick();
            expect(activateSelectionStub.calledOnce).to.be.true;
            activateSelectionStub.restore();
        });

        it("should call addSelection and highlightSelection when state.acceptSelection changes", async () => {
            const selection = {
                    selection: selectionMock.selection,
                    id: selectionMock.id,
                    storedLayers: [],
                    source: selectionMock.source,
                    settings: {
                        bufferActive: false,
                        buffer: 0
                    }
                },
                highlightSelectionStub = sinon.stub(SelectionManagerComponent.methods, "highlightSelection"),
                initialLength = SelectionManager.state.selections.length,
                wrapper = await mount();

            await store.commit("Tools/SelectionManager/setAcceptSelection", selection);
            await wrapper.vm.$nextTick();

            expect(highlightSelectionStub.calledOnce).to.be.true;
            expect(initialLength).to.not.equal(SelectionManager.state.selections.length);
            highlightSelectionStub.restore();
        });
    });

    describe("User Interactions", () => {
        it("should open selection manager window when selection manager button is clicked", async () => {
            store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            dashboardOpenStub.returns(false);

            const wrapper = await mount(),
                sm_btn = wrapper.find("#sm_btn");


            await sm_btn.trigger("click");
            await wrapper.vm.$nextTick();

            await wrapper.setData({
                openAddon: true
            });

            expect(wrapper.find("#sm_wrapper").exists()).to.be.true;
        });

        it("should change activeSelection on .view_btn click", async () => {
            // let the stub return an actual value, so that the watcher on activeSelection triggers
            inputActiveSelectionStub.callsFake((state, value) => {
                state.activeSelection = value - 1;
            });

            store.dispatch("Tools/SelectionManager/addNewSelection", {selection: selectionMock.selection, source: selectionMock.source, id: selectionMock.id});
            const activateSelectionStub = sinon.stub(SelectionManagerComponent.methods, "activateSelection"),
                wrapper = await mount(),
                view_btn = wrapper.find("#sm_wrapper .view_btn.highlight"),
                view_btns = wrapper.findAll("#sm_wrapper .view_btn"),
                activeSelection = SelectionManager.state.activeSelection;

            view_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(activeSelection).to.not.equal(SelectionManager.state.activeSelection);
            expect(view_btns.filter(btn => btn.classes().includes("highlight")).length).to.equal(1);
            activateSelectionStub.restore();
        });

        it("should add index to selectionsToMerge Array on add_btn click", async () => {
            const wrapper = await mount(),
                add_btn = wrapper.find("#sm_wrapper .add_btn"),
                spyMergeSelections = sinon.spy(wrapper.vm, "mergeSelections");

            wrapper.vm.selectionsToMerge = [];
            await wrapper.vm.$nextTick();
            add_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyMergeSelections.calledOnce).to.be.true;
            expect(add_btn.classes()).to.include("highlight");
            expect(wrapper.find("#sm_wrapper ul.cache_selections").exists()).to.be.true;
        });

        it("should set selection.storedLayers to activeLayerList on freeze_btn click", async () => {
            const wrapper = await mount(),
                freeze_btn = wrapper.find("#sm_wrapper .freeze_btn"),
                spyStoreLayers = sinon.spy(wrapper.vm, "storeLayers");

            freeze_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyStoreLayers.calledOnce).to.be.true;
            expect(freeze_btn.classes()).to.include("highlight");
            expect(store.getters["Tools/SelectionManager/selections"][0].storedLayers).to.deep.equal(wrapper.vm.activeLayerList);
        });

        it("should add index to extendedOptions on option_btn click", async () => {
            const wrapper = await mount(),
                option_btn = wrapper.find("#sm_wrapper .option_btn"),
                spyExtendedOptions = sinon.spy(wrapper.vm, "setExtendedOptions");

            option_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyExtendedOptions.calledOnce).to.be.true;
            expect(option_btn.classes()).to.include("highlight");
            expect(wrapper.vm.extendedOptions[0]).to.equal(0);
        });

        it("should call polygonChange on v-slider input and add bufferedSelection", async () => {
            const wrapper = await mount(),
                vSlider = wrapper.findComponent({name: "v-slider"}),
                stubPolygonChange = sinon.stub(wrapper.vm, "polygonChange");

            await vSlider.vm.$emit("input", 200);
            vSlider.trigger("input");
            expect(stubPolygonChange.calledOnce).to.be.true;
            stubPolygonChange.restore();
        });

        it("should activate an rerender the buffer on the selection on active_btn click", async () => {
            const wrapper = await mount(),
                activate_btn = wrapper.find("#sm_wrapper .activate_btn"),
                spyTriggerBuffer = sinon.spy(wrapper.vm, "triggerBuffer"),
                selection = store.getters["Tools/SelectionManager/selections"][0];

            selection.settings.bufferValue = 200;

            activate_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyTriggerBuffer.calledOnce).to.be.true;
            expect(activate_btn.classes()).to.include("highlight");
            expect(selection.settings.bufferActive).to.be.true;
        });

        it("should remove selection from this.selections on remove_btn click", async () => {
            const wrapper = await mount(),
                remove_btn = wrapper.find("#sm_wrapper .remove_btn"),
                spyRemoveSelection = sinon.spy(wrapper.vm, "removeSelection"),
                selectionsArrayLength = store.getters["Tools/SelectionManager/selections"].length;

            remove_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyRemoveSelection.calledOnce).to.be.true;
            expect(store.getters["Tools/SelectionManager/selections"].length).to.equal(selectionsArrayLength - 1);
        });

        it("should combine selections in selectionsToMerge into a new selection on combine_btn click", async () => {
            const wrapper = await mount(),
                spyAddMergedSelection = sinon.spy(wrapper.vm, "addMergedSelection"),
                highlightSelectionStub = sinon.stub(wrapper.vm, "highlightSelection").returns(true),
                selectionsArrayLength = store.getters["Tools/SelectionManager/selections"].length;


            wrapper.vm.selectionsToMerge = [0, 1, 2];
            await wrapper.vm.$nextTick();

            // eslint-disable-next-line
            const combine_btn = wrapper.find("#sm_wrapper .combine_btn");


            combine_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(spyAddMergedSelection.calledOnce).to.be.true;
            expect(highlightSelectionStub.calledOnce).to.be.true;
            expect(wrapper.vm.selectionsToMerge.length).to.equal(0);
            expect(store.getters["Tools/SelectionManager/selections"].length).to.equal(selectionsArrayLength + 1);
            highlightSelectionStub.restore();
        });

        it("should connect selections in selectionsToMerge into a new selection on connect_btn click", async () => {
            const wrapper = await mount(),
                connectSelectionsStub = sinon.stub(wrapper.vm, "connectSelections");

            wrapper.vm.selectionsToMerge = [0, 1, 2];
            await wrapper.vm.$nextTick();

            // eslint-disable-next-line
            const connect_btn = wrapper.find("#sm_wrapper .cache .connect_btn");

            connect_btn.trigger("click");
            await wrapper.vm.$nextTick();
            expect(connectSelectionsStub.calledOnce).to.be.true;
            connectSelectionsStub.restore();
        });

        it("should reset selectionsToMerge on .cache .remove_all_btn click", async () => {
            const wrapper = await mount();

            wrapper.vm.selectionsToMerge = [0, 1, 2];
            await wrapper.vm.$nextTick();

            // eslint-disable-next-line
            const remove_btn = wrapper.find("#sm_wrapper .cache .remove_all_btn");

            remove_btn.trigger("click");
            expect(wrapper.vm.selectionsToMerge.length).to.equal(0);
        });

        it("should reset the SelectionManager on remove_all_btn click", async () => {
            const wrapper = await mount(),
                remove_btn = wrapper.find("#sm_wrapper .all_functions_buttons .remove_all_btn");

            await wrapper.vm.$nextTick();

            remove_btn.trigger("click");
            expect(store.getters["Tools/SelectionManager/selections"].length).to.equal(0);
            expect(wrapper.find("#sm").exists()).to.be.false;
        });
    });
});
