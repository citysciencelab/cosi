import VpiDashboard from "./components/VpiDashboard.vue";
import VpiDashboardStore from "./store/indexVpiDashboard";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: VpiDashboard,
    store: VpiDashboardStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
