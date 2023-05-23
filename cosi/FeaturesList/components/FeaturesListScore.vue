<script>
import ToolInfo from "../../components/ToolInfo.vue";
import Weights from "./FeaturesListScoreWeights.vue";
import {mapActions} from "vuex";
import deepEqual from "deep-equal";

export default {
    name: "FeaturesListScore",
    components: {
        ToolInfo,
        Weights
    },
    props: {
        featureList: {
            type: Array,
            required: true
        },
        groupedLayer: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            featureQueue: [],
            showWeightsDialog: false,
            selectedLayerList: [],
            disableChartButtons: true
        };
    },
    computed: {
        layerList () {
            let layerList = [];

            this.groupedLayer.forEach(group => {
                layerList.push({header: group.group});
                layerList = layerList.concat(group.layer);
            });

            return layerList;
        },


        /**
         * Indicates how far the calculation of the scores has gone.
         * @return {Number} A percent value.
         */
        progressValue () {
            if (this.featureQueue.length && this.featureList.length) {
                return Math.round(100 - this.featureQueue.length / this.featureList.length * 100);
            }
            return 0;
        },

        /**
         * Checks the queue of the featureList to see if the scores is being calculated.
         * @return {Boolean} True if the scores is just being calculated otherwise false.
         */
        scoringIsOngoing () {
            return this.featureQueue.length !== 0;
        }
    },

    watch: {
        featureList: {
            handler: function (newItems, oldItems) {
                if (!deepEqual(newItems.map(i=>i.key), oldItems.map(i=>i.key))) {
                    this.runFeaturesScore(this.featureList, this.selectedLayerList);
                }
                if (typeof newItems[0]?.distanceScore !== "undefined") {
                    this.disableChartButtons = false;
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions("Tools/DistanceScoreService", ["getDistanceScore", "getFeatureValues"]),

        /**
         * Runs the scoring for the features. Emits the result to the parent component.
         * @param {Object[]} featureList - The list of features for which the scoring is to be run.
         * @param {Object[]} selectedLayerList - The list of layer to be included in the scoring.
         * @return {void}
         */
        async runFeaturesScore (featureList, selectedLayerList) {
            if (featureList && featureList.length && selectedLayerList.length > 0) {
                const items = [];

                this.featureQueue = featureList.map(item => {
                    return {...item};
                });

                while (this.featureQueue.length) {
                    const item = this.featureQueue.shift();

                    item.score = {
                        distance: await this.getDistanceScore({feature: item.feature, layers: selectedLayerList})
                    };
                    item.score.value = this.getFeatureScore(item.score);
                    item.distanceScore = item.score.value;
                    items.push(item);
                }

                this.$emit("updateItems", items);
            }
        },

        /**
         * Gets the total score for a feature.
         * So far only the score for the distance is used.
         * @param {Object} scores - Contains the different scores.
         * @return {String} The total score for a feature.
         */
        getFeatureScore (scores) {
            let totalScore = 0;

            Object.keys(scores).forEach(type => {
                totalScore += parseFloat(scores[type].average, 10);
            });

            return (totalScore / Object.keys(scores).length).toFixed(1);
        },

        /**
         * Toggles the layer weights dialog.
         * When the dialog is closed, the function for setting the scores is called.
         * @param {Boolean} value - Flag to show the dialog.
         * @return {void}
         */
        toggleWeightsDialog (value) {
            this.showWeightsDialog = value;
            if (!value) {
                this.runFeaturesScore(this.featureList, this.selectedLayerList);
            }
        }
    }
};
</script>

<template>
    <v-card
        outlined
        rounded="0"
        class="mb-4"
    >
        <v-progress-linear
            v-if="progressValue > 0"
            :value="progressValue"
            height="25"
        >
            <strong>{{ progressValue }}%</strong>
        </v-progress-linear>
        <v-card-title>
            {{ $t('additional:modules.tools.cosi.featuresList.titleLocationScore') }}
        </v-card-title>
        <v-card-text>
            <ToolInfo
                :summary="'Die Entfernung (Fußweg) zur nächstgelegenen ausgewählten Einrichtung wird berechnet. Werden mehrere Einrichtungen ausgewählt, wird die Entfernung gemittelt.'"
            />
            <v-row
                dense
            >
                <v-autocomplete
                    id="selectedDistanceScoreLayers"
                    v-model="selectedLayerList"
                    class="rounded-0"
                    :items="layerList"
                    :label="$t('additional:modules.tools.cosi.featuresList.distanceScoreLayerLabel')"
                    outlined
                    :disabled="scoringIsOngoing"
                    dense
                    item-text="id"
                    return-object
                    hide-details
                    chips
                    clearable
                    deletable-chips
                    multiple
                    small-chips
                />
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn
                class="ml-1"
                depressed
                :disabled="scoringIsOngoing || selectedLayerList.length === 0"
                tile
                color="grey lighten-1"
                @click.native="runFeaturesScore(featureList, selectedLayerList)"
            >
                Berechnung starten
            </v-btn>
            <v-btn
                depressed
                :disabled="scoringIsOngoing || selectedLayerList.length < 2"
                tile
                color="grey lighten-1"
                @click.native="toggleWeightsDialog(true)"
            >
                {{ $t('additional:modules.tools.cosi.featuresList.weighting') }}
            </v-btn>
            <v-btn
                depressed
                :disabled="scoringIsOngoing || disableChartButtons"
                tile
                color="grey lighten-1"
                :title="$t('additional:modules.tools.cosi.featuresList.distanceScoreChartTooltip')"
                @click.native="$emit('showDistanceScoresForSelected', selectedLayerList)"
            >
                <v-icon>mdi-radar</v-icon>
            </v-btn>
            <v-btn
                depressed
                :disabled="scoringIsOngoing || disableChartButtons"
                tile
                color="grey lighten-1"
                :title="$t('additional:modules.tools.cosi.featuresList.distanceScoreHistogramTooltip')"
                @click.native="$emit('showDistanceScoreHistogram', selectedLayerList)"
            >
                <v-icon>mdi-chart-histogram</v-icon>
            </v-btn>
        </v-card-actions>
        <Weights
            :is-visible="showWeightsDialog"
            :layer-list="selectedLayerList"
            @toggleWeightsDialog="toggleWeightsDialog"
        />
    </v-card>
</template>

<style lang="scss" scoped>
</style>
