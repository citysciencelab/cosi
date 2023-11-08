<script>
import DifferenceModal from "./StatisticDashboardDifference.vue";
import StatisticSwitcher from "./StatisticDashboardSwitcher.vue";
import isObject from "../../../src/utils/isObject";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersStatisticDashboard";
import mutations from "../store/mutationsStatisticDashboard";

export default {
    name: "StatisticDashboardControls",
    components: {
        DifferenceModal,
        StatisticSwitcher
    },
    props: {
        descriptions: {
            type: Array,
            required: false,
            default: () => []
        },
        referenceData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            currentDescriptionIndex: 0,
            showDifferenceModal: false,
            referenceLabel: undefined,
            buttonGroupControls: [{
                name: "Tabelle",
                icon: "bi bi-table pe-2"
            },
            {
                name: "Diagramm",
                icon: "bi bi-bar-chart pe-2"
            }],
            switchValue: "",
            referenceTag: undefined
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters)),

        /**
         * Checks if there is at least one description
         * @returns {Boolean} True if there is one otherwise false.
         */
        hasDescription () {
            if (this.descriptions.length === 0) {
                return false;
            }
            return true;
        },
        /**
         * Gets the title of the current description.
         * @returns {void}
         */
        titleDescription () {
            return this.descriptions[this.currentDescriptionIndex].title;
        },
        /**
         * Gets the content of the current description.
         * @returns {void}
         */
        contentDescription () {
            return this.descriptions[this.currentDescriptionIndex].content;
        },
        precheckedViewSwitcher () {
            if (this.chartTableToggle === "table") {
                return this.buttonGroupControls[0].name;
            }
            return this.buttonGroupControls[1].name;
        }
    },
    watch: {
        switchValue () {
            this.$emit("showChartTable");
        },
        selectedReferenceData (val) {
            this.handleReferenceTag(val);
        },
        selectedReferenceValueTag (val) {
            if (typeof this.referenceTag !== "undefined") {
                if (this.referenceTag.split(":").length - 1 === 1) {
                    this.referenceTag = this.referenceTag.split(":")[0];
                }
                if (typeof val === "number") {
                    this.referenceTag = this.referenceTag + ": " + val;
                }
            }
        }
    },
    mounted () {
        if (typeof this.selectedReferenceValueTag !== "undefined") {
            this.referenceTag = this.selectedReferenceValueTag;
        }
        else if (this.selectedReferenceData) {
            this.handleReferenceTag(this.selectedReferenceData);
        }
    },
    beforeDestroy () {
        this.setSelectedReferenceValueTag(this.referenceTag);
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),
        /**
         * Handles the referenceTag value for given property.
         * @param {String|Object} val The value to handle.
         * @returns {void}
         */
        handleReferenceTag (val) {
            if (typeof val?.value === "string") {
                this.referenceTag = val.value + ": ";
            }
            if (isObject(val?.value) && typeof val.value.label === "string") {
                this.referenceTag = val.value.label;
            }
            else if (typeof val === "undefined") {
                this.referenceTag = undefined;
            }
        },
        /**
         * Sets the description index one higher.
         * If the index reaches the end of the descriptions,it is set back to the beginning.
         * @returns {void}
         */
        nextDescription () {
            if (this.currentDescriptionIndex < this.descriptions.length - 1) {
                this.currentDescriptionIndex++;
            }
            else {
                this.currentDescriptionIndex = 0;
            }
        },
        /**
         * Sets the description index one lower.
         * If the index reaches the beginning of the descriptions, it is set to the end again.
         * @returns {void}
         */
        prevDescription () {
            if (this.currentDescriptionIndex > 0) {
                this.currentDescriptionIndex--;
            }
            else {
                this.currentDescriptionIndex = this.descriptions.length - 1;
            }
        },
        /**
         * Shows the difference modal
         * @param {Boolean} value - true to show difference Modal
         * @returns {void}
         */
        showDifference (value = true) {
            this.showDifferenceModal = value;
        },
        /**
         * Sets chart or table view
         * @param {String} value - The name of clicked button.
         * @returns {void}
         */
        handleView (value) {
            this.switchValue = value;
        },

        /**
         * Removes the reference data
         * @returns {void}
         */
        removeReference () {
            this.setSelectedReferenceData(undefined);
        }
    }
};
</script>

<template>
    <div class="d-flex flex-row flex-wrap align-items-center justify-content-between mb-3 dashboard-controls">
        <!-- Descriptions -->
        <div
            v-if="hasDescription"
            class="flex-grow-1 pb-1 description"
        >
            <div class="hstack gap-1">
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="prevDescription"
                    @keydown="prevDescription"
                >
                    <i class="bi bi-chevron-left" />
                </button>
                <p class="pe-2 fs-6 description-content">
                    {{ titleDescription }}<br>{{ contentDescription }}
                </p>
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="nextDescription"
                    @keydown="nextDescription"
                >
                    <i class="bi bi-chevron-right" />
                </button>
            </div>
        </div>
        <div
            v-else
            class="flex-grow-1 pb-1 descriptions-placeholder"
        >
            <div
                class="gap-1 empty"
            />
        </div>
        <!-- Controls -->
        <div class="btn-toolbar">
            <StatisticSwitcher
                :buttons="buttonGroupControls"
                :pre-checked-value="precheckedViewSwitcher"
                class="btn-table-diagram"
                group="dataViews"
                @showView="handleView"
            />
            <div
                class="btn-group me-2 pb-1 difference-button"
                data-toggle="tooltip"
                data-placement="top"
                :title="$t('additional:modules.tools.statisticDashboard.reference.description')"
            >
                <button
                    type="button"
                    :class="typeof referenceTag === 'string' || showDifferenceModal ? 'btn button-style btn-sm lh-1' : 'btn button-style-outline btn-sm lh-1'"
                    @click="showDifference"
                >
                    <i class="bi bi-intersect pe-2" />{{ $t("additional:modules.tools.statisticDashboard.button.difference") }}
                </button>
                <template v-if="showDifferenceModal">
                    <DifferenceModal
                        class="difference-modal"
                        :reference-data="referenceData"
                        @showDifference="showDifference"
                    />
                </template>
            </div>
            <div
                v-if="typeof referenceTag === 'string'"
                class="reference-tag"
            >
                <div class="col-form-label-sm">
                    {{ $t("additional:modules.tools.statisticDashboard.reference.tagLabel") }}:
                </div>
                <button
                    class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mt-1 me-2 btn-pb"
                    aria-label="Close"
                    @click="removeReference()"
                    @keydown.enter="removeReference()"
                >
                    {{ referenceTag }}
                    <i class="bi bi-x fs-5 align-middle" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.dashboard-controls {
    .description {
        margin-top: 25px;
        .description-content {
            width: 350px;
        }
        .description-icons {
            opacity: 0.5;
        }
        .description-icons:hover {
            opacity: 1;
        }
    }
    .descriptions-placeholder {
         margin-top: 10px;
        .empty {
            width: 350px;
        }
    }
}

.button-style, .button-style:hover, .button-style:active, .button-style-outline:hover {
    background-color: $light_blue;
    color: $white;
}
.button-style-outline {
    border-color: $light_blue;
    color: $light_blue;
}

.btn-table-diagram {
    margin-top: 25px;
}

.difference-button {
    position: relative;
    max-height: 30px;
    margin-top: 25px;
    .difference-modal {
        position: absolute;
        z-index: 1;
        background-color: #ffffff;
        border: 1px solid #dee2e6;
        right: 0px;
        top: 30px;
        padding: 20px;
        min-width: 210px;
    }
}

.reference-tag {
    float: right;
    > div {
        display: block;
        margin-left: 10px;
        margin-bottom: -5px;
    }
    button {
        color: $dark_grey;
    }
}
</style>
