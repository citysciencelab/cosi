import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticDashboardControls from "../../../components/StatisticDashboardControls.vue";
import indexStatisticDashboard from "../../../store/indexStatisticDashboard";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/statiscticDashboard/components/StatisticDashboardControls.vue", () => {
    const descriptions = [{
            title: "TitleOne",
            content: "ContentOne"
        },
        {
            title: "TitleTwo",
            content: "ContentTwo"
        },
        {
            title: "TitleThree",
            content: "ContentThree"
        }],
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: indexStatisticDashboard
                    }
                }
            }
        });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find no description", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.find(".description").exists()).to.be.false;
            wrapper.destroy();
        });

        it("should find a description", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue,
                store
            });

            expect(wrapper.find(".description p").text()).to.be.equal("TitleOneContentOne");
            wrapper.destroy();

        });

        it("should find a button toolbar", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.find(".btn-toolbar").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find two button groups", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.findAll(".btn-group")).lengthOf(1);
            wrapper.destroy();
        });
        it("should find switcher component", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.findComponent({name: "StatisticDashboardSwitcher"}).exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find difference component", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            wrapper.setData({showDifferenceModal: true});
            await wrapper.vm.$nextTick();

            expect(wrapper.find(".difference-modal").exists()).to.be.true;
            wrapper.destroy();
        });

        it("The close button should exist", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            await wrapper.setData({referenceTag: "2001"});
            expect(wrapper.find(".reference-tag").exists()).to.be.true;
            wrapper.destroy();
        });
    });

    describe("Computed Properties", () => {
        it("should set hasDescription to false", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            expect(wrapper.vm.hasDescription).to.be.false;
            wrapper.destroy();
        });

        it("should set hasDescription to true", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue,
                store
            });

            expect(wrapper.vm.hasDescription).to.be.true;
            wrapper.destroy();
        });

        it("should set init description content and title", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue,
                store
            });

            expect(wrapper.vm.contentDescription).to.be.equal("ContentOne");
            expect(wrapper.vm.titleDescription).to.be.equal("TitleOne");
            wrapper.destroy();
        });

        it("should set description content and title by the current index", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue,
                store
            });

            await wrapper.setData({
                currentDescriptionIndex: 1
            });

            expect(wrapper.vm.contentDescription).to.be.equal("ContentTwo");
            expect(wrapper.vm.titleDescription).to.be.equal("TitleTwo");
            wrapper.destroy();
        });
        it("should set precheckedViewSwitcher to buttonGroupControls 0 name", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                }),
                expected = wrapper.vm.buttonGroupControls[0].name;

            wrapper.vm.setChartTableToggle("table");
            expect(wrapper.vm.precheckedViewSwitcher).to.be.equal(expected);
            wrapper.destroy();
        });
        it("should set precheckedViewSwitcher to buttonGroupControls 1 name", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                }),
                expected = wrapper.vm.buttonGroupControls[1].name;

            wrapper.vm.setChartTableToggle("chart");
            expect(wrapper.vm.precheckedViewSwitcher).to.be.equal(expected);
            wrapper.destroy();
        });
    });

    describe("Lifecycle Hooks", () => {
        it("should set the referenceTag undefined", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            wrapper.vm.setSelectedReferenceData(undefined);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.referenceTag).to.be.undefined;
            wrapper.destroy();
        });

        it("should set the referenceTag value with label", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            await wrapper.vm.setSelectedReferenceData({value: {label: "2001", value: "2001"}});

            expect(wrapper.vm.referenceTag).to.be.equal("2001");
            wrapper.destroy();
        });

        it("should set the referenceTag value with value", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            await wrapper.vm.setSelectedReferenceData({value: "test"});

            expect(wrapper.vm.referenceTag).to.be.equal("test: ");
            wrapper.destroy();
        });
    });

    describe("Methods", () => {
        describe("handleReferenceTag", () => {
            it("should set the referenceTag to undefined if undefined is given", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        referenceData: {}
                    },
                    localVue,
                    store
                });

                wrapper.vm.handleReferenceTag(undefined);
                expect(wrapper.vm.referenceTag).to.be.undefined;
                wrapper.destroy();
            });
            it("should set the referenceTag to expected string if given param is an object with value attribute", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        referenceData: {}
                    },
                    localVue,
                    store
                });

                wrapper.vm.handleReferenceTag({value: "foo"});
                expect(wrapper.vm.referenceTag).to.be.equal("foo: ");
                wrapper.destroy();
            });
            it("should set the referenceTag to expected string if given param is an object with an object as value for the property value", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        referenceData: {}
                    },
                    localVue,
                    store
                });

                wrapper.vm.handleReferenceTag({value: {label: "foo"}});
                expect(wrapper.vm.referenceTag).to.be.equal("foo");
                wrapper.destroy();
            });
        });
        describe("nextDescription", () => {
            it("should set currentDescriptionIndex always to 0 if only one description is available", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions: [descriptions[0]]
                    },
                    localVue,
                    store
                });

                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });

            it("should set currentDescriptionIndex in the correct order", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });
        });
        describe("prevDescription", () => {
            it("should set currentDescriptionIndex always to 0 if only one description is available", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions: [descriptions[0]]
                    },
                    localVue,
                    store
                });

                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });

            it("should set currentDescriptionIndex in the correct order", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });
        });
    });

    describe("User Interaction", () => {
        it("should call 'showDifference' if the user click the difference button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    localVue,
                    store
                }),
                differenceButton = wrapper.findAll("button").at(0);

            await differenceButton.trigger("click");
            await wrapper.vm.$nextTick();

            expect(wrapper.find(".difference-modal").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should set the description index if the user click the left chevron button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                }),
                chevronLeftButton = wrapper.findAll("button.description-icons").at(0);

            await chevronLeftButton.trigger("click");
            expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
            wrapper.destroy();
        });

        it("should set the description index if the user click the right chevron button ", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue,
                    store
                }),
                chevronRightButton = wrapper.findAll("button.description-icons").at(1);

            await chevronRightButton.trigger("click");
            expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
            wrapper.destroy();
        });

        it("should remove the reference data", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue,
                store
            });

            await wrapper.setData({referenceTag: "2001"});
            await wrapper.find(".reference-tag button").trigger("click");
            expect(wrapper.vm.selectedReferenceData).to.be.undefined;
            expect(wrapper.vm.referenceTag).to.be.undefined;
            wrapper.destroy();
        });
    });
});
