<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersTacticalMark";
import mutations from "../store/mutationsTacticalMark";
import Icon from "ol/style/Icon";
import {Style, Text} from "ol/style.js";
import {click} from "ol/events/condition";
import {Draw, Select, Modify} from "ol/interaction.js";
import uniqueId from "../../../src/utils/uniqueId.js";
import convertFeaturesToKml from "../../../src/utils/convertFeaturesToKml.js";
import {Circle} from "ol/geom.js";
import {fromCircle} from "ol/geom/Polygon.js";

export default {
    name: "TacticalMark",
    components: {
        ToolTemplate
    },
    data () {
        return {
            mapElement: document.getElementById("map"),
            showDownload: false,
            format: "kml",
            filename: "",
            fileUrl: "",
            file: "",
            disableFileDownload: true
        };
    },
    computed: {
        ...mapGetters("Tools/TacticalMark", Object.keys(getters)),
        ...mapGetters(["imagePath"]),

        /**
         * Checks if there are visible features.
         * @returns {Boolean} True if there are visible features otherwise false.
         */
        hasVisibleFeatures () {
            const features = this.layer.getSource().getFeatures();
            let visibleFeatures = [];

            visibleFeatures = features.filter(feature => feature.get("drawState").drawType.isTacticalMark && feature.get("isVisible"));

            return visibleFeatures.length > 0;
        },

        /**
         * Checks if the layer has tactical features.
         * @returns {boolean} Returns true if the layer has features, otherwise false.
         */
        hasTacticalFeatures () {
            const features = this.layer.getSource().getFeatures();
            let tacticalFeatures = [];

            tacticalFeatures = features.filter(feature => feature.get("drawState").drawType.isTacticalMark);

            return tacticalFeatures.length > 0;
        },

        /**
         * returns text for title
         * @returns {String} -
         */
        title: function () {
            return this.$t("additional:modules.tools.tacticalMark.title");
        },

        /**
         * returns text for iconSetting
         * @returns {String} -
         */
        iconSetting: function () {
            return this.$t("additional:modules.tools.tacticalMark.iconSetting");
        },

        /**
         * returns text for iconDelete
         * @returns {String} -
         */
        iconDelete: function () {
            return this.$t("additional:modules.tools.tacticalMark.iconDelete");
        },

        /**
         * returns text for iconDownload
         * @returns {String} -
         */
        iconDownload: function () {
            return this.$t("additional:modules.tools.tacticalMark.iconDownload");
        },

        /**
         * returns text for iconEdit
         * @returns {String} -
         */
        iconEdit: function () {
            return this.$t("additional:modules.tools.tacticalMark.iconEdit");
        },

        /**
         * returns options for category selectbox
         * @returns {Array} -
         */
        options: function () {
            return [
                {name: this.$t("additional:modules.tools.tacticalMark.damageImage"), id: "dmg"},
                {name: this.$t("additional:modules.tools.tacticalMark.resources"), id: "rsc"},
                {name: this.$t("additional:modules.tools.tacticalMark.damageAccounts"), id: "dma"}
            ];
        },

        /**
         * returns text for damageAccount
         * @returns {String} -
         */
        damageAccount: function () {
            return this.$t("additional:modules.tools.tacticalMark.damageAccount");
        },

        /**
         * returns text for saveFile
         * @returns {String} -
         */
        saveFile: function () {
            return this.$t("additional:modules.tools.tacticalMark.saveFile");
        },

        /**
         * returns text for setFileName
         * @returns {String} -
         */
        setFileName: function () {
            return this.$t("additional:modules.tools.tacticalMark.setFileName");
        },

        /**
         * returns text for filenameLabel
         * @returns {String} -
         */
        filenameLabel: function () {
            return this.$t("additional:modules.tools.tacticalMark.filenameLabel");
        }
    },
    watch: {
        /**
         * Starts the action for processes, if the tool is be activated (active === true).
         * @param {Boolean} value Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (value) {
            if (value) {
                this.setActive(value);
            }
            else {
                this.resetCanvasCursor();
                this.removeInteractionFromMap(this.interaction);
            }
        }
    },
    async created () {
        this.$on("close", this.close);
        this.interaction = "";
        this.selectedBtn = "";
        this.layer = await Radio.request("Map", "createLayerIfNotExists", "importDrawLayer");
    },
    /**
     * Put initialize here if mounting occurs after config parsing
     * @returns {void}
     */
    mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapMutations("Tools/TacticalMark", Object.keys(mutations)),
        ...mapActions("Maps", {
            addInteractionToMap: "addInteraction",
            removeInteractionFromMap: "removeInteraction"
        }),
        /**
         * call the setIcon function by changes in damage account
         * field to update the number with setted param dmaChg
         * @returns {void} -
         */
        changeDmaNr () {
            if (this.selectedBtn !== null && this.selectedBtn === "damage_account.jpg") {
                this.setIcon("damage_account.jpg", "dma_number", "dmaChg");
            }
        },

        /**
         * return the path to the given icon
         * @param {String} iconName the filename of the icon
         * @returns {String} the path to the icon
         */
        getIconPath (iconName) {
            return this.imagePath + iconName;
        },

        /**
         * set the selected icon to mark on the map
         * @param {String} iconName the filename of the icon
         * @param {String} [dmaNumber=null] the given number of the damage account
         * @param {String} [dmaChg=null] is setted if the function called by onChange in damage account
         * @returns {void} -
         */
        setIcon (iconName, dmaNumber = null, dmaChg = null) {
            const ref = this.$refs[iconName.slice(0, -4)];
            let style,
                number = "";

            if (this.selectedBtn === null || this.selectedBtn !== iconName || dmaChg !== null) {
                Object.keys(this.$refs).forEach(rf => {
                    this.$refs[rf].style.backgroundColor = "#F2F2F2";
                });
                ref.style.backgroundColor = "#CDCDCD";

                this.selectedBtn = iconName;

                this.setCanvasCursor();

                if (typeof dmaNumber !== "undefined" && this.$refs.dma_number.value !== "undefined") {
                    number = this.$refs.dma_number.value;

                    style = new Style({
                        text: new Text({
                            text: number,
                            textAlign: "center",
                            textBaseline: "middle",
                            offsetY: 7,
                            font: "12px sans-serif"
                        }),
                        image: new Icon({
                            src: this.imagePath + iconName,
                            scale: 1,
                            opacity: 1
                        }),
                        zIndex: 0
                    });
                }
                else {
                    style = new Style({

                        image: new Icon({
                            src: this.imagePath + iconName,
                            scale: 1,
                            opacity: 1,
                            imgSize: [50, 50]
                        }),
                        zIndex: 0
                    });
                }

                this.removeInteractionFromMap(this.interaction);
                this.interaction = new Draw({
                    source: this.layer.getSource(),
                    type: "Point",
                    style: style
                });

                this.interaction.on("drawend", (evt) => {
                    const that = this;

                    evt.feature.set("drawState", {
                        drawType: {
                            id: "drawSymbol",
                            geometry: "Point",
                            isTacticalMark: true
                        },
                        symbol: {
                            id: "iconPoint",
                            type: "simple_point",
                            value: "simple_point"
                        }});

                    evt.feature.setStyle(feature => {
                        that.enableDownloadBtn();
                        if (feature.get("isVisible")) {
                            return style;
                        }
                        return undefined;
                    });
                    this.layer.setVisible(true);
                    evt.feature.set("styleId", iconName + uniqueId("_"));
                    evt.feature.set("isVisible", true);
                    evt.feature.set("invisibleStyle", style);
                });

                this.addInteractionToMap(this.interaction);
            }
            else {
                ref.style.backgroundColor = "#F2F2F2";

                this.removeInteractionFromMap(this.interaction);
                this.resetCanvasCursor();
                this.selectedBtn = "";
            }
        },

        /**
         * delete selected icon
         * @returns {valueControlsoid}  -
         */
        deleteIcon () {
            const ref = this.$refs.delete;

            if (this.selectedBtn !== "delete") {
                Object.keys(this.$refs).forEach(rf => {
                    this.$refs[rf].style.backgroundColor = "#F2F2F2";
                });
                ref.style.backgroundColor = "#CDCDCD";

                this.removeInteractionFromMap(this.interaction);

                this.interaction = new Select({
                    condition: click
                });

                this.addInteractionToMap(this.interaction);

                this.interaction.on("select", (evt) => {
                    evt.target.getFeatures().forEach((feature) => {
                        this.layer.getSource().removeFeature(feature);
                    });
                    this.enableDownloadBtn();
                });
                this.setCanvasCursor();
                this.selectedBtn = "delete";
            }
            else {
                ref.style.backgroundColor = "#F2F2F2";

                this.removeInteractionFromMap(this.interaction);
                this.resetCanvasCursor();
                this.selectedBtn = "";
            }
        },

        /**
         * modify selected icon
         * @returns {void}  -
         */
        modifyIcon () {
            const ref = this.$refs.modify;

            if (this.selectedBtn !== "modify") {
                Object.keys(this.$refs).forEach(rf => {
                    this.$refs[rf].style.backgroundColor = "#F2F2F2";
                });
                ref.style.backgroundColor = "#CDCDCD";

                this.removeInteractionFromMap(this.interaction);

                this.interaction = new Modify({
                    source: this.layer.getSource()
                });

                this.addInteractionToMap(this.interaction);

                this.setCanvasCursor();
                this.selectedBtn = "modify";
            }
            else {
                ref.style.backgroundColor = "#F2F2F2";

                this.removeInteractionFromMap(this.interaction);
                this.resetCanvasCursor();
                this.selectedBtn = "";
            }
        },

        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.id});

            if (model) {
                model.set("isActive", false);
            }
        },

        /**
         * select and set the category of icons from the pull down
         * @param {Event} event changed selection event
         * @returns {void}
         */
        selectIconCat (event) {
            document.getElementById(event.target.value).style.display = "block";

            this.removeInteractionFromMap(this.interaction);
            this.resetCanvasCursor();
            this.selectedBtn = "";

            Object.keys(this.$refs).forEach(rf => {
                this.$refs[rf].style.backgroundColor = "#F2F2F2";
                this.$refs[rf].value = null;
            });

            if (event.target.value === "rsc") {
                document.getElementById("dmg").style.display = "none";
                document.getElementById("dma").style.display = "none";
            }
            if (event.target.value === "dmg") {
                document.getElementById("rsc").style.display = "none";
                document.getElementById("dma").style.display = "none";
            }
            if (event.target.value === "dma") {
                document.getElementById("dmg").style.display = "none";
                document.getElementById("rsc").style.display = "none";
            }
        },

        /**
         * set the cursor
         * @returns {void}
         */
        setCanvasCursor () {
            this.mapElement.style.cursor = "crosshair";
            this.mapElement.onmousedown = this.onMouseDown;
            this.mapElement.onmouseup = this.onMouseUp;
        },

        /**
         * reset the cursor
         * @returns {void}
         */
        resetCanvasCursor () {
            this.mapElement.style.cursor = "";
            this.mapElement.onmousedown = undefined;
            this.mapElement.onmouseup = undefined;
        },

        /**
         * Sets the visibility of the layer.
         * @param {Boolean} value - True for visible and false for not.
         * @returns {void}
         */
        setVisibility (value) {
            const features = this.layer.getSource().getFeatures();

            if (features.length > 0) {
                features.forEach(feature => {
                    if (feature.get("drawState").drawType.isTacticalMark) {
                        feature.set("isVisible", value);
                    }
                });
            }
        },

        /**
         * toggle the download area
         *  @returns {void}
         */
        download () {
            this.showDownload = !this.showDownload;
        },

        /**
         * deactivates or activates the download button
         * @returns {void}
         */
        enableDownloadBtn () {
            if (this.prepareFileName(this.filename) !== "" && this.layer.getSource().getFeatures().length > 0) {
                this.disableFileDownload = false;
            }
            else {
                this.disableFileDownload = true;
            }
        },

        /**
         * Commits the current features of the draw layer to the state.
         * Action is dispatched when a feature is drawn, edited or deleted.
         * NOTE: When a feature is an instance of ol/Circle, it is converted to a ol/Polygon first.
         *
         * @returns {void}
         */
        async setDownloadFeatures () {
            const downloadFeatures = [],
                drawnFeatures = this.layer.getSource().getFeatures();

            drawnFeatures.forEach(drawnFeature => {
                const feature = drawnFeature.clone(),
                    geometry = feature.getGeometry();

                // If the feature is invisible from filter, the style will be reset by printing.
                if (!feature.get("isVisible") && feature.get("invisibleStyle")) {
                    feature.setStyle(feature.get("invisibleStyle"));
                }

                if (geometry instanceof Circle) {
                    feature.setGeometry(fromCircle(geometry));
                }
                downloadFeatures.push(feature);
            });

            await this.startDownload(downloadFeatures);
        },

        /**
         * starts the download process
         * @param {module:ol/Feature[]} downloadFeatures - Collection of openlayers features to be downloaded
         * @returns {void}
         */
        async startDownload (downloadFeatures) {
            if (downloadFeatures.length > 0) {

                const dataString = await convertFeaturesToKml(downloadFeatures);

                this.file = this.prepareFileName(this.filename);

                if (this.file && this.file !== "") {
                    this.prepareDownload(dataString);
                }
            }
        },

        /**
         * prepares the download process
         * @param {String} dataString - data in string
         * @returns {void}
         */
        prepareDownload (dataString) {
            const isIE = Radio.request("Util", "isInternetExplorer");

            if (isIE) {
                window.navigator.msSaveOrOpenBlob(new Blob([dataString]), this.file);
            }
            else {
                this.fileUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(dataString)}`;
            }
        },

        /**
         * prepares the file name
         * @param {String} fileName - the given filename from html input field
         * @returns {String} - prepared filename with suffix or empty string
         */
        prepareFileName (fileName) {
            if (fileName.length > 0) {
                const suffix = "." + this.format;

                return fileName.toLowerCase().endsWith(suffix) ? fileName : fileName + suffix;
            }
            return "";
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
                v-if="active"
                id="tacticalMark"
            >
                <div
                    v-if="hasTacticalFeatures"
                    class="checkbox"
                >
                    <label>
                        <input
                            type="checkbox"
                            :checked="hasVisibleFeatures"
                            @change="setVisibility($event.target.checked)"
                        > {{ title }}
                    </label>
                </div>
                <label for="tacticalMark-category">
                    {{ $t("additional:modules.tools.tacticalMark.category") }}
                </label>
                <select
                    id="tacticalMark-category"
                    class="form-control input-sm"
                    @change="selectIconCat($event)"
                >
                    <option
                        v-for="option in options"
                        :key="'draw-drawType-' + option.id"
                        :value="option.id"
                    >
                        {{ option.name }}
                    </option>
                </select>

                <div id="dmg">
                    <div class="tm-container">
                        <div class="tm-item">
                            <div
                                ref="Vorlage_Dammbalken"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Dammbalken.jpg');"
                                @keydown.enter="setIcon('Vorlage_Dammbalken.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        alt="Dammbalken"
                                        :src="$t(getIconPath('Vorlage_Dammbalken_16.jpg'))"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Dammbalken
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Deich"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Deich.jpg');"
                                @keydown.enter="setIcon('Vorlage_Deich.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        alt="Deich"
                                        :src="$t(getIconPath('Vorlage_Deich_16.jpg'))"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Deich
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Zug_DB"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Zug_DB.jpg');"
                                @keydown.enter="setIcon('Vorlage_Zug_DB.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Zug_DB_16.jpg'))"
                                        alt="Zug DB"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Zug-DB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Dammbalken_ueberflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Dammbalken_ueberflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Dammbalken_ueberflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Dammbalken_ueberflutet_defekt_16.jpg'))"
                                        alt="Dammbalken überflutet"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Dammbalken überflutet
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Deich_normal"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Deich_normal.jpg');"
                                @keydown.enter="setIcon('Vorlage_Deich_normal.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Deich_normal_16.jpg'))"
                                        alt="Deich normal"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Deich normal
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Zug_DB_Schaden"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Zug_DB_Schaden.jpg');"
                                @keydown.enter="setIcon('Vorlage_Zug_DB_Schaden.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Zug_DB_Schaden_16.jpg'))"
                                        alt="Zug DB Schaden"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Zug-DB Schaden
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Drehtor"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Drehtor.jpg');"
                                @keydown.enter="setIcon('Vorlage_Drehtor.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Drehtor_16.jpg'))"
                                        alt="Drehtor"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Drehtor
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Deichbruch"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Deichbruch.jpg');"
                                @keydown.enter="setIcon('Vorlage_Deichbruch.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Deichbruch_16.jpg'))"
                                        alt="Deichbruch"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Deichbruch
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Zugunglueck"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Zugunglueck.jpg');"
                                @keydown.enter="setIcon('Vorlage_Zugunglueck.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Zugunglueck_16.jpg'))"
                                        alt="Zugunglück"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Zugunglück
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Drehtor_ueberflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Drehtor_ueberflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Drehtor_ueberflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Drehtor_ueberflutet_defekt_16.jpg'))"
                                        alt="Drehtor überflutet/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Drehtor überflutet/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Deichwart"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Deichwart.jpg');"
                                @keydown.enter="setIcon('Vorlage_Deichwart.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Deichwart_16.jpg'))"
                                        alt="Deichwart"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Deichwart
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_E_Lok_DB"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_E_Lok_DB.jpg');"
                                @keydown.enter="setIcon('Vorlage_E_Lok_DB.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_E_Lok_DB_16.jpg'))"
                                        alt="E-Lok DB"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        E-Lok DB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Schleusen"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Schleusen.jpg');"
                                @keydown.enter="setIcon('Vorlage_Schleusen.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Schleusen_16.jpg'))"
                                        alt="Schleusen"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Schleusen
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Produktionsbetrieb_firma"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Produktionsbetrieb_firma.jpg');"
                                @keydown.enter="setIcon('Vorlage_Produktionsbetrieb_firma.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Produktionsbetrieb_firma_16.jpg'))"
                                        alt="Produktionsfirma"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Produktionsfirma
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_E_Lok_DB_Schaden"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_E_Lok_DB_Schaden.jpg');"
                                @keydown.enter="setIcon('Vorlage_E_Lok_DB_Schaden.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_E_Lok_DB_Schaden_16.jpg'))"
                                        alt="E-Lok DB Schaden"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        E-Lok DB Schaden
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Schleusen_ueberflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Schleusen_ueberflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Schleusen_ueberflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Schleusen_ueberflutet_defekt_16.jpg'))"
                                        alt="Schleusen überflutet/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Schleusen überflutet/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Produktionsbetrieb_firma_problem"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Produktionsbetrieb_firma_problem.jpg');"
                                @keydown.enter="setIcon('Vorlage_Produktionsbetrieb_firma_problem.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Produktionsbetrieb_firma_problem_16.jpg'))"
                                        alt="Produktionfirma Problem"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Produktionsfirma Problem
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_oben"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_oben.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_oben.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_oben_16.jpg'))"
                                        alt="Pfeil oben"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil oben
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Schiebetor"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Schiebetor.jpg');"
                                @keydown.enter="setIcon('Vorlage_Schiebetor.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Schiebetor_16.jpg'))"
                                        alt="Schiebetor"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Schiebetor
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Produktionsbetrieb_firma_problem_auslaufen"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Produktionsbetrieb_firma_problem_auslaufen.jpg');"
                                @keydown.enter="setIcon('Vorlage_Produktionsbetrieb_firma_problem_auslaufen.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Produktionsbetrieb_firma_problem_auslaufen_16.jpg'))"
                                        alt="Produktionsfirma auslaufen"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Produktionsfirma auslaufen
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_oben_rechts"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_oben_rechts.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_oben_rechts.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_oben_rechts_16.jpg'))"
                                        alt="Pfeil oben rechts"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil oben rechts
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Schiebetor_uebeflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Schiebetor_uebeflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Schiebetor_uebeflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Schiebetor_uebeflutet_defekt_16.jpg'))"
                                        alt="Schiebetor überflutet/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Schiebetor überflutet/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Produktionsbetrieb_firma_explosion_brand"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Produktionsbetrieb_firma_explosion_brand.jpg');"
                                @keydown.enter="setIcon('Vorlage_Produktionsbetrieb_firma_explosion_brand.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Produktionsbetrieb_firma_explosion_brand_16.jpg'))"
                                        alt="Produktionsfirma Explosion"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Produktionsfirma Explosion
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_rechts"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_rechts.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_rechts.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_rechts_16.jpg'))"
                                        alt="Pfeil rechts"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil rechts
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_sandsackwall"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_sandsackwall.jpg');"
                                @keydown.enter="setIcon('Vorlage_sandsackwall.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_sandsackwall_16.jpg'))"
                                        alt="Sandsackwall"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsackwall
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_LKW_Tank"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_LKW_Tank.jpg');"
                                @keydown.enter="setIcon('Vorlage_LKW_Tank.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_LKW_Tank_16.jpg'))"
                                        alt="LKW Tank"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        LKW Tank
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_unten_rechts"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_unten_rechts.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_unten_rechts.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_unten_rechts_16.jpg'))"
                                        alt="Pfeil unten rechts"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil unten rechts
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_sandsackwall_ueberflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_sandsackwall_ueberflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_sandsackwall_ueberflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_sandsackwall_ueberflutet_defekt_16.jpg'))"
                                        alt="Sandsackwall überflutet/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsackwall überflutet/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_LKW_Tank_Auslaufen"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_LKW_Tank_Auslaufen.jpg');"
                                @keydown.enter="setIcon('Vorlage_LKW_Tank_Auslaufen.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_LKW_Tank_Auslaufen_16.jpg'))"
                                        alt="LKW Tank auslaufen"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        LKW Tank auslaufen
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_unten"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_unten.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_unten.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_unten_16.jpg'))"
                                        alt="Pfeil unten"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil unten
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Klapptor"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Klapptor.jpg');"
                                @keydown.enter="setIcon('Vorlage_Klapptor.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Klapptor_16.jpg'))"
                                        alt="Klapptor"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Klapptor
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Wasser"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Wasser.jpg');"
                                @keydown.enter="setIcon('Vorlage_Wasser.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Wasser_16.jpg'))"
                                        alt="Wasser"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Wasser
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_unten_links"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_unten_links.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_unten_links.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_unten_links_16.jpg'))"
                                        alt="Pfeil unten links"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil unten links
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Klapptor_ueberflutet_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Klapptor_ueberflutet_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Klapptor_ueberflutet_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Klapptor_ueberflutet_defekt_16.jpg'))"
                                        alt="Klapptor überflutet/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Klapptor überflutet/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Haus"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Haus.jpg');"
                                @keydown.enter="setIcon('Vorlage_Haus.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Haus_16.jpg'))"
                                        alt="Haus"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Haus
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_links"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_links.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_links.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_links_16.jpg'))"
                                        alt="Pfeil links"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil links
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kraftwerk"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kraftwerk.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kraftwerk.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kraftwerk_16.jpg'))"
                                        alt="Kraftwerk"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kraftwerk
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_container"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_container.jpg');"
                                @keydown.enter="setIcon('Vorlage_container.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_container_16.jpg'))"
                                        alt="Container"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Container
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pfeil_oben_links"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pfeil_oben_links.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pfeil_oben_links.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pfeil_oben_links_16.jpg'))"
                                        alt="Pfeil oben links"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Pfeil oben links
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kraftwerk_gefahr"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kraftwerk_gefahr.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kraftwerk_gefahr.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kraftwerk_gefahr_16.jpg'))"
                                        alt="Kraftwerk Gefahr"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kraftwerk Gefahr
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_bombe"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_bombe.jpg');"
                                @keydown.enter="setIcon('Vorlage_bombe.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_bombe_16.jpg'))"
                                        alt="Bombe"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bombe
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_viereck"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_viereck.jpg');"
                                @keydown.enter="setIcon('Vorlage_viereck.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_viereck_16.jpg'))"
                                        alt="Viereck"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Viereck
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="rsc">
                    <div class="tm-container">
                        <div class="tm-item">
                            <div
                                ref="Vorlage_Mannschaft"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Mannschaft.jpg');"
                                @keydown.enter="setIcon('Vorlage_Mannschaft.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Mannschaft_16.jpg'))"
                                        alt="Mannschaft"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Mannschaft
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Notunterkunft_Kapazitaet"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Notunterkunft_Kapazitaet.jpg');"
                                @keydown.enter="setIcon('Vorlage_Notunterkunft_Kapazitaet.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Notunterkunft_Kapazitaet_16.jpg'))"
                                        alt="Notunterkunft Kapazität"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Notunterkunft Kapazität
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_sandsacklager"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_sandsacklager.jpg');"
                                @keydown.enter="setIcon('Vorlage_sandsacklager.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_sandsacklager_16.jpg'))"
                                        alt="Sandsacklager"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsacklager
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_Bergepanzer"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_Bergepanzer.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_Bergepanzer.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_Bergepanzer_16.jpg'))"
                                        alt="Kran/Bergepanzer"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran/Bergepanzer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Mannschaft_F"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Mannschaft_F.jpg');"
                                @keydown.enter="setIcon('Vorlage_Mannschaft_F.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Mannschaft_F_16.jpg'))"
                                        alt="Mannschaft F"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Mannschaft FF
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Notunterkunft_Kapazitaet_aktiviert"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Notunterkunft_Kapazitaet_aktiviert.jpg');"
                                @keydown.enter="setIcon('Vorlage_Notunterkunft_Kapazitaet_aktiviert.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Notunterkunft_Kapazitaet_aktiviert_16.jpg'))"
                                        alt="Notunterkunft Kapazität aktiviert"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Notunterkunft Kapazität aktiviert
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sandsacklager_aktiviert"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sandsacklager_aktiviert.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sandsacklager_aktiviert.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sandsacklager_aktiviert_16.jpg'))"
                                        alt="Sandsacklager aktiviert"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsacklager aktiviert
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_Bergepanzer_Raeumschild"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_Bergepanzer_Raeumschild.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_Bergepanzer_Raeumschild.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_Bergepanzer_Raeumschild_16.jpg'))"
                                        alt="Kran/Bergepanzer/Räumschild"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran/Bergepanzer/Räumschild
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Mannschaft_Pol"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Mannschaft_Pol.jpg');"
                                @keydown.enter="setIcon('Vorlage_Mannschaft_Pol.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Mannschaft_Pol_16.jpg'))"
                                        alt="Mannschaft Pol"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Mannschaft Pol
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Notunterkunft_Kapazitaet_ok"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Notunterkunft_Kapazitaet_ok.jpg');"
                                @keydown.enter="setIcon('Vorlage_Notunterkunft_Kapazitaet_ok.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Notunterkunft_Kapazitaet_ok_16.jpg'))"
                                        alt="Notunterkunft Kapazität ok"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Notunterkunft Kapazität ok
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sandsacklager_ok"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sandsacklager_ok.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sandsacklager_ok.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sandsacklager_ok_16.jpg'))"
                                        alt="Sandsacklager ok"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsacklager ok
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_Panzer"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_Panzer.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_Panzer.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_Panzer_16.jpg'))"
                                        alt="Kran/Panzer"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran/Panzer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Mannschaft_SAN"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Mannschaft_SAN.jpg');"
                                @keydown.enter="setIcon('Vorlage_Mannschaft_SAN.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Mannschaft_SAN_16.jpg'))"
                                        alt="Mannschaft San"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Mannschaft San
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Notunterkunft_besetzt_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Notunterkunft_besetzt_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Notunterkunft_besetzt_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Notunterkunft_besetzt_defekt_16.jpg'))"
                                        alt="Notunterkunft besetzt/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Notunterkunft besetzt/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sandsacklager_leer"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sandsacklager_leer.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sandsacklager_leer.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sandsacklager_leer_16.jpg'))"
                                        alt="Sandsacklager leer"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sandsacklager leer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_BW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_BW.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_BW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_BW_16.jpg'))"
                                        alt="Kran BW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran BW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Mannschaft_THW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Mannschaft_THW.jpg');"
                                @keydown.enter="setIcon('Vorlage_Mannschaft_THW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Mannschaft_THW_16.jpg'))"
                                        alt="Mannschaft THW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Mannschaft THW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Fluchtburg"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Fluchtburg.jpg');"
                                @keydown.enter="setIcon('Vorlage_Fluchtburg.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Fluchtburg_16.jpg'))"
                                        alt="Fluchtburg"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Fluchtburg
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sand_Lagerflaeche"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sand_Lagerflaeche.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sand_Lagerflaeche.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sand_Lagerflaeche_16.jpg'))"
                                        alt="Sand Lagerfläche"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sand Lagerfläche
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_Feuerwehr"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_Feuerwehr.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_Feuerwehr.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_Feuerwehr_16.jpg'))"
                                        alt="Kran Feuerwehr"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran FF
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Pol"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Pol.jpg');"
                                @keydown.enter="setIcon('Vorlage_Pol.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Pol_16.jpg'))"
                                        alt="Pol"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Polizei
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Fluchtburg_aktiviert"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Fluchtburg_aktiviert.jpg');"
                                @keydown.enter="setIcon('Vorlage_Fluchtburg_aktiviert.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Fluchtburg_aktiviert_16.jpg'))"
                                        alt="Fluchtburg aktiviert"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Fluchtburg aktiviert
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sand_Lagerflaeche_aktiviert"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sand_Lagerflaeche_aktiviert.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sand_Lagerflaeche_aktiviert.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sand_Lagerflaeche_aktiviert_16.jpg'))"
                                        alt="Sand Lagerfläche aktiviert"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sand Lagerfläche aktiviert
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_THW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_THW.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_THW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_THW_16.jpg'))"
                                        alt="Kran THW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran THW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_THW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_THW.jpg');"
                                @keydown.enter="setIcon('Vorlage_THW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_THW_16.jpg'))"
                                        alt="THW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        THW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Fluchtburg_aktiv_ok"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Fluchtburg_aktiv_ok.jpg');"
                                @keydown.enter="setIcon('Vorlage_Fluchtburg_aktiv_ok.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Fluchtburg_aktiv_ok_16.jpg'))"
                                        alt="Fluchtburg aktiv/ok"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Fluchtburg aktiv/ok
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Kran_sonstige"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Kran_sonstige.jpg');"
                                @keydown.enter="setIcon('Vorlage_Kran_sonstige.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Kran_sonstige_16.jpg'))"
                                        alt="Kran sonstige"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Kran sonstige
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_feuerwehr"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_feuerwehr.jpg');"
                                @keydown.enter="setIcon('Vorlage_feuerwehr.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_feuerwehr_16.jpg'))"
                                        alt="Feuerwehr"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Feuerwehr
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Fluchtburg_besetzt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Fluchtburg_besetzt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Fluchtburg_besetzt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Fluchtburg_besetzt_16.jpg'))"
                                        alt="Fluchtburg besetzt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Fluchtburg besetzt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Sand_Lagerflaeche_leer_defekt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Sand_Lagerflaeche_leer_defekt.jpg');"
                                @keydown.enter="setIcon('Vorlage_Sand_Lagerflaeche_leer_defekt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Sand_Lagerflaeche_leer_defekt_16.jpg'))"
                                        alt="Sand Lagerfläche leer/defekt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Sand Lagerfläche leer/defekt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_TLF"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_TLF.jpg');"
                                @keydown.enter="setIcon('Vorlage_TLF.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_TLF_16.jpg'))"
                                        alt="TLF"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        TLF
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="feuerwehr_rtw"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('feuerwehr_rtw.jpg');"
                                @keydown.enter="setIcon('feuerwehr_rtw.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('feuerwehr_rtw_16.jpg'))"
                                        alt="Feuerwehr RTW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Feuerwehr RTW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Fluchtburg_Kapazitaet"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Fluchtburg_Kapazitaet.jpg');"
                                @keydown.enter="setIcon('Vorlage_Fluchtburg_Kapazitaet.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Fluchtburg_Kapazitaet_16.jpg'))"
                                        alt="Fluchtburg Kapazität"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Fluchtburg Kapazität
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_HWS_Material"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_HWS_Material.jpg');"
                                @keydown.enter="setIcon('Vorlage_HWS_Material.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_HWS_Material_16.jpg'))"
                                        alt="HWS Material"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        HWS Material
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Drehleiter"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Drehleiter.jpg');"
                                @keydown.enter="setIcon('Vorlage_Drehleiter.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Drehleiter_16.jpg'))"
                                        alt="Drehleiter"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Drehleiter
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="feuerwehr_nef"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('feuerwehr_nef.jpg');"
                                @keydown.enter="setIcon('feuerwehr_nef.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('feuerwehr_nef_16.jpg'))"
                                        alt="Feuerwehr NEF"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Feuerwehr NEF
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Bereitstellungsraum_Ort"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Bereitstellungsraum_Ort.jpg');"
                                @keydown.enter="setIcon('Vorlage_Bereitstellungsraum_Ort.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Bereitstellungsraum_Ort_16.jpg'))"
                                        alt="Bereitstellungsraum Ort"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bereitstellungsraum Ort
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_TEL_DV1"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_TEL_DV1.jpg');"
                                @keydown.enter="setIcon('Vorlage_TEL_DV1.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_TEL_DV1_16.jpg'))"
                                        alt="TEL DV1"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        TEL DV1
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Bagger_Tieflader"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Bagger_Tieflader.jpg');"
                                @keydown.enter="setIcon('Vorlage_Bagger_Tieflader.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Bagger_Tieflader_16.jpg'))"
                                        alt="Bagger/Tieflader"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bagger/Tieflader
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="feuerwehr_umwelt"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('feuerwehr_umwelt.jpg');"
                                @keydown.enter="setIcon('feuerwehr_umwelt.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('feuerwehr_umwelt_16.jpg'))"
                                        alt="Feuerwehr Umwelt"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Feuerwehr Umwelt
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Bereitstellungsraum_Ort_arbeitet"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Bereitstellungsraum_Ort_arbeitet.jpg');"
                                @keydown.enter="setIcon('Vorlage_Bereitstellungsraum_Ort_arbeitet.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Bereitstellungsraum_Ort_arbeitet_16.jpg'))"
                                        alt="Bereitstellungsraum Ort arbeitet"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bereitstellungsraum Ort arbeitet
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_TEL_DV2"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_TEL_DV2.jpg');"
                                @keydown.enter="setIcon('Vorlage_TEL_DV2.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_TEL_DV2_16.jpg'))"
                                        alt="TEL DV2"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        TEL DV2
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Radlader"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Radlader.jpg');"
                                @keydown.enter="setIcon('Vorlage_Radlader.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Radlader_16.jpg'))"
                                        alt="Radlader"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Radlader
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_LKW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_LKW.jpg');"
                                @keydown.enter="setIcon('Vorlage_LKW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_LKW_16.jpg'))"
                                        alt="LKW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        LKW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Bereitstellungsraum_Ort_aktiv"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Bereitstellungsraum_Ort_aktiv.jpg');"
                                @keydown.enter="setIcon('Vorlage_Bereitstellungsraum_Ort_aktiv.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Bereitstellungsraum_Ort_aktiv_16.jpg'))"
                                        alt="Bereitstellungsraum Ort aktiv"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bereitstellungsraum Ort aktiv
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_TEL_DV3"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_TEL_DV3.jpg');"
                                @keydown.enter="setIcon('Vorlage_TEL_DV3.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_TEL_DV3_16.jpg'))"
                                        alt="TEL DV3"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        TEL DV3
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Transporthubschrauber_BW"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Transporthubschrauber_BW.jpg');"
                                @keydown.enter="setIcon('Vorlage_Transporthubschrauber_BW.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Transporthubschrauber_BW_16.jpg'))"
                                        alt="Transporthubschrauber BW"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Transporthubschrauber BW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_LKW_Kippeinrichtung"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_LKW_Kippeinrichtung.jpg');"
                                @keydown.enter="setIcon('Vorlage_LKW_Kippeinrichtung.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_LKW_Kippeinrichtung_16.jpg'))"
                                        alt="LKW Kippeinrichtung"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        LKW Kippeinrichtung
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_Bereitstellungsraum_Ort_inaktiv"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_Bereitstellungsraum_Ort_inaktiv.jpg');"
                                @keydown.enter="setIcon('Vorlage_Bereitstellungsraum_Ort_inaktiv.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_Bereitstellungsraum_Ort_inaktiv_16.jpg'))"
                                        alt="Bereitstellungsraum Ort inaktiv"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        Bereitstellungsraum Ort inaktiv
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_TEL_DV4"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_TEL_DV4.jpg');"
                                @keydown.enter="setIcon('Vorlage_TEL_DV4.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_TEL_DV4_16.jpg'))"
                                        alt="TEL DV4"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        TEL DV4
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_RTH"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_RTH.jpg');"
                                @keydown.enter="setIcon('Vorlage_RTH.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_RTH_16.jpg'))"
                                        alt="RTH"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        RTH
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="tm-item">
                            <div
                                ref="Vorlage_LKW_Stadtreinigung"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('Vorlage_LKW_Stadtreinigung.jpg');"
                                @keydown.enter="setIcon('Vorlage_LKW_Stadtreinigung.jpg');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('Vorlage_LKW_Stadtreinigung_16.jpg'))"
                                        alt="LKW Stadtreinigung"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        LKW Stadtreinigung
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="dma">
                    <div class="tm-container">
                        <div class="tm-item">
                            <label for="dma_number">{{ damageAccount }} (0-99):</label>
                            <input
                                id="dma_number"
                                ref="dma_number"
                                type="number"
                                min="0"
                                max="99"
                                @change="changeDmaNr"
                            >
                            <div
                                ref="damage_account"
                                class="tm-btn"
                                role="button"
                                tabindex="0"
                                @click="setIcon('damage_account.jpg', 'dmaNumber');"
                                @keydown.enter="setIcon('damage_account.jpg', 'dmaNumber');"
                            >
                                <div class="tm-btn-img pull-left">
                                    <img
                                        :src="$t(getIconPath('damage_account_mini.jpg'))"
                                        alt="damage account"
                                    >
                                </div>
                                <div class="tm-btn-txt">
                                    <span>
                                        {{ iconSetting }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tm-container">
                    <div class="tm-item">
                        <div
                            ref="modify"
                            class="tm-btn"
                            role="button"
                            tabindex="0"
                            @click="modifyIcon();"
                            @keydown.enter="modifyIcon();"
                        >
                            <div class="tm-btn-txt">
                                <span>
                                    {{ iconEdit }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="tm-item">
                        <div
                            ref="delete"
                            class="tm-btn"
                            role="button"
                            tabindex="0"
                            @click="deleteIcon();"
                            @keydown.enter="deleteIcon();"
                        >
                            <div class="tm-btn-txt">
                                <span>
                                    {{ iconDelete }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="tm-item">
                        <div
                            ref="download"
                            class="tm-btn"
                            role="button"
                            tabindex="0"
                            @click="download();"
                            @keydown.enter="download();"
                        >
                            <div class="tm-btn-txt">
                                <span>
                                    {{ iconDownload }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-show="showDownload"
                    class="tm-container download-container"
                >
                    <div class="tm-item" />
                    <div class="tm-item" />
                    <div class="tm-item">
                        <form
                            id="tool-tacticalmark-download"
                            role="form"
                            class="form-horizontal"
                        >
                            <div class="form-group form-group-sm">
                                <label
                                    class="col-md-5 col-sm-5 control-label"
                                    for="tool-tacticalmark-download-filename"
                                >
                                    {{ filenameLabel }}
                                </label>
                                <div class="col-md-7 col-sm-7">
                                    <input
                                        id="tool-tacticalmark-download-filename"
                                        v-model="filename"
                                        type="text"
                                        :placeholder="setFileName"
                                        class="form-control"
                                        @keyup="enableDownloadBtn"
                                    >
                                </div>
                            </div>
                            <label
                                class="col-md-5 col-sm-5 control-label"
                                for="tool-tacticalmark-download-file"
                            />
                            <a
                                id="tool-tacticalmark-download-file"
                                class="downloadFile"
                                :href="fileUrl"
                                :download="file"
                            >
                                <button
                                    class="btn btn-sm btn-block btn-secondary"
                                    type="button"
                                    :disabled="disableFileDownload"
                                    @click="setDownloadFeatures"
                                >
                                    <span>
                                        {{ saveFile }}
                                    </span>
                                </button>
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

    input[type="checkbox"] {
        margin-top: 0;
    }
    #tool-tacticalmark-download {
        margin:0 auto;
        text-align: center;
    }
    .btn-secondary {
        float: right;
        width: 206px;
    }
    button {
        border-radius: 3px;
        background-color: $secondary_table_style;
        border: 1px solid $light_grey;
    }
    .button:hover {
        background-color: $white;
        color: $black;
        border: 1px solid $secondary_table_style;
    }
    .tm-container {
        display: grid;
        grid-template-columns: auto auto auto;
        padding: 5px 0;
        .tm-item {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 0px 1px;
            font-size: 12px;
            text-align: center;
            .tm-btn {
                border-radius: 3px;
                background-color: $secondary_table_style;
                color: $black;
                padding: 2px;
                font-size: 12px;
                cursor: pointer;
                text-align: center;
                border: 1px solid #cdcdcd;
                width: 206px;
                &:hover {
                    background-color: $white;
                    color: $black;
                    border: 1px solid $secondary_table_style;
                }
                &:active {
                    background-color: lighten($secondary_table_style, 15%);
                }
                .tm-btn-img {
                    float: left;
                }
            }
        }
    }
    .form-horizontal {
        .form-group {
            label {
                float: left;
                padding-top: 6px;
            }
            > div {
                float: left;
            }
        }
    }
    .downloadFile {
        display: block;
    }
    .tool-window-vue {
        max-width: 680px;
    }
    #rsc {
        display: none;
    }
    #dma {
        display: none;
        .tm-container {
            .tm-item {
                label {
                    margin-bottom: 10px;
                }
            }
        }
    }
    .checkbox {
        margin: 0 0 5px 0;
    }
</style>
