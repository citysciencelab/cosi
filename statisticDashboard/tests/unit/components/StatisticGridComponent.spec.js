import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticGridComponent from "../../../components/StatisticGridComponent.vue";
import indexStatisticDashboard from "../../../store/indexStatisticDashboard";
const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/statiscticDashboard/components/StatisticGridComponent.vue", () => {

    const store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: indexStatisticDashboard
                    }
                }
            }
        }),
        propsData = {
            dates: [
                {
                    headers: ["Raumeinheit", "2023", "2022"],
                    items: [
                        ["Harburg", 1234, 1234],
                        ["Ludwigslust Parchim", 23456, 1234],
                        ["Lübeck", 23475, 1234],
                        ["Niedersachsen", 34844, 1234]
                    ]
                },
                {
                    headers: ["Raumeinheit", "2023", "2022"],
                    items: [
                        ["Harburg", 1234, 1234],
                        ["Ludwigslust Parchim", 23456, 1234],
                        ["Lübeck", 23475, 1234],
                        ["Niedersachsen", 34844, 1234]
                    ]
                }
            ]
        };

    describe("Component DOM", () => {
        it("The component should exist", () => {
            const wrapper = shallowMount(StatisticGridComponent, {
                propsData: propsData,
                localVue,
                store
            });

            expect(wrapper.find(".flex-container").exists()).to.be.true;
            expect(wrapper.find(".flex-item").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find two titles", () => {
            const wrapper = shallowMount(StatisticGridComponent, {
                propsData: {
                    dates: propsData.dates,
                    titles: ["Titel eins", "Titel zwei"]
                },
                localVue,
                store
            });

            expect(wrapper.findAll(".title").length).to.be.equal(2);
            wrapper.destroy();
        });
    });
});
