const getters = {
    /**
     * Get a "visitor types" ChartJS data object.
     * @param {Object} state of this component
     * @returns {Object} ChartJS data for given chartType
     */
    getVisitorTypesChartJsData: (state) => (chartType, year) => {
        const labels = i18next.t("additional:modules.tools.vpidashboard.time.months", {returnObjects: true}),
            data_residents = state.visitorTypesByYearAndTypeComplete[year]?.Einwohner.map(d => d.sum),
            data_commuter = state.visitorTypesByYearAndTypeComplete[year]?.Pendler.map(d => d.sum),
            data_tourists_day = state.visitorTypesByYearAndTypeComplete[year]?.Tagestouristen.map(d => d.sum),
            data_tourists_overnight = state.visitorTypesByYearAndTypeComplete[year]?.Übernachtungstouristen.map(d => d.sum);

        let chartData;

        switch (chartType) {
            case "line":
                chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.residents"),
                            data: data_residents,
                            fill: false,
                            borderColor: "#00AA55",
                            tension: 0.1
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.commuters"),
                            data: data_commuter,
                            fill: false,
                            borderColor: "#063970",
                            tension: 0.1
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.tourists_day"),
                            data: data_tourists_day,
                            fill: false,
                            borderColor: "#B381B3",
                            tension: 0.1
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.tourists_overnight"),
                            data: data_tourists_overnight,
                            fill: false,
                            borderColor: "#CC3E00",
                            tension: 0.1
                        }]
                };
                break;
            case "bar":
            default:
                chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.residents"),
                            data: data_residents,
                            hoverOffset: 4,
                            backgroundColor: "#00AA55"
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.commuters"),
                            data: data_commuter,
                            hoverOffset: 4,
                            backgroundColor: "#063970"
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.tourists_day"),
                            data: data_tourists_day,
                            hoverOffset: 4,
                            backgroundColor: "#B381B3"
                        },
                        {
                            label: i18next.t("additional:modules.tools.vpidashboard.tab.visitorTypes.chartLabels.tourists_overnight"),
                            data: data_tourists_overnight,
                            hoverOffset: 4,
                            backgroundColor: "#CC3E00"
                        }]
                };
                break;
        }
        return chartData;
    }
};

export default getters;
