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
                    toolData = {toolId: "print", label: "print"};

                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData).meta.title).to.be.equal("name");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData).meta.info).to.be.equal("description");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData).state.Maps.layerIds).to.be.deep.equal(["1001", "1002"]);
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData).state.Tools.toolToOpen).to.be.equal("print");
                expect(wrapper.vm.getExportedData(templateName, templateDes, paraGeoData, paraStatData, toolData).state.Tools.Dashboard.statsFeatureFilter).to.be.deep.equal(["prop1", "prop2"]);
                wrapper.destroy();
            });
        });
    });
});
