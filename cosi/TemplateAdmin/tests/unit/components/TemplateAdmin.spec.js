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
            it("should return an empty array if second param is not an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getToolList({}, undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, {})).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, 1234)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getToolList({}, "1234")).to.be.an("array").that.is.empty;
            });

            it("should return the tool list with ascending order", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {name: "Information"}
                    },
                    toolsToFilter = ["print", "gfi"];

                expect(wrapper.vm.getToolList(tools, toolsToFilter)).to.be.deep.equal([
                    {toolId: "gfi", label: "Information"},
                    {toolId: "print", label: "Print tool"}
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
                    },
                    toolsToFilter = ["print", "gfi"];

                expect(wrapper.vm.getToolList(tools, toolsToFilter)).to.be.deep.equal([
                    {toolId: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });

            it("should return the tool list with ascending order without the hidden tool", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {name: "Information"},
                        draw: {name: "Draw tool", isVisibleInMenu: false}
                    },
                    toolsToFilter = ["print", "gfi", "draw"];

                expect(wrapper.vm.getToolList(tools, toolsToFilter)).to.be.deep.equal([
                    {toolId: "gfi", label: "Information"},
                    {toolId: "print", label: "Print tool"}
                ]);
                wrapper.destroy();
            });

            it("should return the tool list with ascending order filtered", () => {
                const wrapper = shallowMount(TemplateAdmin, {
                        localVue,
                        store
                    }),
                    tools = {
                        print: {name: "Print tool"},
                        gfi: {name: "Information"},
                        draw: {name: "Draw tool"}
                    },
                    toolsToFilter = ["print", "gfi"];

                expect(wrapper.vm.getToolList(tools, toolsToFilter)).to.be.deep.equal([
                    {toolId: "gfi", label: "Information"},
                    {toolId: "print", label: "Print tool"}
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
                        {propertyName: "bar", label: "BAR", valueType: false},
                        {propertyName: "foo", label: "FOO", valueType: false}
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
                        {propertyName: "bar", label: "BAR", valueType: false},
                        {propertyName: "foo", label: "FOO", valueType: false},
                        {propertyName: "fow", label: "FOW", valueType: false}
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
            it("should return array of objects if valueType is given", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [
                        {propertyName: "bar", label: "BAR", valueType: "absolute"},
                        {propertyName: "foo", label: "FOO", valueType: "relative"},
                        {propertyName: "fow", label: "fow", valueType: false}
                    ],
                    mappingList = [
                        {
                            category: "foo",
                            value: "FOO",
                            valueType: "relative"
                        },
                        {
                            category: "bar",
                            value: "BAR",
                            valueType: "absolute"
                        }
                    ],
                    filteredList = [["foo", "bar", "fow"]];

                expect(wrapper.vm.getMappedLabelByValue(filteredList, mappingList)).to.deep.equal(expected);
                wrapper.destroy();
            });
            it("should return an array of objects with value from first array as propertyName and as label if not exists in second param", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    expected = [
                        {propertyName: "bar", label: "BAR", valueType: false},
                        {propertyName: "foo", label: "FOO", valueType: false},
                        {propertyName: "fow", label: "fow", valueType: false}
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
        describe("getLayerNames", () => {
            it("should return an empty array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    layers = [],
                    layerNames = wrapper.vm.getLayerNames(layers);

                expect(layerNames).to.be.an("array").that.is.empty;
                wrapper.destroy();
            });
            it("should return an array", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    layers = [
                        {
                            "isSelected": false,
                            "format": "image/png",
                            "isBaseLayer": true,
                            "level": 0,
                            "parentId": "Baselayer",
                            "type": "layer",
                            "styleId": "default",
                            "id": "13534",
                            "name": "Geobasiskarten (Schriftplatte)",
                            "url": "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_Schriftplatte",
                            "typ": "WMS"
                        }
                    ],
                    layerNames = wrapper.vm.getLayerNames(layers);

                expect(layerNames).to.be.an("array").that.is.not.empty;
                wrapper.destroy();
            });
            it("should return arrays with correct properties", () => {
                const wrapper = shallowMount(TemplateAdmin, {store, localVue}),
                    layers = [
                        {
                            "isSelected": false,
                            "format": "image/png",
                            "isBaseLayer": true,
                            "level": 0,
                            "parentId": "Baselayer",
                            "type": "layer",
                            "styleId": "default",
                            "id": "13534",
                            "name": "Geobasiskarten",
                            "url": "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_Schriftplatte",
                            "typ": "WMS"
                        },
                        {
                            "isSelected": false,
                            "format": "image/png",
                            "isBaseLayer": true,
                            "level": 0,
                            "parentId": "Baselayer",
                            "type": "layer",
                            "styleId": "default",
                            "id": "23534",
                            "name": "Schriftplatte",
                            "url": "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_Schriftplatte",
                            "typ": "WMS"
                        }
                    ],
                    expected = [
                        {
                            layerId: "13534", label: "Geobasiskarten"
                        },
                        {
                            layerId: "23534", label: "Schriftplatte"
                        }
                    ],
                    layerNames = wrapper.vm.getLayerNames(layers);

                expect(layerNames).to.deep.equal(expected);
                wrapper.destroy();
            });
        });
    });
});