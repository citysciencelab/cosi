<script>
import StatsTrend from "./StatsTrend.vue";
import {getValue, getValueClass, getValueTooltip, isValueCalculated} from "../utils/tableCells";
import {mapGetters} from "vuex";

export default {
    name: "TableCell",
    components: {
        StatsTrend
    },
    props: {
        item: {
            type: Object,
            required: true
        },
        header: {
            type: Object,
            required: true
        },
        currentTimestamp: {
            type: Number,
            default: undefined
        },
        timestampPrefix: {
            type: String,
            default: "jahr_"
        },
        currentLocale: {
            type: String,
            default: "de-DE"
        },
        tooltipOffset: {
            type: Number,
            default: 0
        },
        items: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters("Tools/DistrictSelector", [
            "selectedDistrictLevel"
        ])
    },
    methods: {
        getValue,
        getValueClass,
        getValueTooltip,
        isValueCalculated
    }
};

</script>

<template>
    <v-tooltip
        :key="header.value"
        bottom
        :nudge-top="60"
        :nudge-left="tooltipOffset"
    >
        <template #activator="{ on, attrs }">
            <div
                :class="{'text-end': true, 'minimized': header.minimized}"
                v-bind="attrs"
                v-on="on"
            >
                <StatsTrend
                    v-if="getValue(item, header, currentTimestamp, selectedDistrictLevel.districts) !== '-'"
                    :item="item"
                    :header="header"
                    :current-timestamp="currentTimestamp"
                    :timestamp-prefix="timestampPrefix"
                    :current-locale="currentLocale"
                    :tooltip-offset="tooltipOffset"
                />
                <template v-if="item.expanded">
                    <ul class="timeline">
                        <li
                            v-for="(year, idx) in item.years"
                            :key="year"
                            class="d-flex flex-row justify-end"
                        >
                            <v-icon
                                v-if="idx === 0 && isValueCalculated(item, header) && getValue(item, header, year, selectedDistrictLevel.districts) !== '-'"
                                x-small
                                :title="$t('additional:modules.tools.cosi.dashboard.titleForCalculatedStatistic')"
                            >
                                mdi-information
                            </v-icon>
                            <span
                                :title="getValueTooltip(item, header, year)"
                                :class="getValueClass(item, header, year)"
                            >
                                {{ getValue(item, header, year, selectedDistrictLevel.districts).toLocaleString(currentLocale) }}
                            </span>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <v-icon
                        v-if="isValueCalculated(item, header) && getValue(item, header, currentTimestamp, selectedDistrictLevel.districts) !== '-'"
                        x-small
                        :title="$t('additional:modules.tools.cosi.dashboard.titleForCalculatedStatistic')"
                    >
                        mdi-information
                    </v-icon>
                    <span
                        :title="getValueTooltip(item, header, currentTimestamp)"
                        :class="getValueClass(item, header, currentTimestamp)"
                    >
                        {{ getValue(item, header, currentTimestamp, selectedDistrictLevel.districts).toLocaleString(currentLocale) }}
                    </span>
                </template>
            </div>
        </template>
        <span>{{ header.text }} {{ item.expanded ? '' : `(${currentTimestamp})` }}</span>
    </v-tooltip>
</template>

<style lang="scss" scoped>

</style>
