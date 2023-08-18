<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import {getComponent} from "../../../src/utils/getComponent";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import getters from "../store/gettersRefugeeHomes";
import mutations from "../store/mutationsRefugeeHomes";
import {isWebLink} from "../../../src/utils/urlHelper.js";

export default {
    name: "RefugeeHomes",
    components: {
        ToolTemplate
    },
    data () {
        return {
            hoverActive: true,
            existingLocationActive: true,
            allFeatures: null,
            selectedFeatures: [],
            districtName: "",
            loaded: false
        };
    },
    computed: {
        ...mapGetters("Tools/RefugeeHomes", Object.keys(getters)),
        ...mapGetters("Maps", ["getLayers"]),
        ...mapGetters("MapMarker", ["markerPoint"])
    },
    watch: {
        active (value) {
            if (!value) {
                this.close();
            }
        },
        allFeatures (value) {
            if (value) {
                this.selectedFeatures = this.sortFeatures(this.features, this.ranking);
            }
            else {
                this.selectedFeatures = this.filteredFeatures[0];
            }
        },
        existingLocationActive (value) {
            let currentFeatures;

            if (this.allFeatures) {
                currentFeatures = this.sortFeatures(this.features, this.ranking);
            }
            else {
                currentFeatures = this.filteredFeatures[0];
            }
            if (value) {
                this.selectedFeatures = currentFeatures?.filter(function (el) {
                    return el.featureType.indexOf("geplant") === -1;
                });
            }
            else {
                this.selectedFeatures = currentFeatures?.filter(function (el) {
                    return el.featureType.indexOf("geplant") !== -1;
                });
            }
        },
        features () {
            if (this.loaded === true) {
                this.initURLParameter();
            }
        },
        filteredFeatures () {
            if (this.filteredFeatures[0] && this.filteredFeatures[0][0]) {
                this.districtName = this.filteredFeatures[0][0].bezirk;
            }

        }
    },

    mounted () {
        this.$nextTick(() => {
            Backbone.Events.listenTo(Radio.channel("RefugeesTable"), {
                "showAllFeatures": () => {
                    this.setActive(true);
                    this.loaded = false;
                    this.allFeatures = true;
                    this.$store.commit("Tools/RefugeeHomes/setFilteredFeatures", []);
                    this.setActive(true);
                    this.selectedFeatures = this.features;
                    this.removeHighlightLayer();
                },
                "showFeaturesByBezirk": (districtName, calledByURL = false) => {
                    if (calledByURL === false) {
                        this.$store.commit("ZoomTo/setZoomToGeometry", districtName, {root: true});
                        this.$store.dispatch("ZoomTo/zoomToFeatures", {}, {root: true});
                    }
                    this.removeHighlightLayer();
                    this.$store.commit("Tools/RefugeeHomes/setFilteredFeatures", []);
                    this.allFeatures = false;
                    this.filterFeaturesByBezirk(districtName);
                    this.setActive(true);

                }
            });
            this.loaded = true;
        });
    },
    beforeMount () {
        this.requestRawLayerList();
    },
    /**
     * Created hook: Creates event listener for legacy Radio calls (to be removed sometimes).
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);
    },

    methods: {
        ...mapMutations("Tools/RefugeeHomes", Object.keys(mutations)),
        ...mapActions("Tools/RefugeeHomes", ["requestRawLayerList", "initURLParameter"]),
        ...mapActions("Maps", ["removeAllHighlightedFeatures"]),
        isWebLink,

        /**
         * Checks for highlighting layer from zoomTo and removes it.
         * @returns {void}
         */
        removeHighlightLayer: function () {
            this.getLayers.forEach(item => {
                if (item?.get("name") === undefined) {
                    mapCollection.getMap("2D").removeLayer(item);
                }
            });

        },

        /**
         * Filters the list according the district name and sorts the table entries according the ranking list and district number
         * @param  {String} name - name of the district
         * @returns {void}
         */
        filterFeaturesByBezirk: function (name) {
            let checkedName = name;

            if (name.includes("-")) {
                checkedName = name.split("-")[1];
            }
            const filteredDistricts = this.features?.filter(district => district?.bezirk?.toUpperCase().trim() === checkedName.toUpperCase().trim() || district?.bezirk?.toUpperCase().trim() === name.toUpperCase().trim()),
                sortedFeatures = this.sortFeatures(filteredDistricts, this.ranking);

            this.addFilteredFeature(sortedFeatures);
            this.selectedFeatures = this.filteredFeatures[0];
        },

        /**
         * Sorts district features by given ranking and district number
         * @param {olFeatures} features features to be sorted
         * @param {ranking} ranking used as first sort criteria
         * @returns {void}
         */
        sortFeatures: function (features, ranking) {
            const sortFeatures = [];
            let sortFeaturesByAttribute = [];

            sortFeaturesByAttribute = features.sort((a, b) => a.stadtteil - b.stadtteil);

            ranking.forEach(rankingName => {
                sortFeaturesByAttribute.forEach(element => {

                    if (element.featureType === rankingName) {
                        sortFeatures.push(element);
                    }
                });

            });
            return sortFeatures;
        },

        /**
         * sets/unsets the marker
         * @param {Number[]} coords the coordinates to place the marker at
         * @returns {void}
         */
        toggleMarker (coords) {
            if (this.hoverActive) {
                if (!Array.isArray(coords) || this.lastMarker === coords) {
                    this.lastMarker = null;
                    this.$store.dispatch("MapMarker/removePointMarker");
                }
                else {
                    this.lastMarker = coords;
                    this.$store.dispatch("MapMarker/placingPointMarker", coords);
                }
            }
        },

        /**
        * Control the hover visibility of the map marker
        * @param {Boolean} mode to control the hover visibility of the map marker
        * @param {Number[]} coords the coordinates to place the marker at
        * @returns {void}
        */
        markerControl (mode, coords) {
            this.hoverActive = mode;
            if (!mode) {
                this.$store.dispatch("Maps/setCenter", coords);
                this.$store.dispatch("Maps/setZoomLevel", 4);
            }
        },

        /**
         * Closing behaviour of the tool
         * @returns {void}
         */
        close () {
            this.setActive(false);
            this.$store.dispatch("Maps/resetView");
            this.$store.dispatch("MapMarker/removePointMarker");
            this.removeHighlightLayer();

            const model = getComponent(this.$store.state.Tools.RefugeeHomes.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>


<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="initialWidth"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="refugeehomes"
                class="container"
            >
                <h4 v-if="allFeatures">
                    Hamburg
                </h4>
                <h4 v-else>
                    {{ $t('additional:modules.tools.refugeehomes.districtTitle') }} {{ districtName }}
                </h4>
                <ul
                    class="nav nav-pills nav-fill"
                >
                    <li
                        class="nav-item"
                        role="button"
                        tabindex="0"
                        @click="existingLocationActive=true"
                        @keydown="existingLocationActive=true"
                    >
                        <a
                            class="nav-link"
                            :class="{ active: existingLocationActive}"
                        >
                            {{ $t('additional:modules.tools.refugeehomes.existingAccommodations') }}
                        </a>
                    </li>
                    <li
                        class="nav-item"
                        role="button"
                        tabindex="0"
                        @click="existingLocationActive=false"
                        @keydown="existingLocationActive=false"
                    >
                        <a
                            class="nav-link"
                            :class="{ active: !existingLocationActive}"
                        >
                            {{ $t('additional:modules.tools.refugeehomes.plannedAccommodations') }}
                        </a>
                    </li>
                </ul>
                <div
                    class="tab-content"
                >
                    <div>
                        <table
                            class="table table-striped"
                        >
                            <thead>
                                <tr>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.symbol') }}</th>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.district') }}</th>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.description') }}</th>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.places') }}</th>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.notes') }}</th>
                                    <th

                                        v-if="existingLocationActive === false"
                                    >
                                        {{ $t('additional:modules.tools.refugeehomes.plan') }}
                                    </th>
                                    <th>{{ $t('additional:modules.tools.refugeehomes.attachments') }}</th>
                                </tr>
                            </thead>
                            <tbody
                                v-for="(feature, idx) in selectedFeatures"
                                :id="feature.id"
                                :key="idx"
                            >
                                <tr
                                    @click="markerControl(false,feature.geom)"
                                    @mouseover="toggleMarker(feature.geom)"
                                    @focusin="toggleMarker(feature.geom)"
                                    @mouseleave="markerControl(true)"
                                    @focusout="toggleMarker(feature.geom)"
                                >
                                    <td>
                                        <img
                                            :src="feature.imgSrc"
                                            :height="feature.imgHeight"
                                            alt="featureimage"
                                        >
                                    </td>
                                    <td>{{ feature.stadtteil }}</td>
                                    <td>{{ feature.bezeichnung }}</td>
                                    <td>{{ feature.platzzahl }}</td>
                                    <td>{{ feature.bemerkung }}</td>
                                    <td
                                        v-if="existingLocationActive === false"
                                    >
                                        {{ feature.geplante_inbetriebnahme }}
                                    </td>
                                    <td
                                        v-if="isWebLink(feature.pfad)"
                                    >
                                        <div
                                            v-for="(doc, id) in feature.pfad"
                                            :key="id"
                                        >
                                            <a
                                                :href="feature.pfad[id]"
                                                target="_blank"
                                                class="float-end"
                                            >
                                                {{ $t('additional:modules.tools.refugeehomes.attachments') }} {{ id + 1 }}
                                            </a>
                                            <br
                                                v-if="id > 0"
                                            >
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
     @import "~variables";
tbody tr:hover {
  background-color: $light_grey;
  cursor: pointer;
}

#RefugeesTable {
    position: relative;
    height: 35%;
}

  -moz-#RefugeesTable {
    font-weight: lighter !important;
  }

#RefugeesTable p {
    padding: 8px;
    font-size: 16px;
    float: left;
}

#RefugeesTable button {
    padding: 4px;
    font-size: 26px;
}

#RefugeesTable td {
    vertical-align: baseline;
}

#RefugeesTable th {
    text-align:left;
    padding: 3px 0 3px 0;
    font-weight: bold;
}

#RefugeesTable tbody tr:hover {
    color: $white;
    background-color: $light_grey_hover;
    cursor: pointer;
}

#RefugeesTable thead tr:hover {
    cursor: not-allowed;
}

#RefugeesTable td {
    text-align:left;
    padding: 3px 8px 3px 8px;
    font-weight: 400;
}

#RefugeesTable tr {
    width: 100%;
    display: inline-table;
    table-layout: auto;
}

#RefugeesTable table{
 display: -moz-groupbox;

}
#RefugeesTable tbody{
  overflow-y: auto;
  max-height: 90%;
  width: 100%;
  position: absolute;
}

#RefugeesTable h4{
    height: 10%;
    padding: 5px 0 0 0;
    margin: 0;
    font-weight: bold;
}

#RefugeesTable ul.nav {
    height: 13%;
}

#RefugeesTable .tab-content {
    height:73%;
    position: relative;
}
</style>
