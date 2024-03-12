<script>
import Chart from "chart.js";
import thousandsSeparator from "../../../../src/utils/thousandsSeparator.js";

export default {
    name: "VerkehrsstaerkenThemeLineChart",
    components: {},
    props: {
        dataset: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            category: "DTV",
            defaultFontFamily: "'MasterPortalFont', 'Arial Narrow', 'Arial', 'sans-serif'",
            defaultFontColor: "#333333",
            chartType: "line",

            chartColorCircle: "rgba(70, 130, 180, 1)",
            chartRadiusCircle: 5,

            chartColorRect: "rgba(255, 0, 0, 1)",
            chartRadiusRect: 6,
            chartPointStyleRect: "rect",

            toolTipBodyFontColor: "rgba(85, 85, 85, 1)",
            toolTipBackgroundColor: "rgba(240, 240, 240, 1)",

            scaleGridLinesColor: "rgba(0, 0, 0, 1)"
        };
    },
    computed: {
        hasHGVsPerWeek: function () {
            return this.dataset.filter(data => Object.prototype.hasOwnProperty.call(data, "Schwerverkehrsanteil am DTVw")).length > 0;
        }
    },
    watch: {
        dataset () {
            this.drawChart();
        }
    },
    mounted () {
        this.drawChart();
    },
    methods: {
        /**
         * Changes the category of the graph
         * @param {Event} evt Click event
         * @returns {void}
         */
        changeCategory (evt) {
            const buttonGroupElements = document.getElementById(
                    "verkehrsstaerken-btn-group"
                ),
                buttons = buttonGroupElements ? buttonGroupElements.children : [];

            this.category = evt.currentTarget.id;

            Array.prototype.slice.call(buttons).forEach((button) => {
                if (button.id !== evt.currentTarget.id) {
                    button.className = button.className.replace("active", "");
                }
                else {
                    button.className += " active";
                }
            });
            this.drawChart();
        },

        /**
         * Creates the line chart with chartsJs.
         * If a chart is already drawn, it will be destroyed.
         * @returns {void}
         */
        drawChart: function () {
            const ctx = this.$el.getElementsByTagName("canvas")[0];

            if (this.chart instanceof Chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(ctx, {
                type: this.chartType,
                data: this.createChartData(this.dataset, this.category),
                options: {
                    responsive: true,
                    legend: this.createChartLegend(),
                    tooltips: this.createChartTooltip(),
                    scales: this.createChartScales(),
                    defaultFontFamily: this.defaultFontFamily,
                    defaultFontColor: this.defaultFontColor
                },
                plugins: [{
                    beforeInit: chart => {
                        chart.legend.afterFit = function () {
                            this.height += 10;
                        };
                    }
                }]
            });
        },

        /**
         * Creates the data for the chart.
         * @param {Object[]} dataset The dataset of traffic data.
         * @param {String} category The dataset from service.
         * @returns {Object} The chart data.
         */
        createChartData: function (dataset, category) {
            const preparedDataset = this.prepareDataset(dataset, category),
                hasConstructionSiteInfluence = dataset.filter(data => Object.prototype.hasOwnProperty.call(data, "Baustelleneinfluss")).length > 0,
                chartData = {
                    labels: preparedDataset.labels,
                    datasets: [{
                        borderColor: this.chartColorCircle,
                        fill: false,
                        lineTension: 0,
                        label: this.createDatasetLabel(category),
                        data: preparedDataset.data,
                        pointBorderColor: preparedDataset.color,
                        pointBackgroundColor: preparedDataset.color,
                        pointRadius: preparedDataset.radius,
                        pointStyle: preparedDataset.pointStyle
                    }]
                };

            if (hasConstructionSiteInfluence) {
                chartData.datasets.push(
                    {
                        borderColor: this.chartColorRect,
                        fill: false,
                        label: this.$t("additional:modules.tools.gfi.themes.verkehrsstaerken.withConstructionSiteInfluence"),
                        pointBorderColor: this.chartColorRect,
                        pointBackgroundColor: this.chartColorRect,
                        pointRadius: this.chartRadiusRect,
                        pointStyle: this.chartPointStyleRect
                    });
            }

            return chartData;
        },

        /**
         * Prepares the dataset to use in chart.
         * @param {Object[]} dataset The dataset from service.
         * @param {String} category The category to show.
         * @returns {Object} The prepared dataset.
         */
        prepareDataset: function (dataset, category) {
            const preparedDataset = {
                labels: [],
                data: [],
                pointStyle: [],
                color: [],
                radius: []
            };

            dataset.forEach(data => {
                preparedDataset.labels.push(data.year);
                preparedDataset.data.push(data[category]);
                preparedDataset.pointStyle.push(data.style);
                this.createPointStyle(preparedDataset, data);
            });

            return preparedDataset;
        },

        /**
         * Creates the point style for circles and rectangles..
         * @param {Object[]} preparedDataset The prepared dataset.
         * @param {Object} data The data from dataset from service.
         * @returns {void}
         */
        createPointStyle: function (preparedDataset, data) {
            if (data.style === "circle") {
                preparedDataset.color.push(this.chartColorCircle);
                preparedDataset.radius.push(this.chartRadiusCircle);
            }
            else if (data.style === "rect") {
                preparedDataset.color.push(this.chartColorRect);
                preparedDataset.radius.push(this.chartRadiusRect);
            }
            else {
                preparedDataset.color.push(null);
                preparedDataset.radius.push(null);
            }
        },

        /**
         * Creates the label for the dataset.
         * @param {String} category The current category.
         * @returns {String} The choosen label.
         */
        createDatasetLabel: function (category) {
            const categories = {
                "DTV": this.$t("additional:modules.tools.gfi.themes.verkehrsstaerken.carsPerDay"),
                "DTVw": this.$t("additional:modules.tools.gfi.themes.verkehrsstaerken.carsPerDayWeekly"),
                "Schwerverkehrsanteil am DTVw": this.$t("additional:modules.tools.gfi.themes.verkehrsstaerken.HGVsPerWeek")
            };

            return categories[category];
        },

        /**
         * Creates the legend for the chart.
         * @returns {Object} The chart legend.
         */
        createChartLegend: function () {
            return {
                display: true,
                position: "top",
                align: "start",
                labels: {
                    usePointStyle: true,
                    generateLabels: chart => {
                        const data = chart.data,
                            legends = Array.isArray(data.datasets) ? data.datasets.map((dataset, i) => {
                                return {
                                    text: dataset.label,
                                    fillStyle: !Array.isArray(dataset.pointBackgroundColor) ? dataset.pointBackgroundColor : this.chartColorCircle,
                                    hidden: !chart.isDatasetVisible(i),
                                    lineCap: dataset.borderCapStyle,
                                    lineDash: dataset.borderDash,
                                    lineDashOffset: dataset.borderDashOffset,
                                    lineJoin: dataset.borderJoinStyle,
                                    lineWidth: dataset.borderWidth,
                                    strokeStyle: dataset.borderColor,
                                    pointStyle: dataset.pointStyle,
                                    datasetIndex: i
                                };
                            }, this) : [];

                        return legends;
                    }
                },
                onClick: (e) => e.stopPropagation()
            };
        },

        /**
         * Creates the tooltip for the chart.
         * @returns {Object} The chart tooltip.
         */
        createChartTooltip: function () {
            return {
                bodyFontColor: this.toolTipBodyFontColor,
                backgroundColor: this.toolTipBackgroundColor,
                yAlign: "bottom",
                titleAlign: "center",
                bodyAlign: "center",
                custom: (tooltip) => {
                    if (!tooltip) {
                        return;
                    }
                    // disable displaying the color box;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: (tooltipItem) => thousandsSeparator(tooltipItem.value),
                    title: () => false
                }
            };
        },

        /**
         * Creates the scales for the chart.
         * @param {Number} maxValue The max value for the y-axis.
         * @returns {Object} The chart scales.
         */
        createChartScales: function () {
            return {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: this.$t("additional:modules.tools.gfi.themes.verkehrsstaerken.year")
                    },
                    ticks: {
                        min: this.dataset[0].year,
                        max: this.dataset[this.dataset.length - 1].year
                    },
                    gridLines: this.createGridLines()
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: this.createDatasetLabel(this.category)
                    },
                    ticks: {
                        beginAtZero: true,
                        precision: 0,
                        callback: value => thousandsSeparator(value)
                    },
                    gridLines: this.createGridLines()
                }]
            };
        },

        /**
         * Creates the gridLines for scales of the chart.
         * @returns {Object} The gridLines.
         */
        createGridLines: function () {
            return {
                color: this.scaleGridLinesColor,
                display: true,
                drawBorder: true,
                drawOnChartArea: false
            };
        }
    }
};
</script>

<template>
    <div
        v-if="dataset"
        id="verkehrsstaerken-line-chart"
        class="tab-pane"
    >
        <div
            id="verkehrsstaerken-btn-group"
            class="btn-group btn-group-sm"
            role="group"
        >
            <button
                id="DTV"
                type="button"
                class="btn btn-outline-secondary active"
                :title="$t('additional:modules.tools.gfi.themes.verkehrsstaerken.DTVTitle')"
                @click="changeCategory"
            >
                {{ $t("additional:modules.tools.gfi.themes.verkehrsstaerken.DTV") }}
            </button>
            <button
                id="DTVw"
                type="button"
                class="btn btn-outline-secondary"
                :title="$t('additional:modules.tools.gfi.themes.verkehrsstaerken.DTVwTitle')"
                @click="changeCategory"
            >
                {{ $t("additional:modules.tools.gfi.themes.verkehrsstaerken.DTVw") }}
            </button>
            <button
                v-if="hasHGVsPerWeek"
                id="Schwerverkehrsanteil am DTVw"
                type="button"
                class="btn btn-outline-secondary"
                :title="$t('additional:modules.tools.gfi.themes.verkehrsstaerken.HGVsPerWeekTitle')"
                @click="changeCategory"
            >
                {{ $t("additional:modules.tools.gfi.themes.verkehrsstaerken.HGVsPerWeek") }}
            </button>
        </div>
        <div id="verkehrsstaerken-chart-container">
            <canvas />
        </div>
    </div>
</template>

<style lang="scss">
@import "~variables";

#verkehrsstaerken-line-chart {
    margin: 6px;

    button {
        color: $secondary_contrast;
        border: 1px solid #adadad;
    }
    .btn-group {
        padding: 8px;
    }
    #verkehrsstaerken-chart-container {
        width: 100%;
        height: 100%;
        @media (min-width: 768px) {
            width: 80%;
            height: 80%;
        }
        @media (min-width: 1024px) {
            width: 70%;
            height: 70%;
        }
    }
}
</style>
