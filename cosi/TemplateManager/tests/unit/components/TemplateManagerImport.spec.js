import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateManagerImport from "../../../components/TemplateManagerImport.vue";
import sinon from "sinon";

config.mocks.$t = key => key;

const localVue = createLocalVue();

localVue.use(Vuex);

describe("addons/cosi/TemplateManager/components/TemplateManagerImport.vue", () => {
    let store, stubAddSingleAlert;

    const factory = {
        getShallowMount: () => {
            return shallowMount(TemplateManagerImport, {
                store,
                localVue
            });
        }
    };


    beforeEach(() => {
        stubAddSingleAlert = sinon.stub();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: stubAddSingleAlert
                    }
                }
            }
        });
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find a button", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.find("button").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find a hidden input of type 'file'", () => {
            const wrapper = factory.getShallowMount(),
                inputWrapper = wrapper.find("input");

            expect(inputWrapper.exists()).to.be.true;
            expect(inputWrapper.classes("d-none")).to.be.true;
            expect(inputWrapper.attributes("type")).to.be.equal("file");
            wrapper.destroy();
        });
    });

    describe("User Interactions", () => {
        it("should call 'triggerFileInput' if button is clicked", async () => {
            const spyTriggerFileInput = sinon.spy(TemplateManagerImport.methods, "triggerFileInput"),
                wrapper = factory.getShallowMount(),
                buttonWrapper = wrapper.find("button");

            await buttonWrapper.trigger("click");
            expect(spyTriggerFileInput.calledOnce).to.be.true;
            sinon.restore();
            wrapper.destroy();
        });

        it("should call 'loadFiles' if input is changed", async () => {
            const spyLoadFiles = sinon.spy(TemplateManagerImport.methods, "loadFiles"),
                wrapper = factory.getShallowMount(),
                inputWrapper = wrapper.find("input");

            await inputWrapper.trigger("change");
            expect(spyLoadFiles.calledOnce).to.be.true;
            sinon.restore();
            wrapper.destroy();
        });
    });

    describe("Methdos", () => {
        describe("triggerFileInput", () => {
            it("should call the 'click' method of the input if this function is called", () => {
                const wrapper = factory.getShallowMount(),
                    spyInputClick = sinon.spy(wrapper.vm.$el.querySelector("#file-input"), "click");

                wrapper.vm.triggerFileInput();
                expect(spyInputClick.calledOnce).to.be.true;
            });
        });

        describe("loadFiles", () => {
            it("should call 'addSingleAlert' if type(MIME) is not 'application/json'", () => {
                const obj = {
                        target: {
                            files: [{
                                type: "kein json",
                                name: "file one"
                            }]
                        }
                    },
                    wrapper = factory.getShallowMount();

                wrapper.vm.loadFiles(obj);
                expect(stubAddSingleAlert.calledOnce).to.be.true;
            });
        });

        describe("parseFileContent", () => {
            it("should call the 'addSingleAlert' if file content can not be parsed", () => {
                const obj = {
                        target: {
                            result: {}
                        }
                    },
                    wrapper = factory.getShallowMount();

                wrapper.vm.parseFileContent(obj);
                expect(stubAddSingleAlert.calledOnce).to.be.true;
            });

            it("should parse the given string to a json and emit it", () => {
                const obj = {
                        target: {
                            result: "{}"
                        }
                    },
                    wrapper = factory.getShallowMount();

                wrapper.vm.parseFileContent(obj);
                expect(wrapper.emitted().addTemplate[0]).to.deep.equal([{}]);
            });
        });
    });
});
