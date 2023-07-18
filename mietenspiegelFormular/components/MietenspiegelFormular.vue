<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersMietenspiegelFormular";
import mutations from "../store/mutationsMietenspiegelFormular";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {getFeatureGET} from "../../../src/api/wfs/getFeature";
import {WFS} from "ol/format.js";
import {onSearchbar} from "../utils/radioBridge.js";
import {requestGfi} from "../../../src/api/wmsGetFeatureInfo";
import isObject from "../../../src/utils/isObject";
import dayjs from "dayjs";

export default {
    name: "MietenspiegelFormular",
    components: {
        ToolTemplate
    },
    data () {
        return {
            residentialInformation: {},
            errorMessage: "",
            formKeys: [],
            METADATA: [],
            calculationData: {},
            buildingAgeClass: "",
            livingSpace: "",
            rangeMin: "",
            rangeMax: "",
            averageValue: ""
        };
    },
    computed: {
        ...mapGetters("Tools/MietenspiegelFormular", Object.keys(getters)),
        ...mapGetters("Maps", ["clickCoordinate", "projection", "getLayerById", "resolution", "getView"])
    },
    watch: {
        residentialInformation: {
            handler () {
                if (!this.active) {
                    this.setActive(true);
                }
            },
            deep: true
        },
        buildingAgeClass (newVal) {
            if (newVal && this.livingSpace) {
                this.setRentPrice(this.getRentPrice(newVal, this.livingSpace, this.calculationData));
            }
        },
        livingSpace (newVal) {
            if (newVal && this.buildingAgeClass) {
                this.setRentPrice(this.getRentPrice(this.buildingAgeClass, newVal, this.calculationData));
            }
        },
        clickCoordinate (coord) {
            this.residentialInformationByCoordinate(coord, this.rentIndexLayerId, this.resolution);
            this.reset();
        }
    },
    async created () {
        this.METADATA = await this.getFeatureProperties();
        this.calculationData = await this.getCalculationData();
        this.formKeys = this.getFormKeys(this.METADATA?.merkmaletext);
        this.modifyMietenspiegelData(this.calculationData);

        this.$on("close", this.close);
        this.onSearchbar(result => {
            const resolutions = [...this.getView.getResolutions()].sort();

            this.setActive(true);
            this.residentialInformationByCoordinate(result?.coordinate, this.rentIndexLayerId, resolutions[0]);
        });

        if (typeof this.collectionStatus === "undefined") {
            this.setCollectionStatus(this.convertDateFormat(this.METADATA?.erhebungsstand));
        }

        this.noticeText = this.getNoticeText(this.noticePdf, this.METADATA?.hinweis);
    },
    methods: {
        ...mapMutations("Tools/MietenspiegelFormular", Object.keys(mutations)),
        ...mapActions("MapMarker", ["placingPointMarker", "removePointMarker"]),
        onSearchbar,
        requestGfi,

        /**
         * Returns the min, max and middle value price for the rent from calculation data with given attributes.
         * @param {String} buildingAgeClass - the buildingAgeClass attribute to looking for in calculationData.
         * @param {String} livingSpace - the livingSpace attribute to looking for in calculationData.
         * @param {Object[]} calculationData - The calculated data array.
         * @returns {Object} - The Object with min, max and middle value for the rent price.
         */
        getRentPrice (buildingAgeClass, livingSpace, calculationData) {
            const result = {};

            if (!Array.isArray(calculationData) || !calculationData.length || typeof buildingAgeClass !== "string" || typeof livingSpace !== "string") {
                return result;
            }

            for (let i = 0; i < calculationData?.length; i++) {
                if (Object.prototype.hasOwnProperty.call(calculationData[i], "Baualtersklasse/Bezugsfertigkeit") &&
                    Object.prototype.hasOwnProperty.call(calculationData[i], "Wohnfläche") &&
                    calculationData[i]["Baualtersklasse/Bezugsfertigkeit"] === buildingAgeClass &&
                    calculationData[i]["Wohnfläche"] === livingSpace) {
                    result.rangeMin = calculationData[i].spanne_min;
                    result.rangeMax = calculationData[i].spanne_max;
                    result.averageValue = calculationData[i].mittelwert;
                    break;
                }
            }

            return result;
        },

        /**
         * Sets the rent price.
         * @param {Object} calculatedRent - Object with min, max and middle value for the rent.
         * @returns {void}
         */
        setRentPrice (calculatedRent) {
            this.rangeMin = "";
            this.rangeMax = "";
            this.averageValue = "";

            if (typeof calculatedRent?.rangeMin !== "undefined" && calculatedRent?.rangeMax !== "undefined" && calculatedRent?.averageValue !== "undefined") {
                this.rangeMin = calculatedRent.rangeMin;
                this.rangeMax = calculatedRent.rangeMax;
                this.averageValue = calculatedRent.averageValue;
            }
        },

        /**
         * Resets the rent price and drop down.
         * @returns {void}
         */
        reset () {
            this.buildingAgeClass = "";
            this.livingSpace = "";
            this.rangeMin = "";
            this.rangeMax = "";
            this.averageValue = "";
        },

        /**
         * Closing the tool and sets the error message default.
         * @returns {void}
         */
        close () {
            this.errorMessage = "";
            this.setActive(false);
        },

        /**
         * Gets the properties of a feature from a layer.
         * @param {Number} index - The index of the feature.
         * @return {Object} The feature properties.
         */
        async getFeatureProperties (index = 0) {
            const metaDataFeature = await this.getFeaturesByLayerId(this.layerIdMetadata);

            return metaDataFeature[index].getProperties();
        },
        /**
         * Gets the properties of features from a layer.
         * @return {Object} The feature properties.
         */
        async getCalculationData () {
            const calculationDataFeatures = [],
                dataFeatures = await this.getFeaturesByLayerId(this.layerIdCalculation);

            dataFeatures.forEach(feat => {
                calculationDataFeatures.push(feat?.getProperties());
            });

            return calculationDataFeatures;
        },
        /**
         * Gets the features from a layer.
         * @param {Number} layerId - The layer Id of the feature.
         * @return {Object|Boolean} The feature properties.
         */
        async getFeaturesByLayerId (layerId) {
            if (typeof layerId !== "string") {
                return false;
            }
            const rawLayer = rawLayerList.getLayerWhere({id: layerId}),
                response = await getFeatureGET(rawLayer.url, {version: rawLayer.version, featureType: rawLayer.featureType}),
                wfsReader = new WFS({version: rawLayer.version}),
                features = wfsReader.readFeatures(response);

            return features;
        },

        /**
         * Gets the featureInfoUrl for given coordinate.
         * @param {Number[]} coordinate The coordinate.
         * @param {ol/Layer} layer The layer.
         * @param {String} crsCode The crs code.
         * @param {Number} resolution The resolution.
         * @returns {String|null} The url info string.
         */
        getFeatureInfoUrlByLayer (coordinate, layer, crsCode, resolution) {
            if (!Array.isArray(coordinate) || !coordinate.length || !isObject(layer) || typeof crsCode !== "string") {
                return null;
            }
            return layer.getSource().getFeatureInfoUrl(coordinate, resolution, crsCode, {INFO_FORMAT: "text/xml"});
        },
        /**
         * Gets the residential informations.
         * @param {String} url The url to use.
         * @param {ol/Layer} layer The layer to get the infos from.
         * @param {Function} onsuccess Function to call on success.
         * @param {Function} onerror Function to call on error. Passes an translation key.
         * @returns {Boolean} false if an error occured.
         */
        getResidentialInformation (url, layer, onsuccess, onerror) {
            if (typeof url !== "string") {
                if (typeof onerror === "function") {
                    onerror("additional:modules.tools.mietenspiegelFormular.errorMessages.noUrl");
                }
                return false;
            }
            this.requestGfi("text/xml", url, layer).then(response => {
                if (!Array.isArray(response) || !isObject(response[0])) {
                    if (typeof onerror === "function") {
                        onerror("additional:modules.tools.mietenspiegelFormular.errorMessages.noDataFound");
                    }
                    return;
                }
                if (typeof onsuccess === "function") {
                    onsuccess(response[0].getProperties());
                }
            });
            return true;
        },
        /**
         * Sets the residential informations for given coordinate.
         * @param {Number[]} coordinate - The coordinate.
         * @param {String} layerId - The id of the layer.
         * @param {Number} resolution - The resolution.
         * @return {Boolean} - Return false if layerId is not a string.
         */
        residentialInformationByCoordinate (coordinate, layerId, resolution) {
            if (typeof layerId !== "string") {
                return false;
            }
            const layer = this.getLayerById({layerId: layerId, searchInGroupLayers: false}),
                url = this.getFeatureInfoUrlByLayer(coordinate, layer, this.projection.getCode(), resolution);

            this.getResidentialInformation(url, layer, residentialInformation => {
                this.errorMessage = "";
                this.residentialInformation = residentialInformation;
                this.placingPointMarker(coordinate);
            }, error => {
                this.errorMessage = error;
                this.removePointMarker();
            });
            return true;
        },
        /**
         * Gets the property names from Metadata.
         * @param {String} keys - The property names in one string.
         * @return {Array|Boolean} - Return Array with key names.
         */
        getFormKeys (keys) {
            if (typeof keys !== "string") {
                return false;
            }
            const dataString = keys.split("|"),
                index = dataString.indexOf("Wohnlage");

            if (index !== -1) {
                dataString[index] = "Kategorie";
            }
            return dataString;
        },
        /**
        * Get key value pairs from metadata string
        * @param {Array} calc - The feature properties.
        * @return {Array|Boolean} - The Object with new key values.
        */
        modifyMietenspiegelData (calc) {
            if (!Array.isArray(calc)) {
                return false;
            }
            calc.forEach((data) => {
                const newKeys = data.merkmale?.split("|");

                if (Array.isArray(newKeys)) {
                    for (let i = 0; i < newKeys?.length; i++) {
                        data[this.formKeys[i]] = newKeys[i];
                    }
                }
            });
            return calc;
        },
        /**
         * Returns unique values for drop down.
         * @param {String} attr - The name of the property which is filtering.
         * @param {Array} calculationData - The feature properties.
         * @return {Array|Boolean} - The unique values.
         */
        getUniqueValuesByAttributes (attr, calculationData) {
            if (typeof attr !== "string") {
                return false;
            }
            const filtered = [];

            if (Array.isArray(calculationData)) {
                for (let i = 0; i < calculationData?.length; i++) {
                    if (filtered.indexOf(calculationData[i][attr]) === -1) {
                        filtered.push(calculationData[i][attr]);
                    }
                }
            }
            return filtered;
        },
        /**
         * Converts the date format from "YYYY-MM-DD" to "DD.MM.YYYY"
         * @param {String} date - The date with other format.
         * @return {String|Boolean} - The correct time format.
         */
        convertDateFormat (date) {
            if (typeof date !== "string") {
                return false;
            }
            const dateFormat = dayjs(date).format("DD.MM.YYYY");

            return dateFormat;
        },
        /**
         * Gets the notice text
         * @param {Object} noticePdf - The noticePdf from configuration.
         * @param {String} metaNotice - The notice text from metadata.
         * @return {String} - The notice text.
         */
        getNoticeText (noticePdf, metaNotice) {
            if (isObject(noticePdf) && typeof noticePdf.text === "string" && typeof noticePdf.link === "string") {
                return i18next.t("additional:modules.tools.mietenspiegelFormular.noticeText", {text: noticePdf.text, link: noticePdf.link, interpolation: {escapeValue: false}});
            }

            return metaNotice;
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
    >
        <template
            v-if="active"
            #toolBody
        >
            <div class="mietenspiegel-formular">
                <div
                    v-if="errorMessage"
                    class="alert alert-warning"
                    role="alert"
                >
                    {{ $t(errorMessage) }}
                </div>
                <div
                    v-else
                >
                    <form>
                        <div class="mt-0 mb-3">
                            <label
                                for="street"
                                class="form-label mb-0 py-0"
                            >{{ $t('additional:modules.tools.mietenspiegelFormular.street') }}</label>
                            <input
                                id="street"
                                type="text"
                                readonly
                                class="form-control-plaintext py-0"
                                :value="`${residentialInformation.strasse + ' ' + residentialInformation.hausnummer + ' ' + (residentialInformation.hausnummer_zusatz !== undefined ? residentialInformation.hausnummer_zusatz : '')}`"
                            >
                        </div>
                        <div class="my-3">
                            <label
                                for="district"
                                class="form-label mb-0 py-0"
                            >{{ $t('additional:modules.tools.mietenspiegelFormular.cityDistrict') }}</label>
                            <input
                                id="district"
                                type="text"
                                readonly
                                class="form-control-plaintext py-0"
                                :value="`${residentialInformation.stadtteil}`"
                            >
                        </div>
                        <div class="my-3">
                            <label
                                for="kategorie"
                                class="form-label mb-0 py-0"
                            >{{ formKeys[2] }} </label>
                            <input
                                id="kategorie"
                                type="text"
                                readonly
                                class="form-control-plaintext py-0"
                                :value="`${residentialInformation.bezeichnung}`"
                            >
                        </div>
                        <div class="mb-3">
                            <label
                                for="ausstattung"
                                class="form-label mb-0 py-0"
                            >{{ formKeys[1] }} </label>
                            <input
                                id="ausstattung"
                                type="text"
                                readonly
                                class="form-control-plaintext py-0"
                                :value="`${calculationData[0]?.Ausstattung}`"
                            >
                        </div>
                        <div class="my-3">
                            <label
                                for="mietenspiegel-baualterklasse-select"
                                class="form-label mb-0 py-0"
                            >
                                {{ formKeys[0] }}
                            </label>
                            <select
                                id="mietenspiegel-baualtersklasse-select"
                                v-model="buildingAgeClass"
                                class="select-baualtersklasse form-select select-style"
                            >
                                <option
                                    value=""
                                    disabled
                                    selected
                                >
                                    {{ $t('additional:modules.tools.mietenspiegelFormular.pleaseSelect') }}
                                </option>
                                <option
                                    v-for="(data, key) in getUniqueValuesByAttributes('Baualtersklasse/Bezugsfertigkeit', calculationData)"
                                    :key="key"
                                    :value="data"
                                >
                                    {{ data }}
                                </option>
                            </select>
                        </div>
                        <div class="my-3">
                            <label
                                for="mietenspiegel-wohnflaeche-select"
                                class="form-label mb-0 py-0"
                            >
                                {{ formKeys[3] }}
                            </label>
                            <select
                                id="mietenspiegel-wohnflaeche-select"
                                v-model="livingSpace"
                                class="select-wohnflaeche form-select select-style"
                            >
                                <option
                                    value=""
                                    disabled
                                    selected
                                >
                                    {{ $t('additional:modules.tools.mietenspiegelFormular.pleaseSelect') }}
                                </option>
                                <option
                                    v-for="(data, key) in getUniqueValuesByAttributes('Wohnfläche', calculationData)"
                                    :key="key"
                                    :value="data"
                                >
                                    {{ data }}
                                </option>
                            </select>
                        </div>
                        <div
                            class="notes border-top p-2 position-absolute"
                        >
                            <div class="calculated-rent border-bottom">
                                <div
                                    class="def-text calculated-rentprice-title"
                                >
                                    {{ $t('additional:modules.tools.mietenspiegelFormular.rentPriceTitle') }}
                                </div>
                                <div>
                                    <span class="def-text">
                                        {{ $t('additional:modules.tools.mietenspiegelFormular.middle') }}
                                    </span>
                                    <span v-if="averageValue">
                                        {{ averageValue }}
                                    </span>
                                    <span v-else>
                                        ---
                                    </span>
                                </div>
                                <div>
                                    <span class="def-text">
                                        {{ $t('additional:modules.tools.mietenspiegelFormular.min') }}
                                    </span>
                                    <span v-if="rangeMin">
                                        {{ rangeMin }}
                                    </span>
                                    <span v-else>
                                        ---
                                    </span>
                                </div>
                                <div>
                                    <span class="def-text">
                                        {{ $t('additional:modules.tools.mietenspiegelFormular.max') }}
                                    </span>
                                    <span v-if="rangeMax">
                                        {{ rangeMax }}
                                    </span>
                                    <span v-else>
                                        ---
                                    </span>
                                </div>
                            </div>
                            <div class="mt-3 def-text">
                                {{ $t('additional:modules.tools.mietenspiegelFormular.editor') }}
                            </div>
                            <div>
                                {{ METADATA?.herausgeber }}
                            </div>
                            <div class="def-text">
                                {{ $t('additional:modules.tools.mietenspiegelFormular.collectionStatus') }}
                            </div>
                            <div>
                                {{ collectionStatus }}
                            </div>
                            <div class="def-text">
                                {{ $t('additional:modules.tools.mietenspiegelFormular.notice') }}
                            </div>
                            <div
                                class="mb-3"
                                v-html="noticeText"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss">
input[readonly], .select-style {
  font-size: 14px;
}

.form-label, .def-text {
    font-weight: bold;
    &.calculated-rentprice-title {
        margin: 0 0 12px 0;
    }
}
.calculated-rent {
    height: 112px;
}
</style>
