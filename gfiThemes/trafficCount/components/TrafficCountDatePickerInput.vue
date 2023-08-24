<script>

export default {
    name: "TrafficCountDatePickerInput",
    props: {
        inputDates: {
            type: Array,
            required: false,
            default: () => []
        },
        delimiter: {
            type: String,
            required: false,
            default: ","
        }
    },
    data () {
        return {
            showCalendarIcon: true
        };
    },
    computed: {
        dateComputed () {
            if (!Array.isArray(this.inputDates)) {
                return "";
            }
            return this.inputDates.join(this.delimiter);
        }
    },
    methods: {
        /**
         * Emits toggleCalendar.
         * @returns {void}
         */
        toggleCalendar () {
            this.$emit("toggleCalendar");
        },
        /**
         * Emits clearInput.
         * @returns {void}
         */
        clearInput () {
            this.$emit("clearInput");
        },
        /**
         * Sets the showCalendarIcon variable to given value.
         * @param {Boolean} value True if the calendar icon should be visible, false if not.
         * @returns {void}
         */
        setShowCalendarIcon (value) {
            this.showCalendarIcon = value;
        }
    }
};
</script>

<template>
    <div
        class="input-wrapper"
        role="button"
        tabindex="0"
        @mouseover="setShowCalendarIcon(false)"
        @focus="setShowCalendarIcon(false)"
        @mouseleave="setShowCalendarIcon(true)"
        @blur="setShowCalendarIcon(true)"
    >
        <input
            v-model="dateComputed"
            class="date-input form-control"
            readonly="true"
            @click="toggleCalendar"
        >
        <i :class="['bi bi-calendar4 calendar', showCalendarIcon ? 'show': '']" />
        <i
            :class="['bi bi-x', !showCalendarIcon ? 'show': '']"
            role="button"
            tabindex="0"
            @click="clearInput"
            @keypress.enter="clearInput"
        />
    </div>
</template>

<style scoped lang="scss">
@import "~/css/mixins.scss";
@import "~variables";

.input-wrapper {
    position: relative;
    display: inline-block;
    width: 210px;
    input {
        &:hover {
            color: $black;
            background-color: $white;
            border-color: $light_blue;
            outline: 0;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 0.25rem rgba(0, 48, 99, 0.25);
        }
    }
}

i {
    position: absolute;
    top: 50%;
    right: 8px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 1;
    color: rgba(0,0,0,.5);
    vertical-align: middle;
    display: none;
}
.bi-x {
    cursor: pointer;
}
.show {
    display: inline-block;
}
</style>
