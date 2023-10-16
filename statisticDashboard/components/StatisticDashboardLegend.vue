<script>
export default {
    name: "StatisticDashboardLegend",
    props: {
        legendValue: {
            type: Array,
            required: true
        },
        title: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        showNoticeText: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>

<template>
    <div
        id="legend-content"
        class="accordion"
    >
        <div class="accordion-item py-0">
            <h4
                v-if="title"
                class="mb-3 mx-0 my-0 table-title"
            >
                <button
                    class="accordion-button p-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseLegend"
                    aria-expanded="true"
                    aria-controls="collapseLegend"
                >
                    {{ showNoticeText === false ? $t("additional:modules.tools.statisticDashboard.legend.legend") + " - " + title : $t("additional:modules.tools.statisticDashboard.legend.legend") }}
                </button>
            </h4>
            <div class="container px-0">
                <div
                    id="collapseLegend"
                    class="accordion-collapse collapse show"
                    aria-labelledby="headingLegend"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body ps-0 py-0">
                        <div
                            v-if="!showNoticeText"
                        >
                            <div class="row align-items-center ps-4">
                                <div
                                    v-for="legendObj in legendValue"
                                    :key="legendObj.name"
                                    class="col layer"
                                >
                                    <div class="row align-items-center">
                                        <img
                                            :alt="legendObj.name ? legendObj.name : legendObj.name"
                                            :src="legendObj.graphic"
                                            class="col-1 col-xs px-0 left"
                                        >
                                        <span
                                            class="col col-xs legend-names px-0 ms-1"
                                        >
                                            {{ legendObj.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="more-statistics">
                                {{ $t("additional:modules.tools.statisticDashboard.legend.nodata") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="mb-0">
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.accordion-button {
    font-family: $font_family_accent;
    color: $light_blue;
    font-size: 14px;
}
img {
    width: 20px;
}
.legend-names {
    font-size: 10px;
}
 .accordion-item{
            border: none;
        }
        .accordion-button {
            width: auto;
            margin-bottom: 0px;
            --bs-accordion-btn-icon-width: 1em;
                &:not(.collapsed) {
                    background-color: $white;
                    box-shadow: none;
                }
                &::after {
                    margin-left: 10px;
                }
                &::before {
                    margin-left: 0;
                }
                &:focus {
                    box-shadow: none;
                }
        }
.more-statistics {
    color: $secondary_icon_button;
}
</style>
