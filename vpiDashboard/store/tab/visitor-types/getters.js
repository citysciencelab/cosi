import {changeDateFormat} from "../../../utils/changeDateFormat";
const getters = {
    /**
     * Get a "visitor types" ChartJS data object.
     * @param {Object} state of this component
     * @returns {Object} ChartJS data for given chartType
     */
    getVisitorTypesChartJsData: (state) => (chartType, year) => {
        const labels = [],
            data_residents = [],
            data_commuter = [],
            data_tourists_day = [],
            data_tourists_overnight = [];

        Object.keys(state.visitorTypesByYearAndTypeComplete[year]).forEach(date => {
            const items = state.visitorTypesByYearAndTypeComplete[year][date];

            // Set label from date, e.g. 2023-01-01 becomes 2023-01
            labels.push(changeDateFormat(date));

            data_residents.push(
                Math.ceil(items.find(i => i.VisitorType === "Einwohner")?.sum_num_visitors / 100) * 100 || 0
            );
            data_commuter.push(
                Math.ceil(items.find(i => i.VisitorType === "Pendler")?.sum_num_visitors / 100) * 100 || 0
            );
            data_tourists_day.push(
                Math.ceil(items.find(i => i.VisitorType === "Tagestouristen")?.sum_num_visitors / 100) * 100 || 0
            );
            data_tourists_overnight.push(
                Math.ceil(items.find(i => i.VisitorType === "Übernachtungstouristen")?.sum_num_visitors / 100) * 100 || 0
            );
        });

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
