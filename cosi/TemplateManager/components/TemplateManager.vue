<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../../src/utils/getComponent";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersTemplateManager";
import mutations from "../store/mutationsTemplateManager";
import actions from "../store/actionsTemplateManager";
import ToolInfo from "../../components/ToolInfo.vue";
import TemplateManagerImport from "./TemplateManagerImport.vue";
import axios from "axios";
import mapping from "../../assets/mapping.json";
import {getItemsByAttributes, addModelsByAttributes, getModelByAttributes} from "../../utils/radioBridge";
import Multiselect from "vue-multiselect";

export default {
    name: "TemplateManager",
    components: {
        Tool,
        ToolInfo,
        TemplateManagerImport,
        Multiselect
    },
    data () {
        return {
            templates: [],
            selectedTemplateName: false,
            filters: []
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/TemplateManager", Object.keys(getters)),
        ...mapGetters("Tools/SaveSession", []),
        ...mapGetters("Tools/DistrictSelector", ["districtLevels"]),

        /**
         * Checks whether at least one template is available.
         * @returns {Boolean} True if it is.
         */
        hasTemplates () {
            return this.templates.length > 0;
        },

        /**
         * Gets the current selected template.
         * @returns {Object} The selected template.
         */
        selectedTemplate () {
            return this.templates.find(template => template.meta.title === this.selectedTemplateName);
        },

        /**
         * Gets the index of the selected template.
         * @returns {Number} The index.
         */
        selectedTemplateIndex () {
            return this.templates.findIndex(template => template.meta.title === this.selectedTemplateName);
        },

        /**
         * Gets the titles of all templates.
         * @returns {String[]} The titles.
         */
        templateTitles () {
            return this.templates.map(template => template.meta.title);
        }
    },
    watch: {
        /**
         * Unselect the Menu item if the tool is deactivated
         * @param {boolean} state - Defines if the tool is active.
         * @returns {void}
         */
        active (state) {
            if (!state) {
                const model = getComponent(this.id);

                if (model) {
                    model.set("isActive", false);
                }
            }
        },
        templates: "createFilterObjects"
    },
    created () {
        /**
         * listens to the close event of the Tool Component
         * @listens #close
         */
        this.$on("close", () => {
            this.setActive(false);
        });
    },
    mounted () {
        this.loadTemplates();
    },
    methods: {
        ...mapMutations("Tools/TemplateManager", Object.keys(mutations)),
        ...mapActions("Tools/TemplateManager", Object.keys(actions)),
        ...mapMutations("Tools/DistrictSelector", ["setMapping"]),
        ...mapActions("Tools/SaveSession", ["loadSessionData"]),

        /**
         * Load templates from paths defined in config.json
         * @async
         * @returns {void}
         */
        async loadTemplates () {
            let path, res;
            const templates = [];

            for (const filename of this.templateFiles) {
                path = `${this.templatePath}/${filename}.json`;

                try {
                    res = await axios(path);
                    res = await res.data;
                    templates.push(res);
                }
                catch (e) {
                    console.warn(`Template at ${path} could not be loaded. Please check that it is a valid JSON file.`);
                }
            }

            this.templates = templates;
            this.selectedTemplateName = this.templates[0].meta.title;
        },

        createFilterObjects () {
            this.filters = this.templates.map(template => ({
                name: template.meta.title,
                activeLayerList: Object.fromEntries(this.getActiveLayerList(template).map(el => [el.id, true])),
                selectedDistrictNames: Object.fromEntries(this.getSelectedDistricts(template).map(el => [el, true])),
                statsCategories: Object.fromEntries(this.getStatsCategories(template).map(el => [el, true])),
                calculations: Object.fromEntries(this.getCalculations(template).map(el => [el.id, true]))
            }));
        },

        applyFilters (template, filter) {
            const
                _template = JSON.parse(JSON.stringify(template)),
                activeLayerList = Object.keys(filter.activeLayerList).filter(key => filter.activeLayerList[key]),
                selectedDistrictNames = Object.keys(filter.selectedDistrictNames).filter(key => filter.selectedDistrictNames[key]),
                statsCategories = Object.keys(filter.statsCategories).filter(key => filter.statsCategories[key]),
                calculations = this.getCalculations(template).filter(calc => filter.calculations[calc.id]);

            if (_template.state.Maps?.layerIds) {
                _template.state.Maps.layerIds = activeLayerList;
            }
            if (_template.state.Tools.DistrictSelector?.selectedDistrictNames) {
                _template.state.Tools.DistrictSelector.selectedDistrictNames = selectedDistrictNames;
            }
            if (_template.state.Tools.Dashboard?.statsFeatureFilter) {
                _template.state.Tools.Dashboard.statsFeatureFilter = statsCategories;
            }
            if (_template.state.Tools.Dashboard?.calculations) {
                _template.state.Tools.Dashboard.calculations = calculations;
            }

            return _template;
        },

        loadFromTemplate (template, index) {
            template.meta.isActive = true;

            const _template = this.applyFilters(template, this.filters[index]),
                startingTool = template?.state?.Tools?.toolToOpen;

            if (this.useTemplatesForMapping) {
                template.meta.time = new Date().getTime();
                this.createMappingByTemplates(this.templates, mapping);
            }

            this.loadSessionData(_template);
            this.setActive(false);
            this.openTool(startingTool);
            this.loadLayer(_template?.state?.Maps?.layerIds);

        },

        /**
         * Loading the layers from id
         * @param {String[]} layerIds The layer Id list
         * @returns {void}
         */
        loadLayer (layerIds) {
            if (Array.isArray(layerIds) && layerIds.length) {
                layerIds.forEach(layerId => {
                    if (!getModelByAttributes({id: layerId})) {
                        addModelsByAttributes({id: layerId});
                    }

                    const model = getModelByAttributes({id: layerId});

                    if (model) {
                        model.set("isSelected", true);
                    }
                });
            }
        },

        /**
         * Opening a tool after loading the template
         * @param {String} startingTool - the starting tool to open after loading the template
         * @returns {void}
         */
        openTool (startingTool) {
            if (typeof startingTool === "string") {
                this.$store.dispatch("Tools/setToolActive", {id: startingTool, active: true});
            }
            else if (typeof this.toolToOpen === "string") {
                this.$store.dispatch("Tools/setToolActive", {id: this.toolToOpen, active: true});
            }
        },

        getActiveLayerList (template) {
            return getItemsByAttributes({typ: "WFS"})
                ?.filter(layer => (template.state?.Maps?.layerIds || []).includes(layer.id)) || [];
        },

        getActiveTool (template) {
            const id = Object.entries(template.state.Tools).find(tool => tool[1].active)?.[0];

            return this.$store.getters[`Tools/${id}/name`];
        },

        getActiveDistrictLevel (template) {
            const layerId = template?.state?.Tools?.DistrictSelector?.selectedDistrictLevelId;

            return this.districtLevels?.find(districtLevel => districtLevel.layerId === layerId)?.label;
        },

        getSelectedDistricts (template) {
            return template?.state?.Tools?.DistrictSelector?.selectedDistrictNames || [];
        },

        getStatsCategories (template) {
            return template?.state?.Tools?.Dashboard?.statsFeatureFilter || [];
        },

        getInitTool (template) {
            return template?.state?.Tools?.toolToOpen;
        },

        getCalculations (template) {
            return template?.state?.Tools?.Dashboard?.calculations || [];
        },

        /**
         * Adds a template to the list of templates.
         * @param {Object} template - The template to add.
         * @returns {void}
         */
        addTemplate (template) {
            this.templates.push(template);
            this.selectedTemplateName = template.meta.title;
        },

        /*
         * Creates a new mapping based on the statistical data in the templates.
         * The name of the template is used as the name of the group.
         * @param {Object[]} templates - All available templates.
         * @param {Object[]} initMapping - The mapping array for statistical data.
         * @returns {void}
         */
        createMappingByTemplates (templates, initMapping) {
            const activeTemplates = templates.filter(template => template.meta.isActive),
                sortedTemplates = activeTemplates.sort((a, b) => b.meta.time - a.meta.time),
                newMapping = [];

            sortedTemplates.forEach(template => {
                const filterForTemplate = this.filters.find(filter => filter.name === template.meta.title),
                    _template = this.applyFilters(template, filterForTemplate),
                    statsFeatures = _template.state?.Tools?.Dashboard?.statsFeatureFilter,
                    orientationValues = _template.state?.Tools?.Dashboard?.orientationValues;

                if (statsFeatures) {
                    statsFeatures.forEach(statName => {
                        const mappingObject = initMapping.find(obj => obj.value === statName),
                            newMappingObject = {};

                        if (mappingObject) {
                            Object.assign(newMappingObject, mappingObject);
                            newMappingObject.value = statName;
                            newMappingObject.group = template.meta.title;
                            if (orientationValues && Array.isArray(orientationValues) && orientationValues.length > 0) {
                                newMappingObject.orientationValue = this.getOrientationValueByStatistic(orientationValues, statName);
                            }
                            newMapping.push(newMappingObject);
                        }
                    });
                }
                else {
                    initMapping.forEach(mapp => {
                        const newMappingObject = Object.assign({}, mapp);

                        newMappingObject.group = template.meta.title;
                        newMapping.push(newMappingObject);
                    });
                }
            });

            if (newMapping.length > 0) {
                this.setMapping(newMapping);
            }
        },

        /**
         * Gets the orientation value for a statistic.
         * @param {Object[]} orientationValues - The orientation values.
         * @param {String} stat - The statistic for which the value is looked for.
         * @returns {String} The value of the statistic or "-" if none is available.
         */
        getOrientationValueByStatistic (orientationValues, stat) {
            return orientationValues.find(orientation => orientation.statisticName === stat)?.value || "-";

        }
    }
};
</script>

<template lang="html">
    <Tool
        ref="tool"
        :title="$t('additional:modules.tools.cosi.templateManager.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="700"
    >
        <template
            v-if="active"
            #toolBody
        >
            <div
                id="template-manager"
                class="container"
            >
                <ToolInfo
                    :url="readmeUrl"
                    :locale="currentLocale"
                    :summary="$t('additional:modules.tools.cosi.templateManager.infoLoadFromTemplates')"
                />
                <TemplateManagerImport
                    v-if="useImport"
                    @addTemplate="addTemplate"
                />
                <label
                    class="col col-md form-label p-0 m-0"
                    for="select-template"
                >
                    {{ $t("additional:modules.tools.cosi.templateManager.label.selectTemplate") }}
                </label>
                <Multiselect
                    v-if="hasTemplates"
                    id="select-template"
                    v-model="selectedTemplateName"
                    class="mb-4"
                    :options="templateTitles"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="true"
                    :multiple="false"
                    :placeholder="$t('additional:modules.tools.cosi.templateManager.label.selectTemplate')"
                />
                <div class="mb-4">
                    <label for="selected-template-created">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.created") }}
                    </label>
                    <p id="selected-template-created">
                        {{ selectedTemplate?.meta?.created || $t('additional:modules.tools.cosi.templateManager.noInfo') }}
                    </p>
                </div>
                <div class="mb-4">
                    <label for="selected-template-title">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.name") }}
                    </label>
                    <p id="selected-template-title">
                        {{ selectedTemplate?.meta?.title || $t('additional:modules.tools.cosi.templateManager.noInfo') }}
                    </p>
                </div>
                <div
                    v-if="selectedTemplate?.meta?.info"
                    class="mb-4"
                >
                    <label for="selected-template-description">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.description") }}
                    </label>
                    <p id="selected-template-description">
                        {{ selectedTemplate?.meta?.info }}
                    </p>
                </div>
                <div
                    v-if="getActiveLayerList(selectedTemplate).length > 0"
                    class="mb-4"
                >
                    <label for="selected-template-layer">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.layers") }}
                    </label>
                    <div id="selected-template-layer">
                        <v-chip
                            v-for="layerMap in getActiveLayerList(selectedTemplate)"
                            :key="selectedTemplate.meta.title + layerMap.id"
                            class="m-1"
                            small
                        >
                            {{ layerMap.name }}
                            <v-checkbox
                                v-model="filters[selectedTemplateIndex].activeLayerList[layerMap.id]"
                                small
                            />
                        </v-chip>
                    </div>
                </div>
                <div
                    v-if="getActiveDistrictLevel(selectedTemplate)"
                    class="mb-4"
                >
                    <label for="selected-template-level">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.districtLevel") }}
                    </label>
                    <p id="selected-template-level">
                        {{ getActiveDistrictLevel(selectedTemplate) }}
                    </p>
                </div>
                <div
                    v-if="getSelectedDistricts(selectedTemplate).length > 0"
                    class="mb-4"
                >
                    <label for="selected-template-districts">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.selectedDistricts") }}
                    </label>
                    <div id="selected-template-districts">
                        <v-chip
                            v-for="districtName in getSelectedDistricts(selectedTemplate)"
                            :key="selectedTemplate.meta.title + districtName"
                            class="m-1"
                            small
                        >
                            {{ districtName }}
                            <v-checkbox
                                v-model="filters[selectedTemplateIndex].selectedDistrictNames[districtName]"
                                small
                            />
                        </v-chip>
                    </div>
                </div>
                <div
                    v-if="getStatsCategories(selectedTemplate).length > 0"
                    class="mb-4"
                >
                    <label for="selected-template-statistics">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.categories") }}
                    </label>
                    <div id="selected-template-statistics">
                        <v-chip
                            v-for="category in getStatsCategories(selectedTemplate)"
                            :key="selectedTemplate.meta.title + category"
                            class="m-1"
                            small
                        >
                            {{ category }}
                            <v-checkbox
                                v-model="filters[selectedTemplateIndex].statsCategories[category]"
                                small
                            />
                        </v-chip>
                    </div>
                </div>
                <div
                    v-if="getInitTool(selectedTemplate)"
                    class="mb-4"
                >
                    <label for="selected-template-tool">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.addTool") }}
                    </label>
                    <p id="selected-template-tool">
                        {{ getInitTool(selectedTemplate) }}
                    </p>
                </div>
                <div
                    v-if="getCalculations(selectedTemplate).length > 0"
                    class="mb-4"
                >
                    <label for="selected-template-calculations">
                        {{ $t("additional:modules.tools.cosi.templateManager.label.calculations") }}
                    </label>
                    <div id="selected-template-calculations">
                        <v-chip
                            v-for="(calculation, j) in getCalculations(selectedTemplate)"
                            :key="selectedTemplate.meta.title + 'calculation' + j"
                            class="m-1"
                            small
                        >
                            {{ calculation.id }}
                            <v-checkbox
                                v-model="filters[selectedTemplateIndex].calculations[calculation.id]"
                                small
                            />
                        </v-chip>
                    </div>
                </div>
                <button
                    class="btn btn-outline lh-1 fs-5"
                    @click="loadFromTemplate(selectedTemplate, selectedTemplateIndex)"
                >
                    <i class="bi bi-file-earmark-plus pe-2" />{{ $t("additional:modules.tools.cosi.templateManager.loadFromTemplate") }}
                </button>
            </div>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #template-manager {
        font-family: $font_family_default;

        label {
            color: $dark_grey;
            font-family: $font_family_accent;
        }

        .btn-outline {
            border-color: $light_blue;
            color: $light_blue;
        }
       .btn-outline:hover {
            cursor: pointer;
            background-color: $light_blue;
            color: $white;
       }
    }
</style>

<style lang="scss">
    @import "~variables";

    #template-manager {
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
