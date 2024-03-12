import TemplateAdminComponent from "./components/TemplateAdmin.vue";
import TemplateAdminStore from "./store/indexTemplateAdmin";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: TemplateAdminComponent,
    store: TemplateAdminStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
