<script>
import {Fill, Stroke, Style} from "ol/style";
import {getCenter as getCenterOfExtent} from "ol/extent";
import {getComponent} from "../../../src/utils/getComponent";
import getters from "../store/gettersValuationPrint";
import Feature from "ol/Feature";
import {mapActions, mapGetters, mapMutations} from "vuex";
import mutations from "../store/mutationsValuationPrint";
import {Select} from "ol/interaction";
import {singleClick} from "ol/events/condition";
import ModalItem from "../../../src/share-components/modals/components/ModalItem.vue";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {unionFeatures} from "../utils/unionFeatures";
import {createKnowledgeBase} from "../utils/createKnowledgeBase.js";
import {createMapfishDialog} from "../utils/createMapfishDialog.js";
import {startPrintProcess} from "../utils/startPrintProcess.js";
import axios from "axios";
import isObject from "../../../src/utils/isObject";
import dayjs from "dayjs";
import upperFirst from "../../../src/utils/upperFirst";
import {collectFeatures} from "../utils/collectFeatures";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";

export default {
    name: "ValuationPrint",
    components: {
        ToolTemplate,
        ModalItem
    },
    data () {
        return {
            selectedFeatures: [],
            parcelData: null,
            messageList: [],
            printedFeature: [],
            urlList: [],
            addressList: [],
            showDownloadAll: false,
            showModal: false,
            chosenType: "Gutachten",
            errors: {
                address: false,
                documentNumber: false
            },
            specificAddress: "",
            documentNumber: "",
            autofill: false
        };
    },
    computed: {
        ...mapGetters("Tools/ValuationPrint", Object.keys(getters)),
        ...mapGetters("Maps", ["projection"]),
        ...mapGetters(["getRestServiceById"])
    },
    watch: {
        /**
         * Activates the select interaction if the tool is active, ohterwise it is deactivated.
         * @param {Boolean} newValue - If the tool is active or not.
         * @returns {void}
         */
        active (newValue) {
            this.select.setActive(newValue);
        },

        /**
         * Starts process for the valuation.
         * @param {Object} parcel - The parcel data.
         * @param {Number[]} parcel.center - The parcel center.
         * @param {ol/extent} parcel.extent - The extent of the parcel.
         * @param {ol/Feature} parcel.feature - The ol feature of the parcel.
         * @param {ol/geom/Polygon} parcel.geometry - The geometry of the parcel.
         * @returns {void}
         */
        parcelData (parcel) {
            if (!isObject(this.config?.services)) {
                console.error("No config found for services");
                return;
            }
            else if (!isObject(this.config?.transformer)) {
                console.error("No config found for transformer");
                return;
            }

            createKnowledgeBase(parcel, this.config.services, this.projection.getCode(), message => {
                this.showDownloadAll = false;
                this.addMessage(message, false);
            }, knowledgeBase => {
                const mapfishDialog = createMapfishDialog(
                    parcel,
                    knowledgeBase,
                    this.config.transformer,
                    this.defaultValue,
                    this.projection.getCode(),
                    this.getFilenameOfPDF(this.fileprefix, dayjs().format("YYYY-MM-DD"))
                );

                setTimeout(() => {
                    startPrintProcess(this.printUrl, "pdf", this.pdfAppId, mapfishDialog, (url, payload) => {
                        this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfInTheMaking"));
                        return axios.post(url, payload);
                    },
                    () => {
                        this.addMessage(this.$t("additional:modules.tools.valuationPrint.pleaseWait"));
                    },
                    error => {
                        this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfError"), true);
                        console.error(error);
                        this.startSpecificationProcess();
                    },
                    url => {
                        this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfSuccess"));
                        this.addUrl(url, this.$t("additional:modules.tools.valuationPrint.report"));
                        this.startSpecificationProcess();
                    });
                }, 0);
            }, errorMsg => {
                this.addMessage(errorMsg, true);
            }, error => {
                console.error(error);
            });
        },
        /**
         * In case of an input the error flag for the document number is set to false.
         * @param {Boolean} newValue The new input value.
         * @returns {void}
         */
        documentNumber (newValue) {
            if (newValue.length) {
                this.errors.documentNumber = false;
            }
        },
        /**
         * If the input text is not empty, sets the autofill flag true and vice versa.
         * @param {String} val The value of specificAddress
         * @returns {void}
         */
        specificAddress (val) {
            if (val !== "") {
                this.autofill = true;
            }
            else {
                this.autofill = false;
            }
        }
    },
    created () {
        this.config = null;
        this.select = null;
        this.printUrl = "";
        this.pdfAppId = "";
        this.imageAppId = "";
        this.defaultValue = "";
        this.fileprefix = "";
        this.printType = ["Gutachten", "Wertbeurteilung"];

        this.setConfig();
        this.setSelectInteraction();
        this.selectedFeatures = this.select.getFeatures().getArray();

        this.$on("close", () => {
            this.setActive(false);
            // The value "isActive" of the Backbone model is also set to false to change the CSS class in the menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }

            this.showPrintModal(false, []);
        });
    },
    methods: {
        ...mapMutations("Tools/ValuationPrint", Object.keys(mutations)),
        ...mapActions("Maps", ["addInteraction"]),
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Removes the passed feature from the collection where the select interaction will place the selected features.
         * @param {ol/Feature} feature - The feature to be removed.
         * @returns {void}
         */
        removeFeature (feature) {
            if (feature instanceof Feature) {
                this.select.getFeatures().remove(feature);
            }
        },

        /**
         * Gets the config for the valuation and sets it.
         * In addition, the print url is set from the config.
         * @param {Function} onsuccess - Is called when the config is set.
         * @returns {void}
         */
        setConfig () {
            axios.get("config.valuation.json", {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    this.config = response.data;
                    this.printUrl = this.getRestServiceById(response.data.settings.printServiceId).url;
                    this.pdfAppId = response.data.settings.pdfAppId;
                    this.imageAppId = response.data.settings.imageAppId;
                    this.pdfSpecificationAppId = response.data.settings.pdfSpecificationAppId;
                    this.defaultValue = response.data.settings.defaultValue;
                    this.fileprefix = response.data.settings.fileprefix;
                })
                .catch(() => {
                    const message = "Could not load the config file config.valuation.json";

                    this.addMessage(message, true);
                    this.addSingleAlert({
                        category: "error",
                        content: message,
                        displayClass: "error"
                    });
                });
        },

        /**
         * Sets the select interaction (non-reactive state), adds it a "change:active" listener and adds it to the map.
         * @returns {void}
         */
        setSelectInteraction () {
            this.select = new Select({
                layers: (layer) => layer.get("id") === this.parcelLayerId,
                style: new Style({
                    fill: new Fill({
                        color: "rgba(255,255,255,0)"
                    }),
                    stroke: new Stroke({
                        color: "#de2d26",
                        width: 5
                    })
                }),
                addCondition: singleClick,
                removeCondition: singleClick
            });

            this.select.on("change:active", this.styleSelectedFeatures);
            this.addInteraction(this.select);
        },
        /**
         * Shows the print modal and saves the feature for print window
         * @param {Boolean} val - true or false to decide if open or close the print window
         * @param {ol/Feature[]} featureList - the selected feature(s) for the print window
         * @returns {void}
         */
        showPrintModal (val, featureList) {
            this.showModal = val;
            this.printedFeature = featureList;

            if (this.showModal && Array.isArray(this.addressList)) {
                if (this.addressList.length === 1) {
                    this.specificAddress = this.addressList[0];
                    this.$refs.addressInput.value = this.specificAddress;
                    return;
                }
                this.specificAddress = "";
                this.$refs.addressInput.value = "";
            }
            if (!this.showModal) {
                this.errors.address = false;
                this.errors.documentNumber = false;
            }
        },
        /**
         * Gets the required attributes from the feature(s) and sets it.
         * @param {ol/Feature[]} featureList - An array of features.
         * @returns {void}
         */
        setParcelData (featureList) {
            if (!this.formValidation()) {
                return;
            }
            if (!Array.isArray(featureList) || !featureList.length) {
                console.error(`startValuation: ${featureList} has to be a non empty array`);
                return;
            }
            const feature = featureList.length > 1 ? unionFeatures(featureList) : featureList[0],
                extent = feature.getGeometry().getExtent();

            this.messageList = [];
            this.urlList = [];
            this.parcelData = {
                center: getCenterOfExtent(extent),
                extent,
                feature,
                featureList,
                geometry: feature.getGeometry()
            };

            this.showPrintModal(false, []);
        },
        /**
         * Gets the address(es) from server according to the config
         * @param {Boolean} val - true or false to decide if open or close the print window
         * @param {ol/Feature[]} featureList - the selected feature(s) for the print window
         * @returns {void}
         */
        getAddress (val, featureList) {
            const feature = featureList.length > 1 ? unionFeatures(featureList) : featureList[0],
                config = this.config?.services?.hh_wfs_dog;

            collectFeatures(
                {
                    geometry: feature.getGeometry()
                },
                config,
                this.projection.getCode(),
                rawLayerList.getLayerWhere({id: config?.layerId}),
                features => {
                    const addr = [];

                    features.forEach(feat => {
                        if (typeof feat?.get !== "function") {
                            return;
                        }
                        let address = feat.get("strassenname");

                        if (typeof feat.get("hausnummer") !== "undefined") {
                            address += " " + feat.get("hausnummer");
                        }

                        if (typeof feat.get("hausnummernzusatz") !== "undefined") {
                            address += feat.get("hausnummernzusatz");
                        }
                        addr.push(address);
                    });
                    this.addressList = addr.sort((a, b) => {
                        if (a < b) {
                            return -1;
                        }
                        else if (a > b) {
                            return 1;
                        }
                        return 0;
                    });
                    this.showPrintModal(val, featureList);
                },
                error => console.warn(error)
            );
        },

        /**
         * Starts the process for the images to print.
         * @param {Number} [idx=0] - The index.
         * @returns {void}
         */
        startImageProcess (idx = 0) {
            const imageName = Object.keys(this.config.images[idx])[0],
                mapfishDialog = createMapfishDialog(
                    this.parcelData,
                    {},
                    this.config.images[idx],
                    this.defaultValue,
                    this.projection.getCode(),
                    this.getFilenameOfPDF(imageName, dayjs().format("YYYY-MM-DD"))
                );

            mapfishDialog.attributes.map = mapfishDialog.attributes[imageName + ".map"];
            delete mapfishDialog.attributes[imageName + ".map"];

            setTimeout(()=> {
                startPrintProcess(this.printUrl, "png", this.imageAppId, mapfishDialog, (url, payload) => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.imageInTheMaking", {imageName: upperFirst(imageName)}), false);
                    return axios.post(url, payload);
                },
                () => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.pleaseWait"), false);
                },
                (error) => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.imageError", {imageName: upperFirst(imageName)}), true);
                    console.error(error);
                    if (this.config.images[idx + 1]) {
                        this.startImageProcess(idx + 1);
                    }
                },
                (url) => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.imageSuccess", {imageName: upperFirst(imageName)}), false);
                    this.addUrl(url, upperFirst(imageName));
                    if (this.config.images[idx + 1]) {
                        this.startImageProcess(idx + 1);
                        return;
                    }
                    this.showDownloadAll = true;
                });
            }, 0);
        },

        /**
         * Starts the process for the specification to print.
         * @returns {void}
         */
        startSpecificationProcess () {
            if (this.specificAddress === "" && this.addressList.length === 1) {
                this.specificAddress = this.addressList[0];
            }

            const mapfishDialog = createMapfishDialog(
                    this.parcelData,
                    {},
                    this.config.specification,
                    this.defaultValue,
                    this.projection.getCode(),
                    this.getFilenameOfPDF(this.$t("additional:modules.tools.valuationPrint.specificationReport"), dayjs().format("YYYY-MM-DD"))
                ),
                replacedparcelData = {
                    "angabenZumGrundstueck.geschaeftszeichen": this.documentNumber.trim(),
                    "angabenZumGrundstueck.strasse": this.specificAddress.trim(),
                    "angabenZumGrundstueck.art": this.chosenType.trim()
                };

            Object.entries(replacedparcelData).forEach(([key, value]) => {
                mapfishDialog.attributes[key] = value;
            });

            setTimeout(()=> {
                startPrintProcess(this.printUrl, "pdf", this.pdfSpecificationAppId, mapfishDialog, (url, payload) => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfInTheMaking"));
                    return axios.post(url, payload);
                },
                () => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.pleaseWait"));
                },
                error => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfError"), true);
                    console.error(error);
                    this.startImageProcess();
                },
                (url) => {
                    this.addMessage(this.$t("additional:modules.tools.valuationPrint.pdfSuccess"));
                    this.addUrl(url, this.$t("additional:modules.tools.valuationPrint.modalTitle"));
                    this.startImageProcess();
                });
            }, 0);
        },
        /**
         * Sets the style of the selected features depending on the activity of the select interaction.
         * If the interaction is active, all existing featurers are styled using the select interaction style.
         * If it is not, the layer style is used.
         * @param {ol/Object.ObjectEvent} evt - OpenLayers Object Event.
         * @param {String} evt.key - The name of the property whose value is changing.
         * @param {ol/interaction/Select} evt.target - The event target. In this case the select interaction.
         * @returns {void}
         */
        styleSelectedFeatures ({key, target}) {
            const features = target.getFeatures();

            if (target.get(key)) {
                features.forEach(feature => {
                    feature.setStyle(target.getStyle());
                });
            }
            else {
                features.forEach(feature => {
                    feature.setStyle(false);
                });
            }
        },

        /**
         * Adds a new message to the GUI log.
         * @param {String} message The message to add.
         * @param {Boolean} [isError=false] A flag to indicate if this is an error.
         * @returns {void}
         */
        addMessage (message, isError = false) {
            this.messageList.unshift({message, isError});
        },

        /**
         * Adds another url to the url list for downloding pdf and images.
         * @param {String} url - The url.
         * @param {String} name - The name to display.
         * @returns {void}
         */
        addUrl (url, name) {
            this.urlList.push({
                link: url,
                name: name ? name : url
            });
        },

        /**
         * Returns the filename of the pdf with timestamp.
         * @param {String} [fileprefix=""] The prefix to use for the filename.
         * @param {String} [timestamp=""] A timestamp to use for better ui.
         * @returns {String} The current filname.
         */
        getFilenameOfPDF (fileprefix = "", timestamp = "") {
            return timestamp + " " + fileprefix;
        },

        /**
         * Opens all the Urls in window for downloading
         * @param {Object[]} urlList The list of url objects in Array
         * @returns {void}
         */
        openUrls (urlList) {
            if (!Array.isArray(urlList) || !urlList.length) {
                return;
            }
            urlList.forEach(url => {
                if (url?.link) {
                    window.open(url.link);
                }
            });
        },
        /**
         * Sets the specific address
         * @param {Event} evt input event
         * @returns {void}
         */
        setSpecificAddress (evt) {
            if (typeof evt?.target?.value !== "string") {
                return;
            }
            this.errors.address = false;
            this.specificAddress = evt.target.value;
        },
        /**
         * Validates the form and sets the error flags in the errors object.
         * @returns {Boolean} true if form is valid, false if not.
         */
        formValidation () {
            let isValid = true;

            if (!this.documentNumber || this.documentNumber.trim() === "") {
                this.errors.documentNumber = true;
                isValid = false;
                this.documentNumber = "";
            }
            if (!this.specificAddress || this.specificAddress.trim() === "") {
                this.errors.address = true;
                isValid = false;
                if (isObject(this.$refs.addressInput) && Object.prototype.hasOwnProperty.call(this.$refs.addressInput, "value")) {
                    this.$refs.addressInput.value = "";
                }
            }
            return isValid;
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
            <div class="valuation-print">
                <div
                    v-if="selectedFeatures.length > 0"
                    class="card"
                >
                    <div class="card-header">
                        {{ $t('additional:modules.tools.valuationPrint.parcelListTitle') }}
                    </div>
                    <div class="card-body">
                        <div class="card-text">
                            <div
                                v-for="feature in selectedFeatures"
                                :key="feature.get('flstnrzae')"
                            >
                                <ul class="list-inline">
                                    <li class="list-inline-item">
                                        {{ $t('additional:modules.tools.valuationPrint.parcel') }}
                                    </li>
                                    <li class="list-inline-item">
                                        {{ feature.get("flstnrzae") }}
                                    </li>
                                    <li class="list-inline-item">
                                        {{ $t('additional:modules.tools.valuationPrint.district') }}
                                    </li>
                                    <li class="list-inline-item">
                                        {{ feature.get("gemarkung") }}
                                    </li>
                                </ul>
                                <div>
                                    <button
                                        type="button"
                                        class="confirm btn btn-primary btn-sm start-button"
                                        @click="getAddress(true, [feature])"
                                    >
                                        {{ $t('additional:modules.tools.valuationPrint.startButton') }}
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm"
                                        @click="removeFeature(feature)"
                                    >
                                        {{ $t('additional:modules.tools.valuationPrint.removeButton') }}
                                    </button>
                                </div>
                                <hr v-if="selectedFeatures.length > 1">
                            </div>
                            <template v-if="selectedFeatures.length > 1">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-sm start-button"
                                    @click="getAddress(true, select.getFeatures().getArray())"
                                >
                                    {{ $t('additional:modules.tools.valuationPrint.startButton') }}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
                <div
                    v-if="messageList.length > 0"
                    class="card mt-3"
                >
                    <div class="card-header">
                        {{ $t('additional:modules.tools.valuationPrint.messageListTitle') }}
                    </div>
                    <div class="card-body">
                        <div class="card-text">
                            <div
                                v-for="(messageObj, idx) in messageList"
                                :key="idx + '_' + messageObj.message"
                                :class="messageObj.isError ? 'messageListError' : 'messageListEntry'"
                            >
                                {{ messageObj.message }}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="urlList.length > 0"
                    class="card mt-3"
                >
                    <div class="card-header">
                        {{ $t('additional:modules.tools.valuationPrint.urlListTitle') }}
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <ul class="list-unstyled">
                                <li
                                    v-for="(url, idx) in urlList"
                                    :key="idx + '_' + url.name"
                                    class="urlListEntry"
                                >
                                    <a
                                        :href="url.link"
                                        target="_blank"
                                    >{{ url.name }}</a>
                                </li>
                                <li v-if="showDownloadAll">
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm"
                                        @click="openUrls(urlList)"
                                        @keydown="openUrls(urlList)"
                                    >
                                        {{ $t('additional:modules.tools.valuationPrint.downloadAll') }}
                                    </button>
                                </li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
            <ModalItem
                :icon="icon"
                :show-modal="showModal"
                modal-inner-wrapper-style="min-width: 400px;"
                modal-content-container-style="padding: 0.5rem"
                @modalHid="showPrintModal(false, [])"
            >
                <template #header>
                    <h5 class="px-2 mt-2">
                        {{ $t('additional:modules.tools.valuationPrint.modalTitle') }}
                    </h5>
                </template>
                <template #default>
                    <div class="border-bottom border-top def-font">
                        <div class="my-3">
                            <label
                                for="number"
                                class="form-label"
                            >{{ $t('additional:modules.tools.valuationPrint.number') }}</label>
                            <input
                                id="number"
                                v-model="documentNumber"
                                :aria-label="$t('additional:modules.tools.valuationPrint.number')"
                                type="text"
                                placeholder="xx.xxxx - xxx"
                                :class="`form-control ${errors.documentNumber ? 'is-invalid' : ''}`"
                            >
                            <div
                                v-if="errors.documentNumber"
                                class="invalid-feedback"
                            >
                                {{ $t('additional:modules.tools.valuationPrint.formError.missingDocumentName') }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label
                                for="address-list"
                                class="form-label"
                            >{{ $t('additional:modules.tools.valuationPrint.address') }}</label>
                            <input
                                id="address-list"
                                ref="addressInput"
                                :class="`form-control ${errors.address ? 'is-invalid' : ''}`"
                                list="addresslistOptions"
                                :placeholder="!autofill ? $t('additional:modules.tools.valuationPrint.placeholder') : ''"
                                @change="setSpecificAddress"
                            >
                            <datalist id="addresslistOptions">
                                <option
                                    v-for="address in addressList"
                                    :key="address"
                                    :value="address"
                                >
                                    {{ address }}
                                </option>
                            </datalist>
                            <div
                                v-if="errors.address"
                                class="invalid-feedback"
                            >
                                {{ $t('additional:modules.tools.valuationPrint.formError.missingAddress') }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <label
                                    v-for="type in printType"
                                    :key="type"
                                >
                                    {{ type }}
                                    <input
                                        :id="type"
                                        v-model="chosenType"
                                        class="form-check-input"
                                        type="radio"
                                        name="printType"
                                        :value="type"
                                    >
                                </label>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="p-2">
                        <button
                            type="button"
                            class="btn btn-primary confirm-print"
                            tabindex="0"
                            @click.prevent="setParcelData(printedFeature)"
                            @keydown.prevent="setParcelData(printedFeature)"
                        >
                            {{ $t('additional:modules.tools.valuationPrint.startButton') }}
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            tabindex="0"
                            @click="showPrintModal(false, [])"
                            @keydown="showPrintModal(false, [])"
                        >
                            {{ $t('additional:modules.tools.valuationPrint.cancel') }}
                        </button>
                    </div>
                </template>
            </ModalItem>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

h5 {
    font-family: "MasterPortalFont Bold", "Arial Narrow", Arial, sans-serif;
}

.def-font {
    font-size: 16px;
    .form-check-label {
        padding-top: 3px;
    }
}

button {
    font-size: 13px;
}

.messageListError {
    color: $danger;
}

.card-body {
    max-height: 300px;
    overflow-y: auto;
    padding: 13px;
}

.list-inline, .list-unstyled {
    margin-bottom: 0;
}

.form-check {
    label {
        display: block;
        cursor: pointer;
        position: relative;
        margin-top: 5px;
        input {
            position: absolute;
            left: 0;
            top: -3px;
        }
    }
}
</style>
