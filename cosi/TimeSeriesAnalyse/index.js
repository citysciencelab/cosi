import TimeSeriesAnalyseComponent from "./components/TimeSeriesAnalyse.vue";
import TimeSeriesAnalyseStore from "./store/indexTimeSeriesAnalyse";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: TimeSeriesAnalyseComponent,
    store: TimeSeriesAnalyseStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
