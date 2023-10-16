<script>
import ModalItem from "../../../src/share-components/modals/components/ModalItem.vue";
export default {
    name: "StatisticGridComponent",
    components: {
        ModalItem
    },
    props: {
        dates: {
            type: Array,
            required: false,
            default: undefined
        },
        titles: {
            type: Array,
            required: false,
            default: undefined
        },
        chartsCount: {
            type: Number,
            required: false,
            default: undefined
        }
    },
    data () {
        return {
            showModal: {}
        };
    },
    methods: {
        setShowModal (key, value) {
            this.$set(this.showModal, key, value);
        }
    }
};
</script>

<template>
    <div>
        <div
            v-if="Array.isArray(dates)"
            class="flex-container"
        >
            <div
                v-for="(data, idx) in dates"
                :key="idx"
                class="flex-item text-center"
                role="button"
                tabindex="0"
                @click="setShowModal(`table-${idx}`, true)"
                @keydown="setShowModal(`table-${idx}`, true)"
            >
                <div
                    v-if="titles"
                    class="title m-2 fs-6"
                >
                    {{ titles[idx] }}
                </div>
                <slot
                    name="tableContainers"
                    :data="data"
                />
                <ModalItem
                    :show-modal="showModal[`table-${idx}`]"
                    modal-inner-wrapper-style="min-width: 55rem"
                    modal-content-container-style="padding: 0.5rem"
                    @modalHid="setShowModal(`table-${idx}`, false)"
                >
                    <template #header>
                        <h5 class="px-2 mt-2">
                            {{ titles[idx] }}
                        </h5>
                    </template>
                    <template #default>
                        <slot
                            name="tableContainersModal"
                            :data="dates[idx]"
                        />
                    </template>
                </ModalItem>
            </div>
        </div>
        <div
            v-else-if="typeof chartsCount === 'number'"
            class="flex-container"
        >
            <div
                v-for="idx in chartsCount"
                :key="idx"
                class="flex-item"
                role="button"
                tabindex="0"
                @click="setShowModal(`chart-${idx}`, true)"
                @keydown="setShowModal(`chart-${idx}`, true)"
            >
                <slot
                    name="chartContainers"
                    :chart-id="idx"
                    class="chartContainers"
                />
                <ModalItem
                    :show-modal="showModal[`chart-${idx}`]"
                    modal-inner-wrapper-style="min-width: 55rem"
                    modal-content-container-style="padding: 0.5rem"
                    @modalHid="setShowModal(`chart-${idx}`, false)"
                >
                    <template #header>
                        <h5 class="px-2 mt-2">
                            {{ titles[idx - 1] }}
                        </h5>
                    </template>
                    <template #default>
                        <slot
                            name="chartContainersModal"
                            :chart-id="idx"
                        />
                    </template>
                </ModalItem>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.flex-container {
    display:flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: 900px;
    margin-top: 30px;
    .title {
        font-family: $font_family_accent;
    }
}

.flex-item {
    flex: 0 1 auto;
    flex-basis: 30%;
    flex-grow: 1;
    flex-shrink: 1;
    border: 1px solid #dee2e6;
    max-width: 280px;
    min-width: 260px;
    height: 280px;
    min-height: 260px;
    overflow: hidden;
    margin: 10px;
    border-radius: 5px;
    &:hover {
        box-shadow: $box-shadow;
        cursor: pointer;
    }
}

.flex-container .mx-5 {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-left: 0px !important;
}

.flex-container .my-5 {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-left: 0px !important;
}
</style>
