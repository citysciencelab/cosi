import Vuex from "vuex";
import
{
    config,
    mount,
    createLocalVue
} from "@vue/test-utils";
import ChartGeneratorComponent from "../../../components/ChartGenerator.vue";
import ChartGenerator from "../../../store/index";
import BarChart from "../../../components/charts/BarChart.vue";
import PieChart from "../../../components/charts/PieChart.vue";
import LineChart from "../../../components/charts/LineChart.vue";
import
{
    expect
} from "chai";
import sinon from "sinon";
import Vuetify from "vuetify";
import Vue from "vue";
import Tool from "../../../../../../src/modules/tools/ToolTemplate.vue";
import chartdata01 from "./chartdata01.json";

Vue.use(Vuetify);

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

// eslint-disable-next-line require-jsdoc
function getGraphData () {
    return JSON.parse(JSON.stringify(chartdata01));
}

describe("CharGenerator.vue", () => {
    // eslint-disable-next-line no-unused-vars
    let store, sandbox, addSingleAlertStub, cleanupStub, vuetify;

    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        ChartGenerator: {
                            name: "translate#additional:modules.tools.vueAddon.title",
                            icon: "bi-bar-chart",
                            yearSelector: "jahr_"
                        }
                    }
                }
            }
        }
    };

    beforeEach(() => {
        vuetify = new Vuetify();
        sandbox = sinon.createSandbox();
        addSingleAlertStub = sinon.stub();
        cleanupStub = sinon.stub();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        ChartGenerator: {
                            ...ChartGenerator,
                            state: {...ChartGenerator.state}
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: addSingleAlertStub,
                        cleanup: cleanupStub
                    }
                },
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de"
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            },
            getters: {
                uiStyle: () => true,
                mobile: () => sinon.stub()
            }
        });

        store.commit("Tools/ChartGenerator/setActive", true);
    });


    afterEach(function () {
        sandbox.restore();
    });

    // eslint-disable-next-line require-jsdoc
    async function mountComponent () {

        const wrapper = mount(ChartGeneratorComponent, {
            stubs: {Tool, BarChart},
            store,
            localVue,
            vuetify
        });

        await wrapper.vm.$nextTick();
        return wrapper;
    }

    it("should mount", async () => {
        const wrapper = await mountComponent();

        expect(wrapper.find("#chart_generator").html()).to.not.be.empty;
    });

    it.skip("should show info", async () => {
        const wrapper = await mountComponent();

        sinon.assert.callCount(addSingleAlertStub, 0);

        await wrapper.find(".info_button").trigger("click");

        sinon.assert.callCount(addSingleAlertStub, 1);
        expect(wrapper.find(".info_button").html()).to.not.be.empty;

        expect(addSingleAlertStub.firstCall.args[1]).to.include({
            category: "Info"
        });
        expect(addSingleAlertStub.firstCall.args[1].content).to.contain("Das Werkzeug \"Datenvisualisierung\" verwaltet Datensätze");
    });

    it("should create new multigraph", async function () {
        const wrapper = await mountComponent();

        await wrapper.vm.channelGraphData(getGraphData());

        expect(wrapper.vm.datasets[0].cgid).to.be.equal(chartdata01.cgid);
        expect(wrapper.vm.datasets[0].sub_graph).to.be.equal(0);
        expect(await wrapper.findComponent(LineChart).classes()).to.be.eql(["graph_sub", "current_graph"]);
        expect(await wrapper.findComponent(PieChart).classes()).to.be.eql(["graph_sub"]);
        expect(await wrapper.findComponent(BarChart).classes()).to.be.eql(["graph_sub"]);
    });

    it("should switch subgraph on multigraph", async function () {
        const wrapper = await mountComponent();

        await wrapper.vm.channelGraphData(getGraphData());

        await wrapper.findAll(".switch_btn").at(1).trigger("click");

        expect(wrapper.vm.datasets[0].sub_graph).to.be.equal(1);
        expect(await wrapper.findComponent(LineChart).classes()).to.be.eql(["graph_sub"]);
        expect(await wrapper.findComponent(BarChart).classes()).to.be.eql(["graph_sub", "current_graph"]);
        expect(await wrapper.findComponent(PieChart).classes()).to.be.eql(["graph_sub"]);

        await wrapper.findAll(".switch_btn").at(2).trigger("click");
        expect(wrapper.vm.datasets[0].sub_graph).to.be.equal(2);
        expect(await wrapper.findComponent(LineChart).classes()).to.be.eql(["graph_sub"]);
        expect(await wrapper.findComponent(BarChart).classes()).to.be.eql(["graph_sub"]);
        expect(await wrapper.findComponent(PieChart).classes()).to.be.eql(["graph_sub", "current_graph"]);
    });

    it("should create new graph data", async function () {
        const wrapper = await mountComponent(),
            data = {...getGraphData(), type: "BarChart"};

        await wrapper.vm.channelGraphData(data);

        expect(wrapper.vm.datasets[0].cgid).to.be.equal(chartdata01.cgid);
        expect(await wrapper.findComponent(BarChart).exists()).to.be.true;
        expect(await wrapper.findComponent(PieChart).exists()).to.be.false;
    });

    it("should activate last graph", async function () {
        const wrapper = await mountComponent(),
            data1 = {...getGraphData(), type: "BarChart", cgid: "1"},
            data2 = {...getGraphData(), type: "LineChart", cgid: "2"};

        await wrapper.vm.channelGraphData(data1);
        await wrapper.vm.channelGraphData(data2);

        expect(wrapper.vm.activeGraph).to.be.equal(1);
    });

    it("should update on same cgid", async function () {
        const wrapper = await mountComponent(),
            data1 = {...getGraphData(), type: "BarChart", cgid: "1"},
            data2 = {...getGraphData(), type: "LineChart", cgid: "1"};

        await wrapper.vm.channelGraphData(data1);
        await wrapper.vm.channelGraphData(data2);

        expect(wrapper.vm.datasets[0].type).to.be.equal("LineChart");
        expect(wrapper.vm.datasets.length).to.be.equal(1);
    });

    it("should switch graph", async function () {
        const wrapper = await mountComponent(),
            data1 = {...getGraphData(), type: "BarChart", cgid: "1"},
            data2 = {...getGraphData(), type: "LineChart", cgid: "2"};

        await wrapper.vm.channelGraphData(data1);
        await wrapper.vm.channelGraphData(data2);

        await wrapper.vm.selectGraph(0);
        expect(wrapper.vm.activeGraph).to.be.equal(0);

        await wrapper.vm.selectGraph(1);
        expect(wrapper.vm.activeGraph).to.be.equal(1);

        await wrapper.vm.selectGraph(0);
        expect(wrapper.vm.activeGraph).to.be.equal(0);
    });

    it("should remove graph", async function () {
        const wrapper = await mountComponent(),
            data1 = {...getGraphData(), type: "BarChart", cgid: "1"};

        await wrapper.vm.channelGraphData(data1);

        // await wrapper.findAll(".rm").at(0).trigger("click");
        await wrapper.vm.removeGraph(0);

        expect(wrapper.vm.datasets.length).to.be.equal(0);
        expect(wrapper.vm.active).to.be.equal(false);
    });
});

