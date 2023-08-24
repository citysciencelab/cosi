<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import AnalysisPagination from "../../components/AnalysisPagination.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersChartGenerator";
import mutations from "../store/mutationsChartGenerator";
import actions from "../store/actionsChartGenerator";
import beautifyKey from "../../../../src/utils/beautifyKey";
import LineChart from "./charts/LineChart.vue";
import BarChart from "./charts/BarChart.vue";
import PieChart from "./charts/PieChart.vue";
import ScatterChart from "./charts/ScatterChart.vue";
import RadarChart from "./charts/RadarChart.vue";
import ToolInfo from "../../components/ToolInfo.vue";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {getModelByAttributes} from "../../utils/radioBridge.js";

export default {
    name: "ChartGenerator",
    components: {
        AnalysisPagination,
        Tool,
        ToolInfo,
        LineChart,
        BarChart,
        PieChart,
        ScatterChart,
        RadarChart
    },
    data () {
        return {
            // The ID of the active Graph in the ChartGenerator Tool Winodw
            activeGraph: 0,
            // String Beautifier
            beautifyKey: beautifyKey
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/ChartGenerator", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", ["selectedDistrictLevel", "selectedFeatures", "label", "keyOfAttrName", "keyOfAttrNameStats", "loadend", "metadataUrls"])
    },
    watch: {
        datasets (newDatasets, oldValue) {
            if (oldValue && newDatasets.length !== oldValue.length) {
                this.activeGraph = this.datasets.length - 1;
            }
            if (newDatasets.length === 0) {
                this.activeGraph -= 1;
            }
            if (this.datasets.length === 0) {
                this.setActive(false);
            }
        },
        async active (state) {
            if (state) {
                await this.$nextTick();

                if (this.$refs.chart) {
                    for (const chart of this.$refs.chart) {
                        chart.$el.style.height = "400px";
                        chart.$el.style.width = "400px";
                    }
                }
            }
        }

    },
    created () {
        this.$on("close", this.close);
    },
    /**
     * Put initialize here if mounting occurs after config parsing
     * @returns {void}
     */
    async mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapMutations("Tools/ChartGenerator", Object.keys(mutations)),
        ...mapActions("Tools/ChartGenerator", Object.keys(actions)),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),

        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({id: this.id});

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * @description Activates the tool window of the chartgenerator.
         * @returns {Void} Function returns nothing.
         */
        activatePanel () {
            this.setActive(true);
        },
        /**
         * @description Select graph to be displayed in tool window.
         * @param {Integer} value Index of the dataset in this.datasets array.
         * @returns {Void} Function returns nothing.
         */
        selectGraph (value) {
            this.activeGraph = value;
        },
        /**
         * @description Changes between the styles if a dataset has multiple graph types.
         * @param {Object} graph Data of the graph.
         * @param {Integer} index Subindex of the type of the graph.
         * @returns {Void} Function returns nothing.
         */
        changeGraph (graph, index) {
            this.$set(this.datasets, this.datasets.indexOf(graph), {...graph, sub_graph: index});
        },
        /**
         * @description Selects the next or the previous graph in the Tool Window.
         * @param {Integer} value +1 or -1.
         * @returns {Void} Function returns nothing.
         */
        graphPrevNext (value) {
            const l = this.datasets.length;

            this.activeGraph = (((this.activeGraph + value) % l) + l) % l; // modulo with negative handling
        },
        /**
         * @description Updates chart canvas to display yAxes starting from zero or reverse.
         * @returns {Void} Function returns nothing.
         */
        yToZero () {
            const
                i = this.activeGraph,
                graph = this.datasets[i],
                config = this.chartConfigs[i],
                beginAtZero = !graph.beginAtZero;

            if (graph.sub_graph !== null && graph.sub_graph !== undefined) {
                config[graph.sub_graph].beginAtZero = beginAtZero;
            }
            else {
                config.beginAtZero = beginAtZero;
            }

            this.$set(this.datasets, i, {...graph, beginAtZero});
        },

        /**
         * @description Updates chart canvas to display yAxes to be stacked or reverse.
         * @returns {Void} Function returns nothing.
         */
        yStacked () {
            this.modifyChart("stacked");
        },

        modifyChart (param) {
            const
                i = this.activeGraph,
                graph = this.datasets[i],
                config = this.chartConfigs[i],
                value = !graph[param];

            if (graph.sub_graph !== null && graph.sub_graph !== undefined) {
                config[graph.sub_graph][param] = value;
            }
            else {
                config[param] = value;
            }

            this.$set(this.datasets, i, {...graph, [param]: value});
        },

        /**
         * @description Turns closest Canvas to PNG and passes it the download function.
         * @param {$event} event Click event handler.
         * @returns {Void} Function returns nothing.
         */
        downloadGraph () {
            const chartBox = this.$el.querySelectorAll(".current_graph");

            chartBox.forEach(graph => {
                graph.querySelectorAll("canvas").forEach(canvas => {
                    const canvasPNG = canvas.toDataURL("image/png");

                    this.downloadFile(canvasPNG);
                });
            });

        },
        /**
         * @description Triggers Download function for every Chart Canvas available.
         * @returns {Void} Function returns nothing.
         */
        downloadAll () {
            const chartBox = this.$refs.chart,
                zip = new JSZip();

            chartBox.forEach((canvas, i) => {
                const canvasPNG = canvas.$refs.canvas.toDataURL("image/png");

                zip.file("cosi_chart_" + i + ".png", canvasPNG);
            });

            zip.generateAsync({type: "blob"})
                .then(function (content) {
                    saveAs(content, "cosi_graphen.zip");
                });
        },
        /**
         * @description Downloads File.
         * @param {Object} img Image to be downloaded.
         * @returns {Void} Function returns nothing.
         */
        downloadFile (img) {
            const vLink = document.createElement("a");

            vLink.href = img;
            vLink.download = "cosi_chart.png";

            vLink.click();
        },
        /**
         * @description Deletes a graph from the Tool Window.
         * @param {Integer} index Index of the graph to be deleted in the this.datasets Array.
         * @returns {Void} Function returns nothing.
         */
        removeGraph (index) {
            if (this.activeGraph === this.datasets.length - 1) {
                this.activeGraph -= 1;
            }

            this.chartConfigs.splice(index, 1);
            this.datasets.splice(index, 1);
        },
        /**
         * @description Clears datasets Array and thus deleting all graphs from Chart Generator.
         * @returns {Void} Function returns nothing.
         */
        removeAll () {
            this.setDatasets([]);
            this.setChartConfigs([]);
            this.setActive(false);
        },

        /**
         * updates the chart on window resize
         * @param {Event} evt - the dom event
         * @returns {void}
         */
        onEndResizing (evt) {
            const
                width = evt.targetElement.clientWidth - 40, // padding of tool-content ...
                height = evt.targetElement.clientHeight - 275; // hard coded from the DOM ...

            if (this.$refs.chart) {
                for (const chart of this.$refs.chart) {
                    chart.$el.style.width = width + "px";
                    chart.$el.style.height = height + "px";
                }
            }
        }
    }
};
</script>

<template lang="html">
    <Tool
        id="chart-generator-win"
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="440"
        @endResizing="onEndResizing"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="chart_generator"
            >
                <ToolInfo
                    :url="readmeUrl"
                    :locale="currentLocale"
                />
                <div
                    id="chart_panel"
                    class="wrapper"
                >
                    <div
                        v-for="(graph, index) in datasets"
                        :key="graph.cgid"
                        class="graph"
                        :class="{active: activeGraph === index}"
                    >
                        <div
                            class="graph_wrapper"
                        >
                            <div class="graph_head">
                                <span><h3>{{ beautifyKey(graph.name) }}</h3></span>
                                <span><p>Quelle: <strong>{{ graph.source }}</strong></p></span>
                                <div
                                    class="btn_grp"
                                >
                                    <template
                                        v-if="Array.isArray(graph.type)"
                                    >
                                        <button
                                            v-for="(type, i) in graph.type"
                                            :key="type"
                                            class="switch_btn"
                                            :class="{highlight: graph.sub_graph === i}"
                                            :style="{backgroundImage: 'url(' + require('../assets/' + type + '.png') + ')'}"
                                            :title="$t('additional:modules.tools.cosi.chartGenerator.' + type + '') + $t('additional:modules.tools.cosi.chartGenerator.switchChartType')"
                                            @click="changeGraph(graph, i)"
                                        />
                                    </template>
                                </div>
                            </div>
                            <div class="graph_body">
                                <div
                                    :id="`graph-${index}`"
                                    class="graph_box"
                                >
                                    <template v-if="Array.isArray(graph.type)">
                                        <div class="multigraph">
                                            <div
                                                v-for="(type, i) in graph.type"
                                                :key="type"
                                                class="multi_graph"
                                                :class="{active: graph.sub_graph === i}"
                                            >
                                                <component
                                                    :is="type"
                                                    v-if="type!=='PieChart'"
                                                    :id="`graph-${index}-${i}`"
                                                    ref="chart"
                                                    :datasets="chartConfigs[index][i]"
                                                    :options="graph.options"
                                                    class="graph_sub"
                                                    :class="{current_graph: graph.sub_graph === i && activeGraph === index}"
                                                />
                                                <template
                                                    v-if="type==='PieChart'"
                                                >
                                                    <PieChart
                                                        v-for="(pieData, j) in chartConfigs[index][i]"
                                                        :id="`graph-${index}-${i}-${j}`"
                                                        :key="`graph-${index}-${i}-${j}`"
                                                        ref="chart"
                                                        :datasets="pieData"
                                                        :options="graph.options"
                                                        class="graph_sub"
                                                        :class="{current_graph: graph.sub_graph === i && activeGraph === index}"
                                                    />
                                                </template>
                                                <div class="graph_functions">
                                                    <button
                                                        v-if="type === 'LineChart' && !graph.stacked"
                                                        :class="['switch', 'right', graph.beginAtZero ? '' : 'selected']"
                                                        :title="$t('additional:modules.tools.cosi.chartGenerator.yToZeroTooltip')"
                                                        @click="yToZero()"
                                                    >
                                                        {{ $t('additional:modules.tools.cosi.chartGenerator.yToZero') }}
                                                    </button>
                                                    <button
                                                        v-if="type === 'LineChart' || type === 'BarChart'"
                                                        :class="['switch', 'right', graph.stacked ? 'selected' : '']"
                                                        :title="$t('additional:modules.tools.cosi.chartGenerator.yStacked')"
                                                        @click="yStacked()"
                                                    >
                                                        {{ $t('additional:modules.tools.cosi.chartGenerator.yStacked') }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- </div> -->

                                    <template v-if="!Array.isArray(graph.type)">
                                        <!-- eslint-disable-next-line -->
                                        <div class="singlegraph">
                                            <component
                                                :is="graph.type"
                                                v-if="graph.type!=='PieChart'"
                                                :id="`graph-${index}`"
                                                ref="chart"
                                                :datasets="chartConfigs[index]"
                                                :options="graph.options"
                                                class="graph_sub"
                                                :class="{current_graph: activeGraph === index}"
                                            />
                                            <template
                                                v-if="graph.type==='PieChart'"
                                            >
                                                <PieChart
                                                    v-for="(pieData, j) in chartConfigs[index]"
                                                    :id="`graph-${index}-${j}`"
                                                    :key="`graph-${index}-${j}`"
                                                    ref="chart"
                                                    :datasets="pieData"
                                                    :options="graph.options"
                                                    class="graph_sub"
                                                    :class="{current_graph: activeGraph === index}"
                                                />
                                            </template>
                                            <div class="graph_functions">
                                                <button
                                                    v-if="graph.type === 'LineChart' && !graph.stacked"
                                                    :class="['switch', 'right', graph.beginAtZero ? '' : 'selected']"
                                                    :title="$t('additional:modules.tools.cosi.chartGenerator.yToZeroTooltip')"
                                                    @click="yToZero()"
                                                >
                                                    {{ $t('additional:modules.tools.cosi.chartGenerator.yToZero') }}
                                                </button>
                                                <button
                                                    v-if="graph.type === 'LineChart' || graph.type === 'BarChart'"
                                                    :class="['switch', 'right', graph.stacked ? 'selected' : '']"
                                                    :title="$t('additional:modules.tools.cosi.chartGenerator.yStacked')"
                                                    @click="yStacked()"
                                                >
                                                    {{ $t('additional:modules.tools.cosi.chartGenerator.yStacked') }}
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="graph_footer">
                                <template v-if="datasets.length > 0">
                                    <v-app>
                                        <v-divider />
                                        <AnalysisPagination
                                            :sets="datasets"
                                            :active-set="activeGraph"
                                            :downloads="['PNG']"
                                            :titles="{
                                                downloads: [$t('additional:modules.tools.cosi.chartGenerator.downloadChart')],
                                                downloadAll: $t('additional:modules.tools.cosi.chartGenerator.downloadAll'),
                                                remove: $t('additional:modules.tools.cosi.chartGenerator.removeChart'),
                                                removeAll: $t('additional:modules.tools.cosi.chartGenerator.deleteAll')
                                            }"
                                            @setActiveSet="(n) => selectGraph(n)"
                                            @removeSingle="(n) => removeGraph(n)"
                                            @removeAll="() => removeAll()"
                                            @downloadPNG="(n) => downloadGraph()"
                                            @downloadAll="() => downloadAll()"
                                        />
                                    </v-app>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Tool>
</template>

<style lang="scss">
    @import "../../utils/variables.scss";
    #chart-generator-win {
        height: 675px;
    }
    #chart_generator {
        // width:400px;

        canvas {
            width:400px;
            height:400px;
            min-height:300px;
        }

        #chart_panel {
            .graph {
                    display:none;
                .graph_wrapper {
                    .graph_head {
                        display:flex;
                        flex-flow:row wrap;
                        justify-content: space-between;
                        align-content:flex-end;
                        align-items:flex-end;
                        width:100%;
                        margin:5px auto;

                        span {
                            h3 {
                                font-size:110%;
                                font-weight:500;
                                color:#222;
                                border:none;
                                margin:3px 0px;
                                padding:0;
                                line-height:normal;
                            }

                            p {
                                font-size:90%;
                                font-weight:300;
                                color:#666;
                                margin:3px 0px;
                                padding:0;
                                line-height:normal;

                                strong {
                                    font-size:100%;
                                    color:#222;
                                }
                            }
                        }

                        .btn_grp {
                            display:flex;
                            flex-flow: row wrap;
                            justify-content:flex-end;
                            flex:1 0 100%;
                            margin:3px auto;
                            padding:5px 0px;
                            border-top:1px solid #ccc;
                            border-bottom:1px solid #ccc;

                            .switch_btn {
                                width:26px;
                                padding:0px 5px;
                                height:26px;
                                line-height:26px;
                                color:#222;
                                background-color:#ccc;
                                background-size:80%;
                                background-position:center;
                                background-repeat:no-repeat;
                                border:1px solid #ccc;
                                margin:2px 0px 2px 2px;

                                &.highlight {
                                    background-color:white;
                                    border:1px solid #222;
                                }
                            }

                            .rmv_btn {
                                margin:2px 0px 2px 2px;
                                background: $error_red;
                                border:1px solid $error_red;
                                color:white;
                                width:26px;
                                height:26px;

                                span {
                                    top:0px;
                                    line-height:26px;
                                }
                            }
                        }
                    }
                    .graph_box {
                        position:relative;

                        .multi_graph {
                            display:block;
                            position:absolute;
                            top:0;
                            left:0;
                            width:100%;
                            height:100%;
                            z-index:-1;

                            &.active {
                                position:relative;
                                z-index:2;

                                .graph_sub {
                                    position:relative;
                                }
                            }

                            .graph_sub {
                                position:absolute;
                                top:0;
                                left:0;
                                width:100%;
                                height:100%;
                            }
                        }

                        .graph_functions {
                            display:flex;
                            flex-flow:row wrap;
                            justify-content: flex-end;
                            margin-bottom:10px;

                            .dl, .switch {
                                display:block;
                                margin:6px 3px;
                                height:26px;
                                padding:0px 10px;
                                border:1px solid #888;

                                span {
                                    margin-left:5px;
                                }
                            }

                            .selected {
                                background-color: $brightblue;
                                color: white;
                            }
                        }
                    }
                    // .graph_footer {
                    //     width:100%;
                    //     display:flex;
                    //     flex-flow:row wrap;
                    //     justify-content:flex-end;
                    //     margin:5px auto;
                    //     padding-top: 10px;
                    // }
                }

                &.active {
                        display:block;
                    }
            }
        }
    }
</style>
