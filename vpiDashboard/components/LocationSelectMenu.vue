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
            const locationID = location.id,
                source = "dropdown";

            this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", {locationID, source});
            highlightSelectedLocationOnMap(location.id, prevLocation.id);
        },
        selectedLocationId (location) {
            this.selectedLocation = this.allLocationsArray.find(l => {
                return l.id === location;
            });
        }
    },
    async created () {
        const jungfernstiegLocation = this.allLocationsArray.find((element) => element.street.startsWith("Jungfernstieg")),
            source = "dropdown";
        let locationID = "";

        this.selectedLocation = jungfernstiegLocation
            ? jungfernstiegLocation
            : this.allLocationsArray[0];

        locationID = this.selectedLocation.id;

        this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", {locationID, source});
    },
    methods: {
        ...mapActions("Tools/VpiDashboard", ["getActivities"]),
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
