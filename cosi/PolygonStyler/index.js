import PolygonStyler from "./components/PolygonStyler.vue";
import PolygonStylerStore from "./store/indexPolygonStyler";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: PolygonStyler,
    store: PolygonStylerStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
