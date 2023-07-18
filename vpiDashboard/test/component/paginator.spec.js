import PaginatorComponent from "../../components/DataCardPaginator.vue";
import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ paginator component"
 */
describe("addons/vpiDashboard/test/ paginator component", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(PaginatorComponent, {propsData: {
            navigationFilter: {
                name: "Month"
            },
            paginatorData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            subtitleIndex: "Vegeta"
        }});
    });
    it("renders the paginator component", () => {
        expect(wrapper.find("#paginator").exists()).to.be.true;
    });
    it("should have a button to roll backward", () => {
        expect(wrapper.find("#paginator > nav > ul > li:nth-child(1)").exists()).to.be.true;
    });
    it("should have a index displaying data", () => {
        expect(wrapper.find(".paginator-index").exists()).to.be.true;
    });
    it("should have a button to roll forward", () => {
        expect(wrapper.find("#paginator > nav > ul > li:nth-child(3)").exists()).to.be.true;
    });
});
