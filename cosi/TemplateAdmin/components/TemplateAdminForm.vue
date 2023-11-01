<script>
import Multiselect from "vue-multiselect";

export default {
    name: "TemplateAdminForm",
    components: {
        Multiselect
    },
    props: {
        geoData: {
            type: Array,
            required: true
        },
        statData: {
            type: Array,
            required: true
        },
        toolData: {
            type: Array,
            required: false,
            default: () => []
        },
        showEditTemplate: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data () {
        return {
            selectedData: [],
            selectedStatData: [],
            selectedToolData: [],
            selectedTemplate: ""
        };
    },
    computed: {
    },
    methods: {
        removeData (name) {
            this.selectedData = this.selectedData.filter(badge => badge !== name);
            return this.selectedData;
        },
        /**
         * Removes the statistic data by the given propertyName.
         * @param {String} name The property name.
         * @returns {void}
         */
        removeStatData (name) {
            this.selectedStatData = this.selectedStatData.filter(badge => badge?.propertyName !== name);
        },

        /**
         * Removes the selected tool
         * @param {String} name - the tool label as name
         * @returns {void}
         */
        removeToolData (name) {
            this.selectedToolData = this.selectedToolData.filter(badge => badge?.value !== name);
        }
    }
};

</script>

<template lang="html">
    <!-- Form -->
    <form id="template-admin-form">
        <div
            v-if="showEditTemplate"
            class="mt-3"
        >
            <button
                class="template-upload btn btn-outline-primary fs-5 lh-1"
                @click.prevent=""
            >
                <i class="bi bi-upload pe-2" />
                {{ $t("additional:modules.tools.cosi.templateAdmin.button.uploadTemplate") }}
            </button>
            <label
                class="col col-md form-label ps-0 pb-0 pt-4 m-0"
                for="select-template"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.selectTemplate") }}
            </label>
            <Multiselect
                id="select-template"
                v-model="selectedTemplate"
                :options="[]"
                :close-on-select="true"
                :show-labels="false"
                :allow-empty="true"
                :multiple="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
            />
        </div>
        <div class="my-3">
            <label
                for="form-name"
                class="form-label mb-0"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.name") }}
            </label>
            <input
                id="form-name"
                type="text"
                class="form-control rounded-0"
            >
        </div>
        <div class="my-3">
            <label
                for="form-description"
                class="form-label mb-0"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.description") }}
            </label>
            <textarea
                id="form-description"
                class="form-control rounded-0"
                rows="3"
            />
        </div>
        <label
            class="form-label mb-0"
            for="add-geo-data"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addGeoData") }}
        </label>
        <div class="row no-gutters mb-2">
            <button
                class="col col-md-1 align-items-center justify-content-center search-button"
                type="button"
                aria-disabled="true"
                disabled
            >
                <i class="bi bi-search search-icon" />
            </button>
            <Multiselect
                id="add-geo-data"
                v-model="selectedData"
                class="col col-md"
                :options="geoData"
                :searchable="true"
                :close-on-select="false"
                :multiple="true"
                :show-labels="false"
                :clear-on-select="false"
                :preserve-search="true"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
            >
                <template
                    slot="selection"
                    slot-scope="{ values, isOpen }"
                >
                    <span
                        v-if="values.length"
                        v-show="!isOpen"
                        class="multiselect__input"
                    > {{ }} </span>
                </template>
            </Multiselect>
        </div>
        <div class="mb-4">
            <button
                v-for="index in selectedData"
                :key="index"
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mb-1 me-2 btn-pb"
                aria-label="Close"
                @click="removeData(index)"
            >
                {{ index }}
                <i class="bi bi-x fs-5 align-middle" />
            </button>
        </div>
        <label
            class="form-label mb-0"
            for="add-statistic-data"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addStatisticalData") }}
        </label>

        <div class="row no-gutters mb-2">
            <button
                class="col col-md-1 align-items-center justify-content-center search-button"
                type="button"
                aria-disabled="true"
                disabled
            >
                <i class="bi bi-search search-icon" />
            </button>
            <Multiselect
                id="add-statistic-data"
                v-model="selectedStatData"
                class="col col-md"
                :options="statData"
                :searchable="true"
                :close-on-select="false"
                :multiple="true"
                :show-labels="false"
                :clear-on-select="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                label="label"
                track-by="propertyName"
            >
                <template
                    slot="selection"
                    slot-scope="{ values, isOpen }"
                >
                    <span
                        v-if="values.length"
                        v-show="!isOpen"
                        class="multiselect__input"
                    > {{ }} </span>
                </template>
            </Multiselect>
        </div>
        <div class="mb-4">
            <button
                v-for="(statDataObj, idx) in selectedStatData"
                :key="idx"
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mb-1 me-2 btn-pb"
                aria-label="Close"
                @click.prevent="removeStatData(statDataObj.propertyName)"
            >
                {{ statDataObj.label }}
                <i class="bi bi-x fs-5 align-middle" />
            </button>
        </div>
        <label
            class="form-label mb-0"
            for="add-tools"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addTools") }}
        </label>

        <div class="row no-gutters mb-2">
            <button
                class="col col-md-1 align-items-center justify-content-center search-button"
                type="button"
                aria-disabled="true"
                disabled
            >
                <i class="bi bi-search search-icon" />
            </button>
            <Multiselect
                id="add-tools"
                v-model="selectedToolData"
                class="col col-md"
                :clear-on-select="false"
                :options="toolData"
                :searchable="true"
                :close-on-select="false"
                :multiple="true"
                :show-labels="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                track-by="value"
                label="label"
            >
                <template
                    slot="selection"
                    slot-scope="{ values, isOpen }"
                >
                    <span
                        v-if="values.length"
                        v-show="!isOpen"
                        class="multiselect__input"
                    > {{ }} </span>
                </template>
            </Multiselect>
        </div>
        <div class="mb-4">
            <button
                v-for="(tool, index) in selectedToolData"
                :key="index"
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mb-1 me-2 btn-pb"
                aria-label="Close"
                @click.prevent="removeToolData(tool.value)"
            >
                {{ tool.label }}
                <i class="bi bi-x fs-5 align-middle" />
            </button>
        </div>
        <button
            class="btn btn-outline-primary fs-5 lh-1"
            @click.prevent=""
        >
            <i class="bi bi-download pe-2" />
            {{ $t("additional:modules.tools.cosi.templateAdmin.button.downloadTemplate") }}
        </button>
    </form>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn-outline-primary, .btn-outline-primary:focus-visible {
    color: $light_blue;
    border-color: $light_blue;
}

.btn-outline-primary:hover{
    color: $white;
    background-color: $light_blue;
}

.search-icon {
    font-size: 15px;
    color: $light_blue;
    position: relative;
    top: 2px;
}

.search-button {
    border: 1px solid #ced4da;
    border-right: 0;
    background-color: $light_grey;
}

.btn-outline-secondary, label {
    color: $dark_grey;
}

.btn-pb {
    padding-bottom: 2px;
}

</style>

<style lang="scss">
@import "~variables";

#template-admin-form {

    .multiselect, .multiselect__input, .multiselect__single {
        font-family: inherit;
        font-size: 12px;
    }

    .multiselect__option--selected.multiselect__option--highlight,
    .multiselect__option--selected.multiselect__option--highlight:after,
    .multiselect__option:after,
    .multiselect__option--selected,
    .multiselect__option--selected:after {
        background: $light_blue;
        color: $white;
        font-weight: normal;
    }

    .multiselect__option--highlight,
    .multiselect__option--highlight:after {
        background: $light_grey;
        color: $black;
    }


    .multiselect__select {
        padding: 4px 8px 10px 8px;
    }

    .multiselect__tags {
        border-radius: 0;
    }

    .multiselect__placeholder {
        margin-bottom: 7px
    }

    .multiselect__option--selected {
        font-family: $font_family_accent
    }
}
</style>
