<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../src/utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersHochWasserPrint";
import mutations from "../store/mutationsHochWasserPrint";
import thousandsSeparator from "../../../src/utils/thousandsSeparator";
import getVisibleLayer from "../utils/getVisibleLayer";
import {Vector} from "ol/layer.js";
import Cluster from "ol/source/Cluster";
import axios from "axios";

export default {
    name: "HochWasserPrint",
    components: {
        ToolTemplate
    },
    data () {
        return {
            printDisabled: true,
            showHintInfoScale: false
        };
    },
    computed: {
        ...mapGetters("Tools/HochWasserPrint", Object.keys(getters)),
        ...mapGetters("Maps", ["scales, size", "scale"]),
        currentScale: {
            get () {
                return this.$store.state.Tools.HochWasserPrint.currentScale;
            },
            set (value) {
                this.setCurrentScale(value);
            }
        },
        printHwsId: {
            get () {
                return this.$store.state.Tools.HochWasserPrint.printHwsId;
            },
            set (value) {
                this.setPrintHwsId(value);
            }
        },
        hwsLayer () {
            return this.$store.state.configJson.Portalconfig.hws;
        },
        console: () => console
    },
    watch: {
        active: function (val) {
            if (val) {
                this.setIsScaleSelectedManually(false);
                this.retrieveCapabilites();
                this.setCurrentMapScale(this.scale);
            }
            else {
                this.togglePostrenderListener();
            }
        },
        scale: function (value) {
            this.setCurrentMapScale(value);
        },
        printHwsId (val) {
            if (Array.isArray(this.hwsLayer) && this.hwsLayer.length) {
                Radio.trigger("Util", "showLoader");
                setTimeout(function () {
                    this.activateHwsLayer(val);
                    Radio.trigger("Util", "hideLoader");
                }.bind(this), 100);
            }
        }
    },
    created () {
        if (Array.isArray(this.hwsLayer) && this.hwsLayer.length) {
            this.addPrintLayer2ModelList(this.hwsLayer);
        }

        if (typeof this.printHwsId === "string") {
            this.activateHwsLayer(this.printHwsId);
        }

        this.$on("close", this.close);

        if (this.mapfishServiceId) {
            console.warn("Print Tool: The parameter 'mapfishServiceId' is deprecated in the next major release! Please use printServiceId instead.");
        }

        this.setServiceId(this.mapfishServiceId && this.mapfishServiceId !== "" ? this.mapfishServiceId : this.printServiceId);

        Backbone.Events.listenTo(Radio.channel("ModelList"), {
            "updatedSelectedLayerList": () => {
                if (typeof this.eventListener !== "undefined") {
                    getVisibleLayer(this.printMapMarker);
                    this.updateCanvasLayer();
                    this.updateCanvasByFeaturesLoadend(this.visibleLayerList);
                }
            }
        });
    },
    mounted () {
        if (this.active) {
            this.setIsScaleSelectedManually(false);
            this.retrieveCapabilites();
            this.setCurrentMapScale(this.scale);
        }

        this.setCurrentMapScale(this.scale);
    },
    methods: {
        ...mapMutations("Tools/HochWasserPrint", Object.keys(mutations)),
        ...mapActions("Tools/HochWasserPrint", [
            "retrieveCapabilites",
            "togglePostrenderListener",
            "startPrint",
            "getOptimalResolution",
            "updateCanvasLayer"
        ]),

        /**
         * Waits until the features of Vector layers are loaded and then renders the canvas again.
         * Cluster layer are considered.
         * @param {module:ol/layer/Base~BaseLayer[]} visibleLayerList A list which contains the visible layers.
         * @returns {void}
         */
        updateCanvasByFeaturesLoadend (visibleLayerList) {
            visibleLayerList.forEach(layer => {
                if (layer instanceof Vector) {
                    let layerSource = layer.getSource();

                    if (layer.getSource() instanceof Cluster) {
                        layerSource = layerSource.getSource();
                    }

                    layerSource.once("featuresloadend", () => {
                        getVisibleLayer(this.printMapMarker);
                        this.updateCanvasLayer();
                        this.togglePostrenderListener();
                    });
                }
            });
        },

        /**
         * If Scale is changed
         * @param {event} event the click event
         * @returns {void}
         */
        async scaleChanged (event) {
            const scale = parseInt(event?.target?.value, 10),
                resolution = {
                    "scale": scale,
                    "mapSize": Radio.request("Map", "getSize"),
                    "printMapSize": this.layoutMapInfo
                };

            this.setAutoAdjustScale(false);
            this.setIsScaleSelectedManually(true);
            this.getOptimalResolution(resolution);
            this.updateCanvasLayer();
            await mapCollection.getMap("2D").render();
        },
        /**
         * Returns the "beautified" scale to be shown in the dropdown box
         * @param {Number} scale the scale to beautify
         * @returns {String} the beautified scale
         */
        returnScale (scale) {
            if (typeof scale !== "number") {
                return "";
            }
            else if (scale < 10000) {
                return String(scale);
            }
            return thousandsSeparator(scale, " ");
        },

        /**
         * Starts the print
         * @returns {void}
         */
        print () {
            const currentPrintLength = this.fileDownloads.filter(file => file.finishState === false).length;

            if (currentPrintLength <= 10) {
                const index = this.fileDownloads.length;

                this.setPrintStarted(true);
                this.startPrint({
                    index,
                    getResponse: async (url, payload) => {
                        return axios.post(url, payload);
                    }
                });
            }
            else {
                this.addSingleAlert(this.$t("additional:modules.tools.hochWasserPrint.alertMessage"));
            }
        },
        /**
         * By default complex trees create layer models depending on their visibility. Undefined layer models are ignored on printing.
         * To avoid this it's necessary to create layers in the modelList on startup. This must be done by selecting and immediately
         * deselecting the layer to avoid traffic.
         * @param {object} hwsLayer configuration of hws layer in array
         * @fires Core.ModelList#RadioTriggerModelListAddModelsByAttributes
         * @fires Core.ModelList#RadioRequestModelListGetModelByAttributes
         * @returns {void}
         */
        addPrintLayer2ModelList: function (hwsLayer) {
            let layerIds = [],
                layer,
                visible;

            hwsLayer.forEach(element => {
                layerIds.push(element.layerId);
            }, this);

            layerIds = layerIds.reduce((acc, val) => acc.concat(val), []);
            layerIds = Array.from(new Set(layerIds));

            layerIds.forEach(id => {
                Radio.trigger("ModelList", "addModelsByAttributes", {id: id});
                layer = Radio.request("ModelList", "getModelByAttributes", {id: id});
                visible = layer.get("isVisibleInMap");
                if (!visible) {
                    layer.set("isSelected", true);
                    layer.set("isSelected", false);
                }
            });
        },
        /**
         * Activating the hws layer group in map
         * @param {String} val the choosen hws layer group
         * @returns {void}
         */
        activateHwsLayer: function (val) {
            const hwsMap = this.hwsLayer.find(element => {
                    return element.printId === val;
                }),
                visiblelayer = Radio.request("ModelList", "getModelsByAttributes", {isVisibleInMap: true}),
                printLayerList = [];

            // because of a bug in mp we must deactivate all layers first. Otherwhile the layer order will be corrupted.
            visiblelayer.forEach(layer => {
                layer.setIsSelected(false);
            });

            if (hwsMap) {
                hwsMap.layerId.forEach(layerId => {
                    const layer = Radio.request("ModelList", "getModelByAttributes", {id: layerId});

                    if (layer) {
                        layer.setIsSelected(true);
                    }

                    printLayerList.push(layer?.layer);
                });

                this.setPrintLayerList(printLayerList);
            }
        },
        /**
         * Toggles the print button
         * @returns {void}
         */
        togglePrintButton () {
            this.setMaskStarted(!this.maskStarted);
            this.printDisabled = !this.printDisabled;
            this.togglePostrenderListener();
        },
        /**
         * Closing the current tool window
         * @returns {void}
         */
        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t('additional:modules.tools.hochWasserPrint.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :focus-to-close-icon="true"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="hoch-wasser-risikomanagement"
            >
                <form
                    id="printTool"
                    class="form-horizontal"
                >
                    <div class="form-group form-group-sm row">
                        <label
                            class="col-md-2 col-form-label scale"
                            for="printScale"
                        >
                            {{ $t('additional:modules.tools.hochWasserPrint.printScale') }}
                        </label>
                        <div class="col-md-3">
                            <select
                                id="printScale"
                                v-model="currentScale"
                                class="form-select form-select-sm"
                                @change="scaleChanged($event)"
                            >
                                <option
                                    v-for="(scale, i) in scaleList"
                                    :key="i"
                                    :value="scale"
                                    :selected="scale === currentScale"
                                >
                                    1 : {{ returnScale(scale) }}
                                </option>
                            </select>
                        </div>
                        <div
                            :class="{
                                'hint': true,
                                'grey-icon': currentScale === currentMapScale
                            }"
                            role="button"
                            tabindex="0"
                            @mouseover="showHintInfoScale = true"
                            @focusin="showHintInfoScale = true"
                            @mouseleave="showHintInfoScale = false"
                            @focusout="showHintInfoScale = false"
                        >
                            <span class="bootstrap-icon">
                                <i class="bi-info-circle-fill" />
                            </span>
                        </div>
                        <div
                            v-if="currentScale !== currentMapScale"
                            v-show="showHintInfoScale"
                            class="hint-info"
                        >
                            {{ $t("additional:modules.tools.hochWasserPrint.hintInfoScale") }}
                        </div>
                    </div>
                    <div
                        class="form-group form-group-sm row"
                    >
                        <label
                            class="col-sm-5 control-label scale"
                            for="autoAdjustScale"
                        >
                            {{ $t("additional:modules.tools.hochWasserPrint.autoAdjustScale") }}
                        </label>
                        <div class="col-sm-7">
                            <div class="checkbox">
                                <input
                                    id="autoAdjustScale"
                                    type="checkbox"
                                    :checked="autoAdjustScale && !isScaleSelectedManually"
                                    @change="setAutoAdjustScale($event.target.checked)"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="form-group form-group-sm print-manager">
                        <div class="col-sm-12">
                            <div class="form-group form-group-sm row">
                                <div class="col-sm-4" />
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12">
                                            Flusshochwasserereignis
                                        </div>
                                        <div class="col-sm-12 fluss row">
                                            <div class="col-sm-4">
                                                häufiges
                                            </div>
                                            <div class="col-sm-4">
                                                mittleres
                                            </div>
                                            <div class="col-sm-4">
                                                seltenes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12">
                                            Küstenhochwasserereignis
                                        </div>
                                        <div class="col-sm-12 coast row">
                                            <div class="col-sm-4">
                                                häufiges
                                            </div>
                                            <div class="col-sm-4">
                                                mittleres
                                            </div>
                                            <div class="col-sm-4">
                                                extremes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group form-group-sm">
                            <div class="col-sm-12 hochwasserkarte row">
                                <div class="col-sm-4 control-label">
                                    Hochwassergefahrenkarte
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12 row">
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gbh"
                                                    aria-label="gbh"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gbm"
                                                    aria-label="gbm"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gbs"
                                                    aria-label="gbs"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12 row">
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gsh"
                                                    aria-label="gsh"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gsm"
                                                    aria-label="gsm"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="gss"
                                                    aria-label="gss"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group form-group-sm">
                            <div class="col-sm-12 hochwasserkarte row">
                                <div class="col-sm-4 control-label">
                                    Hochwasserrisikokarte
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12 row">
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rbh"
                                                    aria-label="rbh"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rbm"
                                                    aria-label="rbm"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rbs"
                                                    aria-label="rbs"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group form-group-sm">
                                        <div class="col-sm-12 row">
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rsh"
                                                    aria-label="rsh"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rsm"
                                                    aria-label="rsm"
                                                >
                                            </div>
                                            <div class="col-sm-4 option">
                                                <input
                                                    v-model="printHwsId"
                                                    type="radio"
                                                    name="choice"
                                                    value="rss"
                                                    aria-label="rss"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group form-group-sm row">
                        <div class="col-sm-6">
                            <button
                                type="button"
                                class="btn btn-secondary btn-block preview"
                                @click="togglePrintButton"
                                @keydown.enter="togglePrintButton"
                            >
                                {{ $t('additional:modules.tools.hochWasserPrint.print') }}
                            </button>
                        </div>
                        <div class="col-sm-6">
                            <button
                                type="button"
                                class="btn btn-secondary btn-block print"
                                :disabled="printDisabled"
                                @click="print"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

.tool-window .col-sm-4{
    text-align: center;
}
.form-horizontal .control-label {
    text-align: left;
}
#printTool {
    overflow: hidden;
}

.print-manager {
    text-align: center;
}
.hochwasserkarte {
    text-align: left;
}

.print-manager .coast {
    margin-left: -10px;
}

#hoch-wasser-risikomanagement{
    min-width: 645px;
    .scale {
        text-align: left;
    }
    .form-horizontal .checkbox {
        padding-top: 2px;
    }
    .hochwasserkarte {
        .control-label {
            text-align: left;
        }
    }
    .hint {
        width: inherit;
        padding-top: 5px;
        float: left;
        margin-left: -16px;
        cursor: pointer;
        &.grey-icon {
            cursor: inherit;
            span {
                color: $light_grey;
            }
        }
    }
    .hint-info {
        position: absolute;
        right: 10px;
        width: 375px;
        top: 10px;
        z-index: 10;
        background: $white;
        border: 1px solid $dark_grey;
        padding: 5px;
    }
    .col-sm-4 {
        &.option {
            text-align: right;
        }
    }
    button {
        width: 100%;
    }
}
</style>
