import StatisticDashboardComponent from "./components/StatisticDashboard.vue";
import StatisticDashboardStore from "./store/indexStatisticDashboard";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: StatisticDashboardComponent,
    store: StatisticDashboardStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
