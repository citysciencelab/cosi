import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import PolygonStylerSettings from "../../../components/PolygonStylerSettings.vue";
import Vuetify from "vuetify";
import Vue from "vue";
import Vuex from "vuex";
import sinon from "sinon";

config.mocks.$t = key => key;

const localVue = createLocalVue();

localVue.use(Vuex);
Vue.use(Vuetify);

describe("addons/cosi/PolygonStyler/components/PolygonStylerSettings.vue", () => {
    let vuetify, store;

    const styleList = [{
            attribute: "Chandler Bing",
            fill: {
                color: "#e3e3e3",
                opacity: 0
            },
            stroke: {
                color: "#e3e3e3",
                opacity: 1,
                width: 1
            }
        }],
        factory = {
            getShallowMount: (options) => {
                return shallowMount(PolygonStylerSettings, {
                    localVue,
                    vuetify,
                    store,
                    ...options
                });
            }
        };

    beforeEach(() => {
        vuetify = new Vuetify();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de"
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getShallowMount({
                propsData: {styleList}
            });

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find a hidden dialog component", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                dialogComponent = wrapper.findComponent("v-dialog-stub");

            expect(dialogComponent.exists()).to.be.true;
            expect(dialogComponent.vm.value).to.be.false;
            wrapper.destroy();
        });

        it("should find a visible dialog component", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {
                        isVisible: true,
                        styleList
                    }
                }),
                dialogComponent = wrapper.findComponent("v-dialog-stub");

            expect(dialogComponent.exists()).to.be.true;
            expect(dialogComponent.vm.value).to.be.true;
            wrapper.destroy();
        });

        it("should find a card title component with the correct text", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                cardTitleComponent = wrapper.findComponent("v-card-title-stub");

            expect(cardTitleComponent.exists()).to.be.true;
            expect(cardTitleComponent.text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.settings.title");
            wrapper.destroy();
        });

        it("should find a table component inside a card text component", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                cardTextComponent = wrapper.findComponent("v-card-text-stub"),
                tableComponent = cardTextComponent.findComponent("v-data-table-stub");

            expect(tableComponent.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find two button components inside a card actions component with the correct text", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                cardActionsComponent = wrapper.findComponent("v-card-actions-stub"),
                buttonComponents = cardActionsComponent.findAllComponents("v-btn-stub");

            expect(buttonComponents.exists()).to.be.true;
            expect(buttonComponents).to.have.lengthOf(3);
            expect(buttonComponents.at(0).text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.settings.applyButton");
            expect(buttonComponents.at(1).text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.removeButton");
            expect(buttonComponents.at(2).text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.settings.abortButton");
            wrapper.destroy();
        });

        it("should find a second hidden dialog component", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                dialogComponent = wrapper.findAllComponents("v-dialog-stub").at(1);

            expect(dialogComponent.exists()).to.be.true;
            expect(dialogComponent.vm.value).to.be.false;
            wrapper.destroy();
        });

        it("should find a second visible dialog component", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList},
                    data () {
                        return {
                            colorPickerDialog: true
                        };
                    }
                }),
                dialogComponent = wrapper.findAllComponents("v-dialog-stub").at(1);

            expect(dialogComponent.exists()).to.be.true;
            expect(dialogComponent.vm.value).to.be.true;
            wrapper.destroy();
        });

        it("should find a color picker component inside the second dialog", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                dialogComponent = wrapper.findAllComponents("v-dialog-stub").at(1);

            expect(dialogComponent.findComponent("v-color-picker-stub").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find two button components inside the second dialog component with the correct text", () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                dialogComponent = wrapper.findAllComponents("v-dialog-stub").at(1),
                buttonComponents = dialogComponent.findAllComponents("v-btn-stub");

            expect(buttonComponents.exists()).to.be.true;
            expect(buttonComponents).to.have.lengthOf(2);
            expect(buttonComponents.at(0).text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.settings.applyButton");
            expect(buttonComponents.at(1).text()).to.be.equal("additional:modules.tools.cosi.polygonStyler.settings.abortButton");
            wrapper.destroy();
        });
    });

    describe("User Interactions", () => {
        it("should emit 'updateStyle' if the button is clicked", async () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                buttons = wrapper.findAllComponents("v-btn-stub");

            await buttons.at(0).trigger("click");
            expect(wrapper.emitted()).to.have.property("updateStyle");
            wrapper.destroy();
        });

        it("should emit 'updateStyle' if the button is clicked", async () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                buttons = wrapper.findAllComponents("v-btn-stub");

            await buttons.at(1).trigger("click");
            expect(wrapper.emitted()).to.have.property("resetStyle");
            wrapper.destroy();
        });

        it("should emit 'hideDialog' if the button is clicked", async () => {
            const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                buttons = wrapper.findAllComponents("v-btn-stub");

            await buttons.at(2).trigger("click");
            expect(wrapper.emitted()).to.have.property("hideDialog");
            wrapper.destroy();
        });


        it("should call 'setColorToStyle' if the button is clicked", async () => {
            const spySetColorToStyle = sinon.stub(PolygonStylerSettings.methods, "setColorToStyle"),
                wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                buttons = wrapper.findAllComponents("v-btn-stub");

            await buttons.at(3).trigger("click");
            expect(spySetColorToStyle.calledOnce).to.be.true;
            wrapper.destroy();
        });

        it("should call toggleColorPickerDialog' if the button is clicked", async () => {
            const spyToggleColorPickerDialog = sinon.stub(PolygonStylerSettings.methods, "toggleColorPickerDialog"),
                wrapper = factory.getShallowMount({
                    propsData: {styleList}
                }),
                buttons = wrapper.findAllComponents("v-btn-stub");

            await buttons.at(4).trigger("click");
            expect(spyToggleColorPickerDialog.calledOnce).to.be.true;
            wrapper.destroy();
        });
    });

    describe("Methdos", () => {
        describe("toggleColorPickerDialog", () => {
            it("should set the correct color to the given style", () => {
                const wrapper = factory.getShallowMount({
                        propsData: {styleList}
                    }),
                    style = {
                        color: "init"
                    },
                    color = {
                        rgba: {
                            r: "red",
                            g: "green",
                            b: "blue",
                            a: "alpha"
                        }
                    };

                wrapper.vm.setColorToStyle(style, color);
                expect(style).to.deep.equal({color: "rgba(red, green, blue, alpha)"});
                wrapper.destroy();
            });

            it("should call toggleColorPickerDialog' if 'setColorToStyle' is called", () => {
                const spyToggleColorPickerDialog = sinon.stub(PolygonStylerSettings.methods, "toggleColorPickerDialog"),
                    wrapper = factory.getShallowMount({
                        propsData: {styleList}
                    }),
                    color = {
                        rgba: {
                            r: "red",
                            g: "green",
                            b: "blue",
                            a: "alpha"
                        }
                    };

                wrapper.vm.setColorToStyle({}, color);
                expect(spyToggleColorPickerDialog.calledOnce).to.be.true;
                wrapper.destroy();
            });
        });
        describe("setColorPickerValue", () => {
            it("should set 'colorPickerValue' correctly", () => {
                const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                });

                wrapper.vm.setColorPickerValue("#e3e3e3");
                expect(wrapper.vm.colorPickerValue).to.be.equal("#e3e3e3");
                wrapper.destroy();
            });
        });
        describe("setSelectedStyle", () => {
            it("should set 'selectedStyle' correctly", () => {
                const wrapper = factory.getShallowMount({
                    propsData: {styleList}
                });

                wrapper.vm.setSelectedStyle("style");
                expect(wrapper.vm.selectedStyle).to.be.equal("style");
                wrapper.destroy();
            });
            it("should call toggleColorPickerDialog' if 'setSelectedStyle' is called", () => {
                const spyToggleColorPickerDialog = sinon.stub(PolygonStylerSettings.methods, "toggleColorPickerDialog"),
                    wrapper = factory.getShallowMount({
                        propsData: {styleList}
                    });

                wrapper.vm.setSelectedStyle({});
                expect(spyToggleColorPickerDialog.calledOnce).to.be.true;
                wrapper.destroy();
            });
        });
        describe("toggleColorPickerDialog", () => {
            it("should toggle 'colorPickerDialog'", () => {
                const wrapper = factory.getShallowMount({
                    propsData: {styleList},
                    data () {
                        return {
                            colorPickerDialog: true
                        };
                    }
                });

                wrapper.vm.toggleColorPickerDialog();
                expect(wrapper.vm.colorPickerDialog).to.be.false;
                wrapper.destroy();
            });
        });
    });
});
