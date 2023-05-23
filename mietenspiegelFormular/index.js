import MietenspiegelFormularComponent from "./components/MietenspiegelFormular.vue";
import MietenspiegelFormularStore from "./store/indexMietenspiegelFormular.js";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: MietenspiegelFormularComponent,
    store: MietenspiegelFormularStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
