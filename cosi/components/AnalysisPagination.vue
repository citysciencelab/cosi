<script>
export default {
    name: "AnalysisPagination",
    props: {
        sets: {
            type: Array,
            default: () => []
        },
        activeSet: {
            type: Number,
            default: 0
        },
        downloads: {
            type: Array,
            default: () => ["Export"]
        },
        titles: {
            type: Object,
            default: () => ({})
        },
        addFunction: {
            type: Boolean,
            default: false
        },
        downloadCondition: {
            type: Boolean,
            default: true
        },
        removeCondition: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            page: 1
        };
    },
    watch: {
        /**
         * Sets the current page to one higher than the index of 'activeSet'.
         * @param {Number} newActiveSet - The index of the active set.
         * @returns {void}
         */
        activeSet (newActiveSet) {
            this.page = newActiveSet + 1;
        },
        /**
         * Emits the index of the set to be activated.
         * @param {Number} newPage - The number of the current page.
         * @returns {void}
         */
        page (newPage) {
            this.$emit("setActiveSet", newPage - 1);
        }
    }
};
</script>

<template>
    <v-app class="analysis-pagination">
        <v-row no-gutters>
            <v-col class="text-center">
                <v-pagination
                    v-if="sets.length > 1"
                    v-model="page"
                    :length="sets.length"
                />
            </v-col>
        </v-row>
        <v-row
            no-gutters
            class="mt-1"
        >
            <v-col class="text-center">
                <v-btn
                    v-if="addFunction"
                    tile
                    depressed
                    small
                    color="grey lighten-1"
                    :title="titles.add"
                    @click="$emit('addSet')"
                >
                    <v-icon
                        dense
                    >
                        mdi-plus-box-outline
                    </v-icon>
                </v-btn>
                <template v-if="downloadCondition">
                    <v-btn
                        v-for="(type, i) in downloads"
                        :key="type"
                        tile
                        depressed
                        small
                        color="green lighten-2"
                        :title="titles.downloads[i]"
                        @click="$emit('download' + type, activeSet)"
                    >
                        {{ type }}
                        <v-icon
                            dense
                        >
                            mdi-download
                        </v-icon>
                    </v-btn>
                </template>
                <v-btn
                    v-if="sets.length > 1"
                    tile
                    depressed
                    small
                    color="green lighten-2"
                    :title="titles.downloadAll"
                    @click="$emit('downloadAll')"
                >
                    <v-icon
                        dense
                    >
                        mdi-folder-download
                    </v-icon>
                </v-btn>
                <v-btn
                    v-if="removeCondition"
                    tile
                    depressed
                    small
                    color="red accent-2"
                    :title="titles.remove"
                    @click="$emit('removeSingle', activeSet)"
                >
                    <v-icon
                        dense
                    >
                        mdi-close
                    </v-icon>
                </v-btn>
                <v-btn
                    v-if="sets.length > 1"
                    tile
                    depressed
                    small
                    color="red accent-2"
                    :title="titles.removeAll"
                    @click="$emit('removeAll')"
                >
                    <v-icon
                        dense
                    >
                        mdi-folder-remove
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-app>
</template>

<style lang="scss">
    @import "~variables";

    .analysis-pagination {
        .v-pagination__item {
            height: 28px;
            min-width: 28px;
        }
        .v-pagination__navigation {
            height: 26px;
            width: 26px;
        }
    }
</style>
