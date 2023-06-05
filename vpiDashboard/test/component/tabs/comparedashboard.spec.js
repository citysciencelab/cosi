import CompareDashboard from "../../../components/Tabs/CompareDashboard.vue";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("compare dashboard tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    getters: {
                        getDwellTimeLocationA () {
                            return {};
                        },
                        getDwellTimeLocationB () {
                            return {};
                        },
                        getAgeGroupsLocationA () {
                            return {};
                        },
                        getAgeGroupsLocationB () {
                            return {};
                        },
                        getVisitorTypesLocationA () {
                            return {};
                        },
                        getVisitorTypesLocationB () {
                            return {};
                        },
                        getIndividualVisitorsLocationA () {
                            return {};
                        },
                        getIndividualVisitorsLocationB () {
                            return {};
                        },
                        getAllLocationsArray () {
                            return [
                                {
                                    location: "xyz",
                                    street: "Stresemannstr."
                                },
                                {
                                    location: "abc",
                                    street: "Breite Str."
                                }
                            ];
                        }
                    },
                    actions: {
                        getDwellTimesToCompare () {
                            return {};
                        },
                        getAgeGroupsToCompare () {
                            return {};
                        },
                        getVisitorTypesToCompare () {
                            return {};
                        },
                        getIndividualVisitorsToCompare () {
                            return {};
                        }
                    }
                }
            }
        });

        wrapper = shallowMount(
            CompareDashboard, {
                localVue,
                store}
        );
    });

    it("renders the compare dashboard component", () => {
        expect(wrapper.find(".vpi-dashboard-compare-dashboard").exists()).to.be.true;
    });

    it("renders the location selection for location a", () => {
        expect(wrapper.find("#vpi-dashboard-select-location-a").exists()).to.be.true;
    });

    it("renders the location selection for location b", () => {
        expect(wrapper.find("#vpi-dashboard-select-location-b").exists()).to.be.true;
    });

    it("renders the character selection", () => {
        expect(wrapper.find("#vpi-dashboard-select-characteristic").exists()).to.be.true;
    });

    it("renders the character selection", () => {
        expect(wrapper.find("#vpi-dashboard-select-date").exists()).to.be.true;
    });
});
