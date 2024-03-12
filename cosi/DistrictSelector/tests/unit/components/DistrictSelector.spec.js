import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import DistrictSelector from "../../../components/DistrictSelector.vue";
import DistrictSelectorStore from "../../../store/indexDistrictSelector";
import Vuetify from "vuetify";
import Layer from "ol/layer/Vector.js";
import FeatureCollection from "ol/Collection";
import Source from "ol/source/Vector.js";
import sinon from "sinon";
import Vue from "vue";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);
localVue.use(Vuex);


global.requestAnimationFrame = (fn) => fn();

describe("addons/cosi/DistrictSelector/components/DistrictSelector.vue", () => {
    let vuetify, store;

    const mockMapGetters = {
            getVisibleLayerList: () => sinon.stub()
        },
        mockMapActions = {
            addInteraction: () => sinon.stub(),
            removeInteraction: () => sinon.stub(),
            resetView: () => sinon.stub(),
            zoomToExtent: () => sinon.stub()
        },
        layerOne = new Layer({id: "123", source: new Source()}),
        layerTwo = new Layer({id: "456", source: new Source()}),
        layerList = [layerOne, layerTwo],
        districtLevels = [{layerId: "123", label: "Stube", stats: {}, districts: [], nameList: []}, {layerId: "456", label: "Kueche", stats: {}}],
        additionalInfoLayers = {
            "Sozialräume": [
                "20179"
            ],
            "RISE": [
                "4411"
            ]
        },
        factory = {
            getMount: (values = {}, isActive = true) => {
                return mount(DistrictSelector, {
                    store,
                    localVue,
                    vuetify,
                    data () {
                        return {
                            ...values
                        };
                    },
                    computed: {
                        name: () => "Hallo",
                        renderToWindow: () => true,
                        resizableWindow: () => false,
                        deactivateGFI: () => true,
                        active: () => isActive,
                        icon: () => "bi-image",
                        districtLevels: () => districtLevels,
                        layerList: () => layerList,
                        additionalInfoLayers: () => additionalInfoLayers,
                        enableBuffer: () => true
                    }
                });
            }
        };

    before(() => {
        sinon.spy(layerOne.getSource(), "on");
    });


    beforeEach(() => {
        vuetify = new Vuetify();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        DistrictSelector: DistrictSelectorStore
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: mockMapGetters,
                    actions: mockMapActions
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

        it("should not render if active is false", () => {
            const wrapper = factory.getMount({}, false);

            expect(wrapper.find("form").exists()).to.be.false;
        });

        it("should find a select component with the text 'Stube'", () => {
            const wrapper = factory.getMount(),
                selectWrapper = wrapper.findComponent({name: "v-select"});

            expect(selectWrapper.find(".v-select__selection").text()).to.equal("Stube");
        });

        it("should find an empty multiple autocomplete component with the items 'Kamin, Sessel, Sofa'", async () => {
            const wrapper = factory.getMount(),
                autoCompleteWrapper = wrapper.findComponent({name: "v-autocomplete"});

            await wrapper.setData({selectedDistrictLevel: {nameList: ["Kamin", "Sessel", "Sofa"]}});

            expect(autoCompleteWrapper.props("multiple")).to.be.true;
            expect(autoCompleteWrapper.props("items")).to.deep.equal(["Kamin", "Sessel", "Sofa"]);
            expect(autoCompleteWrapper.find(".v-select__selections").text()).to.equal("");
        });

        it("should find a text-field component with the type 'number'", () => {
            const wrapper = factory.getMount(),
                textFieldWrapper = wrapper.findComponent({name: "v-text-field"});

            expect(textFieldWrapper.exists()).to.be.true;
            expect(textFieldWrapper.props("type")).to.equal("number");
        });

        it("should not find a text-field component with the type 'number'", () => {
            const textfieldFactory = {
                    getMount: (values = {}, isActive = true) => {
                        return mount(DistrictSelector, {
                            store,
                            localVue,
                            vuetify,
                            data () {
                                return {
                                    ...values
                                };
                            },
                            computed: {
                                name: () => "Hallo",
                                renderToWindow: () => true,
                                resizableWindow: () => false,
                                deactivateGFI: () => true,
                                active: () => isActive,
                                icon: () => "bi-image",
                                districtLevels: () => districtLevels,
                                layerList: () => layerList,
                                additionalInfoLayers: () => additionalInfoLayers,
                                enableBuffer: () => false
                            }
                        });
                    }
                },
                wrapper = textfieldFactory.getMount(),
                textFieldWrapper = wrapper.findComponent({name: "v-text-field"});

            expect(textFieldWrapper.exists()).to.be.false;
        });

        it("should find a checkbox component with the value Sozialräume", () => {
            const wrapper = factory.getMount(),
                checkboxWrapperArray = wrapper.findAllComponents({name: "v-checkbox"});

            expect(checkboxWrapperArray.exists()).to.be.true;
            expect(checkboxWrapperArray.at(0).props("value")).to.equal("Sozialräume");
        });

        it("should find a checkbox component with the value RISE", () => {
            const wrapper = factory.getMount(),
                checkboxWrapperArray = wrapper.findAllComponents({name: "v-checkbox"});

            expect(checkboxWrapperArray.exists()).to.be.true;
            expect(checkboxWrapperArray.at(1).props("value")).to.equal("RISE");
        });

        it("should find three button components with the right content", () => {
            const wrapper = factory.getMount(),
                buttonWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            expect(buttonWrapperArray.exists()).to.be.true;
            expect(buttonWrapperArray).to.have.lengthOf(4);
            expect(buttonWrapperArray.wrappers[1].text()).to.equal("additional:modules.tools.cosi.districtSelector.buttonConfirm");
            expect(buttonWrapperArray.wrappers[2].text()).to.equal("additional:modules.tools.cosi.districtSelector.buttonReset");
            expect(buttonWrapperArray.wrappers[3].findComponent({name: "v-icon"}).classes("mdi-pencil")).to.be.true;

        });
    });

    describe("Computed Properties", () => {
        it("should update 'namesOfDistricts' if 'selectedDistrictLevel' was changed", async () => {
            const dummyDistrictTwo = {
                    nameList: ["Mario", "und", "Luigi"]
                },
                wrapper = factory.getMount();

            await wrapper.setData({
                selectedDistrictLevel: dummyDistrictTwo
            });
            expect(wrapper.vm.selectedDistrictLevel.nameList).to.deep.equal(["Mario", "und", "Luigi"]);
        });

        it("should update 'selectedNames' if 'selectedDistrictName' was changed", () => {
            const wrapper = factory.getMount();

            wrapper.vm.setSelectedDistrictNames(["Laurel", "und", "Hardy"]);
            expect(wrapper.vm.selectedNames).to.deep.equal(["Laurel", "und", "Hardy"]);
        });

        it("should update 'selectedLevelId' if 'selectedDistrictLevelId' was changed", () => {
            const wrapper = factory.getMount();

            wrapper.vm.setSelectedDistrictLevelId("456");
            expect(wrapper.vm.selectedLevelId).to.equal("456");
        });
    });

    describe("Lifecycle Hooks", () => {
        it("created", () => {
            const spySetNonReactiveData = sinon.spy(DistrictSelector.methods, "setNonReactiveData"),
                spyInitializeAdditionalInfoLayers = sinon.spy(DistrictSelector.methods, "initializeAdditionalInfoLayers"),
                wrapper = factory.getMount();

            expect(wrapper.vm.districtLevels[0]).to.have.all.keys("districts", "referenceLevel", "propertyNameList", "nameList", "layer", "label", "stats", "layerId");
            expect(wrapper.vm.selectedLevelId).to.equal("123");
            expect(spySetNonReactiveData.calledOnce).to.be.true;
            expect(spyInitializeAdditionalInfoLayers.calledOnce).to.be.true;
            spySetNonReactiveData.restore();
            spyInitializeAdditionalInfoLayers.restore();
        });
    });

    describe("Watchers", () => {
        it("should call 'transferFeatures' after selectedDistrictsCollection was changed", async () => {
            const spyTransferFeatures = sinon.spy(DistrictSelector.methods, "transferFeatures"),
                wrapper = factory.getMount();

            await wrapper.vm.setSelectedDistrictsCollection(new FeatureCollection());


            expect(spyTransferFeatures.calledOnce).to.be.true;
            spyTransferFeatures.restore();
        });

        it("should call 'clearFeatures' and 'changeSelectedDistrictLevel' after selectedLevelId was changed", async () => {
            const spyChangeSelectedDistrictLevel = sinon.spy(DistrictSelector.methods, "changeSelectedDistrictLevel"),
                spyClearFeatures = sinon.spy(DistrictSelector.methods, "clearFeatures"),
                wrapper = factory.getMount();

            await wrapper.setData({selectedLevelId: "456"});

            expect(spyClearFeatures.calledOnce).to.be.true;
            expect(spyChangeSelectedDistrictLevel.calledOnce).to.be.true;
            spyClearFeatures.restore();
            spyChangeSelectedDistrictLevel.restore();
        });

        it("should call 'toggleAdditionalLayers' after visibleInfoLayers was changed", async () => {
            const spyToggleAdditionalLayers = sinon.spy(DistrictSelector.methods, "toggleAdditionalLayers"),
                wrapper = factory.getMount();

            await wrapper.setData({visibleInfoLayers: [true, false]});

            expect(spyToggleAdditionalLayers.calledOnce).to.be.true;
            spyToggleAdditionalLayers.restore();
        });
    });

    describe("User Interactions", () => {
        it("should display the correct value if the user changes the district level selection", async () => {
            const wrapper = factory.getMount(),
                selectWrapper = wrapper.findComponent({name: "v-select"});

            selectWrapper.vm.selectItem("456");
            await wrapper.vm.$nextTick();

            expect(selectWrapper.find(".v-select__selection").text()).to.equal("Kueche");
        });

        it("should remove all features if user clicks the reset button", async () => {
            const wrapper = factory.getMount(),
                btnWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            await btnWrapperArray.at(1).trigger("click");
            expect(wrapper.vm.select.getFeatures().getLength()).to.be.equal(0);
        });

        it("should activate the dropbox interaction if user clicks the mdi-pencil button", async () => {
            const wrapper = factory.getMount(),
                btnWrapperArray = wrapper.findAllComponents({name: "v-btn"});

            await btnWrapperArray.at(3).trigger("click");
            expect(wrapper.vm.dragBox.getActive()).to.be.true;
        });
    });

    describe("Methdos", () => {
        it("changeSelectedDistrictLevel", () => {
            const wrapper = factory.getMount();

            wrapper.vm.changeSelectedDistrictLevel("456");
            expect(wrapper.vm.selectedDistrictLevel.layerId).to.equal("456");
        });

        it("getDistrictLevelById", () => {
            const wrapper = factory.getMount(),
                districtLevel = wrapper.vm.getDistrictLevelById("456");

            expect(districtLevel).to.be.an("object");
            expect(districtLevel.label).to.equal("Kueche");
        });

        it("showAlert", () => {
            const spyShowAlert = sinon.spy(DistrictSelector.methods, "showAlert"),
                wrapper = factory.getMount();

            wrapper.vm.showAlert();
            expect(spyShowAlert.calledOnce).to.be.true;
            spyShowAlert.restore();
        });

        it("toggleDragBox", () => {
            const wrapper = factory.getMount();

            wrapper.vm.toggleDragBox();
            expect(wrapper.vm.dragBox.getActive()).to.be.true;
            wrapper.vm.toggleDragBox();
            expect(wrapper.vm.dragBox.getActive()).to.be.false;
        });
    });
});
