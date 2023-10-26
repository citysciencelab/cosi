import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateAdminForm from "../../../components/TemplateAdminForm.vue";
import indexTemplateAdmin from "../../../store/indexTemplateAdmin";

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
    });

});
