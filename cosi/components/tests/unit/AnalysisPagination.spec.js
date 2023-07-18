import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import AnalysisPagination from "../../AnalysisPagination.vue";
import Vuetify from "vuetify";
import Vue from "vue";

config.mocks.$t = key => key;

const localVue = createLocalVue();

Vue.use(Vuetify);

describe("addons/cosi/components/AnalysisPagination.vue", () => {
    let vuetify;

    const factory = {
        getMount: () => {
            return mount(AnalysisPagination, {
                localVue,
                vuetify,
                propsData: {
                    sets: ["setOne", "setTwo"],
                    titles: {
                        downloads: ["Export"],
                        downloadAll: "All",
                        remove: "Day",
                        removeAll: "Long"
                    }
                }
            });
        }
    };

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getMount();

            expect(wrapper.exists()).to.be.true;
        });

        it("should find vuetify pagination component", () => {
            const wrapper = factory.getMount(),
                pagination = wrapper.findComponent({name: "v-pagination"});

            expect(pagination.exists()).to.be.true;
        });

        it("should find four vuetify button components with the correct title", () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            expect(buttons.exists()).to.be.true;
            expect(buttons).to.have.lengthOf(4);
            expect(buttons.at(0).text()).to.be.equal("Export");
            expect(buttons.at(0).attributes("title")).to.be.equal("Export");
            expect(buttons.at(1).attributes("title")).to.be.equal("All");
            expect(buttons.at(2).attributes("title")).to.be.equal("Day");
            expect(buttons.at(3).attributes("title")).to.be.equal("Long");
        });

        it("should find a fifth button if 'addFunction' is true", async () => {
            const wrapper = factory.getMount();

            let buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setProps({
                addFunction: true
            });

            buttons = wrapper.findAllComponents({name: "v-btn"});

            expect(buttons.exists()).to.be.true;
            expect(buttons).to.have.lengthOf(5);
        });
    });

    describe("User Interactions", () => {
        it("should emits 'downloadExport' with the correct payload if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(0).trigger("click");
            expect(wrapper.emitted()).to.have.property("downloadExport");
            expect(wrapper.emitted().downloadExport[0]).to.deep.equal([0]);
        });

        it("should emits 'downloadAll' if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(1).trigger("click");
            expect(wrapper.emitted()).to.have.property("downloadAll");
        });

        it("should emits 'removeSingle' with the correct payload if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(2).trigger("click");
            expect(wrapper.emitted()).to.have.property("removeSingle");
            expect(wrapper.emitted().removeSingle[0]).to.deep.equal([0]);
        });

        it("should emits 'removeAll' if the button is clicked", async () => {
            const wrapper = factory.getMount(),
                buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(3).trigger("click");
            expect(wrapper.emitted()).to.have.property("removeAll");
        });

        it("should emits 'addSet' if the button is clicked", async () => {
            const wrapper = factory.getMount();

            let buttons = wrapper.findAllComponents({name: "v-btn"});

            await wrapper.setProps({
                addFunction: true
            });

            buttons = wrapper.findAllComponents({name: "v-btn"});

            await buttons.at(0).trigger("click");
            expect(wrapper.emitted()).to.have.property("addSet");
        });
    });

    describe("Watcher", () => {
        it("should always sets 'page' to one higher than 'activeSet'", async () => {
            const wrapper = factory.getMount();

            await wrapper.setProps({
                activeSet: 3
            });

            expect(wrapper.vm.page).to.be.equal(4);
        });

        it("should emits 'setActiveSet' with the correct payload", async () => {
            const wrapper = factory.getMount();

            await wrapper.setData({
                page: 4
            });
            expect(wrapper.emitted()).to.have.property("setActiveSet");
            expect(wrapper.emitted().setActiveSet[0]).to.deep.equal([3]);
        });
    });
});
