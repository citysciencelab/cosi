<script>
export default {
    name: "AccessibilityAnalysisLegend",
    props: {
        steps: {
            type: Array,
            required: true
        },
        colors: {
            type: Array,
            required: true
        }
    },
    computed: {
        useTravelTimeIndex () {
            return this.steps.length === 4;
        }
    }

};
</script>

<template lang="html">
    <v-col
        class="mb-1"
    >
        <span class="text-subtitle-2"> {{ $t("additional:modules.tools.cosi.accessibilityAnalysis.legend") }} </span>
        <template
            v-for="(step, index) in steps"
        >
            <v-icon
                :key="index"
                :color="colors[index]"
                small
            >
                mdi-circle
            </v-icon>
            <span
                :key="index * 2 + steps.length"
                class="steps"
            >
                {{ step }}
            </span>
        </template>
        <v-icon
            v-if="useTravelTimeIndex"
            :title="$t('additional:modules.tools.cosi.accessibilityAnalysis.travelTimeIndex.warning')"
            color="warning"
            class="float-right"
        >
            mdi-alert
        </v-icon>
    </v-col>
</template>
