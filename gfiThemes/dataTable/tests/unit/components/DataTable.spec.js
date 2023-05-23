import Vuex from "vuex";
import {shallowMount, createLocalVue, config} from "@vue/test-utils";
import {expect} from "chai";
import DataTableTheme from "../../../components/DataTable.vue";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("/src/modules/tools/gfi/components/themes/dataTable/components/DataTable.vue", () => {
    let wrapper,
        spyRunSorting;

    const featureData = {
            getTheme: () => {
                return {
                    "name": "DataTable",
                    "params": {
                        "enableDownload": true,
                        "isSortable": true
                    }
                };
            },
            getTitle: () => "DataTable",
            getAttributesToShow: () => {
                return {
                    entnahme_datum: "Entnahme Datum",
                    ohg_in_meter: "OHG in Meter"
                };
            },
            getMimeType: () => "text/xml",
            getFeatures: () => {
                return [{
                    getMappedProperties: () => {
                        return {
                            "Entnahme Datum": "2019",
                            "OHG in Meter": "0.10",
                            "UHG in Meter": "0.35",
                            "Arsen": "15,9",
                            "Cadmium": "1,38",
                            "Chrom": "21,6",
                            "Kupfer": "290,0",
                            "Quecksilber": "0,285",
                            "Nickel": "24,9",
                            "Blei": "289,0",
                            "Thallium": "---",
                            "Zink": "393,0",
                            "Molybdän": "4,53",
                            "Einheit": "mg/kg TM"
                        };
                    }
                },
                {
                    getMappedProperties: () => {
                        return {
                            "Entnahme Datum": "2019",
                            "OHG in Meter": "0.00",
                            "UHG in Meter": "0.10",
                            "Arsen": "14,7",
                            "Cadmium": "1,34",
                            "Chrom": "40,5",
                            "Kupfer": "774,0",
                            "Quecksilber": "0,346",
                            "Nickel": "22,9",
                            "Blei": "209,0",
                            "Thallium": "---",
                            "Zink": "568,0",
                            "Molybdän": "19,8",
                            "Einheit": "mg/kg TM"
                        };
                    }
                }];
            }
        },
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de-DE"
                    }
                }
            }
        });

    beforeEach(() => {
        spyRunSorting = sinon.spy(DataTableTheme.methods, "runSorting");
        wrapper = shallowMount(DataTableTheme, {
            localVue,
            store,
            propsData: {
                feature: featureData
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("It should exist a container for a data table", () => {
            expect(wrapper.find("#table-data-container").exists()).to.be.true;
        });

        it("Check the displayed table head", () => {
            const theads = wrapper.findAll("#table-data-container table th");

            expect(theads.exists()).to.be.true;

            wrapper.vm.columns.forEach((singleCaption, index) => {
                expect(theads.at(index).text()).to.equal(singleCaption.name);
            });
        });

        it("Check the displayed table data", () => {
            const trs = wrapper.findAll("#table-data-container table tr");

            expect(trs.exists()).to.be.true;

            trs.wrappers.forEach((tr, indexTr) => {
                const tds = tr.findAll("td");

                expect(tds.exists()).to.be.true;

                tds.wrappers.forEach((td, indexTd) => {
                    expect(td.text()).to.equal(Object.values(wrapper.vm.rows[indexTr])[indexTd]);
                });
            });
        });

        it("The enableDownload in computed section should be true", () => {
            expect(wrapper.vm.enableDownload).to.be.true;
        });

        it("It should contains a download button", () => {
            expect(wrapper.find(".download").exists()).to.be.true;
        });

        it("It should not contain a download button", async () => {
            const newFeature = {
                getTheme: () => "DataTable",
                getTitle: () => "DataTable",
                getAttributesToShow: () => {
                    return {};
                },
                getMimeType: () => "text/xml",
                getFeatures: () => []
            };

            await wrapper.setProps({feature: newFeature});

            expect(wrapper.find(".download").exists()).to.be.false;
        });

        it("should find two bootstrap icons if isSortable is true", () => {
            const icons = wrapper.findAll(".bootstrap-icon, .bi-arrow-down-up, .origin-order");

            expect(icons.length).to.be.equal(2);
        });

        it("should not find bootstrap icons if isSortable is false", async () => {
            const newFeature = {
                getTheme: () => {
                    return {
                        "name": "DataTable",
                        "params": {
                            "enableDownload": true,
                            "isSortable": false
                        }
                    };
                },
                getAttributesToShow: () => {
                    return {};
                },
                getFeatures: () => []
            };

            await wrapper.setProps({feature: newFeature});

            expect(wrapper.findAll(".bootstrap-icon, .bi-arrow-down-up, .origin-order").length).to.be.equal(0);
        });
        it("should have an dropdown as table head", async () => {
            const newFeature = {
                    getTheme: () => {
                        return {
                            "name": "DataTable",
                            "params": {
                                "enableDownload": true,
                                "isFilterable": true
                            }
                        };
                    },
                    getAttributesToShow: () => {
                        return {
                            "Entnahme Datum": "Entnahme Datum"
                        };
                    },
                    getFeatures: () => {
                        return [{
                            getMappedProperties: () => {
                                return {
                                    "Entnahme Datum": "2019"
                                };
                            }
                        }];
                    },
                    getTitle: sinon.stub()
                },
                wrapperNew = shallowMount(DataTableTheme, {
                    localVue,
                    propsData: {
                        feature: newFeature
                    },
                    computed: {
                        isFilterable () {
                            return true;
                        }
                    }
                });

            expect(wrapperNew.findAll(".multiselect-dropdown").exists()).to.be.true;
        });
    });

    describe("User Interactions", () => {
        it("should call 'runSorting' when the icon is clicked", async () => {
            const icon = wrapper.find(".bootstrap-icon");

            await icon.trigger("click");
            expect(spyRunSorting.calledOnce).to.be.true;
        });
    });

    describe("methods", () => {
        describe("getColumns", () => {
            it("should create the correct column objects", () => {
                const columns = wrapper.vm.getColumns({key1: "Moin", key2: "Tschüss"}),
                    expectedColumns = [{
                        name: "Moin",
                        order: "origin",
                        index: 0
                    },
                    {
                        name: "Tschüss",
                        order: "origin",
                        index: 1
                    }];


                expect(columns).to.deep.equal(expectedColumns);
            });
        });

        describe("getIconClassByOrder", () => {
            it("should return the correct icon class for ascending order", () => {
                const iconClass = wrapper.vm.getIconClassByOrder("asc");

                expect(iconClass).to.be.equal("bi-arrow-up");
            });

            it("should return the correct icon class for descending order", () => {
                const iconClass = wrapper.vm.getIconClassByOrder("desc");

                expect(iconClass).to.be.equal("bi-arrow-down");
            });

            it("should return the correct icon class for origin order", () => {
                const iconClass = wrapper.vm.getIconClassByOrder("origin");

                expect(iconClass).to.be.equal("bi-arrow-down-up origin-order");
            });
        });

        describe("getOldSortedColumn", () => {
            it("should return the old sorted column when there is a new one to be sorted", () => {
                const columns = [{
                        name: "Moin",
                        order: "asc",
                        index: 0
                    },
                    {
                        name: "Tschüss",
                        order: "origin",
                        index: 1
                    }],
                    sortedColumn = wrapper.vm.getOldSortedColumn(columns, 1);

                expect(sortedColumn).to.deep.equal(columns[0]);
            });

            it("should return undefined if the old sorted column is also the new one", () => {
                const columns = [{
                        name: "Moin",
                        order: "asc",
                        index: 0
                    },
                    {
                        name: "Tschüss",
                        order: "origin",
                        index: 1
                    }],
                    sortedColumn = wrapper.vm.getOldSortedColumn(columns, 0);

                expect(sortedColumn).to.be.undefined;
            });

            it("should return undefined if there is no sorted column", () => {
                const columns = [{
                        name: "Moin",
                        order: "origin",
                        index: 0
                    },
                    {
                        name: "Tschüss",
                        order: "origin",
                        index: 1
                    }],
                    sortedColumn = wrapper.vm.getOldSortedColumn(columns, 0);

                expect(sortedColumn).to.be.undefined;
            });
        });

        describe("getSortedRows", () => {
            it("should return the 'originRows' if the rows are to be sorted in their origin order", () => {
                const originRows = wrapper.vm.getSortedRows([], "origin");

                expect(originRows).to.deep.equal(wrapper.vm.originRows);
            });
            it("should return the rows in ascending order with the undefined data at the beginning", () => {
                const rows = [
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        },
                        {},
                        {
                            "name": "abc"
                        }
                    ],
                    expectRows = [
                        {},
                        {
                            "name": "abc"
                        },
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        }
                    ],
                    sortedRows = wrapper.vm.getSortedRows(rows, "asc", "name");

                expect(sortedRows).to.deep.equal(expectRows);
            });
            it("should return the rows in ascending order sorted by name", () => {
                const rows = [
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        },
                        {
                            "name": "abc"
                        }
                    ],
                    expectRows = [
                        {
                            "name": "abc"
                        },
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        }
                    ],
                    sortedRows = wrapper.vm.getSortedRows(rows, "asc", "name");

                expect(sortedRows).to.deep.equal(expectRows);
            });
            it("should return the rows in descending order sorted by name with the undefined data at the end", () => {
                const rows = [
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        },
                        {},
                        {
                            "name": "abc"
                        }
                    ],
                    expectRows = [
                        {
                            "name": "xyz"
                        },
                        {
                            "name": "klm"
                        },
                        {
                            "name": "abc"
                        },
                        {}
                    ],
                    sortedRows = wrapper.vm.getSortedRows(rows, "desc", "name");

                expect(sortedRows).to.deep.equal(expectRows);
            });
            it("should return the rows in descending order sorted by name", () => {
                const rows = [
                        {
                            "name": "klm"
                        },
                        {
                            "name": "xyz"
                        },
                        {
                            "name": "abc"
                        }
                    ],
                    expectRows = [
                        {
                            "name": "xyz"
                        },
                        {
                            "name": "klm"
                        },
                        {
                            "name": "abc"
                        }
                    ],
                    sortedRows = wrapper.vm.getSortedRows(rows, "desc", "name");

                expect(sortedRows).to.deep.equal(expectRows);
            });
        });

        describe("getSortOrder", () => {
            it("should return 'desc' order when passed 'asc'", () => {
                const order = wrapper.vm.getSortOrder("asc");

                expect(order).to.be.equal("desc");
            });

            it("should return 'origin' order when passed 'desc'", () => {
                const order = wrapper.vm.getSortOrder("desc");

                expect(order).to.be.equal("origin");
            });

            it("should return 'asc' order when passed 'origin'", () => {
                const order = wrapper.vm.getSortOrder("origin");

                expect(order).to.be.equal("asc");
            });
        });

        describe("runSorting", () => {
            it("should set the sort order for the columns correctly", () => {
                wrapper.vm.runSorting(wrapper.vm.columns[0]);

                expect(wrapper.vm.columns[0].order).to.be.equal("asc");
                expect(wrapper.vm.columns[1].order).to.be.equal("origin");
            });

            it("should set the sort order for the columns correctly", () => {
                wrapper.vm.columns[1].order = "asc";
                wrapper.vm.runSorting(wrapper.vm.columns[0]);

                expect(wrapper.vm.columns[0].order).to.be.equal("asc");
                expect(wrapper.vm.columns[1].order).to.be.equal("origin");
            });

            it("should set the sort order for the columns correctly", () => {
                wrapper.vm.columns[1].order = "asc";
                wrapper.vm.runSorting(wrapper.vm.columns[1]);

                expect(wrapper.vm.columns[0].order).to.be.equal("origin");
                expect(wrapper.vm.columns[1].order).to.be.equal("desc");
            });
        });

        describe("getUniqueValuesByColumnName", () => {
            it("should return an empty array if first param is not a string", () => {
                expect(wrapper.vm.getUniqueValuesByColumnName(undefined)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName(null)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName({})).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName([])).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName(true)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName(false)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName(1234)).to.deep.equal([]);
            });

            it("should return an empty array if second param is not an array", () => {
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", {})).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", "string")).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", 1234)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", true)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", false)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", undefined)).to.deep.equal([]);
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", null)).to.deep.equal([]);
            });

            it("should return an empty array if second param is an empty array", () => {
                expect(wrapper.vm.getUniqueValuesByColumnName("foo", [])).to.deep.equal([]);
            });

            it("should return an empty array if given head is not found in objects of the array", () => {
                const rows = [
                        {
                            foo: "bar",
                            fuz: "buz"
                        },
                        {
                            foo: "bar",
                            fuz: "buz"
                        }
                    ],
                    head = "fow";

                expect(wrapper.vm.getUniqueValuesByColumnName(head, rows)).to.deep.equal([]);
            });

            it("should return an array with keys as strings", () => {
                const rows = [
                        {
                            foo: "bar",
                            fuz: "buz"
                        },
                        {
                            foo: "bar",
                            fuz: "buz"
                        }
                    ],
                    head = "foo";

                expect(wrapper.vm.getUniqueValuesByColumnName(head, rows)).to.deep.equal(["bar"]);
            });
        });
        describe("addFilter", () => {
            it("should not update the filterObject property", () => {
                const copy = JSON.parse(JSON.stringify(wrapper.vm.filterObject));

                wrapper.vm.addFilter();
                expect(wrapper.vm.filterObject).to.deep.equal(copy);
            });

            it("should update the filterObject property", () => {
                const result = {foo: {bar: true}};

                wrapper.vm.addFilter("bar", "foo");
                expect(wrapper.vm.filterObject).to.deep.equal(result);
            });
        });
        describe("removeFilter", () => {
            it("should not update the filterObject property", () => {
                const copy = JSON.parse(JSON.stringify(wrapper.vm.filterObject));

                wrapper.vm.removeFilter();
                expect(wrapper.vm.filterObject).to.deep.equal(copy);
            });

            it("should update the filterObject property", () => {
                const result = {foo: {bar: true}};

                wrapper.vm.filterObject = {foo: {bar: true, buz: true}};
                wrapper.vm.removeFilter("buz", "foo");
                expect(wrapper.vm.filterObject).to.deep.equal(result);
            });
        });
        describe("getFilteredRows", () => {
            it("should return an empty array if first param is not an object", () => {
                expect(wrapper.vm.getFilteredRows(undefined)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows(null)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows(true)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows(false)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows("string")).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows(1234)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows([])).to.be.an("array").and.to.be.empty;
            });

            it("should return an empty array if the second param is not an array", () => {
                expect(wrapper.vm.getFilteredRows({}, undefined)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, null)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, {})).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, true)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, false)).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, "string")).to.be.an("array").and.to.be.empty;
                expect(wrapper.vm.getFilteredRows({}, 1234)).to.be.an("array").and.to.be.empty;
            });

            it("should return an array of found elements", () => {
                const filterObject = {foo: {bar: true}},
                    rows = [
                        {foo: "bar", fow: "wow"},
                        {foo: "baz", fow: "wow"}
                    ],
                    expected = [{foo: "bar", fow: "wow"}];

                expect(wrapper.vm.getFilteredRows(filterObject, rows)).to.deep.equals(expected);
            });
            it("should return an array of found elements", () => {
                const filterObject = {foo: {bar: true}, fow: {wow: true}},
                    rows = [
                        {foo: "bar", fow: "wow"},
                        {foo: "bar", fow: "pow"},
                        {foo: "baz", fow: "wow"}
                    ],
                    expected = [{foo: "bar", fow: "wow"}];

                expect(wrapper.vm.getFilteredRows(filterObject, rows)).to.deep.equals(expected);
            });
            it("should return an empty array if no elements found", () => {
                const filterObject = {foob: {bar: true}, foww: {wow: true}},
                    rows = [
                        {foo: "bar", fow: "wow"},
                        {foo: "bar", fow: "pow"},
                        {foo: "baz", fow: "wow"}
                    ];

                expect(wrapper.vm.getFilteredRows(filterObject, rows)).to.be.an("array").and.to.be.empty;
            });
        });
    });
});
