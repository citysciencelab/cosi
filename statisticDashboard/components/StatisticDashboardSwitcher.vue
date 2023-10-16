<script>
export default {
    name: "StatisticDashboardSwitcher",
    props: {
        buttons: {
            type: Array,
            required: true
        },
        group: {
            type: String,
            required: true
        },
        preCheckedValue: {
            type: String,
            required: false,
            default: undefined
        }
    },
    data () {
        return {
            precheckedIndex: 0
        };
    },
    watch: {
        preCheckedValue (newVal) {
            this.precheckedIndex = this.getPrecheckedIndex(this.buttons, newVal);
        }
    },
    mounted () {
        this.precheckedIndex = this.getPrecheckedIndex(this.buttons, this.preCheckedValue);
    },
    methods: {
        /**
         * Gets the prechecked index
         * @param {Object[]} buttons - the buttons object in array
         * @param {String} precheckedValue - the prechecked value
         * @returns {Number} the prechecked index
         */
        getPrecheckedIndex (buttons, precheckedValue) {
            if (!Array.isArray(buttons) || typeof precheckedValue !== "string") {
                return 0;
            }

            const index = buttons.findIndex((button) => button?.name === precheckedValue);

            return index !== -1 ? index : 0;
        }
    }
};

</script>

<template>
    <div class="switchButtons me-2 pb-1">
        <div
            v-for="(data, idx) in buttons"
            :key="idx"
            class="btn-group btn-group-sm"
            role="group"
            aria-label="First group"
        >
            <input
                :id="`btnradio${idx}${data.name}`"
                type="radio"
                class="btn-check"
                :name="group"
                autocomplete="off"
                :checked="idx === precheckedIndex"
            >
            <label
                class="btn btn-outline-primary"
                :for="`btnradio${idx}${data.name}`"
                role="button"
                tabindex="0"
                @click="$emit('showView', data.name)"
                @keydown="$emit('showView', data.name)"
            >
                <i
                    v-if="data.icon"
                    :class="`${data.icon} pe-2`"
                />{{ data.name }}
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn-outline-primary, .btn-outline-primary:hover, .btn-outline-primary:focus-visible {
    color: $light_blue;
    border-color: $light_blue;
}
.btn-check:checked + .btn, :not(.btn-check) + .btn:active, .btn:first-child:active, .btn.active, .btn.show{
    background-color: $light_blue;
    border-color: $light_blue;
    color: $white;
}


</style>
