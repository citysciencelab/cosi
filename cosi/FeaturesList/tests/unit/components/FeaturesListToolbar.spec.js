import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import FeaturesListToolbar from "../../../components/FeaturesListToolbar.vue";
import Vuetify from "vuetify";
import Vue from "vue";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);

describe("addons/cosi/FeaturesList/components/FeaturesListToolbar.vue", () => {
    let vuetify;

    const factory = {
        getMount: () => {
            return mount(FeaturesListToolbar, {
                localVue,
                vuetify,
                propsData: {
                    filterItems: []
                }
            });
        }
    };

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getMount();

            expect(wrapper.exists()).to.be.true;
        });

        it("should find vuetify select component", () => {
            const wrapper = factory.getMount(),
                select = wrapper.findComponent({name: "v-select"});

            expect(select.exists()).to.be.true;
        });

        it("should find vuetify text field component", () => {
            const wrapper = factory.getMount(),
                textField = wrapper.findComponent({name: "v-text-field"});

            expect(textField.exists()).to.be.true;
        });

        it("should find two vuetify button components", () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            expect(buttons.exists()).to.be.true;
            expect(buttons).to.have.lengthOf(2);
            expect(buttons.at(0).text()).to.be.equal("additional:modules.tools.cosi.featuresList.createCharts");
            expect(buttons.at(1).text()).to.be.equal("additional:modules.tools.cosi.featuresList.exportTable");
        });

        it("should find a third button for DIPAS", async () => {
            const wrapper = factory.getMount();

            let buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setProps({
                showDipasButton: true
            });

            buttons = wrapper.findAllComponents({name: "v-btn"});

            expect(buttons.exists()).to.be.true;
            expect(buttons).to.have.lengthOf(3);
        });

        it("should find two vuetify checkbox components", () => {
            const wrapper = factory.getMount(),
                checkbox = wrapper.findAllComponents({name: "v-checkbox"});

            expect(checkbox.exists()).to.be.true;
            expect(checkbox).to.have.lengthOf(2);
            expect(checkbox.at(0).text()).to.be.equal("additional:modules.tools.cosi.featuresList.sumUpLayers");
            expect(checkbox.at(1).text()).to.be.equal("additional:modules.tools.cosi.featuresList.exportDetails");
        });
    });

    describe("User Interactions", () => {
        it("should emit 'createCharts' if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(0).trigger("click");
            expect(wrapper.emitted()).to.have.property("createCharts");
        });

        it("should emit 'exportTable' with the correct payload if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(1).trigger("click");
            expect(wrapper.emitted()).to.have.property("exportTable");
            expect(wrapper.emitted().exportTable[0]).to.deep.equal([false]);
        });

        it("should emit 'createDipasCharts' if the button is clicked", async () => {
            const wrapper = factory.getMount();

            let buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setProps({
                showDipasButton: true
            });

            buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(1).trigger("click");
            expect(wrapper.emitted()).to.have.property("createDipasCharts");
        });
    });

    describe("Watcher", () => {
        it("should emit 'setSearch' with the correct payload if 'search' is set", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                search: "test"
            });

            expect(wrapper.emitted()).to.have.property("setSearch");
            expect(wrapper.emitted().setSearch[0]).to.deep.equal(["test"]);
        });

        it("should emit 'setLayerFilter' with the correct payload if 'selectedLayerList' is set", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                selectedLayerList: "test"
            });

            expect(wrapper.emitted()).to.have.property("setLayerFilter");
            expect(wrapper.emitted().setLayerFilter[0]).to.deep.equal(["test"]);
        });
    });
});
