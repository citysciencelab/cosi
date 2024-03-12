import VpiLoader from "../../components/VpiLoader.vue";
import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";


/**
 * Run these test via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ loader component"
 */

describe("addons/vpiDashboard/test/ loader component", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(VpiLoader, {propsData: {
            title: "Loader",
            detail: "overview",
            navigation: true,
            subtitle: "Test: Loader"
        }});
    });
    it("renders the loader component", ()=> {
        expect(wrapper.find("#vpiDashboardLoader").exists()).to.be.true;
    });

});
