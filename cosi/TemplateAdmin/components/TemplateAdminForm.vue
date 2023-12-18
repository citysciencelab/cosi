<script>
import Multiselect from "vue-multiselect";
import TemplateAdminFormCard from "./TemplateAdminFormCard.vue";
import getters from "../store/gettersTemplateAdmin";
import dayjs from "dayjs";
import Draggable from "vuedraggable";
import {mapActions, mapGetters, mapMutations} from "vuex";
import isObject from "../../../../src/utils/isObject";

export default {
    name: "TemplateAdminForm",
    components: {
        Multiselect,
        TemplateAdminFormCard,
        Draggable
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
            isNameValidating: false,
            isStatDataValidating: false,
            isValidated: false,
            limitReferenceValues: false,
            referenceValueList: [],
            importedReferenceValueList: []
        };
    },
    computed: {
        ...mapGetters("Tools/TemplateAdmin", Object.keys(getters)),

        /**
         * Returns true or false, depending on the number of statistics.
         * @returns {Boolean} True if the number of statistics are more than two.
         */
        countSelectedStatistics () {
            return this.selectedStatData.length > 2;
        },
        uploadedTemplates () {
            return this.importedTemplateNames;
        }
    },
    watch: {
        selectedStatData (val) {
            const label = val.map(v => v.label);

            this.referenceValueList = this.referenceValueList.filter(badge => label.includes(badge?.statisticName));
        },
        selectedTemplate (value) {
            if (this.showEditTemplate) {
                this.changeSelectedTemplate(value);
            }
        }
    },
    mounted () {
        if (this.showEditTemplate && this.selectedTemplate !== undefined) {
            this.changeSelectedTemplate(this.selectedTemplate);
        }
    },
    methods: {
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapMutations("Tools/TemplateAdmin", ["setSelectedTemplate"]),

        /**
         * Changes the selected template.
         * @param {String} id - the index of the saved template.
         * @returns {void}
         */
        changeSelectedTemplate (id) {
            if (!Array.isArray(this.savedTemplateContents) ||
                typeof id !== "string" ||
                !isObject(this.savedTemplateContents[id])) {
                return;
            }

            this.loadingTemplate(this.savedTemplateContents[id]);
        },
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
            this.setIsStatDataValidating(true);

            if (this.templateName !== "" && this.selectedStatData.length) {
                this.isValidated = true;
            }
            else {
                this.isValidated = false;
            }

            if (this.templateName !== "") {
                this.setIsNameValidating(false);
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

            this.importedReferenceValueList = this.referenceValueList;
        },

        /**
         * Importing the template from local storage.
         * @param {Event} evt - An input change event
         * @returns {void}
         */
        importTemplate (evt) {
            if (!Array.isArray(Object.keys(evt?.target?.files)) || !Object.keys(evt?.target?.files).length) {
                return;
            }

            this.prepareTemplate(evt?.target?.files);
            this.$refs.form.reset();
        },

        /**
         * Prepares the template.
         * @param {Object} files - The imported files.
         * @returns {void}
         */
        prepareTemplate (files) {
            if (!(files instanceof FileList) || Object.values(files).length === 0) {
                return;
            }

            Object.values(files).forEach(file => {
                this.handleFile(file);
            });
        },

        /**
         * Handles the given file and loads the template with its content.
         * @param {Object} file - The given file
         * @returns {void|undefined} returns undefined, if the given file is not correct
         */
        handleFile (file) {
            if (!(file instanceof File)) {
                return;
            }

            const fileName = file?.name ? file.name : "",
                fileType = fileName !== "" ? fileName.substring(fileName.length - 4, fileName.length) : "undefined",
                reader = new FileReader();

            if (fileName === "") {
                console.warn("The file is corrupt.");
                return;
            }
            if (fileType !== "json") {
                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateAdmin.errors.wrongFormat")}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }

            reader.readAsText(file);
            reader.onload = (res) => {
                const fileContent = this.parseResult(res);

                if (fileContent !== null) {
                    this.loadingTemplate(fileContent);
                    this.addTemplate(fileContent);
                }
            };
            reader.onerror = (err) => console.error(err);
        },

        /**
         * Parses the given object.
         * @param {Object} res - The given content of the file
         * @returns {String|null} - returns the file content as string or null
         */
        parseResult (res) {
            let fileContent = null;

            try {
                fileContent = JSON.parse(res?.target?.result);
            }
            catch (error) {
                console.warn("jsonParse failed: could not parse\"" + res?.target?.result + "\" to JSON: " + error);
            }

            return fileContent;
        },

        /**
         * Adds the name of the imported template and saves the content of the uploaded file.
         * @param {String} fileContent - The content of the uploaded file
         * @returns {void}
         */
        addTemplate (fileContent) {
            if (typeof this.getTemplateText(fileContent.meta?.title) !== "string" ||
                this.getTemplateText(fileContent.meta?.title).length === 0) {
                return;
            }

            if (!this.importedTemplateNames.includes(this.getTemplateText(fileContent.meta?.title))) {
                this.importedTemplateNames.push(this.getTemplateText(fileContent.meta?.title));
                this.savedTemplateContents[this.getTemplateText(fileContent.meta?.title)] = fileContent;
            }
            else {
                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateAdmin.errors.templateName")} ${fileContent.meta?.title} ${this.$t("additional:modules.tools.cosi.templateAdmin.errors.isLoaded")}`,
                    category: "Warning",
                    displayClass: "warning"
                });
            }
        },

        /**
         * Loading the template and assign the value to different field
         * @param {Object} content - the parsed json format content
         * @returns {void}
         */
        loadingTemplate (content) {
            if (!isObject(content)) {
                return;
            }
            this.setSelectedTemplate(this.getTemplateText(content.meta?.title));
            this.templateName = this.getTemplateText(content.meta?.title);
            this.templateDes = this.getTemplateText(content.meta?.info);
            this.selectedGeoData = this.getSelectedGeoData(content.state?.Maps?.layerIds);
            this.selectedStatData = this.getSelectedStatData(content.state?.Tools?.Dashboard);
            this.selectedToolData = this.getSelectedToolData(content.state?.Tools?.toolToOpen);
            this.importedReferenceValueList = this.getImportedReferenceValueList(content.state?.Tools?.Dashboard?.orientationValues);
            this.referenceValueList = this.importedReferenceValueList;
        },

        /**
         * Gets the template attributes if it is in string type
         * @param {String} txt - the text
         * @returns {string} the text
         */
        getTemplateText (txt) {
            return typeof txt === "string" ? txt : "";
        },

        /**
         * Gets the selected Geo data.
         * @param {String[]} layerId - the layer Id
         * @returns {Object} the selected geo data
         */
        getSelectedGeoData (layerId) {
            const geoData = [];

            if (Array.isArray(layerId)) {
                layerId.forEach(id => {
                    geoData.push(this.geoData.find(data => data?.layerId === id));
                });
            }

            return geoData;
        },

        /**
         * Gets the selected statistical data.
         * @param {Object} dashboard - the dashboard object
         * @returns {Object} the selected stats data
         */
        getSelectedStatData (dashboard) {
            const statData = [];

            if (Array.isArray(dashboard?.statsFeatureFilter)) {
                dashboard.statsFeatureFilter.forEach(stat => {
                    statData.push(this.statData.find(data => data?.label === stat));
                });
            }

            return statData;
        },

        /**
         * Gets the selected template tool option.
         * @param {String} option - the option
         * @returns {Object} the selected tool data
         */
        getSelectedToolData (option) {
            if (typeof option === "string") {
                return this.toolData.find(data => data?.toolId === option);
            }

            return [];
        },

        /**
         * Gets the reference value list
         * @param {Object[]} val - the reference value list
         * @returns {string} the reference value list
         */
        getImportedReferenceValueList (val) {
            return Array.isArray(val) ? val : [];
        },

        /**
         * Gets the reference value for each reference input field.
         * @param {String} name - the statistical data name
         * @param {Object[]} referenceValueList - the reference value list
         * @returns {Object} the selected tool data
         */
        getReferenceValue (name, referenceValueList) {
            if (typeof name !== "string" || !Array.isArray(referenceValueList) || !referenceValueList.length) {
                return "";
            }

            return referenceValueList.find(data => data?.statisticName === name)?.value;
        },
        /**
         * Returns the unit or false depending on valueType.
         * @param {String} valueType - the value type ("relative", "absolute" or false) of the selected statistics.
         * @returns {String|Boolean} the unit if the valueType is "relative" otherwise false.
         */
        showUnit (valueType) {
            return valueType === "relative" ? "%" : false;
        }
    }
};

</script>

<template lang="html">
    <!-- Form -->
    <form id="template-admin-form">
        <div
            v-if="!showEditTemplate || showEditTemplate && uploadedTemplates.length !== 0"
            class="required mt-2"
        >
            * {{ $t("additional:modules.tools.cosi.templateAdmin.required") }}
        </div>
        <div
            v-if="showEditTemplate"
            class="mt-3"
        >
            <button
                class="template-upload btn btn-outline-primary fs-5 lh-1"
                @click.prevent="$refs.templateImport.click()"
            >
                <i class="bi bi-upload pe-2" />
                {{ $t("additional:modules.tools.cosi.templateAdmin.button.uploadTemplate") }}
            </button>
            <span
                class="row form-text pt-3 ps-3"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.supportedFormats") }}
            </span>
            <form ref="form">
                <label for="template-import">
                    <input
                        id="template-import"
                        ref="templateImport"
                        type="file"
                        multiple
                        class="d-none"
                        @change="importTemplate"
                    >
                </label>
            </form>
            <div
                v-if="uploadedTemplates.length !== 0"
            >
                <label
                    class="col col-md form-label ps-0 pb-0 pt-3 m-0"
                    for="select-template"
                >
                    {{ $t("additional:modules.tools.cosi.templateAdmin.label.selectTemplate") }}
                </label>
                <Multiselect
                    id="select-template"
                    :value="selectedTemplate"
                    class="pb-3"
                    :options="uploadedTemplates"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="false"
                    :multiple="false"
                    :placeholder="$t('additional:modules.tools.cosi.templateAdmin.label.selectTemplate')"
                    @input="setSelectedTemplate"
                />
            </div>
        </div>
        <div
            v-if="!showEditTemplate || showEditTemplate && uploadedTemplates.length !== 0"
        >
            <div class="mb-3 mt-0">
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
                    :class="['form-control', 'rounded-0', isNameValidating && templateName === '' ? 'novalidate' : '', showEditTemplate ? 'no-border' : '']"
                    @input="setIsNameValidating(false)"
                >
                <span
                    v-if="isNameValidating && templateName === ''"
                    class="hint"
                >
                    {{ $t("additional:modules.tools.cosi.templateAdmin.hintName") }}
                </span>
            </div>
            <div class="my-3">
                <label
                    for="form-description"
                    class="form-label mb-0"
                >
                    {{ $t("additional:modules.tools.cosi.templateAdmin.label.description") }} (optional)
                </label>
                <textarea
                    id="form-description"
                    v-model.trim="templateDes"
                    class="form-control rounded-0"
                    :class="showEditTemplate ? 'no-border' : ''"
                    rows="2"
                />
            </div>
            <label
                class="form-label mb-0"
                for="add-geo-data"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.addGeoData") }} (optional)
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
                    class="col col-md"
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
                    {{ $t("additional:modules.tools.cosi.templateAdmin.hintStatisticData") }}
                </span>
                <Draggable
                    v-model="selectedStatData"
                    class="mt-3"
                    handle=".handle"
                >
                    <TemplateAdminFormCard
                        v-for="(statDataObj, idx) in selectedStatData"
                        :key="idx"
                        :class="idx > 1 && limitReferenceValues ? 'more-statistics' : ''"
                        :title="statDataObj.label"
                        :imported-reference-value="getReferenceValue(statDataObj.label, importedReferenceValueList)"
                        :origin-reference-value="getReferenceValue(statDataObj.label, referenceValueList)"
                        :label="$t(labelOfOrientationValue)"
                        :unit="showUnit(statDataObj.valueType)"
                        @removeCard="removeStatData(statDataObj.propertyName)"
                        @setReferenceValueList="setReferenceValueList"
                    />
                </Draggable>
                <div
                    v-if="countSelectedStatistics"
                    class="align-self-end p-0"
                >
                    <button
                        id="more-button"
                        type="button"
                        class="btn btn-link btn-sm pt-0"
                        @click="limitReferenceValues = !limitReferenceValues"
                    >
                        {{ limitReferenceValues ? $t("additional:modules.tools.cosi.templateAdmin.button.showMore") : $t("additional:modules.tools.cosi.templateAdmin.button.showLess") }}
                    </button>
                </div>
            </div>
            <label
                class="form-label mb-0"
                for="add-tools"
            >
                {{ $t("additional:modules.tools.cosi.templateAdmin.label.addTools") }} (optional)
            </label>

            <div class="row no-gutters mb-4">
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
            <button
                class="export-template btn btn-outline-primary fs-5 lh-1"
                @click.prevent="validateForm"
            >
                <i class="bi bi-download pe-2" />
                {{ $t("additional:modules.tools.cosi.templateAdmin.button.downloadTemplate") }}
            </button>
        </div>
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
.required {
    font-size: 11px;
    text-align: right;
}
.no-border {
    border: 1px solid #ffffff;
    box-shadow: none;
     &:hover {
        border: 1px solid #ced4da;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
     }
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
