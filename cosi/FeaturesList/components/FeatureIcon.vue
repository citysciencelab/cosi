<script>
import Icon from "ol/style/Icon";
import CircleStyle from "ol/style/Circle";
import {mapActions} from "vuex";
import {buffer} from "ol/extent";
import InlineSvg from "vue-inline-svg";

/**
 * @todo Make a util to read the icon of a feature
 */
export default {
    name: "FeatureIcon",
    components: {
        InlineSvg
    },
    props: {
        item: {
            required: true,
            type: Object
        }
    },
    computed: {
        style () {
            return Array.isArray(this.item.style) ? this.item.style[0] : this.item.style;
        }
    },
    methods: {
        ...mapActions("Maps", ["zoomToExtent"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        /**
         * @description
         * @returns {String | undefined} returns the source url of the img
         */
        getSvgSrc () {
            if (this.style?.getImage()?.constructor === Icon) {
                const src = this.style.getImage().getSrc();

                if (src.substring(src.length - 4) === ".svg") {
                    return src;
                }
            }
            return undefined;
        },
        /**
         * @description
         * @returns {String | undefined} returns the source url of the img
         */
        getIconSrc () {
            if (this.style?.getImage()?.constructor === Icon) {
                return this.style.getImage().getSrc();
            }
            return undefined;
        },
        /**
         * @returns {module:ol/Style | undefined} the Circle Style
         */
        getCircleStyle () {
            if (this.style?.getImage()?.constructor === CircleStyle) {
                return this.style.getImage();
            }
            return undefined;
        },
        /**
         * @param {module:ol/Style} style - the style object to read
         * @returns {String} the color
         */
        getSvgColor () {
            return this.convertColor(this.style.getImage().getColor()) || "grey";
        },
        /**
         * @param {module:ol/Style} style - the style object to read
         * @returns {String} the color
         */
        getBgColor (style) {
            return this.convertColor(style?.getFill()?.getColor()) || "grey";
        },
        /**
         * @param {module:ol/Style} style - the style object to read
         * @returns {String} the color
         */
        getBorderColor (style) {
            return this.convertColor(style?.getStroke()?.getColor()) || "grey";
        },
        /**
         * @param {number[] | String} color - the color to convert
         * @returns {String} the color string
         */
        convertColor (color) {
            if (color?.constructor === Array) {
                return color.length === 3 ? `rgb(${color.toString()})` : `rgba(${color.toString()})`;
            }
            if (color?.constructor === String) {
                return color;
            }
            return undefined;
        },
        /**
         * @param {module:ol/Style} style - the style object to read
         * @returns {String} the stroke width
         */
        getBorderWidth (style) {
            return style?.getStroke()?.getWidth() + "px" || "0px";
        },

        zoomToFeature () {
            const extent = this.item.feature.getGeometry().getExtent(),
                buffered = buffer(extent, 500);

            this.zoomToExtent({extent: buffered, options: {}});

            if (!this.item.enabled) {
                this.addSingleAlert({
                    content: this.$t("additional:modules.tools.cosi.featuresList.inactiveFeature"),
                    category: "Info",
                    displayClass: "info"
                });
            }
        },
        getTitle (item) {
            let title = "";
            const originalGeometryType = item.feature.get("originalGeometryType"),
                wrongGeometryType = ![undefined, "Point"].includes(originalGeometryType),
                noGeometryGiven = !(item.feature.get("dipasLocated") || item.feature.get("dipasLocated") === undefined);

            if (item.isSimulation || wrongGeometryType || noGeometryGiven) {
                title += this.$t("additional:modules.tools.cosi.featuresList.warning");
            }
            if (item.isSimulation) {
                title += this.$t("additional:modules.tools.cosi.featuresList.warningIsSimulated") + "\n";
            }
            if (wrongGeometryType) {
                title += this.$t("additional:modules.tools.cosi.featuresList.dipas.warningWrongGeometry") + originalGeometryType + "\n";
            }
            if (noGeometryGiven) {
                title += this.$t("additional:modules.tools.cosi.featuresList.dipas.warningNoGeometry") + "\n";
            }

            return title;
        }
    }
};
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
    <div
        class="feature-icon"
        role="button"
        tabindex="0"
        :title="getTitle(item)"
        @click="zoomToFeature"
        @keydown.enter="zoomToFeature"
    >
        <InlineSvg
            v-if="getSvgSrc()"
            class="marker"
            :src="getSvgSrc()"
            :fill="getSvgColor()"
            alt="no img"
        />
        <img
            v-else-if="getIconSrc()"
            class="marker"
            :src="getIconSrc()"
            alt="no img"
        >
        <span
            v-else-if="getCircleStyle()"
            class="marker"
            :style="{
                backgroundColor: getBgColor(getCircleStyle()),
                borderWidth: getBorderWidth(getCircleStyle()),
                borderColor: getBorderColor(getCircleStyle())
            }"
        />
        <span
            v-else
            class="marker"
            :style="{
                backgroundColor: getBgColor(style),
                borderWidth: getBorderWidth(style),
                borderColor: getBorderColor(style)
            }"
        />
        <span
            v-if="item.isSimulation"
            class="simulation-overlay"
        >
            *
        </span>
        <span
            v-else-if="item.isModified"
            class="simulation-overlay"
        >
            ⇄
        </span>
        <span
            v-if="![undefined, 'Point'].includes(item.feature.get('originalGeometryType'))"
            class="dipas-geometry-overlay"
        >
            *
        </span>
        <span
            v-if="!(item.feature.get('dipasLocated') || item.feature.get('dipasLocated') === undefined)"
            class="dipas-geometry-overlay"
        >
            ?
        </span>
    </div>
</template>

<style lang="scss" scoped>
    .feature-icon {
        margin-top: 8px;
        position: relative;
    }
    .marker {
        width: 30px;
        height: 30px;
        display: block;
        cursor: zoom-in;
    }
    span.marker {
        border-style: solid;
        border-radius: 50%;
    }
    span.simulation-overlay {
        position: absolute;
        font-family: 'Material Design Icons';
        right: -8px;
        top: -8px;
        color: #FC176B;
        font-size: 32px;
        line-height: 24px;
    }
    span.dipas-geometry-overlay {
        position: absolute;
        font-family: 'Material Design Icons';
        right: 24px;
        top: -8px;
        color: #ff0000;
        font-size: 20px;
        line-height: 20px;
    }
</style>
