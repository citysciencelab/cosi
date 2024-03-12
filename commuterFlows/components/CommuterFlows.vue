<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersCommuterFlows";
import mutations from "../store/mutationsCommuterFlows";
import {CommuterApi} from "../utils/commuterApi";
import {CommuterOL} from "../utils/commuterOL";
import {convertColor} from "../../../src/utils/convertColor.js";
import thousandsSeparator from "../../../src/utils/thousandsSeparator.js";

export default {
    name: "CommuterFlows",
    components: {
        ToolTemplate
    },
    data () {
        return {
            wfsApi: null,
            olApi: null,

            listDistricts: [],
            listCities: [],
            lastDataset: null,
            lastMarker: null,

            currentDistrict: "",
            currentCity: "",
            currentDirection: "out",

            captionsChecked: true,
            numbersChecked: true,
            beamsChecked: true,
            animationChecked: false,

            tooltipOutActive: false,
            tooltipInActive: false
        };
    },
    computed: {
        ...mapGetters("Tools/CommuterFlows", Object.keys(getters)),

        /**
         * checkes if the animation is running using olApi
         * @returns {Boolean} true if the animation is currently running
         */
        isAnimationRunning () {
            return this.olApi.isAnimationRunning();
        }
    },
    watch: {
        /**
         * watches the status of the tool
         * starts initial processes if the tool has been activated for the first time
         * @param {Boolean} value true if the tool has been activated
         * @returns {void}
         */
        active (value) {
            if (value) {
                this.setActive(value);

                if (this.wfsApi === null) {
                    // the wfsApi can't be loaded on created or mounted, beacause the serviceURL might not be there yet
                    this.wfsApi = new CommuterApi({
                        serviceUrl: this.serviceURL,
                        blacklistedDistricts: this.blacklistedDistricts
                    });
                    this.wfsApi.getListDistricts(result => {
                        this.listDistricts = result;
                    }, this.onApiError);
                }
                if (this.olApi === null) {
                    // the CommuterOL creates layers on construction
                    // only construct when necessary - e.g. on first activation of the tool
                    this.olApi = new CommuterOL({
                        font: this.olFont,
                        fontShadow: this.olFontShadow,
                        beam: this.olBeam,
                        bubblePixelMax: this.olBubblePixelMax,
                        bubblePixelMin: this.olBubblePixelMin,
                        bubbleBorder: this.olBubbleBorder,
                        bubbleColors: this.olBubbleColors,
                        bubbleColorShift: this.olBubbleColorShift,
                        zoomOptions: this.olZoomOptions,
                        animationPaces: this.olAnimationPaces
                    });

                    // resets the tool for a clean start
                    this.resetAll();
                }
                this.setFocusToFirstControl();
            }
        },
        /**
         * watches changes of lastDataset
         * @param {Object} newLastDataset the new lastDataset to react to
         * @returns {void}
         */
        lastDataset (newLastDataset) {
            if (Array.isArray(newLastDataset?.featureList) && Array.isArray(newLastDataset?.coordinate)) {
                this.refreshCaptions();
                this.refreshBeams();
                this.refreshAnimation();
            }
            else {
                this.olApi.clearLayers();
            }
        },
        /**
         * watches the current district and calls selectDistrict if a district is given
         * resets currentCity
         * @param {String} district the new district
         * @returns {void}
         */
        currentDistrict (district) {
            this.currentCity = "";
            if (district) {
                this.selectDistrict(district, this.isOutCommuter(), this.listChunk);
            }
        },
        /**
         * watches the current city and calls selectCity if a city is given
         * calls selectDistrict if no city is given
         * @param {String} city the new city
         * @returns {void}
         */
        currentCity (city) {
            if (city) {
                this.selectCity(city, this.isOutCommuter(), this.listChunk);
            }
            else {
                this.selectDistrict(this.currentDistrict, this.isOutCommuter(), this.listChunk);
            }
        },
        /**
         * watches if the captions are checked
         * @returns {void}
         */
        captionsChecked () {
            this.refreshCaptions();
        },
        /**
         * watches if the numbers are checked
         * @returns {void}
         */
        numbersChecked () {
            this.refreshCaptions();
        },
        /**
         * watches if the beams are checked
         * @returns {void}
         */
        beamsChecked () {
            this.refreshBeams();
        },
        /**
         * watches if the animation is checked
         * @returns {void}
         */
        animationChecked () {
            this.refreshAnimation();
        },
        /**
         * watches if the current direction is changed
         * @returns {void}
         */
        currentDirection () {
            if (this.lastDataset?.source === "getFeaturesDistrict") {
                this.wfsApi.getFeaturesDistrict(this.currentDistrict, this.isOutCommuter(), 0, this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                }, this.onApiError);
            }
            else if (this.lastDataset?.source === "getFeaturesCity") {
                this.wfsApi.getFeaturesCity(this.currentCity, this.isOutCommuter(), 0, this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                }, this.onApiError);
            }
            else {
                this.olApi.clearLayers();
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    /**
     * Put initialize here if mounting occurs after config parsing
     * @returns {void}
     */
    mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapMutations("Tools/CommuterFlows", Object.keys(mutations)),
        thousandsSeparator,
        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["select-district"]) {
                    this.$refs["select-district"].focus();
                }
            });
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.$store.state.Tools.CommuterFlows.id});

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
        },
        /**
         * logs the given error as api error
         * @param {Object} error the error from the api
         * @returns {void}
         */
        onApiError (error) {
            console.warn("addons/CommuterFlow - Api error", error);
        },
        /**
         * returns the css style to use for the feature at a certain list position
         * @param {Number} idx the list position
         * @returns {Object} the css style to be interpreted by Vues :style argument
         */
        getStyleByIdx (idx) {
            return {
                "background-color": convertColor(this.olApi.getColor(idx), "rgbaString")
            };
        },
        /**
         * helper function to zoom into the current extent
         * @returns {void}
         * @pre the zoom is anywhere
         * @post the map is zoomed into the extent of this.lastDataset.featureList
         */
        zoomIntoExtent () {
            if (typeof this.olZoomOptions === "object" && this.olZoomOptions !== null && Array.isArray(this.lastDataset?.featureList) && Array.isArray(this.lastDataset?.coordinate)) {
                this.olApi.zoomToExtent(this.lastDataset.featureList);
            }
        },
        /**
         * auto scrolls the div of the featureList
         * @param {String} whereto whether to scroll up ("top") or down ("bottom")
         * @returns {void}
         */
        autoscrollFeatureList (whereto) {
            const elem = this.$el.querySelector(".featureList");

            if (whereto === "top") {
                elem.scrollTop = 0;
            }
            else if (whereto === "bottom") {
                elem.scrollTop = elem.scrollHeight;
            }
        },
        /**
         * sets/unsets the marker
         * @param {Number[]} coords the coordinates to place the marker at
         * @returns {void}
         */
        toggleMarker (coords) {
            if (!this.setMarkerOnClickInList) {
                return;
            }
            if (!Array.isArray(coords) || this.lastMarker === coords) {
                this.lastMarker = null;
                this.$store.dispatch("MapMarker/removePointMarker");
            }
            else {
                this.lastMarker = coords;
                this.$store.dispatch("MapMarker/placingPointMarker", coords);
            }
        },
        /**
         * sets the dataset for the selected district
         * @param {String} district the selected district
         * @param {Boolean} isOutCommuter out-commuter (true) or in-commuter (false)
         * @param {Number} listChunk the number of features to load initialy
         * @returns {void}
         */
        selectDistrict (district, isOutCommuter, listChunk) {
            this.wfsApi.getListCities(district, result => {
                this.listCities = result;
            }, this.onApiError);
            this.wfsApi.getFeaturesDistrict(district, isOutCommuter, 0, listChunk, dataset => {
                this.lastDataset = dataset;
                this.zoomIntoExtent();
            }, this.onApiError);
        },
        /**
         * sets the dataset for the selected city
         * @param {String} city the selected city
         * @param {Boolean} isOutCommuter out-commuter (true) or in-commuter (false)
         * @param {Number} listChunk the number of features to load initialy
         * @returns {void}
         */
        selectCity (city, isOutCommuter, listChunk) {
            this.wfsApi.getFeaturesCity(city, isOutCommuter, 0, listChunk, dataset => {
                this.lastDataset = dataset;
                this.zoomIntoExtent();
            }, this.onApiError);
        },
        /**
         * refreshes the captions e.g. after change of checkboxes captions and numbers or change of lastDataset
         * @returns {void}
         */
        refreshCaptions () {
            if (Array.isArray(this.lastDataset?.featureList) && Array.isArray(this.lastDataset?.coordinate)) {
                this.olApi.addCaptions(
                    this.lastDataset.caption,
                    this.lastDataset.coordinate,
                    this.lastDataset.featureList,
                    this.captionsChecked,
                    this.numbersChecked
                );
            }
            else {
                this.olApi.removeCaptions();
            }
        },
        /**
         * refreshes the beams e.g. after change of checkbox beams or change of lastDataset
         * @returns {void}
         */
        refreshBeams () {
            if (this.beamsChecked && Array.isArray(this.lastDataset?.featureList) && Array.isArray(this.lastDataset?.coordinate)) {
                this.olApi.addBeams(this.lastDataset.featureList);
            }
            else {
                this.olApi.removeBeams();
            }
        },
        /**
         * refreshes the animation e.g. after change of checkbox animation or change of lastDataset
         * @returns {void}
         */
        refreshAnimation () {
            if (this.animationChecked && Array.isArray(this.lastDataset?.featureList) && Array.isArray(this.lastDataset?.coordinate)) {
                this.olApi.initAnimation(this.lastDataset.featureList, this.lastDataset.totalMax, this.olBubbleAlgorithm);
            }
            else {
                this.olApi.removeAnimation();
            }
        },
        /**
         * loads more features in the feature list
         * @returns {void}
         */
        loadMore () {
            if (this.lastDataset?.source === "getFeaturesDistrict") {
                this.wfsApi.getFeaturesDistrict(this.currentDistrict, this.isOutCommuter(), 0, this.lastDataset.len + this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                    this.$nextTick(() => {
                        this.autoscrollFeatureList("bottom");
                    });
                }, this.onApiError);
            }
            else if (this.lastDataset?.source === "getFeaturesCity") {
                this.wfsApi.getFeaturesCity(this.currentCity, this.isOutCommuter(), 0, this.lastDataset.len + this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                    this.$nextTick(() => {
                        this.autoscrollFeatureList("bottom");
                    });
                }, this.onApiError);
            }
            else {
                this.olApi.clearLayers();
            }
        },
        /**
         * loads less features in the feature list
         * @returns {void}
         */
        loadLess () {
            if (this.lastDataset?.source === "getFeaturesDistrict") {
                this.wfsApi.getFeaturesDistrict(this.currentDistrict, this.isOutCommuter(), 0, this.lastDataset.len - this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                }, this.onApiError);
            }
            else if (this.lastDataset?.source === "getFeaturesCity") {
                this.wfsApi.getFeaturesCity(this.currentCity, this.isOutCommuter(), 0, this.lastDataset.len - this.listChunk, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                }, this.onApiError);
            }
            else {
                this.olApi.clearLayers();
            }
        },
        /**
         * loads all available features in the feature list
         * @returns {void}
         */
        loadAll () {
            if (this.lastDataset?.source === "getFeaturesDistrict") {
                this.wfsApi.getFeaturesDistrict(this.currentDistrict, this.isOutCommuter(), 0, this.lastDataset.totalLength, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                    this.$nextTick(() => {
                        this.autoscrollFeatureList("top");
                    });
                }, this.onApiError);
            }
            else if (this.lastDataset?.source === "getFeaturesCity") {
                this.wfsApi.getFeaturesCity(this.currentCity, this.isOutCommuter(), 0, this.lastDataset.totalLength, dataset => {
                    this.lastDataset = dataset;
                    this.zoomIntoExtent();
                    this.$nextTick(() => {
                        this.autoscrollFeatureList("top");
                    });
                }, this.onApiError);
            }
            else {
                this.olApi.clearLayers();
            }
        },
        /**
         * resets the tool
         * @returns {void}
         */
        resetAll () {
            // note: remember to check behavior of watch:active -> use of resetAll, when changing this function
            this.listCities = [];
            this.currentCity = "";

            // note: the watcher on currentCity already resets the currentDistrict
            // to avoid a mixup within vue (leading to a bug) the following resets may be put into $nextTick
            this.$nextTick(() => {
                this.currentDistrict = "";

                this.lastDataset = null;
                if (typeof this.onstart === "object") {
                    this.captionsChecked = this.onstart.captionsChecked;
                    this.numbersChecked = this.onstart.numbersChecked;
                    this.beamsChecked = this.onstart.beamsChecked;
                    this.animationChecked = this.onstart.animationChecked;
                    this.currentDirection = this.onstart.direction;
                }
                this.toggleMarker(null);

                this.olApi.clearLayers();
            });
        },
        /**
         * starts the animation
         * @returns {void}
         */
        playAnimation () {
            this.olApi.startAnimation();
        },
        /**
         * stops the animation
         * @returns {void}
         */
        stopAnimation () {
            this.olApi.stopAnimation();
        },
        /**
         * returns true if the current commuters are commuting out (from home to work)
         * @returns {Boolean} true if the currentDirection eq "out"
         */
        isOutCommuter () {
            return this.currentDirection === "out";
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
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div
                id="CommuterFlows"
                class="commuter-flows-container"
            >
                <div class="d-grid section">
                    <div class="col">
                        <div
                            v-if="active"
                            class="form-group"
                        >
                            <label for="CommuterFlows-select-district">
                                {{ translate("additional:modules.tools.CommuterFlows.labelDistrict") }}
                            </label>
                            <select
                                id="CommuterFlows-select-district"
                                ref="select-district"
                                v-model="currentDistrict"
                                class="form-select"
                            >
                                <option
                                    selected
                                    disabled
                                    value=""
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.selectDistrict") }}
                                </option>
                                <option
                                    v-for="(district, i) in listDistricts"
                                    :key="i"
                                    :value="district"
                                    :SELECTED="district === currentDistrict"
                                >
                                    {{ district }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="lastDataset !== null">
                    <div class="d-grid section">
                        <div class="col">
                            <div class="form-group">
                                <label for="CommuterFlows-select-city">
                                    {{ translate("additional:modules.tools.CommuterFlows.labelCity") }}
                                </label>
                                <select
                                    id="CommuterFlows-select-city"
                                    v-model="currentCity"
                                    class="form-select"
                                >
                                    <option
                                        selected
                                        value=""
                                    >
                                        {{ translate("additional:modules.tools.CommuterFlows.selectCity") }}
                                    </option>
                                    <option
                                        v-for="(city, i) in listCities"
                                        :key="i"
                                        :value="city"
                                        :SELECTED="city === currentCity"
                                    >
                                        {{ city }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid section">
                        <div class="col" />
                    </div>
                    <div class="d-grid section">
                        <div class="d-grid">
                            <div class="form-check">
                                <input
                                    id="idCaptionsChecked"
                                    v-model="captionsChecked"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label
                                    class="col-form-label"
                                    for="idCaptionsChecked"
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.checkName") }}
                                </label>
                            </div>
                        </div>
                        <div class="d-grid">
                            <div class="form-check">
                                <input
                                    id="idNumbersChecked"
                                    v-model="numbersChecked"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label
                                    class="col-form-label"
                                    for="idNumbersChecked"
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.checkNumber") }}
                                </label>
                            </div>
                        </div>
                        <div class="d-grid">
                            <div class="form-check">
                                <input
                                    id="idBeamsChecked"
                                    v-model="beamsChecked"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label
                                    class="col-form-label"
                                    for="idBeamsChecked"
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.checkBeams") }}
                                </label>
                            </div>
                        </div>
                        <div class="d-grid d-md-flex section">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input
                                        id="idAnimationChecked"
                                        v-model="animationChecked"
                                        class="form-check-input"
                                        type="checkbox"
                                    >
                                    <label
                                        class="col-form-label"
                                        for="idAnimationChecked"
                                    >
                                        {{ translate("additional:modules.tools.CommuterFlows.checkAnimation") }}
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-4 ms-auto">
                                <div
                                    v-if="!isAnimationRunning"
                                    class="form-group float-end "
                                >
                                    <button
                                        type="button"
                                        class="btn btn-secondary btn-sm animationButton"
                                        :disabled="!animationChecked"
                                        @click="playAnimation"
                                    >
                                        <span /><i class="bi bi-play-fill" />
                                        {{ translate("additional:modules.tools.CommuterFlows.buttonStart") }}
                                    </button>
                                </div>
                                <div
                                    v-else
                                    class="form-group float-end"
                                >
                                    <button
                                        type="button"
                                        class="btn btn-secondary btn-sm animationButton"
                                        @click="stopAnimation"
                                    >
                                        <span /><i class="bi bi-stop-fill" />
                                        {{ translate("additional:modules.tools.CommuterFlows.buttonStop") }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid section">
                        <div class="col" />
                    </div>
                    <div class="d-grid d-md-flex section">
                        <div class="col-6 col-sm-6 tooltipWrapper">
                            <div
                                class="form-check form-check-inline"
                                role="presentation"
                                @mouseover="tooltipOutActive = true"
                                @focusin="tooltipOutActive = true"
                                @mouseout="tooltipOutActive = false"
                                @focusout="tooltipOutActive = false"
                            >
                                <input
                                    id="idOutChecked"
                                    v-model="currentDirection"
                                    class="form-check-input"
                                    type="radio"
                                    name="outInCommuter"
                                    value="out"
                                >
                                <label
                                    class="col-form-label"
                                    for="idOutChecked"
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.selectOut") }}
                                </label>
                            </div>
                            <div
                                v-show="tooltipOutActive"
                                class="tooltip"
                            >
                                {{ translate("additional:modules.tools.CommuterFlows.tooltipOut") }}
                            </div>
                        </div>
                        <div class="col-6 col-sm-6 tooltipWrapper">
                            <div
                                class="form-check form-check-inline"
                                role="presentation"
                                @mouseover="tooltipInActive = true"
                                @focusin="tooltipInActive = true"
                                @mouseout="tooltipInActive = false"
                                @focusout="tooltipInActive = false"
                            >
                                <input
                                    id="idInChecked"
                                    v-model="currentDirection"
                                    class="form-check-input"
                                    type="radio"
                                    name="outInCommuter"
                                    value="in"
                                >
                                <label
                                    class="col-form-label"
                                    for="idInChecked"
                                >
                                    {{ translate("additional:modules.tools.CommuterFlows.selectIn") }}
                                </label>
                            </div>
                            <div
                                v-show="tooltipInActive"
                                class="tooltip tooltipRight"
                            >
                                {{ translate("additional:modules.tools.CommuterFlows.tooltipIn") }}
                            </div>
                        </div>
                    </div>
                    <div class="d-grid">
                        <div class="col">
                            <hr>
                        </div>
                    </div>
                    <div class="d-grid section">
                        <div
                            v-if="Array.isArray(lastDataset.featureList) && lastDataset.featureList.length"
                            class="col-sm-12 featureList"
                        >
                            <table>
                                <tbody>
                                    <tr
                                        v-for="(feature, idx) in lastDataset.featureList"
                                        :key="`feature-${idx}`"
                                        @click="toggleMarker(feature.get('coordinate'))"
                                    >
                                        <td
                                            class="featureColor"
                                        >
                                            <div :style="getStyleByIdx(idx)" />
                                        </td>
                                        <td class="featureCaption">
                                            {{ feature.get("caption") }}
                                        </td>
                                        <td class="featureValue">
                                            {{ thousandsSeparator(feature.get("value")) }}
                                        </td>
                                        <td class="featurePeople">
                                            {{ translate("additional:modules.tools.CommuterFlows.labelPeople") }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            v-else
                            class="col-sm-12 noDataset"
                        >
                            {{ translate("additional:modules.tools.CommuterFlows.noDataset") }}
                        </div>
                    </div>
                    <div class="d-grid">
                        <div class="col">
                            <hr>
                        </div>
                    </div>
                    <div class="d-grid gap-2 d-md-block section buttons">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="lastDataset.len <= listChunk"
                            @click="loadLess"
                        >
                            {{ translate("additional:modules.tools.CommuterFlows.buttonLess", {listChunk}) }}
                            <span /><i class="bi bi-arrow-up" />
                        </button>
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="lastDataset.len >= lastDataset.totalLength"
                            @click="loadMore"
                        >
                            {{ translate("additional:modules.tools.CommuterFlows.buttonMore", {listChunk}) }}
                            <span /><i class="bi bi-arrow-down" />
                        </button>
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="lastDataset.len >= lastDataset.totalLength"
                            @click="loadAll"
                        >
                            {{ translate("additional:modules.tools.CommuterFlows.buttonAll") }}
                        </button>
                    </div>
                    <div
                        v-if="metaVerPath"
                        class="d-grid section"
                    >
                        <div class="col-sm-12">
                            <a
                                :href="metaVerPath"
                                target="_blank"
                                class="float-end"
                            >
                                {{ translate("additional:modules.tools.CommuterFlows.linkMoreInfo") }}
                            </a>
                        </div>
                    </div>
                    <div class="d-grid mx-auto section">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="resetAll"
                        >
                            <span /><i class="bi bi-trash" />
                            {{ translate("additional:modules.tools.CommuterFlows.buttonReset") }}
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    @import "~variables";

    #CommuterFlows {
        button {
            &:focus {
                @include primary_action_focus;
            }
            &:hover {
                @include primary_action_hover;
            }
        }
    }

    .commuter-flows-container {
        max-width: 400px;
    }
    .form-select {
        font-size: 14px;
    }
    .section {
        .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-6, .col-sm-12 {
            padding-left: 2px;
            padding-right: 2px;
        }
        .col-12 {
            padding-top: 2px;
            padding-bottom: 2px;
        }
        margin-bottom: 10px;
    }
    hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border-top: solid $light_grey 1px;
    }
    .col-form-label {
        padding-left: 4px;
        padding-top: 0px;
    }
    .animationButton {
        width: 80px;
    }
    .noDataset {
        margin-top: 10px;
        text-align: center;
    }
    .featureList {
        height: 200px;
        overflow-y: auto;
        table {
            width: 100%;
            padding: 0;
            margin: 0;
            tbody tr:nth-child(odd) {
                background-color: darken($white, 10%);
            }
            tbody tr:nth-child(odd) {
                background-color: darken($white, 20%);
            }
            tr {
                width: 100%;
                height: 35px;
                padding: 0;
                margin: 0;

                td {
                    padding: 0 1px 0 1px;
                    margin: 0;
                    vertical-align: middle;
                }
                td.featureColor {
                    width: 15%;
                    text-align: center;
                    div {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                    }
                }
                td.featureCaption {
                    width: 35%;
                }
                td.featureValue {
                    width: 25%;
                    text-align: right;
                }
                td.featurePeople {
                    width: 25%;
                }
            }
        }
    }
    .buttons {
        text-align: center;
    }
    .tooltipWrapper {
        position: relative;
        width: 50%;
        float: left;
        .tooltip {
            position: absolute;
            top: 25px;
            width: 200px;
            z-index: 1;
            opacity: 1;
            border-radius: 4px;
            border: solid 1px $black;
            background-color: $white;
            padding: 5px;
        }
        .tooltipRight {
            right: 0px;
        }
    }
</style>
