<script>

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
        },
        selectedOption: {
            type: String,
            default: "",
            required: false
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
                    :value="selectedOption"
                    class="form-select"
                    :aria-label="$t('additional:modules.tools.boris.landCalculation.ariaLabelBuildingDesigns')"
                    @select="$emit('select', $event.target.value)"
                    @change="handleChange($event, subject)"
                >
                    <option
                        v-for="(option, i) in options"
                        :key="i"
                        :value="option"
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
