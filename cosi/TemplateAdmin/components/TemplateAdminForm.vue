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
    <form>
        <div
            v-if="showEditTemplate"
            class="mt-3"
        >
            <div class="row">
                <div class="col col-md mb-2">
                    <button
                        class="template-upload btn btn-outline-primary"
                    >
                        <i class="bi bi-upload" />
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
                        class="col col-md ps-0 pt-0"
                        :options="[]"
                        :close-on-select="true"
                        :show-labels="false"
                        :allow-empty="true"
                        :multiple="false"
                        :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                    />
                </div>
            </div>
        </div>
        <div class="my-3 ">
            <label
                for="form-name"
                class="form-label mb-0"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.name") }}
            </label>
            <input
                id="form-name"
                type="text"
                class="form-control"
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
                class="form-control"
                rows="3"
            />
        </div>
        <label
            class="form-label mb-0"
            for="add-geo-data"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addGeoData") }}
        </label>
        <div class="row no-gutters mb-1">
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
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mt-1 me-2 btn-pb"
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

        <div class="row no-gutters mb-1">
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
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mt-1 me-2 btn-pb"
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

        <div class="row no-gutters mb-1">
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
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mt-1 me-2 btn-pb"
                aria-label="Close"
                @click.prevent="removeToolData(tool.value)"
            >
                {{ tool.label }}
                <i class="bi bi-x fs-5 align-middle" />
            </button>
        </div>
        <button
            class="btn btn-outline-primary"
        >
            <i class="bi bi-download fs-6 pe-2" />
            {{ $t("additional:modules.tools.cosi.templateAdmin.button.downloadTemplate") }}
        </button>
    </form>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn-outline-primary, .btn-outline-primary:focus-visible {
    color: $light_blue;
    border-color: $light_blue;
    font-size: 12px;
}
.btn-outline-primary:hover{
        color: $white;
    }
label {
    color: $secondary_icon_button;
}
#form-name, #form-description {
    border-radius: 4px;
}
.search-icon {
    font-size: 15px;
    color: $light_blue;
}
.search-button {
   border: 1px solid #ced4da;
   border-top-left-radius: 4px;
   border-bottom-left-radius: 4px;
   background-color: #F3F3F3;
}
.btn-outline-secondary, label {
        color: $dark_grey;
    }

</style>

<style lang="scss">
@import "~variables";

form .multiselect, form .multiselect__input, form .multiselect__single {
    font-family: inherit;
    font-size: 11px;
}

form .multiselect__strong{
    font-family: "MasterPortalFont Bold";
}

form {
    .multiselect__option--selected.multiselect__option--highlight,
   .multiselect__option--selected.multiselect__option--highlight:after,
   .multiselect__option:after,
   .multiselect__option--selected,
   .multiselect__option--selected:after {
  background: $light_blue;
  color: $white;
  font-weight: normal;
    }
}

form {
    .multiselect__option--highlight,
    .multiselect__option--highlight:after {
        background: $light_grey;
        color: $black;
    }
}

form .multiselect__select {
    height: 30px;
}
</style>
