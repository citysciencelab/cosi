<script>
import Multiselect from "vue-multiselect";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersStatisticDashboard";
import mutations from "../store/mutationsStatisticDashboard";
import isObject from "../../../src/utils/isObject";
import StatisticSwitcher from "./StatisticDashboardSwitcher.vue";

export default {
    name: "StatisticDashboardDifference",
    components: {
        Multiselect,
        StatisticSwitcher
    },
    props: {
        referenceData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            buttonGroupReference: [{
                name: i18next.t("additional:modules.tools.statisticDashboard.label.year")
            },
            {
                name: i18next.t("additional:modules.tools.statisticDashboard.label.area")
            }],
            dateOptions: this.referenceData.date,
            regionOptions: this.referenceData.region,
            selectedDate: "",
            selectedRegion: "",
            referenceType: ""
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters))
    },
    created () {
        document.addEventListener("click", this.handleClickOutside);
    },
    mounted () {
        this.handleReference(this.buttonGroupReference[0].name);
        if (isObject(this.selectedReferenceData)) {
            if (this.selectedReferenceData.type === "date" && isObject(this.selectedReferenceData.value)) {
                this.selectedDate = this.selectedReferenceData.value;
            }
            else if (this.selectedReferenceData.type === "region") {
                this.handleReference(this.buttonGroupReference[1].name);
                this.selectedRegion = this.selectedReferenceData.value;
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),

        /**
        * Set the dropdown type.
        * @param {String} value The name of clicked button.
        * @returns {void}
        */
        handleReference (value) {
            this.referenceType = value;
        },

        /**
         * Close this component when click outside.
         * @param {Event} evt - Click event.
         * @returns {void}
         */
        handleClickOutside (evt) {
            if (evt.target.closest(".difference-button")) {
                return;
            }
            this.$emit("showDifference", false);
        },
        /**
         * Updates the emit value.
         * @param {String} type The type which is triggered. Can be either "date" or "region".
         * @returns {void}
         */
        updateSelectedReferenceData (type) {
            let selectedReferenceData;

            if (type === "date") {
                selectedReferenceData = this.selectedDate ? {
                    type: "date",
                    value: this.selectedDate
                } : undefined;
                this.selectedRegion = "";
            }
            else if (type === "region") {
                selectedReferenceData = this.selectedRegion ? {
                    type: "region",
                    value: this.selectedRegion
                } : undefined;
                this.selectedDate = "";
            }

            this.setSelectedReferenceData(selectedReferenceData);
            this.$emit("showDifference", false);
        }
    }
};
</script>

<template>
    <div class="col-md-4">
        <div class="row">
            <div class="col-md-12">
                <h4>{{ $t("additional:modules.tools.statisticDashboard.reference.title") }}</h4>
            </div>
            <div class="col-md-12">
                <StatisticSwitcher
                    :buttons="buttonGroupReference"
                    :pre-checked-value="referenceType"
                    group="referenceGroup"
                    @showView="handleReference"
                />
            </div>
            <div
                v-if="referenceType === buttonGroupReference[0].name"
                class="col-md-12 mt-2"
            >
                <Multiselect
                    v-model="selectedDate"
                    :multiple="false"
                    :options="dateOptions"
                    :searchable="false"
                    :show-labels="false"
                    :placeholder="$t('additional:modules.tools.statisticDashboard.reference.placeholder')"
                    label="label"
                    track-by="label"
                    @input="updateSelectedReferenceData('date')"
                />
            </div>
            <div
                v-else
                class="col-md-12  mt-2"
            >
                <Multiselect
                    id="reference-value"
                    v-model="selectedRegion"
                    :multiple="false"
                    :options="regionOptions"
                    :searchable="false"
                    :show-labels="false"
                    :placeholder="$t('additional:modules.tools.statisticDashboard.reference.placeholder')"
                    @input="updateSelectedReferenceData('region')"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~/css/mixins.scss";
@import "~variables";

.bootstrap-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 8px;
    width: 28px;
    &:hover {
        color: $white;
        background-color: $light_blue;
    }
}
.btn-group {
    margin-top: 0.5rem;
    margin-bottom: 0.8rem;
}
</style>

<style lang="scss">
@import "~variables";

.multiselect, .multiselect__input, .multiselect__single {
    font-family: inherit;
    font-size: 11px;
}
</style>
