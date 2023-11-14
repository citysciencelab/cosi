<script>
export default {
    name: "TemplateAdminFormCard",
    components: {
    },
    props: {
        title: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        unit: {
            type: [String, Boolean],
            required: false,
            default: false
        }
    },
    data () {
        return {
            referenceValue: ""
        };
    },
    methods: {
        /**
         * Emits the setReferenceValueList function in TemplateAdminForm component
         * @returns {void}
         */
        emitSetReferenceValue () {
            this.referenceValue = this.referenceValue.replace(/^[,\s]+|[,\s]+$/g, "").replace(/,[,\s]*,/g, ",");

            this.$emit("setReferenceValueList", {
                statisticName: this.title,
                value: this.referenceValue
            });
        },

        /**
         * Checks if the input is number or comma
         * @param {event} e the keypress event
         * @returns {Boolean} true if the input letter is number or comma
         */
        checkNumber (e) {
            const char = String.fromCharCode(e.keyCode);

            if ((/^\d*,?\d{0,2}$/).test(char)) {
                return true;
            }
            e.preventDefault();
            return false;
        }
    }
};

</script>

<template lang="html">
    <div>
        <div
            class="card"
        >
            <button
                class="close-button shadow-none p-0 align-self-end"
                aria-label="Close"
                @click.prevent="$emit('removeCard')"
            >
                <i class="bi bi-x pt-1" />
            </button>
            <div
                class="card-body pt-0 pe-1 ps-2"
            >
                <h5 class="card-title p-0">
                    {{ title }}
                </h5>
                <div class="card-text p-0">
                    <label
                        for="referenceValue"
                        class="pb-1 px-0"
                    > {{ label }} </label>
                    <div class="input-group input-group-sm w-50">
                        <input
                            id="referenceValue"
                            v-model.trim="referenceValue"
                            type="text"
                            class="form-control border-end-0"
                            maxlength="6"
                            @change="emitSetReferenceValue"
                            @keypress="checkNumber($event)"
                        >
                        <span
                            v-if="unit"
                            class="input-group-text"
                        >
                            {{ unit }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.card {
    height: 100%;
    border-left: 5px solid #ced4da;
      &:hover {
        border-color: $light_blue;
        .card-title {
           color: $light_blue;
    }
    }
    .card-title {
        font-size: 12px;
        font-family: $font_family_accent;
    }
    .card-text {
        color: #5A5A5A;
        font-size: 11px;
    }
    .input-group-text {
        background-color: $white;
        border-left: none;
    }

    .close-button i {
        font-size: 15px;
        &:hover {
            background-color: $light_blue;
            color: $white;
        }
    }
}
</style>
