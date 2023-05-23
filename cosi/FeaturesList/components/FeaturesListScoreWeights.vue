<script>
export default {
    name: "FeaturesListScoreWeights",
    props: {
        isVisible: {
            type: Boolean,
            required: true
        },
        layerList: {
            type: Array,
            required: true
        }
    },
    computed: {
        show () {
            return this.isVisible;
        }
    },
    methods: {
        updateIsVisible () {
            this.$emit("toggleWeightsDialog", false);
        }
    }
};
</script>

<template>
    <div class="text-center">
        <v-dialog
            v-model="show"
            width="500"
        >
            <v-card>
                <v-card-title class="text-h5 white lighten-2">
                    {{ $t('additional:modules.tools.cosi.featuresList.weighting') }}
                </v-card-title>

                <div
                    v-for="layer in layerList"
                    :key="layer.layerId"
                >
                    <v-subheader>
                        {{ layer.id }}
                    </v-subheader>
                    <v-card-text>
                        <v-slider
                            v-model="layer.weighting"
                            class="align-center"
                            :max="1"
                            :min="0"
                            step="0.1"
                            hide-details
                        >
                            <template #append>
                                <v-text-field
                                    v-model="layer.weighting"
                                    class="mt-0 pt-0 slider-text"
                                    hide-details
                                    single-line
                                    type="number"
                                    step="0.1"
                                    max="1"
                                    min="0"
                                />
                            </template>
                        </v-slider>
                    </v-card-text>
                </div>

                <v-divider />

                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        text
                        @click="updateIsVisible"
                    >
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss" scoped>
    .slider-text {
        width: 50px;
    }
</style>
