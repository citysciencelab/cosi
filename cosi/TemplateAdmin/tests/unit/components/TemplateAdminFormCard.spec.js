import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateAdminFormCard from "../../../components/TemplateAdminFormCard.vue";
import indexTemplateAdmin from "../../../store/indexTemplateAdmin";
import sinon from "sinon/pkg/sinon-esm";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/cosi/TemplateAdmin/components/TemplateAdminFormCard.vue", () => {
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

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should render card", () => {
            const wrapper = shallowMount(TemplateAdminFormCard, {
                propsData: {
                    title: "Card Title",
                    label: "Label",
                    unit: "%"
                },
                localVue,
                store
            });

            expect(wrapper.find(".card").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render close button", () => {
            const wrapper = shallowMount(TemplateAdminFormCard, {
                propsData: {
                    title: "Card Title",
                    label: "Label",
                    unit: "%"
                },
                localVue,
                store
            });

            expect(wrapper.find(".close-button").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render input field", () => {
            const wrapper = shallowMount(TemplateAdminFormCard, {
                propsData: {
                    title: "Card Title",
                    label: "Label",
                    unit: "%"
                },
                localVue,
                store
            });

            expect(wrapper.find("#referenceValue").exists()).to.be.true;
            wrapper.destroy();
        });
    });
    describe("User Interaction", () => {
        it("should emit 'removeCard' if the user click on close button", async () => {
            const wrapper = shallowMount(TemplateAdminFormCard, {
                    propsData: {
                        title: "Card Title",
                        label: "Label",
                        unit: "%"
                    },
                    localVue,
                    store
                }),
                button1 = wrapper.find(".close-button");

            await button1.trigger("click");
            expect(wrapper.emitted()).to.have.property("removeCard");
            wrapper.destroy();
        });
    });
});
