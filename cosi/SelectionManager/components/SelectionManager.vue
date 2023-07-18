<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersSelectionManager";
import mutations from "../store/mutationsSelectionManager";
import actions from "../store/actionsSelectionManager";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import getBoundingGeometry from "../../utils/getBoundingGeometry.js";
import {setBBoxToGeom} from "../../utils/setBBoxToGeom.js";
import ToolInfo from "../../components/ToolInfo.vue";
import {addModelsByAttributes, getModelByAttributes} from "../../utils/radioBridge.js";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import {default as turfCenterOfMass} from "@turf/center-of-mass";
import {default as turfConcave} from "@turf/concave";
import {featureCollection as turfFeatureCollection} from "@turf/helpers";
import GeoJSON from "ol/format/GeoJSON";
import {Fill, Stroke, Style} from "ol/style.js";

export default {
    name: "SelectionManager",
    components: {
        ToolInfo
    },
    data () {
        return {
            // Bool if the addon is open in the frontend or not
            openAddon: false,
            // array that stores the indexes of selections with extend options active
            extendedOptions: [],
            // array that stores the indexes of selections that are about to be merged
            selectionsToMerge: [],
            // Bool that reacts to changes in the this.selections array
            allSelectionsPossible: true,
            // Helper variable to deal with broken loader
            dataLoaded: false
        };
    },
    computed: {
        ...mapGetters("Tools/SelectionManager", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/ColorCodeMap", ["upperEdge"]),
        ...mapGetters("Tools/DistrictSelector", ["name", "selectedDistrictLevel", "selectedFeatures", "label", "keyOfAttrName", "keyOfAttrNameStats", "loadend", "metadataUrls", "boundingGeometry", "bufferValue"]),
        ...mapGetters("Maps", ["getVisibleLayerList"]),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList", {facilitiesMapping: "mapping"}]),
        dashboardOpen () {
            return this.$store.getters["Tools/Dashboard/active"] || this.$store.getters["Tools/FeaturesList/active"];
        },
        selectionGroups () {
            return [... new Set(this.selections.map(selection => selection.source).sort())];
        },
        activeLayerList () {
            return this.activeVectorLayerList.map(layer => layer.getProperties().name);
        },
        selectionsLength () {
            return this.selections.length;
        }
    },
    watch: {
        // other tools can commit to this store variable to add new selections
        // that pattern allows us to use data from external tools and apply internal methods to it.
        acceptSelection (selection) {
            if (selection) {
                // check for stored vector layers to load
                selection.storedLayers.forEach(layerName => {
                    if (!getModelByAttributes({type: "layer", name: layerName})) {
                        addModelsByAttributes({name: layerName});
                    }
                });

                const format = new GeoJSON();

                selection.selection = selection.selection.map(sel => sel.geometry ? format.readFeature(sel) : new Feature({geometry: new Polygon(inflateCoordinatesArray(sel.values_.geometry.flatCoordinates, 0, sel.values_.geometry.ends_, sel.values_.geometry.stride))}));
                selection.abv = this.selections.filter(sel => sel.abv === selection.id.match(/\b([A-Z0-9])/g).join("")).length > 0 ? selection.id.match(/\b([A-Z0-9])/g).join("") + "-" + this.selections.filter(sel => sel.abv === selection.id.match(/\b([A-Z0-9])/g).join("")).length : selection.id.match(/\b([A-Z0-9])/g).join("");
                this.addSelection(selection);
                this.highlightSelection(this.selections.length - 1);

            }
        },
        // watcher on activeSet so that the active selection can be changed via the inputActiveSelection mutation from outside of the component
        activeSelection (value) {
            if (value !== null) {
                this.activateSelection(value);
            }
            else {
                this.removeLayer();
            }
        },
        /**
             * @description Changes the style of the selection manager VectorLayer based on if the addon is active or not.
             * @returns {void}
             */
        openAddon () {
            const selectionLayer = this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager");

            if (!this.openAddon) {
                const style = new Style({
                    stroke: new Stroke({
                        color: "#A8404E",
                        width: 3
                    })
                });

                if (selectionLayer.length > 0) {
                    selectionLayer[0].setStyle(style);
                }
            }
            else {
                const style = new Style({
                    fill: new Fill({
                        color: "rgba(214, 96, 93, 0.35)"
                    }),
                    stroke: new Stroke({
                        color: "#D6605D",
                        width: 1
                    })
                });

                if (selectionLayer.length > 0) {
                    selectionLayer[0].setStyle(style);
                }
            }
        },
        // Note on the importance of selectionsLength:
        // `selections` is indirectly watched through the computed variable selectionsLength
        // Sets the all selections button active again if the this.selections array changes and updates the selection index
        selectionsLength (newValue, oldValue) {
            if ((oldValue && newValue && oldValue < newValue) || (!oldValue && newValue)) {
                this.inputActiveSelection(newValue - 1);
            }
            else if (newValue && newValue < this.activeSelection + 1) {
                this.inputActiveSelection(0);
            }

            this.allSelectionsPossible = true;

        }
    },
    created () {
        this.map = mapCollection.getMap("2D");
    },
    methods: {
        ...mapMutations("Tools/SelectionManager", Object.keys(mutations)),
        ...mapActions("Tools/SelectionManager", Object.keys(actions)),
        ...mapMutations("Maps", ["setLayerVisibility", "addLayerToMap", "removeLayerFromMap"]),
        /**
             * @description Highlights activeSelection
             * @param {Integer} index - Index of the active selection in this.selections
             * @returns {void}
             */
        activateSelection (index) {
            if (this.selections[index].settings.bufferActive) {
                this.rerenderSelection(index);
            }
            else {
                this.highlightSelection(index);
            }
        },
        /**
             * @description Creates VectorLayer for the chosen selection
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @param {boolean} forceUpdate - update even if selection hasn't changed
             * @returns {void}
             */
        highlightSelection (index) {
            if (this.selections[index].storedLayers.length > 0) {
                this.setStoredLayersActive(this.selections[index].storedLayers);
            }

            //  remove selection manager layers
            this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager").forEach(layer => this.map.removeLayer(layer));

            const vectorSource = new VectorSource({
                    features: this.selections[index].selection
                }),
                style = this.openAddon ? new Style({fill: new Fill({color: "rgba(214, 96, 93, 0.35)"}), stroke: new Stroke({color: "#D6605D", width: 1})}) : new Style({fill: new Fill({color: "rgba(255, 255, 255, 0)"}), stroke: new Stroke({color: "#A8404E", width: 3})}),
                layer = new VectorLayer({
                    name: "selection_manager",
                    source: vectorSource,
                    style: style
                });

            layer.setZIndex(9999);
            this.map.addLayer(layer);

            setBBoxToGeom.call(this, getBoundingGeometry(this.selections[index].selection, this.bufferValue));
        },
        /**
             * @description Creates VectorLayer for the chosen selection if there is a buffer value and overwrites standard selection.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        rerenderSelection (index) {
            if (this.selections[index].storedLayers.length > 0) {
                this.setStoredLayersActive(this.selections[index].storedLayers);
            }

            //  remove selection manager layers
            this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager").forEach(layer => this.map.removeLayer(layer));

            const vectorSource = new VectorSource({
                    features: this.selections[index].bufferedSelection
                }),
                layer = new VectorLayer({
                    name: "selection_manager",
                    source: vectorSource,
                    style: new Style({
                        fill: new Fill({
                            color: "rgba(214, 187, 47, 0.35)"
                        }),
                        stroke: new Stroke({
                            color: "#D6B62F",
                            width: 3
                        })
                    })
                });

            layer.setZIndex(9999);
            this.map.addLayer(layer);

            setBBoxToGeom.call(this, getBoundingGeometry(this.selections[index].bufferedSelection, this.bufferValue));
        },
        /**
             * @description Creates VectorLayer for the chosen selection on hover in the selection menu.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @param {Integer} color - RGB String of color that the hover shall have
             * @returns {void}
             */
        hoverSelection (index, color) {
            if (this.activeSelection !== index) {
                this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager_hover_layer").forEach(layer => this.map.removeLayer(layer));

                const vectorSource = new VectorSource({
                        features: this.selections[index].selection
                    }),
                    layer = new VectorLayer({
                        name: "selection_manager_hover_layer",
                        source: vectorSource,
                        style: new Style({
                            fill: new Fill({
                                color: color
                            })
                        })
                    });

                layer.setZIndex(9999);
                this.map.addLayer(layer);
            }
        },
        /**
             * @description Removes the hover selection layer.
             * @returns {void}
             */
        resetHovers () {
            this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager_hover_layer").forEach(layer => this.map.removeLayer(layer));
        },
        /**
             * @description Stores current layers or resets the stored layers in chosen selection
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        storeLayers (index) {
            if (this.selections[index].storedLayers.length > 0) {
                this.selections[index].storedLayers = [];
            }
            else {
                this.selections[index].storedLayers = this.activeLayerList;
            }
        },
        /**
             * @description Sets the storedLayers from the selection active and all other theme data layers inactive
             * @param {Array} storedLayers - The names of the stored layers inside the saved selection
             * @returns {void}
             */
        async setStoredLayersActive (storedLayers) {
            //  hide all active layers
            this.activeVectorLayerList.forEach(layer => {
                const layerId = layer.getProperties().id,
                    model = getModelByAttributes({type: "layer", id: layerId});

                if (model) {
                    model.set("isSelected", false);
                }
            });

            // show all layers stored in the current selection
            storedLayers.forEach(async layerName => {
                const model = getModelByAttributes({type: "layer", name: layerName});

                if (model) {
                    model.set("isSelected", true);
                }
            });
            // a bug in the loaderOverlay.hide() is not working, even if it's fired with a timeOut
            // so here's a very! uncanny workaround to make it work in this case
            await this.$nextTick();

            // setTimout because something triggers LoaderOverlay.show() after the last $nextTick() and I can't figure out what
            setTimeout(()=> {
                // remove the classes manually
                document.getElementById("loader").classList.remove("loader-is-loading");
                document.getElementById("masterportal-container").classList.remove("blurry");
            }, 1500);
        },
        /**
             * @description Adds index of selection to extendedOptions to extend to option menu in the frontend.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        setExtendedOptions (index) {
            if (this.extendedOptions.includes(index)) {
                this.extendedOptions.splice(this.extendedOptions.indexOf(index), 1);
            }
            else {
                this.extendedOptions.push(index);
            }
        },
        /**
             * @description Creates new single selection from all avaible selections in the this.selections array.
             * @returns {void}
             */
        allSelections () {
            const flatArray = this.selections.map(selection => selection.selection).flat();

            this.addNewSelection({selection: flatArray, source: this.$t("additional:modules.tools.cosi.selectionManager.title"), id: this.$t("additional:modules.tools.cosi.selectionManager.allSelections") + " (" + this.selections.length + ")"});
            this.highlightSelection(this.selections.length - 1);
            this.allSelectionsPossible = false;
        },
        /**
             * @description Calculates the center of each feature and draws a polygon along these points.
             * @param {Array} selectionInc - Array of selections that is supposed to be connected
             * @param {bool} indexArr - if true selections must be mapped via index from this.selections
             * @returns {void}
             */
        connectSelections (selectionInc, indexArr) {
            const selectionArray = indexArr ? this.selections.filter(selection => selectionInc.includes(this.selections.indexOf(selection))) : selectionInc,
                format = new GeoJSON(),
                newPolygonCoords = [],
                selectionsCopy = selectionArray.map(selection => selection.selection);

            selectionsCopy.forEach(selection => {
                if (Array.isArray(selection)) {
                    selection.forEach(subSelection => {
                        const centerOfPolygon = turfCenterOfMass(format.writeFeatureObject(subSelection));

                        newPolygonCoords.push(centerOfPolygon);
                    });
                }
                else {
                    const centerOfPolygon = turfCenterOfMass(format.writeFeatureObject(selection));

                    newPolygonCoords.push(centerOfPolygon);
                }
            });

            selectionsCopy.push(new Feature(new Polygon(turfConcave(turfFeatureCollection(newPolygonCoords)).geometry.coordinates)));
            this.addNewSelection({selection: selectionsCopy.flat(), source: this.$t("additional:modules.tools.cosi.selectionManager.title"), id: this.$t("additional:modules.tools.cosi.selectionManager.connectedSelections") + " (" + (selectionsCopy.length - 1) + ")"});
            this.highlightSelection(this.selections.length - 1);

            if (indexArr) {
                this.selectionsToMerge = [];
            }
        },
        /**
             * @description Toggles the buffered selection to overwrite standard selection on the OL Layer.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        triggerBuffer (index) {
            if (this.selections[index].settings.bufferActive) {
                this.selections[index].settings.bufferActive = false;
                if (this.activeSelection === index) {
                    this.highlightSelection(index);
                }
            }
            else {
                this.selections[index].settings.bufferActive = true;
                if (this.activeSelection === index) {
                    this.rerenderSelection(index);
                }
            }
        },
        /**
             * @description If the buffer value changes (at input v-slider) updates the buffered selection.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        polygonChange (index) {
            const newGeometry = getBoundingGeometry(this.selections[index].selection, this.selections[index].settings.buffer),
                transformedPolygons = [];

            newGeometry.getGeometries().forEach(geometry => {
                transformedPolygons.push(new Feature(geometry));
            });

            this.selections[index].bufferedSelection = transformedPolygons;

            if (this.selections[index].settings.bufferActive && this.activeSelection === index) {
                this.rerenderSelection(index);
            }
        },
        /**
             * @description Creates a new selection from the buffered value.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        addBufferAsSelection (index) {
            this.addNewSelection({selection: this.selections[index].bufferedSelection, source: this.$t("additional:modules.tools.cosi.selectionManager.title"), id: this.$t("additional:modules.tools.cosi.selectionManager.buffer") + " " + this.selections[index].id});
            this.selections[index].settings.buffer = 0;
            this.selections[index].settings.bufferActive = false;
            this.highlightSelection(this.selections.length - 1);
        },
        /**
             * @description Removes the selection_manager layer from the map
             * @returns {void}
             */
        removeLayer () {
            this.map.getLayers().getArray().filter(layer => layer.get("name") === "selection_manager").forEach(layer => this.map.removeLayer(layer));
        },
        /**
             * @description Removes a single selection from the this.selections array
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        removeSelection (index) {
            this.selections.splice(index, 1);

            // if no selections are left => remove the ol layer
            if (this.selections.length === 0) {
                this.inputActiveSelection(null);
                this.removeLayer();
            }

            // if selection was in cache => remove it there as well
            if (this.selectionsToMerge.includes(index)) {
                this.selectionsToMerge.splice(this.selectionsToMerge.indexOf(index), 1);
            }

            // if selection was active selection => reset active selection
            if (this.selections.length > 0 && index === this.activeSelection) {
                this.inputActiveSelection(0);
            }
        },
        /**
         * @description Resets the whole this.selections array
         * @returns {void}
         */
        removeAllSelections () {
            this.clearAllSelections();
            this.removeLayer();
            this.inputActiveSelection(null);
        },
        /**
             * @description Merges selections from selectionToMerge array into a single selection.
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        addMergedSelection () {
            const flatSelections = this.selections.filter((selection, i) => this.selectionsToMerge.includes(i)).map(selection => selection.selection),
                flatArray = flatSelections.flat();

            this.addNewSelection({selection: flatArray, source: this.$t("additional:modules.tools.cosi.selectionManager.title"), id: this.$t("additional:modules.tools.cosi.selectionManager.mergedSelections") + " (" + this.selectionsToMerge.length + ")"});
            this.selectionsToMerge = [];
            this.highlightSelection(this.selections.length - 1);
        },
        /**
             * @description Adds index of single selection to the this.selectionsToMerge array (or removes it).
             * @param {Integer} index - Index of the chosen selection in this.selections
             * @returns {void}
             */
        mergeSelections (index) {
            if (this.selectionsToMerge.includes(index)) {
                this.selectionsToMerge.splice(this.selectionsToMerge.indexOf(index), 1);
            }
            else {
                this.selectionsToMerge.push(index);
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="!dashboardOpen && selections.length > 0"
        id="sm"
        class="sm_addon_container"
        :style="{bottom: upperEdge + 10 + 'px'}"
    >
        <button
            id="sm_btn"
            class="addon_icon cosi_menu_btn"
            :class="{highlight: openAddon}"
            @click="openAddon = !openAddon"
        >
            <v-icon>mdi-selection-ellipse-arrow-inside</v-icon>
        </button>
        <div
            id="sm_wrapper"
            class="addon_wrapper"
            :class="{
                open: openAddon
            }"
        >
            <div class="selection_menu">
                <div class="addon_head">
                    <p>{{ $t('additional:modules.tools.cosi.selectionManager.title') }}</p>
                    <ToolInfo
                        :url="readmeUrl"
                        :locale="currentLocale"
                    />
                </div>
                <div
                    v-if="selections.length > 1"
                    class="function_buttons all_function_buttons function_grp"
                >
                    <p class="menu_title">
                        {{ $t('additional:modules.tools.cosi.selectionManager.allSelectionsMenu') }}
                    </p>
                    <button
                        class="all_btn"
                        :title="$t('additional:modules.tools.cosi.selectionManager.title_all_selections')"
                        :class="{disabled: selections.length < 2 || !allSelectionsPossible}"
                        @click="allSelections()"
                    >
                        <v-icon>mdi-selection-ellipse-arrow-inside</v-icon>
                    </button>
                    <button
                        class="connect_btn"
                        :title="$t('additional:modules.tools.cosi.selectionManager.title_connect_selections')"
                        :class="{disabled: selections.map(selection => selection.selection).flat().length > 3}"
                        @click="connectSelections(selections, false)"
                    >
                        <v-icon>mdi-vector-selection</v-icon>
                    </button>
                    <button
                        class="remove_all_btn"
                        :title="$t('additional:modules.tools.cosi.selectionManager.title_remove_all')"
                        @click="removeAllSelections()"
                    >
                        <v-icon>mdi-close-box-multiple</v-icon>
                    </button>
                </div>
                <div
                    v-if="selectionsToMerge.length > 0"
                    class="cache function_grp"
                >
                    <div class="cache_head head">
                        <div class="function_buttons cache_buttons">
                            <p class="menu_title">
                                {{ $t('additional:modules.tools.cosi.selectionManager.cache') }}
                            </p>
                            <button
                                v-if="selectionsToMerge.length > 0"
                                :title="$t('additional:modules.tools.cosi.selectionManager.title_merge')"
                                class="combine_btn"
                                @click="addMergedSelection()"
                            >
                                <v-icon>mdi-vector-combine</v-icon>
                            </button>
                            <button
                                class="connect_btn"
                                :title="$t('additional:modules.tools.cosi.selectionManager.title_connect_selections')"
                                :class="{disabled: selectionsToMerge.length < 3}"
                                @click="connectSelections(selectionsToMerge, true)"
                            >
                                <v-icon>mdi-vector-selection</v-icon>
                            </button>
                            <button
                                class="remove_all_btn"
                                :title="$t('additional:modules.tools.cosi.selectionManager.title_remove_all')"
                                @click="selectionsToMerge = []"
                            >
                                <v-icon>mdi-close-box-multiple</v-icon>
                            </button>
                        </div>
                    </div>
                    <ul class="cache_selections">
                        <li
                            v-for="(selection, i) in selectionsToMerge"
                            :key="i"
                            class="cache_selection"
                            @click="inputActiveSelection(i)"
                            @keyup="inputActiveSelection(i)"
                            @mouseover="hoverSelection(i, 'rgba(47, 162, 255, 0.3)')"
                            @focus="hoverSelection(i, 'rgba(47, 162, 255, 0.3)')"
                            @mouseleave="resetHovers"
                            @focusout="resetHovers"
                        >
                            {{ selections[selection].abv }}
                            <button
                                class="remove_cached_btn"
                                :title="$t('additional:modules.tools.cosi.selectionManager.title_remove_cached_selection')"
                                @click="selectionsToMerge.splice(i, 1);"
                            >
                                <v-icon>mdi-close</v-icon>
                            </button>
                        </li>
                    </ul>
                </div>
                <ul class="groups">
                    <li
                        v-for="(group, index) in selectionGroups"
                        :key="index"
                        class="grouplevel"
                    >
                        <div class="group_header">
                            {{ group }}
                        </div>
                        <ul class="selections">
                            <template v-for="(selection, i) in selections">
                                <li
                                    v-if="selection.source === group"
                                    :key="i"
                                    class="selectionlevel"
                                    :class="{
                                        extended: extendedOptions.includes(i),
                                        hoverHighlight: selectionsToMerge.includes(i)
                                    }"
                                    @mouseover="hoverSelection(i, 'rgba(214, 96, 93, 0.3)')"
                                    @focus="hoverSelection(i, 'rgba(214, 96, 93, 0.3)')"
                                    @mouseleave="resetHovers"
                                    @focusout="resetHovers"
                                >
                                    <span class="hint">{{ selection.abv }}</span>
                                    <p>{{ selection.id }}</p>
                                    <ul
                                        class="function_buttons"
                                    >
                                        <button
                                            class="view_btn"
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_view')"
                                            :class="{
                                                highlight: activeSelection === i,
                                                scaledHighlight: selection.settings.bufferActive,
                                            }"
                                            @click.exact="inputActiveSelection(i)"
                                        >
                                            <v-icon>mdi-eye-outline</v-icon>
                                        </button>
                                        <button
                                            v-if="selections.length > 1"
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_add')"
                                            class="add_btn"
                                            :class="{
                                                highlight: selectionsToMerge.includes(i),
                                            }"
                                            @click="mergeSelections(i)"
                                        >
                                            <v-icon>mdi-plus</v-icon>
                                        </button>
                                        <button
                                            class="freeze_btn"
                                            :class="{highlight: selection.storedLayers.length > 0}"
                                            :title="selection.storedLayers.length > 0 ? selection.storedLayers.join(', ') : $t('additional:modules.tools.cosi.selectionManager.title_stored')"
                                            @click="storeLayers(i)"
                                        >
                                            <template v-if="selection.storedLayers.length > 0">
                                                <v-icon>mdi-anchor</v-icon>
                                            </template>
                                            <template v-else>
                                                <v-icon>mdi-layers-plus</v-icon>
                                            </template>
                                        </button>
                                        <button
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_extended_options')"
                                            class="option_btn"
                                            :class="{highlight: extendedOptions.includes(i)}"
                                            @click="setExtendedOptions(i)"
                                        >
                                            <v-icon>mdi-tools</v-icon>
                                        </button>
                                        <button
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_remove')"
                                            class="remove_btn"
                                            @click="removeSelection(i)"
                                        >
                                            <v-icon>mdi-close</v-icon>
                                        </button>
                                    </ul>
                                    <div class="extended_options">
                                        <v-text-field
                                            v-model="selection.settings.buffer"
                                            max="1500"
                                            min="-1500"
                                            type="number"
                                            @input="polygonChange(i)"
                                        />
                                        <v-slider
                                            v-model="selection.settings.buffer"
                                            max="1500"
                                            min="-1500"
                                            step="10"
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_slider')"
                                            @input="polygonChange(i)"
                                        />
                                        <button
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_toggle_buffer')"
                                            class="activate_btn"
                                            :class="{highlight: selection.settings.bufferActive}"
                                            @click="triggerBuffer(i)"
                                        >
                                            <v-icon>mdi-selection-drag</v-icon>
                                        </button>
                                        <button
                                            v-if="selection.settings.bufferActive && selection.settings.buffer !== 0"
                                            :title="$t('additional:modules.tools.cosi.selectionManager.title_buffer_selection')"
                                            class="add_buffer_btn"
                                            @click="addBufferAsSelection(i)"
                                        >
                                            <v-icon>mdi-plus-box-multiple</v-icon>
                                        </button>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    @import "../../utils/variables.scss";
        .sm_addon_container {
            position:fixed;
            z-index:5000;
            left:18px;

            .addon_icon {
                position:absolute;
                left:0;
                bottom:0;
                width:44px;
                height:36px;
                background:$buttongrey;
                border:1px solid #aaa;
                @include drop_shadow;

                .v-icon {
                    font-size:24px;
                }

                &.highlight {
                    border:1px solid $brightblue;
                    background:whitesmoke;
                }
            }

            .addon_wrapper {
                position:absolute;
                bottom:0;
                left:50px;
                width:450px;
                height:0;
                background:white;
                transition:0.3s;
                overflow:hidden;
                @include drop_shadow;

                &.mergeHover {
                    background:rgba(255,255,255,0.85);
                    backdrop-filter:blur(5px);
                    outline:2px solid $masterportal_blue;
                }

                .addon_head {
                    p {
                        font-size: 120%;
                        font-weight: 700;
                        color: black;
                        margin-left: 10px;
                        padding-top: 15px;
                        margin-bottom: -25px;
                    }
                }

                .all_function_buttons, .cache_buttons {
                    width:auto;
                    height:30px;
                    margin:0px 5px 0px auto;
                    // border-bottom: 1px solid #aaa;
                    display:flex;
                    flex-flow:row wrap;
                    justify-content:flex-end;

                    button {
                        flex-basis:20px;
                        height:20px;
                        background:#424242;
                        margin-top:5px;
                        margin-left:5px;

                        &.disabled {
                            pointer-events:none;
                            opacity:0.6;
                        }

                        &.remove_all_btn {
                            background:#D6605D;
                        }

                        .v-icon {
                            font-size:16px;
                            color:whitesmoke;
                        }
                    }
                }

                &.open {
                    height:auto;
                    overflow-y:auto;
                    overflow-x:hidden;
                    max-height:68vh;
                    transition:0.3s;
                }

                ul {
                    display:flex;
                    flex-flow:row wrap;
                    width:100%;
                    padding:0;
                    list-style:none;

                    li {
                        flex:1 0 100%;
                    }
                }

                .cache {
                    margin:3px 0px;
                    border-top:1px solid #ccc;
                    border-bottom:1px solid #ccc;
                    background:whitesmoke;

                    ul {
                        justify-content:flex-end;
                        padding:5px;
                        box-sizing:border-box;

                        li {
                            flex:0 0 auto;
                            padding:5px 10px;
                            font-size:10px;
                            margin-left:3px;
                            margin-top:3px;
                            background:#ccc;

                            button {
                                margin-left:10px;

                                &.disabled {
                                    pointer-events:none;
                                    opacity:0.6;
                                }

                                .v-icon {
                                    font-size:10px;
                                    color:#444;
                                }
                            }

                            &:hover {
                                cursor:pointer;
                                color:whitesmoke;
                                background:#2FA2FF;
                            }
                        }
                    }
                }

                .function_grp {
                    .menu_title {
                        color:#aaa;
                        font-size:90%;
                        line-height:30px;
                        margin-right:5px;
                    }
                }

                ul.groups {
                    .group_header {
                        width:100%;
                        height:40px;
                        line-height:40px;
                        color:black;
                        font-weight:700;
                        padding-left:10px;
                        border-bottom:1px solid #aaa;
                    }

                    li.grouplevel {
                    }

                    ul.selections {
                        li.selectionlevel {
                            display:flex;
                            flex-flow:row wrap;
                            flex:1 0 100%;
                            background:whitesmoke;
                            border-bottom:1px solid #ccc;
                            height:30px;
                            padding-left:10px;
                            text-align:left;
                            box-sizing:border-box;
                            overflow:hidden;
                            transition:0.15s;

                            &.hoverHighlight {
                                background:#ddd;
                                border-right:2px solid #2FA2FF;
                            }

                            &.extended {
                                height:70px;
                            }

                            .extended_options {
                                    display:flex;
                                    flex-flow:row wrap;
                                    justify-content:flex-end;
                                    height:40px;
                                    padding:5px;
                                    flex:1 0 100%;
                                    box-sizing:border-box;

                                    button {
                                        flex-basis:20px;
                                        height:20px;
                                        background:#424242;
                                        margin:5px 0px 0px 5px;

                                        .v-icon {
                                            color:whitesmoke;
                                            font-size:16px;
                                        }
                                    }

                                    button.activate_btn {
                                        &.highlight {
                                            background:#D6B62F;
                                        }
                                    }

                                    .v-text-field {
                                        background:white;
                                        height:30px;
                                        flex:0 0 50px;
                                        padding: 0;
                                        margin: 0;
                                        border: 1px solid #ccc;

                                        .v-input__slot {
                                            &:before, &:after {
                                                display:none;
                                            }
                                        }

                                        input {
                                            text-align:center;
                                            font-size:100%;
                                        }
                                    }

                                    .v-input__slider {
                                        height:30px;
                                        flex:0 0 80px;

                                        .v-slider__thumb:before {
                                            display:none;
                                        }
                                    }
                                }

                            span.hint {
                                display:inline;
                                font-size:75%;
                                padding:0px 3px;
                                box-sizing:border-box;
                                color:#888;
                                height:20px;
                                width:38px;
                                text-align:center;
                                line-height:20px;
                                margin:5px 6px 5px 0px;
                                border:1px solid #888;
                            }

                            p {
                                // flex-basis:calc(100% - 170px);
                                line-height:30px;
                            }

                            ul.function_buttons {
                                display:flex;
                                flex-flow:row wrap;
                                flex-basis:130px;
                                justify-content: flex-end;
                                padding-right: 5px;
                                margin: 0px 0px 0px auto;

                                button {
                                    flex-basis:20px;
                                    height:20px;
                                    background:#424242;
                                    margin-top:5px;
                                    margin-left:5px;

                                    &.view_btn {
                                        &.highlight {
                                            background:#D6605D;

                                            &.scaledHighlight {
                                                background:#D6B62F;

                                                .v-icon {
                                                    color:#222;
                                                }
                                            }

                                            &:hover {
                                                filter:invert(0);
                                            }
                                        }
                                    }

                                    &.combine_btn {
                                        background: #2FA2FF;

                                        .v-icon {
                                            color:whitesmoke;
                                        }

                                        &:hover {
                                            border:1px solid 2px solid #2FA2FF;
                                            background:whitesmoke;

                                            .v-icon {
                                                color:#2FA2FF;
                                            }
                                        }
                                    }

                                    &.add_btn {
                                        background:whitesmoke;
                                        border:1px solid #ccc;

                                        .v-icon {
                                            color:#888;
                                        }

                                        &.highlight {
                                            background:#2FA2FF;

                                            .v-icon {
                                                color:whitesmoke;
                                            }
                                        }
                                    }

                                    &.freeze_btn {
                                        &.highlight {
                                            background:$masterportal_blue;
                                        }
                                    }

                                    &.option_btn {
                                        &.highlight {
                                            background:whitesmoke;
                                            border:1px solid #222;

                                            .v-icon {
                                                color:#222;
                                            }
                                        }
                                    }

                                    &.remove_btn {
                                        background:$error_red;
                                    }

                                    &:hover {
                                        outline:1px solid #222;
                                        background:whitesmoke;

                                        .v-icon {
                                            color:#222;
                                        }
                                    }

                                    .v-icon {
                                        font-size:16px;
                                        color:whitesmoke;
                                    }
                                }
                            }

                            &:hover {
                                cursor:pointer;
                            }
                        }
                    }
                }
            }
        }
</style>
