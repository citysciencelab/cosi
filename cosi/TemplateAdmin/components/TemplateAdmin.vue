<script>
import ToolTemplate from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations, mapState} from "vuex";
import getters from "../store/gettersTemplateAdmin";
import mutations from "../store/mutationsTemplateAdmin";
import {getComponent} from "../../../../src/utils/getComponent";
import TemplateAdminForm from "./TemplateAdminForm.vue";
import isObject from "../../../../src/utils/isObject";
import {sort} from "../../../../src/utils/sort";
import mapping from "../../assets/mapping.json";

export default {
    name: "TemplateAdmin",
    components: {
        ToolTemplate,
        TemplateAdminForm
    },
    data () {
        return {
            dataOptions: [],
            statOptions: [],
            currentTab: "#add-template-tab"
        };
    },
    computed: {
        ...mapGetters("Tools/TemplateAdmin", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", ["selectedDistrictLevel", "selectedDistrictLevelId", "selectedDistrictsCollection", "selectedDistrictNames"]),
        ...mapGetters("Tools", ["getConfiguredToolNames"]),
        ...mapState(["Tools"])
    },
    watch: {
        active (value) {
            if (value) {
                const filteredPropertyNames = this.getFilteredPropertyNames(this.selectedDistrictLevel?.propertyNameList, this.ignorePropertyNames),
                    layers = Radio.request("Parser", "getItemsByAttributes", {type: "layer"});

                this.statOptions = this.getMappedLabelByValue(filteredPropertyNames, mapping);
                this.dataOptions = this.getLayerNames(layers);
            }
        }
    },
    created () {
        this.$on("close", this.close);
        const toIgnoreTools = ["TemplateAdmin", "TemplateManager"];

        this.toolOptions = this.getToolList(this.Tools, Array.isArray(this.getConfiguredToolNames)
            ? this.getConfiguredToolNames.filter(toolNames => !toIgnoreTools.includes(toolNames)) : []);
    },
    methods: {
        ...mapMutations("Tools/TemplateAdmin", Object.keys(mutations)),

        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },

        /**
         * Gets all the tools from Masterportal filtered by the configured list of tools.
         * @param {Object} tools - the tools object from MP state
         * @param {String[]} toolsToIgnore - list of strings where each string represent tool key
         * @returns {Object[]} the tool list with the key and the title as label
         */
        getToolList (tools, toolsToIgnore) {
            if (!isObject(tools) || !Array.isArray(toolsToIgnore)) {
                return [];
            }
            let toolList = [];

            Object.entries(tools).forEach(([key, value]) => {
                if (typeof value.name !== "undefined" && value.isVisibleInMenu !== false && toolsToIgnore.includes(key)) {
                    toolList.push({toolId: key, label: i18next.t(value.name)});
                }
            });

            toolList = sort("", toolList, "label");

            return toolList;
        },

        /**
         * Gets the property names filtered by the given list of strings to ignore.
         * @param {Array<String[]>} propertyNamesOfEachLayer List of property name lists for each layer.
         * @param {String[]} propertyNamesToIgnore List of strings to ignore.
         * @returns {Array<String[]>} A list of strings for each layer.
         */
        getFilteredPropertyNames (propertyNamesOfEachLayer, propertyNamesToIgnore) {
            if (!Array.isArray(propertyNamesOfEachLayer) || !Array.isArray(propertyNamesToIgnore)) {
                return [];
            }
            const result = [];

            propertyNamesOfEachLayer.forEach(propertyNamesForLayer => {
                if (!Array.isArray(propertyNamesForLayer)) {
                    return;
                }
                const resultForLayer = propertyNamesForLayer.filter(
                    propertyName => !propertyNamesToIgnore.includes(propertyName)
                );

                result.push(resultForLayer);
            });
            return result;
        },

        /**
         * Gets a list of objects with mapped propertyNames and labels.
         * @param {Array<String[]>} propertyNamesOfEachLayer List of property name lists for each layer.
         * @param {Object[]} mappingList The list of objects to use for mapping.
         * @returns {Object[]} A list of objects with following format: {propertyName: x, label: y, valueType: z}
         */
        getMappedLabelByValue (propertyNamesOfEachLayer, mappingList) {
            if (!Array.isArray(propertyNamesOfEachLayer) || !Array.isArray(mappingList)) {
                return [];
            }
            let result = [];

            propertyNamesOfEachLayer.forEach(propertiesForLayer => {
                if (!Array.isArray(propertiesForLayer)) {
                    return;
                }
                propertiesForLayer.forEach(property => {
                    const foundObject = mappingList.find(mappingObject => mappingObject?.category === property);

                    if (!isObject(foundObject) || !Object.prototype.hasOwnProperty.call(foundObject, "value")) {
                        result.push({propertyName: property, label: property, valueType: foundObject?.valueType || false});
                        return;
                    }
                    result.push({propertyName: property, label: foundObject.value, valueType: foundObject.valueType || false});
                });
            });

            result = sort("", result, "label");

            return result;
        },

        /**
         * Returns a list of layer names.
         * @param {Object} layers the Layers from the card.
         * @returns {Object[]} A list of objects with following format: {propertyName: x, label: y}
         */
        getLayerNames (layers) {
            let layerNames = [];

            if (!Array.isArray(layers)) {
                return [];
            }

            layers.forEach(layer => {
                if (typeof layer?.name !== "undefined" && layer.isNeverVisibleInTree !== true) {
                    layerNames.push({layerId: layer.id, label: layer.name});
                }
            });

            layerNames = sort("", layerNames, "label");

            return layerNames;
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :focus-to-close-icon="true"
        :initial-width="500"
        class="template-admin"
    >
        <template #toolBody>
            <div class="container">
                <div
                    class="decription mb-2"
                >
                    {{ $t("additional:modules.tools.cosi.templateAdmin.description") }}
                </div>
                <!-- Nav tabs -->
                <ul
                    id="templateTabs"
                    class="nav nav-tabs"
                    role="tablist"
                >
                    <li
                        class="nav-item"
                        role="presentation"
                    >
                        <button
                            id="add-template-tab"
                            :class="currentTab === '#add-template-tab' ? 'active' : ''"
                            class="nav-link fs-6"
                            data-bs-toggle="tab"
                            data-bs-target="#add-template"
                            type="button"
                            role="tab"
                            aria-controls="add-template"
                            aria-selected="true"
                            @click="currentTab = '#add-template-tab'"
                        >
                            <i class="bi bi-plus-square pe-2" />
                            {{ $t("additional:modules.tools.cosi.templateAdmin.button.addTemplate") }}
                        </button>
                    </li>
                    <li
                        class="nav-item"
                        role="presentation"
                    >
                        <button
                            id="edit-template-tab"
                            :class="currentTab === '#edit-template-tab' ? 'active' : ''"
                            class="nav-link fs-6"
                            data-bs-toggle="tab"
                            data-bs-target="#edit-template"
                            type="button"
                            role="tab"
                            aria-controls="edit-template"
                            aria-selected="false"
                            @click="currentTab = '#edit-template-tab'"
                        >
                            <i class="bi bi-pencil-square pe-2" />
                            {{ $t("additional:modules.tools.cosi.templateAdmin.button.editTemplate") }}
                        </button>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div
                        id="add-template"
                        :class="currentTab === '#add-template-tab' ? 'active' : ''"
                        class="tab-pane"
                        role="tabpanel"
                        aria-labelledby="add-template-tab"
                        tabindex="0"
                    >
                        <TemplateAdminForm
                            :geo-data="dataOptions"
                            :stat-data="statOptions"
                            :tool-data="toolOptions"
                        />
                    </div>
                    <div
                        id="edit-template"
                        :class="currentTab === '#edit-template-tab' ? 'active' : ''"
                        class="tab-pane"
                        role="tabpanel"
                        aria-labelledby="edit-template-tab"
                        tabindex="0"
                    >
                        <TemplateAdminForm
                            :geo-data="dataOptions"
                            :stat-data="statOptions"
                            :tool-data="toolOptions"
                            :show-edit-template="true"
                        />
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

.nav-tabs .nav-link.active {
    color: $light_blue;
    font-family: "MasterPortalFont Bold";
    background-color: white;
}

.nav-tabs, .nav-link  {
    background-color: #F3F3F3;
    color: $secondary_icon_button;
}

</style>
