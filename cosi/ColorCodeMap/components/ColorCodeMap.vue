<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersColorCodeMap";
import mutations from "../store/mutationsColorCodeMap";
import utils from "../../utils";
import ColorCodeLegend from "./ColorCodeLegend.vue";
import {Fill, Stroke, Style, Text} from "ol/style.js";
import {generateColorScale} from "../../utils/colorScale.js";
import groupMapping from "../../utils/groupMapping";
import mapping from "../../assets/mapping.json";
import ChartDataset from "../../ChartGenerator/classes/ChartDataset";
import {mapDistrictNames} from "../../DistrictSelector/utils/prepareDistrictLevels";

export default {
    name: "ColorCodeMap",
    components: {
        ColorCodeLegend
    },
    data () {
        return {
            // List of available features for selected Districts
            featuresList: [],
            // Array of all available years
            availableYears: [],
            // colorScale results for ColorCodeLegend
            colorScale: [],
            // values to pass to ColorCodeLegend for visualization
            legendValues: [],
            // Saves the last year when user changes year manually.
            lastYear: null,
            // Saves riginal Map Styling before ColorCodeMap changes stylingmodule namespace not found in mapGetters()
            originalStyling: null,
            // Highest Value of selected feature among all selected districts
            hiVal: null,
            // Lowest Value of selected feature among all selected districts
            loVal: null,
            // Playback speed of the animation
            playSpeed: 1,
            // Helper Variable to force Legend Markers to rerender
            updateLegendList: 0,
            // Helper to pass data to the graph generator
            graphData: [],
            // Helper to store type of feature dataset
            dataCategory: "",
            // Statistical features of the selected districts
            selectedStatFeatures: []
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/ColorCodeMap", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", ["selectedDistrictLevel", "selectedFeatures", "label", "keyOfAttrName", "keyOfAttrNameStats", "loadend", "metadataUrls"]),
        ...mapGetters("Tools/CalculateRatio", ["dataToColorCodeMap", "colorCodeMapDataset"]),
        _selectedFeature: {
            get () {
                return this.selectedFeature;
            },
            set (v) {
                this.setSelectedFeature(v);
            }
        },
        _selectedYear: {
            get () {
                return this.selectedYear;
            },
            set (v) {
                this.setSelectedYear(v);
            }
        },
        minimize: {
            get () {
                return this.minimized;
            },
            set (v) {
                this.setMinimized(v);
            }
        },
        dashboardOpen () {
            return this.$store.getters["Tools/Dashboard/active"] || this.$store.getters["Tools/FeaturesList/active"];
        },
        statsMapping () {
            return groupMapping(mapping);
        }
    },
    watch: {
        selectedFeatures (newValue, oldValue) {
            if (newValue.length < oldValue.length) {
                this.$nextTick(() => {
                    this.updateSelectedDistricts();
                });
            }
        },
        visualizationState () {
            if (!this.dataToColorCodeMap) {
                this.renderVisualization();
            }

            this.$nextTick(()=> {
                this.setUpperEdge(window.innerHeight - this.$refs.ccm?.getBoundingClientRect().top);
            });
        },
        minimize () {
            this.$nextTick(()=> {
                this.setUpperEdge(window.innerHeight - this.$refs.ccm?.getBoundingClientRect().top);
            });
        },
        loadend (newValue) {
            const selectedDistricts = this.selectedDistrictLevel.districts.filter(district => district.isSelected === true);

            this.selectedStatFeatures = selectedDistricts.map(district => district.statFeatures).flat();
            if (newValue && this.selectedFeatures.length > 0) {
                this.updateSelectedDistricts();
            }
        },
        playState (stateChange) {
            if (stateChange) {
                this.animationOverYears(this.playSpeed);
            }
        },
        dataToColorCodeMap (newState) {
            if (newState) {
                this.renderDataFromCalculateRatio();
            }
            else {
                this.setVisualizationState(false);
            }
        },
        colorCodeMapDataset () {
            if (this.dataToColorCodeMap) {
                this.renderDataFromCalculateRatio();
            }
        },
        selectedFeature () {
            this.generateGraphData();
            this.renderVisualization();
        },
        showMapNames () {
            this.renderVisualization();
        },
        selectedYear () {
            this.renderVisualization();
        },
        lastYear () {
            this.renderVisualization();
        }
    },
    mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapMutations("Tools/ColorCodeMap", Object.keys(mutations)),
        ...mapActions("Tools/ChartGenerator", ["channelGraphData"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        /**
         * @description Updates featuresList when selection of district changes and finds all available years for data.
         * @returns {void}
         */
        updateSelectedDistricts () {
            this.featuresList = [];
            if (this.selectedStatFeatures.length) {
                this.availableYears = utils.getAvailableYears(this.selectedStatFeatures, this.yearSelector);
                this.setSelectedYear(utils.getAvailableYears([this.selectedStatFeatures[0]], this.yearSelector)[0]);
                this.updateFeaturesList();
            }
        },

        /**
         * @description Gets relevant features based on MappingJson and triggers visualization.
         * @returns {void}
         */
        updateFeaturesList () {
            this.setSelectedFeature(mapping[0].value);

            mapping.forEach(attr => {
                if (attr[this.keyOfAttrNameStats]) {
                    const findGrp = this.featuresList.find(el => el.group === attr.group);

                    if (findGrp) {
                        findGrp.data.push(attr.value);
                    }
                    else {
                        const createObj = {
                            group: attr.group,
                            data: [attr.value]
                        };

                        this.featuresList.push(createObj);
                    }
                }
            });

            this.generateGraphData();
            this.renderVisualization();
        },
        /**
         * @description Animates data for selected feature on the map over the available years.
         * @param {String} tempo Value for animation playback speed in seconds.
         * @returns {void}
         */
        animationOverYears (tempo) {
            if (this.playState) {
                let current = this.availableYears.indexOf(this.selectedYear) - 1;

                if (current < 0) {
                    current = this.availableYears.length - 1;
                }

                setTimeout(() => {
                    window.requestAnimationFrame(() => {
                        this.setSelectedYear(this.availableYears[current]);
                        this.renderVisualization();
                        this.animationOverYears(tempo);
                    });
                }, tempo * 1000);
            }
        },
        /**
         * @description Changes map styling based on selected feature data.
         * @returns {void}
         */
        renderVisualization () {
            if (this.visualizationState) {
                const results = this.selectedStatFeatures.filter(x => x.get("kategorie") === this.selectedFeature),
                    resultValues = results.map(x => {
                        const yearValue = x.get(this.yearSelector + this.selectedYear);

                        if (yearValue !== undefined) {
                            return yearValue;
                        }

                        return this.$t("additional:modules.tools.colorCodeMap.noData");

                    });

                this.legendValues = results;
                this.colorScale = this.getColorsByValues(resultValues);

                this.updateLegendList += 1;
                this.selectedFeatures.forEach(district => {
                    const getStyling = district.getStyle(),
                        matchResults = results.find(
                            x => utils.unifyString(x.get(this.keyOfAttrNameStats)) === utils.unifyString(mapDistrictNames(district.get(this.keyOfAttrName), this.selectedDistrictLevel))
                        );

                    if (matchResults) {
                        if (this.originalStyling === null) {
                            this.originalStyling = getStyling;
                        }

                        const styleArray = [],
                            match_props = matchResults.get(this.yearSelector + this.selectedYear);

                        getStyling.fill = match_props !== undefined ? new Fill({color: utils.getRgbArray(this.colorScale.scale(match_props), 0.75)}) : new Fill({color: "rgba(0, 0, 0, 0.75)"});
                        getStyling.zIndex = 1;
                        getStyling.text = new Text({
                            font: "16px Calibri,sans-serif",
                            fill: new Fill({
                                color: [255, 255, 255]
                            }),
                            stroke: new Stroke({
                                color: [0, 0, 0],
                                width: 3
                            }),
                            text: match_props !== undefined
                                ? parseFloat(match_props).toLocaleString(this.currentLocale) + "\n(" + this.selectedYear + ")"
                                : this.$t("additional:modules.tools.colorCodeMap.noData"),
                            overflow: true
                        });
                        styleArray.push(new Style(getStyling));
                        if (this.lastYear) {
                            const additionalText = new Style({
                                zIndex: 2,
                                text: new Text({
                                    font: "14px Calibri, sans-serif",
                                    fill: new Fill({
                                        color: [0, 0, 0]
                                    }),
                                    stroke: new Stroke({
                                        color: [240, 240, 240],
                                        width: 2
                                    }),
                                    text: matchResults.get(this.yearSelector + this.lastYear) !== undefined
                                        ? this.lastYear + ": " + parseFloat(matchResults.get(this.yearSelector + this.lastYear)).toLocaleString("de-DE") + "  (" + parseFloat(Math.round((matchResults.get(this.yearSelector + this.lastYear) / match_props) * 100)) + "%)"
                                        : this.$t("additional:modules.tools.colorCodeMap.noData"),
                                    offsetY: 25,
                                    overflow: true
                                })
                            });

                            styleArray.push(additionalText);
                        }
                        if (this.showMapNames) {
                            const headText = new Style({
                                zIndex: 100,
                                text: new Text({
                                    font: "16px Calibri, sans-serif",
                                    fill: new Fill({
                                        color: [0, 0, 0]
                                    }),
                                    placement: "point",
                                    backgroundFill: new Fill({
                                        color: [255, 255, 255]
                                    }),
                                    padding: [5, 10, 5, 10],
                                    text: matchResults.get(this.keyOfAttrNameStats),
                                    offsetY: -35,
                                    overflow: true
                                })
                            });

                            styleArray.push(headText);
                        }

                        district.setStyle(styleArray);
                    }
                });
            }
            else {
                this.selectedFeatures.forEach(district => {
                    const style = new Style({
                        fill: new Fill({color: "rgba(255, 255, 255, 0)"}),
                        stroke: new Stroke({color: "#3399CC", width: 5})
                    });

                    district.setStyle(style);
                });
            }
        },
        /**
         * @todo Generate Dynamic Legend for incoming data from CalculateRatio Component.
         * @description Renders data on map from CalculateRatio Component.
         * @returns {void}
         */
        renderDataFromCalculateRatio () {
            if (!this.visualizationState) {
                this.setVisualizationState(true);
            }

            const resultValues = this.colorCodeMapDataset.map(x => {
                return x.data;
            });

            this.colorScale = this.getColorsByValues(resultValues);

            // todo generate Legend for CC Data
            this.selectedFeatures.forEach(district => {
                const getStyling = district.getStyle(),
                    matchResults = this.colorCodeMapDataset.find(x => utils.unifyString(x.name) === utils.unifyString(district.get(this.keyOfAttrName)));

                if (matchResults) {
                    if (this.originalStyling === null) {
                        this.originalStyling = getStyling;
                    }
                    getStyling.fill = new Fill({color: utils.getRgbArray(this.colorScale.scale(matchResults.data), 0.75)});
                    getStyling.zIndex = 1;
                    getStyling.text = new Text({
                        font: "16px Calibri,sans-serif",
                        fill: new Fill({
                            color: [255, 255, 255]
                        }),
                        stroke: new Stroke({
                            color: [0, 0, 0],
                            width: 3
                        }),
                        text: matchResults.data !== undefined ? parseFloat(matchResults.data).toLocaleString(this.currentLocale) : this.$t("additional:modules.tools.colorCodeMap.noData"),
                        overflow: true
                    });

                    district.setStyle(new Style(getStyling));
                }

            });
        },
        /**
         * @description Calculate dynamic colors for Array based on its values.
         * @param {*} values Array of ints.
         * @returns {Object} the colorScale function(value) and the n-step legend color/value pairs.
         */
        getColorsByValues (values) {
            return generateColorScale(values, this.colorScheme);
        },
        /**
         * @description Changes selected feature with arrow buttons.
         * @param {*} value 1 or -1 for next or prev.
         * @returns {void}
         */
        changeSelector (value) {
            const index = mapping.map(e => e.value).indexOf(this.selectedFeature) + value;

            if (index === -1) {
                this.setSelectedFeature(mapping[mapping.length - 1].value);
            }
            else if (index === mapping.length) {
                this.setSelectedFeature(mapping[0].value);
            }
            else {
                this.setSelectedFeature(mapping[index].value);
            }
            this.renderVisualization();
        },
        /**
         * @description Shows component info as new window.
         * @returns {Void} Function returns nothing.
         */
        showInfo () {
            window.open(this.readmeUrl[this.currentLocale], "_blank");
        },
        /**
         * @description Filters the feature data sets and pass them to the prepareGraphData() for graph visualization.
         * @returns {Void} Function returns nothing.
         */
        generateGraphData () {
            this.graphData = [];
            const results = this.selectedStatFeatures.filter(x => x.get("kategorie") === this.selectedFeature);

            this.selectedFeatures.forEach(district => {
                const matchResults = results.find(
                    x => utils.unifyString(x.get(this.keyOfAttrNameStats)) === utils.unifyString(mapDistrictNames(district.get(this.keyOfAttrName), this.selectedDistrictLevel))
                );

                this.prepareGraphData(matchResults);
            });
        },
        /**
         * @description Adjusting CCM data for Graph Generator Tool.
         * @param {Object} dataset dataset from renderVisualization function.
         * @returns {void}
         */
        prepareGraphData (dataset) {
            const newDataset = {
                label: dataset?.get(this.keyOfAttrNameStats),
                data: []
            };

            this.dataCategory = dataset?.get("kategorie");
            this.availableYears.forEach(year => {
                newDataset.data.push(dataset.get(this.yearSelector + year));
            });

            this.graphData.push(newDataset);
        },
        /**
         * @description Passes data to the Chart Generator Tool.
         * @returns {Void} Function returns nothing.
         */
        loadToChartGenerator () {
            const graphObj = new ChartDataset({
                    id: "ccm" + this.selectedFeatures.map(district => {
                        return district.id_;
                    }).join("-"),
                    name: [this.label] + " - " + this.dataCategory + " (" + this.$t("additional:modules.tools.colorCodeMap.title") + ")",
                    type: ["LineChart", "BarChart", "PieChart"],
                    color: ["#55eb34", "rgb(14, 150, 240)", "yellow"],
                    beginAtZero: true,
                    source: this.$t("additional:modules.tools.colorCodeMap.title"),
                    scaleLabels: [this.selectedFeature, this.$t("additional:modules.tools.colorCodeMap.yearsLabel")],
                    data: {
                        labels: [],
                        datasets: []
                    }
                }),
                years = this.graphData[0].data.reduce((availableYears, val, i) => val ? [...availableYears, this.availableYears[i]] : availableYears, []);

            graphObj.data.labels = years.reverse();
            graphObj.data.datasets = this.graphData.map(dataset => ({
                label: dataset.label,
                data: [...dataset.data].filter(x => Boolean(x)).reverse()
            }));

            this.channelGraphData(graphObj);
        },

        openMetadata () {
            this.metadataUrls.forEach(url => {
                window.open(url);
            });
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="loadend && selectedFeatures.length > 0 && !dashboardOpen"
        id="ccm"
        ref="ccm"
        class="addon_container"
        :class="{minimized: minimize}"
    >
        <div
            class="addon_wrapper"
        >
            <div class="select_wrapper">
                <div class="btn_group">
                    <button
                        class="minimize"
                        :class="{ highlight: !minimize }"
                        :title="$t('additional:modules.tools.colorCodeMap.minimize')"
                        @click="minimize = !minimize"
                    >
                        <template v-if="minimize">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon>
                                mdi-minus
                            </v-icon>
                        </template>
                    </button>
                    <button
                        id="switch"
                        class="switch"
                        :class="{ highlight: !visualizationState }"
                        :title="$t('additional:modules.tools.colorCodeMap.toggleVisualization')"
                        @click="toggleVisualizationState"
                    >
                        <v-icon
                            v-if="visualizationState"
                        >
                            mdi-eye-off
                        </v-icon>
                        <v-icon
                            v-else
                        >
                            mdi-eye
                        </v-icon>
                    </button>
                    <button
                        class="prev btn btn-default btn-sm"
                        :title="$t('additional:modules.tools.colorCodeMap.prev')"
                        @click="changeSelector(-1)"
                    >
                        <v-icon>
                            mdi-chevron-left
                        </v-icon>
                    </button>
                    <button
                        class="next btn btn-default btn-sm"
                        :title="$t('additional:modules.tools.colorCodeMap.next')"
                        @click="changeSelector(1)"
                    >
                        <v-icon>
                            mdi-chevron-right
                        </v-icon>
                    </button>
                    <v-select
                        v-if="selectedStatFeatures.length"
                        v-model="_selectedYear"
                        outlined
                        dense
                        :items="availableYears"
                        :title="$t('additional:modules.tools.colorCodeMap.yearsLabel')"
                        class="year_selection selection"
                    />
                    <v-select
                        v-if="selectedStatFeatures.length"
                        v-model="lastYear"
                        outlined
                        dense
                        :items="availableYears"
                        clearable
                        class="year_selection selection"
                    />
                </div>
                <v-autocomplete
                    v-if="featuresList.length"
                    v-model="_selectedFeature"
                    class="feature_selection selection"
                    :items="statsMapping"
                    item-text="value"
                    outlined
                    dense
                    hide-details
                />
            </div>
            <div
                v-if="visualizationState && selectedFeatures.length > 1"
                id="colorCodeMapLegend"
                class="legend"
                :class="{ active: visualizationState && selectedFeatures.length > 1 }"
            >
                <ColorCodeLegend
                    :results="legendValues"
                    :color-scale="colorScale"
                    :update-legend-list="updateLegendList"
                    :dashboard-open="dashboardOpen"
                    :selected-year="selectedYear"
                    :year-selector="yearSelector"
                />
            </div>
        </div>
        <div class="hovermenu">
            <div class="btn_grp">
                <button
                    class="help_button"
                    :title="$t('additional:modules.tools.colorCodeMap.infoTooltip')"
                    @click="showInfo"
                >
                    <v-icon>
                        mdi-help-circle
                    </v-icon>
                </button>
                <div
                    v-if="visualizationState && !minimize"
                    class="field"
                >
                    <button
                        class="play_button"
                        :class="{highlight: playState}"
                        :title="$t('additional:modules.tools.colorCodeMap.animate')"
                        @click="setPlayState(!playState)"
                    >
                        <v-icon
                            v-if="!playState"
                        >
                            mdi-play-circle
                        </v-icon>
                        <v-icon
                            v-else
                        >
                            mdi-pause-circle-outline
                        </v-icon>
                    </button>
                    <input
                        v-model="playSpeed"
                        class="mini_input"
                    >
                </div>
                <button
                    class="graph_button"
                    :title="$t('additional:modules.tools.colorCodeMap.generateChart')"
                    @click="loadToChartGenerator()"
                >
                    <v-icon>
                        mdi-poll
                    </v-icon>
                </button>
                <button
                    :disabled="!visualizationState"
                    :class="{disabled: !visualizationState}"
                    class="map_button"
                    :title="visualizationState ? $t('additional:modules.tools.colorCodeMap.showDistrictNames') : $t('additional:modules.tools.colorCodeMap.needViz')"
                    @click="setShowMapNames(!showMapNames)"
                >
                    <v-icon>
                        mdi-map-marker
                    </v-icon>
                </button>
                <button
                    :title="$t('additional:modules.tools.colorCodeMap.metadata')"
                    @click="openMetadata()"
                >
                    <v-icon>
                        mdi-information
                    </v-icon>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "../../utils/variables.scss";

    .addon_container {
        position:fixed;
        z-index:100;
        left:10px;
        bottom:30px;
        width:460px;
        height:auto;

        .hovermenu {
            position:absolute;
            left:calc(100% - 5px);
            top:5px;
            padding:10px;
            width:auto;
            height:auto;
            transform:translateX(-100%);
            background:rgba(255,255,255,0.9);
            opacity:0;
            pointer-events:none;
            z-index:-1;
            @include drop_shadow();

            .btn_grp {
                .ccm_info_button {
                    background:transparent;
                    display: inline-block !important;

                    .v_btn {
                        border-radius:0px !important;
                        margin: 2px !important;
                    }

                    .v-divider {
                        display:none;
                    }
                }

                button {
                    width:26px;
                    height:26px;
                    background:#eee;
                    border:1px solid #ccc;
                    margin:2px 20px 2px 0px;

                    span {
                        top:0px;
                        line-height:26px;
                    }

                    &.disabled {
                        opacity:0.5;
                    }
                }

                .field {
                    display:flex;
                    flex-flow:row wrap;
                    justify-content:flex-start;
                    width:54px;
                    height:26px;
                    margin:2px 0px;

                    button {
                        flex:0 0 26px;
                        height:26px;
                        margin:0px 2px 0px 0px;

                        &.highlight {
                            color:white;
                            background: $brightblue;
                        }
                    }

                    input {
                        width:26px;
                        text-align:center;
                        font-size:90%;
                        font-weight:700;
                        height:26px;
                        line-height:26px;
                        border:1px solid #888;
                    }
                }
            }
        }

        &:hover {
            outline:1px solid #ccc;
            .hovermenu {
                transform:translateX(0);
                opacity:1;
                pointer-events:all;
                transition:0.3s;
            }
        }

        &:after {
            @include fullsize_bg_pseudo(white, 0.95);
            @include drop_shadow();
        }

        .addon_wrapper {
            position:relative;
            width:100%;
            height:100%;
            padding:10px;
            box-sizing: border-box;
            // z-index:3;

            .select_wrapper {
                display:flex;
                flex-flow:row wrap;
                justify-content: flex-start;
                width:100%;
                margin:5px auto 5px auto;

                .btn_group {
                    display:flex;
                    flex-flow:row wrap;
                    justify-content: flex-start;
                    flex-basis:100%;

                    button {
                        flex-basis:40px;
                        border-radius:0px;
                        border:1px solid #aaa;
                        margin-right:3px;
                        background-color: $buttongrey;

                        &.switch {
                            flex-basis:40px;
                            border-radius:0px;
                            background-color:#eee;

                            &.highlight {
                                color:white;
                                border:none;
                                background-color: $brightblue;
                            }
                        }
                    }

                    .year_selection {
                        height:30px;
                        flex-basis:120px;
                        border-radius:none;
                        margin:0px 3px;
                        min-height:0px;
                        // border:1px solid #aaa;

                        &.disable {
                            opacity:0.5;
                            pointer-events:none;
                        }
                    }
                }

                .feature_selection {
                    flex:1 0 100%;
                    margin:10px auto;
                    padding:10px 0px;
                    // border-top:1px solid #aaa;
                    // border-bottom:1px solid #aaa;
                }
            }
        }
        &.minimized {
            .hovermenu {
                width:152px;
                .btn_grp {
                    button {
                        margin:2px !important;
                        &.ccm_info_button {
                            display: inline-block !important;
                        }
                    }
                }
            }

            .legend {
                margin:0;
                display:none;
            }

            .select_wrapper {

                .year_selection {
                    display:none;
                }

                .btn_group {
                    flex-basis:45%;
                }

                .feature_selection {
                    flex: 1 0 54%;
                    border: none;
                    margin: 0px 2px;
                    height: 30px;
                    min-height: 0px;
                    padding: 0;
                }
            }
        }
    }
</style>
