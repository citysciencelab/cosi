import TabVisitorTypesComponent from "../../../components/Tabs/TabVisitorTypes.vue";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ visitor types tab component"
 */
describe("addons/vpiDashboard/test/ visitor types tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    state: {
                        barChartData: {},
                        lineChartData: {}
                    },
                    actions: {
                        getVisitorTypes () {
                            return {};
                        }
                    },
                    getters: {
                        selectedLocationId () {
                            return "";
                        },
                        getVisitorTypesChartJsData (arg1, arg2) {
                            return {
                                [arg2]: arg1
                            };
                        }
                    }
                },
                "Language": {
                    namespaced: true,
                    actions: {
                        currentLocale () {
                            return [];
                        }
                    }
                }
            }
        });

        wrapper = shallowMount(
            TabVisitorTypesComponent, {
                localVue,
                store}
        );
    });

    it("renders the visitor types component", () => {
        expect(wrapper.find(".visitortypestab").exists()).to.be.true;
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

    it("computes year list correctly", () => {
        expect(wrapper.vm.yearList).to.be.an("array");
        expect(wrapper.vm.yearList).to.have.lengthOf(new Date().getFullYear() - 2019 + 1);
        expect(wrapper.vm.yearList[1]).to.equal(2020);
    });

    it("changes index", () => {
        wrapper.vm.changeIndex(1);

        expect(wrapper.vm.dataCardIndex).to.equal(1);
    });
});
