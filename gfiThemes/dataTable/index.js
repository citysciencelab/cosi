import component from "./components/DataTable.vue";
import deLocale from "../dataTable/locales/de/additional.json";
import enLocale from "../dataTable/locales/en/additional.json";

export default {
    component: component,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
