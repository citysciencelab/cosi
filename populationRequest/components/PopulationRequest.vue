<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersPopulationRequest";
import mutations from "../store/mutationsPopulationRequest";
import GraphicalSelect from "../../../src/share-components/graphicalSelect/components/GraphicalSelect.vue";
import ToggleCheckbox from "../../../src/share-components/toggleCheckbox/components/ToggleCheckbox.vue";
import thousandsSeparator from "../../../src/utils/thousandsSeparator";
import WPS from "../../../src/api/wps";
import LoaderOverlay from "../../../src/utils/loaderOverlay";

export default {
    name: "PopulationRequest",
    components: {
        ToolTemplate,
        GraphicalSelect,
        ToggleCheckbox
    },
    data () {
        return {
            metaDataLink: undefined,
            mrhId: "46969C7D-FAA8-420A-81A0-8352ECCFF526",
            fhhId: "B3FD9BD5-F614-433F-A762-E14003C300BF",
            rasterLayerId: "13023",
            alkisAdressLayerId: "9726",
            sourceFHH: "nein",
            sourceMRH: "nein",
            inhabitantsFHH: "-1",
            inhabitantsFHHNum: -1,
            inhabitantsMRH: "-1",
            inhabitantsMRHNum: -1,
            searchArea: 0
        };
    },
    computed: {
        ...mapGetters("Tools/PopulationRequest", Object.keys(getters)),
        ...mapGetters(["uiStyle"]),

        /**
         * Indicates whether the ui style is default.
         * @returns {Boolean} Is the uiStyle default.
         */
        isDefaultStyle () {
            return this.uiStyle !== "SIMPLE" && this.uiStyle !== "TABLE";
        },

        /**
         * returns if the Raster Layer is Visible in the map
         * @returns {Boolean} RasterLayerVisibleInMap
         */
        isRasterVisibleInMap: function () {
            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.rasterLayerId}),
                isVisibleInMap = model !== undefined ? model.get("isVisibleInMap") : false;

            return isVisibleInMap;
        },

        /**
         * returns if the Alkis Adress Layer is Visible in the map
         * @returns {Boolean} AlkisAdressLayerVisibleInMap
         */
        isAlkisAdressesVisibleInMap: function () {
            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.alkisAdressLayerId}),
                isVisibleInMap = model !== undefined ? model.get("isVisibleInMap") : false;

            return isVisibleInMap;
        },

        /**
         * returns if the Hint and Linktext should be shown
         * @returns {Boolean} shall Text be shown
         */
        showFHHHintAndLinktext: function () {
            return this.inhabitantsFHHNum > -1 && (this.sourceFHH === "ja" || this.sourceFHH === "tlw");
        },

        /**
         * returns if the Hint and Linktext should be shown
         * @returns {Boolean} shall Text be shown
         */
        showMRHHintAndLinktext: function () {
            return this.inhabitantsMRHNum > -1 && (this.sourceMRH === "ja" || this.sourceMRH === "tlw");
        },

        /**
         * returns if the SourceAreaOutsideHint should be shown
         * @returns {Boolean} shall Hint be shown
         */
        showMRHSourceAreaOutsideHint: function () {
            return this.sourceMRH === "tlw" && this.sourceFHH === "nein";
        }
    },
    watch: {
        /**
         * Sets the status for graphicalSelect
         * @param {Boolean} newValue value deciding whether the tool gets activated or deactivated
         * @returns {void}
         */
        active (newValue) {
            if (newValue) {
                this.$nextTick(() => {
                    if (this.$refs.graphicalSelection) {
                        this.$refs.graphicalSelection.resetView();
                        this.$refs.graphicalSelection.setStatus(newValue);
                        this.$refs.graphicalSelection.resetGeographicSelection();
                    }
                });
            }
            else {
                if (this.$refs.graphicalSelection) {
                    this.$refs.graphicalSelection.setStatus(newValue);
                    this.$refs.graphicalSelection.resetView();
                    this.$refs.graphicalSelection.resetGeographicSelection();
                }
                // forced delete of tooltip overlay
                $("#tooltip-overlay").remove();
            }
        },
        geometry (newValue) {
            this.makeRequest(newValue);
        }
    },
    /**
     * Created hook:
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);

        this.$on("onDrawEnd", function (geoJson) {
            this.setGeometry(geoJson);
        });

        const service = Radio.request("RestReader", "getServiceById", this.populationReqServiceId);

        if (service !== undefined) {
            this.metaDataLink = service.get("url");
        }
    },
    methods: {
        ...mapMutations("Tools/PopulationRequest", Object.keys(mutations)),
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Resets internal data and triggers the wps request "einwohner_ermitteln.fmw" for the selected area.
         * @param  {Object} geoJson GeoJSON to get selected area from
         * @fires Addons.populationRequest#handleResponse
         * @fires Core#RadioTriggerWPSRequest
         * @returns {void}
         */
        makeRequest: function (geoJson) {
            this.inhabitantsFHHNum = -1;
            this.inhabitantsMRHNum = -1;
            this.sourceFHH = "nein";
            this.sourceMRH = "nein";
            this.searcharea = 0;
            LoaderOverlay.show();

            WPS.wpsRequest(this.wpsId, this.fmwProcess, {
                "such_flaeche": JSON.stringify(geoJson)
            }, this.handleResponse.bind(this));
        },
        /**
         * Resets the GraphicalSelect
         * @fires Snippets.GraphicalSelect#resetView
         * @returns {void}
         */
        resetView: function () {
            this.$refs.graphicalSelection.resetView();
        },
        /**
         * Called when the wps modules returns a request
         * @param  {String} response the response xml of the wps
         * @param  {Number} status the HTTPStatusCode
         * @returns {void}
         */
        handleResponse: function (response, status) {
            let parsedData = null;

            parsedData = response.ExecuteResponse.ProcessOutputs.Output.Data.ComplexData.einwohner;
            if (status === 200) {
                if (parsedData.ErrorOccured === "yes") {
                    this.handleWPSError(parsedData);
                }
                else {
                    this.handleSuccess(parsedData);
                }
            }
            else {
                this.resetView();
            }

            LoaderOverlay.hide();
        },
        /**
         * Displays Errortext if the WPS returns an Error
         * @param  {String} response received by wps
         * @returns {void}
         */
        handleWPSError: function (response) {
            this.addSingleAlert({
                category: this.translate("additional:modules.tools.populationRequest.errors.errorCategory"),
                content: this.translate("additional:modules.tools.populationRequest.errors.requestException") + JSON.stringify(response.ergebnis),
                displayClass: "error"
            });
        },
        /**
         * Used when statuscode is 200 and wps did not return an error
         * @param  {String} response received by wps
         * @returns {void}
         */
        handleSuccess: function (response) {
            let responseResult = null;

            try {
                responseResult = JSON.parse(response?.ergebnis);
                if (responseResult?.einwohner_fhh) {
                    this.inhabitantsFHHNum = responseResult.einwohner_fhh;
                    this.inhabitantsFHH = thousandsSeparator(responseResult.einwohner_fhh);
                }
                else {
                    this.inhabitantsFHHNum = -1;
                }
                if (responseResult?.einwohner_mrh) {
                    this.inhabitantsMRHNum = responseResult.einwohner_mrh;
                    this.inhabitantsMRH = thousandsSeparator(responseResult.einwohner_mrh);
                }
                else {
                    this.inhabitantsMRHNum = -1;
                }
                if (responseResult?.quelle_fhh) {
                    this.sourceFHH = responseResult.quelle_fhh;
                }
                else {
                    this.sourceFHH = "nein";
                }
                if (responseResult?.quelle_mrh) {
                    this.sourceMRH = responseResult.quelle_mrh;
                }
                else {
                    this.sourceMRH = "nein";
                }
                if (responseResult?.suchflaeche) {
                    this.searchArea = this.chooseUnitAndThousandsSeparator(responseResult.suchflaeche);
                }
                else {
                    this.searchArea = 0;
                }
            }
            catch (e) {
                this.addSingleAlert({
                    category: this.translate("additional:modules.tools.populationRequest.errors.errorCategory"),
                    content: this.translate("additional:modules.tools.populationRequest.errors.requestException") + JSON.stringify(response),
                    displayClass: "error"
                });
                this.resetView();
                (console.error || console.warn).call(console, e.stack || e);
            }
        },
        /**
         * Chooses unit based on value, calls thousandsSeparator and converts to unit and appends unit
         * @param  {Number} value to inspect
         * @param  {Number} maxDecimals decimals are cut after maxlength chars
         * @returns {String} unit
         */
        chooseUnitAndThousandsSeparator: function (value, maxDecimals) {
            let newValue = null,
                result = null;

            if (value < 250000) {
                result = thousandsSeparator(value.toFixed(maxDecimals)) + " m²";
            }
            else if (value < 10000000) {
                newValue = value / 10000.0;
                result = thousandsSeparator(newValue.toFixed(maxDecimals)) + " ha";
            }
            else {
                newValue = value / 1000000.0;
                result = thousandsSeparator(newValue.toFixed(maxDecimals)) + " km²";
            }
            return result;
        },
        /**
         * if the model does not exist, add Model from Parser to ModelList via Radio.trigger
         * @param {String} layerId id of the layer to be toggled
         * @fires Core#RadioRequestModelListGetModelByAttributes
         * @returns {void}
         */
        addModelsByAttributesToModelList: function (layerId) {
            const layerModel = Radio.request("ModelList", "getModelsByAttributes", {id: layerId});

            if (layerModel === undefined || layerModel.length === 0) {
                Radio.trigger("ModelList", "addModelsByAttributes", {id: layerId});
            }
        },
        /**
         * checks whether the model has been loaded.
         * If it is not loaded, a corresponding error message is displayed
         * @param {String} layerId id of the layer to be toggled
         * @param {Boolean} value the new value
         * @param {Object} checkboxComponent the Component that triggered this call
         * @fires Core#RadioRequestModelListGetModelByAttributes
         * @returns {void}
         */
        checkIsModelLoaded: function (layerId, value, checkboxComponent) {
            const layerModel = Radio.request("ModelList", "getModelsByAttributes", {id: layerId});

            if (layerModel === undefined || layerModel.length === 0) {
                if (value) {
                    checkboxComponent.setActive(false);
                }

                this.addSingleAlert({
                    "content": this.translate("additional:modules.tools.populationRequest.errors.layerIdCantBeLoaded", {layerId: layerId})
                });
            }
        },
        /**
         * sets selected and visibility to ModelList via Radio.trigger
         * @param {String} layerId id of the layer to be toggled
         * @param {Boolean} value true | false
         * @fires Core#RadioTriggerModelListSetModelAttributesById
         * @returns {void}
         */
        setModelAttributesByIdToModelList: function (layerId, value) {
            Radio.trigger("ModelList", "setModelAttributesById", layerId, {
                isSelected: value,
                isVisibleInMap: value
            });
        },
        /**
         * Sets the state regarding the RasterLayer
         * @param {Boolean} value flag if Raster is to be set
         * @returns {void}
         */
        triggerRaster (value) {
            const rasterCheckBox = this.$refs.rasterCheckBox,
                layerId = this.rasterLayerId;

            if (rasterCheckBox !== undefined) {
                rasterCheckBox.setActive(value);
            }
            if (value) {
                const scale = this.$store.state.Maps.scale;

                // if the Map has too large Scale give notification and undo the activation
                if (scale > 100000) {
                    if (rasterCheckBox !== undefined) {
                        rasterCheckBox.setActive(false);
                    }

                    this.addSingleAlert({
                        "content": this.translate("additional:modules.tools.populationRequest.errors.reduceScaleForRaster")
                    });
                    return;
                }
            }

            this.setRasterActive(value);

            this.addModelsByAttributesToModelList(layerId);
            if (value) {
                this.checkIsModelLoaded(layerId, value, rasterCheckBox);
            }
            this.setModelAttributesByIdToModelList(layerId, value);
        },
        /**
         * Sets the state regarding the alkisAdresses Layer
         * @param {Boolean} value flag if alkisAdresses is to be set
         * @returns {void}
         */
        triggerAlkisAdresses (value) {
            const alkisAdressesCheckBox = this.$refs.alkisAdressesCheckBox,
                layerId = this.alkisAdressLayerId;

            if (alkisAdressesCheckBox !== undefined) {
                alkisAdressesCheckBox.setActive(value);
            }
            if (value) {
                const scale = this.$store.state.Maps.scale;

                // if the Map has too large Scale give notification and undo the activation
                if (scale > 10000) {
                    if (alkisAdressesCheckBox !== undefined) {
                        alkisAdressesCheckBox.setActive(false);
                    }

                    this.addSingleAlert({
                        "content": this.translate("additional:modules.tools.populationRequest.errors.reduceScaleForAlkisAdresses")
                    });
                    return;
                }
            }

            this.setAlkisAdressesActive(value);

            this.addModelsByAttributesToModelList(layerId);
            if (value) {
                this.checkIsModelLoaded(layerId, value, alkisAdressesCheckBox);
            }
            this.setModelAttributesByIdToModelList(layerId, value);
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = Radio.request("ModelList", "getModelByAttributes", {id: "populationRequest"});

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * translates the given key, checkes if the key exists and throws a console warning if not
         * @param {String} key the key to translate
         * @param {Object} [options=null] for interpolation, formating and plurals
         * @returns {String} the translation or the key itself on error
         */
        translate (key, options = null) {
            if (key === "additional:" + this.$t(key)) {
                console.warn("the key " + JSON.stringify(key) + " is unknown to the additional translation");
            }

            return this.$t(key, options);
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="translate(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        class="population-request"
    >
        <template
            v-if="active"
            #toolBody
        >
            <form class="form-horizontal">
                <div class="mb-3">
                    {{ translate("additional:modules.tools.populationRequest.select.info") }}
                </div>
                <div class="graphicalSelectionContainer row">
                    <div class="dropdown">
                        <GraphicalSelect
                            id="graphicalSelection"
                            ref="graphicalSelection"
                            :select-element="'Dropdown'"
                            :focus-on-creation="true"
                            :label="'additional:modules.tools.populationRequest.select.action'"
                        />
                    </div>
                </div>
                <div>
                    <div
                        v-if="inhabitantsFHHNum > -1 || inhabitantsMRHNum > -1"
                        class="result"
                    >
                        <div class="heading additional-text">
                            {{ translate("additional:modules.tools.populationRequest.result.confidentialityHint") }}:
                        </div>
                        <table class="table">
                            <tr
                                v-if="sourceFHH !== 'nein'"
                            >
                                <td>{{ translate("additional:modules.tools.populationRequest.result.populationFHH") }}:</td>
                                <td
                                    class="inhabitantsFHH"
                                >
                                    {{ inhabitantsFHH }}
                                </td>
                            </tr>
                            <tr
                                v-if="sourceMRH !== 'nein'"
                            >
                                <td>{{ translate("additional:modules.tools.populationRequest.result.populationMRH") }}:</td>
                                <td
                                    class="inhabitantsMRH"
                                >
                                    {{ inhabitantsMRH }}
                                </td>
                            </tr>
                            <tr
                                v-if="searchArea"
                            >
                                <td>{{ translate("additional:modules.tools.populationRequest.result.areaSize") }}:</td>
                                <td
                                    class="searchArea"
                                >
                                    {{ searchArea }}
                                </td>
                            </tr>
                        </table>
                        <div
                            v-if="showFHHHintAndLinktext"
                            class="inhabitantsFHHAddText"
                        >
                            <div class="hinweis additional-text">
                                <span>{{ translate("additional:modules.tools.populationRequest.result.hint") }}:</span>&nbsp;{{ translate("additional:modules.tools.populationRequest.result.confidentialityHintSmallValues") }}
                            </div>
                            <div>
                                <a
                                    target="_blank"
                                    :href="`${metaDataLink}${fhhId}`"
                                >
                                    {{ translate("additional:modules.tools.populationRequest.result.dataSourceFHHLinktext") }}
                                </a>
                            </div>
                        </div>
                        <div
                            v-if="showMRHHintAndLinktext"
                            class="inhabitantsMRHAddText"
                        >
                            <div
                                class="hinweis additional-text"
                            >
                                <div>
                                    <span>{{ translate("additional:modules.tools.populationRequest.result.hint") }}:</span>
                                    <span
                                        v-if="showMRHSourceAreaOutsideHint"
                                    >
                                        {{ translate("additional:modules.tools.populationRequest.result.sourceAreaOutside") }}
                                    </span>
                                </div>
                                <span>{{ translate("additional:modules.tools.populationRequest.result.dataSourceMRHKey") }}:</span>&nbsp;{{ translate("additional:modules.tools.populationRequest.result.dataSourceMRHValue") }}
                            </div>
                            <div>
                                <a
                                    target="_blank"
                                    :href="`${metaDataLink}${mrhId}`"
                                >
                                    {{ translate("additional:modules.tools.populationRequest.result.dataSourceMRHLinktext") }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div
                v-if="isDefaultStyle"
            >
                <hr>
                <div class="checkbox">
                    <div class="checkbox-container">
                        <div class="form-inline">
                            <div class="title-checkbox pull-left">
                                <label
                                    for="rasterCheckBoxPopRE"
                                    role="button"
                                    tabindex="0"
                                    @click="triggerRaster(!rasterActive)"
                                    @keydown.enter="triggerRaster(!rasterActive)"
                                >{{ translate("additional:modules.tools.populationRequest.select.showRasterLayer") }}</label>
                                <ToggleCheckbox
                                    id="rasterCheckBoxPopRE"
                                    ref="rasterCheckBox"
                                    :default-state="isRasterVisibleInMap"
                                    :title="translate('additional:modules.tools.populationRequest.switchOffFilter')"
                                    :text-on="translate('common:snippets.checkbox.on')"
                                    :text-off="translate('common:snippets.checkbox.off')"
                                    @change="triggerRaster"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="checkbox-container">
                        <div class="form-inline">
                            <div class="title-checkbox pull-left">
                                <label
                                    for="alkisAdressesCheckBoxPopRe"
                                    role="button"
                                    tabindex="0"
                                    @click="triggerAlkisAdresses(!alkisAdressesActive)"
                                    @keydown.enter="triggerAlkisAdresses(!alkisAdressesActive)"
                                >
                                    {{ translate("additional:modules.tools.populationRequest.select.showAlkisAdresses") }}
                                </label>
                                <ToggleCheckbox
                                    id="alkisAdressesCheckBoxPopRe"
                                    ref="alkisAdressesCheckBox"
                                    :default-state="isAlkisAdressesVisibleInMap"
                                    :title="translate('additional:modules.tools.populationRequest.switchOffFilter')"
                                    :text-on="translate('common:snippets.checkbox.on')"
                                    :text-off="translate('common:snippets.checkbox.off')"
                                    @change="triggerAlkisAdresses"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
.population-request {
    max-width: 500px;

    .form-horizontal {
        & > * {
            padding-right: 15px;
            padding-left: 15px;
        }

        .graphicalSelectionContainer {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .result {
            margin-top: 10px;

            .table {
                margin-bottom: 20px;

                td {
                    padding: 8px;
                    border-top: 1px solid #ddd;
                }

                & > :not(:first-child) {
                    // NOTE: Overwrites default style of .table
                    border-top: 0 solid currentColor;
                }
            }
        }
    }

    .checkbox-container {
        .form-inline {
            font-size: 15px;

            @media (max-width: 767px) {
                font-size: 12px;
            }

            .title-checkbox {
                width: 100%;

                label {
                    white-space: normal;
                    padding-left:5px;
                }
            }
        }
    }
}
</style>

<style lang="scss">
@import "~/css/mixins.scss";
@import "~variables";

#tooltip-overlay {
    position: relative;
    background: $accent_active;
    color: $white;
    max-width: 200px;
    padding: 4px 8px;
}

#circle-overlay {
    position: relative;
    top: -20px;
    background: $accent_active;
    color: $white;
    max-width: 70px;
    padding: 4px 8px;
}
</style>
