import TabsComponent from "../../components/DashboardTabs.vue";
import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ Tabs component"
 */
describe("addons/vpiDashboard/test/ Tabs component", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(TabsComponent, {propsData: {
            TabItems: ["Tab 1", "Tab 2", "Tab 3"]
        }});
    });
    it("renders the tabs component", () => {
        expect(wrapper.find("#vpiDashboard-tabs").exists()).to.be.true;
    });
});
