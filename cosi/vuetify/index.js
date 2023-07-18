import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import en from "vuetify/lib/locale/en";
import de from "vuetify/lib/locale/de";

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {en, de},
        current: "de"
    }
});
