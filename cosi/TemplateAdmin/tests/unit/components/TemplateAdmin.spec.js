import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateAdmin from "../../../components/TemplateAdmin.vue";
import TemplateAdminForm from "../../../components/TemplateAdminForm.vue";
import indexTemplateAdmin from "../../../store/indexTemplateAdmin";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/cosi/TemplateAdmin/components/TemplateAdmin.vue", () => {
    const store = new Vuex.Store({
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
        it("should render description", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find(".decription").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render tablist", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#templateTabs").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render add template tab", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#add-template-tab").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render edit template tab", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#edit-template-tab").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render TemplateAdminForm", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.findComponent(TemplateAdminForm).exists()).to.be.true;
            wrapper.destroy();
        });
    });

});
