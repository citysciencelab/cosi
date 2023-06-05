<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersFeatureLister";
import actions from "../store/actionsFeatureLister";
import mutations from "../store/mutationsFeatureLister";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../src/utils/getComponent";
import VectorLayer from "ol/layer/Vector.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../src/utils/isPhoneNumber.js";
import beautifyKey from "../../../src/utils/beautifyKey";
import {isWebLink} from "../../../src/utils/urlHelper";
import {isEmailAddress} from "../../../src/utils/isEmailAddress";
import toBold from "../../../src/utils/toBold";
import ModalItem from "../../../src/share-components/modals/components/ModalItem.vue";

export default {
    name: "WholeCityList",
    components: {
        ToolTemplate,
        ModalItem
    },
    data: function () {
        return {
            defaultTabClass: "",
            activeTabClass: "active",
            disabledTabClass: "disabled",
            visibleVectorLayers: [],
            showModal: false,
            pdfURL: "",
            pdfTitle: ""
        };
    },
    computed: {
        ...mapGetters("Tools/WholeCityList", Object.keys(getters)),
        ...mapGetters("Maps", ["getVisibleLayerList"]),
        linkPrefix: function () {
            return this.selectedFeature?.getTheme()?.params?.linkPrefix || "";
        },

        linkHrefKey: function () {
            return this.selectedFeature?.getTheme()?.params?.linkHrefKey || "";
        },

        linkTextKey: function () {
            return this.selectedFeature?.getTheme()?.params?.linkTextKey || "";
        },
        themeTabClasses: function () {
            return this.layerListView ? this.activeTabClass : this.defaultTabClass;
        },
        listTabClasses: function () {
            if (this.featureListView) {
                this.sortItems();
                return this.activeTabClass;
            }
            if (this.featureDetailView) {
                return this.defaultTabClass;
            }
            return this.disabledTabClass;
        },
        detailsTabClasses: function () {
            if (this.featureDetailView) {
                return this.activeTabClass;
            }
            if (this.selectedFeature) {
                return this.defaultTabClass;
            }
            return this.disabledTabClass;
        }
    },
    watch: {
        active () {
            if (this.active) {
                this.updateFeatureListerList();
            }
        }
    },
    mounted () {
        /* issue #846 - initially active by config means watcher won't trigger,
         * hence executing method on mounted is required */
        if (this.active) {
            this.$nextTick(this.updateFeatureListerList);

        }
    },
    created () {
        this.$on("close", this.close);
        this.listenToUpdatedSelectedLayerList();
    },
    methods: {
        ...mapActions("Tools/WholeCityList", Object.keys(actions)),
        ...mapActions("Maps", ["areLayerFeaturesLoaded"]),
        ...mapMutations("Tools/WholeCityList", Object.keys(mutations)),
        beautifyKey,
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        toBold,
        removeVerticalBar (value) {
            return value.replaceAll("|", "<br>");
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);
            const model = getComponent(this.$store.state.Tools.FeatureLister.id);

            if (model) {
                model.set("isActive", false);
            }
            this.$store.dispatch("Maps/removeHighlightFeature", "decrease", {root: true});
            this.resetToThemeChooser();
        },
        /**
         * Sorts the table items accoring to the clicked table header.
         * @returns {void}
         */
        async sortItems () {
            const tableHeaders = await document.getElementsByClassName("feature-lister-list-table-th");

            try {
                if (tableHeaders?.length) {
                    for (const th_elem of tableHeaders) {
                        let asc = true;
                        const index = Array.from(th_elem.parentNode.children).indexOf(th_elem);

                        th_elem.addEventListener("click", () => {
                            const arr = [...th_elem.closest("table").querySelectorAll("tbody tr")].slice(1);

                            arr.sort((a, b) => {
                                let a_val = "",
                                    b_val = "";

                                if (a.children[index] !== undefined && b.children[index] !== undefined) {
                                    a_val = a.children[index].innerText;
                                    b_val = b.children[index].innerText;
                                }
                                return asc ? a_val.localeCompare(b_val) : b_val.localeCompare(a_val);
                            });
                            arr.forEach(elem => {
                                th_elem.closest("table").querySelector("tbody").appendChild(elem);
                            });
                            asc = !asc;
                        });
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        },
        /**
         * Listens to updated selectedLayerList
         * @returns {void}
         */
        listenToUpdatedSelectedLayerList () {
            Backbone.Events.listenTo(Radio.channel("ModelList"), {
                "updatedSelectedLayerList": () => {
                    if (this.active) {
                        this.updateFeatureListerList();
                    }
                }
            });
        },
        /**
         * Updates the available Layers in the List
         * @returns {void}
         */
        async updateFeatureListerList () {
            this.visibleVectorLayers = [];
            await Promise.all(this.getVisibleLayerList.map(async layer => {
                if (layer instanceof VectorLayer && layer.get("typ") === "WFS" || layer.get("typ") === "GeoJSON") {
                    const layerSource = layer.getSource();
                    let alreadyInArray = false;

                    await this.areLayerFeaturesLoaded(layer.get("id"));

                    this.visibleVectorLayers.forEach(visibleLayer => {
                        if (visibleLayer.id === layer.get("id")) {
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        this.visibleVectorLayers.push({
                            name: layer.get("name"),
                            id: layer.get("id"),
                            features: layerSource.getFeatures(),
                            geometryType: layerSource.getFeatures()[0] ? layerSource.getFeatures()[0].getGeometry().getType() : null
                        });
                    }
                }
            }));

            // if currently chosen layer has been removed, reset to overview
            if (!this.visibleVectorLayers.find(({id}) => id === this.layerId)) {
                this.switchToThemes();
            }
        },

        /**
         * checks if the string has a pipe.
         * @param {string} value string to check.
         * @returns {boolean} whether the given value includes a pipe.
         */
        hasPipe: function (value) {
            return typeof value === "string" && value.includes("|");
        },

        /**
         * Gets the link url for each link text
         * @param {string} linkPrefix the prefix for the url
         * @param {string} linkHrefKey the link href key
         * @param {Number} index the index after diving with pipe
         * @returns {String} the link url
         */
        getLink (linkPrefix, linkHrefKey, index) {
            if (typeof index !== "number" || typeof linkHrefKey !== "string" || typeof linkHrefKey !== "string") {
                return "";
            }

            const linkProperties = this.selectedFeature.getProperties()[linkHrefKey];

            if (this.hasPipe(linkProperties)) {
                return linkPrefix + linkProperties.split("|")[index];
            }

            this.showModal = !this.showModal;
            return "";
        },

        /**
         * Decides if to open or close modal and sets the attributes for modal and iframe
         * @param {Boolean} showModel to decide if to open or close modal
         * @param {string} linkPrefix the prefix for the url
         * @param {string} linkHrefKey the link href key
         * @param {Number} index the index after diving with pipe
         * @param {string} title the title of the modal and iframe
         * @returns {void}
         */
        openModel (showModel, linkPrefix, linkHrefKey, index, title) {
            this.showModal = showModel;
            this.setIframeAttributes(linkPrefix, linkHrefKey, index, title);
        },

        /**
         * Sets the attributes for modal and iframe
         * @param {string} linkPrefix the prefix for the url
         * @param {string} linkHrefKey the link href key
         * @param {Number} index the index after diving with pipe
         * @param {string} title the title of the modal and iframe
         * @returns {void}
         */
        setIframeAttributes (linkPrefix, linkHrefKey, index, title) {
            this.pdfURL = this.getLink(linkPrefix, linkHrefKey, index);
            this.pdfTitle = title;
        }
    }
};
</script>

<template lang="html">
    <div>
        <ToolTemplate
            :id="id"
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
                    id="tool-feature-lister"
                >
                    <ul class="nav nav-tabs">
                        <li
                            id="tool-feature-lister-themeChooser"
                            role="presentation"
                            class="nav-item"
                        >
                            <a
                                href="#"
                                class="nav-link"
                                :class="themeTabClasses"
                                @click.prevent="switchToThemes()"
                            >{{ $t("modules.tools.featureLister.chooseTheme") }}</a>
                        </li>
                        <li
                            id="tool-feature-lister-list"
                            role="presentation"
                            class="nav-item"
                        >
                            <a
                                href="#"
                                class="nav-link"
                                :class="listTabClasses"
                                @click.prevent="switchToList(layer)"
                            >{{ $t("modules.tools.featureLister.list") }}</a>
                        </li>
                        <li
                            id="tool-feature-lister-details"
                            role="presentation"
                            class="nav-item"
                        >
                            <a
                                href="#"
                                class="nav-link"
                                :class="detailsTabClasses"
                                @click.prevent="switchToDetails()"
                            >{{ $t("modules.tools.featureLister.details") }}</a>
                        </li>
                    </ul>
                    <div
                        v-if="layerListView"
                        id="feature-lister-themes"
                        class="feature-lister-themes panel panel-default"
                    >
                        <div
                            id="feature-lister-themes-header"
                            class="panel-heading"
                        >
                            {{ $t("modules.tools.featureLister.visibleVectorLayers") }}
                        </div>
                        <ul
                            v-for="layer in visibleVectorLayers"
                            id="feature-lister-themes-ul"
                            :key="'tool-feature-lister-' + layer.id"
                            class="nav flex-column"
                        >
                            <li
                                :id="'feature-lister-layer-' + layer.id"
                                class="nav-item"
                                role="presentation"
                            >
                                <a
                                    href="#"
                                    class="nav-link"
                                    @click.prevent="switchToList(layer)"
                                >{{ layer.name }}</a>
                            </li>
                        </ul>
                    </div>
                    <template v-if="featureListView">
                        <div
                            id="feature-lister-list-header"
                            class="panel-heading"
                        >
                            <span>{{ layer.name }}</span>
                        </div>
                        <div
                            id="feature-lister-list"
                            class="panel panel-default feature-lister-list"
                        >
                            <div
                                class="table-responsive feature-lister-list-table-container"
                            >
                                <table
                                    id="feature-lister-list-table"
                                    class="table table-striped table-hover table-condensed table-bordered"
                                >
                                    <tbody>
                                        <tr class="feature-lister-list-table-tr">
                                            <th
                                                v-for="(header, index) in headers"
                                                :key="'tool-feature-lister-' + index"
                                                class="feature-lister-list-table-th"
                                            >
                                                <span class="bi-sort-alpha-down" />
                                                {{ header.value }}
                                            </th>
                                        </tr>
                                        <tr
                                            v-for="(feature, index) in featureProperties"
                                            :id="'tool-feature-lister-feature-' + index"
                                            :key="'tool-feature-lister-' + index"
                                            class="feature-lister-list-table-tr"
                                            @click="clickOnFeature(index)"
                                            @mouseover="hoverOverFeature(index)"
                                            @focus="hoverOverFeature(index)"
                                        >
                                            <template v-if="index < shownFeatures">
                                                <td
                                                    v-for="(property, i) in feature"
                                                    :key="'tool-feature-lister-' + i"
                                                    class="feature-lister-list-table-td"
                                                >
                                                    {{ property }}
                                                </td>
                                            </template>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div
                                class="panel-footer feature-lister-list-footer"
                            >
                                <button
                                    type="button"
                                    class="btn btn-primary navbar-btn feature-lister-list-button"
                                    :disabled="featureCount <= maxFeatures || shownFeatures === featureCount"
                                    @click="showMore()"
                                >
                                    <span
                                        class="bi-box-arrow-in-up"
                                        aria-hidden="true"
                                    /> {{ $t("modules.tools.featureLister.more") }}
                                </button>
                                <p
                                    class="navbar-text feature-lister-list-message"
                                >
                                    {{ $t("modules.tools.featureLister.key", {shownFeatures, featureCount}) }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template v-if="featureDetailView">
                        <div
                            id="feature-lister-details-header"
                            class="panel-heading"
                        >
                            <span> {{ $t("modules.tools.featureLister.detailsOfSelected") }} </span>
                        </div>
                        <div
                            id="feature-lister-details"
                            class="panel panel-default feature-lister-details"
                        >
                            <ul
                                v-for="(feature, key) in featureDetails"
                                :key="'tool-feature-lister-' + key"
                                class="list-group feature-lister-details-ul"
                            >
                                <li class="list-group-item feature-lister-details-li">
                                    <strong>
                                        {{ beautifyKey(feature[0]) }}
                                    </strong>
                                </li>
                                <li class="list-group-item feature-lister-details-li">
                                    <p v-if="isWebLink(feature[1])">
                                        <a
                                            :href="feature[1]"
                                            target="_blank"
                                        >{{ feature[1] }}</a>
                                    </p>
                                    <p v-else-if="isPhoneNumber(feature[1])">
                                        <a :href="getPhoneNumberAsWebLink(feature[1])">{{ feature[1] }}</a>
                                    </p>
                                    <p v-else-if="isEmailAddress(feature[1])">
                                        <a :href="`mailto:${feature[1]}`">{{ feature[1] }}</a>
                                    </p>
                                    <template v-else-if="hasPipe(feature[1]) && feature[0] !== linkTextKey">
                                        <p
                                            v-for="(splitValue, splitKey) in feature[1].split('|')"
                                            :key="splitKey"
                                        >
                                            {{ splitValue }}
                                        </p>
                                    </template>
                                    <p v-else-if="hasPipe(feature[1]) && feature[0] === linkTextKey">
                                        <ul>
                                            <li
                                                v-for="(splitValue, splitKey) in feature[1].split('|')"
                                                :key="splitKey"
                                                class="link-style"
                                            >
                                                <span
                                                    @click="openModel(true, linkPrefix, linkHrefKey, splitKey, splitValue)"
                                                    @keydown="openModel(true, linkPrefix, linkHrefKey, splitKey, splitValue)"
                                                >
                                                    {{ splitValue }}
                                                </span>
                                            </li>
                                        </ul>
                                    </p>
                                    <p
                                        v-else-if="typeof feature[1] === 'string' && feature[1].includes(';')"
                                    >
                                        <span v-html="toBold(feature[1], key)" />
                                    </p>
                                    <p
                                        v-else-if="typeof feature[1] === 'string' && feature[1].includes('|')"
                                    >
                                        <span v-html="removeVerticalBar(feature[1])" />
                                    </p>
                                    <p
                                        v-else-if="typeof feature[1] === 'string' && feature[1].includes('<br>')"
                                    >
                                        <span v-html="feature[1]" />
                                    </p>
                                    <p v-else>
                                        {{ feature[1] }}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
            </template>
        </ToolTemplate>
        <ModalItem
            :show-modal="showModal"
            modal-inner-wrapper-style="width: 90%; height: 90%"
            modal-content-container-style="padding: 20px"
            @modalHid="openModel(false)"
        >
            <template #header>
                <h5 class="px-2 mt-2">
                    {{ pdfTitle }}
                </h5>
            </template>
            <template #default>
                <iframe
                    :src="pdfURL"
                    :title="pdfTitle"
                />
            </template>
        </ModalItem>
    </div>
</template>


<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    @import "~variables";

#tool-feature-lister {
    * {
        border-radius: 0;
    }
}

/***** Desktop *****/
/***** Mobil *****/
#featureLister {
    width: fit-content;
    max-width: 90%;
}
.feature-lister-list-table-th {
    cursor: pointer;
    >span {
        float: left;
        width: 15px;
        color: $dark_grey;
    }
    >.feature-lister-list-table-th-sorted {
        color: $black;
    }
}
.feature-lister-list-table-container {
    border-left: 1px solid $light_grey !important;
    border-right: 1px solid $light_grey !important;
}
#feature-lister-list-table {
    overflow: auto;
}
.feature-lister-list-button {
    position: relative;
    right: 0;
}
.feature-lister-list-message {
    float: left;
    text-align: center;
    align-items: center;
}
.feature-lister-details-ul {
    max-height: 400px;
    overflow: auto;
    cursor: auto;
}
.feature-lister-list-table-td {
    height: 15px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.feature-lister-list-table-tr {
    cursor: pointer;
}
.feature-lister-details {
    display: block;
    margin-bottom: 0;
    max-height: 100%;
    overflow: auto;
}
.feature-lister-list {
    margin-bottom: 0;
    display: contents;
    overflow: auto;
}
.feature-lister-themes {
    width: 100%;
}
.panel-heading {
    background: $light_grey;
    color: $dark_grey;
    cursor: default;
    // border-left: 1px solid $dark_grey;
    // border-right: 1px solid $dark_grey;
    padding: 10px 15px;
    // border-bottom: 1px solid transparent;
}
#feature-lister-themes-ul {
    .nav-item:hover {
        background-color: $light_grey;
    }
}

iframe {
    position: absolute;
    width: calc(100% - 50px);
    height:calc(100% - 80px)
}

.link-style {
    color: $link-color;
    cursor: pointer;
    span {
        width: 100%;
        display: block;
        &:hover {
            color: #296292
        }
    }
}
</style>
