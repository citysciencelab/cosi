<script>
export default {
    name: "ChangeChartTypeButtons",
    props: {
        chartType: {
            type: String,
            required: true
        }
    },
    methods: {
        updateChartTypeOnParent (selectedChartType) {
            this.$emit("updateChartType", selectedChartType);
        }
    }
};
</script>

<template>
    <div class="chart-type-change-button-container">
        <button
            type="button"
            :class="['btn', 'btn-bar', chartType === 'bar' ? 'btn-primary' : 'btn-secondary']"
            @click="updateChartTypeOnParent('bar')"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-bar-chart-line"
                viewBox="0 0 16 16"
            >
                <path
                    d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"
                />
            </svg>
        </button>
        <button
            type="button"
            :class="['btn', 'btn-line', , chartType === 'line' ? 'btn-primary' : 'btn-secondary']"
            @click="updateChartTypeOnParent('line')"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-graph-up"
                viewBox="0 0 16 16"
            >
                <path
                    fill-rule="evenodd"
                    d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.chart-type-change-button-container {
    display: flex;
}
</style>
