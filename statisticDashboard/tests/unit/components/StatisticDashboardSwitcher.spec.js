import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticDashboardSwitcher from "../../../components/StatisticDashboardSwitcher.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/statiscticDashboard/components/StatisticDashboardSwitcher.vue", () => {
    const buttons = [{
            name: "Button1",
            icon: "bi bi-table"
        },
        {
            name: "Button2"
        }],
        precheckedValue = "Button2";

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                propsData: {
                    buttons,
                    group: "buttongroup",
                    precheckedValue
                },
                localVue
            });

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render buttongroup", () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                propsData: {
                    buttons,
                    group: "buttongroup",
                    precheckedValue
                },
                localVue
            });

            expect(wrapper.find(".btn-group").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render two buttons if two button names were given", () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                propsData: {
                    buttons,
                    group: "buttongroup",
                    precheckedValue
                },
                localVue
            });

            expect(wrapper.findAll(".btn")).lengthOf(2);
            wrapper.destroy();
        });
        it("should render icon if icon class was given", () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                propsData: {
                    buttons,
                    group: "buttongroup",
                    precheckedValue
                },
                localVue
            });

            expect(wrapper.find(".bi-table").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should set the button 2 as prechecked button", () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                propsData: {
                    buttons,
                    group: "buttongroup",
                    precheckedValue
                },
                localVue
            });

            expect(wrapper.find("#btnradio1Button2").element.checked).to.be.false;
            wrapper.destroy();
        });
    });
    describe("User Interaction", () => {
        it("should emit 'showView' if the user click on first button", async () => {
            const wrapper = shallowMount(StatisticDashboardSwitcher, {
                    propsData: {
                        buttons,
                        group: "buttongroup",
                        precheckedValue
                    },
                    localVue
                }),
                button1 = wrapper.findAll(".btn").at(0);

            await button1.trigger("click");
            expect(wrapper.emitted()).to.have.all.keys("showView");
            expect(wrapper.emitted().showView).deep.to.equal([["Button1"]]);
            wrapper.destroy();
        });
    });
    describe("Methods", () => {
        describe("getPrecheckedIndex", () => {
            it("should return 0 if the parameters are in the wrong format", async () => {
                const wrapper = shallowMount(StatisticDashboardSwitcher, {
                    propsData: {
                        buttons,
                        group: "buttongroup",
                        precheckedValue
                    },
                    localVue
                });

                expect(wrapper.vm.getPrecheckedIndex(null, "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex(0, "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex(false, "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex({}, "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex("test", "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex(undefined, "button")).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], 0)).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], null)).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], false)).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], [])).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], {})).to.equal(0);
                expect(wrapper.vm.getPrecheckedIndex([{name: "button1"}, {name: "button2"}], undefined)).to.equal(0);
                wrapper.destroy();
            });
            it("should return 0 if there are no prechecked value found", async () => {
                const wrapper = shallowMount(StatisticDashboardSwitcher, {
                        propsData: {
                            buttons,
                            group: "buttongroup",
                            precheckedValue
                        },
                        localVue
                    }),
                    paraButtons = [{name: "button1"}, {name: "button2"}],
                    paraPrecheckedValue = "button3";

                expect(wrapper.vm.getPrecheckedIndex(paraButtons, paraPrecheckedValue)).to.equal(0);
                wrapper.destroy();
            });
            it("should return the right index if the prechecked value is found", async () => {
                const wrapper = shallowMount(StatisticDashboardSwitcher, {
                        propsData: {
                            buttons,
                            group: "buttongroup",
                            precheckedValue
                        },
                        localVue
                    }),
                    paraButtons = [{name: "button1"}, {name: "button2"}],
                    paraPrecheckedValue = "button2";

                expect(wrapper.vm.getPrecheckedIndex(paraButtons, paraPrecheckedValue)).to.equal(1);
                wrapper.destroy();
            });
        });
    });
});
