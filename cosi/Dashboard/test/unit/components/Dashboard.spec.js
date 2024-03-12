import Vuex from "vuex";
import {config, mount, shallowMount, createLocalVue} from "@vue/test-utils";
import DashboardStore from "../../../store/indexDashboard";
import Dashboard from "../../../components/Dashboard.vue";
import {expect} from "chai";
import sinon from "sinon";
import Vuetify from "vuetify";
import Vue from "vue";
import mapping from "./mock.mapping.json";
import selectedDistrictLevel from "./mock.districtLevel";
import testStandardChartDataset from "./test.chartDataset.0";
import testScatterChartDataset from "./test.chartDataset.1";
import testMultiChartDataset from "./test.chartDataset.2";

config.mocks.$t = key => key;
Vue.use(Vuetify);

const localVue = createLocalVue();

localVue.use(Vuex);

global.requestAnimationFrame = (fn) => fn();

/**
 * mocks vuetify data-app attr
 * @returns {void}
 */
function addElemWithDataAppToBody () {
    const app = document.createElement("div");

    app.setAttribute("data-app", true);
    document.body.append(app);
}


describe("addons/cosi/Dashboard/components/Dashboard.vue", () => {
    before(() => {
        global.ShadowRoot = () => "";
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            updateSize: () => sinon.stub()
        };

        mapCollection.addMap(map, "2D");
        addElemWithDataAppToBody();
    });

    let store, vuetify, wrapper, selectedDistrictLabelsStub, selectedDistrictNamesStub;

    const factory = {
        getMount: (mountFn = mount) => {
            return mountFn(Dashboard, {
                store,
                localVue,
                vuetify,
                sync: false
            });
        },
        initialize: async (mountFn = mount) => {
            wrapper = factory.getMount(mountFn);
            await wrapper.vm.$nextTick();
            store.commit("Tools/DistrictSelector/setLoadend", true);
            await wrapper.vm.$nextTick();
        }
    };

    beforeEach(async () => {
        vuetify = new Vuetify();
        selectedDistrictNamesStub = sinon.stub().returns(["Wolkenkuckucksheim"]);
        selectedDistrictLabelsStub = sinon.stub().returns(["Wolkenkuckucksheim (Statgebiet)"]);
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "en-US"
                    }
                },
                Tools: {
                    namespaced: true,
                    modules: {
                        Dashboard: DashboardStore,
                        ColorCodeMap: {
                            namespaced: true,
                            state: {
                                selectedYear: 2020,
                                playState: false,
                                selectedFeature: "",
                                visualizationState: false
                            },
                            getters: {
                                selectedYear: s => s.selectedYear,
                                playState: s => s.playState,
                                selectedFeature: s => s.selectedFeature,
                                visualizationState: s => s.visualizationState
                            },
                            mutations: {
                                setSelectedYear (s, p) {
                                    s.selectedYear = p;
                                },
                                setPlayState (s, p) {
                                    s.playState = p;
                                },
                                setSelectedFeature (s, p) {
                                    s.selectedFeature = p;
                                },
                                setVisualizationState (s, p) {
                                    s.visualizationState = p;
                                }
                            }
                        },
                        DistrictSelector: {
                            namespaced: true,
                            state: {
                                loadend: false
                            },
                            getters: {
                                selectedDistrictLevel: () => selectedDistrictLevel,
                                selectedDistrictNames: selectedDistrictNamesStub,
                                selectedDistrictLabels: selectedDistrictLabelsStub,
                                keyOfAttrNameStats: () => "statgebiet",
                                mapping: () => mapping,
                                loadend: s => s.loadend
                            },
                            mutations: {
                                addCategoryToMapping: sinon.stub(),
                                setLoadend (s, p) {
                                    s.loadend = p;
                                }
                            },
                            actions: {
                                updateDistricts: sinon.stub()
                            }
                        },
                        ChartGenerator: {
                            namespaced: true,
                            actions: {
                                channelGraphData: sinon.stub()
                            }
                        }
                    }
                }
            },
            getters: {
                isDefaultStyle: () => true,
                uiStyle: () => true,
                mobile: () => sinon.stub()
            }
        });
        store.commit("Tools/Dashboard/setActive", true);
        window.requestAnimationFrame = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();

        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("should render Component", async () => {
        await factory.initialize(shallowMount);
        expect(wrapper.find("#dashboard-wrapper").exists()).to.be.true;
        expect(wrapper.find("#dashboard-wrapper").html()).to.not.be.empty;
        expect(wrapper.find(".dashboard-table").exists()).to.be.true;
    });

    describe("Dashboard table", () => {
        it("should render the table", async () => {
            // init
            const spyGenerateTable = sinon.spy(Dashboard.methods, "generateTable");

            await factory.initialize();

            // test
            expect(spyGenerateTable.calledOnce).to.be.true;
            expect(wrapper.vm.districtColumns).to.have.lengthOf(2);
            expect(wrapper.vm.items).to.have.lengthOf(3);
        });
        it("should be filterable from the store", async () => {
            // init
            await factory.initialize();

            // test 1
            expect(wrapper.find("tbody").findAll("tr:not(.v-row-group__header)")).to.have.lengthOf(3);

            // act
            store.commit("Tools/Dashboard/setStatsFeatureFilter", ["Anteil der Arbeitslosen"]);
            await wrapper.vm.$nextTick();

            // test 2
            expect(wrapper.find("tbody").findAll("tr:not(.v-row-group__header)")).to.have.lengthOf(1);
            store.commit("Tools/Dashboard/setStatsFeatureFilter", []);
        });
        it("should be possible to move columns", async () => {
            let headers;

            // init
            await factory.initialize();
            headers = wrapper.findAll(".district-header");

            // test 1
            expect(headers.wrappers.map(h => h.find(".v-label").text()).slice(0, 2)).to.be.deep.equal(["Wolkenkuckucksheim (Statgebiet)", "Eimsbüttel"]);

            // act
            await headers.at(1).find(".move-col.left").trigger("click");
            headers = wrapper.findAll(".district-header");

            // test 2
            expect(headers.wrappers.map(h => h.find(".v-label").text()).slice(0, 2)).to.be.deep.equal(["Eimsbüttel", "Wolkenkuckucksheim (Statgebiet)"]);
        });
        it("should change data when year is changed", async () => {
            // init
            await factory.initialize();

            const row = wrapper.find("tbody").find("tr:not(.v-row-group__header)").findAll("td").at(4);

            // test 1
            expect(wrapper.vm.currentTimeStamp).to.equal(2020);
            expect(row.text()).to.equal(
                parseFloat(selectedDistrictLevel.districts[0].statFeatures[0].get("jahr_2020")).toLocaleString("en-US")
            );

            // act
            wrapper.vm.currentTimeStamp = 2018;
            await wrapper.vm.$nextTick();

            // test 2
            expect(store.getters["Tools/ColorCodeMap/selectedYear"]).to.equal(2018);
            expect(row.text()).to.equal(
                parseFloat(selectedDistrictLevel.districts[0].statFeatures[0].get("jahr_2018")).toLocaleString("en-US")
            );
        });
        it("should highlight data changed by simulation", async () => {
            // init
            selectedDistrictLevel.districts[0].statFeatures[2].set("isModified", 2018);
            await factory.initialize();

            // test
            expect(wrapper.find(".modified").exists()).to.be.true;
        });
        it("should expand the timeline", async () => {
            // init
            await factory.initialize();

            // test 1
            expect(wrapper.find(".timeline").exists()).to.be.false;

            // act
            await wrapper.find(".expand").trigger("click");

            // test 2
            expect(wrapper.find(".timeline").exists()).to.be.true;
            expect(wrapper.find(".timeline").findAll("li")).to.have.lengthOf(9);
        });
        it("should open burger menu", async () => {
            // init
            await factory.initialize();

            // test 1
            expect(wrapper.find(".burger-menu").exists()).to.be.false;

            // act
            await wrapper.find(".open-burger-menu").trigger("click");

            // test 2
            expect(wrapper.find(".burger-menu").exists()).to.be.true;
            expect(wrapper.findComponent({name: "v-toolbar-title"}).text()).to.be.equal(selectedDistrictLevel.districts[0].statFeatures[0].get("kategorie"));
        });
        it("should trigger visualization in the map", async () => {
            // init
            await factory.initialize();

            // act 1
            await wrapper.findAll(".visualize").at(0).trigger("click");

            // test 1
            expect(store.getters["Tools/ColorCodeMap/selectedFeature"]).to.be.equal(selectedDistrictLevel.districts[0].statFeatures[0].get("kategorie"));
            expect(store.getters["Tools/ColorCodeMap/visualizationState"]).to.be.equal(true);
            expect(wrapper.vm.items.map(item => item.visualized)).to.deep.equal([true, false, false]);

            // act 2
            await wrapper.findAll(".visualize").at(1).trigger("click");

            // test 2
            expect(store.getters["Tools/ColorCodeMap/selectedFeature"]).to.be.equal(selectedDistrictLevel.districts[0].statFeatures[1].get("kategorie"));
            expect(store.getters["Tools/ColorCodeMap/visualizationState"]).to.be.equal(true);
            expect(wrapper.vm.items.map(item => item.visualized)).to.deep.equal([false, true, false]);

            // act 3
            await wrapper.findAll(".visualize").at(1).trigger("click");

            // test 3
            expect(store.getters["Tools/ColorCodeMap/selectedFeature"]).to.be.equal(selectedDistrictLevel.districts[0].statFeatures[1].get("kategorie"));
            expect(store.getters["Tools/ColorCodeMap/visualizationState"]).to.be.equal(false);
            expect(wrapper.vm.items.map(item => item.visualized)).to.deep.equal([false, false, false]);
        });

        it("should be possible to select items", async () => {
            await factory.initialize();

            // act
            await wrapper.findAll(".open-burger-menu").at(0).trigger("click");
            await wrapper.findAll(".activator").at(0).trigger("click");
            await wrapper.find("#set-field-B").trigger("click");

            await wrapper.findAll(".open-burger-menu").at(1).trigger("click");
            await wrapper.findAll(".activator").at(3).trigger("click");
            await wrapper.findAll("#set-field-A").at(1).trigger("click");

            // test
            expect(wrapper.vm.fields.B).to.deep.equal(wrapper.vm.items[0]);
            expect(wrapper.vm.fields.A).to.deep.equal(wrapper.vm.items[1]);
        });
    });

    describe("Chart functions", () => {
        it("should render standard charts", async () => {
            const spyChannelGraphData = sinon.spy(Dashboard.methods, "channelGraphData");

            await factory.initialize();

            // act
            await wrapper.find(".open-burger-menu").trigger("click");
            await wrapper.findAll(".activator").at(2).trigger("click");
            await wrapper.find("#standard-charts").trigger("click");

            expect(spyChannelGraphData.calledOnce).to.be.true;
            expect(spyChannelGraphData.getCall(0).args[0]).to.deep.equal(testStandardChartDataset);
        });
        it("should render scatterplot", async () => {
            const spyChannelGraphData = sinon.spy(Dashboard.methods, "channelGraphData");

            await factory.initialize();

            // act
            await wrapper.findAll(".open-burger-menu").at(0).trigger("click");
            await wrapper.findAll(".activator").at(0).trigger("click");
            await wrapper.find("#set-field-B").trigger("click");

            await wrapper.findAll(".open-burger-menu").at(1).trigger("click");
            await wrapper.findAll(".activator").at(3).trigger("click");
            await wrapper.findAll("#set-field-A").at(1).trigger("click");

            await wrapper.findAll(".activator").at(2).trigger("click");
            await wrapper.find("#scatter-chart").trigger("click");

            expect(spyChannelGraphData.calledOnce).to.be.true;
            expect(spyChannelGraphData.getCall(0).args[0]).to.deep.equal(testScatterChartDataset);
        });
        it("should not render scatterplot when A and B not set", async () => {
            const spyChannelGraphData = sinon.spy(Dashboard.methods, "channelGraphData");

            await factory.initialize();

            // act
            await wrapper.find(".open-burger-menu").trigger("click");
            await wrapper.findAll(".activator").at(2).trigger("click");
            await wrapper.find("#scatter-chart").trigger("click");

            expect(wrapper.vm.fields).to.deep.equal({
                A: null,
                B: null
            });
            expect(spyChannelGraphData.callCount).to.equal(0);
        });
        it("should render chart for multiple rows", async () => {
            const spyChannelGraphData = sinon.spy(Dashboard.methods, "channelGraphData");

            await factory.initialize();

            // act
            wrapper.vm.selectedItems = [...wrapper.vm.items];
            await wrapper.find(".open-burger-menu").trigger("click");
            await wrapper.findAll(".activator").at(2).trigger("click");
            await wrapper.find("#chart-for-multiple-rows").trigger("click");

            expect(spyChannelGraphData.calledOnce).to.be.true;
            expect(spyChannelGraphData.getCall(0).args[0]).to.deep.equal(testMultiChartDataset);
        });
        it("should not render chart for multiple rows when no rows selected", async () => {
            const spyChannelGraphData = sinon.spy(Dashboard.methods, "channelGraphData");

            await factory.initialize();

            // act
            wrapper.vm.selectedItems = [];
            await wrapper.find(".open-burger-menu").trigger("click");
            await wrapper.findAll(".activator").at(2).trigger("click");
            await wrapper.find("#chart-for-multiple-rows").trigger("click");

            expect(spyChannelGraphData.callCount).to.equal(0);
        });
    });

    describe("Calculation functions", () => {
        it("create new table item by division", async () => {
            const spyCalculateAll = sinon.spy(Dashboard.methods, "calculateAll"),
                spyUpdateDistricts = sinon.spy(Dashboard.methods, "updateDistricts");

            await factory.initialize();

            // act
            await wrapper.findAll(".open-burger-menu").at(0).trigger("click");
            await wrapper.findAll(".activator").at(0).trigger("click");
            await wrapper.find("#set-field-B").trigger("click");

            await wrapper.findAll(".open-burger-menu").at(1).trigger("click");
            await wrapper.findAll(".activator").at(3).trigger("click");
            await wrapper.findAll("#set-field-A").at(1).trigger("click");

            await wrapper.findAll(".activator").at(1).trigger("click");
            await wrapper.find("#divide").trigger("click");
            await wrapper.find("#confirm-calc").trigger("click");

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.calculations).to.have.lengthOf(1);
            expect(spyCalculateAll.callCount).to.equal(1);
            expect(spyUpdateDistricts.callCount).to.equal(1);
        });
    });

    describe("Methods", () => {
        describe("getSelectedDistrictsLabels", async () => {
            await factory.initialize(shallowMount);

            const selectedLabels = wrapper.vm.getSelectedDistrictsLabels(selectedDistrictLevel.districts);

            expect(selectedLabels).to.deep.equal(["Wolkenkuckucksheim (Statgebiet)"]);
        });

        describe("handleOrientationColumn", () => {
            it("should not add a column for orientation values if no orientation values available", async () => {
                await factory.initialize(shallowMount);

                wrapper.vm.handleOrientationColumn(false, []);
                expect(wrapper.vm.aggregateColumns.length).to.be.equal(2);
            });

            it("should not add a columns for orientation if it already exists", async () => {
                await factory.initialize(shallowMount);

                wrapper.vm.aggregateColumns.push({value: "orientationValue"});
                wrapper.vm.handleOrientationColumn(true, wrapper.vm.aggregateColumns);
                expect(wrapper.vm.aggregateColumns.length).to.be.equal(3);
            });

            it("should add a column for orientation values", async () => {
                await factory.initialize(shallowMount);

                wrapper.vm.handleOrientationColumn(true, [1, 2]);
                expect(wrapper.vm.aggregateColumns.length).to.be.equal(3);
            });

        });

        describe("getColumnHeader", async () => {
            it("should return the default value", async () => {
                await factory.initialize(shallowMount);

                expect(wrapper.vm.getColumnHeader("value")).to.be.equal("value");
            });

            it("should return the default value if the value is not existed as key", async () => {
                store = new Vuex.Store({
                    namespaced: true,
                    modules: {
                        Language: {
                            namespaced: true,
                            getters: {
                                currentLocale: () => "en-US"
                            }
                        },
                        Tools: {
                            namespaced: true,
                            modules: {
                                Dashboard: {
                                    namespaced: true,
                                    state: {
                                        columnHeader: {
                                            "value1": "label1"
                                        }
                                    },
                                    getters: {
                                        active: () => true,
                                        name: () => "test",
                                        icon: () => "bi-speedometer",
                                        renderToWindow: () => false,
                                        resizableWindow: () => true,
                                        isVisibleInMenu: () => true,
                                        deactivateGFI: () => true,
                                        columnHeader: (state) => state.columnHeader,
                                        excludedPropsForExport: () => sinon.stub(),
                                        readmeUrl: () => "",
                                        statsFeatureFilter: () => [],
                                        calculations: () => [],
                                        reportTemplateMode: () => null,
                                        toolBridgeIn: () => sinon.stub(),
                                        toolBridgeOut: () => sinon.stub(),
                                        prefixExportFilename: () => ""
                                    }
                                },
                                ColorCodeMap: {
                                    namespaced: true,
                                    state: {
                                        selectedYear: 2020,
                                        playState: false,
                                        selectedFeature: "",
                                        visualizationState: false
                                    },
                                    getters: {
                                        selectedYear: s => s.selectedYear,
                                        playState: s => s.playState,
                                        selectedFeature: s => s.selectedFeature,
                                        visualizationState: s => s.visualizationState
                                    },
                                    mutations: {
                                        setSelectedYear (s, p) {
                                            s.selectedYear = p;
                                        },
                                        setPlayState (s, p) {
                                            s.playState = p;
                                        },
                                        setSelectedFeature (s, p) {
                                            s.selectedFeature = p;
                                        },
                                        setVisualizationState (s, p) {
                                            s.visualizationState = p;
                                        }
                                    }
                                },
                                DistrictSelector: {
                                    namespaced: true,
                                    state: {
                                        loadend: false
                                    },
                                    getters: {
                                        selectedDistrictLevel: () => selectedDistrictLevel,
                                        selectedDistrictNames: selectedDistrictNamesStub,
                                        selectedDistrictLabels: selectedDistrictLabelsStub,
                                        keyOfAttrNameStats: () => "statgebiet",
                                        mapping: () => mapping,
                                        loadend: s => s.loadend
                                    },
                                    mutations: {
                                        addCategoryToMapping: sinon.stub(),
                                        setLoadend (s, p) {
                                            s.loadend = p;
                                        }
                                    },
                                    actions: {
                                        updateDistricts: sinon.stub()
                                    }
                                },
                                ChartGenerator: {
                                    namespaced: true,
                                    actions: {
                                        channelGraphData: sinon.stub()
                                    }
                                }
                            }
                        }
                    },
                    getters: {
                        isDefaultStyle: () => true,
                        uiStyle: () => true,
                        mobile: () => sinon.stub()
                    }
                });

                await factory.initialize(shallowMount);

                expect(wrapper.vm.getColumnHeader("value1")).to.be.equal("label1");
            });
        });
    });
});
