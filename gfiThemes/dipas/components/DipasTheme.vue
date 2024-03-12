<script>
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import {mapGetters} from "vuex";

export default {
    name: "DipasTheme",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(["uiStyle"]),
        ...mapGetters("Tools/SaveSelection", ["layerVisibilities", "layerIds", "layerTransparencies"]),
        cssVars () {
            return {
                "--buttonColor": this.feature.getMappedProperties().ButtonBackgroundColor,
                "--buttonFontColor": this.feature.getMappedProperties().ButtonTextColor,
                "--buttonHoverColor": this.feature.getMappedProperties().ButtonBackgroundHoverColor
            };
        }
    },
    methods: {
        /**
         * Generates the path for gfi icons.
         * @param  {String} value - gfi feature attribute value for 'Kategorie'(Thema)
         * @returns {String} the path to the icons
         */
        calculateIconPath (value) {
            const styleObject = styleList.returnStyleObject("contributions");
            let valueStyle,
                iconPath = this.feature.getTheme()?.params?.gfiIconPath;

            if (styleObject?.rules?.length > 0) {
                valueStyle = styleObject.rules.filter(rule => {
                    return rule.conditions.properties.Thema === value;
                });
                iconPath = this.fetchIconPath(valueStyle);
            }

            return iconPath;
        },
        /**
         * @deprecated with new vectorStyle module. Should be removed with version 3.0.
         * Getting icon from old style format
         * @param  {Array} valueStyle - the list of style values
         * @returns {String} the path of the icons
         */
        fetchIconPathDeprecated (valueStyle) {
            let finalIconPath = this.feature.getTheme()?.params?.gfiIconPath;

            if (valueStyle && valueStyle.length > 0 && ("imageName" in valueStyle[0])) {
                finalIconPath = valueStyle[0].imageName;
            }
            return finalIconPath;
        },

        /**
         * Getting icon from new style format
         * @param  {Array} valueStyle - the list of style values
         * @returns {String} the path of the icons
         */
        fetchIconPath (valueStyle) {
            let finalIconPath = this.feature.getTheme()?.params?.gfiIconPath;

            if (valueStyle && valueStyle.length > 0 && ("imageName" in valueStyle[0].style)) {
                finalIconPath = valueStyle[0].style.imageName;
            }
            return finalIconPath;
        },

        /**
         * Generates the valid link to the contribution, depending on the environment.
         * @param  {String} link - gfi feature attribute value for 'link'
         * @param  {String} nid - gfi feature attribute value for 'nid'
         * @returns {String} the link to the contribution
         */
        modifyContributionLink (link, nid) {
            let parentLocation = "",
                contributionLink = "";

            if (!this.isTableStyle()) {
                const urlParams = "?Map/layerIds=" + this.layerIds +
                    "&visibility=" + this.layerVisibilities +
                    "&transparency=" + this.layerTransparencies +
                    "&Map/center=[" + this.$store.state.Maps.center +
                    "]&Map/zoomLevel=" + this.$store.state.Maps.zoom;

                parentLocation = document.referrer.split("?")[0];
                contributionLink = parentLocation.split("#")[0] + "#/contribution/" + nid + urlParams;
            }
            else {
                contributionLink = link;
            }

            return contributionLink;
        },

        /**
         * checks if the table style is set in the uiStyle
         * @returns {Boolean} true if table style is set otherwise false
         */
        isTableStyle () {
            return this.uiStyle === "TABLE";
        }
    }
};
</script>


<template>
    <div
        class="dipas-gfi-content"
        :style="cssVars"
    >
        <div class="dipas-gfi-icon">
            <img
                :src="calculateIconPath(feature.getMappedProperties().Kategorie)"
                alt="Icon"
            >
        </div>
        <div class="dipas-gfi-thema">
            {{ feature.getMappedProperties().Kategorie }}
        </div>
        <div
            v-if="!isTableStyle() && feature.getMappedProperties().link"
            class="dipas-gfi-name"
        >
            <a
                :href="modifyContributionLink(feature.getMappedProperties().link, feature.getMappedProperties().nid)"
                target="_top"
            >{{ feature.getMappedProperties().name }}</a>
        </div>
        <div
            v-else
            class="dipas-gfi-name"
        >
            {{ feature.getMappedProperties().name }}
        </div>
        <div
            v-if="feature.getMappedProperties().description"
            class="dipas-gfi-description"
        >
            {{ feature.getMappedProperties().description }}
        </div>
        <a
            v-if="!isTableStyle() && feature.getMappedProperties().link"
            class="dipas-gfi-more"
            :href="modifyContributionLink(feature.getMappedProperties().link, feature.getMappedProperties().nid)"
            target="_top"
        >{{ $t("additional:addons.gfiThemes.dipas.moreLink") }}</a>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .dipas-gfi-content {
        margin: 12px;
        font-family: $font_family_default;
        max-width: 400px;
        .dipas-gfi-thema {
            font-family: $font_family_default;
            font-size: 14px;
            color: $dark_grey;
            text-transform: uppercase;
        }
        .dipas-gfi-name {
            font-family: $font_family_accent;
            font-size: 18px;
            color: $primary;
            padding-bottom: 16px;

            a {
                color: $dark_blue;
            }
        }
        .dipas-gfi-description {
            font-family: $font_family_default;
            font-size: 14px;
            color: $dark_grey;
        }

        .dipas-gfi-icon img{
            width: 30px;
            float: left;
            margin: 0px 10px 10px 0px;
        }

        a.dipas-gfi-more {
            font-size: 12px;
            border-radius: 2px;
            margin-top: 20px;
            padding: 7px 8px 4px;
            background-color: var(--buttonColor, #e10019);
            color: var(--buttonFontColor, #ffffff);
            font-family: $font_family_accent;
            text-transform: uppercase;
            display: inline-block;

            &:hover {
                    background-color: var(--buttonHoverColor, #b4081b);
                }
        }
}

</style>
