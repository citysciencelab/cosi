import DsmDashboardComponent from "./components/DsmDashboard.vue";
import DsmDashboardStore from "./store/indexDsmDashboard";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: DsmDashboardComponent,
    store: DsmDashboardStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
