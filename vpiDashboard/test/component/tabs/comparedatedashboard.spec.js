import TabCompareDatesDashboard from "../../../components/Tabs/TabCompareDatesDashboard.vue";
import sortArrays from "../../../utils/sortArrays";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ compare date dashboard tab component"
 */
describe("addons/vpiDashboard/test/ compare date dashboard tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    getters: {
                        getDwellTimeDateA () {
                            return {};
                        },
                        getDwellTimeDateB () {
                            return {};
                        },
                        getAgeGroupsDateA () {
                            return {};
                        },
                        getAgeGroupsDateB () {
                            return {};
                        },
                        getVisitorTypesDateA () {
                            return {};
                        },
                        getVisitorTypesDateB () {
                            return {};
                        },
                        getActivitiesDateA () {
                            return {};
                        },
                        getActivitiesDateB () {
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
                        getDataToCompare () {
                            return {};
                        }
                    }
                }
            }
        });

        wrapper = shallowMount(
            TabCompareDatesDashboard, {
                localVue,
                store}
        );
    });
    it("renders the compare dashboard component", () => {
        expect(wrapper.find(".vpi-dashboard-compare-dashboard").exists()).to.be.true;
    });
    it("renders the date selection for date a", () => {
        expect(wrapper.find("#vpi-dashboard-select-date-a").exists()).to.be.true;
    });
    it("renders the date selection for date b", () => {
        expect(wrapper.find("#vpi-dashboard-select-date-b").exists()).to.be.true;
    });
    it("renders the character selection", () => {
        expect(wrapper.find("#vpi-dashboard-select-characteristic").exists()).to.be.true;
    });
});

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ sortAgeGroupArray"
 */
describe("addons/vpiDashboard/test/ sortAgeGroupArray", () => {
    // const sortArray = sortArrays.sortAgeGroupsArray(); // Replace with the correct path to your sortArray file

    it("should sort the array with numerical order and eliminate brackets", () => {
        const
            array = [">69", "[20-29]", "[30-39]", "[40-49]", "[50-59]", "[60-69]"],
            expectedSortedArray = ["20-29", "30-39", "40-49", "50-59", "60-69", ">69"],
            sortedArray = sortArrays.sortAgeGroupsArray(array);

        expect(sortedArray).to.deep.equal(expectedSortedArray);
    });
});

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ sortDwellTimeArray"
 */
describe("addons/vpiDashboard/test/ sortDwellTimeArray", () => {
    // const sortArray = sortArrays.sortAgeGroupsArray(); // Replace with the correct path to your sortArray file

    it("should sort the array with numerical order and eliminate brackets", () => {
        const
            array = ["120-240", "240+", "30-60", "60-120"],
            expectedSortedArray = ["30-60", "60-120", "120-240", "240+"],
            sortedArray = sortArrays.sortDwellTimeArray(array);

        expect(sortedArray).to.deep.equal(expectedSortedArray);
    });
});
