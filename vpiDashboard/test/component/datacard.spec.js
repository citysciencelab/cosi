import DataCardComponent from "../../components/DataCard.vue";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ data card component"
 */
describe("addons/vpiDashboard/test/ data card component", () => {
    let wrapper = null;

    beforeEach(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true,
                    state: {
                        sumVisitorsPerMonth: [],
                        averageVisitorsPerDay: [],
                        activitiesPerYear: "",
                        visitorTypesByTypeAndYear: []
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
            DataCardComponent, {
                store,
                propsData: {
                    title: "Data-Card",
                    detail: "activities",
                    navigation: true,
                    subtitle: "Test: Untertitel Data Card"
                }
            }
        );
    });

    it("renders the data card component", () => {
        expect(wrapper.find("#cardData-Card").exists()).to.be.true;
    });

    it("changes the index correctly", () => {
        wrapper.vm.changeIndex(1);

        expect(wrapper.vm.currentYearIndex).to.equal(1);
        expect(wrapper.vm.currentDayIndex).to.equal(0);
        expect(wrapper.vm.currentMonthIndex).to.equal(0);

        expect(wrapper.emitted().indexChanged[0]).to.deep.equal([1]);

        // change Index to daily to see if correct current...Index value has been changed
        // this will lead to a warning in test run but since this prop will never change during program run we can ignore this
        wrapper.vm.detail = "daily";

        wrapper.vm.changeIndex(2);

        expect(wrapper.vm.currentYearIndex).to.equal(1);
        expect(wrapper.vm.currentDayIndex).to.equal(2);
        expect(wrapper.vm.currentMonthIndex).to.equal(0);

        expect(wrapper.emitted().indexChanged[1]).to.deep.equal([2]);

        // change Index to monthly to see if correct current...Index value has been changed
        // this will lead to a warning in test run but since this prop will never change during program run we can ignore this
        wrapper.vm.detail = "monthly";

        wrapper.vm.changeIndex(3);

        expect(wrapper.vm.currentYearIndex).to.equal(1);
        expect(wrapper.vm.currentDayIndex).to.equal(2);
        expect(wrapper.vm.currentMonthIndex).to.equal(3);

        expect(wrapper.emitted().indexChanged[2]).to.deep.equal([3]);

        // change Index to visitorTypeCommutersPerDay to see if correct current...Index value has been changed
        // this will lead to a warning in test run but since this prop will never change during program run we can ignore this
        wrapper.vm.detail = "visitorTypeCommutersPerDay";

        wrapper.vm.changeIndex(4);

        expect(wrapper.vm.currentYearIndex).to.equal(4);
        expect(wrapper.vm.currentDayIndex).to.equal(2);
        expect(wrapper.vm.currentMonthIndex).to.equal(3);

        expect(wrapper.emitted().indexChanged[3]).to.deep.equal([4]);

        // change Index to visitorTypeResidentsPerDay to see if correct current...Index value has been changed
        // this will lead to a warning in test run but since this prop will never change during program run we can ignore this
        wrapper.vm.detail = "visitorTypeResidentsPerDay";

        wrapper.vm.changeIndex(5);

        expect(wrapper.vm.currentYearIndex).to.equal(5);
        expect(wrapper.vm.currentDayIndex).to.equal(2);
        expect(wrapper.vm.currentMonthIndex).to.equal(3);

        expect(wrapper.emitted().indexChanged[4]).to.deep.equal([5]);

        // change Index to visitorTypeTouristsPerDay to see if correct current...Index value has been changed
        // this will lead to a warning in test run but since this prop will never change during program run we can ignore this
        wrapper.vm.detail = "visitorTypeTouristsPerDay";

        wrapper.vm.changeIndex(6);

        expect(wrapper.vm.currentYearIndex).to.equal(6);
        expect(wrapper.vm.currentDayIndex).to.equal(2);
        expect(wrapper.vm.currentMonthIndex).to.equal(3);

        expect(wrapper.emitted().indexChanged[5]).to.deep.equal([6]);


    });

    it("get list of years for paginator", () => {
        const thisYear = new Date().getFullYear();

        wrapper.vm.detail = "activities";

        expect(wrapper.vm.paginatorData).to.be.an("array");
        expect(wrapper.vm.paginatorData.length).to.equal(thisYear - 2019 + 1);
        expect(wrapper.vm.paginatorData[3]).to.equal(2022);
    });
});
