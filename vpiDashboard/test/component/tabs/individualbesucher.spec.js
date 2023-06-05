import IndividualBesucherComponent from "../../../components/Tabs/IndividualBesucher.vue";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("individual visitor tab component", () => {
    let wrapper = null;

    before(() => {
        const store = new Vuex.Store({
            state: {},
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true
                }
            }
        });

        wrapper = shallowMount(
            IndividualBesucherComponent, {
                localVue,
                store}
        );
    });

    it("renders the individual besucher component", () => {
        expect(wrapper.find(".chartDataSelection").exists()).to.be.true;
    });

    it("recognizes the selectedChartData that needs user interaction", () => {
        wrapper.vm.selectedChartData = "hourly";
        expect(wrapper.vm.isIndividualChartType).to.be.true;
        wrapper.vm.selectedChartData = "timeRange";
        expect(wrapper.vm.isIndividualChartType).to.be.true;
        wrapper.vm.selectedChartData = "overview";
        expect(wrapper.vm.isIndividualChartType).to.be.false;
        wrapper.vm.selectedChartData = "dailyoverview";
        expect(wrapper.vm.isIndividualChartType).to.be.false;
        wrapper.vm.selectedChartData = "monthlyoverview";
        expect(wrapper.vm.isIndividualChartType).to.be.false;
    });

    it("sets the correct date picker title", () => {
        wrapper.vm.selectedChartData = "hourly";
        expect(wrapper.vm.datePickerTitle).to.satisfy(() => wrapper.vm.datePickerTitle.length > 0);
        wrapper.vm.selectedChartData = "timeRange";
        expect(wrapper.vm.datePickerTitle).to.satisfy(() => wrapper.vm.datePickerTitle.length > 0);
        wrapper.vm.selectedChartData = "overview";
        expect(wrapper.vm.datePickerTitle).to.have.lengthOf(0);
        wrapper.vm.selectedChartData = "dailyoverview";
        expect(wrapper.vm.datePickerTitle).to.have.lengthOf(0);
        wrapper.vm.selectedChartData = "monthlyoverview";
        expect(wrapper.vm.datePickerTitle).to.have.lengthOf(0);
    });

    it("sets the correct charttype", () => {
        wrapper.vm.setChartType("bar");

        expect(wrapper.vm.chartType).to.equal("bar");
    });

    it("switches chart correcly", () => {
        wrapper.vm.chartSubTitle = "ChartSubtitle";
        wrapper.vm.selectedChartData = "hourly";
        wrapper.vm.switchChart();

        expect(wrapper.vm.chartSubTitle).to.equal("");

        wrapper.vm.chartSubTitle = "ChartSubtitle";
        wrapper.vm.selectedChartData = "timeRange";
        wrapper.vm.switchChart();

        expect(wrapper.vm.chartSubTitle).to.equal("");
    });

    it("create chart data", () => {
        const responseData = [
                {
                    "date__hour": 0,
                    "avg_num_visitors": 42
                },
                {
                    "date__hour": 1,
                    "avg_num_visitors": 50
                }
            ],
            testvalue = wrapper.vm.createChartData(responseData, "bar", "hourly");

        expect(testvalue).to.be.an("object");
        expect(testvalue).to.have.property("labels");
        expect(testvalue.labels).to.be.an("array");
        expect(testvalue.labels).to.have.members(["0:00", "1:00"]);

        expect(testvalue).to.have.property("datasets");
        expect(testvalue.datasets).to.have.lengthOf(1);

        expect(testvalue.datasets[0]).to.have.property("data");
        expect(testvalue.datasets[0].data).to.be.an("array");
        expect(testvalue.datasets[0].data).to.have.members([42, 50]);
    });
});
