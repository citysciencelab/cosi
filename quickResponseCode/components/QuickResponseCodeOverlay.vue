<script>
import {mapGetters} from "vuex";
import getters from "../store/gettersQuickResponseCode";
import QRCode from "qrcode";
import crs from "@masterportal/masterportalapi/src/crs";
import Overlay from "ol/Overlay.js";

export default {
    name: "QuickResponseCodeOverlay",
    data () {
        return {
            overlay: new Overlay({
                id: "quick-response-code-overlay",
                element: document.createElement("DIV"),
                positioning: "bottom-left"
            }),
            qrDataUrl: null
        };
    },
    computed: {
        ...mapGetters("Tools/QuickResponseCode", Object.keys(getters))
    },
    watch: {
        evtCoordinate (coordinates) {
            this.generateQRCodeDataURL(coordinates);
        }
    },
    mounted () {
        mapCollection.getMap("2D").addOverlay(this.overlay);
    },
    beforeDestroy () {
        mapCollection.getMap("2D").removeOverlay(this.overlay);
    },
    methods: {
        /**
         * Generates an qr code for the given coordinates with the configured url schema
         * @param {Number[]} coordinates An array with two entries for longitude and latitude coordinates in EPSG:25832
         * @returns {void}
         */
        generateQRCodeDataURL (coordinates) {
            const url = this.replaceDataInURLSchema(coordinates);

            QRCode.toDataURL(url).then((qrDataUrl) => {
                this.qrDataUrl = qrDataUrl;
                this.overlay.setElement(document.querySelector("#quick-response-code-overlay"));
                this.overlay.setPosition(coordinates);
            });
        },

        /**
         * Replaces the placeholders in the configured url schema with the given coordinates
         * @param {Number[]} coordinates An array with two entries for longitude and latitude coordinates in EPSG:25832
         * @returns {String} The data url as string
         */
        replaceDataInURLSchema (coordinates) {
            const transformedCoords = this.transformCoords(coordinates),
                lat = transformedCoords[1],
                lon = transformedCoords[0],
                url = this.urlSchema.replace("{{LAT}}", lat).replace("{{LON}}", lon);

            return url;
        },

        /**
         * Transform the coordinates to the specified target projection.
         * @param {Number[]} coordinates The coordinates to transform
         * @returns {Number[]} The transformed coordinates
         */
        transformCoords (coordinates) {
            return crs.transform("EPSG:25832", this.projection, coordinates);
        },

        /**
         * reset the value of qrDataUrl.
         * @returns {void}
         */
        resetQrDataUrl () {
            this.qrDataUrl = null;
        }
    }
};
</script>

<template lang="html">
    <div
        id="quick-response-code-overlay"
    >
        <div
            v-if="qrDataUrl !== null"
            id="quick-response-code-overlay-body"
        >
            <div
                id="quick-response-code-overlay-body-heading"
            >
                <span
                    class="bootstrap-icon"
                    role="button"
                    tabindex="0"
                    title="Maximieren"
                    @click="resetQrDataUrl"
                    @keydown="resetQrDataUrl"
                >
                    <i class="bi-x-lg" />
                </span>
            </div>
            <div
                id="quick-response-code-overlay-body-content"
            >
                <img
                    alt="qr Code"
                    :src="qrDataUrl"
                >
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    @import "~variables";

    #quick-response-code-overlay-body {
        color: $black;
        font-size: 14px;
        background-color: $white;

        #quick-response-code-overlay-body-heading {
            display: flex;
            flex-flow: column wrap;
            align-content: flex-end;

            > .bootstrap-icon {
                padding: 5px;
                cursor: pointer;
                &:focus {
                    @include primary_action_focus;
                }
                &:hover {
                    @include primary_action_hover;
                }
            }
        }

        #quick-response-code-overlay-body-content {
            padding: 0 15px 15px 15px;
        }
    }
</style>
