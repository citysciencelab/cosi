import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import TemplateAdmin from "../../../components/TemplateAdmin.vue";
import TemplateAdminForm from "../../../components/TemplateAdminForm.vue";
import TemplateAdminSate from "../../../store/stateTemplateAdmin";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/cosi/TemplateAdmin/components/TemplateAdmin.vue", () => {
    let store;
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        templateAdmin: {
                            "name": "translate#additional:modules.tools.cosi.templateAdmin.title",
                            "icon": "bi-folder2-open",
                            "ignorePropertyNames": []
                        }
                    }
                }
            }
        }
    };

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        TemplateAdmin: TemplateAdminSate
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Tools/TemplateAdmin/setActive", true);
        i18next.init({
            lng: "cimode",
            debug: false
        });
    });

    describe("Component DOM", () => {
        it("should render description", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find(".decription").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render tablist", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#templateTabs").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render add template tab", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#add-template-tab").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render edit template tab", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.find("#edit-template-tab").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render TemplateAdminForm", () => {
            const wrapper = shallowMount(TemplateAdmin, {
                localVue,
                store
            });

            expect(wrapper.findComponent(TemplateAdminForm).exists()).to.be.true;
            wrapper.destroy();
        });
    });
    describe("Methods", () => {
        describe("getToolList", () => {
            it("should return an empty array", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getToolList("")).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(null)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(undefined)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(true)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(0)).to.be.deep.equal([]);
                expect(wrapper.vm.getToolList(["test"])).to.be.deep.equal([]);
                wrapper.destroy();
            });

            it("should return the tool list with ascending order", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {name: "Information"}
                    };

                expect(wrapper.vm.getToolList(tools)).to.be.deep.equal([
                    {value: "gfi", label: "Information"},
                    {value: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });

            it("should return the tool list ignoring the tool without name", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {icon: "bi-icon"}
                    };

                expect(wrapper.vm.getToolList(tools)).to.be.deep.equal([
                    {value: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });
        });
        describe("getFilteredPropertyNames", () => {
            it("should return an empty array if first param is not an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue});

                expect(wrapper.vm.getFilteredPropertyNames(undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames({})).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames(null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames(true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames(false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames("1234")).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames(1234)).to.be.an("array").that.is.empty;
                wrapper.destroy();
            });
            it("should return an empty array if second param is not an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue});

                expect(wrapper.vm.getFilteredPropertyNames([], undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], {})).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], "1234")).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getFilteredPropertyNames([], 1234)).to.be.an("array").that.is.empty;
                wrapper.destroy();
            });
            it("should return first array if second array does not have any entry which matches with an entry of the first array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [["foo", "bar", "boo", "waa"]];

                expect(wrapper.vm.getFilteredPropertyNames(expected, ["loo", "low", "fow"])).to.deep.equal(expected);
                wrapper.destroy();
            });
            it("should return an filtered array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    toFilter = [["foo", "bar", "boo", "waa", "hoo"], ["foo1", "bar1", "boo1", "waa1", "hoo1"]],
                    toIgnore = ["hoo"],
                    expected = [["foo", "bar", "boo", "waa"], ["foo1", "bar1", "boo1", "waa1", "hoo1"]];

                expect(wrapper.vm.getFilteredPropertyNames(toFilter, toIgnore)).to.deep.equal(expected);
                wrapper.destroy();
            });
        });
        describe("getMappedLabelByValue", () => {
            it("should return an empty array if first param is not an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue});

                expect(wrapper.vm.getMappedLabelByValue(undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue({})).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue(null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue(true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue(false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue("1234")).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue(1234)).to.be.an("array").that.is.empty;
                wrapper.destroy();
            });
            it("should return an empty array if second param is not an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue});

                expect(wrapper.vm.getMappedLabelByValue([], undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], {})).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], "1234")).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getMappedLabelByValue([], 1234)).to.be.an("array").that.is.empty;
                wrapper.destroy();
            });
            it("should return an empty array if first param is not a nested array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue});

                expect(wrapper.vm.getMappedLabelByValue(["foo", "bar"], [{category: "foo", value: "FOO"}])).to.be.an("array").that.is.empty;
            });
            it("should return array of objects with propertyName as value of the first param and as label the value property of second param", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [
                        {propertyName: "bar", label: "BAR"},
                        {propertyName: "foo", label: "FOO"}
                    ],
                    mappingList = [
                        {
                            category: "foo",
                            value: "FOO"
                        },
                        {
                            category: "bar",
                            value: "BAR"
                        }
                    ],
                    filteredList = [["foo", "bar"]];

                expect(wrapper.vm.getMappedLabelByValue(filteredList, mappingList)).to.deep.equal(expected);
                wrapper.destroy();
            });
            it("should return array of objects with propertyName as value of the first param and as label the value property of second param for two nested lists", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [
                        {propertyName: "bar", label: "BAR"},
                        {propertyName: "foo", label: "FOO"},
                        {propertyName: "fow", label: "FOW"}
                    ],
                    mappingList = [
                        {
                            category: "foo",
                            value: "FOO"
                        },
                        {
                            category: "bar",
                            value: "BAR"
                        },
                        {
                            category: "fow",
                            value: "FOW"
                        }
                    ],
                    filteredList = [["foo", "bar"], ["fow"]];

                expect(wrapper.vm.getMappedLabelByValue(filteredList, mappingList)).to.deep.equal(expected);
                wrapper.destroy();
            });
            it("should return an array of objects with value from first array as propertyName and as label if not exists in second param", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [
                        {propertyName: "bar", label: "BAR"},
                        {propertyName: "foo", label: "FOO"},
                        {propertyName: "fow", label: "fow"}
                    ],
                    mappingList = [
                        {
                            category: "foo",
                            value: "FOO"
                        },
                        {
                            category: "bar",
                            value: "BAR"
                        }
                    ],
                    filteredList = [["foo", "bar", "fow"]];

                expect(wrapper.vm.getMappedLabelByValue(filteredList, mappingList)).to.deep.equal(expected);
                wrapper.destroy();
            });
        });
    });
});
