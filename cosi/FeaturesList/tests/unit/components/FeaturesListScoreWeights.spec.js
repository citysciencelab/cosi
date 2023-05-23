import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import FeaturesListScoreWeight from "../../../components/FeaturesListScoreWeights.vue";
import sinon from "sinon";
import Vuetify from "vuetify";
import Vue from "vue";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);

/**
 * mocks vuetify data-app attr
 * @returns {void}
 */
function addElemWithDataAppToBody () {
    const app = document.createElement("div");

    app.setAttribute("data-app", true);
    document.body.append(app);
}

describe("addons/cosi/FeaturesList/components/FeaturesListScoreWeights.vue", () => {
    before(() => {
        addElemWithDataAppToBody();
    });

    let vuetify;

    const factory = {
        getMount: (isVisible = true) => {
            return mount(FeaturesListScoreWeight, {
                localVue,
                vuetify,
                propsData: {
                    isVisible: isVisible,
                    layerList: [
                        {
                            id: "123",
                            layerId: "456",
                            weighting: 1
                        },
                        {
                            id: "456",
                            layerId: "789",
                            weighting: 1
                        }
                    ]
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

        it("should find vuetify dialog component", () => {
            const wrapper = factory.getMount(),
                dialog = wrapper.findComponent({name: "v-dialog"});

            expect(dialog.exists()).to.be.true;
        });

        it("should find one vuetify subheader component for each layer in the layer list", () => {
            const wrapper = factory.getMount(),
                subheader = wrapper.findAllComponents({name: "v-subheader"});

            expect(subheader.exists()).to.be.true;
            expect(subheader).with.lengthOf(2);
        });
    });

    describe("Computed Properties", () => {
        it("should set computed 'show' to true", async () => {
            const wrapper = factory.getMount();

            expect(wrapper.vm.show).to.be.true;
        });

        it("should set computed 'show' to false", async () => {
            const wrapper = factory.getMount(false);

            expect(wrapper.vm.show).to.be.false;
        });
    });

    describe("User Interactions", () => {
        it("should call updateIsVisible if user clicks the button", async () => {
            const spyUpdateIsVisible = sinon.spy(FeaturesListScoreWeight.methods, "updateIsVisible"),
                wrapper = factory.getMount(),
                button = wrapper.findComponent({name: "v-btn"});

            await button.trigger("click");
            expect(spyUpdateIsVisible.calledOnce).to.be.true;
        });

        it("should set the weight of a layer correctly via the slider", async () => {
            const wrapper = factory.getMount(),
                sliderArray = wrapper.findAllComponents({name: "v-slider"}),
                sliderInput = sliderArray.at(0).find("input[type='number']");

            await sliderInput.setValue(0.3);
            expect(wrapper.vm.layerList[0].weighting).to.be.equal(0.3);
        });
    });

    describe("Methdos", () => {
        it("should emit 'toggleWeightsDialog' with the right payload when updateIsVisible called", () => {
            const wrapper = factory.getMount();

            wrapper.vm.updateIsVisible();
            expect(wrapper.emitted()).to.have.property("toggleWeightsDialog");
            expect(wrapper.emitted().toggleWeightsDialog[0]).to.deep.equal([false]);
        });
    });
});
