<script>
import StatsTrend from "./StatsTrend.vue";
import {getValue, getValueClass, getValueTooltip} from "../utils/tableCells";

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
    methods: {
        getValue,
        getValueClass,
        getValueTooltip
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
                    v-if="getValue(item, header, currentTimestamp, items) !== '-'"
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
                            v-for="year in item.years"
                            :key="year"
                        >
                            <span
                                :title="getValueTooltip(item, header, year)"
                                :class="getValueClass(item, header, year)"
                            >
                                {{ getValue(item, header, year, items) }}
                            </span>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <span
                        :title="getValueTooltip(item, header, currentTimestamp)"
                        :class="getValueClass(item, header, currentTimestamp)"
                    >
                        {{ getValue(item, header, currentTimestamp, items) }}
                    </span>
                </template>
            </div>
        </template>
        <span>{{ header.text }} {{ item.expanded ? '' : `(${currentTimestamp})` }}</span>
    </v-tooltip>
</template>

<style lang="scss" scoped>

</style>
