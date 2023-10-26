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
    describe("Methods", () => {
        describe("getToolList", () => {
            it("should return an empty array", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getToolList("")).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(null)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(undefined)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(true)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(0)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(["test"])).to.be.deep.equal([]);
                wrapper.destroy();
            });

            it("should return the tool list with ascending order", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {name: "Information"}
                    };

                expect(wrapper.vm.getToolList(tools)).to.be.deep.equal([
                    {value: "gfi", label: "Information"},
                    {value: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });

            it("should return the tool list ignoring the tool without name", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {icon: "bi-icon"}
                    };

                expect(wrapper.vm.getToolList(tools)).to.be.deep.equal([
                    {value: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });
        });
    });
});
