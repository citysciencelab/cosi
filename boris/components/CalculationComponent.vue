<script>
import {mapMutations} from "vuex";
import mutations from "../store/mutationsBoris";

export default {
    name: "CalculationComponent",
    props: {
        title: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
        selectedBrwFeature: {
            type: Object,
            required: true
        },
        textIds: {
            type: Array,
            required: true
        },
        textId: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        toggleInfoText: {
            type: Function,
            required: true
        },
        handleChange: {
            type: Function,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    methods: {
        ...mapMutations("Tools/Boris", Object.keys(mutations)),
        /**
         * Check if 'Einzelhäuser' or 'Doppelhäuser' are selected to change the option name to singular
         * @param {String} option is one option of the options of buildingDesigns or positionsToStreet
         * @return {String} zBauweise that changes the term to singular
         */
        checkForBuildingMatch (option) {
            let zBauweise = this.selectedBrwFeature.get("zBauweise");
            const zStrassenLage = this.selectedBrwFeature.get("zStrassenLage");

            if (this.selectedBrwFeature.get("zBauweise") === "eh Einzelhäuser") {
                zBauweise = "eh Einzelhaus (freistehend)";
            }
            else if (this.selectedBrwFeature.get("zBauweise") === "dh Doppelhaushälften") {
                zBauweise = "dh Doppelhaushälfte";
            }
            else if (this.selectedBrwFeature.get("zBauweise") === "rm Reihenmittelhäuser") {
                zBauweise = "rm Reihenmittelhaus";
            }

            return option === zBauweise || option === zStrassenLage;
        }
    }

};
</script>

<template>
    <div id="calculation-component">
        <div
            v-if="type === 'select'"
            class="select-part"
        >
            <dt>
                <span> {{ title }}</span>
                <span
                    class="bootstrap-icon bi-question-circle-fill"
                    role="button"
                    tabindex="0"
                    @click="toggleInfoText(textId)"
                    @keydown.enter="toggleInfoText(textId)"
                />
            </dt>
            <dd>
                <select
                    class="form-select"
                    :aria-label="$t('additional:modules.tools.boris.landCalculation.ariaLabelBuildingDesigns')"
                    @change="handleChange($event, subject)"
                >
                    <option
                        v-for="(option, i) in options"
                        :key="i"
                        :value="option"
                        :selected="checkForBuildingMatch(option)"
                    >
                        {{ option }}
                    </option>
                </select>
                <div
                    v-if="Object.values(textIds).includes(textId)"
                    class="help pt-2"
                >
                    <span v-html="text" />
                </div>
            </dd>
        </div>
        <div
            v-else
            class="input-part"
        >
            <dt>
                <span>{{ title }}</span>
                <span
                    class="bootstrap-icon bi-question-circle-fill"
                    role="button"
                    tabindex="0"
                    @click="toggleInfoText(textId)"
                    @keydown.enter="toggleInfoText(textId)"
                />
            </dt>
            <dd>
                <label>
                    <input
                        type="text"
                        class="form-control"
                        :value="selectedBrwFeature.get(subject).toString().replace('.', ',')"
                        @change="handleChange($event, subject)"
                    >
                </label>
                <div
                    v-if="Object.values(textIds).includes(textId)"
                    class="help pt-2"
                >
                    <span v-html="text" />
                </div>
            </dd>
        </div>
    </div>
</template>
