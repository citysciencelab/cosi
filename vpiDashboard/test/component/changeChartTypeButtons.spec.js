import ChangeChartTypeButtonsComponent from "../../components/ChangeChartTypeButtons.vue";
import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ change chart type buttons component"
 */
describe("addons/vpiDashboard/test/ change chart type buttons component", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(
            ChangeChartTypeButtonsComponent, {
                propsData: {
                    chartType: "bar"
                }
            }
        );
    });

    it("renders the component", () => {
        expect(wrapper.find(".chart-type-change-button-container").exists()).to.be.true;
    });

    it("emits the correct value when clicked on button", () => {
        let chartButton = wrapper.find(".btn-line");

        chartButton.trigger("click");
        wrapper.vm.$nextTick();

        expect(wrapper.emitted().updateChartType[0]).to.deep.equal(["line"]);

        chartButton = wrapper.find(".btn-bar");

        chartButton.trigger("click");
        wrapper.vm.$nextTick();

        expect(wrapper.emitted().updateChartType[1]).to.deep.equal(["bar"]);
    });
});
