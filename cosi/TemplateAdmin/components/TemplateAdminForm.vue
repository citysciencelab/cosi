<script>
import Multiselect from "vue-multiselect";
import TemplateAdminFormCard from "./TemplateAdminFormCard.vue";
import dayjs from "dayjs";

export default {
    name: "TemplateAdminForm",
    components: {
        Multiselect,
        TemplateAdminFormCard
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
            templateName: "",
            templateDes: "",
            selectedGeoData: [],
            selectedStatData: [],
            selectedToolData: [],
            selectedTemplate: "",
            isNameValidating: false,
            isGeoDataValidating: false,
            isStatDataValidating: false,
            isValidated: false,
            limitReferenceValues: false,
            referenceValueList: []
        };
    },
    computed: {
        /**
         * Returns true or false, depending on the number of statistics.
         * @returns {Boolean} True if the number of statistics are more than two.
         */
        countSelectedStatistics () {
            return this.selectedStatData.length > 2;
        }
    },
    methods: {
        /**
         * Removes the geo data by the given layerId.
         * @param {String} layerId The layerId.
         * @returns {void}
         */
        removeGeoData (layerId) {
            this.selectedGeoData = this.selectedGeoData.filter(badge => badge?.layerId !== layerId);
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
         * Validating the form
         * @returns {void}
         */
        validateForm () {
            this.setIsNameValidating(true);
            this.setIsGeoDataValidating(true);
            this.setIsStatDataValidating(true);

            if (this.templateName !== "" && this.selectedGeoData.length && this.selectedStatData.length) {
                this.isValidated = true;
            }
            else {
                this.isValidated = false;
            }

            if (this.templateName !== "") {
                this.setIsNameValidating(false);
            }

            if (this.selectedGeoData.length) {
                this.setIsGeoDataValidating(false);
            }

            if (this.selectedStatData.length) {
                this.setIsStatDataValidating(false);
            }

            if (this.isValidated) {
                const exportedData = this.getExportedData(this.templateName, this.templateDes, this.selectedGeoData, this.selectedStatData, this.selectedToolData, this.referenceValueList);

                this.exportFile(this.templateName, exportedData);
            }
        },

        /**
         * Gets the exported data
         * @param {String} templateName The template name
         * @param {String} templateDes The template description.
         * @param {Object[]} geoData The geo data.
         * @param {Object[]} statData The statistical data.
         * @param {Object[]} toolData The tool data.
         * @param {Object[]} referenceValueList The reference value list.
         * @returns {Object} the exported data
         */
        getExportedData (templateName, templateDes, geoData, statData, toolData, referenceValueList) {
            const createdDate = dayjs(new Date()).format("DD.MM.YYYY, HH:mm:ss"),
                formatedDate = dayjs(new Date()).format("YYYY-MM-DD, HH:mm:ss").replace(", ", "T") + ".174Z",
                layerIds = geoData.map(data => data.layerId),
                toolId = toolData?.toolId,
                statsFeatureLable = statData.map(data => data.label);

            return {
                "meta": {
                    "title": templateName,
                    "info": templateDes,
                    "created": createdDate,
                    "date": formatedDate,
                    "icon": "mdi-filter"
                },
                "state": {
                    "Maps": {
                        "layerIds": layerIds
                    },
                    "Tools": {
                        "toolToOpen": toolId,
                        "Dashboard": {
                            "statsFeatureFilter": statsFeatureLable,
                            "orientationValues": referenceValueList
                        }
                    }
                }
            };
        },

        /**
         * Exports the exported data
         * @param {String} name The template name
         * @param {Object} data The exported data
         * @returns {void}
         */
        exportFile (name, data) {
            const filename = name + ".json",
                jsonStr = JSON.stringify(data),
                element = document.createElement("a");

            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr));
            element.setAttribute("download", filename);

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },

        /**
         * Sets the isNameValidating
         * @param {Boolean} value true or false
         * @returns {void}
         */
        setIsNameValidating (value) {
            this.isNameValidating = value;
        },

        /**
         * Sets the isGeoDataValidating
         * @param {Boolean} value true or false
         * @returns {void}
         */
        setIsGeoDataValidating (value) {
            this.isGeoDataValidating = value;
        },

        /**
         * Sets the isStatDataValidating
         * @param {Boolean} value true or false
         * @returns {void}
         */
        setIsStatDataValidating (value) {
            this.isStatDataValidating = value;
        },

        /**
         * Sets the reference value list
         * @param {object} value the reference value
         * @returns {void}
         */
        setReferenceValueList (value) {
            this.referenceValueList = this.referenceValueList.filter(item => {
                return item.statisticName !== value.statisticName;
            });

            if (value.value !== "") {
                this.referenceValueList.push(value);
            }
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
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.name") }} *
            </label>
            <input
                id="form-name"
                v-model.trim="templateName"
                type="text"
                :class="['form-control', 'rounded-0', isNameValidating && templateName === '' ? 'novalidate' : '']"
                @input="setIsNameValidating(false)"
            >
            <span
                v-if="isNameValidating && templateName === ''"
                class="hint"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.hint") }}
            </span>
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
                v-model.trim="templateDes"
                class="form-control rounded-0"
                rows="3"
            />
        </div>
        <label
            class="form-label mb-0"
            for="add-geo-data"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addGeoData") }} *
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
                v-model="selectedGeoData"
                :class="['col', 'col-md', isGeoDataValidating && !selectedGeoData.length ? 'novalidate' : '']"
                :options="geoData"
                :searchable="true"
                :close-on-select="false"
                :multiple="true"
                :show-labels="false"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                label="label"
                track-by="layerId"
                @input="setIsGeoDataValidating(false)"
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
                v-for="(geoDataObj, idx) in selectedGeoData"
                :key="idx"
                class="btn btn-sm btn-outline-secondary lh-1 rounded-pill shadow-none mb-1 me-2 btn-pb"
                aria-label="Close"
                @click.prevent="removeGeoData(geoDataObj.layerId)"
            >
                {{ geoDataObj.label }}
                <i class="bi bi-x fs-5 align-middle" />
            </button>
            <span
                v-if="isGeoDataValidating && !selectedGeoData.length"
                class="hint"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.hint") }}
            </span>
        </div>
        <label
            class="form-label mb-0"
            for="add-statistic-data"
        >
            {{ $t("additional:modules.tools.cosi.templateAdmin.label.addStatisticalData") }} *
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
                :class="['col', 'col-md', isStatDataValidating && !selectedStatData.length ? 'novalidate' : '']"
                :options="statData"
                :searchable="true"
                :close-on-select="false"
                :multiple="true"
                :show-labels="false"
                :clear-on-select="false"
                :allow-empty="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                label="label"
                track-by="propertyName"
                @input="setIsStatDataValidating(false)"
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
            <span
                v-if="isStatDataValidating && !selectedStatData.length"
                class="hint"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.hint") }}
            </span>
            <div
                class="row mb-1 g-0"
            >
                <TemplateAdminFormCard
                    v-for="(statDataObj, idx) in selectedStatData"
                    :key="idx"
                    :class="idx > 1 && limitReferenceValues ? 'more-statistics' : ''"
                    class="col-sm-6"
                    :title="statDataObj.label"
                    :label="$t('additional:modules.tools.cosi.templateAdmin.label.existingAreas')"
                    unit="%"
                    @removeCard="removeStatData(statDataObj.propertyName)"
                    @setReferenceValueList="setReferenceValueList"
                />
                <div
                    v-if="countSelectedStatistics"
                    class="col align-self-end p-0"
                >
                    <button
                        id="more-button"
                        type="button"
                        class="col col-md-auto btn btn-link btn-sm pt-0"
                        @click="limitReferenceValues = !limitReferenceValues"
                    >
                        {{ limitReferenceValues ? $t("additional:modules.tools.cosi.templateAdmin.button.showMore") : $t("additional:modules.tools.cosi.templateAdmin.button.showLess") }}
                    </button>
                </div>
            </div>
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
                :close-on-select="true"
                :multiple="false"
                :show-labels="false"
                :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.placeholder')"
                track-by="toolId"
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
            * {{ $t("additional:modules.tools.cosi.templateAdmin.required") }}
        </div>
        <button
            class="export-template btn btn-outline-primary fs-5 lh-1"
            @click.prevent="validateForm"
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

.novalidate {
    outline: 0;
    box-shadow: inset 0 1px 2px rgba(225, 0, 25, 0.075), 0 0 0 0.25rem rgba(225, 0, 25, 0.25);
}

.hint {
    display: block;
    color: $danger;
}

#form-name + .hint {
    margin-top: 8px;
}
#more-button {
    text-align: left;
}
.more-statistics {
        display: none;
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
