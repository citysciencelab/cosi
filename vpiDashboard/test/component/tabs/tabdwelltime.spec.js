import TabDwellTime from "../../../components/Tabs/TabDwellTime.vue";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ dwell time tab component"
 */
describe("addons/vpiDashboard/test/ dwell time tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    getters: {
                        selectedLocationId () {
                            return "";
                        },
                        getDwellTimeChartJsData: function (type, year) {
                            return {type: type, year: year};
                        }
                    },
                    actions: {
                        getDwellTimes () {
                            return [];
                        }
                    }
                }
            }
        });

        wrapper = shallowMount(
            TabDwellTime, {
                localVue,
                store}
        );
    });

    it("renders the dwell time component", () => {
        expect(wrapper.find(".tab-dwell-time").exists()).to.be.true;
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
