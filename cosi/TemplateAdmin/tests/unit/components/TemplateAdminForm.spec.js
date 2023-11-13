import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateAdminForm from "../../../components/TemplateAdminForm.vue";
import indexTemplateAdmin from "../../../store/indexTemplateAdmin";
import sinon from "sinon/pkg/sinon-esm";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/cosi/TemplateAdmin/components/TemplateAdminForm.vue", () => {
    const geoData = [
            "Data1",
            "Data2",
            "Data3"
        ],
        statData = [
            "statData1",
            "statData2",
            "statData3"
        ],
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        TemplateAdmin: indexTemplateAdmin
                    }
                }
            }
        });

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should render form", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            expect(wrapper.find("form").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render name input field", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            expect(wrapper.find("#form-name").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render description input field", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            expect(wrapper.find("#form-description").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render add geo data multiselect", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            expect(wrapper.find("#add-geo-data").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render add statistic data multiselect", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            expect(wrapper.find("#add-statistic-data").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render add tools multiselect if tools are given", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    toolData: ["Tool1", "Tool2"]
                },
                localVue,
                store
            });

            expect(wrapper.find("#add-tools").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render select template multiselect if showEditTemplate is true", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            expect(wrapper.find("#select-template").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render upload button if showEditTemplate is true", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            expect(wrapper.find(".template-upload").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render more-button if more than two statistics are selected", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            wrapper.setData({showReferenceValues: true});
            wrapper.setData({selectedStatData: [{propertyName: "feature"}, {propertyName: "feature2"}, {propertyName: "feature3"}]});

            await wrapper.vm.$nextTick();

            expect(wrapper.find("#more-button").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should not render more-button if no statistic is selected", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData
                },
                localVue,
                store
            });

            wrapper.setData({showReferenceValues: true});
            wrapper.setData({selectedStatData: [{}]});

            await wrapper.vm.$nextTick();

            expect(wrapper.find("#more-button").exists()).to.be.false;
            wrapper.destroy();
        });
        it("should not find hint text for required field", () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            expect(wrapper.find(".hint").exists()).to.be.false;
            wrapper.destroy();
        });
        it("should find hint text for required field", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            await wrapper.find(".export-template").trigger("click");
            await wrapper.vm.$nextTick();

            expect(wrapper.find(".hint").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should find not hint text for required field after setting required data", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            wrapper.setData({templateName: "test"});
            wrapper.setData({selectedGeoData: [{layerId: "layerId"}]});
            wrapper.setData({selectedStatData: [{propertyName: "feature"}]});
            await wrapper.find(".export-template").trigger("click");
            await wrapper.vm.$nextTick();

            expect(wrapper.find(".hint").exists()).to.be.false;
            wrapper.destroy();
        });
    });
    describe("Computed", () => {
        describe("countSelectedStatistics", () => {
            it("should return true, if more than two statistics are selected", async () => {
                const wrapper = shallowMount(TemplateAdminForm, {
                    propsData: {
                        geoData,
                        statData
                    },
                    localVue,
                    store
                });

                wrapper.setData({selectedStatData: [{propertyName: "feature0"}, {propertyName: "feature1"}, {propertyName: "feature2"}]});

                await wrapper.vm.$nextTick();

                expect(wrapper.vm.countSelectedStatistics).to.be.true;
                wrapper.destroy();
            });
        });
    });

    describe("Interaction", () => {
        it("should set isValidated false", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            await wrapper.find(".export-template").trigger("click");
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.isValidated).to.be.false;
            wrapper.destroy();
        });
        it("should set isValidated true", async () => {
            const wrapper = shallowMount(TemplateAdminForm, {
                propsData: {
                    geoData,
                    statData,
                    showEditTemplate: true
                },
                localVue,
                store
            });

            wrapper.setData({templateName: "test"});
            wrapper.setData({selectedGeoData: [{layerId: "layerId"}]});
            wrapper.setData({selectedStatData: [{propertyName: "feature"}]});
            await wrapper.find(".export-template").trigger("click");
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.isValidated).to.be.true;
            wrapper.destroy();
        });
    });
    describe("Methods", () => {
        describe("setReferenceValueList", () => {
            it("should set the new reference value list", async () => {
                const wrapper = shallowMount(TemplateAdminForm, {
                        propsData: {
                            geoData,
                            statData,
                            showEditTemplate: true
                        },
                        localVue,
                        store
                    }),
                    referenceValue = {statName: "prop1", value: "11"};

                await wrapper.setData({
                    referenceValueList: []
                });

                await wrapper.vm.setReferenceValueList(referenceValue);
                expect(wrapper.vm.referenceValueList).to.be.deep.equal([referenceValue]);
                wrapper.destroy();
            });

            it("should set the reference value list by replacing one object element", async () => {
                const wrapper = shallowMount(TemplateAdminForm, {
                        propsData: {
                            geoData,
                            statData,
                            showEditTemplate: true
                        },
                        localVue,
                        store
                    }),
                    referenceValue = {statisticName: "prop1", value: "11"};

                await wrapper.setData({
                    referenceValueList: [{statisticName: "prop1", value: "12"}, {statisticName: "prop2", value: "13"}]
                });

                await wrapper.vm.setReferenceValueList(referenceValue);
                expect(wrapper.vm.referenceValueList).to.be.deep.equal([{statisticName: "prop2", value: "13"}, {statisticName: "prop1", value: "11"}]);
                wrapper.destroy();
            });

            it("should set the reference value list by deleting one object element", async () => {
                const wrapper = shallowMount(TemplateAdminForm, {
                        propsData: {
                            geoData,
                            statData,
                            showEditTemplate: true
                        },
                        localVue,
                        store
                    }),
                    referenceValue = {statisticName: "prop1", value: ""};

                await wrapper.setData({
                    referenceValueList: [{statisticName: "prop1", value: "12"}, {statisticName: "prop2", value: "13"}]
                });

                await wrapper.vm.setReferenceValueList(referenceValue);
                expect(wrapper.vm.referenceValueList).to.be.deep.equal([{statisticName: "prop2", value: "13"}]);
                wrapper.destroy();
            });
        });

        describe("getExportedData", () => {
            it("should return the right exported data", async () => {
                const wrapper = shallowMount(TemplateAdminForm, {
                        propsData: {
                            geoData,
                            statData,
                            showEditTemplate: true
                        },
                        localVue,
                        store
                    }),
                    templateName = "name",
                    templateDes = "description",
                    paraGeoData = [{layerId: "1001", label: "layer1"}, {layerId: "1002", label: "layer2"}],
                    paraStatData = [{propertyName: "prop1", label: "prop1"}, {propertyName: "prop2", label: "prop2"}],
                    toolData = {toolId: "print", label: "print"},
                    referenceValueList = [{statisticName: "prop1", value: "11"}, {statisticName: "prop2", value: "12"}];

                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).meta.title).to.be.equal("name");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).meta.info).to.be.equal("description");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).state.Maps.layerIds).to.be.deep.equal(["1001", "1002"]);
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).state.Tools.toolToOpen).to.be.equal("print");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).state.Tools.Dashboard.statsFeatureFilter).to.be.deep.equal(["prop1", "prop2"]);
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData, referenceValueList).state.Tools.Dashboard.orientationValues).to.be.deep.equal(referenceValueList);
                wrapper.destroy();
            });
        });
    });
});
