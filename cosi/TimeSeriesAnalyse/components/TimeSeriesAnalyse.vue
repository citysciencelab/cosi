<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../../src/utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersTimeSeriesAnalyse";
import mutations from "../store/mutationsTimeSeriesAnalyse";
import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style.js";
import BarchartItem from "../../../../src/share-components/charts/components/BarchartItem.vue";
import LinechartItem from "../../../../src/share-components/charts/components/LinechartItem.vue";
import PiechartItem from "../../../../src/share-components/charts/components/PiechartItem.vue";

export default {
    name: "TimeSeriesAnalyse",
    components: {
        BarchartItem,
        LinechartItem,
        PiechartItem,
        Tool
    },
    data () {
        return {
            features: [],
            isChartActive: false,
            barChartData: null,
            lineChartData: null,
            pieChartData: null,
            firstYear: undefined,
            secondYear: undefined,
            chartGivenOptions: {},
            interval: null
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/TimeSeriesAnalyse", Object.keys(getters))
    },
    watch: {
        firstYear (value) {
            this.filterFeature(value, this.firstYearLayer, this.firstYearStyle, this.features, this.layerId, this.key);
            if ((this.secondYear - value >= 0 && this.secondYear - value < this.count) || value > this.secondYear) {
                if (this.barChartData) {
                    this.resetChart("bar", value, this.secondYear);
                }
                else if (this.lineChartData) {
                    this.resetChart("line", value, this.secondYear);
                }
                else if (this.pieChartData) {
                    this.resetChart("pie", value, this.secondYear);
                }
            }
        },
        secondYear (value) {
            this.filterFeature(value, this.secondYearLayer, this.secondYearStyle, this.features, this.layerId, this.key);
            if (this.firstYear - value < this.count) {
                if (this.barChartData) {
                    this.resetChart("bar", this.firstYear, value);
                }
                else if (this.lineChartData) {
                    this.resetChart("line", this.firstYear, value);
                }
                else if (this.pieChartData) {
                    this.resetChart("pie", this.firstYear, value);
                }
            }
        },
        active (val) {
            if (val) {
                this.setFeatures();
            }
        }
    },
    async created () {
        this.$on("close", this.close);
        this.min = this.yearRange[0];
        this.max = this.yearRange[1];
        this.firstYear = this.yearRange[0];
        this.secondYear = this.yearRange[1];
        this.firstYearLayer = await this.addNewLayerIfNotExists({layerName: "timeSeriesyear1"});
        this.secondYearLayer = await this.addNewLayerIfNotExists({layerName: "timeSeriesyear2"});
        this.firstYearStyle = new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({
                    color: [0, 153, 255, 1]
                }),
                stroke: new Stroke({
                    color: [0, 0, 0, 1],
                    width: 2
                })
            })
        });
        this.secondYearStyle = new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: [225, 0, 25, 1]
                }),
                stroke: new Stroke({
                    color: [0, 0, 0, 1],
                    width: 2
                })
            })
        });
        if (typeof this.count === "undefined") {
            this.setCount(this.secondYear - this.secondYear);
        }
    },
    methods: {
        ...mapMutations("Tools/TimeSeriesAnalyse", Object.keys(mutations)),
        ...mapActions("Maps", ["addNewLayerIfNotExists"]),

        /**
         * Closes the tool window
         * @returns {void}
         */
        close () {
            this.setActive(false);
            this.barChartData = null;
            this.lineChartData = null;
            this.pieChartData = null;

            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Filters the feature with key
         * @param {String} year - the year
         * @param {ol/layer} layer - the created layer
         * @param {ol/style/Style} style - the layer style
         * @param {ol/Feature[]} features the features of the layer
         * @param {String} layerId - the layer Id
         * @param {String|String[]} key - the year as key to be filtered
         * @returns {void}
         */
        filterFeature (year, layer, style, features, layerId, key) {
            if (typeof year !== "string" || typeof layer === "undefined" || !features.length) {
                return;
            }

            if (typeof layerId === "string") {
                const originLayer = mapCollection.getMap("2D").getLayers().getArray().find(l => l.get("id") === layerId);

                if (typeof originLayer !== "undefined") {
                    originLayer.setVisible(false);
                    Radio.request("ModelList", "getModelByAttributes", {id: this.layerId}).setIsSelected(false);
                }
            }
            else if (Array.isArray(layerId)) {
                layerId.forEach(id => {
                    const originLayer = mapCollection.getMap("2D").getLayers().getArray().find(l => l.get("id") === id);

                    if (typeof originLayer !== "undefined") {
                        originLayer.setVisible(false);
                        Radio.request("ModelList", "getModelByAttributes", {id: id}).setIsSelected(false);
                    }
                });
            }

            let featureData = [];

            layer.getSource().clear();

            if (typeof key === "string") {
                featureData = features.filter(feature => {
                    return feature.get(key) === Number(year);
                });
            }
            else if (Array.isArray(key) && key.length) {
                key.forEach(k => {
                    featureData.push(...features.filter(feature => {
                        return feature.get(k) === Number(year);
                    }));
                });
            }

            layer.getSource().addFeatures(featureData);
            layer.setStyle(style);
        },
        /**
         * Sets the features
         * @returns {void}
         */
        setFeatures () {
            if (typeof this.layerId !== "string" && (!Array.isArray(this.layerId) || !this.layerId.length)) {
                console.error("Please add the layer Id in config");
                return;
            }
            if (typeof this.layerId === "string") {
                const layer = mapCollection.getMap("2D").getLayers().getArray().find(l => l.get("id") === this.layerId);

                if (typeof layer === "undefined") {
                    console.warn("Please activate the configured layer with id " + this.layerId + " in tree");
                }
                else {
                    this.features = this.features.concat(layer.getSource().getFeatures());
                }
            }
            else if (Array.isArray(this.layerId)) {
                this.layerId.forEach(id => {
                    const layer = mapCollection.getMap("2D").getLayers().getArray().find(l => l.get("id") === id);

                    if (typeof layer === "undefined") {
                        console.warn("Please activate the configured layer with id " + id + " in tree");
                    }
                    else {
                        this.features = this.features.concat(layer.getSource().getFeatures());
                    }
                });
            }
        },
        /**
         * Opens the bar chart
         * @param {String} typ - the chart typ
         * @returns {void}
         */
        openChart (typ) {
            if (typ === "bar") {
                if (this.barChartData) {
                    this.barChartData = null;
                    return;
                }
                this.barChartData = this.getDataForChart(typ, this.key, this.statisKey, this.firstYear, this.secondYear, this.count, this.features);
                this.chartGivenOptions = this.getGivenOptions(this.statisKey);
                this.lineChartData = null;
                this.pieChartData = null;
            }
            else if (typ === "line") {
                if (this.lineChartData) {
                    this.lineChartData = null;
                    return;
                }
                this.lineChartData = this.getDataForChart(typ, this.key, this.statisKey, this.firstYear, this.secondYear, this.count, this.features);
                this.chartGivenOptions = this.getGivenOptions(this.statisKey);
                this.barChartData = null;
                this.pieChartData = null;
            }
            else if (typ === "pie") {
                if (this.pieChartData) {
                    this.pieChartData = null;
                    return;
                }
                this.pieChartData = this.getDataForChart(typ, this.key, this.statisKey, this.firstYear, this.secondYear, this.count, this.features);
                this.chartGivenOptions = this.getGivenOptions(this.statisKey);
                this.barChartData = null;
                this.lineChartData = null;
            }
        },
        /**
         * Resets the data for chart
         * @param {String} typ - the chart typ
         * @param {Number} firstYear - the first year
         * @param {Number} secondYear - the second year
         * @param {Number} count the counts to be shown in chart
         * @returns {void}
         */
        resetChart (typ, firstYear, secondYear) {
            let newFirstYear = firstYear,
                newSecondYear = secondYear;

            if (firstYear > secondYear) {
                newFirstYear = secondYear;
                newSecondYear = firstYear;
            }

            if (typ === "bar") {
                this.barChartData = this.getDataForChart(typ, this.key, this.statisKey, newFirstYear, newSecondYear, this.count, this.features);
            }
            else if (typ === "line") {
                this.lineChartData = this.getDataForChart(typ, this.key, this.statisKey, newFirstYear, newSecondYear, this.count, this.features);
            }
            else if (typ === "pie") {
                this.pieChartData = this.getDataForChart(typ, this.key, this.statisKey, newFirstYear, newSecondYear, this.count, this.features);
            }

            this.chartGivenOptions = this.getGivenOptions(this.statisKey);
        },
        /**
         * Gets the given options of chart
         * @param {String} statiskey - the property as key for chart
         * @returns {Object} the given option of chart
         */
        getGivenOptions (statiskey) {
            let labelString = this.$t("additional:modules.tools.cosi.timeSeriesAnalyse.countLabel") + "features";

            if (typeof statiskey === "string") {
                labelString = this.$t("additional:modules.tools.cosi.timeSeriesAnalyse.countLabel") + statiskey;
            }

            return {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: labelString
                        }
                    }]
                },
                elements: {
                    line: {
                        fill: false
                    }
                }
            };
        },
        /**
         * Gets the data for chart
         * @param {String} typ - the chart typ
         * @param {String|String[]} key - the year as key to be filtered
         * @param {String} statiskey - the property as key for chart
         * @param {Number} firstYear - the first year
         * @param {Number} secondYear - the second year
         * @param {Number} count the counts to be shown in chart
         * @param {ol/Feature[]} features the features of the layer
         * @returns {Object} the data for chart
         */
        getDataForChart (typ, key, statiskey, firstYear, secondYear, count, features) {
            let data, finalCount;

            if (typeof count !== "number" || count <= 0) {
                finalCount = Math.abs(secondYear - firstYear + 1);
            }
            else if (count >= Math.abs(secondYear - firstYear + 1)) {
                finalCount = Math.abs(secondYear - firstYear + 1);
            }
            else {
                finalCount = count;
            }

            if (typeof statiskey === "undefined" || statiskey === "") {
                data = this.getCountsOfFeatures(typ, Math.max(firstYear, secondYear), finalCount, key, features);
            }
            else {
                data = this.getCountsOfProperty(typ, statiskey, Math.max(firstYear, secondYear), finalCount, key, features);
            }

            return data;
        },
        /**
         * Gets the counts of features
         * @param {String} typ - the chart typ
         * @param {Number} year - the larger year
         * @param {Number} count the counts to be shown in chart
         * @param {String|String[]} key - the year as key to be filtered
         * @param {ol/Feature[]} features the features of the layer
         * @returns {Object} the counts of features
         */
        getCountsOfFeatures (typ, year, count, key, features) {
            if (typeof count !== "number" || typeof year !== "number" || (typeof key !== "string" && !Array.isArray(key)) || !Array.isArray(features)) {
                return null;
            }

            const totalCount = [];

            for (let i = 0; i < count; i++) {
                if (typeof key === "string") {
                    totalCount[i] = features.filter(feature => {
                        return Number(feature.get(key)) === (year - i);
                    }).length;
                }
                else if (Array.isArray(key) && key.length) {
                    let length = 0;

                    key.forEach(k => {
                        length += features.filter(feature => {
                            return Number(feature.get(k)) === year - i;
                        }).length;
                    });

                    totalCount[i] = length;
                }
            }

            return {
                datasets: [{
                    backgroundColor: typ !== "pie" ? "#57A845" : this.getPieColors(count),
                    data: totalCount.reverse(),
                    label: this.$t("additional:modules.tools.cosi.timeSeriesAnalyse.count"),
                    borderColor: typ === "pie" ? "#ffffff" : "#57A845"
                }],
                labels: this.getLabels(count, year)
            };
        },

        /**
         * Gets the counts of propery in feature
         * @param {String} typ - the chart typ
         * @param {String} statiskey - the property as key for chart
         * @param {Number} year - the second year
         * @param {Number} count the counts to be shown in chart
         * @param {String|String[]} key - the year as key to be filtered
         * @param {ol/Feature[]} features the features of the layer
         * @returns {Object} the counts of features
         */
        getCountsOfProperty (typ, statiskey, year, count, key, features) {
            if (typeof count !== "number" || typeof year !== "number" || (typeof key !== "string" && !Array.isArray(key)) || !Array.isArray(features) || typeof statiskey !== "string") {
                return null;
            }

            const totalCount = [];

            if (typeof statiskey === "string") {
                for (let i = 0; i < count; i++) {
                    let currentFeatures = [],
                        currentCount = 0;

                    if (typeof key === "string") {
                        currentFeatures = features.filter(feature => {
                            return Number(feature.get(key)) === (year - i);
                        });
                    }
                    else if (Array.isArray(key) && key.length) {
                        key.forEach(k => {
                            currentFeatures.push(...features.filter(feature => {
                                return Number(feature.get(k)) === (year - i);
                            }));
                        });
                    }

                    for (let j = 0; j < currentFeatures.length; j++) {
                        if (typeof currentFeatures[j] !== "undefined") {
                            currentCount += currentFeatures[j].get(statiskey);
                        }
                    }

                    totalCount[i] = currentCount;
                }
            }

            return {
                datasets: [{
                    backgroundColor: typ !== "pie" ? "#57A845" : this.getPieColors(count),
                    data: totalCount.reverse(),
                    label: this.$t("additional:modules.tools.cosi.timeSeriesAnalyse.count"),
                    borderColor: typ === "pie" ? "#ffffff" : "#57A845"
                }],
                labels: this.getLabels(count, year)
            };
        },
        /**
         * Gets the pie colors in array
         * @param {Number} count the counts to be shown in chart
         * @returns {String[]} the random colors in array
         */
        getPieColors (count) {
            const colors = [];

            for (let i = 0; i < count; i++) {
                colors[i] = "#" + Math.floor(Math.random() * 16777215).toString(16);
            }

            return colors;
        },
        /**
         * Gets the counts of features
         * @param {Number} count the counts to be shown in chart
         * @param {Number} year - the larger year
         * @returns {String[]} the labels in string
         */
        getLabels (count, year) {
            if (typeof count !== "number" || typeof year !== "number") {
                return [];
            }
            const labels = [];

            for (let i = count - 1; i >= 0; i--) {
                labels.push(year - i);
            }

            return labels;
        },

        /**
         * Plays the slider
         * @returns {void}
         */
        playSlider () {
            this.interval = setInterval(() => {
                this.firstYear++;
                this.firstYear = this.firstYear.toString();
                if (this.firstYear >= this.max) {
                    clearInterval(this.interval);
                    this.firstYear = this.max;
                    this.pauseSlider();
                }
            }, this.aniInterval); // adjust the interval to control the speed of movement
        },
        /**
         * Stops the slider
         * @returns {void}
         */
        pauseSlider () {
            clearInterval(this.interval);
            this.interval = null;
        },
        /**
         * Toggles the slider
         * @returns {void}
         */
        toggleIsPlaying () {
            if (!this.interval) {
                this.playSlider();
            }
            else {
                this.pauseSlider();
            }
        },
        /**
         * Decrements the slider
         * @returns {void}
         */
        decrementSlider () {
            if (this.firstYear > this.min) {
                this.firstYear--;
                this.firstYear = this.firstYear.toString();
            }
            clearInterval(this.interval);
        },
        /**
         * Increments the slider
         * @returns {void}
         */
        incrementSlider () {
            if (this.firstYear < this.max) {
                this.firstYear++;
                this.firstYear = this.firstYear.toString();
            }
            clearInterval(this.interval);
        }
    }
};
</script>

<template lang="html">
    <Tool
        :id="id"
        :title="$t('additional:modules.tools.cosi.timeSeriesAnalyse.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        class="time-series"
    >
        <template #toolBody>
            <div
                v-if="barChartData"
                class="chart"
            >
                <BarchartItem
                    :data="barChartData"
                    :given-options="chartGivenOptions"
                />
            </div>
            <div
                v-if="lineChartData"
                class="chart"
            >
                <LinechartItem
                    :data="lineChartData"
                    :given-options="chartGivenOptions"
                />
            </div>
            <div
                v-if="pieChartData"
                class="chart"
            >
                <PiechartItem
                    :data="pieChartData"
                    :given-options="chartGivenOptions"
                />
            </div>
            <div class="animation-button">
                <button
                    @click="decrementSlider()"
                >
                    <v-icon
                        v-model="firstYear"
                        :min="min"
                    >
                        mdi-skip-previous
                    </v-icon>
                </button>
                <button
                    @click="toggleIsPlaying()"
                >
                    <v-icon
                        v-if="!interval"
                    >
                        mdi-play
                    </v-icon>
                    <v-icon
                        v-else
                    >
                        mdi-pause
                    </v-icon>
                </button>
                <button
                    @click="incrementSlider()"
                >
                    <v-icon
                        v-model="firstYear"
                    >
                        mdi-skip-next
                    </v-icon>
                </button>
            </div>
            <div
                class="slider-range"
            >
                <label
                    for="firstYear"
                >{{ firstYear }}</label>
                <div>
                    <input
                        id="firstYear"
                        v-model="firstYear"
                        class="slider-1"
                        name="firstYear"
                        type="range"
                        step="1"
                        :min="min"
                        :max="max"
                    >
                    <div class="sliderticks">
                        <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p />
                        <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p />
                    </div>
                </div>
                <label
                    for="secondYear"
                >{{ secondYear }}</label>
                <div>
                    <input
                        id="secondYear"
                        v-model="secondYear"
                        class="slider-2"
                        name="secondYear"
                        type="range"
                        step="1"
                        :min="min"
                        :max="max"
                    >
                    <div class="sliderticks">
                        <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p />
                        <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p /> <p />
                    </div>
                </div>
            </div>
            <div class="icons-function">
                <span>
                    <v-icon
                        @click="openChart('bar')"
                        @keydown="openChart('bar')"
                    >mdi-chart-bar</v-icon>
                </span>
                <span>
                    <v-icon
                        @click="openChart('line')"
                        @keydown="openChart('line')"
                    >mdi-chart-areaspline</v-icon>
                </span>
                <span>
                    <v-icon
                        @click="openChart('pie')"
                        @keydown="openChart('pie')"
                    >mdi-chart-scatter-plot</v-icon>
                </span>
            </div>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
.time-series.tool-window-vue{
    bottom: 20px;
    min-width: 600px;
    top: inherit;
}
* {
    box-sizing: border-box;
}

.chart {
    margin-bottom: 20px;
}

.animation-button {
    float: left;
    height: 80px;
    margin-top: 14px;
    margin-right: 20px;
    button {
        i {
            font-size: 30px;
        }
    }
}

.slider-range {
    width: calc(100% - 260px);
    float: left;
}

.slider {
    &:hover{
        opacity: 1;
    }
}

.slider-1 {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    background: #000000;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider-1::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #007FFF;
    cursor: pointer;
}

.slider-1::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #007FFF;
    cursor: pointer;
}

.slider-2 {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    background: #000000;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider-2::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #eb0000;
    cursor: pointer;
}

.slider-2::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #eb0000;
    cursor: pointer;
}

.sliderticks {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
}

.sliderticks p {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 2px;
    background: #D3D3D3;
    height: 10px;
    line-height: 40px;
    margin: 0 0 20px 0;
}

.track {
    pointer-events: none;
    height: 100%;
}

.thumb {
    cursor: pointer;
    border-color: #333;
    border-style: solid;
    background-color: #0f4534;
    background-color: rgba(100, 100, 100, 1);
    border-radius: 5%;
    position: absolute;
}
.output {
    pointer-events: none;
    margin: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50% 50% 0 50%;
    background-color: #0000ff;
    text-align: center;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: -45px;
}
.output p {
    pointer-events: none;
    font-size: 14px;
    color: #0a1a17;
    text-align: center;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
.icons-function {
    float: right;
    height: 80px;
    margin-top: 35px;
    margin-left: 10px;
    span {
        cursor: pointer;
        button {
            font-size: 40px;
        }
    }
}
</style>
