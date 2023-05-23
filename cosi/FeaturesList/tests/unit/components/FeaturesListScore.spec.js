import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import FeaturesListScore from "../../../components/FeaturesListScore.vue";
import sinon from "sinon";
import Vuetify from "vuetify";
import Vue from "vue";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);
localVue.use(Vuex);

/**
 * mocks vuetify data-app attr
 * @returns {void}
 */
function addElemWithDataAppToBody () {
    const app = document.createElement("div");

    app.setAttribute("data-app", true);
    document.body.append(app);
}

describe("addons/cosi/FeaturesList/components/FeaturesListScore.vue", () => {
    before(() => {
        addElemWithDataAppToBody();
        global.requestAnimationFrame = (fn) => fn();
        global.ShadowRoot = () => "";
    });

    let vuetify, store;

    const groupedLayerFake = [{
            group: "Bildung und Wissenschaft",
            layer: [{
                addressField: [
                    "adresse_strasse_hausnr",
                    "adresse_ort"
                ],
                categoryField: "kapitelbezeichnung",
                group: "Bildung und Wissenschaft",
                id: "Mein Layer",
                keyOfAttrName: "schulname",
                layerId: "1234",
                numericalValues: [{
                    id: "anzahl_schueler",
                    name: "Schülerzahl"
                }],
                weighting: 1
            }]
        }],
        factory = {
            getMount: () => {
                return mount(FeaturesListScore, {
                    store,
                    localVue,
                    vuetify,
                    propsData: {
                        featureList: [],
                        groupedLayer: []
                    },
                    data () {
                        return {
                            featureQueue: [],
                            showWeightsDialog: false,
                            selectedLayerList: [],
                            disableChartButtons: true
                        };
                    }
                });
            }
        };

    beforeEach(() => {
        vuetify = new Vuetify();
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        DistanceScoreService: {
                            namespaced: true,
                            actions: {
                                getDistanceScore: () => sinon.stub,
                                getFeatureValues: () => sinon.stub
                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(function () {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getMount();

            expect(wrapper.exists()).to.be.true;
        });

        it("should find vuetify card component", () => {
            const wrapper = factory.getMount(),
                card = wrapper.findComponent({name: "v-card"});

            expect(card.exists()).to.be.true;
        });

        it("should find Toolinfo component", () => {
            const wrapper = factory.getMount(),
                toolInfo = wrapper.findComponent({name: "ToolInfo"});

            expect(toolInfo.exists()).to.be.true;
        });

        it("should find child component Weights", () => {
            const wrapper = factory.getMount(),
                weights = wrapper.findComponent({name: "v-dialog"});

            expect(weights.exists()).to.be.true;
        });

        it("should find four disabled vuetify buttons", () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            expect(buttons.length).to.be.equal(4);
            buttons.wrappers.forEach(btn => {
                expect(btn.attributes("disabled")).to.be.equal("disabled");
            });
            expect(buttons.exists()).to.be.true;
        });

        it("should find vuetify autocomplete component", async () => {
            const wrapper = factory.getMount(),
                autocomplete = wrapper.findComponent({name: "v-autocomplete"});

            expect(autocomplete.exists()).to.be.true;
        });
    });

    describe("Computed Properties", () => {
        it("should set computed 'scoringIsOngoing' to true", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                featureQueue: ["was auch immer"]
            });

            expect(wrapper.vm.scoringIsOngoing).to.be.true;
        });

        it("should set computed 'progressValue' to 50", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                featureQueue: [1, 2, 3, 4, 5]

            });

            await wrapper.setProps({
                featureList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            });

            expect(wrapper.vm.progressValue).to.be.equal(50);
        });

        it("should set computed 'progressValue' to 0", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                featureQueue: [1, 2, 3, 4, 5]

            });

            expect(wrapper.vm.progressValue).to.be.equal(0);
        });

        it("should set computed 'progressValue' to 0", async () => {
            const wrapper = factory.getMount();

            await wrapper.setProps({
                featureList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            });

            expect(wrapper.vm.progressValue).to.be.equal(0);
        });

        it("should set computed 'layerList' correctly ", async () => {
            const wrapper = factory.getMount();

            await wrapper.setProps({
                groupedLayer: groupedLayerFake
            });

            expect(wrapper.vm.layerList[0]).to.be.an("object");
            expect(wrapper.vm.layerList[0]).to.have.a.property("header");
            expect(wrapper.vm.layerList[0].header).to.be.equal("Bildung und Wissenschaft");
            expect(wrapper.vm.layerList[1]).to.deep.equal(groupedLayerFake[0].layer[0]);
        });
    });

    describe("Watchers", () => {
        it("should call 'runFeaturesScore' after featureList was updated", async () => {
            const spyRunFeaturesScore = sinon.spy(FeaturesListScore.methods, "runFeaturesScore"),
                wrapper = factory.getMount();

            await wrapper.setProps({
                featureList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            });

            expect(spyRunFeaturesScore.calledOnce).to.be.true;
        });

        it("should not call 'runFeaturesScore' after featureList was updated", async () => {
            const spyRunFeaturesScore = sinon.spy(FeaturesListScore.methods, "runFeaturesScore"),
                wrapper = factory.getMount();

            await wrapper.setProps({
                featureList: []
            });

            expect(spyRunFeaturesScore.callCount).to.be.equal(0);
        });
    });

    describe("User Interactions", () => {
        it("should call runFeaturesScore if user clicks this button", async () => {
            const spyRunFeaturesScore = sinon.spy(FeaturesListScore.methods, "runFeaturesScore"),
                wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setData({
                selectedLayerList: ["was auch immer"]
            });

            await buttons.at(0).trigger("click");
            expect(spyRunFeaturesScore.calledOnce).to.be.true;
        });

        it("should call toggleWeightsDialog if user clicks this button", async () => {
            const spyToggleWeightsDialog = sinon.spy(FeaturesListScore.methods, "toggleWeightsDialog"),
                wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setData({
                selectedLayerList: [
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
            });

            await buttons.at(1).trigger("click");
            expect(spyToggleWeightsDialog.calledOnce).to.be.true;
        });

        it("should emit showDistanceScoresForSelected if user clicks this button", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setData({
                disableChartButtons: false
            });

            await buttons.at(2).trigger("click");
            expect(wrapper.emitted()).to.have.property("showDistanceScoresForSelected");
        });

        it("should emit showDistanceScoreHistogram if user clicks this button", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setData({
                disableChartButtons: false
            });

            await buttons.at(3).trigger("click");
            expect(wrapper.emitted()).to.have.property("showDistanceScoreHistogram");
        });
    });

    describe("Methdos", () => {
        describe("toggleWeightsDialog", () => {
            it("should set 'showWeightsDialog' to false", () => {
                const wrapper = factory.getMount();

                wrapper.vm.toggleWeightsDialog(false);
                expect(wrapper.vm.showWeightsDialog).to.be.false;
            });

            it("should call 'runFeaturesScore' when toggleWeightsDialog is called", () => {
                const spyRunFeaturesScore = sinon.spy(FeaturesListScore.methods, "runFeaturesScore"),
                    wrapper = factory.getMount();

                wrapper.vm.toggleWeightsDialog(false);
                expect(spyRunFeaturesScore.calledOnce).to.be.true;
            });

            it("should set 'showWeightsDialog' to true", () => {
                const wrapper = factory.getMount();

                wrapper.vm.toggleWeightsDialog(true);
                expect(wrapper.vm.showWeightsDialog).to.be.true;
            });
        });

        describe("getFeatureScore", () => {
            it("should get the correct score", () => {
                const wrapper = factory.getMount(),
                    score = {
                        distance: {
                            average: 10
                        },
                        height: {
                            average: 5
                        },
                        width: {
                            average: "7.5"
                        }
                    };

                wrapper.vm.getFeatureScore(score);
                expect(wrapper.vm.getFeatureScore(score)).to.be.equal("7.5");
            });
        });

        describe("runFeaturesScore", () => {
            it("should emit updateItems", async () => {
                const wrapper = factory.getMount();

                await wrapper.vm.runFeaturesScore([{}], [{
                    id: "123",
                    layerId: "456",
                    weighting: 1
                }]);
                expect(wrapper.emitted()).to.have.property("updateItems");
            });

            it("should emit updateItems with an array of objects that has certain keys", async () => {
                const wrapper = factory.getMount();

                await wrapper.vm.runFeaturesScore([{}], [{
                    id: "123",
                    layerId: "456",
                    weighting: 1
                }]);

                expect(wrapper.emitted().updateItems[0][0][0]).to.have.all.keys("score", "distanceScore");
            });

            it("should emit updateItems with an array of two items", async () => {
                const wrapper = factory.getMount();

                await wrapper.vm.runFeaturesScore([{}, {}], [{
                    id: "123",
                    layerId: "456",
                    weighting: 1
                }]);

                expect(wrapper.emitted().updateItems[0][0]).to.be.an("array").to.have.lengthOf(2);
            });
        });
    });
});
