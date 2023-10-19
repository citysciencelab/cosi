import DsmTemplateManagerComponent from "./components/DsmTemplateManager.vue";
import DsmTemplateManagerStore from "./store/indexDsmTemplateManager";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: DsmTemplateManagerComponent,
    store: DsmTemplateManagerStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
