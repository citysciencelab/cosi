<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations} from "vuex";
import mutations from "../store/mutationsPolygonStyler";
import getters from "../store/gettersPolygonStyler";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer.js";
import {asArray} from "ol/color";
import {getModelByAttributes} from "../../utils/radioBridge.js";
import PolygonStylerSettings from "./PolygonStylerSettings.vue";


export default {
    name: "PolygonStyler",
    components: {
        Tool,
        PolygonStylerSettings
    },
    data () {
        return {
            layerList: [],
            selectedLayerNameList: [],
            settingsDialog: false,
            tableItems: [],
            selectedTableItem: null
        };
    },
    computed: {
        ...mapGetters("Tools/PolygonStyler", Object.keys(getters)),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList"]),
        ...mapGetters("Language", ["currentLocale"]),

        tableHeader () {
            return [
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.columnTopic"),
                    value: "name",
                    sortable: false
                },
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.columnAttribute"),
                    value: "attribute",
                    sortable: false
                },
                {
                    text: this.$t("additional:modules.tools.cosi.polygonStyler.columnEdit"),
                    value: "actions",
                    sortable: false
                }
            ];
        },

        /**
         * Gets the names of all available layer.
         * @return {String[]} List of names.
         */
        layerNameList () {
            return this.layerList.map(layer => layer.get("name"));
        },

        /**
         * Gets all visible table items.
         * @returns {Object[]} List of visible table items.
         */
        visibleTableItems () {
            return this.tableItems.filter(item => item.isVisible);
        }
    },
    watch: {
        /**
         * Updates the layer list data every time vector layers are activated or deactivated.
         * @param {ol/layer[]} vectorLayerList - A list of all actvie vector layer.
         * @returns {void}
         */
        activeVectorLayerList (vectorLayerList) {
            this.layerList = this.getWebglLayer(vectorLayerList);
        },

        /**
         * If a layer name is removed from the list, the list of selected name layers is updated, if necessary.
         * @param {String[]} newNameList - The current list of layer names.
         * @param {String[]} oldNameList - The old list of layer names.
         * @returns {void}
         */
        layerNameList (newNameList, oldNameList) {
            if (oldNameList.length > newNameList.length) {
                this.updateSelectedLayerNameList(newNameList, oldNameList);
            }
        },

        /**
         * Identifies the last layer name clicked on and finds the corresponding tableItem.
         * If it is already there, toggles the visibility. If not, adds it to the tableItems.
         * @param {String[]} newNameList - The current list of selected names.
         * @param {String[]} oldNameList - The old list of selected names.
         * @returns {void}
         */
        selectedLayerNameList (newNameList, oldNameList) {
            const clickedName = this.differenceOfTwoArrays(newNameList, oldNameList).toString(),
                tableItem = this.tableItems.find(item => item.name === clickedName);

            if (tableItem) {
                tableItem.isVisible = !tableItem.isVisible;
            }
            else {
                this.addTableItem(this.tableItems, clickedName);
            }
        },
        currentLocale (newLocal) {
            this.$vuetify.lang.current = newLocal;
        }
    },
    created () {
        this.$on("close", () => {
            this.setActive(false);
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({
                id: this.$store.state.Tools.QueryDistricts.id
            });

            if (model) {
                model.set("isActive", false);
            }
        });
    },
    methods: {
        ...mapMutations("Tools/PolygonStyler", Object.keys(mutations)),

        /**
         * Packs the color.
         * @param {Array} color - The color to pack.
         * @returns {Number} The packed color.
         */
        packColor (color) {
            const array = asArray(color),
                r = array[0] * 256 * 256,
                g = array[1] * 256,
                b = array[2];

            return r + g + b;
        },

        /**
         * Adds a table item by the given layer name.
         * @param {Object[]} tableItems - The table items.
         * @param {String} name - The name of the layer to add.
         * @returns {void}
         */
        addTableItem (tableItems, name) {
            const foundLayer = this.layerList.find(layer => layer.get("name") === name);

            tableItems.push({
                name: foundLayer.get("name"),
                layer: foundLayer,
                features: foundLayer.getSource().getFeatures(),
                featureAttributes: this.mapAttributes(foundLayer.get("gfiAttributes")),
                isVisible: true,
                defaultRenderer: foundLayer.renderer_,
                styleList: []
            });
        },

        /**
         * Takes the difference between two arrays.
         * @param {*[]} arrFirst - The first array for difference taking.
         * @param {*[]} arrSecond - The second array for difference taking.
         * @return {*[]} An array with the difference.
         */
        differenceOfTwoArrays (arrFirst, arrSecond) {
            return arrFirst.filter(value => !arrSecond.includes(value))
                .concat(arrSecond.filter(value => !arrFirst.includes(value)));
        },

        /**
         * Gets the render functions for styling features based on the passed attribute.
         * @param {Object[]} styleList - A list of style objects. For each value of the passed attribute a style object is available.
         * @param {String} attribute - The attribute to be styled by.
         * @returns {Object} An object with the render functions for the fill and stroke style.
         */
        getRenderFunctions (styleList, attribute) {
            return {
                fill: {
                    attributes: {
                        color: (feature) => {
                            const style = styleList.find(color => color.attribute === feature.get(attribute));

                            return this.packColor(style.fill.color);
                        },
                        opacity: (feature) => {
                            const style = styleList.find(color => color.attribute === feature.get(attribute));

                            return style.fill.opacity;
                        }
                    }
                },
                stroke: {
                    attributes: {
                        color: (feature) => {
                            const style = styleList.find(color => color.attribute === feature.get(attribute));

                            return this.packColor(style.stroke.color);
                        },
                        width: () => {
                            return 1;
                        }
                    }
                }
            };
        },

        /**
         * Gets a list of WebGL Layer whose geometry is not a point.
         * @param {Object[]} layerList - List of active vector layer.
         * @return {Object[]} List of WebGL layer.
         */
        getWebglLayer (layerList) {
            return layerList.filter(layer => {
                return layer.get("renderer") === "webgl" && layer.get("isPointLayer") === false;
            });
        },

        /**
         * Maps the given attributes in each case to an object with value and text.
         * @param {Object} attributes - Attributes to map.
         * @return {Object[]} Array of mapped objects.
         */
        mapAttributes (attributes) {
            return Object.keys(attributes).map(key => {
                return {
                    value: key,
                    text: attributes[key]
                };
            });
        },

        /**
         * Sets the selected table item.
         * @param {Object} tableItem - The selected table item.
         * @returns {void}
         */
        setSelectedTableItem (tableItem) {
            this.selectedTableItem = tableItem;
            this.settingsDialog = true;
        },

        /**
         * Creates for each feature value of the passed attribute a style object and adds it to the table item.
         * @param {Object} tableItem - A table item.
         * @param {String} attributeName - The name of the feature attribute.
         * @returns {void}
         */
        setFeatureValues (tableItem, attributeName) {
            const allValues = tableItem.features.map(feature => feature.get(attributeName)),
                uniqueValues = [...new Set(allValues)];

            tableItem.styleList = this.getDefaultStyleList(uniqueValues);
            tableItem.selectedAttribute = attributeName;
        },

        /**
         * Gets a default list of style objects by the given values.
         * @param {String[]} values - Values for which a style object is got in each case.
         * @returns {Object[]} An array of style objects.
         */
        getDefaultStyleList (values) {
            return values.map(value => {
                return {
                    attribute: value,
                    text: typeof value === "undefined" ? this.$t("additional:modules.tools.cosi.polygonStyler.noData") : value,
                    fill: {
                        color: "#898989",
                        opacity: 0
                    },
                    stroke: {
                        color: "#898989",
                        opacity: 1,
                        width: 2
                    }
                };
            });
        },

        /**
         * Sets a renderer to a layer and update the map.
         * @param {ol/layer} layer - The layer to render.
         * @param {ol/renderer/webgl} renderer - The WebGL vector layer renderer.
         * @returns {void}
         */
        setRendererToLayer (layer, renderer) {
            layer.renderer_ = renderer;
            mapCollection.getMap("2D").renderSync();
        },

        /**
         * Updates the style of a layer by the given styleList.
         * @param {Object} tableItem - The selected table item.
         * @param {Object} tableItem.layer - The layer of the selected table item.
         * @param {Object[]} tableItem.styleList - The style list for the layer.
         * @param {String} tableItem.selectedAttribute - The attribute to be styled by.
         * @returns {void}
         */
        updateStyle ({layer, styleList, selectedAttribute}) {
            if (selectedAttribute) {
                const renderer = new WebGLVectorLayerRenderer(layer, this.getRenderFunctions(styleList, selectedAttribute));

                this.setRendererToLayer(layer, renderer);
            }
            this.settingsDialog = false;
        },

        /**
         * If a layer name is removed from the list, the list of selected name layers is updated, if the removed layer name was selected.
         * @param {String[]} newLayerNameList - The current list of layer names.
         * @param {String[]} oldLayerNameList - The old list of layer names.
         * @returns {void}
         */
        updateSelectedLayerNameList (newLayerNameList, oldLayerNameList) {
            const removeName = this.differenceOfTwoArrays(newLayerNameList, oldLayerNameList).toString(),
                isNameSelected = this.selectedLayerNameList.includes(removeName);

            if (isNameSelected) {
                this.selectedLayerNameList = this.selectedLayerNameList.filter(name => name !== removeName);
            }
        }
    }
};
</script>

<template>
    <Tool
        :title="name"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template
            v-if="active"
            #toolBody
        >
            <v-app id="polygon-styler">
                <v-select
                    v-model="selectedLayerNameList"
                    class="mb-5"
                    :label="$t('additional:modules.tools.cosi.polygonStyler.labelTopicSelection')"
                    :items="layerNameList"
                    multiple
                    outlined
                    dense
                />
                <v-data-table
                    v-if="visibleTableItems.length > 0"
                    :headers="tableHeader"
                    :items="visibleTableItems"
                    :hide-default-footer="true"
                >
                    <template #[`item.attribute`]="{ item }">
                        <v-select
                            :items="item.featureAttributes"
                            :value="item.selectedAttribute"
                            return-object
                            @change="setFeatureValues(item, $event.value)"
                        />
                    </template>
                    <template #[`item.actions`]="{ item }">
                        <v-btn
                            :title="$t('additional:modules.tools.cosi.polygonStyler.editButton')"
                            icon
                            @click="setSelectedTableItem(item)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                            :title="$t('additional:modules.tools.cosi.polygonStyler.removeButton')"
                            icon
                            @click="setRendererToLayer(item.layer, item.defaultRenderer)"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
                <PolygonStylerSettings
                    v-if="selectedTableItem"
                    :is-visible="settingsDialog"
                    :style-list="selectedTableItem.styleList"
                    @hideDialog="settingsDialog = false"
                    @updateStyle="updateStyle(selectedTableItem)"
                    @resetStyle="setFeatureValues(selectedTableItem, selectedTableItem.selectedAttribute);"
                />
            </v-app>
        </template>
    </Tool>
</template>

<style lang="scss">
    @import "~variables";

    #polygon-styler {
        font-family: $font_family_default;

        .v-input {
            border-radius: $border-radius-base;
        }

        th {
            font-family: $font_family_accent;
        }

        button {
            text-transform: inherit;
            font-family: $font_family_accent;
            border-radius: $border-radius-base;
            box-shadow: none;
        }

        .pointer {
            cursor: pointer;
        }
    }

</style>
