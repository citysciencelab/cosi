<script>
import {Select} from "ol/interaction";
import {mapActions, mapGetters} from "vuex";
import groupMapping from "../../utils/groupMapping";
import processStats from "../utils/processStats";

export default {
    name: "ReferenceDistrictPicker",
    props: {
        groupsList: {
            type: Array,
            required: false,
            default: () => []
        },
        timelinePrefix: {
            type: String,
            required: false,
            default: "jahr_"
        },
        basePopulationProp: {
            type: String,
            required: false,
            default: "Bevölkerung insgesamt"
        },
        hasReference: {
            type: Boolean,
            default: false
        },
        selectedName: {
            type: String,
            default: null
        }
    },
    data: () => ({
        select: null,
        referencePickerActive: false,
        workingDistrictLevel: null,
        selectedStatsFeature: null,
        layer: null,
        checkbox: false,
        map: undefined
    }),
    computed: {
        ...mapGetters("Maps", ["getLayerById"]),
        ...mapGetters("Tools/DistrictSelector", ["districtLevels", "selectedDistrictLevel", "mapping"]),

        statsMapping () {
            return groupMapping(this.mapping);
        },

        /**
         * Gets the names of the districts of the selected district level.
         * @returns {String[]} The district names or an empty array.
         */
        namesOfDistricts: function () {
            if (this.workingDistrictLevel?.nameList) {
                return this.workingDistrictLevel.nameList;
            }
            return [];
        }
    },
    watch: {
        /**
         * Watches the referencePickerActive boolean,
         * triggers the listen/unlisten methods
         * @param {Boolean} state the state of the referencePickerActive boolean
         * @returns {void}
         */
        referencePickerActive (state) {
            if (state) {
                this.listen();
                this.$emit("referencePickerActive");
            }
            else {
                this.unlisten();
            }
        },

        /**
         * Sets the OpenLayers map layer from the workingLayer object as the current layer
         * @returns {void}
         */
        workingDistrictLevel () {
            this.layer = this.getLayerById({layerId: this.workingDistrictLevel?.layerId});
            if (this.referencePickerActive) {
                this.unlisten();
                this.listen();
            }
        },

        checkbox () {
            if (!this.checkbox) {
                this.$emit("resetReference");
            }
        }
    },

    /**
     * Selects the selectedDistrictLevel as default
     * @returns {void}
     */
    mounted () {
        this.map = mapCollection.getMap("2D");
        this.workingDistrictLevel = this.selectedDistrictLevel;
    },

    /**
     * Deactivate the map interaction when tool is closed forcefully
     * @returns {void}
     */
    beforeDestroy () {
        this.unlisten();
    },
    methods: {
        ...mapActions("Tools/DistrictSelector", ["getStatsByDistrict"]),
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Toggles the Select interaction boolean on/off
         * @returns {void}
         */
        togglePickReference () {
            this.referencePickerActive = !this.referencePickerActive;
        },

        /**
         * Activates the OpenLayers Select interaction
         * @returns {void}
         */
        listen () {
            this.select = new Select({
                layers: [this.layer],
                style: null
            });

            this.map.addInteraction(this.select);
            this.select.on("select", this.pickReference.bind(this));
        },

        /**
         * Deactivates the OpenLayers Select interaction
         * @returns {void}
         */
        unlisten () {
            this.map.removeInteraction(this.select);
            this.select = null;
        },


        /**
         * Pick a feature as reference on map click
         * @param {Event} evt The OpenLayers Select event
         * @returns {void}
         */
        async pickReference (evt) {
            const feature = evt.selected[0],
                stats = await this.getStatsByDistrict({
                    id: feature.getId(),
                    districtLevel: this.workingDistrictLevel
                });
            let baseStats;

            if (!stats) {
                this.alertError();
                baseStats = null;
            }
            else {
                baseStats = processStats(
                    feature.get(this.workingDistrictLevel.keyOfAttrName),
                    this.workingDistrictLevel.label,
                    stats,
                    this.basePopulationProp,
                    this.timelinePrefix,
                    this.groupsList,
                    this.mapping
                );
            }

            if (baseStats) {
                this.$emit("pickReference", baseStats);
            }

            // this.selectedName = feature.get(this.workingDistrictLevel.keyOfAttrName);
            this.referencePickerActive = false;
        },

        /**
         * Find the reference district by name and get the related statistical features.
         * @param {String} districtName - The name of the reference district.
         * @returns {void}
         */
        async findReference (districtName) {
            const sdistrict = this.workingDistrictLevel.districts.find(district => {
                    return district.getName() === districtName;
                }),
                stats = await this.getStatsByDistrict({
                    id: sdistrict.getId(),
                    districtLevel: this.workingDistrictLevel
                });

            let baseStats;

            if (!stats) {
                this.alertError();
                baseStats = null;
            }
            else {
                baseStats = processStats(
                    districtName,
                    this.workingDistrictLevel.label,
                    stats,
                    "Bevölkerung insgesamt",
                    this.timelinePrefix,
                    this.groupsList,
                    this.mapping
                );
            }

            if (baseStats) {
                this.$emit("pickReference", baseStats);
            }
        },

        alertError () {
            this.addSingleAlert({
                category: "Warnung",
                content: this.$t("additional:modules.tools.cosi.referencePicker.errorPickReference"),
                displayClass: "warning"
            });
        },

        visualizeDemographics () {
            this.$emit("visualizeDemographics");
        }
    }
};
</script>

<template>
    <v-form>
        <v-row dense>
            <v-col>
                <div class="overline float-left">
                    {{ $t('additional:modules.tools.cosi.referencePicker.titleReference') }}
                </div>
                <v-checkbox
                    v-model="checkbox"
                    class="mt-0 pl-2"
                />
            </v-col>
        </v-row>
        <v-row
            v-if="checkbox"
            dense
        >
            <v-col cols="12">
                <v-select
                    v-model="workingDistrictLevel"
                    :items="districtLevels"
                    item-text="label"
                    return-object
                    :label="$t('additional:modules.tools.cosi.districtSelector.districtLevel')"
                    :title="$t('additional:modules.tools.cosi.districtSelector.districtLevel')"
                    append-icon="mdi-layers"
                    outlined
                    dense
                />
            </v-col>
        </v-row>
        <v-row
            v-if="checkbox"
            dense
        >
            <v-col cols="7">
                <v-btn
                    dense
                    small
                    tile
                    :color="referencePickerActive ? 'primary' : 'grey lighten-1'"
                    :title="$t('additional:modules.tools.cosi.referencePicker.pickReference')"
                    @click="togglePickReference"
                >
                    <v-icon>mdi-eyedropper</v-icon>
                    <span>
                        {{ $t('additional:modules.tools.cosi.referencePicker.pickReference') }}
                    </span>
                </v-btn>
                <v-btn
                    v-if="hasReference"
                    dense
                    small
                    tile
                    color="grey lighten-1"
                    :title="$t('additional:modules.tools.cosi.residentialSimulation.visualizeDemographics')"
                    @click="visualizeDemographics"
                >
                    <v-icon>mdi-chart-bell-curve</v-icon>
                    <span>
                        {{ $t('additional:modules.tools.cosi.residentialSimulation.visualizeDemographics') }}
                    </span>
                </v-btn>
            </v-col>
            <v-col cols="5">
                <v-autocomplete
                    :value="selectedName"
                    :items="namesOfDistricts"
                    :label="workingDistrictLevel.label"
                    outlined
                    dense
                    @change="findReference"
                />
            </v-col>
        </v-row>
        <div
            v-else
            class="mt-1"
        >
            <div class="mb-2">
                <v-btn
                    v-if="hasReference"
                    dense
                    small
                    tile
                    color="grey lighten-1"
                    :title="$t('additional:modules.tools.cosi.residentialSimulation.visualizeDemographics')"
                    @click="visualizeDemographics"
                >
                    <v-icon>mdi-chart-bell-curve</v-icon>
                    <span>
                        {{ $t('additional:modules.tools.cosi.residentialSimulation.visualizeDemographics') }}
                    </span>
                </v-btn>
            </div>
            <div>
                {{ $t('additional:modules.tools.cosi.referencePicker.noReference') }}
            </div>
        </div>
    </v-form>
</template>
