<script>
import {mapGetters} from "vuex";

export default {
    name: "PolygonStylerSettings",
    props: {
        isVisible: {
            type: Boolean,
            requierd: true
        },
        styleList: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            colorPickerDialog: false,
            colorPickerValue: null,
            selectedStyle: null
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        tableHeader () {
            return [
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.settings.columnValue"),
                    value: "text"
                },
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.settings.columnFill"),
                    value: "fill",
                    align: "center",
                    sortable: false
                },
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.settings.columnStroke"),
                    value: "stroke",
                    align: "center",
                    sortable: false
                }
            ];
        }
    },
    watch: {
        currentLocale (newLocal) {
            this.$vuetify.lang.current = newLocal;
        }
    },
    methods: {
        /**
         * Sets the color of a style object.
         * @param {Object} style - The style object (fill or stroke) with a color and opacity.
         * @param {Object} color - The color to set.
         * @returns {void}
         */
        setColorToStyle (style, color) {
            style.color = `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
            this.toggleColorPickerDialog();
        },

        /**
         * Sets the color from the color picker.
         * @param {Object} color - The color to set.
         * @see {@link https://v2.vuetifyjs.com/en/api/v-color-picker/#events-update:color}
         * @returns {void}
         */
        setColorPickerValue (color) {
            this.colorPickerValue = color;
        },

        /**
         * Sets the selected style object (fill or stroke).
         * @param {Object} style - The style object.
         * @returns {void}
         */
        setSelectedStyle (style) {
            this.selectedStyle = style;
            this.toggleColorPickerDialog();
        },

        /**
         * Toggles the color picker dialog.
         * @returns {void}
         */
        toggleColorPickerDialog () {
            this.colorPickerDialog = !this.colorPickerDialog;
        }
    }
};
</script>

<template>
    <div>
        <v-dialog
            :value="isVisible"
            max-width="590"
            persistent
        >
            <v-card tile>
                <v-card-title class="border-bottom">
                    {{ $t("additional:modules.tools.cosi.polygonStyler.settings.title") }}
                </v-card-title>
                <v-card-text class="border-bottom">
                    <v-data-table
                        :headers="tableHeader"
                        :items="styleList"
                    >
                        <template #[`item.fill`]="{ item }">
                            <v-avatar
                                class="pointer"
                                :color="item.fill.color"
                                size="24"
                                @click="setSelectedStyle(item.fill)"
                            />
                        </template>
                        <template #[`item.stroke`]="{ item }">
                            <v-avatar
                                class="pointer"
                                :color="item.stroke.color"
                                size="24"
                                @click="setSelectedStyle(item.stroke)"
                            />
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions class="py-4 justify-space-between">
                    <v-btn
                        color="grey lighten-1"
                        @click.native="$emit('updateStyle')"
                    >
                        {{ $t("additional:modules.tools.cosi.polygonStyler.settings.applyButton") }}
                    </v-btn>
                    <v-btn
                        color="grey lighten-1"
                        @click.native="$emit('resetStyle')"
                    >
                        {{ $t("additional:modules.tools.cosi.polygonStyler.removeButton") }}
                    </v-btn>
                    <v-btn
                        color="grey lighten-1"
                        @click.native="$emit('hideDialog')"
                    >
                        {{ $t("additional:modules.tools.cosi.polygonStyler.settings.abortButton") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="colorPickerDialog"
            max-width="290"
            persistent
        >
            <v-card tile>
                <v-card-text class="border-bottom">
                    <v-color-picker
                        class="pt-4"
                        show-swatches
                        swatches-max-height="200"
                        dot-size="25"
                        @update:color="setColorPickerValue"
                    />
                </v-card-text>
                <v-card-actions class="py-3 justify-space-between">
                    <v-btn
                        color="grey lighten-1"
                        @click.native="setColorToStyle(selectedStyle, colorPickerValue)"
                    >
                        {{ $t("additional:modules.tools.cosi.polygonStyler.settings.applyButton") }}
                    </v-btn>
                    <v-btn
                        color="grey lighten-1"
                        @click.native="toggleColorPickerDialog"
                    >
                        {{ $t("additional:modules.tools.cosi.polygonStyler.settings.abortButton") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss" scoped>
</style>
