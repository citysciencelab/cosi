<script>
import {mapActions} from "vuex";
import travelTimeIndex from "../assets/inrix_traveltimeindex_2021.json";

export default {
    name: "AccessibilityAnalysisTrafficFlow",
    props: {
        useTravelTimeIndex: {
            type: Boolean,
            default: true
        },
        time: {
            type: Number,
            default: 9
        }
    },
    data () {
        return {
            travelTimeIndex
        };
    },
    computed: {
        isChecked: {
            get: function () {
                return this.useTravelTimeIndex;
            },
            set: function (newValue) {
                this.$emit("update:useTravelTimeIndex", newValue);
            }
        },
        dayTime: {
            get () {
                return this.time;
            },
            set (newValue) {
                this.$emit("update:time", newValue);
            }
        }
    },
    methods: {
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        showInfo () {
            this.addSingleAlert({
                category: "Info",
                displayClass: "info",
                content: this.$t("additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.help")
            });
        }
    }
};
</script>

<template lang="html">
    <v-col class="mb-3">
        <div
            id="travel-time-container"
        >
            <v-checkbox
                v-model="isChecked"
                dense
                hide-details
                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.toggle')"
                :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.tooltip')"
            />
            <v-btn
                class="float-end pt-1"
                depressed
                icon
                x-small
                @click="showInfo"
            >
                <v-icon>mdi-help-circle</v-icon>
            </v-btn>
            <v-slider
                v-model="dayTime"
                class="time-slider"
                :label="$t('additional:modules.tools.cosi.accessibilityAnalysis.time')"
                :hint="`${travelTimeIndex[dayTime]} ${$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.title')}`"
                :disabled="!isChecked"
                :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.tooltip')"
                step="1"
                ticks="always"
                tick-size="4"
                min="0"
                max="23"
                dense
                hide-details="auto"
            >
                <template #append>
                    <div class="append-text-field">
                        {{ dayTime }}:00
                        <v-icon small>
                            mdi-clock
                        </v-icon>
                    </div>
                </template>
            </v-slider>
        </div>
    </v-col>
</template>

<style lang="scss">
    @import "~variables";

    #travel-time-container {
        border: 1px solid $dark_grey;
        background-color: #f1f1f1;
        padding: 0 5px;

        .v-label {
            font-size: 14px;
        }
        .append-text-field {
            width: 70px;
            float: right;
        }
    }
</style>
