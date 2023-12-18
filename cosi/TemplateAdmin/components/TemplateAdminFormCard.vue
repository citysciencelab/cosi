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
        originReferenceValue: {
            type: String,
            required: false,
            default: ""
        },
        importedReferenceValue: {
            type: String,
            required: false,
            default: ""
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
    watch: {
        referenceValue () {
            this.emitSetReferenceValue();
        },
        originReferenceValue (val) {
            this.referenceValue = val;
        }
    },
    mounted () {
        this.referenceValue = typeof this.importedReferenceValue !== "undefined" ? this.importedReferenceValue : "";
    },
    methods: {
        /**
         * Emits the setReferenceValueList function in TemplateAdminForm component
         * @returns {void}
         */
        emitSetReferenceValue () {
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

            if ((/^\d*,?\d*-?\d{0,2}$/).test(char)) {
                return true;
            }
            e.preventDefault();
            return false;
        },

        /**
         * Checks if the last several strings are comma
         * @returns {void}
         */
        checkComma () {
            this.referenceValue = this.referenceValue.replace(/^[,\s]+|[,\s]+$/g, "").replace(/,[,\s]*,/g, ",");
        }
    }
};

</script>

<template lang="html">
    <div
        class="card mb-3"
    >
        <div class="row g-0">
            <div class="col-md-1 pe-0">
                <button
                    class="btn drag-and-drop shadow-none ps-0 pe-0 pt-3 align-items-center handle"
                    type="button"
                    @click.prevent=""
                >
                    <i class="bi bi-grip-vertical mt-1" />
                </button>
            </div>
            <div class="col-md-10">
                <button
                    class="close-button shadow-none"
                    aria-label="Close"
                    @click.prevent="$emit('removeCard')"
                >
                    <i class="bi bi-x align-middle" />
                </button>
                <div class="card-body ps-2 pe-2 pb-0 pt-3">
                    <h5 class="card-title">
                        {{ title }}
                    </h5>
                    <div class="card-text row align-items-center pb-2">
                        <label
                            for="referenceValue"
                            class=""
                        > {{ label }} </label>
                        <div
                            v-if="unit"
                            class="col-4 input-group input-group-sm pb-0 px-0"
                        >
                            <input
                                id="referenceValue"
                                v-model.trim="referenceValue"
                                type="text"
                                class="form-control border-end-0 pb-0"
                                maxlength="20"
                                @change="checkComma"
                                @keypress="checkNumber($event)"
                            >
                            <span
                                class="input-group-text"
                            >
                                {{ unit }}
                            </span>
                            <span
                                class="form-text"
                            >
                                {{ $t("additional:modules.tools.cosi.templateAdmin.hintNumber") }}
                            </span>
                        </div>
                        <div
                            v-else
                            class="col col-md-4 pb-0 px-0"
                        >
                            <input
                                id="referenceValue"
                                v-model.trim="referenceValue"
                                type="text"
                                class="form-control pb-0"
                                maxlength="20"
                                @change="checkComma"
                                @keypress="checkNumber($event)"
                            >
                            <span
                                class="form-text"
                            >
                                {{ $t("additional:modules.tools.cosi.templateAdmin.hintNumber") }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.card {
    max-width: 100%;
      &:hover {
        border-color: $light_blue;
        .card-title {
           color: $light_blue;
        }
        .drag-and-drop {
            background-color: $light_blue;
            border-right: 1px solid $light_blue;
            i {
                color: $white;
            }
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

    .close-button {
        position: absolute;
        right: 0;
        i {
            font-size: 14px;
        }
        &:hover {
            background-color: $light_blue;
            color: $white;
        }
    }
    .drag-and-drop {
        background-color: #F3F3F3;
        height: 100%;
        border-right: 1px solid rgba(0,0,0,.125);
        i {
            font-size: 30px;
            color: #C2C2C2;
        }
    }
    .form-text {
        display: block;
        width: 200px;
    }
}
</style>
