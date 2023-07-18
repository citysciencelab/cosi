import TabAgeGroups from "../../../components/Tabs/TabAgeGroups.vue";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ age groups tab component"
 */
describe("addons/vpiDashboard/test/ age groups tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    getters: {
                        ageGroupxLabels () {
                            return [];
                        },
                        allAgeGroupsMonthlyDataLine () {
                            return [];
                        },
                        allAgeGroupsMonthlyData () {
                            return [];
                        },
                        selectedLocationId () {
                            return "";
                        },
                        allAgeGroupsYears () {
                            return [];
                        },
                        ageGroupPieChartLabels () {
                            return [];
                        },
                        ageGroupsYearlyData () {
                            return [];
                        }
                    },
                    actions: {
                        getAllAgeGroupsData () {
                            return {};
                        }
                    }
                }
            }
        });

        wrapper = shallowMount(
            TabAgeGroups, {
                localVue,
                store}
        );
    });

    it("renders the age groups component", () => {
        expect(wrapper.find(".piechart").exists()).to.be.true;
    });

    it("sets the correct charttype", () => {
        wrapper.vm.setChartType("bar");

        expect(wrapper.vm.chartType).to.equal("bar");
        expect(wrapper.find(".bar").exists()).to.be.true;
        expect(wrapper.find(".line").exists()).to.be.false;

        wrapper.vm.setChartType("line");
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.chartType).to.equal("line");
            expect(wrapper.find(".bar").exists()).to.be.false;
            expect(wrapper.find(".line").exists()).to.be.true;
        });
    });
});
