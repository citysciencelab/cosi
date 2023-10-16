<script>
import Multiselect from "vue-multiselect";
import isObject from "../../../src/utils/isObject";
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "StatisticDashboardFilter",
    components: {
        Multiselect
    },
    props: {
        categories: {
            type: Array,
            required: true
        },
        areCategoriesGrouped: {
            type: Boolean,
            required: true
        },
        timeStepsFilter: {
            type: Array,
            required: true
        },
        statistics: {
            type: [Object, Boolean],
            required: false,
            default: false
        },
        regions: {
            type: Array,
            required: true
        }
    },
    emits: ["changeCategory", "changeFilterSettings", "resetStatistics"],
    data () {
        return {
            showAllHiddenStatistics: false
        };
    },
    computed: {
        /**
         * Returns the categories name or joins it if it is an array.
         * @returns {String} The name or comma seperated names.
         */
        selectedCategoriesName () {
            return Array.isArray(this.selectedCategories) ? this.selectedCategories.map(category => category?.name).join(", ") : this.selectedCategories?.name;
        },
        /**
         * Checks if statistics are selected.
         * @returns {Boolean} True if at least on is selected, otherwise false.
         */
        areStatisticsSelected () {
            return isObject(this.selectedStatistics) && Object.keys(this.selectedStatistics).length !== 0;
        },
        /**
         * Returns true or false, depending on the number of statistics.
         * @returns {Boolean} True if the number of statistics are more than five.
         */
        countSelectedStatistics () {
            return isObject(this.selectedStatistics) && Object.keys(this.selectedStatistics).length > 5;
        },

        ...mapGetters("Tools/StatisticDashboard", ["selectedCategories", "selectedRegions", "selectedRegionsValues", "selectedDates", "selectedDatesValues", "selectedStatistics", "selectedReferenceData"])
    },
    watch: {
        /**
         * Resets the statistics and emits the name of the selected category.
         * @param {Object} value - The selected category.
         * @returns {void}
         */
        selectedCategories (value) {
            this.resetStatistics();
            this.$emit("changeCategory", value?.name);
        },

        selectedStatistics (value) {
            this.emitFilterSettings(value, this.selectedRegionsValues, this.selectedDatesValues);
        },
        selectedDates () {
            this.emitFilterSettings(this.selectedStatistics, this.selectedRegionsValues, this.selectedDatesValues);
        },
        selectedRegions () {
            this.emitFilterSettings(this.selectedStatistics, this.selectedRegionsValues, this.selectedDatesValues);
        }
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", ["setSelectedCategories", "setSelectedRegions", "setSelectedDates", "setSelectedStatistics"]),

        /**
         * Checks if all filter settings are selected.
         * @param {Object[]} statistics - The selected statistics.
         * @param {String[]} regions - The names of the selected regions.
         * @param {Object[]} dates - The selected dates.
         * @return {Number} 1 if true otherwise 0.
         */
        allFilterSettingsSelected (statistics, regions, dates) {
            return isObject(statistics) && Object.keys(statistics).length && regions.length && dates.length;
        },

        /**
         * Emits the filter settings if all are selected.
         * @param {Object[]} statistics - The selected statistics.
         * @param {String[]} regions - The names of the selected regions.
         * @param {Object[]} dates - The selected dates.
         * @return {void}
         */
        emitFilterSettings (statistics, regions, dates) {
            if (this.allFilterSettingsSelected(statistics, regions, dates)) {
                this.$emit("changeFilterSettings", regions, dates, this.selectedReferenceData);
            }
            else {
                this.$emit("resetStatistics");
            }
        },

        /**
         * Add or remove a statistic.
         * @param {Object} statistic - The statistic to toggle.
         * @param {Object[]} selectedStatistics - The selected statistics.
         * @param {String} key - The key of the statistic to be toggled.
         * @returns {void}
         */
        toggleStatistic (statistic, selectedStatistics, key) {
            const statisticToToogle = Object.prototype.hasOwnProperty.call(selectedStatistics, key);

            if (!statisticToToogle) {
                this.$set(selectedStatistics, key, statistic);
            }
            else {
                this.removeStatistic(selectedStatistics, key);
            }
        },

        /**
         * Removes an existing statistic.
         * @param {Object[]} selectedStatistics - The selected statistics.
         * @param {String} key - The key of the statistic to be removed.
         * @returns {void}
         */
        removeStatistic (selectedStatistics, key) {
            if (Object.keys(this.selectedStatistics).length >= 2) {
                this.$delete(selectedStatistics, key);
            }
            else {
                this.resetStatistics();
            }
        },

        /**
         * Resets all statistics.
         * @returns {void}
         */
        resetStatistics () {
            this.setSelectedStatistics({});
            this.$emit("resetStatistics");
        }
    }
};
</script>

<template>
    <div
        id="accordionFilter"
        class="accordion"
    >
        <div class="accordion-item py-0">
            <h5 class="heading-dashboard">
                <button
                    class="accordion-button my-0 ps-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFilter"
                    aria-expanded="true"
                    aria-controls="collapseFilter"
                >
                    {{ $t("additional:modules.tools.statisticDashboard.button.filter") }} - {{ selectedCategoriesName }}
                </button>
            </h5>
        </div>
        <div
            id="collapseFilter"
            class="accordion-collapse collapse show"
            aria-labelledby="headingFilter"
            data-bs-parent="#accordionExample"
        >
            <div class="accordion-body ps-0 py-0">
                <div class="filtercontainer text-left mt-1">
                    <div class="row mb-2">
                        <div class="col-md">
                            <label
                                class="col-form-label-sm"
                                for="categoryfilter"
                            >
                                {{ $t("additional:modules.tools.statisticDashboard.label.category") }}</label>
                            <Multiselect
                                id="categoryfilter"
                                :value="selectedCategories"
                                :options="categories"
                                :searchable="true"
                                :close-on-select="true"
                                :show-labels="false"
                                :allow-empty="true"
                                :multiple="false"
                                :group-values="areCategoriesGrouped ? 'categories' : ''"
                                :group-label="areCategoriesGrouped ? 'name' : ''"
                                :group-select="false"
                                :placeholder="$t('additional:modules.tools.statisticDashboard.reference.placeholder')"
                                track-by="name"
                                label="name"
                                @input="setSelectedCategories"
                            />
                        </div>
                        <div
                            class="col-md"
                        >
                            <label
                                class="col-form-label-sm"
                                for="areafilter"
                            >{{ $t("additional:modules.tools.statisticDashboard.label.area") }}
                            </label>
                            <Multiselect
                                id="areafilter"
                                :value="selectedRegions"
                                :multiple="true"
                                :options="regions"
                                :searchable="false"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :show-labels="false"
                                :limit="1"
                                :limit-text="count => count + ' ' + $t('additional:modules.tools.statisticDashboard.label.more')"
                                :allow-empty="true"
                                :placeholder="$t('additional:modules.tools.statisticDashboard.reference.placeholder')"
                                label="label"
                                track-by="label"
                                @input="setSelectedRegions"
                            />
                        </div>
                        <div
                            class="col-md"
                        >
                            <label
                                class="col-form-label-sm"
                                for="timefilter"
                            >
                                {{ $t("additional:modules.tools.statisticDashboard.label.year") }}</label>
                            <Multiselect
                                id="timefilter"
                                :value="selectedDates"
                                :multiple="true"
                                :options="timeStepsFilter"
                                :searchable="false"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :show-labels="false"
                                :limit="1"
                                :limit-text="count => count + ' ' + $t('additional:modules.tools.statisticDashboard.label.more')"
                                :allow-empty="true"
                                :placeholder="$t('additional:modules.tools.statisticDashboard.reference.placeholder')"
                                label="label"
                                track-by="label"
                                @input="setSelectedDates"
                            />
                        </div>
                    </div>
                    <div class="row align-items-end gx-1">
                        <div class="col col-md-auto py-1">
                            <label
                                class="col-form-label-sm"
                                for="dropdownButton"
                            >
                                {{ $t("additional:modules.tools.statisticDashboard.label.statistics") }}</label>
                            <div class="dropdown">
                                <button
                                    class="btn btn-sm btn-primary rounded-pill lh-1 me-2"
                                    :v-model="selectedStatistics"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-plus fs-6 pe-2" />{{ $t("additional:modules.tools.statisticDashboard.button.add") }}
                                </button>
                                <ul
                                    class="dropdown-menu"
                                    aria="dropdownButton"
                                >
                                    <li
                                        v-for="(stat, key, index) in statistics"
                                        :key="index"
                                        class="dropdown-line"
                                    >
                                        <button
                                            type="button"
                                            class="btn btn-link btn-sm px-2 py-2 dropdown-item"
                                            :class="Object.prototype.hasOwnProperty.call(selectedStatistics, key) ? 'selected' : ''"
                                            @click="toggleStatistic(stat, selectedStatistics, key)"
                                        >
                                            {{ stat.name }}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button
                            v-for="(stat, key, index) in selectedStatistics"
                            :key="index"
                            class="col col-md-auto btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none me-2 mb-1 mt-1 btn-pb"
                            :class="index > 4 && !showAllHiddenStatistics ? 'more-statistics' : ''"
                            aria-label="Close"
                            @click="removeStatistic(selectedStatistics, key)"
                        >
                            {{ stat.name }}
                            <i class="bi bi-x fs-5 align-middle" />
                        </button>
                        <div
                            v-if="countSelectedStatistics"
                            class="col col-md-2 py-1"
                        >
                            <button
                                id="more-button"
                                type="button"
                                class="btn btn-link btn-sm p-0"
                                @click="showAllHiddenStatistics = !showAllHiddenStatistics"
                            >
                                {{ !showAllHiddenStatistics ? $t("additional:modules.tools.statisticDashboard.button.showMore") : $t("additional:modules.tools.statisticDashboard.button.showLess") }}
                            </button>
                        </div>
                        <div
                            v-if="areStatisticsSelected"
                            class="col col-md-1 py-1"
                        >
                            <button
                                id="reset-button"
                                type="button"
                                class="btn btn-link btn-sm p-0"
                                @click="resetStatistics()"
                            >
                                {{ $t("additional:modules.tools.statisticDashboard.button.reset") }}
                            </button>
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

    .dropdown-menu > li {
        > .dropdown-item {
            &:hover {
                background: $light_grey;
                color: $black;
            }
            &:focus, &:active {
                background-color: $light_blue;
                color: $white;
            }
        }
    }

    .selected {
        background-color: $light_blue;
        color: $white;
    }

    .btn-outline-secondary, label {
        color: $dark_grey;
    }

    .btn-pb {
        padding-bottom: 2px;
    }

    .btn-primary, .btn-primary:enabled, .btn-primary:focus {
        background-color: $light_blue;
    }
    .accordion {
        --bs-border-color: $white;
        .accordion-item{
            border: none;
            height: 4.0em;
        }
        .accordion-button {
            font-family: "MasterPortalFont Bold";
            color: $light_blue;
            font-size: 14px;
            width: auto;
            margin-bottom: 0px;
            --bs-accordion-btn-icon-width: 1em;
                &:not(.collapsed) {
                    background-color: $white;
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
    }

    .more-statistics {
        display: none;
    }
</style>

<style lang="scss">
@import "~variables";

.static-dashboard .multiselect, .filtercontainer .multiselect__input, .filtercontainer .multiselect__single {
    font-family: inherit;
    font-size: 11px;
}
.static-dashboard .multiselect__tags, .filtercontainer .multiselect__tag {
  font-size: 11px;
}

.static-dashboard .multiselect__strong{
    font-family: "MasterPortalFont Bold";
}

.static-dashboard .multiselect__tag {
        border-radius: 25px;
        padding-top: 5px;
        .multiselect__tag-icon:after {
            color: $white;
        }
        .multiselect__tag-icon:hover:after, .multiselect__tag-icon:focus:after {
            color: $light_blue;
        }
}

.static-dashboard .multiselect__option--selected.multiselect__option--highlight,
.static-dashboard .multiselect__option--selected.multiselect__option--highlight:after,
.static-dashboard .multiselect__option:after,
.static-dashboard .multiselect__option--selected,
.static-dashboard .multiselect__option--selected:after,
.static-dashboard .multiselect__tag
 {
  background: $light_blue;
  color: $white;
  font-weight: normal;
}

.static-dashboard .multiselect__option--highlight,
.static-dashboard .multiselect__option--highlight:after {
    background: $light_grey;
    color: $black;
}

.static-dashboard .multiselect__select {
    height: 30px;
}
</style>
