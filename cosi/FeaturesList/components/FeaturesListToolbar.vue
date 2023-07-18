<script>

export default {
    name: "FeaturesListToolbar",
    props: {
        filterItems: {
            type: Array,
            required: true
        },
        showDipasButton: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            search: "",
            selectedLayerList: [],
            exportDetails: false,
            sumUpLayers: false
        };
    },
    watch: {
        selectedLayerList (value) {
            this.$emit("setLayerFilter", value);
        },
        search (value) {
            this.$emit("setSearch", value);
        }
    }
};
</script>

<template lang="html">
    <div id="features-list-toolbar">
        <v-row>
            <v-col cols="8">
                <v-select
                    v-model="selectedLayerList"
                    :items="filterItems"
                    multiple
                    dense
                    outlined
                    small-chips
                    deletable-chips
                    hide-details
                    :menu-props="{ closeOnContentClick: true }"
                    :label="$t('additional:modules.tools.cosi.featuresList.layerFilter')"
                />
            </v-col>
            <v-col class="border-style">
                <v-btn
                    tile
                    depressed
                    small
                    color="grey lighten-1"
                    :title="$t('additional:modules.tools.cosi.featuresList.createCharts')"
                    @click="$emit('createCharts')"
                >
                    <v-icon
                        small
                        left
                    >
                        mdi-poll
                    </v-icon>
                    {{ $t('additional:modules.tools.cosi.featuresList.createCharts') }}
                </v-btn>
                <v-btn
                    v-if="showDipasButton"
                    small
                    depressed
                    tile
                    color="grey lighten-1"
                    :title="$t('additional:modules.tools.cosi.featuresList.dipas.createCharts')"
                    @click="$emit('createDipasCharts')"
                >
                    <v-icon>mdi-thumbs-up-down</v-icon>
                </v-btn>
                <br>
                <v-checkbox
                    v-model="sumUpLayers"
                    dense
                    hide-details
                    :label="$t('additional:modules.tools.cosi.featuresList.sumUpLayers')"
                    :title="$t('additional:modules.tools.cosi.featuresList.sumUpLayersTooltip')"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :label="$t('additional:modules.tools.cosi.featuresList.search')"
                    dense
                    outlined
                    hide-details
                    clearable
                />
            </v-col>
            <v-col class="border-style">
                <v-btn
                    id="export-table"
                    tile
                    depressed
                    small
                    color="grey lighten-1"
                    :title="$t('additional:modules.tools.cosi.featuresList.exportTable')"
                    @click="$emit('exportTable', exportDetails)"
                >
                    <v-icon
                        small
                        left
                    >
                        mdi-file-export
                    </v-icon>
                    {{ $t('additional:modules.tools.cosi.featuresList.exportTable') }}
                </v-btn>
                <br>
                <v-checkbox
                    id="export-details"
                    v-model="exportDetails"
                    dense
                    hide-details
                    :label="$t('additional:modules.tools.cosi.featuresList.exportDetails')"
                    :title="$t('additional:modules.tools.cosi.featuresList.exportDetails')"
                />
            </v-col>
        </v-row>
    </div>
</template>

<style lang="scss">
    @import "~variables";

    #features-list-toolbar {
        font-family: $font_family_default;

        .row+.row {
            margin-top: 0;
        }

        .v-input {
            border-radius: $border-radius-base;
            font-size: 14px;
            .v-label {
                font-size: 14px;
            }
        }

        button {
            text-transform: inherit;
            font-family: $font_family_accent;
        }

        .border-style {
            border-left: 1px solid $light_grey;
        }
    }
</style>
