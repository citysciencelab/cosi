import DsmTemplateAdminComponent from "./components/DsmTemplateAdmin.vue";
import DsmTemplateAdminStore from "./store/indexDsmTemplateAdmin";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: DsmTemplateAdminComponent,
    store: DsmTemplateAdminStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
