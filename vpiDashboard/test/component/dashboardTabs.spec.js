import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import DashboardTabs from "../../components/DashboardTabs.vue";
import {expect} from "chai";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ DashboardTabs"
 */
describe("addons/vpiDashboard/test/ DashboardTabs", () => {
    let wrapper = null;
    const tabItems = [
        {name: "Tab 1", index: 0, selected: true},
        {name: "Tab 2", index: 1, selected: false},
        {name: "Tab 3", index: 2, selected: false}
    ];

    beforeEach(() => {
        const store = new Vuex.Store({
            state: {
                selectedLocationId: null,
                currentTabIndex: 0
            },
            modules: {
                "Tools/VpiDashboard": {
                    namespaced: true
                }
            }
        });

        wrapper = shallowMount(
            DashboardTabs, {
                localVue,
                store,
                propsData: {
                    tabItems: tabItems
                }
            }
        );
    });

    it("renders the component", () => {
        expect(wrapper.exists()).to.equal(true);
    });

    it("sets the default data values", () => {
        expect(wrapper.vm.currentTabIndex).to.equal(0);
    });

    it("renders tab items", () => {
        const tabLinks = wrapper.findAll(".nav-link");

        expect(tabLinks.length).to.equal(tabItems.length);
        tabItems.forEach((tab, index) => {
            expect(tabLinks.at(index).text()).to.equal(tab.name);
        });
    });

    it("changes tab when clicked", async () => {
        const secondTabLink = wrapper.findAll(".nav-link").at(1);

        await secondTabLink.trigger("click");

        expect(wrapper.vm.currentTabIndex).to.equal(1);
        expect(tabItems[1].selected).to.equal(true);
        expect(tabItems[0].selected).to.equal(false);
    });
});
