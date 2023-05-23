import ChartDataset from "../../ChartGenerator/classes/ChartDataset";

/**
 * creates the data for a distance score histogram
 * @param {Object[]} items - the table items
 * @returns {{quantiles: number[], data: number[]}} the quantiles and the resp. count of scores
 */
export function createHistogram (items) {
    let
        allScores = items
            .filter(i=>!isNaN(parseInt(i.score.value, 10)))
            .map(i=>parseInt(i.score.value, 10));

    const
        maxVal = Math.max(...allScores),
        minVal = Math.min(...allScores),
        range = maxVal - minVal,
        stepSize = Math.ceil(range / 100) < 100 ? 100 : 1000,
        oomMin = minVal / 100 < 10 ? 100 : 1000,
        startX = Math.floor(minVal / oomMin) * oomMin,
        steps = Math.ceil(range / stepSize),
        quantiles = new Array(steps).fill(startX).map((v, i) => v + i * stepSize),
        lastStep = quantiles[quantiles.length - 1] + stepSize,
        data = [...quantiles];

    if (maxVal > lastStep) {
        quantiles.push(lastStep);
        data.push(lastStep);
    }

    for (let i = quantiles.length - 1; i >= 0; i--) {
        const rest = allScores.filter(v => v < quantiles[i]);

        data[i] = allScores.length - rest.length;
        allScores = rest;
    }

    return {quantiles, data};
}

export default {
    /**
     * Displays a chart of all distance score layers for a single item
     * Either bar-chart or radar chart for >=3 layers.
     * @param {Object} item - the table item
     * @returns {void}
     */
    showDistanceScoreForItem (item) {
        const
            type = Object.keys(item.score.distance).length > 3 ? "RadarChart" : "BarChart",
            data = {
                labels: Object.keys(item.score.distance.facilities).map(l => item.score.distance.facilities[l].layerName),
                datasets: [{
                    label: item.name,
                    data: Object.keys(item.score.distance.facilities).map(l => item.score.distance.facilities[l].value?.toFixed(1))
                }]
            },
            chartDataset = new ChartDataset({
                id: "sb-" + item.key,
                name: `${this.$t("additional:modules.tools.cosi.featuresList.scoresDialogTitle")} - Gewichteter Durchschnitt: ${item.score.distance.average.toLocaleString(this.currentLocale)} (Standortanalyse)`,
                type,
                color: "rainbow",
                source: "Standortanalyse",
                scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.distanceScoreChartYLabel"), ""],
                data
            });

        this.channelGraphData(chartDataset);
    },
    /**
     * Displays a chart of all distance score layers for the selected items of the table
     * Either bar-chart or radar chart for >=3 layers.
     * @param {Object[]} selectedFeatureLayers -
     * @returns {void}
     */
    showDistanceScoresForSelected (selectedFeatureLayers) {
        const
            type = selectedFeatureLayers.length > 2 ? "RadarChart" : "BarChart",
            data = {
                labels: selectedFeatureLayers.map(l => l.id),
                datasets: this.getActiveItems().map(item => ({
                    label: item.name,
                    data: selectedFeatureLayers.map(l => item.score.distance.facilities[l.layerId].value),
                    tooltip: `Gewichteter Durchschnitt: ${item.score.distance.average.toLocaleString("de-DE")}`
                }))
            },
            chartDataset = new ChartDataset({
                id: "sb-" + this.getActiveItems().map(item => item.key).join(","),
                name: `${this.$t("additional:modules.tools.cosi.featuresList.scoresDialogTitle")} (Standortanalyse)`,
                type,
                color: "rainbow",
                source: "Standortanalyse",
                scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.distanceScoreChartYLabel"), ""],
                data
            });

        this.channelGraphData(chartDataset);
    },
    /**
     * Displays a histogram for the distribution of the distance scores
     * @param {Object[]} selectedFeatureLayers -
     * @returns {void}
     */
    showDistanceScoreHistogram (selectedFeatureLayers) {
        const
            histogram = createHistogram(this.getActiveItems()),
            chartData = {
                labels: histogram.quantiles.map(v => Math.round(v)),
                datasets: [{
                    data: histogram.data,
                    label: selectedFeatureLayers.map(l => l.id).join(", "),
                    barPercentage: 1,
                    categoryPercentage: 1
                }]
            },
            chartOptions = {
                scales: {
                    xAxes: [{
                        ticks: {
                            labelOffset: -20
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ""
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: ""
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: (item, data) => {
                            return "> " + data.labels[item[0].index] + "m";
                        }
                    }
                }
            },
            chartDataset = new ChartDataset({
                id: "sb-histogram",
                name: this.$t("additional:modules.tools.cosi.featuresList.scoresDialogHistogramTitle"),
                type: "BarChart",
                color: "rainbow",
                source: "Standortanalyse",
                scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.count"), this.$t("additional:modules.tools.cosi.featuresList.distanceScore")],
                data: chartData,
                options: chartOptions,
                beginAtZero: true
            });

        this.channelGraphData(chartDataset);
    },

    createCharts () {
        if (this.sumUpLayers) {
            this.createChartsForLayers();
        }
        else {
            this.createChartsForTypes();
        }
    },

    /**
     * Creates bar charts for all numerical columns and the count of facilities per district
     * layers treated as datasets
     * @returns {void}
     */
    createChartsForLayers () {
        const
            activeItems = this.getActiveItems(),
            numCols = [...this.numericalColumns, {value: "count", text: "Anzahl"}],
            charts = numCols.map(col => {
                const
                    layerMaps = col.value === "count" ? this.getActiveLayers() : this.getActiveLayersWithNumValue(col.value),
                    items = col.value === "count" ? activeItems : activeItems.filter(item => Boolean(item[col.value])),
                    districts = [...new Set(items.map(item => item.district))].sort(),
                    chartData = {
                        labels: districts,
                        datasets: layerMaps.map(layerMap => ({
                            label: layerMap.id,
                            data: districts.map(district => {
                                return items.reduce((sum, item) => {
                                    if (item.district === district && item.layerId === layerMap.layerId) {
                                        return col.value === "count" ? sum + 1 : sum + parseFloat(item[col.value]);
                                    }
                                    return sum;
                                }, 0);
                            })
                        }))
                    };

                return new ChartDataset({
                    id: this.id + "-" + col.value + "-allLayers",
                    name: col.text,
                    type: "BarChart",
                    color: "rainbow",
                    source: this.$t("additional:modules.tools.cosi.featuresList.title"),
                    scaleLabels: [col.text, this.$t("additional:modules.tools.cosi.featuresList.colDistrict")],
                    data: chartData,
                    beginAtZero: true
                });
            });

        this.channelGraphData(charts);
    },
    /**
     * Creates bar charts for all active layers and their resp. numerical values and count of facilities per district
     * types per layer treated as datasets
     * @returns {void}
     */
    createChartsForTypes () {
        const
            activeItems = this.getActiveItems(),
            {districts, types} = this.getDistrictsAndTypes(activeItems),
            activeLayerMapping = this.getActiveLayers(),
            layerCharts = activeLayerMapping.reduce((res, layerMap) => {
                const
                    numVals = this.distanceScoreEnabled ?
                        [...layerMap.numericalValues, {id: "distanceScore", name: "Anbindng"}, {id: "count", name: "Anzahl"}] :
                        [...layerMap.numericalValues, {id: "count", name: "Anzahl"}],
                    charts = numVals.map(numVal => {
                        const
                            layerItems = activeItems.filter(item => item.layerId === layerMap.layerId),
                            chartData = {
                                labels: districts[layerMap.layerId],
                                datasets: types[layerMap.layerId].map(type => ({
                                    label: type || layerMap.id,
                                    data: districts[layerMap.layerId].map(district => {
                                        return layerItems.reduce((sum, item) => {
                                            if (item.district === district && item.type === type) {
                                                return numVal.id === "count" ? sum + 1 : sum + parseFloat(item[numVal.id]);
                                            }
                                            return sum;
                                        }, 0);
                                    })
                                }))
                            };

                        return new ChartDataset({
                            id: this.id + "-" + layerMap.layerId + "-" + numVal.id,
                            name: layerMap.id,
                            type: "BarChart",
                            color: "rainbow",
                            source: this.$t("additional:modules.tools.cosi.featuresList.title"),
                            scaleLabels: [numVal.name, this.$t("additional:modules.tools.cosi.featuresList.colDistrict")],
                            data: chartData,
                            beginAtZero: true
                        });
                    });

                return [...res, ...charts];
            }, []);

        this.channelGraphData(layerCharts);
    },
    /**
     * Creates all the individual charts for active DIPAS projects
     * @returns {void}
     */
    createDipasCharts () {
        const graphData = [];

        this.createDipasCommentsNumberGraphs(graphData);
        this.createDipasTimeGraphs(graphData);
        this.createDipasScatterGraphs(graphData);
        this.channelGraphData(graphData);
    },

    /**
     * Creates a bar chart per DIPAS project active, number of comments / contribution type
     * modifies the original list of charts
     * @param {Array<ChartDataset>} graphData - the list of all DIPAS charts
     * @returns {void}
     */
    createDipasCommentsNumberGraphs (graphData) {
        const activeItems = this.getActiveDipasItems(),
            types = this.getDistrictsAndTypes(activeItems).types,
            activeLayerMapping = this.getActiveDipasLayers(),
            layerCharts = activeLayerMapping.map(layer => {
                const
                    _types = this.sumUpLayers ? [...new Set(Object.values(types).flat())] : types[layer.layerId],
                    chartData = {
                        labels: _types,
                        datasets: [{
                            label: this.$t("additional:modules.tools.cosi.featuresList.dipas.comments"),
                            data: _types.map(type => {
                                return activeItems.reduce((sum, item) => {
                                    if (this.sumUpLayers) {
                                        return item.type === type ? sum + parseInt(item.commentsNumber, 10) : sum;
                                    }
                                    return item.layerId === layer.layerId && item.type === type ? sum + parseInt(item.commentsNumber, 10) : sum;
                                }, 0);
                            })
                        }]
                    };

                return new ChartDataset({
                    id: this.id + "-" + layer.layerId + "-commentsNumberChart",
                    name: layer.id.replace(" contributions", "") + this.$t("additional:modules.tools.cosi.featuresList.dipas.commentsPerCategory"),
                    type: "BarChart",
                    color: "rainbow",
                    source: this.$t("additional:modules.tools.cosi.dipas.title"),
                    scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.dipas.comments"), this.$t("additional:modules.tools.cosi.featuresList.dipas.category")],
                    data: chartData,
                    beginAtZero: true
                });
            });

        graphData.push(...layerCharts);
    },

    /**
     * Creates a line chart per DIPAS project active, number of contributions / date created
     * modifies the original list of charts
     * @param {Array<ChartDataset>} graphData - the list of all DIPAS charts
     * @returns {Array<ChartDataset>} the modified original input
     */
    createDipasTimeGraphs (graphData) {
        const activeItems = this.getActiveDipasItems(),
            activeLayerMapping = this.getActiveDipasLayers(),
            layerCharts = activeLayerMapping.map(layer => {
                const dates = activeItems
                        .filter(item => this.sumUpLayers || item.layerId === layer.layerId)
                        .map(item => item.feature.values_.dateCreated)
                        .sort(),
                    chartData = {
                        labels: dates,
                        datasets: [{
                            label: this.$t("additional:modules.tools.cosi.featuresList.dipas.contributions"),
                            data: dates.map((date, index) => {
                                return {t: date, y: index + 1};
                            })
                        }]
                    },
                    currentLocale = this.currentLocale;

                return new ChartDataset({
                    id: this.id + "-" + layer.layerId + "-timeChart",
                    name: layer.id.replace(" contributions", "") + this.$t("additional:modules.tools.cosi.featuresList.dipas.contributionsOverTime"),
                    type: "LineChart",
                    color: "rainbow",
                    source: this.$t("additional:modules.tools.cosi.dipas.title"),
                    scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.dipas.contributions"), this.$t("additional:modules.tools.cosi.featuresList.dipas.contributions")],
                    options: {
                        scales: {
                            xAxes: [{
                                type: "time"
                            }]
                        },
                        tooltips: {
                            callbacks: {
                                title: function (tooltipItem) {
                                    return new Date(tooltipItem[0].label).toLocaleString(currentLocale);
                                }
                            }
                        }
                    },
                    data: chartData,
                    beginAtZero: true
                });
            });

        graphData.push(...layerCharts);
    },

    /**
     * Creates a scatter chart per DIPAS project active, number of comments / balance pos.-neg. votes
     * modifies the original list of charts
     * @param {Array<ChartDataset>} graphData - the list of all DIPAS charts
     * @returns {Array<ChartDataset>} the modified original input
     */
    createDipasScatterGraphs (graphData) {
        const activeItems = this.getActiveDipasItems(),
            activeLayerMapping = this.getActiveDipasLayers(),
            layerCharts = activeLayerMapping.map(layer => {
                const chartData = {
                    datasets: [{
                        label: this.$t("additional:modules.tools.cosi.featuresList.dipas.commentsVoting"),
                        data: activeItems
                            .filter(item => this.sumUpLayers || item.layerId === layer.layerId)
                            .map(item => {
                                return {x: parseInt(item.votingPro, 10) - parseInt(item.votingContra, 10), y: parseInt(item.commentsNumber, 10), name: item.name};
                            })
                    }]
                };

                return new ChartDataset({
                    id: this.id + "-" + layer.layerId + "-scatterChart",
                    name: layer.id.replace(" contributions", "") + this.$t("additional:modules.tools.cosi.featuresList.dipas.commentsVotingText"),
                    type: "ScatterChart",
                    color: "rainbow",
                    source: this.$t("additional:modules.tools.cosi.dipas.title"),
                    scaleLabels: [this.$t("additional:modules.tools.cosi.featuresList.dipas.comments"), this.$t("additional:modules.tools.cosi.featuresList.dipas.voting")],
                    options: {
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    const index = tooltipItem.index,
                                        name = data.datasets[0].data[index].name;

                                    return name;
                                },
                                title: function (tooltipItem, data) {
                                    return data.datasets[0].label + " (" + tooltipItem[0].yLabel + "/" + tooltipItem[0].xLabel + ")";
                                },
                                footer: () => {
                                    return null;
                                }
                            }
                        }
                    },
                    data: chartData,
                    beginAtZero: true
                });
            });

        graphData.push(...layerCharts);
    }
};

