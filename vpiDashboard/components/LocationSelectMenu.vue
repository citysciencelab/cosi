<script>
import {mapState, mapActions, mapGetters} from "vuex";
import Multiselect from "vue-multiselect";
import {highlightSelectedLocationOnMap} from "../utils/highlightSelectedLocationOnMap";

export default {
    name: "LocationSelectMenu",
    components: {
        Multiselect
    },
    data () {
        return {
            selectedLocation: ""
        };
    },
    computed: {
        ...mapState("Tools/VpiDashboard", [
            "allLocationsArray",
            "selectedLocationId",
            "allLocationsGeoJson"
        ]),
        ...mapGetters("Maps", ["projectionCode"])
    },
    watch: {
        selectedLocation (location, prevLocation) {
            this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", location.id);

            highlightSelectedLocationOnMap(location.id, prevLocation.id);
        }
    },
    async created () {
        this.selectedLocation = this.allLocationsArray[0];
        this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", this.selectedLocation.id);
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", ["getIndividualVisitors"]),
        /**
         * translates the given key, checkes if the key exists and throws a console warning if not
         * @param {String} key the key to translate
         * @param {Object} [options=null] for interpolation, formating and plurals
         * @returns {String} the translation or the key itself on error
         */
        translate (key, options = null) {
            if (key === "additional:" + this.$t(key)) {
                console.warn("the key " + JSON.stringify(key) + " is unknown to the additional translation");
            }

            return this.$t(key, options);
        }
    }
};
</script>

<template>
    <div class="headline mb-2">
        <Multiselect
            v-model="selectedLocation"
            :placeholder="translate('additional:modules.tools.vpidashboard.locationSelectMenu.menuPlaceholder')"
            label="street"
            track-by="street"
            :options="allLocationsArray"
        />
    </div>
</template>
